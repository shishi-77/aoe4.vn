<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { site } from '@/data/site'
import { newsPosts } from '@/data/news'
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/structuredData'

const pageUrl = `${site.url}/news/`
const title = 'Tin tức Age of Empires IV (Đế chế 4)'
const description =
  'Tin tức Age of Empires IV bằng tiếng Việt: patch notes, giải đấu và DLC, kèm link nguồn chính thức cho người chơi Đế chế.'

const posts = [...newsPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

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
        collectionPageJsonLd(
          { name: title, description, path: '/news/' },
          posts.map((p) => ({ name: p.title, path: `/news/${p.slug}/` })),
          site,
        ),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd(
          [
            { name: 'Trang chủ', path: '/' },
            { name: 'Tin tức', path: '/news/' },
          ],
          site,
        ),
      ),
    },
  ],
})
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16">
    <header class="text-center">
      <p class="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-gold-dim">Tin tức</p>
      <h1 class="text-3xl font-black uppercase text-cream sm:text-4xl">Tin tức Đế chế 4</h1>
      <div class="mx-auto mt-4 h-1 w-16 bg-gold"></div>
    </header>

    <ul class="mt-12 space-y-4">
      <li v-for="p in posts" :key="p.slug">
        <RouterLink
          :to="`/news/${p.slug}/`"
          class="block rounded-xl border border-gold-dim/20 bg-surface px-6 py-5 transition hover:border-gold"
        >
          <time :datetime="p.publishedAt" class="text-sm text-gold-dim">{{ p.publishedAt }}</time>
          <h2 class="mt-1 text-xl font-bold text-gold">{{ p.title }}</h2>
          <p class="mt-2 text-muted">{{ p.description }}</p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
