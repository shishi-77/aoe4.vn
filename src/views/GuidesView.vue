<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { site } from '@/data/site'
import { guides } from '@/data/guides'

const pageUrl = `${site.url}/guides/`
const title = 'Hướng dẫn Age of Empires IV (Đế chế 4) cho người Việt'
const description =
  'Tổng hợp hướng dẫn AoE4 tiếng Việt: cách tải và mua game, cấu hình máy, khác biệt so với Đế chế và mẹo cho người mới.'

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
})
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16">
    <header class="text-center">
      <p class="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-gold-dim">Hướng dẫn</p>
      <h1 class="text-3xl font-black uppercase text-cream sm:text-4xl">Hướng dẫn Đế chế 4</h1>
      <div class="mx-auto mt-4 h-1 w-16 bg-gold"></div>
    </header>

    <ul class="mt-12 space-y-4">
      <li v-for="g in guides" :key="g.slug">
        <RouterLink
          :to="`/guides/${g.slug}`"
          class="block rounded-xl border border-gold-dim/20 bg-surface px-6 py-5 transition hover:border-gold"
        >
          <h2 class="text-xl font-bold text-gold">{{ g.title }}</h2>
          <p class="mt-2 text-muted">{{ g.description }}</p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
