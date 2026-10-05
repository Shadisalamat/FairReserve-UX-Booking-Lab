import React, { useState } from 'react';
import { Stay, UXMode } from '../../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Download, 
  MessageSquare, 
  MapPin, 
  Key, 
  Wifi, 
  Sparkles, 
  Copy, 
  Check, 
  PhoneCall, 
  HelpCircle,
  RotateCcw,
  Gift
} from 'lucide-react';

interface ConfirmationStepProps {
  stay: Stay;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestName: string;
  totalPaid: number;
  mode: UXMode;
  onReset: () => void;
  onOpenConflictModal: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  stay,
  checkInDate,
  checkOutDate,
  nights,
  guestName,
  totalPaid,
  mode,
  onReset,
  onOpenConflictModal,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [showSneakySubscriptionModal, setShowSneakySubscriptionModal] = useState(false);

  const bookingCode = 'FR-84920-ECO';

  const handleCopy = () => {
    navigator.clipboard?.writeText(bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Mock Calendar .ICS export
  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FairReserve//EN
BEGIN:VEVENT
UID:${bookingCode}@fairreserve.app
SUMMARY:Stay at ${stay.name}
DESCRIPTION:Reservation confirmed for ${nights} nights in ${stay.location}. Reference: ${bookingCode}
LOCATION:${stay.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reservation-${bookingCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Bad UX Subscription Trap Modal */}
      {showSneakySubscriptionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2 border-rose-500 shadow-2xl animate-shake">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Dark Pattern: Negative Option / Forced Continuity</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Claim $50 Instant Travel Rewards Voucher?
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              By clicking "Claim Now", you enroll in our VIP Global Discount Club. Your payment card will be charged <strong className="text-rose-600">$39.99 each month</strong> following a 7-day trial.
            </p>
            <div className="mt-4 p-3 bg-rose-50 rounded-xl text-[10px] text-rose-900 border border-rose-200">
              <strong>Deceptive Cancellation Trap:</strong> Cancellation requires submitting a notarized paper letter postmarked 30 days in advance.
            </div>
            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowSneakySubscriptionModal(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Decline & Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Simulated Trap: In a real dark pattern app, you would have just been enrolled into a monthly recurring subscription!");
                  setShowSneakySubscriptionModal(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Claim $50 & Authorize Recurring Billing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOOD UX: Clear, Confirmed, Reassuring Dossier */}
      {(mode === 'good' || mode === 'verygood') && (
        <div className={`bg-white rounded-3xl p-8 border shadow-sm space-y-8 ${mode === 'verygood' ? 'border-violet-200' : 'border-emerald-200'}`}>
          
          {/* Success Banner */}
          <div className="text-center space-y-3" {...(mode === 'verygood' && { role: 'alert', 'aria-live': 'assertive', 'aria-atomic': 'true' })}>
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-xs ${mode === 'verygood' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${mode === 'verygood' ? 'text-violet-700 bg-violet-50 border-violet-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
                {mode === 'verygood' ? 'Accessible Reservation Confirmed & Guaranteed ♿' : 'Reservation Confirmed & Guaranteed'}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                We're excited to welcome you, {guestName || 'Elena'}!
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto mt-1">
                Your sanctuary reservation at <strong>{stay.name}</strong> is completely finalized. A full travel dossier has been emailed to you.
              </p>
            </div>

            {/* Copyable Reference Pill */}
            <div className="inline-flex items-center space-x-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-xs font-mono">
              <span className="text-slate-500 font-sans font-semibold">Confirmation Code:</span>
              <span className="font-bold text-slate-900">{bookingCode}</span>
              <button
                type="button"
                onClick={handleCopy}
                {...(mode === 'verygood' && { 'aria-label': copiedCode ? 'Confirmation code copied' : `Copy confirmation code ${bookingCode}` })}
                className="text-slate-500 hover:text-emerald-700 ml-1 p-1 rounded transition"
                title="Copy reference code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Instant Action Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadCalendar}
              {...(mode === 'verygood' && { 'aria-label': 'Download calendar event for your reservation' })}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition shadow-2xs ${mode === 'verygood' ? 'bg-slate-50 hover:bg-violet-50 border-slate-200 hover:border-violet-300 text-slate-800 hover:text-violet-900' : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900'}`}
            >
              <Calendar className={`w-4 h-4 ${mode === 'verygood' ? 'text-violet-600' : 'text-emerald-600'}`} />
              <span>Add to Google / Apple Calendar</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Simulated offline PDF receipt generated & downloaded!")}
              {...(mode === 'verygood' && { 'aria-label': 'Download offline PDF booking dossier' })}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition shadow-2xs ${mode === 'verygood' ? 'bg-slate-50 hover:bg-violet-50 border-slate-200 hover:border-violet-300 text-slate-800 hover:text-violet-900' : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900'}`}
            >
              <Download className={`w-4 h-4 ${mode === 'verygood' ? 'text-violet-600' : 'text-emerald-600'}`} />
              <span>Download Offline PDF Dossier</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Direct host messenger opened: Host responds in ~5 minutes.")}
              {...(mode === 'verygood' && { 'aria-label': 'Open direct message to villa concierge' })}
              className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-bold transition shadow-2xs ${mode === 'verygood' ? 'bg-slate-50 hover:bg-violet-50 border-slate-200 hover:border-violet-300 text-slate-800 hover:text-violet-900' : 'bg-slate-50 hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900'}`}
            >
              <MessageSquare className={`w-4 h-4 ${mode === 'verygood' ? 'text-violet-600' : 'text-emerald-600'}`} />
              <span>Message Villa Concierge</span>
            </button>
          </div>

          {/* Stay Logistics & Keycode Details */}
          <div className={`p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs ${mode === 'verygood' ? 'bg-violet-50/50 border border-violet-200' : 'bg-emerald-50/50 border border-emerald-200'}`}>
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 {mode === 'verygood' ? 'text-violet-700' : 'text-emerald-700'} shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">Sanctuary Address</strong>
                <span className="text-slate-600">{stay.location}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">GPS coordinates pinned in your email</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Key className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">Digital Keypad Code</strong>
                <span className="text-slate-600 font-mono font-bold text-sm">#8492</span>
                <span className="text-[10px] text-slate-500 block">Activates 3:00 PM on arrival day</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Wifi className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-bold">High-Speed Wi-Fi</strong>
                <span className="text-slate-600 font-mono font-medium">SSID: Haven_5G</span>
                <span className="text-[10px] text-slate-500 block">Pass: sanctuary-peace</span>
              </div>
            </div>
          </div>

          {/* Guaranteed Accessibility Accommodations Pass (Good UX) */}
          {stay.accessibility && (
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-xs text-sky-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" {...(mode === 'verygood' && { role: 'status', 'aria-label': 'Accessibility accommodations confirmed and guaranteed' })}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">
                  ♿
                </div>
                <div>
                  <strong className="block font-bold text-sky-900">
                    Guaranteed Architectural Access Pass (Locked &amp; Confirmed)
                  </strong>
                  <p className="text-[11px] text-sky-800 mt-0.5">
                    Ground floor step-free suite • 36" doorway clearance • Roll-in shower reserved • Service animal welcomed at $0 surcharge.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-sky-200/80 text-sky-900 font-mono font-bold text-[10px] shrink-0">
                100% ADA GUARANTEED
              </span>
            </div>
          )}

          {/* Receipt Summary */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs" {...(mode === 'verygood' && { 'aria-live': 'polite', 'aria-atomic': 'true' })}>
            <div className="text-slate-500">
              Total charged to card: <strong className="text-slate-900 font-mono font-bold">${totalPaid}</strong> • No further charges or recurring fees
            </div>

            <button
              onClick={onReset}
              {...(mode === 'verygood' && { 'aria-label': 'Reset and start another accessible test booking' })}
              className={`font-bold hover:underline inline-flex items-center space-x-1 ${mode === 'verygood' ? 'text-violet-700' : 'text-emerald-700'}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{mode === 'verygood' ? 'Start another accessible test booking ♿' : 'Start another test booking'}</span>
            </button>
          </div>

        </div>
      )}

      {/* BAD UX: Ambiguous Confirmation, Fake Rewards Bait & Support Queue */}
      {mode === 'bad' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-rose-400 shadow-lg space-y-6">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 flex items-start space-x-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-sm text-amber-950">
                Reservation Status: PENDING DISPATCH AUDIT (Not Guaranteed)
              </strong>
              <p className="mt-0.5 text-amber-800">
                Your payment card has been billed ${totalPaid}, but room inventory confirmation is currently queued for manual underwriter review. Please allow 48 to 72 business hours for our manual review department.
              </p>
            </div>
          </div>

          {/* Sneaky Recurring Subscription Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-1 text-amber-200 text-xs font-bold uppercase">
                  <Gift className="w-4 h-4" />
                  <span>Exclusive Post-Purchase Voucher</span>
                </div>
                <h3 className="text-xl font-black mt-1">Claim Your $50 Travel Cashback Reward!</h3>
                <p className="text-xs text-rose-100 max-w-md mt-0.5">
                  Click below to deposit your $50 credit directly toward future hotel bookings.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSneakySubscriptionModal(true)}
                className="px-5 py-3 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-lg hover:bg-rose-50 transition shrink-0 animate-bounce"
              >
                CLAIM $50 REWARD NOW →
              </button>
            </div>
          </div>

          {/* Missing Features & Hostile Support */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-700 font-bold">
              <PhoneCall className="w-4 h-4 text-slate-500" />
              <span>Need help or check-in instructions?</span>
            </div>
            <p className="text-slate-600">
              Keycode and exact street address are withheld until 2 hours before check-in for security protocols. To inquire, call 1-800-555-0199.
            </p>
            <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-[11px] text-rose-800 font-medium">
              ⚠️ Simulated support wait time: <strong>58 minutes</strong> (39 callers ahead in queue).
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
            <button
              onClick={onOpenConflictModal}
              className="text-indigo-600 font-bold hover:underline"
            >
              Analyze UX Conflict #7: Post-Purchase Subscription Traps
            </button>

            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
            >
              Restart Simulation
            </button>
          </div>
        </div>
      )}

      {/* COMPARE MODE: Side-by-side comparison */}
      {mode === 'compare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Good UX Side */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Good UX Confirmation</span>
              </div>
              <p className="text-xs text-slate-600">
                Instantly confirmed, clear copyable booking code, 1-click Google/Apple calendar export (.ics), exact keypad door code, Wi-Fi password, and direct chat with host. Zero upsells or hidden subscriptions.
              </p>
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-mono">
                Code: FR-84920-ECO (Guaranteed)
              </div>
            </div>

            {/* Bad UX Side */}
            <div className="p-6 rounded-2xl bg-white border border-rose-300 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Bad UX Confirmation</span>
              </div>
              <p className="text-xs text-slate-600">
                Leaves user anxious ("Pending manual underwriter review"), withholds keycode, offers misleading "$50 cashback" button that enrolls user into a $39.99/mo recurring subscription (Forced Continuity), and provides no calendar sync.
              </p>
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900 text-xs font-mono">
                Status: Pending 48-72h Manual Review
              </div>
            </div>

          </div>

          <div className="text-center pt-4">
            <button
              onClick={onReset}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Restart Full Funnel Experience
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
