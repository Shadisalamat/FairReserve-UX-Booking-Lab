import React, { useState } from 'react';
import { DisabilitySettings, UXMode, FunnelStep } from '../types';
import { 
  Eye, 
  Volume2, 
  MousePointer, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Check, 
  BookOpen, 
  Layers, 
  Sliders, 
  Info,
  Type,
  Activity,
  HeartHandshake,
  Ear,
  Dog
} from 'lucide-react';

interface DisabilityAccessibilityBarProps {
  settings: DisabilitySettings;
  onUpdateSettings: (updated: Partial<DisabilitySettings>) => void;
  mode: UXMode;
  currentStep: FunnelStep;
  onOpenKnowledgeHub: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DisabilityAccessibilityBar: React.FC<DisabilityAccessibilityBarProps> = ({
  settings,
  onUpdateSettings,
  mode,
  currentStep,
  onOpenKnowledgeHub,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'comparison' | 'screenreader'>('tools');

  // Quick preset activation
  const applyPreset = (preset: 'vision' | 'motor' | 'neuro' | 'deaf' | 'reset') => {
    if (preset === 'reset') {
      onUpdateSettings({
        enabled: false,
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        dyslexicFont: false,
        screenReaderHelper: false,
        motorAssistance: false,
        mobilityFilter: 'all'
      });
      return;
    }

    onUpdateSettings({ enabled: true });

    if (preset === 'vision') {
      onUpdateSettings({
        highContrast: true,
        largeText: true,
        reducedMotion: true,
        screenReaderHelper: true
      });
    } else if (preset === 'motor') {
      onUpdateSettings({
        motorAssistance: true,
        reducedMotion: true,
        mobilityFilter: 'step-free'
      });
    } else if (preset === 'neuro') {
      onUpdateSettings({
        dyslexicFont: true,
        reducedMotion: true,
        largeText: false
      });
    } else if (preset === 'deaf') {
      onUpdateSettings({
        mobilityFilter: 'visual-alarms',
        reducedMotion: true
      });
    }
  };

  // Generate simulated screen-reader narration based on current step and UX mode
  const getScreenReaderNarration = () => {
    if (mode === 'bad') {
      switch (currentStep) {
        case 'browse':
          return 'Alert: 3 unlabelled graphics. Low contrast text detected: 2.1 to 1 ratio. Link text: "click here". Price text: "$129". Warning: 2 mandatory fees omitted from search listing.';
        case 'details':
          return 'Alert: Rapid animation detected. Banner text: "ONLY 1 LEFT HURRY". Input check-in date: missing aria-describedby for MM/DD/YYYY syntax. Disconnected label. Accessibility info: "Partially accessible, call hotel front desk to verify".';
        case 'addons':
          return 'Form: 3 checkboxes pre-checked without user interaction. Checkbox 1: Trip shield, 24 dollars. Checkbox 2: Service animal sanitation surcharge, 60 dollars (Warning: Potential ADA Title III violation).';
        case 'checkout':
          return 'Alert: Form timeout in 3 minutes 12 seconds. Error summary missing. Telephone required, SMS OTP mandatory (no TTY or text alternative). Card input fields lack autocomplete tokens.';
        case 'confirmation':
          return 'Popup alert: "Claim 50 dollar cash voucher". Hidden recurring subscription contract. Print receipt button unlabelled.';
      }
    } else if (mode === 'verygood') {
      switch (currentStep) {
        case 'browse':
          return 'Main landmark. aria-live region: price updates announced. 3 accessible stays with keyboard navigation. Serenade Villa: 240 dollars total — htmlFor-bound labels, contrast 7.2:1 AAA. Tab to select, Enter to confirm.';
        case 'details':
          return 'Heading level 1: Serenade Coastal Villa. aria-live: price 720 dollars for 3 nights. htmlFor on all labels. Calendar: arrow keys navigate dates, Enter selects. inputMode="numeric" on guest count. WCAG AAA contrast verified.';
        case 'addons':
          return 'Optional amenities. aria-live: running total announced. All unchecked by default. htmlFor bindings on each label. Keyboard: Tab + Space to toggle. autoComplete attributes on relevant fields. Zero pre-selections.';
        case 'checkout':
          return 'Accessible checkout. aria-live: grand total announced. htmlFor on name, email, card fields. inputMode="numeric" on card number. autoComplete="cc-number cc-exp cc-csc". Tab order: logical top-to-bottom. Courtesy hold: 10 minutes.';
        case 'confirmation':
          return 'Confirmation landmark. aria-live: FR-88421 confirmed. All elements focusable via keyboard. Screen reader: room specs, total, cancellation policy all announced. Zero WCAG violations. A11y score: AAA+.';
      }
    } else {
      switch (currentStep) {
        case 'browse':
          return 'Main landmark. Search discovery. 3 accessible stays available. Serenade Villa: 36 inch doorway, zero-step roll-in shower verified July 2026. Price: 240 dollars total per night, inclusive of all taxes. Button: Select this stay.';
        case 'details':
          return 'Heading level 1: Serenade Coastal Villa. Certified accessibility specs: 36 inch doorway clearance, grab bars at 34 inches, strobe emergency alarm, 0 dollar service animal policy. Interactive 2-month calendar: October 14 to 17 selected, 3 nights.';
        case 'addons':
          return 'Optional amenities. All add-ons defaulted to unselected. Item: Service animal registration: 0 dollars guaranteed by law. Button: Add to stay.';
        case 'checkout':
          return 'Form landmark: Guest checkout. 3 essential inputs. Field 1: Full legal name, required. Field 2: Email address for confirmation. Field 3: Accessible assistance requests: step-free room preference. Courtesy hold active: 10 minutes remaining.';
        case 'confirmation':
          return 'Confirmation landmark. Reservation confirmed. Reference: FR-88421. Accessible room guarantee locked: Ground floor, 36 inch doors. Calendar invite and offline PDF pass ready.';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disability-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-slate-300 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-sky-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="disability-modal-title" className="text-lg font-extrabold tracking-tight">
                  Disability & Universal Accessibility Lab
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-sky-400 text-slate-950 px-2 py-0.5 rounded-full">
                  WCAG 2.2 AAA
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Test accommodations, physical specs, and contrast how Bad UX discriminates vs. Good UX inclusion
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-sky-200 hover:text-white hover:bg-white/10 rounded-xl transition"
              aria-label="Close disability settings modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Enable & Quick Presets Strip */}
        <div className="p-4 bg-sky-50/80 border-b border-sky-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.enabled)}
                onChange={e => onUpdateSettings({ enabled: e.target.checked })}
                className="sr-only peer"
                id="toggle-master-a11y"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
            </label>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {settings.enabled ? 'Accessibility Adjustments Active' : 'Disability Mode Disabled'}
              </span>
              <span className="text-[11px] text-slate-600">
                {settings.enabled 
                  ? 'Real-time styling modifications applied to typography, targets, and sensory items.'
                  : 'Toggle ON to apply high-contrast, larger typography, or screen-reader simulators.'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500 mr-1">One-Click Presets:</span>
            <button
              onClick={() => applyPreset('vision')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-sky-200 hover:bg-sky-100 text-sky-900 rounded-lg transition"
            >
              👁️ Low Vision
            </button>
            <button
              onClick={() => applyPreset('motor')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-sky-200 hover:bg-sky-100 text-sky-900 rounded-lg transition"
            >
              ♿ Mobility / Motor
            </button>
            <button
              onClick={() => applyPreset('neuro')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-sky-200 hover:bg-sky-100 text-sky-900 rounded-lg transition"
            >
              🧠 Neurodiversity
            </button>
            <button
              onClick={() => applyPreset('deaf')}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-sky-200 hover:bg-sky-100 text-sky-900 rounded-lg transition"
            >
              🧏 Deaf / Visual Alerts
            </button>
            {settings.enabled && (
              <button
                onClick={() => applyPreset('reset')}
                className="px-2 py-1 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-lg transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'tools'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Accommodation Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('screenreader')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'screenreader'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Screen Reader HUD (Live)</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'comparison'
                ? 'border-sky-600 text-sky-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Bad UX vs Good UX Contrast</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: ACCOMMODATION CONTROLS */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              
              {/* Individual Tool Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Digital Ergonomics & Sensory Controls
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* High Contrast */}
                  <label className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                    settings.highContrast && settings.enabled
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.highContrast && settings.enabled)}
                      onChange={e => onUpdateSettings({ enabled: true, highContrast: e.target.checked })}
                      className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Eye className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-slate-900">WCAG AAA High Contrast</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Reinforced dark borders, bold text contrast ratio &gt; 7:1, and high-visibility 3px amber focus rings.
                      </p>
                    </div>
                  </label>

                  {/* Large Typography */}
                  <label className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                    settings.largeText && settings.enabled
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.largeText && settings.enabled)}
                      onChange={e => onUpdateSettings({ enabled: true, largeText: e.target.checked })}
                      className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Type className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-slate-900">Large Typography & Line-Height</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Increases body font scale to 110% and line-height to 1.75 for low-vision and macular fatigue.
                      </p>
                    </div>
                  </label>

                  {/* Reduced Motion & Sensory Calm */}
                  <label className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                    settings.reducedMotion && settings.enabled
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.reducedMotion && settings.enabled)}
                      onChange={e => onUpdateSettings({ enabled: true, reducedMotion: e.target.checked })}
                      className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Activity className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-slate-900">Reduced Motion & Sensory Calm</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Halts all flashing timers, pulsating pressure banners, spinning icons, and sudden transitions.
                      </p>
                    </div>
                  </label>

                  {/* Dyslexia-Friendly Layout */}
                  <label className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                    settings.dyslexicFont && settings.enabled
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.dyslexicFont && settings.enabled)}
                      onChange={e => onUpdateSettings({ enabled: true, dyslexicFont: e.target.checked })}
                      className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <BookOpen className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-slate-900">Dyslexia-Friendly Tracking</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Optimized letter spacing (tracking-wide), generous paragraph padding, and cognitive breathing room.
                      </p>
                    </div>
                  </label>

                  {/* Motor Assistance */}
                  <label className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                    settings.motorAssistance && settings.enabled
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.motorAssistance && settings.enabled)}
                      onChange={e => onUpdateSettings({ enabled: true, motorAssistance: e.target.checked })}
                      className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <MousePointer className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-slate-900">Motor Assistance (48px Targets)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Expands all button and checkbox tap targets to at least 48px to prevent trembling and misclicks.
                      </p>
                    </div>
                  </label>

                  {/* Screen Reader Simulator HUD */}
                  <label className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 cursor-pointer ${
                    settings.screenReaderHelper && settings.enabled
                      ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={Boolean(settings.screenReaderHelper && settings.enabled)}
                      onChange={e => onUpdateSettings({ enabled: true, screenReaderHelper: e.target.checked })}
                      className="mt-1 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <Volume2 className="w-4 h-4 text-sky-700" />
                        <span className="text-xs font-bold text-slate-900">Live Screen-Reader HUD</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Displays a persistent live audio transcript bar of what Apple VoiceOver / NVDA would announce.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

              {/* Physical Architectural Accessibility Filter */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      Physical Architectural Stay Filter
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Filter catalog by certified audited physical accommodations
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    Universal Design
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: 'All Stays' },
                    { id: 'step-free', label: '♿ Step-Free (36" Door)' },
                    { id: 'roll-in-shower', label: '🚿 Roll-in Shower' },
                    { id: 'visual-alarms', label: '🚨 Visual Strobe Alarms' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => onUpdateSettings({ enabled: true, mobilityFilter: option.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-left transition ${
                        settings.mobilityFilter === option.id
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE SCREEN READER HUD */}
          {activeTab === 'screenreader' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-slate-200">VoiceOver / NVDA Speech Synthesizer Output</span>
                  </div>
                  <span>Rate: 1.0x • English (US)</span>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap py-2 text-sm text-emerald-400">
                  {getScreenReaderNarration()}
                </p>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  Current Mode: <strong className={`uppercase ${mode === 'verygood' ? 'text-violet-400' : mode === 'bad' ? 'text-rose-400' : 'text-white'}`}>{mode === 'verygood' ? 'VERY GOOD' : mode} UX</strong> • Active Step: <strong className="text-white uppercase">{currentStep}</strong>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
                <strong className="block font-bold text-amber-950 text-sm">
                  Why this Screen-Reader Simulation matters:
                </strong>
                <p>
                  Sighted users rarely experience the disorientation of poorly labelled booking funnels. When an unlabelled image says <em>"Graphic_8829.jpg"</em> or a countdown timer yells every 10 seconds into a screen reader's audio channel, it creates digital barricades for visually impaired travelers.
                </p>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => onUpdateSettings({ enabled: true, screenReaderHelper: true })}
                    className="px-3 py-1.5 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-800 transition"
                  >
                    Keep Screen-Reader HUD Pinned to Viewport
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BAD UX VS GOOD UX CONTRAST */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Bad UX Column */}
                <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Hostile / Token Accessibility (Bad UX)</span>
                  </div>
                  <ul className="text-xs text-rose-900 space-y-2">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>Vague Wheelchair Tag:</strong> No doorway clearance dimensions or bathroom photo.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>Phone Burden:</strong> "Call the hotel during business hours to confirm wheelchair access."</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>Illegal Surcharges:</strong> Stealth $60 "Service Animal Fee" pre-checked at checkout.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>Sensory Overload:</strong> 200ms flashing red panic timers and rapid animations triggering seizures.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-rose-500 font-bold">✕</span>
                      <span><strong>Low Contrast &amp; Tiny Targets:</strong> 2.1:1 gray text with 18px tiny checkbox click targets.</span>
                    </li>
                  </ul>
                </div>

                {/* Good UX Column */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Universal Inclusive Design (Good UX)</span>
                  </div>
                  <ul className="text-xs text-emerald-900 space-y-2">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Audited Dimensions:</strong> 36" clear doorway, zero-threshold roll-in rain shower with grab bars.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Independent Booking:</strong> 100% online verification with audit certification badge.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>$0 Guarantee:</strong> Explicit $0 surcharge for guide dogs and medical gear (ADA/EAA compliant).</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Sensory Calm:</strong> Respectful countdowns, reduced motion toggle, and dyslexia-friendly typography.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>WCAG 2.2 AAA Standards:</strong> 7:1+ contrast ratios, 48px touch targets, full keyboard accessibility.</span>
                    </li>
                  </ul>
                </div>

              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between text-xs text-sky-900">
                <span className="font-semibold">Want to read the in-depth UX &amp; Legal analysis?</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenKnowledgeHub();
                  }}
                  className="px-3 py-1 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700 transition"
                >
                  View Conflict #9 in UX Knowledge Hub
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Complies with WCAG 2.2 AAA, ADA Title III &amp; European Accessibility Act</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Apply &amp; Return to App
          </button>
        </div>

      </div>
    </div>
  );
};
