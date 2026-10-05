import React, { useState, useEffect, useCallback } from 'react';
import { UXMode, FunnelStep } from '../types';
import { X, ChevronDown, ChevronUp, Monitor, ArrowDown, ArrowUp, ArrowRight, ArrowLeft, SkipForward, Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle, Keyboard, Volume2 } from 'lucide-react';

interface ScreenReaderSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  mode: UXMode;
  currentStep: FunnelStep;
  onSwitchMode: (mode: UXMode) => void;
}

interface SimElement {
  tag: string;
  role: string;
  text: string;
  ariaLabel?: string;
  srAnnouncement: string;
  issues: string[];
  wcagFails: string[];
  level: 'critical' | 'warning' | 'pass';
}

const STEPS: FunnelStep[] = ['browse', 'details', 'addons', 'checkout', 'confirmation'];

const STEP_INFO: Record<FunnelStep, { label: string; labelAr: string; icon: string }> = {
  browse: { label: 'Search & Discovery', labelAr: 'البحث والاكتشاف', icon: '🔍' },
  details: { label: 'Property Details', labelAr: 'تفاصيل العقار', icon: '🏠' },
  addons: { label: 'Add-Ons', labelAr: 'الإضافات', icon: '🛒' },
  checkout: { label: 'Checkout', labelAr: 'الدفع', icon: '💳' },
  confirmation: { label: 'Confirmation', labelAr: 'التأكيد', icon: '✅' },
};

function getAllElements(mode: UXMode): Record<FunnelStep, SimElement[]> {
  if (mode === 'bad') return BAD_ELEMENTS;
  if (mode === 'verygood') return VERYGOOD_ELEMENTS;
  return GOOD_ELEMENTS;
}

const BAD_ELEMENTS: Record<FunnelStep, SimElement[]> = {
  browse: [
    { tag: 'img', role: 'img', text: '', srAnnouncement: '"Graphic_8829.jpg, image"', issues: ['No alt text — screen reader reads filename'], wcagFails: ['1.1.1 (A)'], level: 'critical' },
    { tag: 'div', role: 'none', text: '$129/night', srAnnouncement: '"129 dollars per night"', issues: ['Misleading — real cost is $240+ after hidden fees', 'Not in a semantic landmark'], wcagFails: ['1.3.1 (A)'], level: 'critical' },
    { tag: 'div', role: 'none', text: '🔥 ONLY 1 LEFT!', srAnnouncement: '"fire, ONLY 1 LEFT!"', issues: ['Emoji "fire" confuses screen reader', 'Fake urgency — inventory is not real', 'Text contrast only 2.1:1'], wcagFails: ['1.4.3 (AA)', '4.1.3 (AA)'], level: 'critical' },
    { tag: 'a', role: 'link', text: 'click here', srAnnouncement: '"click here, link"', issues: ['"click here" is meaningless out of context'], wcagFails: ['2.4.4 (A)'], level: 'critical' },
    { tag: 'div', role: 'none', text: '38 people viewing now', srAnnouncement: '(not announced — no aria-live)', issues: ['Fake social proof', 'Screen reader skips it entirely'], wcagFails: ['4.1.3 (AA)'], level: 'warning' },
    { tag: 'button', role: 'button', text: '', srAnnouncement: '"button"', issues: ['Empty button — no text, no aria-label', 'Screen reader says just "button"'], wcagFails: ['4.1.2 (A)'], level: 'critical' },
  ],
  details: [
    { tag: 'div', role: 'none', text: '⏰ 04:59', srAnnouncement: '"alarm clock 04:59"', issues: ['Fake countdown — creates panic', 'Flashing animation — seizure risk for photosensitive users', 'No aria-live, updates are silent'], wcagFails: ['2.2.1 (A)', '2.3.1 (A)'], level: 'critical' },
    { tag: 'input', role: 'textbox', text: '', srAnnouncement: '"edit text"', issues: ['No label at all — screen reader says just "edit text"', 'User has no idea what to type (date? name? code?)'], wcagFails: ['1.3.1 (A)', '3.3.2 (A)'], level: 'critical' },
    { tag: 'input', role: 'textbox', text: '', srAnnouncement: '"edit text"', issues: ['Second unlabelled input — same problem', 'Date format ambiguous (MM/DD or DD/MM?)'], wcagFails: ['1.3.1 (A)'], level: 'critical' },
    { tag: 'div', role: 'none', text: '$75 cleaning fee', srAnnouncement: '(not announced — gray text, 1.9:1 contrast)', issues: ['Hidden fee in tiny gray text', 'Contrast 1.9:1 — invisible to low vision and screen readers'], wcagFails: ['1.4.3 (AA)'], level: 'critical' },
    { tag: 'div', role: 'alert', text: 'Someone from Zurich booked 4 min ago!', srAnnouncement: '"Alert! Someone from Zurich booked 4 min ago!"', issues: ['Fake notification — uses role=alert', 'INTERRUPTS screen reader every time it appears', 'Causes anxiety for blind users'], wcagFails: ['4.1.3 (AA)'], level: 'warning' },
  ],
  addons: [
    { tag: 'input', role: 'checkbox', text: 'Trip Protection', srAnnouncement: '"Trip Protection, checkbox, checked"', issues: ['PRE-CHECKED without user consent — $24 charge', 'User must find and uncheck it', 'Sneak into Basket dark pattern'], wcagFails: ['3.2.2 (A)'], level: 'critical' },
    { tag: 'input', role: 'checkbox', text: 'Green Cleaning', srAnnouncement: '"Green Cleaning, checkbox, checked"', issues: ['PRE-CHECKED — $18/night added silently', 'Default Effect cognitive bias exploited'], wcagFails: ['3.2.2 (A)'], level: 'critical' },
    { tag: 'input', role: 'checkbox', text: 'Flex Check', srAnnouncement: '"Flex Check, checkbox, checked"', issues: ['PRE-CHECKED — $35 charge hidden'], wcagFails: ['3.2.2 (A)'], level: 'critical' },
    { tag: 'button', role: 'button', text: '', srAnnouncement: '"No, I accept 100% financial ruin and risk my entire trip, button"', issues: ['CONFIRMSHAMING — emotional manipulation', 'Not keyboard focusable (no tabIndex)', 'Must click this to uncheck protection'], wcagFails: ['2.1.1 (A)', '4.1.2 (A)'], level: 'critical' },
    { tag: 'span', role: 'none', text: 'Service Animal: $60', srAnnouncement: '"Service Animal Fee: 60 dollars"', issues: ['ILLEGAL — ADA Title III mandates $0', 'Discriminatory pricing against disabled travelers'], wcagFails: ['Legal violation'], level: 'critical' },
  ],
  checkout: [
    { tag: 'div', role: 'timer', text: '02:45', srAnnouncement: '"2 minutes 45 seconds remaining"', issues: ['FORCED timeout on payment form', 'No way to extend or disable', 'Panic-inducing for motor-impaired users who type slowly'], wcagFails: ['2.2.1 (A)'], level: 'critical' },
    { tag: 'input', role: 'textbox', text: '', srAnnouncement: '"Salutation, edit text"', issues: ['Unnecessary field — why does a booking need "Dr./Mr./Mrs."?'], wcagFails: ['3.3.2 (A)'], level: 'warning' },
    { tag: 'input', role: 'textbox', text: '', srAnnouncement: '"Fax Number, edit text"', issues: ['FAX in 2026?! Obsolete field', 'No inputMode — full keyboard on mobile'], wcagFails: ['3.3.2 (A)'], level: 'warning' },
    { tag: 'input', role: 'textbox', text: '', srAnnouncement: '"edit text"', issues: ['Credit card field without autoComplete', 'Browser cannot auto-fill saved cards', 'Full QWERTY keyboard instead of number pad'], wcagFails: ['1.3.5 (AA)'], level: 'critical' },
    { tag: 'div', role: 'alert', text: 'Please fix the highlighted fields', srAnnouncement: '"Alert! Please fix the highlighted fields"', issues: ['WHICH fields?! No fields are highlighted', 'Generic error with zero specifics', 'ALL form data CLEARED on failure'], wcagFails: ['3.3.1 (A)', '3.3.3 (AA)'], level: 'critical' },
    { tag: 'div', role: 'none', text: 'Terms & Conditions', srAnnouncement: '(barely visible — contrast 1.9:1)', issues: ['42-page PDF with cancellation buried inside', 'Text nearly invisible: gray on gray', 'Pre-checked agreement checkbox'], wcagFails: ['1.4.3 (AA)'], level: 'critical' },
  ],
  confirmation: [
    { tag: 'div', role: 'dialog', text: '$50 CASHBACK!', srAnnouncement: '"dialog, Claim your 50 dollar cashback voucher"', issues: ['TRAP — hides auto-enrollment in $39/month subscription', 'Dialog traps keyboard focus', 'Close button is 12px — too small for motor impaired'], wcagFails: ['2.4.3 (A)', '2.5.5 (AAA)'], level: 'critical' },
    { tag: 'div', role: 'none', text: 'PENDING AUDIT', srAnnouncement: '"BOOKING STATUS: PENDING AUDIT"', issues: ['Vague — user does not know if booking succeeded', 'No reservation reference number', 'No aria-live announcement'], wcagFails: ['4.1.3 (AA)'], level: 'critical' },
    { tag: 'button', role: 'button', text: '', srAnnouncement: '"button"', issues: ['Receipt button has NO label', 'Screen reader just says "button"'], wcagFails: ['4.1.2 (A)'], level: 'critical' },
    { tag: 'a', role: 'link', text: 'Cancel reservation', srAnnouncement: '"Cancel reservation, link"', issues: ['Links to INTERNATIONAL premium phone line', '45-minute hold time — Roach Motel pattern', 'No online self-service cancellation'], wcagFails: ['Ethical violation'], level: 'critical' },
  ],
};

const GOOD_ELEMENTS: Record<FunnelStep, SimElement[]> = {
  browse: [
    { tag: 'main', role: 'main', text: '', ariaLabel: 'Search and discover verified stays', srAnnouncement: '"Search and discover verified stays, main landmark"', issues: [], wcagFails: [], level: 'pass' },
    { tag: 'img', role: 'img', text: '', ariaLabel: 'Serenade Coastal Villa — oceanfront terrace with infinity pool', srAnnouncement: '"Serenade Coastal Villa, oceanfront terrace with infinity pool, image"', issues: ['Descriptive alt text provided'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'region', text: '$240/night total', srAnnouncement: '"240 dollars per night, total inclusive of all taxes and fees"', issues: ['Honest all-inclusive price from the start'], wcagFails: [], level: 'pass' },
    { tag: 'span', role: 'none', text: '3 of 5 suites available', srAnnouncement: '"3 of 5 suites available for your dates"', issues: ['Real inventory count — not fake scarcity'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Select Serenade Coastal Villa', srAnnouncement: '"Select Serenade Coastal Villa, button"', issues: ['Clear, descriptive button text'], wcagFails: [], level: 'pass' },
  ],
  details: [
    { tag: 'h1', role: 'heading', text: 'Serenade Coastal Villa', srAnnouncement: '"Serenade Coastal Villa, heading level 1"', issues: ['Proper heading hierarchy'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'application', text: 'Interactive calendar', ariaLabel: 'Select check-in and check-out dates — October 2026', srAnnouncement: '"Select check-in and check-out dates, October 2026, application"', issues: ['Calendar with keyboard navigation support'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'region', text: 'Cancellation timeline', srAnnouncement: '"100% refund before Oct 12, 50% before Oct 14, non-refundable after check-in"', issues: ['Clear visual timeline — no hidden PDF'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'region', text: '$720 total', srAnnouncement: '"720 dollars total for 3 nights, all fees included"', issues: ['All-inclusive total, no surprises'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Continue to add-ons', srAnnouncement: '"Continue to add-ons, button"', issues: [], wcagFails: [], level: 'pass' },
  ],
  addons: [
    { tag: 'div', role: 'group', text: '', ariaLabel: 'Optional add-ons — all unchecked by default', srAnnouncement: '"Optional add-ons, all unchecked by default, group"', issues: ['User actively chooses — no pre-selection'], wcagFails: [], level: 'pass' },
    { tag: 'input', role: 'checkbox', text: 'Trip Protection — $24', srAnnouncement: '"Trip Protection, 24 dollars one-time, checkbox, not checked"', issues: ['Unchecked by default — opt-in only'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'none', text: 'Service Animal — $0', srAnnouncement: '"Service Animal Registration, zero dollars, guaranteed by law"', issues: ['ADA compliant — always free'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Continue to checkout', srAnnouncement: '"Continue to checkout, button"', issues: ['Clear CTA with neutral language'], wcagFails: [], level: 'pass' },
  ],
  checkout: [
    { tag: 'form', role: 'form', text: '', ariaLabel: 'Guest checkout — 3 fields only', srAnnouncement: '"Guest checkout, 3 fields only, form"', issues: ['Minimal friction — only essential fields'], wcagFails: [], level: 'pass' },
    { tag: 'label+input', role: 'textbox', text: 'Full Name', ariaLabel: 'Full name, required', srAnnouncement: '"Full name, required, edit text"', issues: ['Label bound with htmlFor — click focuses field'], wcagFails: [], level: 'pass' },
    { tag: 'label+input', role: 'textbox', text: 'Email', ariaLabel: 'Email address', srAnnouncement: '"Email address, edit text"', issues: ['inputMode="email" — shows @ key on mobile'], wcagFails: [], level: 'pass' },
    { tag: 'label+input', role: 'textbox', text: 'Card Number', ariaLabel: 'Card number', srAnnouncement: '"Card number, edit text"', issues: ['autoComplete="cc-number" — browser fills saved card'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'region', text: 'Courtesy hold: 10 min', srAnnouncement: '"Your room is held for 10 minutes, courtesy hold"', issues: ['No forced timeout — just a friendly notice'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Confirm & Pay $792', srAnnouncement: '"Confirm and Pay 792 dollars, button"', issues: ['Total amount in button — zero surprises'], wcagFails: [], level: 'pass' },
  ],
  confirmation: [
    { tag: 'div', role: 'region', text: 'FR-88421 Confirmed', ariaLabel: 'Booking confirmed — reference FR-88421', srAnnouncement: '"Booking confirmed, reference FR-88421, region"', issues: ['Clear reference number'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Add to Calendar', srAnnouncement: '"Add to Calendar, button"', issues: [], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Download Booking Card', srAnnouncement: '"Download Booking Card, button"', issues: [], wcagFails: [], level: 'pass' },
    { tag: 'a', role: 'link', text: 'Cancel online — one click', srAnnouncement: '"Cancel reservation online, one click, link"', issues: ['Self-service cancellation — no phone call'], wcagFails: [], level: 'pass' },
  ],
};

const VERYGOOD_ELEMENTS: Record<FunnelStep, SimElement[]> = {
  browse: [
    { tag: 'main', role: 'main', text: '', ariaLabel: 'Search and discover accessible verified stays', srAnnouncement: '"Search and discover accessible verified stays, main landmark"', issues: ['Enhanced: "accessible" context added'], wcagFails: [], level: 'pass' },
    { tag: 'img', role: 'img', text: '', ariaLabel: 'Serenade Coastal Villa — wheelchair accessible, 36-inch doorways, roll-in shower', srAnnouncement: '"Serenade Coastal Villa, wheelchair accessible, 36-inch doorways, roll-in shower, image"', issues: ['Alt text includes accessibility specs'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'region', text: '$240/night', srAnnouncement: '"Price: 240 dollars per night, all taxes included"', ariaLabel: 'Price: 240 dollars per night', issues: ['aria-live="polite" — price updates announced automatically'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Select', ariaLabel: 'Select Serenade Coastal Villa, accessible, 240 dollars, 4.96 stars', srAnnouncement: '"Select Serenade Coastal Villa, accessible, 240 dollars, 4.96 stars, button"', issues: ['Full context in aria-label', 'aria-pressed state tracked'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'status', text: '', srAnnouncement: '"Live region active: price and availability updates will be announced"', issues: ['aria-live="polite" aria-atomic="true"', 'Blind users never miss a price change'], wcagFails: [], level: 'pass' },
  ],
  details: [
    { tag: 'h1', role: 'heading', text: 'Serenade Coastal Villa', srAnnouncement: '"Serenade Coastal Villa, accessible oceanfront property, heading level 1"', issues: ['Semantic heading with accessibility context'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'application', text: 'Calendar', ariaLabel: 'Select dates — use arrow keys, Enter to select', srAnnouncement: '"Select dates, use arrow keys to navigate, Enter to select, October 2026, application"', issues: ['Keyboard instructions in aria-label'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'status', text: '$720', srAnnouncement: '"Price updated: 720 dollars for 3 nights"', issues: ['aria-live announces EVERY price change', 'Blind users always know current total'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Continue', ariaLabel: 'Continue to accessible add-ons, keyboard navigation available', srAnnouncement: '"Continue to accessible add-ons, keyboard navigation available, button"', issues: ['CTA includes accessibility guarantee'], wcagFails: [], level: 'pass' },
  ],
  addons: [
    { tag: 'div', role: 'group', text: '', ariaLabel: 'Optional add-ons — Tab between options, Space to toggle, all unchecked', srAnnouncement: '"Optional add-ons, Tab between options, Space to toggle, all unchecked, group"', issues: ['Keyboard instructions embedded in label'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'checkbox', text: 'Trip Protection $24', ariaLabel: 'Trip protection, 24 dollars, not selected', srAnnouncement: '"Trip protection, 24 dollars, not selected, checkbox"', issues: ['tabIndex={0} — keyboard navigable', 'aria-checked tracks state', 'Space/Enter toggles', 'Purple focus ring: 2px outline'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'status', text: '', srAnnouncement: '"Total updated: 720 dollars"', issues: ['aria-live="polite" — total announced on every toggle'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'checkbox', text: 'Service Animal $0', ariaLabel: 'Service animal, zero dollars, guaranteed by ADA', srAnnouncement: '"Service animal registration, zero dollars, guaranteed by ADA, checkbox"', issues: ['Legal compliance highlighted in label'], wcagFails: [], level: 'pass' },
  ],
  checkout: [
    { tag: 'form', role: 'form', text: '', ariaLabel: 'Accessible checkout — 3 fields with autocomplete', srAnnouncement: '"Accessible checkout, 3 essential fields with autocomplete support, form"', issues: ['Minimal cognitive load'], wcagFails: [], level: 'pass' },
    { tag: 'label+input', role: 'textbox', text: 'Full Name', srAnnouncement: '"Full name, required, edit text"', issues: ['htmlFor binding — click label focuses input', 'autoComplete="name"'], wcagFails: [], level: 'pass' },
    { tag: 'label+input', role: 'textbox', text: 'Card Number', srAnnouncement: '"Card number, edit text"', issues: ['inputMode="numeric" — number pad on mobile', 'autoComplete="cc-number" — one-tap fill', 'htmlFor binding active'], wcagFails: [], level: 'pass' },
    { tag: 'div', role: 'status', text: '$792', srAnnouncement: '"Grand total: 792 dollars, accessible room included"', issues: ['aria-live="polite" — blind users always hear total'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Confirm & Pay', ariaLabel: 'Confirm booking and pay 792 dollars, accessible room guaranteed', srAnnouncement: '"Confirm booking and pay 792 dollars, accessible room guaranteed, button"', issues: ['Full amount + accessibility guarantee in label'], wcagFails: [], level: 'pass' },
  ],
  confirmation: [
    { tag: 'div', role: 'region', text: 'Confirmed', ariaLabel: 'Booking confirmed, reference FR-88421, accessible room guaranteed', srAnnouncement: '"Booking confirmed, reference FR-88421, accessible room guaranteed, region"', issues: ['aria-live announces confirmation immediately'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Add to Calendar', ariaLabel: 'Add booking to calendar, October 14 to 17', srAnnouncement: '"Add booking to calendar, October 14 to 17, button"', issues: ['Dates in aria-label'], wcagFails: [], level: 'pass' },
    { tag: 'button', role: 'button', text: 'Download Card', ariaLabel: 'Download booking card with accessibility logistics', srAnnouncement: '"Download booking card with accessibility logistics, button"', issues: ['Accessibility logistics included'], wcagFails: [], level: 'pass' },
    { tag: 'a', role: 'link', text: 'Cancel online', ariaLabel: 'Cancel reservation online, no phone call required', srAnnouncement: '"Cancel reservation online, no phone call required, link"', issues: ['Self-service, fully accessible'], wcagFails: [], level: 'pass' },
  ],
};

export const ScreenReaderSimulator: React.FC<ScreenReaderSimulatorProps> = ({
  isOpen,
  onClose,
  mode,
  currentStep,
  onSwitchMode,
}) => {
  const [simStep, setSimStep] = useState<FunnelStep>('browse');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showVisual, setShowVisual] = useState(true);
  const [expandedEl, setExpandedEl] = useState<number | null>(null);

  const allElements = getAllElements(mode);
  const elements = allElements[simStep];

  useEffect(() => {
    setFocusedIndex(0);
    setExpandedEl(null);
  }, [simStep, mode]);

  // Auto-play: navigate elements, then advance to next step
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setFocusedIndex(prev => {
        if (prev >= elements.length - 1) {
          // Move to next step
          const stepIdx = STEPS.indexOf(simStep);
          if (stepIdx < STEPS.length - 1) {
            setSimStep(STEPS[stepIdx + 1]);
            return 0;
          } else {
            setIsAutoPlaying(false);
            return prev;
          }
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, elements.length, simStep]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, elements.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const idx = STEPS.indexOf(simStep);
      if (idx < STEPS.length - 1) { setSimStep(STEPS[idx + 1]); setFocusedIndex(0); }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const idx = STEPS.indexOf(simStep);
      if (idx > 0) { setSimStep(STEPS[idx - 1]); setFocusedIndex(0); }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [isOpen, elements.length, simStep, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const criticalCount = elements.filter(e => e.level === 'critical').length;
  const warningCount = elements.filter(e => e.level === 'warning').length;
  const passCount = elements.filter(e => e.level === 'pass').length;

  // Total stats across all steps
  const allEls = STEPS.flatMap(s => allElements[s]);
  const totalCritical = allEls.filter(e => e.level === 'critical').length;
  const totalPass = allEls.filter(e => e.level === 'pass').length;
  const totalScore = allEls.length > 0 ? Math.round((totalPass / allEls.length) * 100) : 0;

  const modeColors = {
    bad: { bg: 'bg-red-950', border: 'border-red-500/60', text: 'text-red-300', badge: 'bg-red-900 text-red-300', ring: 'ring-red-500/30', elBg: 'bg-red-950/50', srBg: 'bg-red-900/30' },
    good: { bg: 'bg-slate-950', border: 'border-emerald-500/60', text: 'text-emerald-300', badge: 'bg-emerald-900 text-emerald-300', ring: 'ring-emerald-500/30', elBg: 'bg-emerald-950/50', srBg: 'bg-emerald-900/30' },
    verygood: { bg: 'bg-violet-950', border: 'border-violet-500/60', text: 'text-violet-300', badge: 'bg-violet-900 text-violet-300', ring: 'ring-violet-500/30', elBg: 'bg-violet-950/50', srBg: 'bg-violet-900/30' },
    compare: { bg: 'bg-slate-950', border: 'border-sky-500/60', text: 'text-sky-300', badge: 'bg-sky-900 text-sky-300', ring: 'ring-sky-500/30', elBg: 'bg-sky-950/50', srBg: 'bg-sky-900/30' },
  };
  const mc = modeColors[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
      <div className={`w-full max-w-3xl max-h-[92vh] ${mc.bg} text-slate-100 rounded-2xl shadow-2xl border-2 ${mc.border} flex flex-col overflow-hidden`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span className="font-mono font-bold text-sm text-sky-300">Screen Reader Booking Simulation</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${mc.badge}`}>
              {mode === 'verygood' ? 'VERY GOOD' : mode.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowVisual(!showVisual)} className="p-1 text-slate-400 hover:text-white rounded" title={showVisual ? 'Hide visual' : 'Show visual'}>
              {showVisual ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Switcher + Score */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/50 flex items-center gap-2">
          {(['bad', 'good', 'verygood'] as UXMode[]).map(m => {
            const mEls = STEPS.flatMap(s => getAllElements(m)[s]);
            const mPass = mEls.filter(e => e.level === 'pass').length;
            const mScore = mEls.length > 0 ? Math.round((mPass / mEls.length) * 100) : 0;
            return (
              <button key={m} onClick={() => onSwitchMode(m)}
                className={`flex-1 rounded-lg px-2 py-1.5 text-center text-[11px] font-bold border transition ${
                  m === mode ? (m === 'bad' ? 'border-red-500 bg-red-900/50' : m === 'verygood' ? 'border-violet-500 bg-violet-900/50' : 'border-emerald-500 bg-emerald-900/50')
                  : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/60'
                }`}
              >
                <span>{m === 'bad' ? '❌ Bad' : m === 'good' ? '✓ Good' : '★ Very Good'}</span>
                <span className={`ml-1.5 ${mScore >= 80 ? 'text-emerald-400' : mScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{mScore}%</span>
              </button>
            );
          })}
        </div>

        {/* Step Navigation — Booking Funnel */}
        <div className="px-3 py-2 bg-slate-900/30 border-b border-slate-800/50 flex items-center gap-1 overflow-x-auto">
          {STEPS.map((step, i) => {
            const stepEls = allElements[step];
            const stepCrits = stepEls.filter(e => e.level === 'critical').length;
            const isActive = step === simStep;
            const isDone = STEPS.indexOf(step) < STEPS.indexOf(simStep);
            return (
              <React.Fragment key={step}>
                {i > 0 && <ArrowRight className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                <button
                  onClick={() => { setSimStep(step); setFocusedIndex(0); }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition border ${
                    isActive ? `${mc.border} ${mc.elBg}` : isDone ? 'border-slate-700 bg-slate-800/40' : 'border-transparent hover:bg-slate-800/30'
                  }`}
                >
                  <span>{STEP_INFO[step].icon}</span>
                  <span>{STEP_INFO[step].labelAr}</span>
                  {stepCrits > 0 && <span className="text-[9px] px-1 rounded bg-red-900 text-red-300">{stepCrits}⚠</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Summary Bar */}
        <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/20 border-b border-slate-800/30 text-[10px]">
          <span className="text-slate-400 font-mono">{STEP_INFO[simStep].label}</span>
          <div className="flex items-center gap-3 mr-auto">
            {criticalCount > 0 && <span className="flex items-center gap-1 text-red-400"><XCircle className="w-3 h-3" />{criticalCount}</span>}
            {warningCount > 0 && <span className="flex items-center gap-1 text-amber-400"><AlertTriangle className="w-3 h-3" />{warningCount}</span>}
            {passCount > 0 && <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3 h-3" />{passCount}</span>}
          </div>
          <span className="text-slate-600 font-mono"><Keyboard className="w-3 h-3 inline" /> ↑↓ elements &bull; ←→ steps</span>
        </div>

        {/* Screen Reader Output — What the blind user hears */}
        <div className={`px-4 py-2.5 ${mc.srBg} border-b border-slate-800/50`}>
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wide">ما يسمعه المستخدم الكفيف</span>
          </div>
          <div className="font-mono text-sm leading-relaxed min-h-[2rem]">
            {focusedIndex < elements.length ? (
              <span className={mc.text}>
                🔊 {elements[focusedIndex].srAnnouncement}
              </span>
            ) : (
              <span className="text-slate-500 italic">Navigate to hear announcements</span>
            )}
          </div>
        </div>

        {/* Element List — The booking flow */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5" style={{ minHeight: 0 }}>
          {elements.map((el, i) => {
            const isFocused = i === focusedIndex;
            const isExpanded = expandedEl === i;
            return (
              <div
                key={i}
                onClick={() => { setFocusedIndex(i); setExpandedEl(isExpanded ? null : i); }}
                className={`rounded-xl p-3 cursor-pointer transition-all border ${
                  isFocused
                    ? el.level === 'critical' ? 'border-red-500/80 bg-red-950/60 ring-1 ring-red-500/30'
                      : el.level === 'warning' ? 'border-amber-500/80 bg-amber-950/60 ring-1 ring-amber-500/30'
                      : 'border-emerald-500/80 bg-emerald-950/60 ring-1 ring-emerald-500/30'
                    : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Focus dot */}
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${isFocused ? 'animate-pulse' : ''} ${
                    el.level === 'critical' ? 'bg-red-400' : el.level === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />

                  <div className="flex-1 min-w-0">
                    {/* Tags row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <code className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">&lt;{el.tag}&gt;</code>
                      {el.role !== 'none' && <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-300 font-mono">role="{el.role}"</span>}
                      {el.ariaLabel && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-900/60 text-violet-300 font-mono" title={el.ariaLabel}>aria-label ✓</span>}
                      {el.level === 'critical' && <span className="text-[9px] px-1 rounded bg-red-900 text-red-300 font-bold">FAIL</span>}
                      {el.level === 'warning' && <span className="text-[9px] px-1 rounded bg-amber-900 text-amber-300 font-bold">WARN</span>}
                      {el.level === 'pass' && <span className="text-[9px] px-1 rounded bg-emerald-900 text-emerald-300 font-bold">PASS</span>}
                    </div>

                    {/* What the screen reader says */}
                    <div className="mt-1.5 font-mono text-xs">
                      <span className="text-slate-500">🔈 </span>
                      <span className={el.level === 'critical' ? 'text-red-300' : el.level === 'warning' ? 'text-amber-300' : 'text-emerald-300'}>
                        {el.srAnnouncement}
                      </span>
                    </div>

                    {/* Visual text if different */}
                    {showVisual && el.text && (
                      <div className="mt-1 text-[11px] text-slate-500">
                        <span className="text-slate-600">👁 Visual: </span>"{el.text}"
                      </div>
                    )}

                    {/* Issues & WCAG (expanded) */}
                    {(isFocused || isExpanded) && el.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {el.issues.map((issue, j) => (
                          <div key={j} className="flex items-start gap-1.5 text-[11px]">
                            <span className="flex-shrink-0">{el.level === 'pass' ? '✓' : '⚠'}</span>
                            <span className={el.level === 'pass' ? 'text-emerald-400/80' : 'text-slate-400'}>{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {(isFocused || isExpanded) && el.wcagFails.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {el.wcagFails.map((fail, j) => (
                          <span key={j} className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            el.level === 'pass' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'
                          }`}>
                            WCAG {fail}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="text-slate-600 hover:text-slate-400 p-0.5 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls Footer */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Step nav */}
            <button
              onClick={() => { const idx = STEPS.indexOf(simStep); if (idx > 0) { setSimStep(STEPS[idx - 1]); setFocusedIndex(0); } }}
              disabled={simStep === 'browse'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition" title="Previous step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            {/* Element nav */}
            <button
              onClick={() => setFocusedIndex(prev => Math.max(prev - 1, 0))}
              disabled={focusedIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition" title="Previous element"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-slate-500 font-mono w-16 text-center">{focusedIndex + 1}/{elements.length}</span>
            <button
              onClick={() => setFocusedIndex(prev => Math.min(prev + 1, elements.length - 1))}
              disabled={focusedIndex >= elements.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition" title="Next element"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { const idx = STEPS.indexOf(simStep); if (idx < STEPS.length - 1) { setSimStep(STEPS[idx + 1]); setFocusedIndex(0); } }}
              disabled={simStep === 'confirmation'}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition" title="Next step"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold font-mono ${totalScore >= 80 ? 'text-emerald-400' : totalScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
              Score: {totalScore}%
            </span>
            <button
              onClick={() => { setIsAutoPlaying(!isAutoPlaying); if (!isAutoPlaying) { setSimStep('browse'); setFocusedIndex(0); } }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isAutoPlaying ? 'bg-sky-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <SkipForward className="w-3.5 h-3.5" />
              {isAutoPlaying ? 'Stop Demo' : 'Auto Demo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
