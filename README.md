# GulfNexus Mobile UI

Mobile-first React + Tailwind experience for the GulfNexus marketplace and onboarding flow.

## Quick start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` – start the Vite dev server
- `npm run lint` – run ESLint
- `npm run build` – type-check and build the production bundle

## Structure

- `src/app/marketplace` – sticky filters, project cards, and submit CTA
- `src/app/onboarding` – five-step onboarding with bottom sheet security
- `src/components/ui` – reusable UI kit (buttons, cards, inputs, combobox, bottom sheet, sticky footer, progress bar)
- `src/lib` – mock data, types, and utility helpers

## CI

`.github/workflows/ui-build.yml` installs Node, runs lint, and builds on pushes and pull requests.
