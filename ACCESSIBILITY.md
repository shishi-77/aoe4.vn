# Accessibility

Two layers guard this site: an automated gate that runs on every PR, and a manual browser sweep
for the things the gate structurally cannot see.

## Layer 1 - the automated gate (runs on every PR)

```sh
npm run test:run
```

`src/__tests__/accessibility.spec.ts` mounts the real `App` - navbar, `RouterView`, footer - for
every page shape and runs axe-core against it:

- each static route (`/`, `/faq`, `/guides`, `/news`, `/tournaments`)
- one URL per guide, per news post, and per tournament, read straight from the data files
- the 404 page

New content needs no test change; a new **route** needs one line in that spec's `PAGES` array.

It also asserts `index.html` still declares `<html lang="vi">` and mirrors that into the jsdom
document, so `html-has-lang` is a real check rather than a formality.

### The page language is enforced at build time, not here

`index.html` is not what ships. unhead rebuilds the `<html>` tag during pre-render and falls back
to `lang="en"` unless the app declares a language, so a template that reads `lang="vi"` can still
deploy 19 pages that announce themselves as English - a WCAG 3.1.1 failure invisible to any jsdom
test. `useHead({ htmlAttrs: { lang: 'vi' } })` in `App.vue` is what actually sets it, and
`assertPagesDeclareVietnamese` in `vite.config.ts` fails the build if any emitted page disagrees.
Run `npm run build` before opening a PR that touches head handling, SSG options, or `App.vue`.

### What the gate does *not* cover

jsdom loads no stylesheet and computes no layout, so three axe rules are disabled there:

| Disabled rule | Why | Covered by |
|---|---|---|
| `color-contrast` | No CSS cascade in jsdom, so every ratio would be wrong | Manual sweep, step 3 |
| `color-contrast-enhanced` | Same | Manual sweep, step 3 |
| `target-size` | Needs real box dimensions | Manual sweep, step 4 |

There is a second, subtler gap. **axe checks that an accessible name exists, never that it is
correct.** A hamburger button labelled `☰` and one whose `aria-label` says "Mở menu" while the
menu is already open both pass axe cleanly. Anything in that category - a disclosure label that
must flip with state, Escape closing a menu, focus landing on the right element - needs an
explicit unit test. `AppNavbar.spec.ts` and `AppLayout.spec.ts` are the worked examples.

## Layer 2 - the manual browser sweep

Run this when a change touches colour, spacing, or an interactive widget. The jsdom gate will not
catch regressions in any of those.

```sh
npm run dev
```

1. **axe in a real browser.** Load the page, inject axe-core, and run it excluding the devtools
   overlay - that overlay throws one false `aria-prohibited-attr` that does not exist in
   production:

   ```js
   await axe.run({ exclude: [['#__vue-devtools-container__']] })
   ```

   Check `violations` **and** `incomplete`. Contrast over a gradient or a background image lands
   in `incomplete`, which means "axe could not decide" - not "fine".

2. **Lighthouse accessibility**, mobile emulation. Same devtools caveat: the overlay is the one
   expected failure on a dev server.

3. **Contrast.** Any new colour pair in `@theme` needs ≥ 4.5:1 for body text, ≥ 3:1 for large text
   and UI borders. Check both the resting and the hover tone - the social CTA colours in
   `src/assets/main.css` were already darkened from their official brand hex for exactly this.

4. **Tap targets** at 390px wide. **Every standalone control on this site is 44×44 CSS px** - the
   comfortable target, not WCAG 2.2's 24×24 floor. Hold new work to 44. Reach for
   `inline-flex min-h-11 items-center` rather than padding, so the hit area grows without moving
   anything around it.

   The one carve-out is SC 2.5.8's **inline exception**: a link sitting inside a sentence is
   constrained by the line-height of the text around it and is exempt. Those stay as they are -
   forcing them to 44 would wreck the paragraph. The sweep below tells the two apart rather than
   flagging every inline link.

   Growing a target must not grow the sticky header. The navbar carries `py-2 lg:py-3` precisely
   so the 44px toggle fits inside the bar's original 61px height; check that number after
   touching the header, because a taller sticky bar costs viewport on every page.

   ```js
   // Paste into the console after loading a page at 390px wide.
   const inlineExempt = (e) => {
     const p = e.parentElement
     if (!p || !['P', 'LI', 'SPAN'].includes(p.tagName)) return false
     return [...p.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
   }
   ;[...document.querySelectorAll('#app a, #app button')]
     .filter((e) => e.getClientRects().length && !e.classList.contains('sr-only'))
     .map((e) => ({ e, r: e.getBoundingClientRect() }))
     .filter(({ e, r }) => (r.width < 44 || r.height < 44) && !inlineExempt(e))
     .forEach(({ e, r }) =>
       console.warn(`${Math.round(r.width)}x${Math.round(r.height)}`, e.innerText.trim(), e),
     )
   ```

   Open the mobile menu and re-run it - the panel links are only measurable while it is open.

   Watch for `link-in-text-block` here too. A gold link inside a muted paragraph is invisible to
   a reader who cannot see colour, and axe only catches it in a real browser because the rule
   compares computed colours. Inline prose links carry `underline underline-offset-2`; only
   links that stand alone in their own block may rely on colour plus a hover underline.

5. **Keyboard.** Tab from the very top: the skip link must appear first and be visible on focus.
   Every focusable element must show a ring - the site-wide gold ring lives in `main.css` under
   `:where(...):focus-visible`, at zero specificity so component-level utilities still win. Open
   the mobile menu with the keyboard, Tab into it, press Escape, and confirm focus returns to the
   toggle.

6. **Reduced motion.** Emulate `prefers-reduced-motion: reduce` and confirm the hero is still.
   Every keyframe animation added to `main.css` must be listed in the `@media
   (prefers-reduced-motion: reduce)` block at the bottom of that file.

## Baseline

Audited 2026-08-07 against the full site. axe-core reported zero violations across all page
shapes on desktop and mobile; Lighthouse accessibility scored 96 on mobile, its only failure
being the dev-only devtools overlay. All eleven `@theme` colour pairs clear 4.5:1, the lowest
being `white` on `--color-discord-hover` at 4.61:1. `prefers-reduced-motion` covers all eight
keyframe animations plus both parallax layers.

Fixed in the same pass: the missing skip link (WCAG 2.4.1, level A), the mobile menu's static
`aria-label`, its missing `aria-controls` and Escape handling, tournament card headings sitting
at the same level as the section title that introduces them on the home page, and the browser
default focus ring - a near-black outline that all but vanished on this dark palette.

Tap targets were then raised across the board. Every standalone control on mobile now measures at
least 44×44: the navbar toggle (was 34×28), the brand link, all six menu links, the footer source
link, the related-guide and news-source lists, and the not-found fallback links. Links inline in
a sentence are left alone under SC 2.5.8's inline exception. The sticky header stayed at its
original 61px - `py-2 lg:py-3` on the nav absorbs the taller toggle.

Two defects surfaced only after the jsdom gate was already green, which is the argument for
keeping layer 2:

- Gold links inside muted paragraphs failed `link-in-text-block` (WCAG 1.4.1) at 1.63:1 against
  the surrounding text, with no underline until hover. The rule is unevaluable without real CSS.
  Those links are now permanently underlined.
- Every pre-rendered page shipped `lang="en"` despite `index.html` declaring `lang="vi"` (WCAG
  3.1.1, level A) - screen readers were reading Vietnamese with an English voice across the whole
  site. Only the built output shows this. See the build-time enforcement above.
