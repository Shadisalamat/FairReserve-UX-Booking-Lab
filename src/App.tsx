import React, { useState, useEffect, useCallback } from 'react';
import { UXMode, FunnelStep, Stay, BookingFormState, DisabilitySettings } from './types';
import { MOCK_STAYS, AVAILABLE_ADDONS } from './data/mockStays';
import { UX_CONFLICTS } from './data/uxConflicts';
import { Header } from './components/Header';
import { UXModeBanner } from './components/UXModeBanner';
import { StepIndicator } from './components/StepIndicator';
import { SearchDiscoveryStep } from './components/funnel/SearchDiscoveryStep';
import { PropertyDetailStep } from './components/funnel/PropertyDetailStep';
import { AddOnsStep } from './components/funnel/AddOnsStep';
import { CheckoutStep } from './components/funnel/CheckoutStep';
import { ConfirmationStep } from './components/funnel/ConfirmationStep';
import { UXKnowledgeHub } from './components/UXKnowledgeHub';
import { SimultaneousBookingSimulatorModal } from './components/SimultaneousBookingSimulatorModal';
import { DisabilityAccessibilityBar } from './components/DisabilityAccessibilityBar';
import { ScreenReaderHud } from './components/ScreenReaderHud';
import { UXEffectivenessDashboard } from './components/UXEffectivenessDashboard';
import { ContributionShowcase } from './components/ContributionShowcase';
import { ScreenReaderSimulator } from './components/ScreenReaderSimulator';
import { UXIntelligencePanel } from './components/UXIntelligencePanel';
import { calculateBookingPrice } from './utils/pricing';
import { ShieldCheck, AlertTriangle, Scale, BookOpen, Activity, Star, Award, Monitor, Zap } from 'lucide-react';

const STORAGE_KEY = 'fairreserve_progress';

function loadProgress(): { step?: FunnelStep; form?: Partial<BookingFormState>; stayId?: string; addons?: string[] } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveProgress(step: FunnelStep, form: BookingFormState, stayId: string, addons: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, form, stayId, addons }));
  } catch {}
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

export default function App() {
  const [mode, setMode] = useState<UXMode>('good');
  const [currentStep, setCurrentStep] = useState<FunnelStep>('browse');
  const [selectedStay, setSelectedStay] = useState<Stay>(MOCK_STAYS[0]);
  const [fontScale, setFontScale] = useState<number>(100);
  const [showProgressRestored, setShowProgressRestored] = useState(false);
  const [showHierarchyOverlay, setShowHierarchyOverlay] = useState(false);
  const [isIntelligencePanelOpen, setIsIntelligencePanelOpen] = useState(false);

  // Stay parameters
  const [checkInDate, setCheckInDate] = useState<string>('2026-10-14');
  const [checkOutDate, setCheckOutDate] = useState<string>('2026-10-17');
  const [nights, setNights] = useState<number>(3);
  const [guestCount, setGuestCount] = useState<number>(2);

  // Add-ons: Good UX starts empty (opt-in); Bad UX pre-checks 3 items (sneak into basket)
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Guest & payment form
  const [formState, setFormState] = useState<BookingFormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    salutation: 'Dr.',
    fax: '',
    securityQuestion: '',
    billingPostalCode: '',
    billingStreet: '',
    marketingOptIn: false,
    agreeTerms: true,
    agreePrivacy: true,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    accessibilityRequests: {
      stepFreeRequired: false,
      serviceAnimalAttending: false,
      visualAlertsRequired: false,
      quietSensoryCheckIn: false,
      notes: ''
    }
  });

  // Modal Knowledge Hub
  const [isKnowledgeHubOpen, setIsKnowledgeHubOpen] = useState<boolean>(false);
  // Concurrency Simulation Modal
  const [isSimultaneousModalOpen, setIsSimultaneousModalOpen] = useState<boolean>(false);
  // Disability Accessibility Control Panel Modal
  const [isDisabilityModalOpen, setIsDisabilityModalOpen] = useState<boolean>(false);
  // UX Effectiveness Dashboard Modal
  const [isEffectivenessDashboardOpen, setIsEffectivenessDashboardOpen] = useState<boolean>(false);
  const [isContributionShowcaseOpen, setIsContributionShowcaseOpen] = useState<boolean>(false);
  const [isScreenReaderSimOpen, setIsScreenReaderSimOpen] = useState<boolean>(false);
  const [previousMode, setPreviousMode] = useState<UXMode | null>(null);
  const [autoShowEffectivenessOnSwitch, setAutoShowEffectivenessOnSwitch] = useState<boolean>(true);
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);

  // Live session timer to benchmark real live user time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Progress Save: restore on mount (Very Good UX feature)
  useEffect(() => {
    const saved = loadProgress();
    if (saved && saved.step && saved.step !== 'browse' && saved.step !== 'confirmation') {
      setCurrentStep(saved.step);
      if (saved.form) setFormState(prev => ({ ...prev, ...saved.form }));
      if (saved.stayId) {
        const stay = MOCK_STAYS.find(s => s.id === saved.stayId);
        if (stay) setSelectedStay(stay);
      }
      if (saved.addons) setSelectedAddOnIds(saved.addons);
      setShowProgressRestored(true);
      setTimeout(() => setShowProgressRestored(false), 4000);
    }
  }, []);

  // Progress Save: auto-save on step/form changes (only in good/verygood modes)
  useEffect(() => {
    if (mode === 'good' || mode === 'verygood') {
      saveProgress(currentStep, formState, selectedStay.id, selectedAddOnIds);
    }
  }, [currentStep, formState, selectedStay.id, selectedAddOnIds, mode]);

  // Font scale: apply to document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [fontScale]);

  // Disability & Accessibility Mode Settings
  const [disabilitySettings, setDisabilitySettings] = useState<DisabilitySettings>({
    enabled: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    dyslexicFont: false,
    screenReaderHelper: false,
    motorAssistance: false,
    mobilityFilter: 'all',
  });

  // Handle adopting alternative stay after concurrency collision
  const handleAdoptAlternativeStay = (stay: Stay, datesShifted?: boolean) => {
    setSelectedStay(stay);
    if (datesShifted) {
      setCheckInDate('2026-10-15');
      setCheckOutDate('2026-10-18');
    }
  };

  // Switch UX Mode and adjust default parameters
  const handleModeChange = (newMode: UXMode) => {
    if (newMode === mode) {
      // Re-open effectiveness dashboard if clicked current active mode
      setIsEffectivenessDashboardOpen(true);
      return;
    }
    const prior = mode;
    setPreviousMode(prior);
    setMode(newMode);
    if (newMode === 'bad') {
      // Pre-check 3 add-ons to demonstrate sneak into basket
      setSelectedAddOnIds(['addon-protection', 'addon-clean', 'addon-flex']);
    } else {
      // Clean slate for good & verygood UX
      setSelectedAddOnIds([]);
    }
    // Trigger UX Effectiveness Dashboard overlay when switching modes
    if (autoShowEffectivenessOnSwitch) {
      setIsEffectivenessDashboardOpen(true);
    }
  };

  // Add-on toggle
  const handleToggleAddOn = (addonId: string) => {
    setSelectedAddOnIds(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  // Navigate step with form preservation (Very Good) or wipe (Bad)
  const handleNavigateStep = useCallback((step: FunnelStep) => {
    if (mode === 'bad') {
      // Bad UX: wipe form data when going back
      const order: FunnelStep[] = ['browse', 'details', 'addons', 'checkout', 'confirmation'];
      const currentIdx = order.indexOf(currentStep);
      const targetIdx = order.indexOf(step);
      if (targetIdx < currentIdx) {
        setFormState(prev => ({
          ...prev,
          firstName: '', lastName: '', email: '', phone: '',
          cardNumber: '', cardExpiry: '', cardCvc: '',
        }));
      }
    }
    setCurrentStep(step);
  }, [mode, currentStep]);

  // Reset entire flow
  const handleReset = () => {
    setCurrentStep('browse');
    setSelectedStay(MOCK_STAYS[0]);
    setCheckInDate('2026-10-14');
    setCheckOutDate('2026-10-17');
    setNights(3);
    setGuestCount(2);
    setSelectedAddOnIds(mode === 'bad' ? ['addon-protection', 'addon-clean', 'addon-flex'] : []);
    setFormState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      salutation: 'Dr.',
      fax: '',
      securityQuestion: '',
      billingPostalCode: '',
      billingStreet: '',
      marketingOptIn: false,
      agreeTerms: true,
      agreePrivacy: true,
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      accessibilityRequests: {
        stepFreeRequired: false,
        serviceAnimalAttending: false,
        visualAlertsRequired: false,
        quietSensoryCheckIn: false,
        notes: ''
      }
    });
    clearProgress();
  };

  const handleFormChange = (updated: Partial<BookingFormState>) => {
    setFormState(prev => ({ ...prev, ...updated }));
  };

  const canNavigateTo = (target: FunnelStep): boolean => {
    const order: FunnelStep[] = ['browse', 'details', 'addons', 'checkout', 'confirmation'];
    const currentIdx = order.indexOf(currentStep);
    const targetIdx = order.indexOf(target);
    return targetIdx <= currentIdx;
  };

  const pricing = calculateBookingPrice(
    selectedStay,
    nights,
    selectedAddOnIds,
    AVAILABLE_ADDONS,
    mode === 'bad' ? 'bad' : 'good'
  );

  // Disability / Accessibility Classes
  const a11yClasses = [
    disabilitySettings.enabled ? 'a11y-enabled' : '',
    disabilitySettings.highContrast ? 'a11y-high-contrast' : '',
    disabilitySettings.largeText ? 'a11y-large-text' : '',
    disabilitySettings.reducedMotion ? 'a11y-reduced-motion' : '',
    disabilitySettings.dyslexicFont ? 'a11y-dyslexia' : '',
    disabilitySettings.motorAssistance ? 'a11y-motor-assistance' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white ${a11yClasses} ${showHierarchyOverlay ? 'hierarchy-overlay' : ''}`}>
      
      {/* Progress Restored Toast (Very Good UX) */}
      {showProgressRestored && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-violet-600 text-white px-5 py-2.5 rounded-xl shadow-lg text-sm font-semibold flex items-center space-x-2 animate-pulse-subtle">
          <span>✓ Progress restored — continuing from where you left off</span>
          <button onClick={() => { setShowProgressRestored(false); handleReset(); }} className="ml-2 underline text-xs opacity-80 hover:opacity-100">Start over</button>
        </div>
      )}

      {/* 1. Global Header with UX Mode Switcher */}
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        currentStep={currentStep}
        onReset={handleReset}
        onOpenKnowledgeHub={() => setIsKnowledgeHubOpen(true)}
        onOpenSimultaneousSimulator={() => setIsSimultaneousModalOpen(true)}
        onOpenEffectivenessDashboard={() => setIsEffectivenessDashboardOpen(true)}
        onOpenContributionShowcase={() => setIsContributionShowcaseOpen(true)}
        disabilitySettings={disabilitySettings}
        onOpenDisabilityBar={() => setIsDisabilityModalOpen(true)}
        activeConflictsCount={UX_CONFLICTS.length}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
      />

      {/* 2. Live Diagnostic Mode Banner & Dark Pattern Indicator */}
      <UXModeBanner
        mode={mode}
        currentStep={currentStep}
        onOpenConflictModal={() => setIsKnowledgeHubOpen(true)}
        onSwitchMode={handleModeChange}
        onOpenEffectivenessDashboard={() => setIsEffectivenessDashboardOpen(true)}
        disabilitySettings={disabilitySettings}
        onOpenDisabilityBar={() => setIsDisabilityModalOpen(true)}
      />

      {/* 3. Funnel Step Progress Bar */}
      <StepIndicator
        currentStep={currentStep}
        mode={mode}
        onNavigateStep={handleNavigateStep}
        canNavigateTo={canNavigateTo}
      />

      {/* 4. Active Step Content */}
      <main className="flex-1">
        {currentStep === 'browse' && (
          <SearchDiscoveryStep
            stays={MOCK_STAYS}
            selectedStay={selectedStay}
            onSelectStay={stay => setSelectedStay(stay)}
            onProceed={() => setCurrentStep('details')}
            mode={mode}
            onOpenConflictModal={() => setIsKnowledgeHubOpen(true)}
            disabilitySettings={disabilitySettings}
            onOpenDisabilityBar={() => setIsDisabilityModalOpen(true)}
          />
        )}

        {currentStep === 'details' && (
          <PropertyDetailStep
            stay={selectedStay}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onDatesChange={(inDate, outDate, n) => {
              setCheckInDate(inDate);
              setCheckOutDate(outDate);
              setNights(n);
            }}
            guestCount={guestCount}
            onGuestCountChange={setGuestCount}
            onProceed={() => setCurrentStep('addons')}
            mode={mode}
            onOpenConflictModal={() => setIsKnowledgeHubOpen(true)}
            onOpenSimultaneousSimulator={() => setIsSimultaneousModalOpen(true)}
            disabilitySettings={disabilitySettings}
            onOpenDisabilityBar={() => setIsDisabilityModalOpen(true)}
          />
        )}

        {currentStep === 'addons' && (
          <AddOnsStep
            stay={selectedStay}
            nights={nights}
            availableAddOns={AVAILABLE_ADDONS}
            selectedAddOnIds={selectedAddOnIds}
            onToggleAddOn={handleToggleAddOn}
            onProceed={() => setCurrentStep('checkout')}
            mode={mode}
            onOpenConflictModal={() => setIsKnowledgeHubOpen(true)}
          />
        )}

        {currentStep === 'checkout' && (
          <CheckoutStep
            stay={selectedStay}
            nights={nights}
            selectedAddOnIds={selectedAddOnIds}
            availableAddOns={AVAILABLE_ADDONS}
            formState={formState}
            onFormChange={handleFormChange}
            onCompleteBooking={() => setCurrentStep('confirmation')}
            mode={mode}
            onOpenConflictModal={() => setIsKnowledgeHubOpen(true)}
            onOpenSimultaneousSimulator={() => setIsSimultaneousModalOpen(true)}
            onAdoptAlternativeStay={handleAdoptAlternativeStay}
            disabilitySettings={disabilitySettings}
            onOpenDisabilityBar={() => setIsDisabilityModalOpen(true)}
          />
        )}

        {currentStep === 'confirmation' && (
          <ConfirmationStep
            stay={selectedStay}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            nights={nights}
            guestName={formState.firstName ? `${formState.firstName} ${formState.lastName}` : 'Elena Vance'}
            totalPaid={pricing.grandTotal}
            mode={mode}
            onReset={handleReset}
            onOpenConflictModal={() => setIsKnowledgeHubOpen(true)}
          />
        )}
      </main>

      {/* 5. Interactive Knowledge Hub Modal */}
      <UXKnowledgeHub
        isOpen={isKnowledgeHubOpen}
        onClose={() => setIsKnowledgeHubOpen(false)}
        onJumpToStep={step => setCurrentStep(step)}
        mode={mode}
        onSwitchMode={handleModeChange}
      />

      {/* 6. Simultaneous Booking Simulator Modal (Race Condition Lab) */}
      <SimultaneousBookingSimulatorModal
        isOpen={isSimultaneousModalOpen}
        onClose={() => setIsSimultaneousModalOpen(false)}
        currentStay={selectedStay}
        onAdoptAlternativeStay={handleAdoptAlternativeStay}
        initialMode={mode}
      />

      {/* 7. Disability & Accessibility Control Panel Modal */}
      <DisabilityAccessibilityBar
        isOpen={isDisabilityModalOpen}
        onClose={() => setIsDisabilityModalOpen(false)}
        settings={disabilitySettings}
        onUpdateSettings={setDisabilitySettings}
        mode={mode}
      />

      {/* 8. Live Screen Reader Narration HUD (WCAG simulation) */}
      {disabilitySettings.enabled && disabilitySettings.screenReaderHelper && (
        <ScreenReaderHud
          mode={mode}
          currentStep={currentStep}
          onClose={() => setDisabilitySettings(prev => ({ ...prev, screenReaderHelper: false }))}
        />
      )}

      {/* 9. UX Effectiveness Dashboard (Time-on-Task, Error Rates, Sentiment) */}
      <UXEffectivenessDashboard
        isOpen={isEffectivenessDashboardOpen}
        onClose={() => setIsEffectivenessDashboardOpen(false)}
        currentMode={mode}
        previousMode={previousMode}
        onSwitchMode={handleModeChange}
        autoShowOnSwitch={autoShowEffectivenessOnSwitch}
        onToggleAutoShow={setAutoShowEffectivenessOnSwitch}
        sessionElapsedSeconds={sessionElapsedSeconds}
        currentStep={currentStep}
      />

      {/* 10. Screen Reader Simulator (Member 3) */}
      <ScreenReaderSimulator
        isOpen={isScreenReaderSimOpen}
        onClose={() => setIsScreenReaderSimOpen(false)}
        mode={mode}
        currentStep={currentStep}
        onSwitchMode={handleModeChange}
      />

      {/* 11. My Contribution Showcase */}
      <ContributionShowcase
        isOpen={isContributionShowcaseOpen}
        onClose={() => setIsContributionShowcaseOpen(false)}
        onSwitchMode={handleModeChange}
      />

      {/* 12. UX Intelligence Panel */}
      <UXIntelligencePanel
        isOpen={isIntelligencePanelOpen}
        onClose={() => setIsIntelligencePanelOpen(false)}
        currentMode={mode}
        currentStep={currentStep}
        onSwitchMode={handleModeChange}
      />

      {/* 11. Footer with Quick UX Conflict Jump Bar */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              FR
            </div>
            <span className="font-semibold text-slate-800">FairReserve UX Conflict Laboratory</span>
            <span>•</span>
            <span>Ethical Design vs Dark Patterns</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsIntelligencePanelOpen(true)}
              className="text-slate-100 hover:text-white font-bold flex items-center space-x-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 rounded-lg border border-violet-400 shadow-md hover:shadow-lg transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>UX Intelligence</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsContributionShowcaseOpen(true)}
              className="text-violet-900 hover:text-violet-950 font-bold flex items-center space-x-1 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-violet-600" />
              <span>My Contribution</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsEffectivenessDashboardOpen(true)}
              className="text-indigo-900 hover:text-indigo-950 font-bold flex items-center space-x-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>📊 UX Effectiveness Dashboard</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsScreenReaderSimOpen(true)}
              className="text-cyan-800 hover:text-cyan-950 font-bold flex items-center space-x-1 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 shadow-xs"
            >
              <Monitor className="w-3.5 h-3.5 text-cyan-600" />
              <span>🔊 Screen Reader Simulator</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDisabilityModalOpen(true)}
              className="text-sky-800 hover:text-sky-950 font-bold flex items-center space-x-1 bg-sky-50 px-2 py-0.5 rounded border border-sky-200"
            >
              <span>♿ Disability &amp; Accessibility Lab</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSimultaneousModalOpen(true)}
              className="text-amber-800 hover:text-amber-950 font-bold flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
            >
              <span>⚡ Test Simultaneous 2-Guest Booking</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsKnowledgeHubOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore All 8 Booking UX Conflicts</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHierarchyOverlay(prev => !prev)}
              className={`font-bold flex items-center space-x-1 px-2 py-0.5 rounded border shadow-xs ${
                showHierarchyOverlay
                  ? 'bg-red-100 text-red-800 border-red-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span>{showHierarchyOverlay ? '🔴' : '👁'} Visual Hierarchy</span>
            </button>
            <span>•</span>
            <button
              onClick={() => handleModeChange(mode === 'good' ? 'bad' : mode === 'bad' ? 'verygood' : 'good')}
              className="text-slate-700 hover:text-slate-900 font-semibold"
            >
              Toggle UX Mode ({mode === 'verygood' ? 'VERY GOOD' : mode.toUpperCase()})
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
