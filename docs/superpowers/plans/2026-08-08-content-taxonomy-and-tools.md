# Content Taxonomy and Tools Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/tools` link directory as the site's fifth top-level section and group `/guides` by its existing `kind` field, without moving a single published URL.

**Architecture:** `/tools` is a new static route backed by a new flat data module (`src/data/tools/`) whose shape is deliberately unlike `Guide` - no sections, no slug, no detail page. `/guides` keeps every published URL untouched; only its listing page and the `kind` field's optionality change. Analytics gets a `tool_click` event of its own so third-party outbound clicks never contaminate the community-conversion metric.

**Tech Stack:** Vue 3 + TypeScript, vite-ssg, Tailwind, vue-router, Vitest + @vue/test-utils, axe-core, unhead.

**Spec:** `docs/superpowers/specs/2026-08-08-content-taxonomy-and-tools-design.md`

## Global Constraints

- English for all identifiers - route paths and names, component files, variables. Vietnamese only in reader-facing display text.
- Import with the `@/` alias, never relative `../` paths. Applies to source and tests.
- Use a hyphen `-` in content, never an em-dash `—`.
- No HTML comments inside Vue `<template>` markup.
- Code and config comments in English.
- Reader-facing prose names games in Vietnamese: `Đế chế 1`, `Đế chế 2`, `Đế chế 3`, `Đế chế 4`. Bare `Đế chế` means the series and must carry a number or follow a series marker (`dòng Đế chế`, `cộng đồng Đế chế`, `làng Đế chế`). Abbreviations belong only in the technical zone: `title`, `description`, slug, `useHead` meta, JSON-LD, and proper names of third-party tools.
- Never rename a published slug.
- Canonical URLs carry a trailing slash.
- Never commit to `main`. Work happens on branch `claude/content-taxonomy-tools`, which already exists and already holds the spec commits.
- Pre-PR gate, must be green: `npm run lint:check && npm run type-check && npm run test:run`.

---

### Task 1: Tools data module

**Files:**
- Create: `src/data/tools/index.ts`
- Test: `src/data/tools/__tests__/index.spec.ts`

**Interfaces:**
- Consumes: `gameNamingFailures(texts: string[]): string[]` from `@/lib/gameNaming`.
- Produces: `type ToolCategory`, `interface Tool`, `const TOOL_CATEGORIES: ToolCategory[]`, `const tools: Tool[]`, `function toolsByCategory(category: ToolCategory): Tool[]`. Task 3 renders all of these.

- [ ] **Step 1: Write the failing test**

Create `src/data/tools/__tests__/index.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { tools, TOOL_CATEGORIES, toolsByCategory } from '@/data/tools'
import { gameNamingFailures } from '@/lib/gameNaming'

describe('tools collection', () => {
  it('có ít nhất một công cụ', () => {
    expect(tools.length).toBeGreaterThan(0)
  })

  it('mọi URL là https tuyệt đối và không trùng nhau', () => {
    for (const t of tools) {
      expect(t.url.startsWith('https://')).toBe(true)
    }
    const urls = tools.map((t) => t.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('mọi công cụ có tên, mô tả đủ dài và ít nhất một game', () => {
    for (const t of tools) {
      expect(t.name.trim()).toBeTruthy()
      expect(t.description.trim().length).toBeGreaterThan(40)
      expect(t.games.length).toBeGreaterThan(0)
      for (const g of t.games) {
        expect(g.trim()).toBeTruthy()
      }
    }
  })

  it('category của mọi công cụ nằm trong TOOL_CATEGORIES', () => {
    for (const t of tools) {
      expect(TOOL_CATEGORIES).toContain(t.category)
    }
  })

  it('TOOL_CATEGORIES không trùng lặp', () => {
    expect(new Set(TOOL_CATEGORIES).size).toBe(TOOL_CATEGORIES.length)
  })

  it('không dùng em-dash', () => {
    for (const t of tools) {
      expect(`${t.name} ${t.description} ${t.games.join(' ')}`).not.toContain('—')
    }
  })

  /*
   * Only `description` is reader-facing prose. `name` is the tool's proper name and
   * carries abbreviations on purpose (AoE4 World), so it must never reach this gate.
   */
  it('mô tả tuân thủ quy ước đặt tên game', () => {
    expect(gameNamingFailures(tools.map((t) => t.description))).toEqual([])
  })

  it('toolsByCategory lọc đúng và trả mảng rỗng khi không có gì', () => {
    for (const category of TOOL_CATEGORIES) {
      for (const t of toolsByCategory(category)) {
        expect(t.category).toBe(category)
      }
    }
    const total = TOOL_CATEGORIES.reduce((n, c) => n + toolsByCategory(c).length, 0)
    expect(total).toBe(tools.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/tools/__tests__/index.spec.ts`
Expected: FAIL - cannot resolve `@/data/tools`.

- [ ] **Step 3: Write the implementation**

Create `src/data/tools/index.ts`:

```ts
/** Display group a tool belongs to on /tools. */
export type ToolCategory = 'Tra cứu' | 'Tính toán' | 'Nháp chiến thuật' | 'Luyện tập'

export interface Tool {
  /**
   * Proper name of the tool. Carries abbreviations on purpose (AoE4 World), so it
   * sits in the technical zone and must never be run through gameNamingFailures.
   */
  name: string
  /** Absolute https URL of the tool's home page. */
  url: string
  category: ToolCategory
  /** Games the tool serves, named per the house convention: 'Đế chế 4'. */
  games: string[]
  /** Reader-facing Vietnamese prose: what it does, when to reach for it. */
  description: string
}

/**
 * Fixed render order of the groups on /tools. Declared here rather than derived
 * from `tools`, so adding a tool can never reshuffle the page.
 */
export const TOOL_CATEGORIES: ToolCategory[] = [
  'Tra cứu',
  'Tính toán',
  'Nháp chiến thuật',
  'Luyện tập',
]

/*
 * Facts verified 2026-08-08. Three of the four sites are SPAs that serve an empty
 * HTML shell, so the descriptions trace to static sources instead:
 * - aoe4world.com: its own home page.
 * - aoe2cm.net: the README of github.com/SiegeEngineers/aoe2cm2.
 * - aoe-aegis.vercel.app and aoe4-production-calculator.com: aoe4world.com/tools,
 *   where AoE4 World lists both as community tools.
 */
export const tools: Tool[] = [
  {
    name: 'AoE4 World',
    url: 'https://aoe4world.com/',
    category: 'Tra cứu',
    games: ['Đế chế 4'],
    description:
      'Trang tra cứu số liệu lớn nhất của Đế chế 4: bảng xếp hạng ranked và quick match, hồ sơ người chơi, lịch sử trận, tỉ lệ thắng theo nền văn minh và theo bản đồ. Có thêm mục tra cứu nền văn minh, quân, nhà và công nghệ. Dùng khi bạn muốn xem lại trận vừa đánh hoặc dò trình độ đối thủ.',
  },
  {
    name: 'AoE4 Production Calculator',
    url: 'https://www.aoe4-production-calculator.com/',
    category: 'Tính toán',
    games: ['Đế chế 4'],
    description:
      'Máy tính sản xuất cho Đế chế 4: cho biết cần bao nhiêu dân thu mỗi loại tài nguyên để nuôi một dàn quân chạy liên tục. Dùng khi bạn muốn biết nên bổ dân vào gỗ, vàng hay lương trước khi bấm quân.',
  },
  {
    name: 'AoE2 Captains Mode',
    url: 'https://aoe2cm.net/',
    category: 'Nháp chiến thuật',
    games: ['Đế chế 2', 'Đế chế 3', 'Đế chế 4'],
    description:
      'Phòng nháp cấm chọn (ban/pick) cho giải đấu: hai bên lần lượt cấm và chọn nền văn minh theo một preset định sẵn, có vai chủ phòng, người chơi và khán giả riêng. Bộ preset phủ nhiều đời trong dòng Đế chế, gồm cả Đế chế 4.',
  },
  {
    name: 'Aegis',
    url: 'https://aoe-aegis.vercel.app/',
    category: 'Luyện tập',
    games: ['Đế chế 4'],
    description:
      'Game nhỏ luyện phím tắt xây nhà cho Đế chế 4: luyện bấm đúng phím cho từng công trình để quen tay mà không phải vào trận thật.',
  },
]

/** Tools in one group, in declaration order. */
export function toolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/tools/__tests__/index.spec.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/tools/index.ts src/data/tools/__tests__/index.spec.ts
git commit -m "feat(tools): add the tool directory data module"
```

---

### Task 2: `tool_click` analytics event

**Files:**
- Modify: `src/lib/analytics.ts` (append after `trackOutboundClick`)
- Test: `src/lib/__tests__/analytics.spec.ts` (extend)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `interface ToolClickEvent { tool: string; path: string }` and `function trackToolClick(event: ToolClickEvent): void`. Task 3 calls `trackToolClick`.

Do **not** widen `OutboundClickEvent`. Its `channel` union (`'discord' | 'facebook'`) and its `join_community_click` event measure conversion into the community; routing third-party outbound clicks through it would inflate that metric.

- [ ] **Step 1: Write the failing test**

Read `src/lib/__tests__/analytics.spec.ts` first and match its existing setup for stubbing `window.gtag` - reuse that harness rather than inventing a second one. Append this block:

```ts
describe('trackToolClick', () => {
  it('bắn event tool_click kèm tên công cụ và đường dẫn', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackToolClick({ tool: 'AoE4 World', path: '/tools/' })

    expect(gtag).toHaveBeenCalledWith('event', 'tool_click', {
      tool: 'AoE4 World',
      page_path: '/tools/',
    })
  })

  it('không bắn event join_community_click', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackToolClick({ tool: 'Aegis', path: '/tools/' })

    const events = gtag.mock.calls.map((c) => c[1])
    expect(events).not.toContain('join_community_click')
  })

  it('im lặng khi analytics tắt', () => {
    window.gtag = undefined
    expect(() => trackToolClick({ tool: 'Aegis', path: '/tools/' })).not.toThrow()
  })
})
```

Add `trackToolClick` to the existing import from `@/lib/analytics` at the top of the file.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/analytics.spec.ts`
Expected: FAIL - `trackToolClick` is not exported.

- [ ] **Step 3: Write the implementation**

Append to `src/lib/analytics.ts`:

```ts
/**
 * A click through to a third-party tool. Deliberately separate from
 * OutboundClickEvent: that one feeds join_community_click, which measures
 * conversion into the Discord/Facebook community and must not be diluted.
 */
export interface ToolClickEvent {
  /** Tool name as shown on /tools. */
  tool: string
  /** Route path where the click happened, e.g. /tools/ */
  path: string
}

/** Report a click through to a third-party tool. Safe no-op when analytics is off. */
export function trackToolClick(event: ToolClickEvent): void {
  window.gtag?.('event', 'tool_click', {
    tool: event.tool,
    page_path: event.path,
  })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/analytics.spec.ts`
Expected: PASS, existing tests plus 3 new ones.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/lib/__tests__/analytics.spec.ts
git commit -m "feat(analytics): track tool clicks on their own event"
```

---

### Task 3: `/tools` page, route, sitemap, accessibility gate

**Files:**
- Create: `src/views/ToolsView.vue`
- Create: `src/views/__tests__/ToolsView.spec.ts`
- Modify: `src/router/index.ts` (after the `/guides/:slug` block)
- Modify: `src/lib/sitemap.ts` (the `entries` array)
- Modify: `src/lib/__tests__/sitemap.spec.ts`
- Modify: `src/__tests__/accessibility.spec.ts` (the `PAGES` array)
- Modify: `CLAUDE.md` (the "Routes & SEO" bullet)

**Interfaces:**
- Consumes: `tools`, `TOOL_CATEGORIES`, `toolsByCategory` from Task 1; `trackToolClick` from Task 2; `breadcrumbJsonLd(trail, site)` from `@/lib/structuredData`.
- Produces: route named `tools` at path `/tools`; the page itself has no exports.

`vite.config.ts` needs **no** change: `includedRoutes` already accepts every parameterless route via `paths.filter((p) => !p.includes(':'))`.

**JSON-LD decision.** Emit `breadcrumbJsonLd` only, and no `collectionPageJsonLd`. That helper runs every item `path` through `absoluteUrl(site.url, path)`, which would rewrite the tools' third-party URLs into bogus `https://aoe4.vn/...` addresses. Widening the shared helper to carry off-site URLs would touch the guide and news indexes for no gain.

- [ ] **Step 1: Write the failing test**

Create `src/views/__tests__/ToolsView.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ToolsView from '@/views/ToolsView.vue'
import { tools, TOOL_CATEGORIES, toolsByCategory } from '@/data/tools'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/tools/' }),
}))

const trackToolClick = vi.fn()
vi.mock('@/lib/analytics', () => ({
  trackToolClick: (...args: unknown[]) => trackToolClick(...args),
}))

describe('ToolsView', () => {
  it('hiển thị mọi công cụ đúng một lần, kèm mô tả', () => {
    const wrapper = mount(ToolsView)
    for (const t of tools) {
      expect(wrapper.findAll(`a[href="${t.url}"]`)).toHaveLength(1)
      expect(wrapper.text()).toContain(t.description)
    }
  })

  it('mọi link ra ngoài mở tab mới và có rel an toàn', () => {
    const wrapper = mount(ToolsView)
    for (const t of tools) {
      const link = wrapper.get(`a[href="${t.url}"]`)
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    }
  })

  it('văn bản link là tên công cụ, không phải "tại đây"', () => {
    const wrapper = mount(ToolsView)
    for (const t of tools) {
      expect(wrapper.get(`a[href="${t.url}"]`).text()).toContain(t.name)
    }
  })

  it('nhóm theo TOOL_CATEGORIES và bỏ qua nhóm rỗng', () => {
    const wrapper = mount(ToolsView)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    const expected = TOOL_CATEGORIES.filter((c) => toolsByCategory(c).length > 0)
    expect(headings).toEqual([...expected])
  })

  it('nêu rõ game mà công cụ phục vụ', () => {
    const wrapper = mount(ToolsView)
    expect(wrapper.text()).toContain('Đế chế 2')
  })

  it('báo click công cụ về analytics', async () => {
    trackToolClick.mockClear()
    const wrapper = mount(ToolsView)
    await wrapper.get(`a[href="${tools[0].url}"]`).trigger('click')
    expect(trackToolClick).toHaveBeenCalledWith({ tool: tools[0].name, path: '/tools/' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/views/__tests__/ToolsView.spec.ts`
Expected: FAIL - cannot resolve `@/views/ToolsView.vue`.

- [ ] **Step 3: Write the page**

Create `src/views/ToolsView.vue`. Headings: the page `<h1>`, one `<h2>` per group, one `<h3>` per tool - axe's `heading-order` rule fails on a skipped level, so do not jump from `h2` to `h4`.

```vue
<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { site } from '@/data/site'
import { TOOL_CATEGORIES, toolsByCategory } from '@/data/tools'
import { trackToolClick } from '@/lib/analytics'
import { breadcrumbJsonLd } from '@/lib/structuredData'

const route = useRoute()

const pageUrl = `${site.url}/tools/`
const title = 'Công cụ Age of Empires IV (AoE4) cho người Việt'
const description =
  'Tổng hợp công cụ hỗ trợ Age of Empires IV: tra cứu ELO và lịch sử trận, máy tính sản xuất quân, phòng nháp ban/pick cho giải đấu và app luyện phím tắt.'

// Groups with nothing in them render no heading, so the page never shows an empty section.
const groups = TOOL_CATEGORIES.map((category) => ({
  category,
  items: toolsByCategory(category),
})).filter((g) => g.items.length > 0)

useHead({
  title: `${title} - ${site.name}`,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:url', content: pageUrl },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd(
          [
            { name: 'Trang chủ', path: '/' },
            { name: 'Công cụ', path: '/tools/' },
          ],
          site,
        ),
      ),
    },
  ],
})

function onToolClick(name: string) {
  trackToolClick({ tool: name, path: route.path })
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16">
    <header class="text-center">
      <p class="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-gold-dim">Công cụ</p>
      <h1 class="text-3xl font-black uppercase text-cream sm:text-4xl">Công cụ hỗ trợ Đế chế 4</h1>
      <div class="mx-auto mt-4 h-1 w-16 bg-gold"></div>
      <p class="mx-auto mt-6 max-w-2xl text-muted">
        Những trang cộng đồng Đế chế hay dùng để tra số liệu, tính toán và luyện tay. Tất cả đều
        do bên thứ ba làm và mở ở tab mới.
      </p>
    </header>

    <div v-for="group in groups" :key="group.category" class="mt-12">
      <h2 class="text-sm font-bold uppercase tracking-[0.2em] text-gold-dim">
        {{ group.category }}
      </h2>
      <ul class="mt-4 space-y-4">
        <li v-for="tool in group.items" :key="tool.url">
          <a
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-xl border border-gold-dim/20 bg-surface px-6 py-5 transition hover:border-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            @click="onToolClick(tool.name)"
          >
            <h3 class="text-xl font-bold text-gold">{{ tool.name }} ↗</h3>
            <p class="mt-1 text-sm text-gold-dim">Dùng cho {{ tool.games.join(', ') }}</p>
            <p class="mt-2 text-muted">{{ tool.description }}</p>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/views/__tests__/ToolsView.spec.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Register the route**

In `src/router/index.ts`, insert after the `/guides/:slug` block and before `/news`:

```ts
  {
    path: '/tools',
    name: 'tools',
    component: () => import('@/views/ToolsView.vue'),
  },
```

- [ ] **Step 6: Write the failing sitemap test**

In `src/lib/__tests__/sitemap.spec.ts`, add a case inside the existing top-level `describe`, matching how the file already builds its fixtures:

```ts
it('liệt kê trang công cụ', () => {
  const xml = buildSitemapXml('https://aoe4.vn', [], [])
  expect(xml).toContain('<loc>https://aoe4.vn/tools/</loc>')
})
```

- [ ] **Step 7: Run it and watch it fail**

Run: `npx vitest run src/lib/__tests__/sitemap.spec.ts`
Expected: FAIL - `/tools/` is absent.

- [ ] **Step 8: Add the sitemap entry**

In `src/lib/sitemap.ts`, add to the `entries` array right after the `/faq/` line:

```ts
    { loc: '/tools/' },
```

- [ ] **Step 9: Run the sitemap test**

Run: `npx vitest run src/lib/__tests__/sitemap.spec.ts`
Expected: PASS.

- [ ] **Step 10: Add the page to the accessibility gate**

In `src/__tests__/accessibility.spec.ts`, add to `PAGES` after the guides line:

```ts
  { name: 'công cụ', path: '/tools' },
```

- [ ] **Step 11: Run the accessibility gate**

Run: `npx vitest run src/__tests__/accessibility.spec.ts`
Expected: PASS, including the new `công cụ` case.

If `heading-order` fails, the page skipped a heading level - check that group headings are `h2` and tool names are `h3`.

- [ ] **Step 12: Fix the stale sitemap instruction in CLAUDE.md**

In `CLAUDE.md` under "Routes & SEO", replace the first bullet with:

```markdown
- Static routes are pre-rendered automatically, but add their URL to the `entries` array in `buildSitemapXml` (`src/lib/sitemap.ts`) so they appear in `sitemap.xml`. Dynamic routes (e.g. `/tournaments/:slug`) must also be listed in `includedRoutes` in `vite.config.ts`.
```

The old text pointed at a `urls` array in `vite.config.ts` that no longer exists.

- [ ] **Step 13: Commit**

```bash
git add src/views/ToolsView.vue src/views/__tests__/ToolsView.spec.ts src/router/index.ts src/lib/sitemap.ts src/lib/__tests__/sitemap.spec.ts src/__tests__/accessibility.spec.ts CLAUDE.md
git commit -m "feat(tools): add the /tools directory page"
```

---

### Task 4: Header gains `Công cụ`

**Files:**
- Modify: `src/components/AppNavbar.vue`
- Test: `src/components/__tests__/AppNavbar.spec.ts` (extend)

**Interfaces:**
- Consumes: the `/tools` route from Task 3.
- Produces: nothing later tasks depend on.

The header ends up at seven items: `Hỏi đáp`, `Giải đấu`, `Hướng dẫn`, `Công cụ`, `Tin tức`, `Blog ↗`, and the Facebook CTA. The owner considered moving `Blog ↗` to the footer to hold the six-item cap from `2026-08-03-header-menu-trim-design.md` and decided against it.

`AppFooter.vue` is **not** touched by this task.

- [ ] **Step 1: Write the failing navbar test**

In `src/components/__tests__/AppNavbar.spec.ts`, add `/tools/` to the `routes` array in `createTestRouter` so `RouterLink` resolves it:

```ts
      { path: '/tools/', component: Blank },
```

Then add these cases inside the `describe('AppNavbar')` block:

```ts
  it('có link Công cụ trong menu', async () => {
    const { wrapper } = await mountNavbar()
    const link = wrapper.get('nav > div a[href="/tools/"]')
    expect(link.text()).toContain('Công cụ')
  })

  it('giữ link Blog trong header', async () => {
    const { wrapper } = await mountNavbar()
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain(site.links.blog)
  })

  it('có đúng 7 mục trong menu', async () => {
    const { wrapper } = await mountNavbar()
    expect(wrapper.findAll('nav > div a')).toHaveLength(7)
  })
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/components/__tests__/AppNavbar.spec.ts`
Expected: FAIL - no `/tools/` link, and the menu holds 6 anchors rather than 7. The blog case passes already; it is there to pin the decision so a future edit cannot quietly drop the link.

- [ ] **Step 3: Edit the navbar**

In `src/components/AppNavbar.vue`, insert after the `Hướng dẫn` link:

```html
        <RouterLink to="/tools/" :class="MENU_LINK_CLASS"> Công cụ </RouterLink>
```

That is the only change. Leave the `Blog ↗` anchor and the Facebook CTA exactly as they are.

- [ ] **Step 4: Run the navbar test**

Run: `npx vitest run src/components/__tests__/AppNavbar.spec.ts`
Expected: PASS, existing cases plus the 3 new ones.

- [ ] **Step 5: Run the accessibility gate**

The navbar renders on every page, so this touches all of them.

Run: `npx vitest run src/__tests__/accessibility.spec.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/AppNavbar.vue src/components/__tests__/AppNavbar.spec.ts
git commit -m "feat(nav): add Cong cu to the header menu"
```

---

### Task 5: `/guides` grouped by `kind`

**Files:**
- Modify: `src/data/guides/index.ts`
- Modify: 7 guide files listed in Step 3
- Modify: `src/views/GuidesView.vue`
- Create: `src/views/__tests__/GuidesView.spec.ts`
- Modify: `src/data/guides/__tests__/index.spec.ts` (extend)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `type GuideKind = 'utility' | 'strategy' | 'comparison'`, `const GUIDE_GROUPS: Array<{ kind: GuideKind; heading: string }>`, `function guidesByKind(kind: GuideKind): Guide[]`. `Guide.kind` becomes required.

No guide slug changes. No route changes.

- [ ] **Step 1: Write the failing data test**

Append to `src/data/guides/__tests__/index.spec.ts`:

```ts
describe('guide kinds', () => {
  it('mọi guide khai kind tường minh', () => {
    for (const g of guides) {
      expect(['utility', 'strategy', 'comparison']).toContain(g.kind)
    }
  })

  it('GUIDE_GROUPS phủ hết mọi kind đang dùng, không trùng', () => {
    const kinds = GUIDE_GROUPS.map((group) => group.kind)
    expect(new Set(kinds).size).toBe(kinds.length)
    for (const g of guides) {
      expect(kinds).toContain(g.kind)
    }
  })

  it('guidesByKind chia hết bộ sưu tập, không bỏ sót bài nào', () => {
    const total = GUIDE_GROUPS.reduce((n, group) => n + guidesByKind(group.kind).length, 0)
    expect(total).toBe(guides.length)
  })

  it('ba bài so sánh được xếp đúng nhóm', () => {
    const slugs = guidesByKind('comparison').map((g) => g.slug)
    expect(slugs).toContain('aoe4-vs-aoe2-khac-biet-cot-loi')
    expect(slugs).toContain('game-rts-nao-de-bat-dau-2026')
    expect(slugs).toContain('aoe4-khac-de-che-the-nao')
  })
})
```

Extend the import at the top of that file to `import { guides, getGuideBySlug, GUIDE_GROUPS, guidesByKind } from '@/data/guides'`.

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run src/data/guides/__tests__/index.spec.ts`
Expected: FAIL - `GUIDE_GROUPS` is not exported.

- [ ] **Step 3: Make `kind` required and label every guide**

In `src/data/guides/index.ts`, change `kind?: 'utility' | 'strategy' | 'comparison'` to `kind: GuideKind`, drop the "Bỏ trống -> coi như 'strategy'" sentence from its doc comment since there is no longer a default, and add above the `Guide` interface:

```ts
/** Article type. Picks the evaluator's quality floor and the group on /guides. */
export type GuideKind = 'utility' | 'strategy' | 'comparison'
```

Then append after `getGuideBySlug`:

```ts
/**
 * Render order of the groups on /guides. Declared here rather than derived from
 * `guides`, so publishing an article can never reshuffle the page.
 */
export const GUIDE_GROUPS: Array<{ kind: GuideKind; heading: string }> = [
  { kind: 'utility', heading: 'Tra cứu' },
  { kind: 'strategy', heading: 'Chiến thuật' },
  { kind: 'comparison', heading: 'So sánh' },
]

/** Guides in one group, in publication order. */
export function guidesByKind(kind: GuideKind): Guide[] {
  return guides.filter((g) => g.kind === kind)
}
```

Now add the missing `kind` to all 7 files that lack it, on the line right after `description`:

| File | Line to add |
|---|---|
| `src/data/guides/aoe4-khac-de-che-the-nao.ts` | `kind: 'comparison',` |
| `src/data/guides/huong-dan-aoe4-nguoi-moi.ts` | `kind: 'strategy',` |
| `src/data/guides/cac-nen-van-minh-aoe4.ts` | `kind: 'strategy',` |
| `src/data/guides/cac-che-do-choi-aoe4.ts` | `kind: 'strategy',` |
| `src/data/guides/build-order-co-ban-aoe4.ts` | `kind: 'strategy',` |
| `src/data/guides/tuong-thanh-phong-thu-aoe4.ts` | `kind: 'strategy',` |
| `src/data/guides/cung-r-ngua-chem-aoe4.ts` | `kind: 'strategy',` |

`aoe4-khac-de-che-the-nao` is the one reclassification: it compares Đế chế 4 against Đế chế 1 and was silently defaulting to `strategy`. It ships **without** `sources[]` - the owner decided to backfill citations separately, so expect the guide-evaluator to warn on that article until then. Do not add invented sources to silence it.

- [ ] **Step 4: Run the data test and the type check**

Run: `npx vitest run src/data/guides/__tests__/index.spec.ts && npx vue-tsc --build`
Expected: PASS, and no type errors. `vue-tsc` is what catches any guide file still missing `kind`.

- [ ] **Step 5: Write the failing view test**

Create `src/views/__tests__/GuidesView.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import GuidesView from '@/views/GuidesView.vue'
import { guides, GUIDE_GROUPS, guidesByKind } from '@/data/guides'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

const mountOptions = {
  global: {
    stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
  },
}

describe('GuidesView', () => {
  it('hiển thị mọi guide đúng một lần, không bỏ sót bài nào', () => {
    const wrapper = mount(GuidesView, mountOptions)
    for (const g of guides) {
      expect(wrapper.findAll(`a[href="/guides/${g.slug}/"]`)).toHaveLength(1)
    }
  })

  it('nhóm theo GUIDE_GROUPS và bỏ qua nhóm rỗng', () => {
    const wrapper = mount(GuidesView, mountOptions)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    const expected = GUIDE_GROUPS.filter((g) => guidesByKind(g.kind).length > 0).map(
      (g) => g.heading,
    )
    expect(headings).toEqual(expected)
  })

  it('đặt tiêu đề bài ở h3 để không nhảy cấp heading', () => {
    const wrapper = mount(GuidesView, mountOptions)
    const titles = wrapper.findAll('h3').map((h) => h.text())
    expect(titles).toHaveLength(guides.length)
  })
})
```

- [ ] **Step 6: Run it and watch it fail**

Run: `npx vitest run src/views/__tests__/GuidesView.spec.ts`
Expected: FAIL - the page renders no `h2` group headings and puts titles in `h2`.

- [ ] **Step 7: Group the listing page**

In `src/views/GuidesView.vue`, extend the import to `import { guides, GUIDE_GROUPS, guidesByKind } from '@/data/guides'` and add below the `useHead` call:

```ts
// Empty groups render no heading, so the page never shows a bare section title.
const groups = GUIDE_GROUPS.map((group) => ({
  heading: group.heading,
  items: guidesByKind(group.kind),
})).filter((g) => g.items.length > 0)
```

Replace the single `<ul>` in the template with:

```html
    <div v-for="group in groups" :key="group.heading" class="mt-12">
      <h2 class="text-sm font-bold uppercase tracking-[0.2em] text-gold-dim">
        {{ group.heading }}
      </h2>
      <ul class="mt-4 space-y-4">
        <li v-for="g in group.items" :key="g.slug">
          <RouterLink
            :to="`/guides/${g.slug}/`"
            class="block rounded-xl border border-gold-dim/20 bg-surface px-6 py-5 transition hover:border-gold"
          >
            <h3 class="text-xl font-bold text-gold">{{ g.title }}</h3>
            <p class="mt-2 text-muted">{{ g.description }}</p>
          </RouterLink>
        </li>
      </ul>
    </div>
```

Leave the `collectionPageJsonLd` call alone - it stays a flat list of all guides, because grouping is a reading aid, not a change to what the page collects.

- [ ] **Step 8: Run the view test**

Run: `npx vitest run src/views/__tests__/GuidesView.spec.ts`
Expected: PASS, 3 tests.

- [ ] **Step 9: Run the accessibility gate**

Run: `npx vitest run src/__tests__/accessibility.spec.ts`
Expected: PASS. A `heading-order` failure here means a group heading is not `h2` or a title is not `h3`.

- [ ] **Step 10: Commit**

```bash
git add src/data/guides src/views/GuidesView.vue src/views/__tests__/GuidesView.spec.ts
git commit -m "feat(guides): group the index by kind and require the field"
```

---

### Task 6: Full gate and pull request

**Files:** none modified unless the gate finds something.

- [ ] **Step 1: Run the complete pre-PR gate**

Run: `npm run lint:check && npm run type-check && npm run test:run`
Expected: all three pass. Fix anything red before continuing; do not open the PR on a red gate.

- [ ] **Step 2: Build, to prove pre-rendering still emits Vietnamese pages**

Run: `npm run build`
Expected: success. `assertPagesDeclareVietnamese` in `vite.config.ts` fails the build if any emitted page declares the wrong language, and this branch adds a page.

- [ ] **Step 3: Confirm `/tools/` reached the sitemap**

Run: `grep -c "aoe4.vn/tools/" dist/sitemap.xml`
Expected: `1`.

- [ ] **Step 4: Manual accessibility sweep**

This branch adds an interactive widget (the tool cards), changes the `/guides` layout, and puts a seventh item in the header, and jsdom cannot see colour, spacing, or tap targets. Walk the browser checklist in `ACCESSIBILITY.md` against `/tools` and `/guides`, checking at minimum:

- contrast of the `text-gold-dim` group headings on `bg-ink`;
- the focus ring on tool cards, reached by keyboard rather than mouse;
- the header at narrow `lg` widths, 1024-1180px. That is where the seven links, the brand, and the Facebook CTA share one horizontal row, so it is the width most likely to overflow or crowd tap targets. Below `lg` the menu is a stacked panel and is not at risk.

- [ ] **Step 5: Push and open the PR**

```bash
git push -u origin claude/content-taxonomy-tools
```

PR title: `feat: add the /tools directory and group guides by kind`

The description should state that no published slug moved, that the header deliberately goes to seven items with `Blog ↗` staying put (reversing the six-item cap from `2026-08-03-header-menu-trim-design.md`), and that `aoe4-khac-de-che-the-nao` is now labelled `comparison` without `sources[]` with the backfill tracked separately.

---

## Self-Review

**Spec coverage.** Spec section 3 (five sections) → Tasks 3 and 4. Section 4 (`/tools` shape, data, page, analytics) → Tasks 1, 2, 3. Section 5 (`kind` required, grouping) → Task 5. Section 6 (navbar at seven, blog stays) → Task 4. Section 7 (file list) → covered across Tasks 1-5; `vite.config.ts` is explicitly excluded with a reason in Task 3. Section 8 (testing) → each task's own steps plus Task 6. Section 10 risks → the deferred `sources[]` is called out in Task 5 Step 3 and in the PR description.

**Deviation from the spec, recorded here.** Spec section 4 says `/tools` emits `collectionPageJsonLd` alongside `breadcrumbJsonLd`. Task 3 emits breadcrumb only: `collectionPageJsonLd` rewrites every item path through `absoluteUrl(site.url, path)`, which would turn the tools' third-party URLs into non-existent `aoe4.vn` addresses. Widening that shared helper would touch the guide and news indexes for no benefit.

**Placeholders.** None. Every step carries the literal code or the exact edit.

**Type consistency.** `ToolCategory`, `Tool`, `TOOL_CATEGORIES`, `tools`, `toolsByCategory` are defined in Task 1 and used with the same names in Task 3. `ToolClickEvent` and `trackToolClick` are defined in Task 2 and called in Task 3 with `{ tool, path }`. `GuideKind`, `GUIDE_GROUPS`, `guidesByKind` are defined in Task 5 Step 3 and used in Steps 1, 5 and 7 of the same task. `GUIDE_GROUPS` entries carry `kind` and `heading`; `TOOL_CATEGORIES` is a bare string array, since the category value doubles as its own heading.
