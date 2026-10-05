import React, { useState } from 'react';
import { Stay, UXMode, DisabilitySettings } from '../../types';
import { 
  Star, 
  MapPin, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Flame, 
  SlidersHorizontal,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  HeartHandshake,
  Check
} from 'lucide-react';

interface SearchDiscoveryStepProps {
  stays: Stay[];
  selectedStay: Stay;
  onSelectStay: (stay: Stay) => void;
  onProceed: () => void;
  mode: UXMode;
  onOpenConflictModal: () => void;
  disabilitySettings?: DisabilitySettings;
  onOpenDisabilityBar?: () => void;
}

export const SearchDiscoveryStep: React.FC<SearchDiscoveryStepProps> = ({
  stays,
  selectedStay,
  onSelectStay,
  onProceed,
  mode,
  onOpenConflictModal,
  disabilitySettings,
  onOpenDisabilityBar,
}) => {
  const [filterGuests, setFilterGuests] = useState<number>(2);
  const [filterFreeCancelOnly, setFilterFreeCancelOnly] = useState<boolean>(false);
  const [showPriceBreakdownId, setShowPriceBreakdownId] = useState<string | null>(null);

  const filteredStays = stays.filter(stay => {
    if (stay.maxGuests < filterGuests) return false;
    if (filterFreeCancelOnly && stay.cancellationFreeDays <= 0) return false;
    
    // Mobility & Disability filter logic
    if (disabilitySettings?.enabled && disabilitySettings.mobilityFilter !== 'all') {
      if (disabilitySettings.mobilityFilter === 'step-free' && !stay.accessibility?.stepFreeEntrance) {
        return false;
      }
      if (disabilitySettings.mobilityFilter === 'roll-in-shower' && !stay.accessibility?.rollInShower) {
        return false;
      }
      if (disabilitySettings.mobilityFilter === 'visual-alarms' && !stay.accessibility?.visualSmokeAlarm) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro Context Banner */}
      <div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              <span>Step 1 of 4</span>
              <span>•</span>
              <span>Search & Price Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'good'
                ? 'Curated Eco-Luxury Stays with All-In Honest Pricing'
                : mode === 'verygood'
                ? 'Curated Stays — Accessible & Screen-Reader Friendly'
                : mode === 'bad'
                ? '⚡ Flash Travel Sales! (Drip Pricing Simulation)'
                : 'Discovery & Price Transparency UX Comparison'}
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              {mode === 'good'
                ? 'Every rate displayed is the complete total per night. No surprise resort fees, cleaning fees, or unexpected checkouts.'
                : mode === 'verygood'
                ? 'Honest all-in pricing + enhanced accessibility: aria-live price updates, keyboard navigation, proper label bindings.'
                : mode === 'bad'
                ? 'Notice how rates appear artificially low ($129/nt), with manufactured urgency badges to pressure you before fees are revealed.'
                : 'Compare how pricing and urgency cues alter user perception, emotional stress, and long-term brand equity.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenConflictModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition shadow-xs"
            >
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Analyze UX Conflict #1: Drip Pricing</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              {mode === 'verygood' ? <label htmlFor="filter-guests" className="font-semibold text-slate-700">Guests:</label> : <span className="font-semibold text-slate-700">Guests:</span>}
              <select
                id="filter-guests"
                value={filterGuests}
                onChange={e => setFilterGuests(Number(e.target.value))}
                {...(mode === 'verygood' && { 'aria-label': `Select number of guests, currently ${filterGuests}` })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4+ Guests</option>
              </select>
            </div>

            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={Boolean(filterFreeCancelOnly)}
                onChange={e => setFilterFreeCancelOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Free cancellation only</span>
            </label>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredStays.length}</strong> verified sanctuaries
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStays.map(stay => {
          const isSelected = selectedStay.id === stay.id;
          const showBreakdown = showPriceBreakdownId === stay.id;

          return (
            <div
              key={stay.id}
              id={`stay-card-${stay.id}`}
              onClick={() => onSelectStay(stay)}
              {...(mode === 'verygood' && {
                role: 'button',
                tabIndex: 0,
                'aria-label': `${stay.name}, ${stay.location}, $${stay.basePricePerNight} per night, ${stay.rating.toFixed(1)} stars, ${isSelected ? 'currently selected' : 'not selected'}`,
                onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectStay(stay); } },
              })}
              className={`group relative bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                isSelected
                  ? mode === 'good'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : mode === 'verygood'
                    ? 'border-violet-500 ring-2 ring-violet-500/20 shadow-md'
                    : mode === 'bad'
                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                    : 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={stay.image}
                  alt={mode === 'verygood' ? `Photo of ${stay.name}, ${stay.location}, rated ${stay.rating.toFixed(1)} stars` : stay.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 shadow-xs flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{stay.rating.toFixed(2)}</span>
                  <span className="text-slate-500 font-normal">({stay.reviewCount})</span>
                </div>

                {/* Bad UX Fake Urgency Overlays */}
                {mode === 'bad' && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-md flex items-center space-x-1 animate-pulse">
                    <Flame className="w-3 h-3" />
                    <span>ONLY 1 ROOM LEFT!</span>
                  </div>
                )}

                {/* Good/VeryGood UX Calm Badge */}
                {(mode === 'good' || mode === 'verygood') && (
                  <div className="absolute top-3 right-3 bg-emerald-700/90 text-white px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-xs flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    <span>{stay.availableRooms} suites open</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-xs text-slate-500 space-x-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{stay.location}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                    {stay.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {stay.tagline}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {stay.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Accessibility Spec & Disability Mode Highlights */}
                  {mode === 'good' || mode === 'verygood' || disabilitySettings?.enabled ? (
                    stay.accessibility?.wheelchairAccessible ? (
                      <div className="mt-3 p-2 rounded-xl bg-sky-50/90 border border-sky-200 text-[11px] text-sky-950 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-sky-700">♿ 36" Step-Free</span>
                          <span>•</span>
                          <span>🚿 Roll-In Shower</span>
                        </div>
                        <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded font-mono">
                          Audited ADA
                        </span>
                      </div>
                    ) : (
                      <div className="mt-3 p-2 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-950 flex items-center justify-between">
                        <span>⚠️ Historic 6" step entrance (ramp available)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded font-mono">
                          Honest Info
                        </span>
                      </div>
                    )
                  ) : (
                    /* Bad UX: Vague token accessibility with caller burden */
                    <div className="mt-3 p-2 rounded-xl bg-slate-100/90 border border-slate-200 text-[10px] text-slate-500 leading-tight">
                      <span className="font-bold text-slate-700">♿ Accessible Room*</span>
                      <span className="block text-[9px] text-slate-400 mt-0.5">
                        *Physical doorway &amp; shower dimensions unverified. Guest must call front desk.
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing Block - The Core UX Contrast */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  {(mode === 'good' || mode === 'verygood') ? (
                    /* Good UX: Upfront, All-In, Transparent */
                    <div {...(mode === 'verygood' && { 'aria-live': 'polite', 'aria-atomic': 'true' })}>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-xl font-extrabold text-slate-900">
                              ${stay.basePricePerNight}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">/ night</span>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3 shrink-0" />
                            <span>All-in rate • Zero surprise fees</span>
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPriceBreakdownId(showBreakdown ? null : stay.id);
                          }}
                          {...(mode === 'verygood' && { 'aria-expanded': showBreakdown, 'aria-label': 'Toggle price itemization breakdown' })}
                          className="text-[11px] font-semibold text-slate-600 hover:text-emerald-700 underline underline-offset-2"
                        >
                          {showBreakdown ? 'Hide itemization' : 'Price itemization'}
                        </button>
                      </div>

                      {/* Transparent Price Itemization Dropdown */}
                      {showBreakdown && (
                        <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200/80 space-y-1">
                          <div className="flex justify-between">
                            <span>Base accommodation</span>
                            <span className="font-mono font-medium text-slate-800">${stay.basePricePerNight - 24}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Included cleaning & linen prep</span>
                            <span className="font-mono font-medium text-slate-800">$0 (included)</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Eco tourist hospitality tax (10%)</span>
                            <span className="font-mono font-medium text-slate-800">$24</span>
                          </div>
                          <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                            <span>Total night rate:</span>
                            <span className="font-mono">${stay.basePricePerNight}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : mode === 'bad' ? (
                    /* Bad UX: Drip Pricing Bait */
                    <div>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-rose-500 line-through font-mono">
                              ${stay.basePricePerNight * 2}
                            </span>
                            <span className="text-xl font-extrabold text-rose-600">
                              ${stay.fakeBaitPricePerNight}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">/ night*</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 italic">
                            *excludes taxes, resort fees & mandatory cleaning added at checkout
                          </p>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                          55% OFF
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-rose-700 bg-rose-50 rounded-lg p-1.5 border border-rose-200 flex items-center space-x-1">
                        <Flame className="w-3 h-3 text-rose-600 shrink-0" />
                        <span>38 people viewed this in the last 15 minutes!</span>
                      </div>
                    </div>
                  ) : (
                    /* Compare Mode: Show both side by side */
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                        <span className="font-bold text-emerald-900">Good UX:</span>{' '}
                        <span className="font-extrabold text-emerald-950">${stay.basePricePerNight}</span>/night (Total all-in upfront)
                      </div>
                      <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                        <span className="font-bold text-rose-900">Bad UX:</span>{' '}
                        <span className="font-extrabold text-rose-700">${stay.fakeBaitPricePerNight}</span>/night* (Drips +$111 at payment)
                      </div>
                    </div>
                  )}

                  {/* Select CTA */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStay(stay);
                        onProceed();
                      }}
                      {...(mode === 'verygood' && { 'aria-label': `Select ${stay.name} and configure dates, $${stay.basePricePerNight} per night` })}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center space-x-1.5 ${
                        isSelected
                          ? mode === 'good'
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : mode === 'verygood'
                            ? 'bg-violet-600 hover:bg-violet-700 text-white'
                            : mode === 'bad'
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>
                        {mode === 'bad'
                          ? 'LOCK IN THIS DEAL BEFORE IT EXPIRES'
                          : mode === 'verygood'
                          ? 'Select & Configure Dates ♿'
                          : 'Select & Configure Dates'}
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
