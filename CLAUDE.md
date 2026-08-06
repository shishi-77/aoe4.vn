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

## Routes & SEO

- Static routes are pre-rendered automatically, but add their URL to the `urls` array in `vite.config.ts` so they appear in `sitemap.xml`. Dynamic routes (e.g. `/tournaments/:slug`) must also be listed in `includedRoutes`.
- Set page metadata (title, description, canonical, OG, JSON-LD) via `useHead`; use a trailing slash in canonical URLs.
