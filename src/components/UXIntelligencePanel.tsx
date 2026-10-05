import React, { useState, useMemo } from 'react';
import { UXMode, FunnelStep } from '../types';
import {
  X, Brain, Heart, Search, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Zap, Star,
  ChevronRight, BarChart3, Eye, Sparkles
} from 'lucide-react';

interface UXIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: UXMode;
  currentStep: FunnelStep;
  onSwitchMode: (mode: UXMode) => void;
}

type PanelTab = 'cognitive' | 'emotion' | 'scanner' | 'money';

// Cognitive load factors per step per mode
const COGNITIVE_DATA: Record<string, { bad: number; good: number; verygood: number; factors: { bad: string[]; good: string[]; verygood: string[] } }> = {
  browse: {
    bad: 72, good: 28, verygood: 18,
    factors: {
      bad: ['Fake urgency counters', 'Bait pricing ($89 shown, $240 real)', 'Unlabelled images', '"Only 1 left!" pressure', 'No filter accessibility'],
      good: ['Clear pricing upfront', 'Honest availability', 'Accessible filters'],
      verygood: ['aria-label on all cards', 'Keyboard navigation', 'Screen reader descriptions'],
    }
  },
  details: {
    bad: 81, good: 31, verygood: 22,
    factors: {
      bad: ['MM/DD/YYYY text input (no calendar)', 'Vague error messages', 'Fake "38 viewers" counter', 'No date validation', 'Timer pressure'],
      good: ['Visual range calendar', 'Clear date selection', 'Price per night on dates'],
      verygood: ['aria-live date changes', 'Auto-fix invalid dates', 'Reading time estimate'],
    }
  },
  addons: {
    bad: 89, good: 25, verygood: 15,
    factors: {
      bad: ['3 add-ons pre-checked (sneak basket)', 'Confirmshaming opt-out text', 'Service animal surcharge ($60 illegal)', 'Hidden total changes'],
      good: ['All opt-in only', 'Clear descriptions', 'Honest pricing'],
      verygood: ['tabIndex keyboard selection', 'aria-live total updates', 'role="checkbox" with aria-checked'],
    }
  },
  checkout: {
    bad: 95, good: 35, verygood: 20,
    factors: {
      bad: ['12 mandatory fields (fax, security Q)', '2:45 timer pressure', 'No autofill', 'Card wiped on error', 'Hidden $75 cleaning fee', 'Pre-checked marketing'],
      good: ['4 essential fields', 'No timer', 'Clear validation'],
      verygood: ['htmlFor bindings', 'inputMode keyboards', 'autoComplete autofill', 'Progress saved on close'],
    }
  },
  confirmation: {
    bad: 68, good: 12, verygood: 8,
    factors: {
      bad: ['Aggressive $50 cashback popup (subscription trap)', 'Unclear booking code', 'No calendar export', 'Upsell bombardment'],
      good: ['Clear confirmation', 'Booking code', 'Calendar export'],
      verygood: ['Accessible confirmation dialog', 'aria-live announcement', 'Keyboard-accessible actions'],
    }
  },
};

// Emotion journey data
const EMOTION_JOURNEY: { step: string; label: string; bad: { emoji: string; label: string; event: string }; good: { emoji: string; label: string; event: string }; verygood: { emoji: string; label: string; event: string } }[] = [
  {
    step: 'browse', label: 'Search',
    bad: { emoji: '😊', label: 'Hopeful', event: 'Sees low bait price $89/night' },
    good: { emoji: '😊', label: 'Confident', event: 'Sees real price $240/night upfront' },
    verygood: { emoji: '😊', label: 'Welcomed', event: 'Screen reader: "3 accessible stays, keyboard nav ready"' },
  },
  {
    step: 'details', label: 'Dates',
    bad: { emoji: '😰', label: 'Anxious', event: '"38 travelers viewing!" + confusing date format' },
    good: { emoji: '😊', label: 'Relaxed', event: 'Visual calendar with price per night' },
    verygood: { emoji: '😌', label: 'Guided', event: 'Date auto-correction + "~45s estimated"' },
  },
  {
    step: 'addons', label: 'Add-Ons',
    bad: { emoji: '😡', label: 'Angry', event: '$156 pre-checked add-ons discovered + $60 service animal fee' },
    good: { emoji: '😌', label: 'In Control', event: 'All opt-in, clear descriptions' },
    verygood: { emoji: '😊', label: 'Empowered', event: 'Keyboard toggles + live total spoken aloud' },
  },
  {
    step: 'checkout', label: 'Payment',
    bad: { emoji: '😤', label: 'Frustrated', event: 'Timer + 12 fields + card wiped on error + hidden fee' },
    good: { emoji: '😊', label: 'Smooth', event: '4 fields, clear validation' },
    verygood: { emoji: '🤩', label: 'Delighted', event: 'One-tap autofill + progress saved + mobile keyboard hints' },
  },
  {
    step: 'confirmation', label: 'Done',
    bad: { emoji: '😤', label: 'Trapped', event: '$39/month subscription popup disguised as cashback' },
    good: { emoji: '😄', label: 'Satisfied', event: 'Clear booking code + calendar export' },
    verygood: { emoji: '🤩', label: 'Loyal', event: 'Accessible confirmation + zero upsells + instant export' },
  },
];

// Dark pattern taxonomy for scanner
const DARK_PATTERNS: { name: string; step: FunnelStep; category: string; severity: 'critical' | 'high' | 'medium'; description: string; wcagViolation: string; fixedIn: 'good' | 'verygood' }[] = [
  { name: 'Bait & Switch Pricing', step: 'browse', category: 'Drip Pricing', severity: 'critical', description: 'Shows $89/night in search, actual price $240/night revealed later', wcagViolation: 'FTC Act §5', fixedIn: 'good' },
  { name: 'Fake Scarcity Counter', step: 'browse', category: 'Urgency', severity: 'high', description: '"Only 1 left!" when inventory is not actually scarce', wcagViolation: 'Nielsen #1 (Visibility)', fixedIn: 'good' },
  { name: 'Sneak Into Basket', step: 'addons', category: 'Forced Action', severity: 'critical', description: '3 add-ons pre-checked totaling $156 without consent', wcagViolation: 'FTC Dark Patterns Report 2022', fixedIn: 'good' },
  { name: 'Confirmshaming', step: 'addons', category: 'Social Engineering', severity: 'high', description: '"No thanks, I don\'t want to protect my trip" opt-out text', wcagViolation: 'Nielsen #6 (Recognition)', fixedIn: 'good' },
  { name: 'Service Animal Surcharge', step: 'addons', category: 'Discrimination', severity: 'critical', description: '$60 fee for service animals — violates ADA Title III', wcagViolation: 'ADA Title III / EAA 2025', fixedIn: 'good' },
  { name: 'Hidden Cleaning Fee', step: 'checkout', category: 'Drip Pricing', severity: 'critical', description: '$75 fee revealed only at final checkout step', wcagViolation: 'EU Consumer Rights Directive', fixedIn: 'good' },
  { name: 'Forced Timeout', step: 'checkout', category: 'Urgency', severity: 'high', description: '2:45 countdown timer on payment form — no extension option', wcagViolation: 'WCAG 2.2.1 (A)', fixedIn: 'good' },
  { name: 'Form Data Destruction', step: 'checkout', category: 'Hostile Design', severity: 'high', description: 'Card number and personal data wiped on validation error', wcagViolation: 'Nielsen #5 (Error Prevention)', fixedIn: 'good' },
  { name: 'Subscription Trap', step: 'confirmation', category: 'Forced Continuity', severity: 'critical', description: '"$50 cashback" popup secretly signs up for $39/month club', wcagViolation: 'FTC ROSCA Act', fixedIn: 'good' },
  { name: 'Missing aria-live', step: 'checkout', category: 'Accessibility', severity: 'medium', description: 'Price changes not announced to screen readers', wcagViolation: 'WCAG 4.1.3 (AA)', fixedIn: 'verygood' },
  { name: 'No htmlFor Bindings', step: 'checkout', category: 'Accessibility', severity: 'medium', description: 'Labels not linked to inputs — screen readers say "edit text"', wcagViolation: 'WCAG 1.3.1 (A)', fixedIn: 'verygood' },
  { name: 'No Keyboard Navigation', step: 'addons', category: 'Accessibility', severity: 'medium', description: 'Add-on cards not focusable via Tab key', wcagViolation: 'WCAG 2.1.1 (A)', fixedIn: 'verygood' },
];

// Money calculator data
const MONEY_DATA = {
  monthlyVisitors: 10000,
  avgBookingValue: 240,
  bad: { funnelCompletion: 0.231, chargebackRate: 0.042, supportCostPerBooking: 12, legalRiskAnnual: 50000 },
  good: { funnelCompletion: 0.784, chargebackRate: 0.004, supportCostPerBooking: 3, legalRiskAnnual: 0 },
  verygood: { funnelCompletion: 0.842, chargebackRate: 0.002, supportCostPerBooking: 1.5, legalRiskAnnual: 0 },
};

function getCognitiveColor(load: number): string {
  if (load <= 25) return 'text-emerald-600';
  if (load <= 50) return 'text-amber-500';
  if (load <= 75) return 'text-orange-500';
  return 'text-rose-600';
}

function getCognitiveBarColor(load: number): string {
  if (load <= 25) return 'bg-emerald-500';
  if (load <= 50) return 'bg-amber-400';
  if (load <= 75) return 'bg-orange-500';
  return 'bg-rose-500';
}

function getCognitiveLabel(load: number): string {
  if (load <= 20) return 'Effortless';
  if (load <= 35) return 'Low';
  if (load <= 55) return 'Moderate';
  if (load <= 75) return 'High';
  return 'Overloaded';
}

export const UXIntelligencePanel: React.FC<UXIntelligencePanelProps> = ({
  isOpen, onClose, currentMode, currentStep, onSwitchMode
}) => {
  const [activeTab, setActiveTab] = useState<PanelTab>('cognitive');
  const [scanRunning, setScanRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const tabs: { id: PanelTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'cognitive', label: 'Cognitive Load', icon: Brain, color: 'violet' },
    { id: 'emotion', label: 'Emotion Journey', icon: Heart, color: 'rose' },
    { id: 'scanner', label: 'Dark Pattern Scanner', icon: Search, color: 'amber' },
    { id: 'money', label: 'Money Lost', icon: DollarSign, color: 'emerald' },
  ];

  // Money calculations
  const moneyCalc = useMemo(() => {
    const calc = (d: typeof MONEY_DATA.bad) => {
      const bookings = MONEY_DATA.monthlyVisitors * d.funnelCompletion * 12;
      const revenue = bookings * MONEY_DATA.avgBookingValue;
      const chargebacks = revenue * d.chargebackRate;
      const support = bookings * d.supportCostPerBooking;
      return { bookings, revenue, chargebacks, support, legal: d.legalRiskAnnual, net: revenue - chargebacks - support - d.legalRiskAnnual };
    };
    return { bad: calc(MONEY_DATA.bad), good: calc(MONEY_DATA.good), verygood: calc(MONEY_DATA.verygood) };
  }, []);

  const runScan = () => {
    setScanRunning(true);
    setScanComplete(false);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setScanRunning(false);
        setScanComplete(true);
      }
      setScanProgress(Math.min(100, Math.round(p)));
    }, 200);
  };

  if (!isOpen) return null;

  const stepKey = currentStep === 'confirmation' ? 'confirmation' : currentStep;
  const cogData = COGNITIVE_DATA[stepKey] || COGNITIVE_DATA.browse;

  const modePatterns = DARK_PATTERNS.filter(p => {
    if (currentMode === 'bad') return true;
    if (currentMode === 'good') return p.fixedIn === 'verygood';
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white">UX Intelligence Panel</h2>
                <p className="text-xs text-slate-400">
                  Cognitive Load • Emotion Journey • Dark Pattern Scanner • Financial Impact
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                currentMode === 'bad' ? 'bg-rose-500/20 text-rose-300' :
                currentMode === 'verygood' ? 'bg-violet-500/20 text-violet-300' :
                'bg-emerald-500/20 text-emerald-300'
              }`}>
                {currentMode === 'verygood' ? 'VERY GOOD' : currentMode.toUpperCase()} UX
              </span>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ═══ TAB 1: COGNITIVE LOAD ═══ */}
          {activeTab === 'cognitive' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Real-Time Cognitive Load Meter</h3>
                <p className="text-xs text-slate-500">Measuring mental effort at each booking step — based on decision count, field complexity, and hidden information</p>
              </div>

              {/* Live meters for all 3 modes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['bad', 'good', 'verygood'] as const).map(m => {
                  const load = cogData[m];
                  return (
                    <div key={m} className={`rounded-2xl p-5 border-2 transition-all ${
                      currentMode === m ? 'border-slate-900 shadow-lg scale-[1.02]' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          m === 'bad' ? 'text-rose-600' : m === 'verygood' ? 'text-violet-600' : 'text-emerald-600'
                        }`}>
                          {m === 'verygood' ? 'Very Good' : m === 'bad' ? 'Bad' : 'Good'} UX
                        </span>
                        <span className={`text-2xl font-black ${getCognitiveColor(load)}`}>{load}%</span>
                      </div>

                      {/* Animated bar */}
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${getCognitiveBarColor(load)}`}
                          style={{ width: `${load}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-4">
                        <span>Effortless</span>
                        <span className={`font-bold ${getCognitiveColor(load)}`}>{getCognitiveLabel(load)}</span>
                        <span>Overloaded</span>
                      </div>

                      {/* Factors */}
                      <div className="space-y-1.5">
                        {cogData.factors[m].map((f, i) => (
                          <div key={i} className={`flex items-start gap-1.5 text-[11px] ${
                            m === 'bad' ? 'text-rose-700' : m === 'verygood' ? 'text-violet-700' : 'text-emerald-700'
                          }`}>
                            {m === 'bad' ? <XCircle className="w-3 h-3 mt-0.5 shrink-0" /> :
                             <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />}
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* All steps overview */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Cognitive Load Across All Steps</h4>
                <div className="space-y-3">
                  {Object.entries(COGNITIVE_DATA).map(([step, data]) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className={`text-xs font-semibold w-24 ${step === currentStep ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                        {step === currentStep && ' ◀'}
                      </span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-rose-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${data.bad}%` }} />
                        </div>
                        <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${data.good}%` }} />
                        </div>
                        <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500 rounded-full" style={{ width: `${data.verygood}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2 text-[10px] font-mono w-28">
                        <span className="text-rose-600">{data.bad}%</span>
                        <span className="text-emerald-600">{data.good}%</span>
                        <span className="text-violet-600">{data.verygood}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-slate-500 justify-end">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Bad</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Good</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Very Good</span>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 2: EMOTION JOURNEY ═══ */}
          {activeTab === 'emotion' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">User Emotion Journey Map</h3>
                <p className="text-xs text-slate-500">Predicted emotional state at each booking step — based on friction points, transparency, and accessibility</p>
              </div>

              {/* Journey timeline */}
              <div className="relative">
                {EMOTION_JOURNEY.map((point, idx) => (
                  <div key={point.step} className={`relative flex gap-4 pb-8 ${idx === EMOTION_JOURNEY.length - 1 ? 'pb-0' : ''}`}>
                    {/* Timeline line */}
                    {idx < EMOTION_JOURNEY.length - 1 && (
                      <div className="absolute left-5 top-12 w-0.5 h-full bg-slate-200" />
                    )}

                    {/* Step marker */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold z-10 ${
                      point.step === currentStep
                        ? 'bg-slate-900 text-white shadow-lg ring-2 ring-slate-400'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Step {idx + 1}: {point.label}
                        {point.step === currentStep && <span className="ml-2 text-slate-900 normal-case">← You are here</span>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(['bad', 'good', 'verygood'] as const).map(m => {
                          const d = point[m];
                          return (
                            <div key={m} className={`rounded-xl p-3 border transition-all ${
                              currentMode === m ? 'border-slate-900 shadow-md' : 'border-slate-200'
                            } ${m === 'bad' ? 'bg-rose-50' : m === 'verygood' ? 'bg-violet-50' : 'bg-emerald-50'}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{d.emoji}</span>
                                <div>
                                  <span className={`text-xs font-bold ${
                                    m === 'bad' ? 'text-rose-700' : m === 'verygood' ? 'text-violet-700' : 'text-emerald-700'
                                  }`}>{d.label}</span>
                                  <span className={`block text-[10px] ${
                                    m === 'bad' ? 'text-rose-500' : m === 'verygood' ? 'text-violet-500' : 'text-emerald-500'
                                  }`}>{m === 'verygood' ? 'Very Good' : m === 'bad' ? 'Bad' : 'Good'}</span>
                                </div>
                              </div>
                              <p className={`text-[11px] leading-relaxed ${
                                m === 'bad' ? 'text-rose-800' : m === 'verygood' ? 'text-violet-800' : 'text-emerald-800'
                              }`}>{d.event}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emotion summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Emotion Score Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                    <div className="text-3xl mb-1">😤</div>
                    <div className="text-xl font-black text-rose-600">−42</div>
                    <div className="text-[10px] text-rose-500">Bad UX • Net Negative</div>
                    <div className="text-[10px] text-rose-400 mt-1">Starts hopeful, ends trapped</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="text-3xl mb-1">😄</div>
                    <div className="text-xl font-black text-emerald-600">+71</div>
                    <div className="text-[10px] text-emerald-500">Good UX • Positive</div>
                    <div className="text-[10px] text-emerald-400 mt-1">Confident throughout</div>
                  </div>
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                    <div className="text-3xl mb-1">🤩</div>
                    <div className="text-xl font-black text-violet-600">+93</div>
                    <div className="text-[10px] text-violet-500">Very Good UX • Delightful</div>
                    <div className="text-[10px] text-violet-400 mt-1">Welcomed → Empowered → Loyal</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 3: DARK PATTERN SCANNER ═══ */}
          {activeTab === 'scanner' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Dark Pattern Scanner</h3>
                <p className="text-xs text-slate-500">Automated scan for manipulative design patterns, WCAG violations, and legal compliance issues</p>
              </div>

              {/* Scan button */}
              {!scanComplete && (
                <div className="text-center">
                  <button
                    onClick={runScan}
                    disabled={scanRunning}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-60 transition shadow-lg"
                  >
                    {scanRunning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scanning... {scanProgress}%
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Scan Current Page for Dark Patterns
                      </>
                    )}
                  </button>
                  {scanRunning && (
                    <div className="mt-4 max-w-md mx-auto">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                        <span>Analyzing DOM elements...</span>
                        <span>{scanProgress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Scan results */}
              {scanComplete && (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 text-center">
                      <div className="text-2xl font-black text-rose-600">{DARK_PATTERNS.length}</div>
                      <div className="text-[10px] text-rose-500 font-semibold">Patterns in Bad UX</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                      <div className="text-2xl font-black text-emerald-600">{DARK_PATTERNS.filter(p => p.fixedIn === 'verygood').length}</div>
                      <div className="text-[10px] text-emerald-500 font-semibold">Remaining in Good UX</div>
                    </div>
                    <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 text-center">
                      <div className="text-2xl font-black text-violet-600">0</div>
                      <div className="text-[10px] text-violet-500 font-semibold">Remaining in Very Good</div>
                    </div>
                  </div>

                  {/* Pattern list */}
                  <div className="space-y-2">
                    {DARK_PATTERNS.map((pattern, i) => (
                      <div key={i} className={`rounded-xl p-4 border flex gap-3 ${
                        (currentMode === 'verygood') ? 'bg-emerald-50/50 border-emerald-200' :
                        (currentMode === 'good' && pattern.fixedIn === 'good') ? 'bg-emerald-50/50 border-emerald-200' :
                        'bg-rose-50 border-rose-200'
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          (currentMode === 'verygood' || (currentMode === 'good' && pattern.fixedIn === 'good'))
                            ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {(currentMode === 'verygood' || (currentMode === 'good' && pattern.fixedIn === 'good'))
                            ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900">{pattern.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              pattern.severity === 'critical' ? 'bg-rose-200 text-rose-800' :
                              pattern.severity === 'high' ? 'bg-amber-200 text-amber-800' :
                              'bg-slate-200 text-slate-700'
                            }`}>{pattern.severity.toUpperCase()}</span>
                            <span className="text-[10px] text-slate-400">{pattern.category}</span>
                            <span className="text-[10px] text-slate-400">• Step: {pattern.step}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{pattern.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400">Violation: {pattern.wcagViolation}</span>
                            <span className="text-[10px] font-bold text-emerald-600">Fixed in {pattern.fixedIn === 'verygood' ? 'Very Good' : 'Good'} UX</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => { setScanComplete(false); setScanProgress(0); }} className="text-xs text-slate-500 underline mt-2">
                    Re-scan
                  </button>
                </>
              )}
            </div>
          )}

          {/* ═══ TAB 4: MONEY LOST CALCULATOR ═══ */}
          {activeTab === 'money' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Financial Impact Calculator</h3>
                <p className="text-xs text-slate-500">Annual revenue impact of UX quality — based on {MONEY_DATA.monthlyVisitors.toLocaleString()} monthly visitors × ${MONEY_DATA.avgBookingValue} average booking</p>
              </div>

              {/* Big number cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['bad', 'good', 'verygood'] as const).map(m => {
                  const d = moneyCalc[m];
                  const isActive = currentMode === m || currentMode === 'compare';
                  return (
                    <div key={m} className={`rounded-2xl p-5 border-2 transition-all ${
                      currentMode === m ? 'border-slate-900 shadow-lg' : 'border-slate-200'
                    }`}>
                      <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                        m === 'bad' ? 'text-rose-600' : m === 'verygood' ? 'text-violet-600' : 'text-emerald-600'
                      }`}>
                        {m === 'verygood' ? 'Very Good' : m === 'bad' ? 'Bad' : 'Good'} UX
                      </div>

                      <div className="text-3xl font-black text-slate-900 mb-1">
                        ${(d.net / 1000).toFixed(0)}K
                      </div>
                      <div className="text-[10px] text-slate-500 mb-4">Net Annual Revenue</div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Bookings/year</span>
                          <span className="font-bold text-slate-800">{d.bookings.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Gross Revenue</span>
                          <span className="font-bold text-emerald-700">${(d.revenue / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Chargebacks</span>
                          <span className="font-bold text-rose-600">−${(d.chargebacks / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Support Costs</span>
                          <span className="font-bold text-rose-600">−${(d.support / 1000).toFixed(1)}K</span>
                        </div>
                        {d.legal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Legal Risk</span>
                            <span className="font-bold text-rose-600">−${(d.legal / 1000).toFixed(0)}K</span>
                          </div>
                        )}
                        <div className="border-t border-slate-200 pt-2 flex justify-between">
                          <span className="font-bold text-slate-700">Net Revenue</span>
                          <span className={`font-black ${m === 'bad' ? 'text-rose-600' : m === 'verygood' ? 'text-violet-600' : 'text-emerald-600'}`}>
                            ${(d.net / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* The big insight */}
              <div className="bg-gradient-to-r from-violet-50 via-white to-emerald-50 rounded-2xl p-6 border border-slate-200">
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-800 mb-4">Very Good UX vs Bad UX — Annual Savings</h4>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-emerald-600 mb-2">
                    ${((moneyCalc.verygood.net - moneyCalc.bad.net) / 1000).toFixed(0)}K
                  </div>
                  <p className="text-sm text-slate-600 mb-4">additional revenue per year by switching from Bad to Very Good UX</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <div className="text-lg font-black text-emerald-600">+{((moneyCalc.verygood.bookings - moneyCalc.bad.bookings)).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div className="text-[10px] text-slate-500">More Bookings/Year</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <div className="text-lg font-black text-emerald-600">−{((moneyCalc.bad.chargebacks - moneyCalc.verygood.chargebacks) / 1000).toFixed(0)}K</div>
                      <div className="text-[10px] text-slate-500">Chargebacks Saved</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <div className="text-lg font-black text-emerald-600">−{((moneyCalc.bad.support - moneyCalc.verygood.support) / 1000).toFixed(0)}K</div>
                      <div className="text-[10px] text-slate-500">Support Costs Saved</div>
                    </div>
                    <div className="bg-white rounded-xl p-3 border border-slate-200">
                      <div className="text-lg font-black text-violet-600">{((moneyCalc.verygood.net / moneyCalc.bad.net - 1) * 100).toFixed(0)}%</div>
                      <div className="text-[10px] text-slate-500">ROI Improvement</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 italic">
                    Accessibility is not a cost center — it is a revenue multiplier. Every dollar invested in ethical, accessible UX returns ${((moneyCalc.verygood.net - moneyCalc.bad.net) / 10000).toFixed(0)} in annual revenue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>UX Intelligence Panel • FairReserve Lab</span>
          <div className="flex gap-2">
            {currentMode !== 'verygood' && (
              <button
                onClick={() => onSwitchMode('verygood')}
                className="px-3 py-1.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition"
              >
                Switch to Very Good UX
              </button>
            )}
            <button onClick={onClose} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
