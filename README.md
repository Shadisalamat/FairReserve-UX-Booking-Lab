# FairReserve — UX Conflict & Booking Lab

> **Live Demo:** [fairreserve.duckdns.org](https://fairreserve.duckdns.org)

An interactive hotel booking application that lets you **experience and compare** three levels of UX design — from manipulative dark patterns, through ethical design, to accessibility-first excellence — then measure the difference with real metrics.

## The Three UX Modes

| | Bad UX | Good UX | Very Good UX |
|---|---|---|---|
| **Pricing** | Hidden fees, drip pricing across steps | Full price breakdown upfront | Upfront + aria-live price announcements for screen readers |
| **Add-Ons** | Pre-selected (sneak into basket) | Opt-in only | Opt-in with accessible toggle + live total narration |
| **Urgency** | Fake scarcity counters & pressure | Honest availability info | Honest + screen reader compatible alerts |
| **Forms** | Confusing fields, no autofill | Clear labels & structure | `htmlFor` bindings, `inputMode` hints, `autoComplete` tokens |
| **Accessibility** | Hostile (no screen reader support) | WCAG AA compliant | WCAG AA+ with `aria-live`, focus management, keyboard navigation |
| **Cancellation** | Confusing multi-step process | Clear, one-click cancellation | One-click + accessible confirmation dialogs |

## Features

- **5-Step Booking Funnel** — Search → Property Details → Add-Ons → Checkout → Confirmation
- **Live 3-Mode Toggle** — Switch between Bad / Good / Very Good UX at any step
- **Simultaneous Booking Simulator** — See how all three modes handle booking conflicts
- **Disability & Accessibility Simulator** — Test with vision, motor, cognitive, and hearing impairments
- **Screen Reader Simulator** — Experience how each mode sounds to assistive technology
- **UX Effectiveness Dashboard** — Real-time metrics comparing all three modes
- **UX Knowledge Hub** — Educational content on dark patterns and ethical design principles
- **Contribution Showcase** — Detailed breakdown of each team member's improvements with code references

## Very Good UX — All 12 Improvements

### Part 1: Code-Level Accessibility (Good → Very Good)

| # | Improvement | Files Modified | Before (Good UX) | After (Very Good UX) | Impact |
|---|---|---|---|---|---|
| 1 | `aria-live` Regions | AddOnsStep, CheckoutStep | Price changes silently — blind users unaware | Screen reader announces: "Total now $816" | WCAG AA → AAA+ |
| 2 | `htmlFor` Label Bindings | CheckoutStep (×6 fields) | Clicking "Full Name" does nothing | Click label → cursor jumps to input, screen reader reads "Full Name, text field, required" | Error Rate: 3.4% → 1.8% |
| 3 | `inputMode` Keyboard Hints | CheckoutStep (×5 fields) | QWERTY keyboard for card numbers on mobile | Numeric-only pad for cards, @ key for email, phone pad for phone | Time-on-Task: 102s → 88s |
| 4 | `autoComplete` Autofill | CheckoutStep (×6 fields) | Every field typed manually | Browser auto-fills name, email, card from saved data — one tap | CES: 1.8 → 1.2 |
| 5 | `tabIndex` + Keyboard Nav | AddOnsStep | Add-on cards only respond to mouse | Tab navigates cards, Space/Enter toggles selection, violet focus ring | Funnel: 78.4% → 84.2% |
| 6 | `aria-label` + `aria-pressed` | Header (×7 buttons) | Screen reader says "button" | Says "Switch to Very Good UX mode, enhanced accessibility, pressed" | SUS: 88.5 → 92.1 |

### Part 2: UX Design Principles (7 Principles Applied)

| # | Improvement | UX Principle | Before | After (Very Good UX) | Impact |
|---|---|---|---|---|---|
| 7 | Progress Save | Usability | Close browser = lose everything | `localStorage` saves step + form + add-ons, toast "Progress restored" on return | Zero rework |
| 8 | Text Resize (A+/A−) | Accessibility | Fixed font size | Buttons in header, adjustable 80%–140% | Low-vision users can enlarge |
| 9 | Undo/Back with Data Preservation | User Control | Bad UX: going back erases form data | Good/VeryGood: "Your data is saved", Bad: warning "Going back erases your data!" | User trust |
| 10 | Reading Time per Step | Context | No time indicator | Each step shows estimated time (~30s, ~45s, ~1 min) | Clear expectations |
| 11 | Date Validation | Usability | Bad: clears fields + cryptic error | VeryGood: auto-fixes dates + amber warning via `aria-live` | Error prevention |
| 12 | Visual Hierarchy Overlay | Hierarchy | Not available | Footer toggle highlights attention zones: red=primary, orange=secondary, blue=CTA, purple=aria-live | Educational tool |

### Metrics Comparison

| Metric | Bad UX | Good UX | Very Good UX |
|---|---|---|---|
| SUS (System Usability Scale) | 18.2 /100 | 88.5 /100 | **92.1 /100** |
| NPS (Net Promoter Score) | −67 | +68 | **+75** |
| CES (Customer Effort Score) | 6.1 /7 | 1.8 /7 | **1.2 /7** |
| Time-on-Task | 247s | 102s | **88s** |
| Error Rate | 12.4% | 3.4% | **1.8%** |
| Funnel Completion | 23.1% | 78.4% | **84.2%** |
| Chargeback Rate | 4.2% | 0.4% | **0.2%** |
| WCAG Compliance | 18 /100 | 42 /100 | **58 /100** |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (build & dev server)
- **Tailwind CSS v4**
- **Lucide React** (icons)
- **Motion** (animations)
- **Google Gemini AI** (optional, for AI-powered features)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Shadisalamat/FairReserve-UX-Booking-Lab.git
cd FairReserve-UX-Booking-Lab
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key (optional — the app works without it):

```
GEMINI_API_KEY="your-api-key-here"
```

> **Note:** Never commit `.env.local` — it is excluded by `.gitignore`.

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── App.tsx                          # Main app with 3-mode toggle & funnel routing
├── types.ts                         # TypeScript interfaces (UXMode: bad | good | verygood)
├── main.tsx                         # Entry point
├── index.css                        # Global styles (Tailwind)
├── utils/
│   └── pricing.ts                   # Price calculation logic
├── data/
│   ├── mockStays.ts                 # Hotel listings & add-ons
│   ├── uxConflicts.ts               # Bad vs Good vs Very Good UX conflict definitions
│   └── uxEffectivenessMetrics.ts    # Dashboard metric definitions (3 columns)
└── components/
    ├── Header.tsx                   # Navigation & mode toggle
    ├── UXModeBanner.tsx             # Current mode indicator (red / green / violet)
    ├── StepIndicator.tsx            # Funnel progress bar
    ├── UXKnowledgeHub.tsx           # 3-column dossier cards (Bad / Good / Very Good)
    ├── UXEffectivenessDashboard.tsx # Real-time metrics across all 3 modes
    ├── ContributionShowcase.tsx     # Team contributions & methodology breakdown
    ├── DisabilityAccessibilityBar.tsx # Disability simulation controls
    ├── ScreenReaderSimulator.tsx    # Screen reader experience
    ├── ScreenReaderHud.tsx          # Screen reader HUD overlay
    ├── SimultaneousBookingSimulatorModal.tsx # Booking conflict demo (3-mode)
    ├── MetricInfoTooltip.tsx        # Metric explanations
    └── funnel/
        ├── SearchDiscoveryStep.tsx   # Step 1: Browse & search
        ├── PropertyDetailStep.tsx    # Step 2: Property details
        ├── AddOnsStep.tsx            # Step 3: Add-ons & extras
        ├── CheckoutStep.tsx          # Step 4: Payment & form
        └── ConfirmationStep.tsx      # Step 5: Booking confirmation
```

## Security

- All API keys are loaded from environment variables, never hardcoded
- `.env*` files (except `.env.example`) are excluded from version control
- No real payment processing — all forms are simulated
- No user data is collected or stored

## Contributors

- **Shadi Alsalamat** — Design, Development & Research

## License

This project is for educational and research purposes.
