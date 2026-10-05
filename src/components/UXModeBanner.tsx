import React, { useState, useEffect } from 'react';
import { UXMode, FunnelStep, DisabilitySettings } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  Clock,
  Flame,
  Info,
  ChevronRight,
  Sparkles,
  DollarSign,
  HeartHandshake,
  Check,
  Activity,
  Star
} from 'lucide-react';

interface UXModeBannerProps {
  mode: UXMode;
  currentStep: FunnelStep;
  onOpenConflictModal: () => void;
  onSwitchMode: (newMode: UXMode) => void;
  onOpenEffectivenessDashboard?: () => void;
  disabilitySettings?: DisabilitySettings;
  onOpenDisabilityBar?: () => void;
}

export const UXModeBanner: React.FC<UXModeBannerProps> = ({
  mode,
  currentStep,
  onOpenConflictModal,
  onSwitchMode,
  onOpenEffectivenessDashboard,
  disabilitySettings,
  onOpenDisabilityBar,
}) => {
  // Bad UX simulated countdown
  const [badTimerSeconds, setBadTimerSeconds] = useState(294); // 4m 54s
  const [fakeToast, setFakeToast] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== 'bad') return;

    const timer = setInterval(() => {
      setBadTimerSeconds(prev => (prev > 10 ? prev - 1 : 299));
    }, 1000);

    // Occasional intrusive toast in Bad UX to demonstrate fabricated social proof
    const toasts = [
      '🔥 Someone in Hamburg just booked a villa in Big Sur 3 mins ago!',
      '🚨 High demand! 91% of properties booked for your dates!',
      '⚡ 38 other travelers are currently viewing this page!'
    ];

    const toastInterval = setInterval(() => {
      const randomToast = toasts[Math.floor(Math.random() * toasts.length)];
      setFakeToast(randomToast);
      setTimeout(() => setFakeToast(null), 5000);
    }, 14000);

    return () => {
      clearInterval(timer);
      clearInterval(toastInterval);
    };
  }, [mode]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside aria-label="UX Mode Diagnostic Banner" className="relative z-30">
      {/* Disability Accommodation Active Bar */}
      {disabilitySettings?.enabled && (
        <div className="bg-sky-900 text-white py-1.5 px-4 text-xs border-b border-sky-800 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="font-bold flex items-center gap-1.5 text-sky-200">
                <HeartHandshake className="w-3.5 h-3.5 text-sky-300" />
                Disability Accommodations Active:
              </span>
              <div className="flex flex-wrap gap-1 text-[11px]">
                {disabilitySettings.highContrast && <span className="bg-sky-800 px-2 py-0.5 rounded text-sky-100 font-mono">WCAG AAA Contrast</span>}
                {disabilitySettings.largeText && <span className="bg-sky-800 px-2 py-0.5 rounded text-sky-100 font-mono">110% Font Scale</span>}
                {disabilitySettings.reducedMotion && <span className="bg-sky-800 px-2 py-0.5 rounded text-sky-100 font-mono">Reduced Motion</span>}
                {disabilitySettings.dyslexicFont && <span className="bg-sky-800 px-2 py-0.5 rounded text-sky-100 font-mono">Dyslexia Spacing</span>}
                {disabilitySettings.motorAssistance && <span className="bg-sky-800 px-2 py-0.5 rounded text-sky-100 font-mono">48px Touch Targets</span>}
                {disabilitySettings.screenReaderHelper && <span className="bg-emerald-800 px-2 py-0.5 rounded text-emerald-100 font-mono">Screen Reader HUD</span>}
                {disabilitySettings.mobilityFilter !== 'all' && (
                  <span className="bg-amber-800 px-2 py-0.5 rounded text-amber-100 font-mono">
                    Filter: {disabilitySettings.mobilityFilter}
                  </span>
                )}
              </div>
            </div>

            {onOpenDisabilityBar && (
              <button
                onClick={onOpenDisabilityBar}
                className="text-[11px] underline text-sky-300 hover:text-white font-medium ml-auto"
              >
                Customize A11y Tools &amp; Presets
              </button>
            )}
          </div>
        </div>
      )}

      {/* Intrusive Bad UX Toast Notification */}
      {mode === 'bad' && fakeToast && (
        <div className="fixed bottom-5 left-5 z-50 max-w-sm bg-rose-950 text-rose-100 border border-rose-700/80 rounded-xl p-3 shadow-xl flex items-start space-x-3 text-xs animate-shake">
          <div className="p-1 bg-rose-600 rounded-lg text-white mt-0.5 shrink-0">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between font-bold text-white mb-0.5">
              <span>Dark Pattern Alert: Fabricated Urgency</span>
              <button 
                onClick={() => setFakeToast(null)} 
                className="text-rose-300 hover:text-white ml-2 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-rose-200">{fakeToast}</p>
            <p className="mt-1 text-[10px] text-rose-400 italic">
              Common deceptive practice outlawed by EU & UK CMA regulations.
            </p>
          </div>
        </div>
      )}

      {/* Main Mode Indicator Bar */}
      {mode === 'good' && (
        <div className="bg-emerald-50 border-b border-emerald-200/80 text-emerald-900 py-2.5 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-800">
                <Sparkles className="w-3 h-3" />
              </span>
              <span className="font-bold text-emerald-950">Ethical UX Attitude:</span>
              <span className="text-emerald-800">
                All-in upfront pricing • Honest live inventory • Calm date selection • No pre-ticked upsells • 1-click test fill
              </span>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              {onOpenEffectivenessDashboard && (
                <button
                  id="btn-banner-effectiveness-good"
                  onClick={onOpenEffectivenessDashboard}
                  className="inline-flex items-center space-x-1 font-semibold text-emerald-900 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200 px-2 py-0.5 rounded transition"
                  title="Compare Time-on-Task, Error Rates, and Sentiment"
                >
                  <Activity className="w-3 h-3 text-emerald-700" />
                  <span>Effectiveness Metrics</span>
                </button>
              )}
              <button
                id="btn-inspect-good-ux"
                onClick={onOpenConflictModal}
                className="inline-flex items-center font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
              >
                <span>Why this builds trust & LTV</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
              <button
                id="btn-quick-try-bad"
                onClick={() => onSwitchMode('bad')}
                className="px-2 py-0.5 rounded bg-emerald-200/70 hover:bg-emerald-200 text-emerald-900 font-medium transition"
              >
                Switch to Bad UX
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'bad' && (
        <div className="bg-rose-50 border-b border-rose-300 text-rose-950 py-2.5 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-200 text-rose-800 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
              </span>
              <div>
                <span className="font-bold text-rose-900 mr-2">Dark Pattern Simulation Active:</span>
                <span className="text-rose-800">
                  Drip pricing ($111+ hidden fees ahead) • Pre-checked $113 insurance • Confirmshaming • Hostile form fields
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-rose-200/90 text-rose-950 font-bold tracking-tight">
                <Clock className="w-3.5 h-3.5 text-rose-700 animate-spin" />
                <span>Simulated Fake Timer: {formatTimer(badTimerSeconds)}</span>
              </div>

              {onOpenEffectivenessDashboard && (
                <button
                  id="btn-banner-effectiveness-bad"
                  onClick={onOpenEffectivenessDashboard}
                  className="inline-flex items-center space-x-1 font-semibold text-rose-900 hover:text-rose-950 bg-rose-100/90 hover:bg-rose-200 px-2 py-0.5 rounded transition"
                  title="Compare Time-on-Task, Error Rates, and Sentiment"
                >
                  <Activity className="w-3 h-3 text-rose-700" />
                  <span>Effectiveness Metrics</span>
                </button>
              )}

              <button
                id="btn-inspect-bad-ux"
                onClick={onOpenConflictModal}
                className="inline-flex items-center font-semibold text-rose-800 hover:text-rose-950 underline underline-offset-2"
              >
                <span>Audit This Screen's UX Traps</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'verygood' && (
        <div className="bg-violet-50 border-b border-violet-200/80 text-violet-900 py-2.5 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-200 text-violet-800">
                <Star className="w-3 h-3" />
              </span>
              <span className="font-bold text-violet-950">Very Good UX — Enhanced Accessibility:</span>
              <span className="text-violet-800">
                aria-live regions • htmlFor bindings • keyboard navigation • inputMode • autoComplete • WCAG AA contrast
              </span>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              {onOpenEffectivenessDashboard && (
                <button
                  onClick={onOpenEffectivenessDashboard}
                  className="inline-flex items-center space-x-1 font-semibold text-violet-900 hover:text-violet-950 bg-violet-100/90 hover:bg-violet-200 px-2 py-0.5 rounded transition"
                >
                  <Activity className="w-3 h-3 text-violet-700" />
                  <span>Effectiveness Metrics</span>
                </button>
              )}
              <button
                onClick={() => onSwitchMode('good')}
                className="px-2 py-0.5 rounded bg-violet-200/70 hover:bg-violet-200 text-violet-900 font-medium transition"
              >
                Compare with Good UX
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'compare' && (
        <div className="bg-indigo-50 border-b border-indigo-200 text-indigo-950 py-2.5 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-200 text-indigo-800">
                <Scale className="w-3 h-3" />
              </span>
              <span className="font-bold text-indigo-950">Side-by-Side UX Audit Mode:</span>
              <span className="text-indigo-800">
                Directly examine how each booking step resolves user-business tension.
              </span>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              {onOpenEffectivenessDashboard && (
                <button
                  id="btn-banner-effectiveness-compare"
                  onClick={onOpenEffectivenessDashboard}
                  className="inline-flex items-center space-x-1 font-semibold text-indigo-900 hover:text-indigo-950 bg-indigo-100 hover:bg-indigo-200 px-2 py-0.5 rounded transition"
                  title="Compare Time-on-Task, Error Rates, and Sentiment"
                >
                  <Activity className="w-3 h-3 text-indigo-700" />
                  <span>Effectiveness Dashboard</span>
                </button>
              )}
              <button
                id="btn-inspect-compare"
                onClick={onOpenConflictModal}
                className="inline-flex items-center font-semibold text-indigo-700 hover:text-indigo-950 underline underline-offset-2"
              >
                <span>Explore full Nielsen Norman UX Heuristics Table</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
