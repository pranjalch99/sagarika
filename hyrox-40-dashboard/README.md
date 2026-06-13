# Race Engine 40

A mobile-first Next.js + TypeScript dashboard for a 40-day race prep block. It tracks the seeded training plan, daily check-ins, body metrics, nutrition, running, simulations, taper, and race-day checklist with localStorage persistence.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Edit The Plan

The full seeded 40-day plan lives in:

```text
src/data/trainingPlan.ts
```

Local-storage state, date math, warnings, and compliance helpers live in:

```text
src/lib/athleteStore.ts
```

No backend is required.
