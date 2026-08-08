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
