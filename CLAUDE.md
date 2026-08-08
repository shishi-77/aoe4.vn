# CLAUDE.md

Conventions for this repo (AoE4 VN: a Vue 3 + Vite/vite-ssg + Tailwind static site deployed to GitHub Pages). See [CONTRIBUTING.md](./CONTRIBUTING.md) for adding tournaments and DLC dates.

## Code

- English for all identifiers: route paths and names, component files, variables (e.g. `/faq`, `FAQView.vue`, `faqItems`). Use Vietnamese only in user-facing display text.
- Import with the `@/` alias (maps to `src/`), never relative `../` paths. Applies to source and tests.
- Use a hyphen `-` in content, never an em-dash `—`.
- No HTML comments inside Vue `<template>` markup.

## Naming the games (reader-facing text)

The site covers the whole series, so one game must never carry two names in the same text.

- **Prose** - paragraphs, headings, FAQ questions and answers, anchor text, and any string a
  reader sees on the page - names every game in Vietnamese: `Đế chế 1`, `Đế chế 2`,
  `Đế chế 3`, `Đế chế 4`. Never `AoE4`, never `Age of Empires IV` as the routine label.
- **Bare `Đế chế` means the SERIES, never one game.** It must either carry a number or follow
  a series marker: `dòng Đế chế`, `cộng đồng Đế chế`, `làng Đế chế`. Writing `người chơi Đế chế`
  for AoE1 players is the exact ambiguity this rule exists to kill - write `người chơi Đế chế 1`.
- **Technical zone** keeps abbreviations and official English names, because they carry search
  traffic: `title`, `description`, slug, `useHead` meta, JSON-LD, `sources[].label`, and the
  `AoE4 VN` brand name. Never rename a published slug.
- **Two bounded exceptions in prose**, both machine-checked:
  1. A gloss parenthetical opened right after the Vietnamese name, so the reader learns the
     alias once: `Đế chế 4 (tên chính thức Age of Empires IV, viết tắt AoE4)`.
  2. A quoted literal the reader must type or look for: `Tìm "Age of Empires IV" trong cửa hàng`.

Enforced by `gameNamingFailures` in `@/lib/gameNaming`, gated three ways: `npm run test:run`
(`src/data/__tests__/game-naming.spec.ts`), the `seo-audit` sweep, and the guide-evaluator
hygiene gate via `scripts/score-guide-seo.ts`.

## Git

- Write branch names, commit messages, and PR titles/descriptions in English.
- Branch before starting work; never commit to `main`. Changes ship via branch → PR → merge.

## Before opening a PR

```sh
npm run lint:check && npm run type-check && npm run test:run
```

`test:run` includes the accessibility gate - see below. Never open a PR without it green.

## Accessibility

Every PR is gated on accessibility; there is no "I'll fix a11y later" path.

- `src/__tests__/accessibility.spec.ts` runs axe-core over **every page shape** (each static
  route, one URL per guide/news post/tournament, and the 404) and fails on any violation. New
  content is picked up automatically from the data files - no test edit needed. A new *route*
  does need a line in that spec's `PAGES` array.
- axe in jsdom cannot see anything that needs layout or real CSS. Three rules are switched off
  there - `color-contrast`, `color-contrast-enhanced`, `target-size` - and are covered by the
  manual sweep in [ACCESSIBILITY.md](./ACCESSIBILITY.md) instead.
- axe also cannot judge whether an accessible name is *correct*, only that one exists: a button
  labelled `☰` passes. Behaviour like that - a disclosure's label flipping between open and
  closed, Escape closing a menu, focus landing where it should - needs an explicit unit test.
  See `AppNavbar.spec.ts` and `AppLayout.spec.ts`.
- When a change touches colour, spacing, or an interactive widget, run the manual browser sweep
  in [ACCESSIBILITY.md](./ACCESSIBILITY.md) as well - the jsdom gate will not catch it.
- The page language is set by `useHead` in `App.vue`, not by `index.html` - unhead rewrites the
  `<html>` tag during pre-render and defaults to `en`. `assertPagesDeclareVietnamese` in
  `vite.config.ts` fails the build if any emitted page disagrees, so run `npm run build` on any
  PR that touches head handling, `ssgOptions`, or `App.vue`.

## Routes & SEO

- Static routes are pre-rendered automatically, but add their URL to the `entries` array in `buildSitemapXml` (`src/lib/sitemap.ts`) so they appear in `sitemap.xml`. Dynamic routes (e.g. `/tournaments/:slug`) must also be listed in `includedRoutes` in `vite.config.ts`.
- Set page metadata (title, description, canonical, OG, JSON-LD) via `useHead`; use a trailing slash in canonical URLs.
