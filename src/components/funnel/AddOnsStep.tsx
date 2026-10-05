import React, { useState } from 'react';
import { Stay, AddOnItem, UXMode } from '../../types';
import { calculateBookingPrice } from '../../utils/pricing';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  HelpCircle, 
  ArrowRight,
  Info,
  XCircle,
  Clock,
  Car,
  HeartHandshake
} from 'lucide-react';

interface AddOnsStepProps {
  stay: Stay;
  nights: number;
  availableAddOns: AddOnItem[];
  selectedAddOnIds: string[];
  onToggleAddOn: (addonId: string) => void;
  onProceed: () => void;
  mode: UXMode;
  onOpenConflictModal: () => void;
}

export const AddOnsStep: React.FC<AddOnsStepProps> = ({
  stay,
  nights,
  availableAddOns,
  selectedAddOnIds,
  onToggleAddOn,
  onProceed,
  mode,
  onOpenConflictModal,
}) => {
  // Confirmshaming modal state in Bad UX
  const [showShameModal, setShowShameModal] = useState<boolean>(false);
  const [shamedAddonId, setShamedAddonId] = useState<string | null>(null);

  const handleToggle = (addon: AddOnItem) => {
    const isCurrentlySelected = selectedAddOnIds.includes(addon.id);

    // In Bad UX, if user tries to UNCHECK a pre-checked protection item, confirmshame them!
    if (mode === 'bad' && isCurrentlySelected && addon.badUxConfirmShameText) {
      setShamedAddonId(addon.id);
      setShowShameModal(true);
      return;
    }

    onToggleAddOn(addon.id);
  };

  const handleConfirmShameUncheck = () => {
    if (shamedAddonId) {
      onToggleAddOn(shamedAddonId);
    }
    setShowShameModal(false);
    setShamedAddonId(null);
  };

  const pricing = calculateBookingPrice(
    stay, 
    nights, 
    selectedAddOnIds, 
    availableAddOns, 
    mode === 'bad' ? 'bad' : 'good' // verygood uses good pricing
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Confirmshaming Modal (Simulated Bad UX Dark Pattern) */}
      {showShameModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-rose-500 shadow-2xl animate-shake">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Dark Pattern: Confirmshaming & Loss Aversion</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Are you completely certain you want to risk financial liability?
            </h3>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Without the Comprehensive Trip & Damage Shield, unexpected travel disruptions, flight cancellations, or accidental room spills could cost you up to <strong className="text-rose-600">$1,500+ out of pocket</strong>.
            </p>

            <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 font-medium italic">
              "94% of smart guests keep protection active to prevent ruined vacations."
            </div>

            {/* The Coercive Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setShowShameModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
              >
                Keep Protection Active (Recommended)
              </button>

              <button
                type="button"
                onClick={handleConfirmShameUncheck}
                className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-600 underline text-center block"
              >
                No thanks, I prefer risking my savings and having zero emergency recourse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <span>Step 3 of 4</span>
            <span>•</span>
            <span>Customization & Add-ons</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'good'
              ? 'Enhance Your Sanctuary Experience (Optional)'
              : mode === 'verygood'
              ? 'Enhance Your Experience — Fully Accessible (Optional)'
              : mode === 'bad'
              ? 'Recommended Stay Enhancements (Pre-Selected)'
              : 'Add-on Consent & Sneak-in Basket Comparison'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {mode === 'good'
              ? 'All upgrades are voluntary opt-ins. Check your personal credit card first to avoid paying for coverage you already possess.'
              : mode === 'verygood'
              ? 'All upgrades are voluntary opt-ins with full keyboard navigation, screen reader support, and WCAG AA contrast.'
              : mode === 'bad'
              ? 'Notice how expensive items are pre-selected in your cart by default, exploiting default inertia and confirmshaming.'
              : 'Compare transparent modular consent versus opt-out traps.'}
          </p>
        </div>

        <button
          onClick={onOpenConflictModal}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition shadow-xs self-start"
        >
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Analyze UX Conflict #3: Sneak-In Basket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Add-ons List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {availableAddOns.map(addon => {
            const isSelected = selectedAddOnIds.includes(addon.id);
            const priceLabel = addon.perNight 
              ? `$${addon.price} / night ($${addon.price * nights} total)`
              : `$${addon.price} flat fee`;

            return (
              <div
                key={addon.id}
                id={`addon-card-${addon.id}`}
                role="checkbox"
                aria-checked={isSelected}
                aria-label={`${addon.name} - $${addon.perNight ? addon.price * nights : addon.price}`}
                tabIndex={0}
                onClick={() => handleToggle(addon)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(addon); } }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isSelected
                    ? mode === 'good'
                      ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/10 shadow-xs'
                      : mode === 'verygood'
                      ? 'bg-violet-50/50 border-violet-400 ring-2 ring-violet-500/10 shadow-xs'
                      : mode === 'bad'
                      ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-500/10 shadow-xs'
                      : 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-500/10 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  {/* Custom Checkbox */}
                  <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all ${
                    isSelected
                      ? mode === 'good'
                        ? 'bg-emerald-600 text-white'
                        : mode === 'verygood'
                        ? 'bg-violet-600 text-white'
                        : mode === 'bad'
                        ? 'bg-rose-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'border-2 border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-slate-900">{addon.name}</h3>
                      {mode === 'bad' && addon.isPrecheckedInBadUx && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          PRE-SELECTED (+$
                          {addon.perNight ? addon.price * nights : addon.price})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {addon.description}
                    </p>

                    {addon.isDisabilityService && (
                      <div className={`mt-2 p-2 rounded-lg text-[11px] ${
                        mode === 'bad' 
                          ? 'bg-rose-100 text-rose-900 border border-rose-200' 
                          : 'bg-sky-50 text-sky-900 border border-sky-200'
                      }`}>
                        {mode === 'bad' ? (
                          <span>
                            <strong>Host Discriminatory Charge Notice:</strong> Some unethical booking sites slip in a $60 "sanitation surcharge" for guide dogs, which violates ADA Title III federal regulations.
                          </span>
                        ) : (
                          <span>
                            <strong>Legal Protection Guarantee:</strong> Under the Americans with Disabilities Act &amp; European Accessibility Act, hotels cannot charge pet fees, deposits, or surcharges for service animals.
                          </span>
                        )}
                      </div>
                    )}

                    {(mode === 'good' || mode === 'verygood') && addon.category === 'protection' && (
                      <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Empathetic UX tip: Check if your credit card already provides primary rental/trip shield.</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-sm text-slate-900 block">
                    ${addon.perNight ? addon.price * nights : addon.price}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {addon.perNight ? `(${nights} nights)` : 'One-time'}
                  </span>
                </div>
              </div>
            );
          })}

          {mode === 'bad' && (
            <div className="p-4 rounded-xl bg-rose-100/70 border border-rose-300 text-rose-950 text-xs">
              <strong className="block font-bold mb-1">Notice the Sneak-In Dark Pattern:</strong>
              Notice how the subtotal quietly inflated because services were pre-selected for you without explicit opt-in. In ethical UX, all optional upgrades must require an affirmative, intentional click.
            </div>
          )}
        </div>

        {/* Price & Checkout Review Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div>
              <span className="text-xs font-bold uppercase text-slate-600">Live Breakdown</span>
              <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">{stay.name}</h3>
              <p className="text-xs text-slate-500">
                {nights} nights • {selectedAddOnIds.length} add-on{selectedAddOnIds.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            <div aria-live="polite" aria-atomic="true" className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Nights accommodation</span>
                <span className="font-mono font-medium text-slate-900">${pricing.nightsTotal}</span>
              </div>

              {/* Add-ons line item */}
              <div className="flex justify-between text-slate-600">
                <span>Selected add-ons</span>
                <span className="font-mono font-medium text-slate-900">${pricing.selectedAddOnsTotal}</span>
              </div>

              {/* Mandatory taxes / fees */}
              {pricing.mandatoryFees.map((fee, i) => (
                <div key={i} className="flex justify-between text-slate-500 text-[11px]">
                  <span>{fee.name}</span>
                  <span className="font-mono">${fee.amount}</span>
                </div>
              ))}

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline font-extrabold text-base text-slate-900">
                <span>Total Due</span>
                <span className={`font-mono text-xl ${
                  mode === 'good' ? 'text-emerald-700' : mode === 'verygood' ? 'text-violet-700' : 'text-rose-600'
                }`}>
                  ${pricing.grandTotal}
                </span>
              </div>
            </div>

            <button
              id="btn-proceed-to-checkout"
              type="button"
              onClick={onProceed}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center space-x-2 ${
                mode === 'good'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : mode === 'verygood'
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : mode === 'bad'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <span>{mode === 'verygood' ? 'Continue to Accessible Checkout ♿' : mode === 'bad' ? 'PROCEED TO PAYMENT (NO GOING BACK)' : 'Continue to Guest Details & Payment'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center text-xs text-slate-600">
              {mode === 'verygood' ? 'Accessible checkout with keyboard nav, autoComplete & screen reader support' : 'Zero payment commitment until the next step'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
