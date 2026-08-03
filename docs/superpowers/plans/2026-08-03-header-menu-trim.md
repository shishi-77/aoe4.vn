# Header Menu Trim Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trim the header menu in `AppNavbar.vue` from 8 items to 6 - remove the "Trang chủ" link and the Discord CTA button, and merge the Facebook text link into a single Facebook CTA button.

**Architecture:** Single-component template change. The gold CTA button style previously used by Discord moves to Facebook; the Facebook outbound-click tracking (`onJoin('facebook')`) is kept. One new unit test locks the behavior in.

**Tech Stack:** Vue 3 SFC, Vitest + @vue/test-utils, Tailwind utility classes.

**Spec:** `docs/superpowers/specs/2026-08-03-header-menu-trim-design.md`

## Global Constraints

- Branch: work on `claude/trim-header-menu` (already created); never commit to `main`.
- English for identifiers and commit messages; Vietnamese only in user-facing display text.
- Import with the `@/` alias, never relative `../` paths (source and tests).
- Use a hyphen `-` in content, never an em-dash.
- No HTML comments inside Vue `<template>` markup.
- Do NOT modify `src/data/site.ts` - the `discord` link stays for other consumers (CommunityCta, footer sections).
- Pre-PR gate: `npm run lint:check && npm run type-check && npm run test:run` must pass.
- `docs/` is gitignored - plan/spec files need `git add -f`; source files add normally.

---

### Task 1: Trim AppNavbar to 6 items with Facebook as the single CTA

**Files:**
- Modify: `src/components/AppNavbar.vue` (template block, lines 36-74)
- Test: `src/components/__tests__/AppNavbar.spec.ts`

**Interfaces:**
- Consumes: `site.links.facebook` and `site.links.blog` from `@/data/site`; `trackOutboundClick` via the existing `onJoin` handler in the same component.
- Produces: nothing consumed by later tasks (this is the only task).

- [ ] **Step 1: Write the failing test**

Append this test inside the existing `describe('AppNavbar', ...)` block in `src/components/__tests__/AppNavbar.spec.ts`, and add the `site` import at the top of the file:

```ts
import { site } from '@/data/site'
```

```ts
  it('dùng Facebook làm CTA duy nhất, bỏ Discord và link Trang chủ', () => {
    const wrapper = mount(AppNavbar, mountOptions)

    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).not.toContain(site.links.discord)
    expect(wrapper.text()).not.toContain('Trang chủ')

    const facebookLinks = wrapper.findAll(`a[href="${site.links.facebook}"]`)
    expect(facebookLinks).toHaveLength(1)
    const facebook = facebookLinks[0]
    expect(facebook.classes()).toContain('bg-gold')
    expect(facebook.attributes('target')).toBe('_blank')
    expect(facebook.attributes('rel')).toBe('noopener noreferrer')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/AppNavbar.spec.ts`
Expected: FAIL - the new test fails because the Discord href is still present, "Trang chủ" is still rendered, and there are Facebook link(s) without the `bg-gold` class. The existing brand/logo test must still PASS.

- [ ] **Step 3: Implement the navbar change**

In `src/components/AppNavbar.vue`, replace the current menu contents (everything between the opening `<div ... :class="open ? 'flex' : 'hidden'">` tag and its closing `</div>`, currently the `Trang chủ` RouterLink through the Discord anchor) with:

```html
        <RouterLink to="/faq/" class="font-bold text-cream hover:text-gold">
          Hỏi đáp
        </RouterLink>
        <RouterLink to="/tournaments/" class="font-bold text-cream hover:text-gold">
          Giải đấu
        </RouterLink>
        <RouterLink to="/guides/" class="font-bold text-cream hover:text-gold">
          Hướng dẫn
        </RouterLink>
        <RouterLink to="/news/" class="font-bold text-cream hover:text-gold">
          Tin tức
        </RouterLink>
        <a
          :href="site.links.blog"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-cream hover:text-gold"
        >
          Blog ↗
        </a>
        <a
          :href="site.links.facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md bg-gold px-4 py-2 font-bold text-ink hover:bg-gold-dim"
          @click="onJoin('facebook')"
        >
          Facebook
        </a>
```

Leave the `<script setup>` block, the brand RouterLink, and the mobile toggle button unchanged. `onJoin` remains used (now only with `'facebook'`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/AppNavbar.spec.ts`
Expected: PASS - both tests green.

- [ ] **Step 5: Run the full pre-PR gate**

Run: `npm run lint:check && npm run type-check && npm run test:run`
Expected: all three pass with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/AppNavbar.vue src/components/__tests__/AppNavbar.spec.ts
git commit -m "feat(navbar): trim header menu, make Facebook the single CTA

Remove the Trang chu link (logo already links home) and the Discord
CTA button; merge the Facebook text link into one gold CTA button
that keeps outbound-click tracking.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
