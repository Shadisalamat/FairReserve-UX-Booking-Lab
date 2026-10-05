# FairReserve — UX Conflict & Booking Lab

An interactive hotel booking application that lets you **experience and compare** manipulative UX (dark patterns) side-by-side with ethical, transparent design — then measure the difference.

## What It Does

Toggle between **Bad UX** and **Good UX** mode at any point in the booking funnel and see how design choices affect trust, clarity, and accessibility:

| Bad UX (Dark Patterns) | Good UX (Ethical Design) |
|---|---|
| Hidden fees revealed at checkout | Full price breakdown upfront |
| Pre-selected add-ons (sneak into basket) | Opt-in add-ons only |
| Fake urgency & scarcity counters | Honest availability info |
| Confusing cancellation flows | Clear, one-click cancellation |
| Hostile accessibility (no screen reader support) | Full WCAG-compliant accessibility |
| Drip pricing across multiple steps | Transparent total from the start |

## Features

- **5-Step Booking Funnel** — Search → Property Details → Add-Ons → Checkout → Confirmation
- **Live Mode Toggle** — Switch between Bad/Good UX at any step to compare
- **Simultaneous Booking Simulator** — See how both modes handle booking conflicts
- **Disability & Accessibility Simulator** — Test with vision, motor, cognitive, and hearing impairments
- **Screen Reader Simulator** — Experience how each mode sounds to assistive technology
- **UX Effectiveness Dashboard** — Real-time metrics comparing both modes
- **UX Knowledge Hub** — Educational content on dark patterns and ethical design principles

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
├── App.tsx                          # Main app with mode toggle & funnel routing
├── types.ts                         # TypeScript interfaces
├── main.tsx                         # Entry point
├── index.css                        # Global styles (Tailwind)
├── utils/
│   └── pricing.ts                   # Price calculation logic
├── data/
│   ├── mockStays.ts                 # Hotel listings & add-ons
│   ├── uxConflicts.ts               # Bad vs Good UX conflict definitions
│   └── uxEffectivenessMetrics.ts    # Dashboard metric definitions
└── components/
    ├── Header.tsx                   # Navigation & mode toggle
    ├── UXModeBanner.tsx             # Current mode indicator
    ├── StepIndicator.tsx            # Funnel progress bar
    ├── UXKnowledgeHub.tsx           # Educational dark pattern library
    ├── UXEffectivenessDashboard.tsx # Real-time comparison metrics
    ├── ContributionShowcase.tsx     # Team contributions
    ├── DisabilityAccessibilityBar.tsx # Disability simulation controls
    ├── ScreenReaderSimulator.tsx    # Screen reader experience
    ├── ScreenReaderHud.tsx          # Screen reader HUD overlay
    ├── SimultaneousBookingSimulatorModal.tsx # Booking conflict demo
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
