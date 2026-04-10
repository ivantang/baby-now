# Baby Week by Week

A Progressive Web App that guides parents through their baby's development week by week, from birth through 52 weeks. Combines rich weekly content, a milestone tracker, a photo journal, and an AI chat assistant.

**Version:** 1.2 (BRD Draft) | **Status:** In Development

---

## Overview

Most baby development apps lock core emotional features behind paywalls, are cluttered with ads, or feel clinical and anxiety-inducing. This app gives parents everything they need for free — warm, week-by-week development content, milestone tracking, and a photo journal — with the option to unlock a genuinely helpful AI assistant at a fair price.

**Free forever:** Week content, illustrations, tips, milestone tracker, photo journal, cross-device sync (with account)

**Paid only:** AI chat assistant (the one feature with a real ongoing cost)

New users get a **3-day free trial** of AI chat on signup — no credit card required.

---

## Business Model

| Tier | Account | Features | Duration |
|------|---------|----------|----------|
| Free | Not required | Week content, illustrations, tips, milestone tracker, photo journal | Forever |
| Trial | Required | Everything free + AI chat (20 msgs/day) | 3 days from signup |
| Paid | Required + subscription | Everything free + AI chat (20 msgs/day) + cross-device sync | Monthly / annual |

**Pricing (TBD):**
- Monthly: $2.99–$4.99 CAD
- Annual: $19.99–$29.99 CAD (~2 months free)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| App type | Progressive Web App (PWA) |
| Frontend | React 18 + Vite 5 |
| Backend / Auth | Supabase (auth, database, file storage) |
| Payments | Stripe (subscription billing + webhooks) |
| AI | Anthropic Claude API — `claude-sonnet` model |
| Hosting | Vercel |
| Dev OS | Windows (no Mac required) |
| Test device | iPhone via Safari PWA install |

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/ivantang/baby-now.git
cd baby-now

# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

**Testing on iPhone:** Make sure your phone and PC are on the same WiFi network, then visit `http://<your-pc-ip>:5173` in Safari on your iPhone. To install as a PWA: Safari → Share → Add to Home Screen.

### Build for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

---

## Environment Variables

Create a `.env.local` file in the project root (never commit this):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Server-side secrets (Supabase service role key, Stripe secret key, Anthropic API key) should be set in your Vercel project environment variables — never in the frontend.

---

## Project Structure

```
baby-now/
├── public/
│   ├── manifest.webmanifest   # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── components/            # React components
│   ├── data/
│   │   ├── schema.js          # JSDoc WeekEntry type definitions
│   │   ├── index.js           # getWeek(), getAllWeeks(), getCurrentWeek()
│   │   └── weeks/             # week-01.js through week-52.js
│   ├── hooks/                 # Custom React hooks
│   ├── styles/
│   │   └── main.css           # Design tokens (CSS custom properties)
│   ├── test/                  # Vitest unit & component tests
│   ├── App.jsx
│   └── main.jsx
├── e2e/                       # Playwright E2E tests
│   ├── home.spec.js
│   └── smoke.spec.js
├── playwright.config.js
├── vite.config.js
└── index.html
```

---

## Week Content

All 52 weeks of baby development content are structured in `src/data/weeks/`. Each week entry follows the `WeekEntry` schema:

- **Developmental highlight** — the most exciting thing happening this week
- **Physical development** — size, motor skills, reflexes
- **Cognitive & sensory** — vision, hearing, awareness
- **Sleep** — total hours, night patterns, nap windows
- **Feeding** — amount, frequency, hunger cues
- **Play & bonding** — activities to try
- **Parent tips** — self-care, what to watch for, when to call the doctor

**Content status:**
- Weeks 4–16 — full content written (`isStub: false`)
- Weeks 1–3 and 17–52 — schema-valid stubs (`isStub: true`), content coming in Phase 2

**Data helpers** (`src/data/index.js`):
```js
import { getWeek, getAllWeeks, getFullWeeks, getCurrentWeek } from './src/data/index.js'

getWeek(8)              // → WeekEntry for week 8
getAllWeeks()            // → all 52 entries sorted
getFullWeeks()          // → 13 fully-written entries (weeks 4–16)
getCurrentWeek(birthday) // → current week number (1–52) based on Date
```

---

## Testing

### Unit & Component Tests — Vitest

Fast tests that run in a simulated browser environment (jsdom).

```bash
npm test                  # run all unit tests once (also used by CI and git hooks)
npm run test:watch        # watch mode — re-runs on file changes (use during development)
npm run test:coverage     # run with coverage report
```

**What's tested:**
- `src/data/index.js` — all data helpers: `weekMap`, `getWeek`, `getAllWeeks`, `getFullWeeks`, `getCurrentWeek`
- Schema conformance for all 52 week entries (required fields, correct types, stub vs full content)
- `App` component smoke tests

**30 tests, ~2 seconds.**

### E2E Tests — Playwright

Full browser tests running in real Chromium and WebKit (iPhone Safari engine).

```bash
npm run test:e2e          # run all E2E tests (requires browsers installed)
npm run test:e2e:ui       # Playwright UI mode — visual debugger, great for writing tests
npm run test:e2e:debug    # step through tests with browser open
npm run test:e2e:report   # open last HTML test report
```

**What's tested:**
- Page title and heading
- Week counts (52 total, 13 full)
- Week 8 hero card content
- No JavaScript console errors
- No unhandled promise rejections
- Page load time < 5 seconds

**Browsers:** Chromium (Desktop Chrome) + WebKit (iPhone 15) — matches the primary target device.

**First-time setup** (downloads ~200MB of browser binaries):
```bash
npx playwright install chromium webkit
```

### Git Hooks — Husky

`npm test` (Vitest only) runs automatically before every `git push`. If tests fail, the push is blocked.

Playwright E2E tests are **not** in the git hook — they're CI-only to keep local pushes fast.

### CI — GitHub Actions

Two jobs run on every pull request to `main`:

| Job | Trigger | What runs |
|-----|---------|-----------|
| Test & Build | PR + push to main | `npm test` (Vitest) + `npm run build` |
| E2E Tests | PR only | Playwright (Chromium + WebKit), uploads HTML report artifact |

The E2E job only runs after the unit test job passes (`needs: test`). Browser binaries are cached by `package-lock.json` hash to keep CI fast.

---

## Phased Delivery

### Phase 1 — MVP (current)
All 52 weeks of static content, week auto-detection, milestone tracker, photo journal, user accounts (Supabase), 3-day trial, AI chat, Stripe subscription, PWA install, Vercel deploy.

### Phase 2 — Enhanced
Full illustration set, offline mode, weekly push notifications, Google/Apple social login, improved AI context, annual subscription.

### Phase 3 — Social & Polish
Shareable milestone cards, multiple baby profiles, polished splash/loading/icon, referral/gift subscriptions.

---

## Design Principles

- **Mobile-first** — designed for iPhone Safari as the primary screen
- **One-thumb usable** — parent is often holding a baby with the other arm
- **No forced signup** — free users can browse all content without an account
- **Paywall is soft and respectful** — only AI chat is locked, everything else is free
- **Never alarming** — warm, reassuring language throughout; not a medical app
- **Aesthetic** — "ugly cute": chubby, squishy characters with oversized cheeks and dreamy expressions, inspired by PopMart's Twinkle Twinkle Be a Little Star series

---

## Visual Direction

### Illustration Style — "Ugly Cute"
Inspired by **PopMart's Twinkle Twinkle Be a Little Star** series. The style is deliberately not polished or realistic — it's endearing *because* of its imperfect, exaggerated proportions.

**Character anatomy:**
- Enormous, doughy cheeks that take up most of the face — the defining feature
- Oversized round head with a large forehead (head-to-body ratio of roughly 2:1)
- Tiny half-moon or closed crescent eyes — sleepy, dreamy, never wide-open
- Stub nose — barely there, just a suggestion
- Small pursed or slightly downturned mouth — peaceful, not grinning
- Stubby, chubby arms and legs — almost vestigial
- The whole figure looks like it's made of soft mochi or memory foam

**Expression:**
Neutral to quietly content — not performing happiness. A slightly blank, serene stare. The "cute" comes from the proportions, not the smile.

**Colour palette (updated):**
| Token | Hex | Use |
|-------|-----|-----|
| Warm cream | `#fdf8f0` | Background |
| Soft gold | `#f5c842` | Primary accent, star motifs |
| Blush peach | `#f2a07b` | Cheek blush, warm highlights |
| Powder blue | `#b8d8f0` | Secondary accent |
| Lavender mist | `#d4c5f0` | Tertiary, badges |
| Deep plum | `#3a2a4a` | Body text (replaces dark brown) |
| Muted sage | `#8faf8f` | Supporting colour |

**Motifs:** Stars ⭐, moons 🌙, soft clouds — celestial and dreamy without being literal space theme.

**Illustration format:** SVG, one per week. Each week's character subtly reflects the developmental stage (e.g. week 6 character has a tiny smile because first social smiles; week 16 has arms reaching outward).

### Typography (updated)
- **Display:** [Fredoka](https://fonts.google.com/specimen/Fredoka) — rounded, chunky, friendly; matches the chubby character aesthetic
- **Body:** [Nunito](https://fonts.google.com/specimen/Nunito) — soft rounded sans, warm and readable

### UI Feel
- Rounded corners everywhere — no sharp edges
- Soft drop shadows (no harsh borders)
- Gentle bounce animations on badge unlocks
- Cards feel like physical objects — slightly tactile and dimensional

---

## Out of Scope (MVP)

- Native iOS App (PWA only)
- App Store submission
- Pregnancy / prenatal content
- Multiple languages
- Doctor appointment booking or medical records
- Community or social features

---

## Open Questions

| Question | Options | Status |
|----------|---------|--------|
| App name | Little One / Tiny Steps / Baby Bloom / custom | **TBD** |
| Subscription price | $2.99–$4.99/mo or $19.99–$29.99/yr CAD | **TBD** |
| 52 weeks content source | Written by Claude / owner reviews / expert reviewed | **TBD** |
| Illustration approach | "Ugly cute" SVG style — chubby cheeks, inspired by PopMart Twinkle Twinkle | **Decided** |
| Photo storage | Supabase Storage vs Cloudinary | **TBD** |
| Social login (Phase 2) | Google only / Apple only / both | **TBD** |
