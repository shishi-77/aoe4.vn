import { fileURLToPath, URL } from 'node:url'
import { writeFileSync } from 'node:fs'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import 'vite-ssg'

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
        '/guides/cach-tai-aoe4',
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
      const base = 'https://aoe4.vn'
      const urls = [
        '/',
        '/faq/',
        '/tournaments/',
        '/tournaments/lac-hong/',
        '/tournaments/ha-noi-open-1/',
        '/guides/',
        '/guides/cach-tai-aoe4/',
      ]
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n') +
        `\n</urlset>\n`
      writeFileSync('dist/sitemap.xml', xml)
    },
  },
})
