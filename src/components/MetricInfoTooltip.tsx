import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

export interface MetricFormulaInfo {
  metricName: string;
  formula: string;
  operationalDefinition: string;
  variables?: { name: string; definition: string }[];
  sampleCalculation?: string;
  standardsReference?: string;
}

interface MetricInfoTooltipProps {
  info: MetricFormulaInfo;
  align?: 'left' | 'right' | 'center';
  position?: 'top' | 'bottom';
  className?: string;
}

export const METRIC_FORMULAS: Record<string, MetricFormulaInfo> = {
  timeOnTask: {
    metricName: 'Median Time-on-Task (Latency)',
    formula: 'Time-on-Task = T_completion - T_first_interaction',
    operationalDefinition:
      'The median elapsed duration (in seconds) required for an active participant to successfully complete the full reservation workflow, measured from the initial catalog search render to the final booking confirmation receipt.',
    variables: [
      { name: 'T_completion', definition: 'Timestamp when the final transaction POST receives HTTP 200/confirmation state.' },
      { name: 'T_first_interaction', definition: 'Timestamp of the user’s first navigation or search filter event.' }
    ],
    sampleCalculation:
      'Good UX: Median = 102s (1m 42s). Bad UX: Median = 258s (4m 18s). Speed difference: (258 - 102) / 258 = 60.5% latency reduction.',
    standardsReference: 'ISO 9241-11: Usability Metrics (Efficiency & Task Duration Benchmarks).'
  },
  errorRate: {
    metricName: 'Task Error & Slip Rate',
    formula: 'Error Rate (%) = (Total Detected Form Errors + Unintended Basket Additions + Form Resets) / Total Critical Actions × 100',
    operationalDefinition:
      'The percentage of task trials in which a user commits a slip or mistake, such as failing rigid form syntax (e.g. MM/DD/YYYY slash rejections), inadvertently purchasing a pre-ticked add-on, or abandoning an in-flight modal.',
    variables: [
      { name: 'Slips & Mistakes', definition: 'Unintentional actions caused by ambiguous UI, rigid validations, or sneak-in defaults.' },
      { name: 'Total Critical Actions', definition: 'Sum of required input interactions across the 5 reservation steps (N=500 sessions).' }
    ],
    sampleCalculation:
      'Good UX: 17 errors across 500 sessions = 3.4%. Bad UX: 243 errors across 500 sessions = 48.7% (14.3x higher error frequency).',
    standardsReference: 'Nielsen Norman Group & ISO 9241-210 human-computer interaction error taxonomy.'
  },
  susScore: {
    metricName: 'System Usability Scale (SUS)',
    formula: 'SUS = 2.5 × [ Σ (R_odd - 1) + Σ (5 - R_even) ]',
    operationalDefinition:
      'Industry-standard 10-item psychometric composite measuring perceived system usability, learnability, and satisfaction on a standardized 0–100 scale.',
    variables: [
      { name: 'R_odd', definition: 'Response rating (1–5) on positively worded questions (e.g., "I found the system easy to use"). Contribution = Response - 1.' },
      { name: 'R_even', definition: 'Response rating (1–5) on negatively worded questions (e.g., "I found the system unnecessarily complex"). Contribution = 5 - Response.' }
    ],
    sampleCalculation:
      'Raw sum of 10 converted items (0 to 40) multiplied by 2.5. Industry benchmark average is 68.0. Good UX: 88.5 (Grade A+, Top 4%). Bad UX: 32.1 (Grade F, Critical failure).',
    standardsReference: 'Sauro & Lewis (2012) Standardized Usability Scale & Bangor, Kortum & Miller Benchmarks.'
  },
  npsScore: {
    metricName: 'Net Promoter Score (NPS)',
    formula: 'NPS = % Promoters (Score 9–10) - % Detractors (Score 0–6)',
    operationalDefinition:
      'Measures customer brand sentiment and advocacy post-checkout on an 11-point scale (0 to 10): "How likely are you to recommend this hotel reservation platform to a friend or colleague?"',
    variables: [
      { name: 'Promoters (9–10)', definition: 'Loyal enthusiasts who fuel organic growth and repeat bookings.' },
      { name: 'Passives (7–8)', definition: 'Satisfied but unenthusiastic guests vulnerable to competitor offerings.' },
      { name: 'Detractors (0–6)', definition: 'Unhappy customers who damage brand reputation via negative word-of-mouth and social reviews.' }
    ],
    sampleCalculation:
      'Good UX: 76% Promoters - 8% Detractors = +68 NPS. Bad UX: 12% Promoters - 68% Detractors = -56 NPS (Severe Detractor Deficit).',
    standardsReference: 'Bain & Company / Fred Reichheld Net Promoter System.'
  },
  cesScore: {
    metricName: 'Customer Effort Score (CES)',
    formula: 'CES = (Σ Individual Effort Ratings) / Total Respondents',
    operationalDefinition:
      'Gartner single-item cognitive strain metric scored 1 (Extremely Easy / Low Effort) to 7 (Extremely Difficult / High Effort): "How much effort did you personally have to exert to complete this reservation?"',
    variables: [
      { name: 'Effort Rating (1–7)', definition: '1 = Minimal cognitive load; 7 = Intense mental fatigue, multiple corrective steps, or feeling tricked.' }
    ],
    sampleCalculation:
      'Good UX Mean: 1.4 / 7.0 (Near effortless). Bad UX Mean: 6.2 / 7.0 (Extreme cognitive fatigue and resistance).',
    standardsReference: 'Gartner & CEB Customer Effort Score Framework (Dixon, Toman & DeLisi).'
  },
  funnelCompletion: {
    metricName: 'Funnel Completion Rate (Conversion)',
    formula: 'Completion Rate (%) = (Users Completing Step 5 / Users Entering Step 1) × 100',
    operationalDefinition:
      'The proportion of top-of-funnel discovery visitors who successfully complete checkout without rage-quitting, abandoning due to hidden resort fees, or timing out.',
    variables: [
      { name: 'Completed Bookings', definition: 'Reservations with finalized payment authorization.' },
      { name: 'Initial Shoppers', definition: 'Visitors initiating search and selecting dates/rooms.' }
    ],
    sampleCalculation:
      'Good UX: 784 / 1,000 = 78.4%. Bad UX: 318 / 1,000 = 31.8% (Cart price shock causes 68.2% total abandonment).',
    standardsReference: 'E-commerce Conversion Rate & Cart Abandonment Telemetry Standards (Baymard Institute).'
  },
  chargebackRate: {
    metricName: 'Payment Dispute & Chargeback Rate',
    formula: 'Chargeback Rate (%) = (Disputed Credit Card Transactions / Total Settled Bookings) × 100',
    operationalDefinition:
      'The percentage of settled credit card bookings that result in a bank-initiated chargeback dispute due to unrecognized fees, pre-checked add-ons, or cancellation hurdles.',
    variables: [
      { name: 'Disputed Transactions', definition: 'Merchant chargeback notifications (Reason Code: Friendly Fraud / Deceptive Surcharge).' },
      { name: 'Total Settled Bookings', definition: 'Total captured reservation transactions across the period.' }
    ],
    sampleCalculation:
      'Good UX: 0.3% chargebacks ($15 bank penalty risk). Bad UX: 8.9% chargebacks (Visa/Mastercard excessive dispute monitoring threshold is 0.9%).',
    standardsReference: 'Visa & Mastercard Merchant Monitoring Programs (VDMP/VFMP compliance thresholds).'
  },
  wcagScore: {
    metricName: 'WCAG 2.2 Accessibility Compliance',
    formula: 'Compliance Score = (Satisfied Success Criteria / Total Applicable Criteria) × 100',
    operationalDefinition:
      'Rigorous audit against the W3C Web Content Accessibility Guidelines 2.2 across Levels A, AA, and AAA covering contrast ratios, dynamic focus states, accessible form labels, and non-distracting timers.',
    variables: [
      { name: 'Contrast Ratio', definition: 'L1 / L2 relative luminance (Requires >= 4.5:1 for normal text AA, >= 7:1 for AAA).' },
      { name: 'Timing Adjustable (2.2.1)', definition: 'Users must be allowed to turn off, adjust, or extend time limits before expiring.' }
    ],
    sampleCalculation:
      'Good UX: Level AAA Passed (0 violations, 7.2:1 text contrast). Bad UX: 14 Severe Failures (1.9:1 contrast, ticking timers without extension, missing ARIA live regions).',
    standardsReference: 'W3C WCAG 2.2 & US ADA Title III Regulations.'
  },
  roiFormula: {
    metricName: 'Business ROI Financial Simulation',
    formula: 'Annual Net Benefit = 12 × [ (Gross Revenue_Good - Gross Revenue_Bad) + Chargeback Savings + Support Savings ]',
    operationalDefinition:
      'Dynamic bottom-line economic model comparing retained business profits between Ethical UX and Deceptive UX based on volume, cart abandonment, bank fines, and support center overhead.',
    variables: [
      { name: 'Gross Revenue Delta', definition: '(Shoppers × 78.4% - Shoppers × 31.8%) × Average Booking Value.' },
      { name: 'Chargeback Savings', definition: 'Bad Losses [Bookings × 8.9% × (ABV + $15)] - Good Losses [Bookings × 0.3% × (ABV + $15)].' },
      { name: 'Support Savings', definition: 'Difference in contact tickets ($22/ticket; 238 tickets/1k bad bookings vs 16 tickets/1k good bookings).' }
    ],
    sampleCalculation:
      'At 10,000 monthly shoppers @ $380 ABV: Gross delta = +$1.77M/mo; Chargeback + Support savings = +$34.9k/mo; Annual Net Benefit = +$21.7M.',
    standardsReference: 'Harvard Business Review & Forrester Total Economic Impact (TEI) Usability ROI Methodology.'
  },
  retentionRate: {
    metricName: 'Funnel Step Retention Rate',
    formula: 'Step Retention (%) = (Users Advancing Past Step i / Users Entering Step 1) × 100',
    operationalDefinition:
      'Measures user survival rate across each consecutive milestone in the 5-step booking journey, identifying exact drop-off choke points.',
    variables: [
      { name: 'Step i', definition: 'Current milestone: 1. Search, 2. Details, 3. Add-ons, 4. Checkout, 5. Confirmation.' }
    ],
    sampleCalculation:
      'Good UX retains 78.4% through step 5. Bad UX drops from 64.1% to 41.2% at Step 4 alone due to cart price shock (-35.7% relative drop).',
    standardsReference: 'Kohavi, Tang & Xu: Trustworthy Online Controlled Experiments (A/B Testing Funnel Analysis).'
  }
};

export const MetricInfoTooltip: React.FC<MetricInfoTooltipProps> = ({
  info,
  align = 'center',
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible]);

  // Alignment classes
  const alignmentClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2';

  const positionClass =
    position === 'bottom'
      ? 'top-full mt-2'
      : 'bottom-full mb-2';

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={e => {
          e.stopPropagation();
          setIsVisible(prev => !prev);
        }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label={`Formula details for ${info.metricName}`}
        aria-expanded={isVisible}
        className="w-4 h-4 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 inline-flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-[10px] font-bold shrink-0 ml-1 border border-slate-200/80 cursor-help"
        title="View calculation formula &amp; scientific definition"
      >
        <span className="font-serif italic text-[11px] leading-none select-none">i</span>
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`absolute ${positionClass} ${alignmentClass} z-60 w-80 sm:w-96 p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs animate-in fade-in zoom-in-95 duration-150 text-left`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-700">
            <div className="flex items-center space-x-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-mono font-bold">
                ƒ
              </span>
              <h5 className="font-bold text-slate-100 text-xs leading-tight">
                {info.metricName}
              </h5>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Formula Code Box */}
          <div className="my-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
            <code>{info.formula}</code>
          </div>

          {/* Operational Definition */}
          <div className="space-y-2 text-[11px] text-slate-300">
            <p className="leading-relaxed">
              <strong className="text-slate-100 font-semibold">Measurement: </strong>
              {info.operationalDefinition}
            </p>

            {/* Variables breakdown if present */}
            {info.variables && info.variables.length > 0 && (
              <div className="pt-1.5 border-t border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Variables &amp; Conditions
                </span>
                <div className="space-y-1 font-mono text-[10px]">
                  {info.variables.map((v, i) => (
                    <div key={i} className="flex items-start space-x-1.5">
                      <span className="text-indigo-400 font-bold shrink-0">{v.name}:</span>
                      <span className="text-slate-300 font-sans">{v.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Calculation */}
            {info.sampleCalculation && (
              <div className="p-2 rounded-md bg-slate-800/60 border border-slate-700/60 text-[10px] leading-relaxed">
                <strong className="text-indigo-300 font-semibold block mb-0.5">Study Outcome:</strong>
                <span className="text-slate-200">{info.sampleCalculation}</span>
              </div>
            )}

            {/* Scientific Standard Reference */}
            {info.standardsReference && (
              <div className="text-[9px] text-slate-400 pt-1 font-mono flex items-center gap-1">
                <span className="text-indigo-400 font-bold">Standard:</span>
                <span>{info.standardsReference}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
