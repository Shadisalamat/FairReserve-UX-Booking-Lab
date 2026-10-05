import React from 'react';
import { UXMode, FunnelStep, DisabilitySettings } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  Scale,
  RotateCcw,
  BookOpen,
  Sparkles,
  Info,
  Zap,
  HeartHandshake,
  Activity,
  Star,
  Award
} from 'lucide-react';

interface HeaderProps {
  mode: UXMode;
  onModeChange: (mode: UXMode) => void;
  currentStep: FunnelStep;
  onReset: () => void;
  onOpenKnowledgeHub: () => void;
  onOpenSimultaneousSimulator?: () => void;
  onOpenEffectivenessDashboard?: () => void;
  onOpenContributionShowcase?: () => void;
  disabilitySettings?: DisabilitySettings;
  onOpenDisabilityBar?: () => void;
  activeConflictsCount: number;
  fontScale?: number;
  onFontScaleChange?: (scale: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  currentStep,
  onReset,
  onOpenKnowledgeHub,
  onOpenSimultaneousSimulator,
  onOpenEffectivenessDashboard,
  onOpenContributionShowcase,
  disabilitySettings,
  onOpenDisabilityBar,
  activeConflictsCount,
  fontScale = 100,
  onFontScaleChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              mode === 'good'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                : mode === 'verygood'
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-200'
                : mode === 'bad'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-200 animate-pulse-subtle'
                : 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
            }`}>
              {mode === 'good' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : mode === 'verygood' ? (
                <Star className="w-5 h-5" />
              ) : mode === 'bad' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Scale className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">FairReserve</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                  UX Conflict Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Contrasting Dark Patterns vs Ethical UX in Real-Time Booking
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
            <button
              id="mode-btn-good"
              onClick={() => onModeChange('good')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'good'
                  ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="Experience transparent, ethical, and calm booking flow"
              aria-label="Switch to Good UX mode - transparent and ethical"
              aria-pressed={mode === 'good'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Good UX</span>
              <span className="hidden lg:inline text-[11px] font-normal text-emerald-600/80">(Clarity)</span>
            </button>

            <button
              id="mode-btn-bad"
              onClick={() => onModeChange('bad')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'bad'
                  ? 'bg-rose-50 text-rose-700 shadow-sm border border-rose-300'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
              title="Experience dark patterns, drip pricing, fake urgency, and form bloat"
              aria-label="Switch to Bad UX mode - dark patterns demonstration"
              aria-pressed={mode === 'bad'}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Bad UX</span>
              <span className="hidden lg:inline text-[11px] font-normal text-rose-600/80">(Dark Patterns)</span>
            </button>

            <button
              id="mode-btn-verygood"
              onClick={() => onModeChange('verygood')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'verygood'
                  ? 'bg-violet-50 text-violet-700 shadow-sm border border-violet-300'
                  : 'text-slate-600 hover:text-violet-600 hover:bg-violet-50/50'
              }`}
              title="Enhanced accessibility: aria-live, htmlFor, keyboard nav, better contrast"
              aria-label="Switch to Very Good UX mode - enhanced accessibility"
              aria-pressed={mode === 'verygood'}
            >
              <Star className="w-3.5 h-3.5 text-violet-600" />
              <span>Very Good</span>
              <span className="hidden lg:inline text-[11px] font-normal text-violet-600/80">(A11y+)</span>
            </button>

            <button
              id="mode-btn-compare"
              onClick={() => onModeChange('compare')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'compare'
                  ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
              title="Compare Bad UX vs Good UX vs Very Good UX side-by-side"
              aria-label="Switch to side-by-side comparison mode"
              aria-pressed={mode === 'compare'}
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            {onOpenDisabilityBar && (
              <button
                id="btn-disability-mode"
                onClick={onOpenDisabilityBar}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg border transition shadow-xs ${
                  disabilitySettings?.enabled
                    ? 'bg-sky-600 text-white border-sky-600 ring-2 ring-sky-300'
                    : 'bg-sky-50 text-sky-950 border-sky-300 hover:bg-sky-100'
                }`}
                title="Open Disability & Accessibility Accommodations Lab"
                aria-label="Disability and Accessibility settings"
              >
                <HeartHandshake className={`w-3.5 h-3.5 ${disabilitySettings?.enabled ? 'text-white' : 'text-sky-600'}`} />
                <span className="hidden sm:inline">Disability Mode</span>
                <span className="sm:hidden">A11y</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  disabilitySettings?.enabled ? 'bg-sky-800 text-white' : 'bg-sky-200 text-sky-900'
                }`}>
                  {disabilitySettings?.enabled ? 'ON' : 'OFF'}
                </span>
              </button>
            )}

            {onOpenSimultaneousSimulator && (
              <button
                id="btn-concurrency-sim"
                onClick={onOpenSimultaneousSimulator}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition shadow-xs"
                title="Test what happens when two guests book the same item at the same time"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="hidden md:inline">2 Guests Booking Same Item</span>
                <span className="md:hidden">2-Guest Sim</span>
              </button>
            )}

            {onOpenContributionShowcase && (
              <button
                id="btn-contribution-showcase"
                onClick={onOpenContributionShowcase}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-violet-900 bg-violet-50 border border-violet-200 hover:bg-violet-100 rounded-lg transition shadow-xs"
                title="View my accessibility contributions and how they improved metrics"
              >
                <Award className="w-3.5 h-3.5 text-violet-600" />
                <span className="hidden sm:inline">My Contribution</span>
              </button>
            )}

            {onOpenEffectivenessDashboard && (
              <button
                id="btn-effectiveness-dashboard"
                onClick={onOpenEffectivenessDashboard}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition shadow-xs"
                title="View empirical comparison of Time-on-Task, Error Rates, and User Sentiment"
              >
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">UX Effectiveness</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-indigo-200 text-indigo-800 rounded font-mono font-bold">
                  Metrics
                </span>
              </button>
            )}

            <button
              id="btn-knowledge-hub"
              onClick={onOpenKnowledgeHub}
              aria-label={`Open UX Conflict Matrix - ${activeConflictsCount} conflicts`}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">UX Conflict Matrix</span>
              <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold">
                {activeConflictsCount}
              </span>
            </button>

            {/* Text Resize Controls (Accessibility — Very Good UX) */}
            {onFontScaleChange && (
              <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 overflow-hidden" role="group" aria-label="Text size controls">
                <button
                  onClick={() => onFontScaleChange(Math.max(80, fontScale - 10))}
                  disabled={fontScale <= 80}
                  className="px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                  aria-label="Decrease text size"
                  title="Decrease text size"
                >
                  A−
                </button>
                <span className="px-1.5 text-[10px] font-mono text-slate-500 border-x border-slate-200">{fontScale}%</span>
                <button
                  onClick={() => onFontScaleChange(Math.min(140, fontScale + 10))}
                  disabled={fontScale >= 140}
                  className="px-2 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-30 transition"
                  aria-label="Increase text size"
                  title="Increase text size"
                >
                  A+
                </button>
              </div>
            )}

            <button
              id="btn-reset-flow"
              onClick={onReset}
              aria-label="Reset booking demo to beginning"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Reset booking demo back to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
