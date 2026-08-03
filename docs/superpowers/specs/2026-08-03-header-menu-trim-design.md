# Header menu trim - design

Date: 2026-08-03
Status: approved by owner

## Problem

The header menu in `src/components/AppNavbar.vue` has grown too dense: 8 items (Trang chu, Hoi dap, Giai dau, Huong dan, Tin tuc, Blog, Facebook text link, Discord CTA button). The owner wants a leaner menu and wants Facebook - not Discord - as the single header CTA.

## Decision

Single-file change to `src/components/AppNavbar.vue`. Final menu, 6 items:

- Hoi dap (`/faq/`)
- Giai dau (`/tournaments/`)
- Huong dan (`/guides/`)
- Tin tuc (`/news/`)
- Blog ↗ (external, `site.links.blog`)
- **Facebook CTA button** - takes over the old Discord button style (`rounded-md bg-gold px-4 py-2 font-bold text-ink hover:bg-gold-dim`), links to `site.links.facebook`, `target="_blank"` + `rel="noopener noreferrer"`, keeps outbound tracking `onJoin('facebook')`.

Removed from header:

- "Trang chu" link - the logo/brand already links to `/`.
- Discord CTA button - Discord remains available elsewhere on the site (CommunityCta, footer sections); it is only removed from the header.
- "Facebook ↗" text link - merged into the CTA button so Facebook appears exactly once.

## Out of scope

- No changes to `src/data/site.ts` (the `discord` link stays for other consumers).
- No changes to AppFooter, CommunityCta, or any section components.
- No route, SEO, or sitemap changes - the header only loses links, gains none.

## Testing

- Existing `src/components/__tests__/AppNavbar.spec.ts` (brand/logo test) is unaffected.
- Add one test to that spec asserting: the header renders a Facebook link with the CTA classes and outbound attributes, and no Discord link exists in the navbar.
- Pre-PR gate: `npm run lint:check && npm run type-check && npm run test:run`.
