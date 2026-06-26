# CLAUDE.md

Conventions for this repo (AoE4 VN: a Vue 3 + Vite/vite-ssg + Tailwind static site deployed to GitHub Pages). See [CONTRIBUTING.md](./CONTRIBUTING.md) for adding tournaments and DLC dates.

## Code

- English for all identifiers: route paths and names, component files, variables (e.g. `/faq`, `FAQView.vue`, `faqItems`). Use Vietnamese only in user-facing display text.
- Import with the `@/` alias (maps to `src/`), never relative `../` paths. Applies to source and tests.
- Use a hyphen `-` in content, never an em-dash `—`.
- No HTML comments inside Vue `<template>` markup.

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
