import React, { useState } from 'react';
import { Stay, UXMode, DisabilitySettings } from '../../types';
import { calculateBookingPrice } from '../../utils/pricing';
import { AVAILABLE_ADDONS } from '../../data/mockStays';
import { 
  Calendar as CalendarIcon, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  AlertCircle,
  Zap,
  HeartHandshake,
  Check
} from 'lucide-react';

interface PropertyDetailStepProps {
  stay: Stay;
  checkInDate: string;
  checkOutDate: string;
  onDatesChange: (checkIn: string, checkOut: string, nights: number) => void;
  guestCount: number;
  onGuestCountChange: (guests: number) => void;
  onProceed: () => void;
  mode: UXMode;
  onOpenConflictModal: () => void;
  onOpenSimultaneousSimulator?: () => void;
  disabilitySettings?: DisabilitySettings;
  onOpenDisabilityBar?: () => void;
}

export const PropertyDetailStep: React.FC<PropertyDetailStepProps> = ({
  stay,
  checkInDate,
  checkOutDate,
  onDatesChange,
  guestCount,
  onGuestCountChange,
  onProceed,
  mode,
  onOpenConflictModal,
  onOpenSimultaneousSimulator,
  disabilitySettings,
  onOpenDisabilityBar,
}) => {
  // Bad UX state: separate raw string inputs and validation error
  const [badCheckIn, setBadCheckIn] = useState('10/14/2026');
  const [badCheckOut, setBadCheckOut] = useState('10/17/2026');
  const [badDateError, setBadDateError] = useState<string | null>(null);

  // Good UX calendar dates model (October 2026)
  const [selectedStartDay, setSelectedStartDay] = useState<number>(14);
  const [selectedEndDay, setSelectedEndDay] = useState<number>(17);

  const nights = selectedEndDay > selectedStartDay ? selectedEndDay - selectedStartDay : 3;

  // Good UX preset handler
  const handleSelectPreset = (start: number, end: number) => {
    setSelectedStartDay(start);
    setSelectedEndDay(end);
    const n = end - start;
    onDatesChange(`2026-10-${start < 10 ? '0' : ''}${start}`, `2026-10-${end < 10 ? '0' : ''}${end}`, n);
  };

  // Day click handler for visual calendar
  const handleDayClick = (day: number) => {
    if (day <= 10) return; // Disabled/past
    if (day === selectedStartDay) return;

    if (day < selectedStartDay) {
      setSelectedStartDay(day);
      const n = selectedEndDay - day;
      onDatesChange(`2026-10-${day}`, `2026-10-${selectedEndDay}`, n);
    } else {
      setSelectedEndDay(day);
      const n = day - selectedStartDay;
      onDatesChange(`2026-10-${selectedStartDay}`, `2026-10-${day}`, n);
    }
  };

  // Bad UX submit check
  const handleBadUxSubmit = () => {
    // Check if format is MM/DD/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(badCheckIn) || !dateRegex.test(badCheckOut)) {
      setBadDateError('INPUT REJECTED: Date must strictly conform to MM/DD/YYYY syntax. Inputs cleared for security.');
      setBadCheckIn('');
      setBadCheckOut('');
      return;
    }
    setBadDateError(null);
    onProceed();
  };

  const pricingPreview = calculateBookingPrice(stay, nights, [], AVAILABLE_ADDONS, mode === 'bad' ? 'bad' : 'good');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>Step 2 of 4</span>
            <span>•</span>
            <span>Date Selection & Capacity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stay.name}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {stay.location} • {stay.bedrooms} Bedrooms • Up to {stay.maxGuests} Guests
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          {onOpenSimultaneousSimulator && (
            <button
              onClick={onOpenSimultaneousSimulator}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition shadow-xs"
            >
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Test 2 Guests Booking Same Suite</span>
            </button>
          )}

          <button
            onClick={onOpenConflictModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition shadow-xs"
          >
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Analyze UX Conflict #2: False Urgency</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Date Selection Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* GOOD UX: Visual Range Calendar */}
          {(mode === 'good' || mode === 'verygood' || mode === 'compare') && (
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-emerald-700" />
                  </span>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">Select Your Dates (October 2026)</h2>
                    <p className="text-xs text-slate-500">
                      Prices per night annotated directly on each date. Continuous range highlighting.
                    </p>
                  </div>
                </div>

                {/* Quick Stay Presets */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(16, 18)}
                    {...(mode === 'verygood' && { 'aria-pressed': selectedStartDay === 16 && selectedEndDay === 18, 'aria-label': 'Weekend preset, 2 nights, October 16 to 18' })}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                      selectedStartDay === 16 && selectedEndDay === 18
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Weekend (2 nights)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(14, 17)}
                    {...(mode === 'verygood' && { 'aria-pressed': selectedStartDay === 14 && selectedEndDay === 17, 'aria-label': 'Standard preset, 3 nights, October 14 to 17' })}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                      selectedStartDay === 14 && selectedEndDay === 17
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Standard (3 nights)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(12, 19)}
                    {...(mode === 'verygood' && { 'aria-pressed': selectedStartDay === 12 && selectedEndDay === 19, 'aria-label': '1 week preset, 7 nights, October 12 to 19, 10 percent discount' })}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
                      selectedStartDay === 12 && selectedEndDay === 19
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1 Week (-10%)
                  </button>
                </div>
              </div>

              {/* Visual Calendar Grid */}
              <div className="mt-4" {...(mode === 'verygood' && { role: 'grid', 'aria-label': 'October 2026 calendar for date selection' })}>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Calendar Days (Oct 2026 starts on Thu) */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Empty slots for Sun-Wed before Oct 1 */}
                  <div className="p-2 text-slate-200"></div>
                  <div className="p-2 text-slate-200"></div>
                  <div className="p-2 text-slate-200"></div>
                  <div className="p-2 text-slate-200"></div>

                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const isPastOrSold = day <= 10;
                    const isSelectedStart = day === selectedStartDay;
                    const isSelectedEnd = day === selectedEndDay;
                    const isInRange = day > selectedStartDay && day < selectedEndDay;
                    const isWeekend = (day + 4) % 7 === 1 || (day + 4) % 7 === 2; // Fri/Sat
                    const dayPrice = isWeekend ? stay.basePricePerNight + 25 : stay.basePricePerNight;

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isPastOrSold}
                        onClick={() => handleDayClick(day)}
                        {...(mode === 'verygood' && {
                          'aria-label': `October ${day}, $${dayPrice} per night${isSelectedStart ? ', check-in date' : isSelectedEnd ? ', check-out date' : isInRange ? ', in selected range' : ''}${isPastOrSold ? ', unavailable' : ''}`,
                          'aria-pressed': isSelectedStart || isSelectedEnd,
                        })}
                        className={`p-2 rounded-xl text-center transition flex flex-col items-center justify-center relative min-h-[56px] ${
                          isPastOrSold
                            ? 'opacity-30 cursor-not-allowed bg-slate-50 text-slate-400 line-through'
                            : isSelectedStart || isSelectedEnd
                            ? 'bg-emerald-600 text-white font-extrabold shadow-sm scale-102 z-10'
                            : isInRange
                            ? 'bg-emerald-50 text-emerald-900 font-semibold border-y border-emerald-200/80 rounded-none'
                            : 'bg-slate-50/70 hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span className="text-xs font-bold">{day}</span>
                        {!isPastOrSold && (
                          <span className={`text-[10px] font-mono mt-0.5 ${
                            isSelectedStart || isSelectedEnd ? 'text-emerald-100' : 'text-slate-500'
                          }`}>
                            ${dayPrice}
                          </span>
                        )}
                        {isSelectedStart && (
                          <span className="text-[9px] uppercase font-bold tracking-tighter text-emerald-200">Check-in</span>
                        )}
                        {isSelectedEnd && (
                          <span className="text-[9px] uppercase font-bold tracking-tighter text-emerald-200">Check-out</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ethical Assurance Strip */}
              <div className="mt-5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>Selected:</strong> Oct {selectedStartDay} – Oct {selectedEndDay}, 2026 ({nights} nights)
                  </span>
                </div>
                <div className="text-slate-600 hidden sm:block">
                  {stay.availableRooms} of 5 suites available • 15-minute polite checkout hold
                </div>
              </div>
            </div>
          )}

          {/* BAD UX: Raw Text Input with Hostile Error & Urgency */}
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
                    <h2 className="font-bold text-rose-950 text-base">
                      {mode === 'bad' ? 'Strict Date Reservation Form' : 'Bad UX Counterpart: Clunky Syntax Inputs'}
                    </h2>
                    <p className="text-xs text-rose-700">
                      Requires typed date format • No day-of-week context • Form resets on syntax error
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-rose-700 font-bold bg-rose-100 px-2.5 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-rose-600 animate-spin" />
                  <span>42 GUESTS VIEWING</span>
                </div>
              </div>

              {badDateError && (
                <div className="mb-4 p-3 bg-rose-950 text-rose-100 text-xs rounded-xl flex items-start space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-300">Validation Exception #824</strong>
                    {badDateError}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Check-in Date (MM/DD/YYYY) *
                  </label>
                  <input
                    type="text"
                    placeholder="10/14/2026"
                    value={badCheckIn || ''}
                    onChange={e => setBadCheckIn(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Must use slash delimiter. European DD/MM rejected.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Check-out Date (MM/DD/YYYY) *
                  </label>
                  <input
                    type="text"
                    placeholder="10/17/2026"
                    value={badCheckOut || ''}
                    onChange={e => setBadCheckOut(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Minimum 3 nights required or surcharge applies.
                  </span>
                </div>
              </div>

              {/* Stressful Countdown Box */}
              <div className="mt-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-rose-600 animate-spin" />
                  <span>
                    ⚡ <strong>Rate guaranteed for:</strong> <span className="font-mono font-bold text-rose-700">03:42</span> or suite is released to waitlist!
                  </span>
                </div>
                <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded font-bold text-rose-800">
                  HIGH SURGE RISK
                </span>
              </div>
            </div>
          )}

          {/* Guest Count Selector */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Traveling Guests</h3>
                <p className="text-xs text-slate-500">Maximum {stay.maxGuests} guests allowed for this villa</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  disabled={guestCount <= 1}
                  onClick={() => onGuestCountChange(guestCount - 1)}
                  {...(mode === 'verygood' && { 'aria-label': `Decrease guests, currently ${guestCount}` })}
                  className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-slate-900" {...(mode === 'verygood' && { 'aria-live': 'polite', 'aria-atomic': 'true', role: 'status' })}>{guestCount}</span>
                <button
                  type="button"
                  disabled={guestCount >= stay.maxGuests}
                  onClick={() => onGuestCountChange(guestCount + 1)}
                  {...(mode === 'verygood' && { 'aria-label': `Increase guests, currently ${guestCount}, maximum ${stay.maxGuests}` })}
                  className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Verified Architectural Accessibility & Disability Specs */}
          {stay.accessibility && (
            <div className={`rounded-2xl p-6 border shadow-xs ${
              mode === 'bad' 
                ? 'bg-slate-50 border-slate-200' 
                : 'bg-white border-sky-200 ring-1 ring-sky-100'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    mode === 'bad' ? 'bg-slate-200 text-slate-700' : 'bg-sky-100 text-sky-800'
                  }`}>
                    ♿
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {mode === 'bad' 
                        ? 'Accessibility Information (Host Disclaimer)' 
                        : 'Verified Architectural Accessibility & Disability Specs'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {mode === 'bad'
                        ? 'Self-reported by listing owner • Not physically verified'
                        : `${stay.accessibility.certifiedAuditDate} • Verified ADA Title III & WCAG Standards`}
                    </p>
                  </div>
                </div>

                {onOpenDisabilityBar && (
                  <button
                    onClick={onOpenDisabilityBar}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 underline"
                  >
                    Test A11y Tools
                  </button>
                )}
              </div>

              {mode === 'bad' ? (
                /* Bad UX: Vague, shifting burden onto disabled guests */
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center space-x-2 font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Host Disclaimer Regarding Physical Disabilities:</span>
                  </div>
                  <p className="leading-relaxed">
                    "This villa has general accessibility features. However, exact door widths and shower steps may vary. Guests using motorized wheelchairs or mobility scooters must phone property reception during weekday hours to confirm access. Note: Service animals require an additional $60 deep sanitization fee."
                  </p>
                  <p className="text-[11px] text-rose-700 font-semibold italic">
                    ⚠️ Bad UX & Legal Pitfall: Shifting verification onto disabled guests and charging for service animals violates civil rights disability laws.
                  </p>
                </div>
              ) : (
                /* Good UX: Concrete measurements, photo evidence, guaranteed policies */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold">Doorway Clear Width</strong>
                        <span className="text-slate-600">
                          {stay.accessibility.doorwayWidthInches}" clear width (Exceeds ADA standard 32" requirement).
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold">Roll-In Shower &amp; Bathroom</strong>
                        <span className="text-slate-600">
                          {stay.accessibility.rollInShower 
                            ? 'Zero-threshold roll-in rain shower with 34" wall grab bars & fold bench.'
                            : 'Standard tub with grab bars (portable transfer bench available).'}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold">Sensory &amp; Hearing Accommodations</strong>
                        <span className="text-slate-600">
                          Visual strobe smoke detectors, emergency vibrating bed shaker, and high-contrast thermostat.
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                        ✓
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold">Service Animal Policy</strong>
                        <span className="text-slate-600">
                          Guaranteed $0 surcharge by law; complimentary water bowl &amp; relief garden map provided.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>100% Online Accessibility Verification Guarantee — No phone calls needed.</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-200/80 px-2 py-0.5 rounded font-mono">
                      Guaranteed Fit
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Price Breakdown & Next Step Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">Reservation Summary</span>
              <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{stay.name}</h3>
              <p className="text-xs text-slate-500">
                Oct {selectedStartDay} – Oct {selectedEndDay}, 2026 ({nights} nights)
              </p>
            </div>

            {/* Price Preview Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs" {...(mode === 'verygood' && { 'aria-live': 'polite', 'aria-atomic': 'true' })}>
              <div className="flex justify-between text-slate-600">
                <span>Accommodation ({nights} nights × ${pricingPreview.basePrice})</span>
                <span className="font-mono font-medium text-slate-900">${pricingPreview.nightsTotal}</span>
              </div>

              {(mode === 'good' || mode === 'verygood') ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Eco occupancy taxes (10%)</span>
                    <span className="font-mono font-medium text-slate-900">${pricingPreview.taxes}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Cleaning & Hospitality Prep</span>
                    <span className="font-mono">Included ($0)</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-base text-slate-900">
                    <span>Estimated Total</span>
                    <span className="font-mono text-xl text-emerald-700">${pricingPreview.grandTotal}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Exact total upfront. No hidden check-out charges.</span>
                  </p>
                </>
              ) : (
                <>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                    <span className="font-bold">⚠️ Drip Pricing Trap:</span> Additional mandatory resort, sanitation, and platform fees ($111+) will be added at checkout!
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-base text-slate-900">
                    <span>Deceptive Subtotal</span>
                    <span className="font-mono text-xl text-rose-600">${pricingPreview.nightsTotal}*</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block italic">
                    *plus unknown fees determined upon entering credit card
                  </span>
                </>
              )}
            </div>

            {/* Next Button */}
            <button
              id="btn-proceed-to-addons"
              type="button"
              onClick={mode === 'bad' ? handleBadUxSubmit : onProceed}
              {...(mode === 'verygood' && { 'aria-label': `Continue to accessible add-ons, estimated total $${pricingPreview.grandTotal}` })}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center space-x-2 ${
                mode === 'good'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : mode === 'verygood'
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : mode === 'bad'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <span>{mode === 'bad' ? 'RUSH TO NEXT STEP (SAVE MY ROOM)' : mode === 'verygood' ? 'Continue to Accessible Add-ons ♿' : 'Continue to Optional Add-ons'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-slate-500">
              {mode === 'verygood'
                ? `Free cancellation up to ${stay.cancellationFreeDays} days • Keyboard-navigable add-ons ahead`
                : `Free cancellation up to ${stay.cancellationFreeDays} days prior to check-in`}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
