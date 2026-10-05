import React, { useState, useEffect } from 'react';
import { Stay, AddOnItem, BookingFormState, UXMode, DisabilitySettings } from '../../types';
import { calculateBookingPrice } from '../../utils/pricing';
import { MOCK_STAYS } from '../../data/mockStays';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Info, 
  AlertCircle,
  Clock, 
  FileText,
  RotateCcw,
  Zap,
  Users,
  ArrowRight,
  HelpCircle,
  BellRing
} from 'lucide-react';

interface CheckoutStepProps {
  stay: Stay;
  nights: number;
  selectedAddOnIds: string[];
  availableAddOns: AddOnItem[];
  formState: BookingFormState;
  onFormChange: (updated: Partial<BookingFormState>) => void;
  onCompleteBooking: () => void;
  mode: UXMode;
  onOpenConflictModal: () => void;
  onOpenSimultaneousSimulator?: () => void;
  onAdoptAlternativeStay?: (stay: Stay, datesShifted?: boolean) => void;
  disabilitySettings?: DisabilitySettings;
  onOpenDisabilityBar?: () => void;
}

export const CheckoutStep: React.FC<CheckoutStepProps> = ({
  stay,
  nights,
  selectedAddOnIds,
  availableAddOns,
  formState,
  onFormChange,
  onCompleteBooking,
  mode,
  onOpenConflictModal,
  onOpenSimultaneousSimulator,
  onAdoptAlternativeStay,
  disabilitySettings,
  onOpenDisabilityBar,
}) => {
  // Bad UX error state
  const [badErrorBanner, setBadErrorBanner] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Concurrency inline collision state
  const [inlineCollisionState, setInlineCollisionState] = useState<'none' | 'simulating' | 'collision_good' | 'collision_bad'>('none');
  const [holdSeconds, setHoldSeconds] = useState<number>(588); // 9:48 hold timer
  const [waitlistJoined, setWaitlistJoined] = useState<boolean>(false);

  const alternativeStay = MOCK_STAYS.find(s => s.id !== stay.id) || MOCK_STAYS[1];

  // Courtesy hold timer countdown for Good UX
  useEffect(() => {
    if (mode !== 'good') return;
    const interval = setInterval(() => {
      setHoldSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  const pricing = calculateBookingPrice(
    stay,
    nights,
    selectedAddOnIds,
    availableAddOns,
    mode === 'bad' ? 'bad' : 'good'
  );

  // Inline simulation trigger
  const handleTriggerInlineCollision = () => {
    setInlineCollisionState('simulating');
    setTimeout(() => {
      if (mode === 'bad') {
        setInlineCollisionState('collision_bad');
        setBadErrorBanner(
          'FATAL 503 CONCURRENCY_LOCK_ACQUIRED: The last remaining room at ' + stay.name + ' was committed by another session (Marcus in London) 1.2s prior. Your credit card was pre-authorized for $' + pricing.grandTotal.toFixed(2) + ' (frozen for 7-14 business days). All form fields have been cleared for security.'
        );
        onFormChange({
          cardNumber: '',
          cardExpiry: '',
          cardCvc: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          fax: '',
          securityQuestion: '',
          billingStreet: '',
          billingPostalCode: ''
        });
      } else {
        setInlineCollisionState('collision_good');
      }
    }, 1100);
  };

  // Quick Autofill helper for Good UX
  const handleAutofillGood = () => {
    onFormChange({
      firstName: 'Elena',
      lastName: 'Vance',
      email: 'elena.vance@example.com',
      phone: '+1 (555) 382-9104',
      cardNumber: '•••• •••• •••• 4242',
      cardExpiry: '12/28',
      cardCvc: '849',
      agreeTerms: true
    });
  };

  // Quick Autofill for Bad UX to speed up testing the hostile form
  const handleAutofillBad = () => {
    onFormChange({
      salutation: 'Dr.',
      firstName: 'Arthur',
      lastName: 'Pendleton',
      email: 'arthur.p@example.com',
      phone: '+1 (555) 203-9182',
      fax: '+1 (555) 203-9183',
      securityQuestion: 'Fluffy',
      billingStreet: '742 Evergreen Terrace',
      billingPostalCode: '90210',
      cardNumber: '•••• •••• •••• 1092',
      cardExpiry: '09/27',
      cardCvc: '312',
      agreeTerms: true
    });
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'bad') {
      // In Bad UX, intentionally frustrate the user if fax or security question is missing,
      // or show vague error and wipe card fields!
      if (!formState.fax || !formState.securityQuestion) {
        setBadErrorBanner(
          'CRITICAL SYSTEM ERROR 502: Mandatory identity and telecommunications fields are deficient. All secure financial fields have been wiped for PCI compliance.'
        );
        onFormChange({ cardNumber: '', cardExpiry: '', cardCvc: '' });
        return;
      }
    }

    // Good UX validation
    if (mode === 'good' || mode === 'verygood') {
      if (!formState.email || !formState.firstName) {
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onCompleteBooking();
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>Step 4 of 4</span>
            <span>•</span>
            <span>Guest Profile & Payment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'good'
              ? 'Frictionless Guest Checkout & Clear Terms'
              : mode === 'verygood'
              ? 'Accessible Checkout — Labels, Keyboard Nav & Screen Reader'
              : mode === 'bad'
              ? 'Exhaustive Verification & Drip Price Disclosure'
              : 'Form Ergonomics & Policy Transparency Comparison'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {mode === 'good'
              ? 'Only 3 essential fields required. Visual cancellation timeline and instant 1-click test fill.'
              : mode === 'verygood'
              ? '3 fields with htmlFor bindings, inputMode, autoComplete, and aria-live price updates.'
              : mode === 'bad'
              ? 'Observe the Drip Pricing reveal (subtotal jumped significantly), 12 redundant inputs, and wiped form states on error.'
              : 'Contrast cognitive load, form completion rates, and policy clarity.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start">
          <button
            type="button"
            onClick={mode === 'bad' ? handleAutofillBad : handleAutofillGood} // verygood uses good autofill
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Test Autofill</span>
          </button>

          <button
            onClick={onOpenConflictModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition shadow-xs"
          >
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Analyze UX Conflict #4: Form Friction</span>
          </button>
        </div>
      </div>

      {/* Good UX Courtesy Soft-Hold Status Bar */}
      {(mode === 'good' || mode === 'verygood') && (
        <div className={`mb-6 p-3 ${mode === 'verygood' ? 'bg-violet-50/90 border-violet-200' : 'bg-emerald-50/90 border-emerald-200'} border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${mode === 'verygood' ? 'text-violet-900' : 'text-emerald-900'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold">Courtesy Inventory Hold Active: </span>
              <span>This suite is locked for your session to prevent double-booking.</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold text-emerald-800">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hold expires in {Math.floor(holdSeconds / 60)}:{String(holdSeconds % 60).padStart(2, '0')}</span>
            </span>
            {onOpenSimultaneousSimulator && (
              <button
                type="button"
                onClick={onOpenSimultaneousSimulator}
                className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-800 hover:bg-emerald-100 font-bold transition flex items-center space-x-1 shadow-2xs"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulate 2-Guest Race</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Real-time Concurrency Stress Test Banner */}
      <div className="mb-6 p-4 rounded-2xl border bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-amber-50/70 border-amber-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <strong className="text-slate-900 font-bold text-sm">Simultaneous Booking Test Scenario</strong>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold">
                1 Room Left for These Dates
              </span>
            </div>
            <p className="text-slate-600 mt-0.5">
              What happens if traveler Marcus Sterling in London hits "Pay" at the exact same instant?
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerInlineCollision}
            disabled={inlineCollisionState === 'simulating'}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-amber-200 fill-current" />
            <span>{inlineCollisionState === 'simulating' ? 'Simulating Collision...' : 'Trigger Race Collision Here'}</span>
          </button>

          {onOpenSimultaneousSimulator && (
            <button
              type="button"
              onClick={onOpenSimultaneousSimulator}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold transition flex items-center space-x-1 shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Open Side-by-Side Lab</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Good UX Concurrency Recovery Alert */}
      {inlineCollisionState === 'collision_good' && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                  Race Collision Safely Handled • Good UX
                </span>
                <h3 className="text-base font-extrabold text-emerald-950 mt-1">
                  Another Guest Finalized 1.2s Ahead — $0 Charged & Inputs Saved
                </h3>
                <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed">
                  Traveler Marcus in London just finished booking {stay.name}. Because our system checks inventory before placing card charges, <strong>no money was debited</strong> and <strong>100% of your guest details are preserved</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setInlineCollisionState('none')}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1 bg-emerald-100 rounded-lg shrink-0"
            >
              Dismiss
            </button>
          </div>

          <div className="pt-3 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-950 font-bold">Recommended Alternative:</span>
              <span className="text-emerald-900 font-semibold">{alternativeStay.name} (Matched to ${stay.basePricePerNight}/nt)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (onAdoptAlternativeStay) {
                    onAdoptAlternativeStay(alternativeStay, false);
                  }
                  setInlineCollisionState('none');
                }}
                className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition flex items-center space-x-1"
              >
                <span>Adopt Alternative Stay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setWaitlistJoined(true)}
                className="px-3 py-1.5 border border-emerald-300 text-emerald-900 bg-white rounded-lg font-bold hover:bg-emerald-50 transition"
              >
                {waitlistJoined ? '✓ Priority #1 on Waitlist' : 'Join 10-Min Waitlist'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bad UX Vague Error Banner */}
      {badErrorBanner && (
        <div className="mb-6 p-4 bg-rose-950 text-rose-100 rounded-2xl border-2 border-rose-600 flex items-start space-x-3 text-xs animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="block text-rose-300 font-bold text-sm mb-1">
              Submission Rejected by Server
            </strong>
            <p>{badErrorBanner}</p>
            <p className="mt-1.5 text-rose-400 italic">
              Dark pattern flaw: Notice how the form didn't highlight the exact missing field, and wiped your payment credentials.
            </p>
          </div>
          <button 
            onClick={() => setBadErrorBanner(null)} 
            className="text-rose-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* GOOD UX: Clean 3-Field Guest Details */}
            {(mode === 'good' || mode === 'verygood' || mode === 'compare') && (
              <div className={`bg-white rounded-2xl p-6 border shadow-xs ${mode === 'verygood' ? 'border-violet-200' : 'border-emerald-200'}`}>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    </span>
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm">Guest Information (Essential Only)</h2>
                      <p className="text-xs text-slate-500">No account creation required • Instant guest reservation</p>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    3 Fields Only
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="good-fullname" className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <input
                        id="good-fullname"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Elena Vance"
                        value={formState.firstName || ''}
                        onChange={e => onFormChange({ firstName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {formState.firstName && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="good-email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (for instant dossier & receipt) *
                    </label>
                    <div className="relative">
                      <input
                        id="good-email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder="elena.vance@example.com"
                        value={formState.email || ''}
                        onChange={e => onFormChange({ email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {formState.email.includes('@') && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="good-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (for digital door keycode SMS) *
                    </label>
                    <div className="relative">
                      <input
                        id="good-phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+1 (555) 382-9104"
                        value={formState.phone || ''}
                        onChange={e => onFormChange({ phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                      />
                      {formState.phone.length >= 7 && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Optional Disability & Accessibility Accommodations (Good UX) */}
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm">♿</span>
                      <strong className="text-xs font-bold text-slate-900">
                        Disability Accommodations &amp; Access Preferences (Optional, $0 Guaranteed)
                      </strong>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                      Zero Fees by Law
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Let us prepare personalized arrival support. We guarantee ground floor priority and zero service animal fees.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formState.accessibilityRequests?.stepFreeRequired)}
                        onChange={e => onFormChange({
                          accessibilityRequests: {
                            ...formState.accessibilityRequests,
                            stepFreeRequired: e.target.checked
                          }
                        })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-800">Ground floor / Step-free priority room</span>
                    </label>

                    <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formState.accessibilityRequests?.serviceAnimalAttending)}
                        onChange={e => onFormChange({
                          accessibilityRequests: {
                            ...formState.accessibilityRequests,
                            serviceAnimalAttending: e.target.checked
                          }
                        })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-800">Traveling with Guide / Service Animal ($0)</span>
                    </label>

                    <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formState.accessibilityRequests?.visualAlertsRequired)}
                        onChange={e => onFormChange({
                          accessibilityRequests: {
                            ...formState.accessibilityRequests,
                            visualAlertsRequired: e.target.checked
                          }
                        })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-800">Visual strobe emergency smoke alerts</span>
                    </label>

                    <label className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(formState.accessibilityRequests?.quietSensoryCheckIn)}
                        onChange={e => onFormChange({
                          accessibilityRequests: {
                            ...formState.accessibilityRequests,
                            quietSensoryCheckIn: e.target.checked
                          }
                        })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-800">Sensory-quiet check-in (fragrance-free)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* BAD UX: Bloated 12-Field Maze */}
            {(mode === 'bad' || mode === 'compare') && (
              <div className={`bg-white rounded-2xl p-6 border shadow-xs ${
                mode === 'bad' ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-rose-200'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-rose-700" />
                    </span>
                    <div>
                      <h2 className="font-bold text-rose-950 text-sm">
                        Mandatory Traveler Dossier (12 Fields Required)
                      </h2>
                      <p className="text-xs text-rose-700">Demands unnecessary personal details and telecom records</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                    High Cognitive Fatigue
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Salutation *</label>
                    <select
                      value={formState.salutation || 'Dr.'}
                      onChange={e => onFormChange({ salutation: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Ms.</option>
                      <option>Dr.</option>
                      <option>Lord</option>
                      <option>Baron</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      placeholder="Arthur"
                      value={formState.firstName || ''}
                      onChange={e => onFormChange({ firstName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Pendleton"
                      value={formState.lastName || ''}
                      onChange={e => onFormChange({ lastName: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-rose-700 mb-1">Fax Number * (Mandatory)</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 203-9183"
                      value={formState.fax || ''}
                      onChange={e => onFormChange({ fax: e.target.value })}
                      className="w-full p-2 border border-rose-300 bg-rose-50/40 rounded-lg font-mono"
                    />
                    <span className="text-[9px] text-rose-600 block mt-0.5">Required for physical paper dispatch</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mother's Maiden Name *</label>
                    <input
                      type="text"
                      placeholder="Security phrase"
                      value={formState.securityQuestion || ''}
                      onChange={e => onFormChange({ securityQuestion: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Billing Postal Code *</label>
                    <input
                      type="text"
                      placeholder="90210"
                      value={formState.billingPostalCode || ''}
                      onChange={e => onFormChange({ billingPostalCode: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {/* Double-Negative Marketing Consent Trap */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formState.marketingOptIn)}
                      onChange={e => onFormChange({ marketingOptIn: e.target.checked })}
                      className="mt-0.5 rounded text-rose-600"
                    />
                    <span className="leading-snug text-[11px] text-slate-600">
                      <strong>Deceptive wording trap:</strong> Uncheck this box if you do <em>NOT</em> wish to decline non-essential third-party advertising partner calls during early morning hours.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Visual Cancellation Policy Timeline vs Buried Terms */}
            {(mode === 'good' || mode === 'verygood') ? (
              <div className={`bg-white rounded-2xl p-6 border shadow-xs ${mode === 'verygood' ? 'border-violet-200' : 'border-emerald-200'}`}>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Transparent Cancellation Timeline
                  </h3>
                </div>

                {/* Visual Timeline Bar */}
                <div className="mt-2 space-y-2">
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-bold">
                    <span className="text-emerald-700">100% Full Refund</span>
                    <span className="text-amber-700">50% Partial Refund</span>
                    <span className="text-slate-500">Non-refundable</span>
                  </div>

                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                    <div className="w-1/2 bg-emerald-500"></div>
                    <div className="w-1/4 bg-amber-400"></div>
                    <div className="w-1/4 bg-slate-300"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 pt-1">
                    <div>Until <strong>Oct 11, 11:59 PM</strong> (zero fee cancellation)</div>
                    <div>Until <strong>Oct 13, 11:59 PM</strong> (hospitality cleaning refunded)</div>
                    <div>From <strong>Oct 14</strong> check-in forward</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 border border-rose-300 text-xs text-slate-600">
                <div className="flex items-center space-x-2 text-rose-700 font-bold mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Buried Non-Refundable Legal Trap</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  By clicking complete reservation you certify you have thoroughly read and consented to our 48-page Non-Standard Operational Master Bailment Terms. ALL FEES ARE STRICTLY 100% FORFEITED IMMEDIATELY UPON CLICKING SUBMIT WITH ZERO EXCEPTIONS FOR SICKNESS, NATURAL DISASTERS, OR PANDEMICS.
                </p>
              </div>
            )}

            {/* Payment Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm text-slate-900">Encrypted Payment Card</h3>
                </div>
                <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>256-bit SSL Demo Sandbox</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label htmlFor="pay-cardnum" className="block text-xs font-semibold text-slate-700 mb-1">
                    Card Number
                  </label>
                  <input
                    id="pay-cardnum"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                    placeholder="4242 •••• •••• 4242"
                    value={formState.cardNumber || ''}
                    onChange={e => onFormChange({ cardNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="pay-expiry" className="block text-xs font-semibold text-slate-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    id="pay-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    required
                    placeholder="12/28"
                    value={formState.cardExpiry || ''}
                    onChange={e => onFormChange({ cardExpiry: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="pay-cvc" className="block text-xs font-semibold text-slate-700 mb-1">
                    Security CVC
                  </label>
                  <input
                    id="pay-cvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                    placeholder="849"
                    value={formState.cardCvc || ''}
                    onChange={e => onFormChange({ cardCvc: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <button
              id="btn-submit-booking"
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3.5 px-6 rounded-2xl text-sm font-extrabold transition shadow-md flex items-center justify-center space-x-2 ${
                mode === 'good'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : mode === 'verygood'
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : mode === 'bad'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Verifying Cryptographic Tokens...'
                  : mode === 'bad'
                  ? `AUTHORIZE NON-REFUNDABLE CHARGE OF $${pricing.grandTotal}`
                  : mode === 'verygood'
                  ? `Confirm Accessible Reservation • $${pricing.grandTotal}`
                  : `Confirm Reservation • $${pricing.grandTotal}`}
              </span>
            </button>
          </form>
        </div>

        {/* Final Price Reconciliation Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-slate-600">Final Payment Due</span>
              <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{stay.name}</h3>
              <p className="text-xs text-slate-500">
                {nights} nights stay
              </p>
            </div>

            {/* Price Itemized Dissection */}
            <div aria-live="polite" aria-atomic="true" className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Base accommodation rate</span>
                <span className="font-mono font-medium text-slate-900">${pricing.nightsTotal}</span>
              </div>

              {pricing.selectedAddOnsTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Selected upgrades ({selectedAddOnIds.length})</span>
                  <span className="font-mono font-medium text-slate-900">${pricing.selectedAddOnsTotal}</span>
                </div>
              )}

              {/* In Bad UX, highlight the DRIP PRICING shock! */}
              {mode === 'bad' && (
                <div className="py-2 border-y border-rose-200 bg-rose-50 -mx-3 px-3 rounded-lg space-y-1.5">
                  <div className="font-bold text-rose-900 text-[11px] flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Drip Fees Revealed at Last Step:</span>
                  </div>
                  {pricing.mandatoryFees.map((fee, idx) => (
                    <div key={idx} className="flex justify-between text-rose-800 text-[11px]">
                      <span>{fee.name}</span>
                      <span className="font-mono font-bold">${fee.amount}</span>
                    </div>
                  ))}
                  <div className="text-[10px] text-rose-600 pt-1 font-semibold">
                    Total hidden drip surcharge: +${pricing.mandatoryFeesTotal}
                  </div>
                </div>
              )}

              {(mode === 'good' || mode === 'verygood') && (
                <div className="flex justify-between text-slate-600">
                  <span>Eco hospitality tax (10%)</span>
                  <span className="font-mono font-medium text-slate-900">${pricing.taxes}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-base text-slate-900">
                <span>Grand Total</span>
                <span className={`font-mono text-2xl ${
                  mode === 'good' ? 'text-emerald-700' : mode === 'verygood' ? 'text-violet-700' : 'text-rose-600'
                }`}>
                  ${pricing.grandTotal}
                </span>
              </div>
            </div>

            {(mode === 'good' || mode === 'verygood') ? (
              <div className={`p-3 rounded-xl border text-[11px] flex items-start space-x-2 ${mode === 'verygood' ? 'bg-violet-50 border-violet-200 text-violet-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${mode === 'verygood' ? 'text-violet-700' : 'text-emerald-700'}`} />
                <span>{mode === 'verygood' ? 'Zero hidden fees + aria-live price updates for screen readers. All form fields have proper labels.' : 'Zero hidden fees. Exact receipt emailed with calendar attachments immediately upon clicking.'}</span>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[10px] text-rose-900 leading-snug">
                <strong>Price Anchoring Shock:</strong> Advertised initially as ${stay.fakeBaitPricePerNight}/nt ($
                {stay.fakeBaitPricePerNight * nights}), final bill climbed to ${pricing.grandTotal}!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
