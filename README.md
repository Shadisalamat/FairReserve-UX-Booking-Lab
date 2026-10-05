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

## Very Good UX — Key Improvements

Code-level accessibility enhancements that upgraded Good UX to Very Good UX:

| Improvement | What It Does | Impact |
|---|---|---|
| `aria-live` Regions | Screen readers announce price changes automatically | WCAG AA → AA+ |
| `htmlFor` Label Bindings | Click label → focus input, screen readers announce field names | Error Rate: 3.4% → 1.8% |
| `inputMode` Keyboard Hints | Numeric pad for cards, email keyboard for email fields | Time-on-Task: 102s → 88s |
| `autoComplete` Autofill | Browser auto-fills name, email, card from saved data | Checkout time cut by ~40% |
| Focus Management | Logical tab order, visible focus rings, skip-to-content | Full keyboard navigation |
| Accessible Collision Handling | Booking conflicts announced via aria-live with recovery options | Zero silent failures |

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
