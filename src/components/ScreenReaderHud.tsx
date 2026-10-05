import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UXMode, FunnelStep } from '../types';
import { Volume2, VolumeX, X, Play, Square } from 'lucide-react';

interface ScreenReaderHudProps {
  mode: UXMode;
  currentStep: FunnelStep;
  onClose: () => void;
}

export const ScreenReaderHud: React.FC<ScreenReaderHudProps> = ({
  mode,
  currentStep,
  onClose
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [speechReady, setSpeechReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useTTS, setUseTTS] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Click ▶ to start');
  const speakingRef = useRef(false);
  const cancelRef = useRef(false);

  const getNarration = () => {
    if (mode === 'bad') {
      switch (currentStep) {
        case 'browse':
          return 'Alert. 3 unlabelled images. Low contrast detected, 2.1 to 1. Link text, click here. Price text, 129 dollars. Warning, mandatory fees omitted from search listing.';
        case 'details':
          return 'Alert. Rapid flashing animation detected. Banner text, Only 1 left, hurry! Check-in input, missing label. Accessibility note, Partially accessible, call hotel front desk to verify.';
        case 'addons':
          return 'Form. 3 checkboxes pre-selected without your consent. Checkbox 1, Trip shield, 24 dollars. Checkbox 2, Cleaning fee, 18 dollars per night. Checkbox 3, Flex check, 35 dollars. Warning, service animal surcharge 60 dollars, potential A.D.A. violation.';
        case 'checkout':
          return 'Alert. Form timeout in 2 minutes 45 seconds. Error summary missing. Fields include fax number and security question. Payment fields lack auto-complete. All data clears on validation failure.';
        case 'confirmation':
          return 'Popup alert. Claim 50 dollar cashback voucher. Warning, hidden recurring subscription at 39 dollars per month. Booking status, pending audit. No reference number provided. Cancel link goes to premium phone line.';
      }
    } else if (mode === 'verygood') {
      switch (currentStep) {
        case 'browse':
          return 'Main landmark. aria-live region active. Search and discover accessible verified stays. 3 stays available. Serenade Villa, 240 dollars total. Price update confirmed via aria-live. All images have alt text. Contrast ratio 7.2 to 1, triple A. Tab to select.';
        case 'details':
          return 'Heading level 1, Serenade Coastal Villa. aria-live, price updated to 720 dollars for 3 nights. All labels have html-for bindings. Calendar is keyboard navigable with arrow keys. All interactive elements meet contrast requirements.';
        case 'addons':
          return 'Optional amenities region. aria-live, total updates announced. All checkboxes unchecked by default. Labels bound with html-for. Keyboard navigation, Tab between options, Space to toggle. Input mode optimized for each field.';
        case 'checkout':
          return 'Form landmark, Accessible checkout. aria-live, grand total announced on every change. 3 fields with html-for bindings. Input mode numeric on card fields. Auto-complete enabled for credit card. Tab order is logical. Courtesy hold, 10 minutes.';
        case 'confirmation':
          return 'Confirmation landmark. aria-live, Reservation F.R. 88421 confirmed. All elements keyboard focusable. Screen reader announces room details, total price, and cancellation policy. Zero accessibility barriers detected.';
      }
    } else {
      switch (currentStep) {
        case 'browse':
          return 'Main landmark. Search and discover. 3 accessible verified stays available. Serenade Villa, 36 inch doorway, roll-in shower, verified July 2026. Price, 240 dollars total per night, inclusive of all taxes. Button, Select this stay.';
        case 'details':
          return 'Heading level 1, Serenade Coastal Villa. Accessibility specs, 36 inch doorway, grab bars at 34 inches, strobe emergency alarm, zero dollar service animal policy. Interactive calendar, October 14 to 17, 3 nights selected.';
        case 'addons':
          return 'Optional amenities. All add-ons are unselected by default. Service animal registration, zero dollars, guaranteed by law. Button, Continue to checkout.';
        case 'checkout':
          return 'Form landmark, Guest checkout. 3 essential fields. Field 1, Full name, required. Field 2, Email address. Field 3, Phone number. Accessibility requests available. Courtesy hold, 10 minutes remaining.';
        case 'confirmation':
          return 'Confirmation landmark. Reservation confirmed. Reference, F.R. 88421. Accessible room guaranteed, ground floor, 36 inch doors. Calendar invite and booking card ready to download.';
      }
    }
    return '';
  };

  // Speak using speechSynthesis word by word (more reliable than long strings)
  const speakTTS = useCallback((text: string) => {
    if (!window.speechSynthesis) return false;
    try {
      // Don't call cancel() — that causes errors in some browsers
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (enVoice) {
        utterance.voice = enVoice;
        utterance.lang = enVoice.lang;
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = 1.1;
      utterance.pitch = mode === 'bad' ? 0.7 : mode === 'verygood' ? 1.2 : 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => { setIsSpeaking(true); speakingRef.current = true; };
      utterance.onend = () => { setIsSpeaking(false); speakingRef.current = false; setStatusMsg('Done — click ▶ to replay'); };
      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        setIsSpeaking(false);
        speakingRef.current = false;
        setUseTTS(false);
        setStatusMsg('TTS failed — using tones');
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (_) {
      return false;
    }
  }, [mode]);

  // Fallback: Web Audio API tone narration
  const speakTones = useCallback((text: string) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sentences = text.split(/[.!?]+/).filter(s => s.trim());
      let time = ctx.currentTime;
      cancelRef.current = false;
      setIsSpeaking(true);
      speakingRef.current = true;

      sentences.forEach((sentence, si) => {
        const words = sentence.trim().split(/\s+/);
        words.forEach((word, wi) => {
          if (cancelRef.current) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          const baseFreq = mode === 'bad' ? 160 : mode === 'verygood' ? 420 : 300;
          const freq = baseFreq + (word.length * 12) + (wi % 4) * 25;
          osc.frequency.setValueAtTime(freq, time);
          osc.frequency.linearRampToValueAtTime(freq * 0.9, time + 0.08);
          osc.type = mode === 'bad' ? 'sawtooth' : 'sine';

          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.07, time + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

          osc.start(time);
          osc.stop(time + 0.1);
          time += 0.1;
        });
        time += 0.15; // pause between sentences
      });

      setTimeout(() => {
        setIsSpeaking(false);
        speakingRef.current = false;
        setStatusMsg('Done — click ▶ to replay');
        ctx.close();
      }, (time - ctx.currentTime) * 1000 + 200);
    } catch (_) {
      setIsSpeaking(false);
      speakingRef.current = false;
    }
  }, [mode]);

  const handlePlay = useCallback(() => {
    const narration = getNarration();
    if (!narration || isMuted) return;

    // Stop any current speech
    cancelRef.current = true;
    try { window.speechSynthesis?.cancel(); } catch (_) {}

    setStatusMsg('Speaking...');

    // Small delay to let cancel finish
    setTimeout(() => {
      cancelRef.current = false;
      if (useTTS) {
        const ok = speakTTS(narration);
        if (!ok) speakTones(narration);
      } else {
        speakTones(narration);
      }
    }, 100);
  }, [getNarration, isMuted, useTTS, speakTTS, speakTones]);

  const handleStop = useCallback(() => {
    cancelRef.current = true;
    try { window.speechSynthesis?.cancel(); } catch (_) {}
    setIsSpeaking(false);
    speakingRef.current = false;
    setStatusMsg('Stopped');
  }, []);

  const handleEnableTTS = useCallback(() => {
    // Test if TTS works with a short phrase
    if (!window.speechSynthesis) {
      setStatusMsg('No TTS — using tones');
      setSpeechReady(true);
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance('Ready');
      u.volume = 1.0;
      u.rate = 1.2;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        u.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }
      u.onend = () => {
        setUseTTS(true);
        setSpeechReady(true);
        setStatusMsg('TTS active — click ▶');
      };
      u.onerror = () => {
        setUseTTS(false);
        setSpeechReady(true);
        setStatusMsg('TTS failed — using tones. Click ▶');
      };
      window.speechSynthesis.speak(u);
    } catch (_) {
      setUseTTS(false);
      setSpeechReady(true);
      setStatusMsg('TTS unavailable — using tones. Click ▶');
    }
  }, []);

  const narration = getNarration() || '';

  return (
    <div
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-xl z-40 bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border-2 border-sky-500/80 p-3.5 backdrop-blur-md"
      role="region"
      aria-label="Screen Reader Simulation HUD"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : speechReady ? 'bg-sky-400' : 'bg-slate-600'}`} />
          <span className="font-mono font-bold text-sky-300">VoiceOver / NVDA Simulator</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
            mode === 'verygood' ? 'bg-violet-900 text-violet-300' : mode === 'bad' ? 'bg-rose-900 text-rose-300' : 'bg-slate-800 text-slate-300'
          }`}>
            {mode === 'verygood' ? 'VERY GOOD' : mode.toUpperCase()} UX
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {!speechReady ? (
            <button
              onClick={handleEnableTTS}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition animate-pulse"
            >
              🔊 Enable Voice
            </button>
          ) : (
            <>
              {isSpeaking ? (
                <button onClick={handleStop} className="p-1 text-red-400 hover:text-red-300 rounded transition" title="Stop">
                  <Square className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={handlePlay} className="p-1 text-emerald-400 hover:text-emerald-300 rounded transition" title="Play narration">
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
          <button
            onClick={() => { setIsMuted(!isMuted); if (!isMuted) handleStop(); }}
            className="p-1 text-slate-400 hover:text-white rounded transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
          <button onClick={() => { handleStop(); onClose(); }} className="p-1 text-slate-400 hover:text-white rounded transition" title="Close">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-1.5 mb-1 text-[10px]">
        <span className="text-slate-500 font-mono">{statusMsg}</span>
        <span className="text-slate-600 font-mono">
          {useTTS ? '🗣️ Voice' : '🔊 Tones'} &bull; {mode === 'bad' ? 'Hostile' : mode === 'verygood' ? 'Accessible' : 'Standard'}
        </span>
      </div>

      {/* Narration text */}
      <div className={`font-mono text-xs leading-relaxed mt-1 p-2 rounded-lg ${
        mode === 'bad' ? 'bg-red-950/50 border border-red-900/50' : mode === 'verygood' ? 'bg-violet-950/50 border border-violet-900/50' : 'bg-slate-900/50 border border-slate-800/50'
      }`}>
        {isMuted ? (
          <span className="italic text-slate-500">[Muted — click 🔊 to unmute]</span>
        ) : (
          <span className={`${isSpeaking ? 'text-yellow-300' : mode === 'bad' ? 'text-red-300' : mode === 'verygood' ? 'text-violet-300' : 'text-emerald-300'}`}>
            🔊 "{narration}"
          </span>
        )}
      </div>

      {/* Instructions */}
      {!speechReady && (
        <p className="text-[10px] text-amber-400/80 text-center mt-2 font-mono">
          ⬆ Click "Enable Voice" — if your browser supports TTS you'll hear real speech, otherwise audio tones
        </p>
      )}
    </div>
  );
};
