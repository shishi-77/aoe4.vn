# Homepage Viking DLC Promo Revamp v2 — Design

**Date:** 2026-06-26
**Status:** Approved (design), pending implementation plan
**Supersedes parts of:** `2026-06-23`/`2026-06-26-homepage-viking-revamp-design.md` (v1 hero)

## Context

The homepage was revamped in PRs #14/#15 to promote the upcoming DLC *Raiders of the
North* (Vikings + Scots). A visual review of the rendered page (desktop + mobile
headless screenshots) surfaced concrete problems:

- **Hero is mostly empty.** The section is `min-h-[88vh]` with vertically-centered
  content occupying ~1/3 of it, leaving large dead zones above and below.
- **Longship is marooned.** It sits at the very bottom, ~600px of black gap below the
  CTA, disconnected from the content it supports.
- **The key art is hidden.** The only Viking image (`raiders-of-the-north-hero.jpg`) is
  a 460×215 Steam capsule with a baked-in Steam download badge and logo, blurred
  (`blur-2xl`, `opacity-40`) under a near-black gradient — unrecognizable on screen.
- **No Nordic colour cues.** Palette is warm ink/surface/gold/cream + a muddy `wine`;
  it lacks the cold steel/ice that defines the Viking theme. Contrast is low
  (dark-on-dark) across the hero.
- **Animation payoff is low.** Ken Burns, snow, and waves animate layers that are
  nearly invisible; only the tiny bottom longship reads.
- **Mobile bug.** The H1 "RAIDERS OF THE NORTH" and the countdown row overflow the
  viewport and are clipped at the right edge on narrow screens.

## Decisions (from brainstorming)

1. **Page role:** Homepage is primarily a **DLC promo / hype** page. Hero should sell the
   DLC and push the Steam CTA. Tournaments/community are secondary.
2. **Key art:** Do **not** rely on the low-res Steam capsule as the hero subject. Keep it
   only as a faint ambient blur. Build Viking identity with **hand-drawn vector
   illustration** (runes, knotwork, shields, a larger longship). No new raster assets.
3. **Palette:** Keep `ink` + `gold` as base/primary; **add cold Nordic accents** (steel
   blue + ice); drop the muddy `wine`; shift `surface` cooler.
4. **Hero layout:** A **cinematic layered diorama** that fills the vertical space — sky
   band (top) → content band (middle) → sea band (bottom) — eliminating dead space.
5. **Animation:** Ambient loops on the now-visible layers, **plus scroll parallax and
   entrance animations**, plus hover micro-interactions. All gated behind
   `prefers-reduced-motion`.

## Design

### 1. Colour tokens — `src/assets/main.css` `@theme`

| Token | Before | After | Note |
|-------|--------|-------|------|
| `--color-ink` | `#0c0b09` | `#0c0b09` | keep (base) |
| `--color-surface` | `#1a1814` | `#14161b` | cooler, blue-leaning dark |
| `--color-gold` | `#e7b955` | `#e7b955` | keep (primary) |
| `--color-gold-dim` | `#c79a4b` | `#c79a4b` | keep |
| `--color-cream` | `#f5ecd8` | `#f5ecd8` | keep (text) |
| `--color-muted` | `#9c948a` | `#9c948a` | keep |
| `--color-wine` | `#7a1f1f` | **removed** | muddy; no longer used |
| `--color-steel` | — | `#5b8aa6` | **new** — cold Nordic blue accent |
| `--color-ice` | — | `#9fc3d6` | **new** — frost glint / light accent |

- Sea waves recolour from `wine` → `steel`/`surface` (cold sea).
- Any current `wine` usage must be migrated before removing the token (verify with a
  repo grep during implementation).

### 2. Hero — layered diorama (`DlcSection.vue` + `HeroBackdrop.vue`)

Restructure the hero so content is distributed across three full-bleed bands instead of
floating in a centered void. Target: **zero dead space**, content grounded on the sea.

- **Sky band (top):** keep the blurred ambient key art (low opacity); add an aurora
  gradient sweep (`steel → ice → transparent`) and a scatter of faint, glowing vector
  **runes**. Fills the top dead zone.
- **Content band (middle):** same content as today — eyebrow, H1, subtitle, civ chips,
  countdown, highlights, Steam CTA — with **tightened vertical rhythm**. Add a
  `NorseDivider` knotwork ornament under the H1. **Civ chips get faction tint:** Vikings
  warm (gold), Scots cool (steel), echoing the DLC duality without splitting the layout.
- **Sea band (bottom):** **enlarge the longship**, seat it in steel/ice-coloured waves,
  and **pull it up directly under the CTA** so there is no large gap. Two wave layers
  (back `steel`, front `surface`) drifting in opposite directions (as today).
- Reduce/restructure `min-height` and spacing so the three bands fill the viewport
  without an empty middle.

### 3. Viking vector visual language (new, all vector/SVG/CSS)

- **Runes:** small vector rune glyphs scattered in the sky band, faint glow.
- **`NorseDivider.vue` (new):** a thin Norse interlace/knotwork ornament, reusable —
  under the H1 and between homepage sections.
- **Longship:** enhance the existing inline SVG — clearer shields on the hull, a sail
  bearing a rune/emblem, larger scale.
- *(Optional, low priority)* round Viking shield silhouettes along the shore as
  foreground. Drop if it adds clutter.

### 4. Animation — `main.css` + `useParallax.ts` (new)

- **Ambient loops (upgraded):** aurora drift, staggered rune glow/flicker, longship bob,
  dual wave drift, snow/embers. (Extends existing keyframes.)
- **Scroll parallax:** sky layer translates slower, sea layer faster, driven by a
  lightweight `useParallax` composable that writes CSS custom properties from scroll
  position. Disabled under reduced-motion.
- **Entrance:** hero elements (eyebrow → H1 → chips → countdown → CTA) fade/slide-up,
  staggered, on load; longship eases in. Reuses the existing reveal philosophy.
- **Hover micro-interactions:** civ chips lift + glow; CTA gains an ember glow / shine
  sweep.
- **Reduced-motion:** extend the existing `@media (prefers-reduced-motion: reduce)` guard
  to cover every new animation and the parallax (no transforms applied).

### 5. Responsive / bug fixes (`DlcSection.vue`)

- **Fix mobile overflow:** H1 uses a clamped/responsive scale (e.g. `text-3xl` base →
  `sm:text-6xl`) with `break-words`; the countdown row **wraps to 2×2** on narrow
  screens instead of overflowing. Verify no clipping at 320–414px widths.

### 6. Lower sections — light cohesion pass (`HomeView.vue`)

- Apply the cooler `surface` and a subtle `steel` accent; insert a `NorseDivider` between
  the Tournaments and Community sections. Keep changes minimal — focus stays on the hero.

## File structure

| File | Change |
|------|--------|
| `src/assets/main.css` | token updates (drop `wine`, add `steel`/`ice`, cooler `surface`); new keyframes (aurora, rune-glow, ember, entrance); parallax CSS vars; extend reduced-motion guard |
| `src/components/sections/HeroBackdrop.vue` | sky band (runes + aurora) + sea band (enlarged longship); recoloured waves |
| `src/components/sections/DlcSection.vue` | three-band diorama layout; faction-tinted civ chips; entrance stagger; responsive H1/countdown fix |
| `src/components/NorseDivider.vue` | **new** — reusable knotwork ornament |
| `src/composables/useParallax.ts` | **new** — scroll-driven parallax, reduced-motion aware |
| `src/views/HomeView.vue` | light cohesion pass; `NorseDivider` between sections |

## Out of scope

- Sourcing a high-resolution official key art (explicitly deferred — vector-illustration
  route chosen instead).
- Restructuring Tournaments/Community beyond a light palette/divider pass.
- Changes to tournament detail pages or navbar/footer.

## Testing / verification

- Headless screenshots (desktop 1440px + mobile 390px) before/after to confirm: no dead
  space in hero, longship grounded under CTA, no mobile text clipping.
- Manual check at 320 / 375 / 414 / 768 / 1440px widths.
- Toggle `prefers-reduced-motion` and confirm all animation + parallax stop and layout
  stays correct (longship stays centered, content visible).
- Existing component tests (`*.spec`) still pass; add/adjust where civ-chip or countdown
  markup changes.
