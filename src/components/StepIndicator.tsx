import React from 'react';
import { FunnelStep, UXMode } from '../types';
import { Check, ArrowLeft, AlertCircle, HelpCircle, Clock } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: FunnelStep;
  mode: UXMode;
  onNavigateStep: (step: FunnelStep) => void;
  canNavigateTo: (step: FunnelStep) => boolean;
}

const STEPS: { id: FunnelStep; label: string; timeEstimate: string }[] = [
  { id: 'browse', label: '1. Discover Stays', timeEstimate: '~30s' },
  { id: 'details', label: '2. Dates & Room', timeEstimate: '~45s' },
  { id: 'addons', label: '3. Optional Add-ons', timeEstimate: '~20s' },
  { id: 'checkout', label: '4. Guest & Payment', timeEstimate: '~1 min' },
  { id: 'confirmation', label: '5. Confirmation', timeEstimate: 'Done' }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  mode,
  onNavigateStep,
  canNavigateTo
}) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Navigation / Back Action */}
        <div className="flex items-center space-x-2">
          {currentIndex > 0 && currentStep !== 'confirmation' && (
            <div className="flex items-center gap-2">
              <button
                id="btn-nav-back"
                onClick={() => onNavigateStep(STEPS[currentIndex - 1].id)}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to {STEPS[currentIndex - 1].label.split('. ')[1]}</span>
              </button>
              {mode === 'bad' && (
                <span className="text-[10px] text-rose-600 font-semibold">⚠ Going back erases your form data!</span>
              )}
              {(mode === 'good' || mode === 'verygood') && (
                <span className="text-[10px] text-emerald-600 font-semibold">✓ Your data is saved</span>
              )}
            </div>
          )}

          {mode === 'good' ? (
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              Total estimated checkout time: <strong className="text-slate-700 font-semibold">~2 minutes</strong>
            </span>
          ) : mode === 'verygood' ? (
            <span className="text-xs text-violet-600 hidden sm:inline-block font-semibold">
              Very Good UX: ~2 min • aria-live • keyboard nav • WCAG AA
            </span>
          ) : mode === 'bad' ? (
            <span className="text-xs text-rose-700 font-semibold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Bad UX Trap: Vague progress & hidden extra steps ahead!</span>
            </span>
          ) : null}
        </div>

        {/* Steps Bar */}
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto pb-1 md:pb-0">
          {STEPS.map((step, idx) => {
            const isCurrent = step.id === currentStep;
            const isCompleted = idx < currentIndex;
            const isClickable = canNavigateTo(step.id);

            // In Bad UX: step names are intentionally misleading to illustrate the conflict
            let displayLabel = step.label;
            if (mode === 'bad') {
              if (idx === 1) displayLabel = '2. Lock Rate NOW';
              if (idx === 2) displayLabel = '3. Essential Protection';
              if (idx === 3) displayLabel = '4. Final Step (Not really)';
            }

            return (
              <div key={step.id} className="flex items-center space-x-2 shrink-0">
                <button
                  disabled={!isClickable && !isCurrent}
                  onClick={() => onNavigateStep(step.id)}
                  className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full transition-all ${
                    isCurrent
                      ? mode === 'good'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : mode === 'verygood'
                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                        : mode === 'bad'
                        ? 'bg-rose-600 text-white font-bold shadow-xs'
                        : 'bg-indigo-600 text-white font-bold shadow-xs'
                      : isCompleted
                      ? 'bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/10 font-mono">
                    {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="whitespace-nowrap">{displayLabel}</span>
                  {isCurrent && (mode === 'good' || mode === 'verygood') && step.timeEstimate !== 'Done' && (
                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] opacity-80 font-normal">
                      <Clock className="w-2.5 h-2.5" />
                      {step.timeEstimate}
                    </span>
                  )}
                </button>
                {idx < STEPS.length - 1 && (
                  <div className="w-3 sm:w-6 h-0.5 bg-slate-200 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
