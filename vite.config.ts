import { fileURLToPath, URL } from 'node:url'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import 'vite-ssg'
import { guides } from './src/data/guides'
import { newsPosts } from './src/data/news'
import { buildSitemapXml } from './src/lib/sitemap'

/**
 * Fail the build if any pre-rendered page ships a `<html lang>` other than "vi".
 * unhead rebuilds the <html> tag during SSR and falls back to "en" when nothing
 * declares a language, which silently drops the lang="vi" in index.html - a
 * WCAG 3.1.1 failure that no jsdom test can see, because it only appears in the
 * built output. `useHead` in App.vue is what sets it; this is the tripwire.
 */
function assertPagesDeclareVietnamese(dir: string) {
  const offenders: string[] = []

  const walk = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name.endsWith('.html')) {
        const lang = readFileSync(full, 'utf8').match(/<html[^>]*\slang="([^"]*)"/i)?.[1]
        if (lang !== 'vi') offenders.push(`${full} (lang=${lang ?? 'missing'})`)
      }
    }
  }
  walk(dir)

  if (offenders.length > 0) {
    throw new Error(
      `Pre-rendered pages must declare lang="vi":\n  ${offenders.join('\n  ')}`,
    )
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes(paths: string[]) {
      return [
        ...paths.filter((p) => !p.includes(':')),
        '/tournaments/lac-hong',
        '/tournaments/ha-noi-open-1',
        ...guides.map((g) => `/guides/${g.slug}`),
        ...newsPosts.map((p) => `/news/${p.slug}`),
      ]
    },
    async onPageRendered(_route, html, appCtx) {
      // Apply per-route useHead() tags to the pre-rendered HTML.
      // vite-ssg's renderDOMHead() skips on the unhead v3 SSR head (no `dirty` flag),
      // so we manually drive the SSR render pipeline via transformHtmlTemplate.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { head } = appCtx as { head?: any }
      if (!head) return html
      const { transformHtmlTemplate } = await import('unhead/server')
      return transformHtmlTemplate(head, html)
    },
    onFinished() {
      writeFileSync('dist/sitemap.xml', buildSitemapXml('https://aoe4.vn', guides, newsPosts))
      assertPagesDeclareVietnamese('dist')
    },
  },
})
