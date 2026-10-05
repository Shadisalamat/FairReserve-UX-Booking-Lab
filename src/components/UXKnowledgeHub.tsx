import React, { useState } from 'react';
import { UX_CONFLICTS } from '../data/uxConflicts';
import { UXConflictPoint, FunnelStep, UXMode } from '../types';
import {
  X,
  BookOpen,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Brain,
  SlidersHorizontal,
  Sparkles,
  Award
} from 'lucide-react';

interface UXKnowledgeHubProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (step: FunnelStep) => void;
  mode?: UXMode;
  onSwitchMode?: (mode: UXMode) => void;
}

export const UXKnowledgeHub: React.FC<UXKnowledgeHubProps> = ({
  isOpen,
  onClose,
  onJumpToStep,
  mode,
  onSwitchMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeConflictId, setActiveConflictId] = useState<string>(UX_CONFLICTS[0].id);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All 9 Conflicts' },
    { id: 'accessibility', label: 'Disability & Accessibility' },
    { id: 'concurrency', label: 'Race Conditions & Inventory' },
    { id: 'pricing', label: 'Pricing & Fees' },
    { id: 'urgency', label: 'Urgency & Scarcity' },
    { id: 'forms', label: 'Forms & Ergonomics' },
    { id: 'addons', label: 'Consent & Add-ons' },
    { id: 'transparency', label: 'Policies & Retention' }
  ];

  const filteredConflicts = UX_CONFLICTS.filter(conflict => {
    if (selectedCategory !== 'all' && conflict.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        conflict.title.toLowerCase().includes(q) ||
        conflict.badUxName.toLowerCase().includes(q) ||
        conflict.goodUxName.toLowerCase().includes(q) ||
        conflict.badUxCognitiveBias.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeConflict = UX_CONFLICTS.find(c => c.id === activeConflictId) || UX_CONFLICTS[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Booking UX Conflicts & Attitudes Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Comparing Dark Patterns, Cognitive Biases, and Ethical UX Solutions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search conflicts, biases, heuristics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Split Master-Detail Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Conflicts List (4 cols) */}
          <div className="md:col-span-4 border-r border-slate-200 overflow-y-auto max-h-[60vh] p-3 space-y-1.5 bg-slate-50/50">
            {filteredConflicts.map(item => {
              const isSelected = item.id === activeConflict.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveConflictId(item.id)}
                  className={`w-full text-left p-3 rounded-xl transition border text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-xs ring-1 ring-indigo-500/20'
                      : 'bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Step: {item.step}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <strong className="text-slate-900 font-bold block line-clamp-1">
                    {item.title}
                  </strong>
                  <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-500">
                    <span className="text-rose-600 font-medium truncate">🔴 {item.badUxName}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane (8 cols) */}
          <div className="md:col-span-8 overflow-y-auto max-h-[60vh] p-6 space-y-6 bg-white">
            
            {/* Conflict Title & Tension */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  UX Conflict Dossier • Step: {activeConflict.step.toUpperCase()}
                </span>

                <div className="flex items-center space-x-2">
                  {onSwitchMode && (
                    <>
                      <button
                        onClick={() => { onSwitchMode('verygood'); onJumpToStep(activeConflict.step); onClose(); }}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-violet-700 hover:text-violet-900 px-2 py-1 rounded-lg bg-violet-50 border border-violet-200"
                      >
                        <Award className="w-3 h-3" />
                        <span>Test Very Good</span>
                      </button>
                      <button
                        onClick={() => { onSwitchMode('good'); onJumpToStep(activeConflict.step); onClose(); }}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Test Good</span>
                      </button>
                      <button
                        onClick={() => { onSwitchMode('bad'); onJumpToStep(activeConflict.step); onClose(); }}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-rose-700 hover:text-rose-900 px-2 py-1 rounded-lg bg-rose-50 border border-rose-200"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Test Bad</span>
                      </button>
                    </>
                  )}
                  {!onSwitchMode && (
                    <button
                      onClick={() => { onJumpToStep(activeConflict.step); onClose(); }}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 underline"
                    >
                      <span>Test this step live</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {activeConflict.title}
              </h3>
              
              <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-bold block mb-0.5">The Business vs User Tension:</strong>
                {activeConflict.conflictSummary}
              </div>
            </div>

            {/* Bad UX vs Good UX vs Very Good UX Side-by-Side Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Bad UX Card */}
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
                <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Bad UX (Original)</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-rose-950">
                    {activeConflict.badUxName}
                  </h4>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    {activeConflict.badUxDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-200/60 text-[11px] text-rose-800">
                  <strong className="block text-rose-950 mb-0.5">User Harm:</strong>
                  {activeConflict.badUxHarm}
                </div>

                <div className="pt-2 border-t border-rose-200/60 text-[11px] text-rose-800">
                  <div className="flex items-center space-x-1 font-bold text-rose-950 mb-0.5">
                    <Brain className="w-3 h-3 text-rose-600" />
                    <span>Cognitive Bias:</span>
                  </div>
                  {activeConflict.badUxCognitiveBias}
                </div>
              </div>

              {/* Good UX Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Good UX (Original)</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    {activeConflict.goodUxName}
                  </h4>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    {activeConflict.goodUxDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                  <strong className="block text-emerald-950 mb-0.5">User Benefit:</strong>
                  {activeConflict.goodUxBenefit}
                </div>

                <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800">
                  <div className="flex items-center space-x-1 font-bold text-emerald-950 mb-0.5">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Heuristic:</span>
                  </div>
                  {activeConflict.heuristicViolated}
                </div>
              </div>

              {/* Very Good UX Card — My Contribution */}
              <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-200 space-y-2.5">
                <div className="flex items-center space-x-2 text-violet-800 font-bold text-xs">
                  <Award className="w-4 h-4 text-violet-600" />
                  <span>Very Good (My A11y Fixes)</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-violet-950">
                    {activeConflict.goodUxName} + A11y
                  </h4>
                  <p className="text-xs text-violet-900 mt-1 leading-relaxed">
                    {activeConflict.goodUxDescription} Enhanced with code-level accessibility: aria-live announcements, htmlFor label bindings, keyboard navigation, inputMode/autoComplete, and WCAG AA+ contrast.
                  </p>
                </div>

                <div className="pt-2 border-t border-violet-200/60 text-[11px] text-violet-800">
                  <strong className="block text-violet-950 mb-0.5">Measurable Improvement over Good:</strong>
                  SUS +3.6 (92.1), NPS +7 (+75), CES −0.6 (1.2), Funnel +5.8pp (84.2%), Chargebacks 0.2%
                </div>

                <div className="pt-2 border-t border-violet-200/60 text-[11px] text-violet-800">
                  <div className="flex items-center space-x-1 font-bold text-violet-950 mb-0.5">
                    <Sparkles className="w-3 h-3 text-violet-600" />
                    <span>Code Changes:</span>
                  </div>
                  aria-live regions, htmlFor bindings, tabIndex keyboard nav, inputMode="numeric", autoComplete="cc-number", WCAG AA contrast ratios
                </div>
              </div>

            </div>

            {/* Real World Impact Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs space-y-1">
              <div className="flex items-center space-x-2 text-amber-400 font-bold">
                <TrendingDown className="w-4 h-4" />
                <span>Real-World Business Impact & Legal Regulations</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeConflict.realWorldImpact}
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Inspired by Nielsen Norman Heuristics, Harry Brignull's Deceptive Patterns, and FTC Enforcement Guidelines.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
