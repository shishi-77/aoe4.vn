import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import axe, { type Result } from 'axe-core'
import indexHtml from '../../index.html?raw'
import App from '@/App.vue'
import { routes } from '@/router'
import { guides } from '@/data/guides'
import { newsPosts } from '@/data/news'
import { tournaments } from '@/data/tournaments'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

/*
 * Rules that need a laid-out page with real CSS. jsdom applies no stylesheet,
 * so axe would either crash on them or report noise - the browser-only half of
 * the audit (contrast, tap target size, reflow) is covered by the manual sweep
 * documented in ACCESSIBILITY.md.
 */
const BROWSER_ONLY_RULES = ['color-contrast', 'color-contrast-enhanced', 'target-size']

/** Every page shape a reader can land on, one representative URL each. */
const PAGES: { name: string; path: string }[] = [
  { name: 'trang chủ', path: '/' },
  { name: 'hỏi đáp', path: '/faq' },
  { name: 'danh sách hướng dẫn', path: '/guides' },
  { name: 'công cụ', path: '/tools' },
  { name: 'danh sách tin tức', path: '/news' },
  { name: 'danh sách giải đấu', path: '/tournaments' },
  ...guides.map((g) => ({ name: `hướng dẫn ${g.slug}`, path: `/guides/${g.slug}` })),
  ...newsPosts.map((p) => ({ name: `tin ${p.slug}`, path: `/news/${p.slug}` })),
  ...tournaments.map((t) => ({ name: `giải ${t.slug}`, path: `/tournaments/${t.slug}` })),
  { name: 'không tìm thấy', path: '/khong-ton-tai' },
]

function formatViolations(violations: Result[]) {
  return violations
    .map((v) => {
      const nodes = v.nodes.map((n) => `      ${n.html.slice(0, 160)}`).join('\n')
      return `  [${v.impact}] ${v.id}: ${v.help}\n${nodes}`
    })
    .join('\n')
}

let router: Router

beforeAll(() => {
  /*
   * jsdom starts with no <html lang>, which would make every page fail
   * `html-has-lang` for a reason that has nothing to do with the page. Mirror
   * the template's value so the rule is meaningful here.
   *
   * The template is NOT what ships, though: unhead rebuilds the <html> tag
   * during pre-render and defaults to "en" unless something declares a
   * language. `useHead` in App.vue does that, and the real guarantee is the
   * tripwire in vite.config.ts, which reads the built pages.
   */
  const lang = indexHtml.match(/<html[^>]*\slang="([^"]*)"/)?.[1] ?? ''
  expect(lang, 'index.html phải khai báo <html lang="vi">').toBe('vi')
  document.documentElement.lang = lang
})

beforeEach(() => {
  router = createRouter({ history: createMemoryHistory(), routes })
})

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Accessibility (axe-core)', () => {
  it.each(PAGES)('$name không có vi phạm accessibility', async ({ path }) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    await router.push(path)
    await router.isReady()
    const wrapper = mount(App, {
      attachTo: container,
      global: { plugins: [router] },
    })
    await flushPromises()

    const results = await axe.run(document.body, {
      rules: Object.fromEntries(BROWSER_ONLY_RULES.map((id) => [id, { enabled: false }])),
      resultTypes: ['violations'],
    })

    expect(
      results.violations,
      `Vi phạm accessibility tại ${path}:\n${formatViolations(results.violations)}`,
    ).toEqual([])

    wrapper.unmount()
  })
})
