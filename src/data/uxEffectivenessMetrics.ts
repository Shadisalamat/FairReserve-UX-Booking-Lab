export interface FunnelTimeStep {
  stepId: string;
  stepName: string;
  goodSeconds: number;
  badSeconds: number;
  frictionNoteGood: string;
  frictionNoteBad: string;
}

export interface ErrorMetricItem {
  category: string;
  goodRate: number; // percentage
  badRate: number; // percentage
  deltaMultiplier: string; // e.g. "14.3x"
  description: string;
  realWorldConsequence: string;
}

export interface SentimentMetricItem {
  metric: string;
  goodScore: string | number;
  badScore: string | number;
  scaleLabel: string;
  goodInterpretation: string;
  badInterpretation: string;
  benchmarkContext: string;
}

export interface BusinessRoiMetric {
  metric: string;
  goodValue: string;
  badValue: string;
  businessImpactNote: string;
}

export interface WcagAuditItem {
  criterion: string;
  title: string;
  level: 'A' | 'AA' | 'AAA';
  goodUxStatus: 'Pass' | 'Exceeds';
  goodUxDetails: string;
  badUxStatus: 'Fail' | 'Severe Violation';
  badUxDetails: string;
  legalImpact: string;
}

export interface DarkPatternTaxonomyItem {
  id: string;
  name: string;
  category: 'Deceptive Pricing' | 'Forced Action' | 'Urgency & Scarcity' | 'Obstruction' | 'Sneaking';
  legalRisk: 'FTC Violation' | 'EU DMA/DSA Prohibited' | 'UK CMA Unfair Practice' | 'Class Action Exposure';
  severity: 'Critical' | 'High' | 'Medium';
  badExampleInApp: string;
  goodCountermeasure: string;
  psychologicalImpact: string;
}

export interface StepRetentionItem {
  stepIndex: number;
  stepId: string;
  stepName: string;
  goodRetentionRate: number; // e.g. 100, 96, 91, 85, 78.4
  badRetentionRate: number;  // e.g. 100, 82, 64, 41, 31.8
  dropOffCauseGood: string;
  dropOffCauseBad: string;
}

export interface UXEffectivenessDataset {
  overview: {
    timeOnTask: {
      goodSeconds: number;
      badSeconds: number;
      timeSavedPercent: number;
      speedMultiplier: string;
    };
    errorRate: {
      goodPercent: number;
      badPercent: number;
      reductionMultiplier: string;
    };
    sentimentScore: {
      goodSus: number;
      badSus: number;
      goodNps: number;
      badNps: number;
      goodCes: number;
      badCes: number;
    };
  };
  timeSteps: FunnelTimeStep[];
  errorRates: ErrorMetricItem[];
  sentimentMetrics: SentimentMetricItem[];
  businessImpact: BusinessRoiMetric[];
  userFeedback: {
    good: { quote: string; role: string; tag: string }[];
    bad: { quote: string; role: string; tag: string }[];
  };
  retentionWaterfall: StepRetentionItem[];
  darkPatterns: DarkPatternTaxonomyItem[];
  wcagAudit: WcagAuditItem[];
}

export const UX_EFFECTIVENESS_DATA: UXEffectivenessDataset = {
  overview: {
    timeOnTask: {
      goodSeconds: 102, // 1m 42s
      badSeconds: 258,  // 4m 18s
      timeSavedPercent: 60.5,
      speedMultiplier: '2.5x faster'
    },
    errorRate: {
      goodPercent: 3.4,
      badPercent: 48.7,
      reductionMultiplier: '14.3x lower error rate'
    },
    sentimentScore: {
      goodSus: 88.5,
      badSus: 32.1,
      goodNps: 68,
      badNps: -56,
      goodCes: 1.4, // out of 7 (lower is better)
      badCes: 6.2  // out of 7
    }
  },
  timeSteps: [
    {
      stepId: 'browse',
      stepName: '1. Search & Discovery',
      goodSeconds: 18,
      badSeconds: 44,
      frictionNoteGood: 'Transparent all-in prices, explicit ADA badges, and clear instant filter results.',
      frictionNoteBad: 'Bait pricing hides $111+ mandatory fees, forcing guests to click into listings just to guess true cost.'
    },
    {
      stepId: 'details',
      stepName: '2. Room & Policy Selection',
      goodSeconds: 26,
      badSeconds: 58,
      frictionNoteGood: 'Clear cancellation milestone calendar and honest live inventory countdown without false urgency.',
      frictionNoteBad: 'Fabricated 5-minute ticking timer triggers anxiety; guest pauses to decipher hidden fine print.'
    },
    {
      stepId: 'addons',
      stepName: '3. Add-Ons & Extras',
      goodSeconds: 14,
      badSeconds: 62,
      frictionNoteGood: 'Zero pre-checked boxes; clean opt-in selections with clear itemized line-item pricing.',
      frictionNoteBad: 'Pre-checked $113 insurance sneak-in, confirmshaming modal ("No, I prefer risking financial loss").'
    },
    {
      stepId: 'checkout',
      stepName: '4. Guest Details & Payment',
      goodSeconds: 32,
      badSeconds: 94,
      frictionNoteGood: 'Consolidated single-name field, 1-click test fill, unified date picker, and zero stealth fees.',
      frictionNoteBad: 'Split title/salutation, required fax number, security questions, strict date slash format rejections.'
    },
    {
      stepId: 'confirmation',
      stepName: '5. Confirmation & Review',
      goodSeconds: 12,
      badSeconds: 40,
      frictionNoteGood: 'Instant unambiguous receipt with locked access pass and 1-click cancellation button.',
      frictionNoteBad: 'Customer spent 40s auditing surprise service fees and locating hidden cancellation phone numbers.'
    }
  ],
  errorRates: [
    {
      category: 'Unintended Purchases (Sneak-in Basket)',
      goodRate: 0.8,
      badRate: 42.1,
      deltaMultiplier: '52.6x worse',
      description: 'Guests unknowingly purchasing optional insurance, priority check-in, or damage waivers.',
      realWorldConsequence: 'Leads directly to post-stay billing disputes, customer support rage, and credit card chargebacks.'
    },
    {
      category: 'Form Validation Rejections',
      goodRate: 4.1,
      badRate: 68.3,
      deltaMultiplier: '16.6x worse',
      description: 'Rejected inputs caused by rigid date syntax (MM/DD/YYYY vs picker), required fax fields, or postal mismatches.',
      realWorldConsequence: 'Form resets cause users to abandon transactions; 24% never return to complete the booking.'
    },
    {
      category: 'Cart Price Shock Abandonment',
      goodRate: 2.2,
      badRate: 34.6,
      deltaMultiplier: '15.7x worse',
      description: 'Users who abandon checkout immediately upon discovering the final total is +40% higher than advertised.',
      realWorldConsequence: 'Massive funnel leak at the finish line, destroying ad spend efficiency (ROAS) and user trust.'
    },
    {
      category: 'Double-Booking & Urgency Panic Slips',
      goodRate: 1.1,
      badRate: 28.5,
      deltaMultiplier: '25.9x worse',
      description: 'Errors triggered by artificial timers and false "38 people viewing" notices rushing users into mistakes.',
      realWorldConsequence: 'Wrong date selections, duplicate card charges, and post-booking buyer remorse cancellations.'
    }
  ],
  sentimentMetrics: [
    {
      metric: 'System Usability Scale (SUS)',
      goodScore: '88.5 / 100 (Grade A+)',
      badScore: '32.1 / 100 (Grade F)',
      scaleLabel: '0 to 100 (Industry benchmark average: 68.0)',
      goodInterpretation: 'Top 4% of digital products worldwide. Users describe experience as effortless and trustworthy.',
      badInterpretation: 'Bottom 5% of digital products. Categorized as severely defective with unacceptable friction.',
      benchmarkContext: 'Independent usability tests across 500 reservation flows (Sauro & Lewis standardized SUS scale).'
    },
    {
      metric: 'Net Promoter Score (NPS)',
      goodScore: '+68 (Promoter Dominant)',
      badScore: '-56 (Detractor Dominant)',
      scaleLabel: '-100 to +100 range',
      goodInterpretation: '76% Promoters who actively recommend the service to friends and family; organic word-of-mouth growth.',
      badInterpretation: '68% Detractors who actively warn colleagues on social media, review sites, and consumer protection forums.',
      benchmarkContext: 'Measured 48 hours post-checkout following room reservation completion.'
    },
    {
      metric: 'Customer Effort Score (CES)',
      goodScore: '1.4 / 7.0 (Very Low Effort)',
      badScore: '6.2 / 7.0 (Extreme Effort)',
      scaleLabel: '1.0 (Extremely Easy) to 7.0 (Extremely Difficult)',
      goodInterpretation: 'Seamless intuitive flow requiring minimal cognitive bandwidth or corrective back-tracking.',
      badInterpretation: 'Severe mental fatigue; users felt they had to actively defend against manipulative UI traps.',
      benchmarkContext: 'Standardized Gartner Customer Effort Score benchmark survey.'
    },
    {
      metric: 'Perceived Transparency & Honesty',
      goodScore: '96.2%',
      badScore: '11.8%',
      scaleLabel: '% of respondents agreeing "The platform was upfront and fair"',
      goodInterpretation: 'Users reported high psychological safety and zero suspicion of hidden financial traps.',
      badInterpretation: '88.2% felt the platform was actively deceiving them or obscuring mandatory fees.',
      benchmarkContext: 'Post-purchase satisfaction survey on billing integrity.'
    }
  ],
  businessImpact: [
    {
      metric: 'Checkout Completion Rate',
      goodValue: '78.4%',
      badValue: '31.8%',
      businessImpactNote: 'Transparent pricing retains 2.46x more high-intent shoppers who complete the reservation without rage-quitting.'
    },
    {
      metric: 'Payment Dispute & Chargeback Rate',
      goodValue: '0.3%',
      badValue: '8.9%',
      businessImpactNote: 'Dark patterns generate costly Visa/Mastercard merchant disputes, jeopardizing payment processor standing.'
    },
    {
      metric: '90-Day Repeat Booking Loyalty',
      goodValue: '48.2%',
      badValue: '11.4%',
      businessImpactNote: 'Ethical UX generates 4.2x higher lifetime customer value (LTV) through brand loyalty vs one-time extraction.'
    },
    {
      metric: 'Customer Support Tickets per 1k Bookings',
      goodValue: '16 tickets',
      badValue: '238 tickets',
      businessImpactNote: 'Eliminating drip pricing and sneaky insurance saves $14.20 in operational contact center costs per booking.'
    }
  ],
  userFeedback: {
    good: [
      {
        quote: "I knew the exact final price from the very first search card. Zero surprises at checkout.",
        role: "Frequent Business Traveler",
        tag: "Pricing Clarity"
      },
      {
        quote: "So refreshing to not have to uncheck 3 pre-selected insurance boxes or decline guilt-trip popups.",
        role: "Family Vacation Planner",
        tag: "Zero Confirmshaming"
      },
      {
        quote: "The accessibility specifications had actual doorway measurements and confirmed roll-in shower specs.",
        role: "Accessible Travel Advocate",
        tag: "Disability Equity"
      }
    ],
    bad: [
      {
        quote: "The room was advertised at $189/night, but after resort and mystery 'convenience' fees it was over $340.",
        role: "Disappointed Guest",
        tag: "Drip Pricing Shock"
      },
      {
        quote: "I didn't realize I bought $113 in travel insurance until my credit card receipt arrived. Total trick.",
        role: "Budget Traveler",
        tag: "Pre-checked Trap"
      },
      {
        quote: "The 5-minute ticking timer gave me anxiety, and then the form wiped my data because I used slashes in the date.",
        role: "First-time Booker",
        tag: "Hostile Forms"
      }
    ]
  },
  retentionWaterfall: [
    {
      stepIndex: 1,
      stepId: 'browse',
      stepName: 'Search & Listing Discovery',
      goodRetentionRate: 100,
      badRetentionRate: 100,
      dropOffCauseGood: 'Zero initial drop-off. Full all-in transparency with ADA amenity indicators.',
      dropOffCauseBad: 'Initial clicks high due to artificial low-price clickbait ($189 teaser rate).'
    },
    {
      stepIndex: 2,
      stepId: 'details',
      stepName: 'Property Details & Terms',
      goodRetentionRate: 96.2,
      badRetentionRate: 82.4,
      dropOffCauseGood: 'Clear cancellation milestones and verified room specs keep 96% engaged.',
      dropOffCauseBad: '17.6% bounce after seeing mandatory $75 cleaning fee and fake 5-minute timer panic.'
    },
    {
      stepIndex: 3,
      stepId: 'addons',
      stepName: 'Protection & Add-Ons',
      goodRetentionRate: 91.5,
      badRetentionRate: 64.1,
      dropOffCauseGood: 'Explicit opt-in with $0 defaults; guests feel respected and in control.',
      dropOffCauseBad: '35.9% total abandonment rate triggered by pre-checked $113 insurance and confirmshaming popups.'
    },
    {
      stepIndex: 4,
      stepId: 'checkout',
      stepName: 'Guest Info & Card Payment',
      goodRetentionRate: 85.0,
      badRetentionRate: 41.2,
      dropOffCauseGood: 'Single-field names, 1-click test autofill, and upfront taxes minimize checkout friction.',
      dropOffCauseBad: '58.8% checkout drop-off due to surprise +$111 resort fees and hostile form wipes on format errors.'
    },
    {
      stepIndex: 5,
      stepId: 'confirmation',
      stepName: 'Completed Reservation',
      goodRetentionRate: 78.4,
      badRetentionRate: 31.8,
      dropOffCauseGood: 'Final conversion: 78.4%. Confident guests with zero post-booking buyer remorse.',
      dropOffCauseBad: 'Final conversion: 31.8%. 68.2% total funnel leak. Remaining bookers have high chargeback risk.'
    }
  ],
  darkPatterns: [
    {
      id: 'drip-pricing',
      name: 'Hidden Fees / Drip Pricing',
      category: 'Deceptive Pricing',
      legalRisk: 'FTC Violation',
      severity: 'Critical',
      badExampleInApp: 'Listing states $189/night, but adds $45 resort fee, $35 booking fee, and $31 cleaning fee on final screen.',
      goodCountermeasure: 'All-in transparent pricing displayed on the first search card, matching checkout to the penny.',
      psychologicalImpact: 'Triggers sunk cost fallacy, anger, and checkout abandonment (68% drop-off).'
    },
    {
      id: 'sneak-into-basket',
      name: 'Sneak into Basket (Pre-ticked Add-ons)',
      category: 'Sneaking',
      legalRisk: 'EU DMA/DSA Prohibited',
      severity: 'Critical',
      badExampleInApp: 'Auto-checks $113 comprehensive travel protection and $24 priority luggage service without consent.',
      goodCountermeasure: 'Explicit opt-in with $0 default and clear itemized benefit descriptions.',
      psychologicalImpact: 'Erodes customer trust; causes 52x higher accidental purchases and chargeback disputes.'
    },
    {
      id: 'confirmshaming',
      name: 'Confirmshaming',
      category: 'Forced Action',
      legalRisk: 'UK CMA Unfair Practice',
      severity: 'High',
      badExampleInApp: 'Declining insurance forces clicking "No, I accept 100% financial ruin and risk my trip".',
      goodCountermeasure: 'Neutral action verbs ("Decline protection" vs "Add protection") with no emotional manipulation.',
      psychologicalImpact: 'Induces artificial guilt, emotional coercion, and brand resentment.'
    },
    {
      id: 'false-urgency',
      name: 'Artificial Scarcity & False Urgency',
      category: 'Urgency & Scarcity',
      legalRisk: 'FTC Violation',
      severity: 'High',
      badExampleInApp: 'Fake 5-minute countdown clock that resets, plus "38 people viewing right now" banner.',
      goodCountermeasure: 'Real-time verified inventory counts ("3 rooms available for your dates") with no countdown anxiety.',
      psychologicalImpact: 'Induces panic decision-making, increasing reservation mistakes by 25.9x.'
    },
    {
      id: 'hostile-forms',
      name: 'Friction Injection & Hostile Forms',
      category: 'Obstruction',
      legalRisk: 'Class Action Exposure',
      severity: 'Medium',
      badExampleInApp: 'Mandatory fax field, required security questions, and wipes all inputs if date contains slashes.',
      goodCountermeasure: 'Smart validation, unified date pickers, clear inline helper text, and 1-click test fill.',
      psychologicalImpact: 'Causes high cognitive fatigue (CES 6.2/7) and frustration.'
    },
    {
      id: 'roach-motel',
      name: 'Roach Motel (Hard to Cancel)',
      category: 'Obstruction',
      legalRisk: 'FTC Violation',
      severity: 'Critical',
      badExampleInApp: 'Requires calling an international toll phone line during limited business hours with 45-min hold.',
      goodCountermeasure: 'Instant 1-click self-service cancellation with clear countdown of remaining refund days.',
      psychologicalImpact: 'Traps consumers, violates FTC "Click-to-Cancel" mandates, and explodes support tickets.'
    }
  ],
  wcagAudit: [
    {
      criterion: '1.4.3 Contrast (Minimum)',
      title: 'Text Contrast against Background',
      level: 'AA',
      goodUxStatus: 'Exceeds',
      goodUxDetails: '7.2:1 contrast ratio across all labels, buttons, and fee breakdowns (exceeds AAA standards).',
      badUxStatus: 'Severe Violation',
      badUxDetails: '1.9:1 faint gray text (#a1a1aa on #f4f4f5) used deliberately to hide cancellation penalties.',
      legalImpact: 'ADA Title III Civil Rights Violation; easily triggers DOJ digital enforcement actions.'
    },
    {
      criterion: '2.2.1 Timing Adjustable',
      title: 'User-Controlled Time Limits',
      level: 'A',
      goodUxStatus: 'Pass',
      goodUxDetails: 'Zero artificial timers. Users can browse at their own pace without session expiry threats.',
      badUxStatus: 'Fail',
      badUxDetails: 'Arbitrary 5-minute ticking timer forces rushed completion with no extension mechanism.',
      legalImpact: 'Direct WCAG 2.2 Level A failure; causes severe cognitive barrier for neurodivergent users.'
    },
    {
      criterion: '3.3.2 Labels or Instructions',
      title: 'Persistent Form Field Labels',
      level: 'A',
      goodUxStatus: 'Pass',
      goodUxDetails: 'Persistent top labels, clear input masks, and helpful field descriptions on all inputs.',
      badUxStatus: 'Fail',
      badUxDetails: 'Disappearing placeholders with no persistent labels; ambiguous required vs optional markers.',
      legalImpact: 'Severe barrier for cognitive and screen reader users; causes 68% form rejection rates.'
    },
    {
      criterion: '3.3.4 Error Prevention (Legal/Financial)',
      title: 'Review and Confirm Financial Commitments',
      level: 'AA',
      goodUxStatus: 'Exceeds',
      goodUxDetails: 'Transparent itemized confirmation screen allowing review before card is charged.',
      badUxStatus: 'Severe Violation',
      badUxDetails: 'Charges card instantly while concealing add-on fees; no opportunity to correct sneaky add-ons.',
      legalImpact: 'Violates both WCAG 3.3.4 and consumer protection financial disclosure mandates.'
    },
    {
      criterion: '4.1.3 Status Messages',
      title: 'ARIA Live Notifications',
      level: 'AA',
      goodUxStatus: 'Pass',
      goodUxDetails: 'aria-live="polite" announces dynamic price changes, room availability, and date validations.',
      badUxStatus: 'Fail',
      badUxDetails: 'Silent DOM injections; screen reader users are unaware of ticking clocks or added fees.',
      legalImpact: 'Screen reader users cannot audit financial changes before submitting payment.'
    }
  ]
};
