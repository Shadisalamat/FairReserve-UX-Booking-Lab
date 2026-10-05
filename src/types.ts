export type UXMode = 'good' | 'bad' | 'compare' | 'verygood';

export type FunnelStep = 'browse' | 'details' | 'addons' | 'checkout' | 'confirmation';

export interface AccessibilitySpecs {
  wheelchairAccessible: boolean;
  stepFreeEntrance: boolean;
  doorwayWidthInches: number;
  rollInShower: boolean;
  toiletGrabBars: boolean;
  elevatorAccess: boolean;
  visualSmokeAlarm: boolean;
  brailleSignage: boolean;
  serviceAnimalSurchargeFree: boolean;
  certifiedAuditDate: string; // e.g. "Verified June 2026"
  accessibleHighlights: string[];
}

export interface Stay {
  id: string;
  name: string;
  tagline: string;
  location: string;
  rating: number;
  reviewCount: number;
  basePricePerNight: number; // Honest baseline
  fakeBaitPricePerNight: number; // What Bad UX advertises
  image: string;
  description: string;
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  availableRooms: number;
  cancellationFreeDays: number;
  accessibility?: AccessibilitySpecs;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
  perNight: boolean;
  category: 'protection' | 'comfort' | 'flexibility' | 'accessibility';
  isPrecheckedInBadUx: boolean;
  badUxConfirmShameText?: string;
  isDisabilityService?: boolean;
}

export interface BookingFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Extra bad UX fields
  salutation?: string;
  fax?: string;
  securityQuestion?: string;
  passportNumber?: string;
  billingPostalCode?: string;
  billingStreet?: string;
  marketingOptIn?: boolean;
  newsletterPartnerOptIn?: boolean;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  // Accessibility accommodations (Good UX)
  accessibilityRequests?: {
    stepFreeRequired?: boolean;
    serviceAnimalAttending?: boolean;
    visualAlertsRequired?: boolean;
    quietSensoryCheckIn?: boolean;
    notes?: string;
  };
}

export interface DisabilitySettings {
  enabled: boolean;
  highContrast: boolean; // WCAG AAA (7:1+ contrast ratios, enhanced borders)
  largeText: boolean; // Scaled font hierarchy for low-vision
  reducedMotion: boolean; // Pause all pulses, spins, and ticking timers
  dyslexicFont: boolean; // Enhanced letter-spacing and readability
  screenReaderHelper: boolean; // Visual ARIA Live announcement HUD simulator
  motorAssistance: boolean; // Minimum 48px touch targets & keyboard assist
  mobilityFilter: 'all' | 'step-free' | 'roll-in-shower' | 'visual-alarms';
}

export interface UXConflictPoint {
  id: string;
  step: FunnelStep;
  category: 'pricing' | 'urgency' | 'forms' | 'navigation' | 'addons' | 'transparency' | 'concurrency' | 'accessibility';
  title: string;
  conflictSummary: string; // The core tension: Business short-term metric vs User autonomy
  badUxName: string;
  badUxDescription: string;
  badUxHarm: string;
  badUxCognitiveBias: string;
  goodUxName: string;
  goodUxDescription: string;
  goodUxBenefit: string;
  heuristicViolated: string; // E.g., Nielsen Norman heuristic
  realWorldImpact: string; // NPS, chargebacks, brand equity
}
