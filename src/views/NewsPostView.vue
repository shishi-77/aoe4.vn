<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getNewsPostBySlug } from '@/data/news'
import { site } from '@/data/site'
import { newsArticleJsonLd } from '@/lib/structuredData'
import CommunityCta from '@/components/CommunityCta.vue'

const route = useRoute()
const post = computed(() => getNewsPostBySlug(String(route.params.slug)))

useHead(() => {
  const p = post.value
  if (!p)
    return {
      title: `Không tìm thấy - ${site.name}`,
      meta: [{ name: 'robots', content: 'noindex' }],
    }
  const url = `${site.url}/news/${p.slug}/`
  return {
    title: `${p.title} - ${site.name}`,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: p.description },
      { property: 'og:url', content: url },
      { property: 'og:title', content: p.title },
      { property: 'og:description', content: p.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: `${site.url}/og.jpg` },
    ],
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(newsArticleJsonLd(p, site)) },
    ],
  }
})
</script>

<template>
  <article v-if="post" class="mx-auto max-w-3xl px-4 py-16">
    <header>
      <time :datetime="post.publishedAt" class="text-sm font-bold uppercase text-gold-dim">
        {{ post.publishedAt }}
      </time>
      <h1 class="mt-2 text-3xl font-black uppercase text-cream sm:text-4xl">{{ post.title }}</h1>
      <div class="mt-4 h-1 w-16 bg-gold"></div>
    </header>

    <div class="mt-10 space-y-8">
      <section v-for="s in post.sections" :key="s.heading">
        <h2 class="text-xl font-bold text-gold">{{ s.heading }}</h2>
        <p v-for="(p, i) in s.paragraphs" :key="i" class="mt-2 leading-relaxed text-cream/90">
          {{ p }}
        </p>
      </section>
    </div>

    <nav aria-label="Nguồn" class="mt-12 border-t border-gold/20 pt-6">
      <h2 class="text-sm font-bold uppercase tracking-wide text-gold-dim">Nguồn</h2>
      <ul class="mt-3 space-y-2">
        <li v-for="src in post.sources" :key="src.url">
          <a
            :href="src.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-11 items-center text-cream hover:text-gold hover:underline"
          >
            {{ src.label }} ↗
          </a>
        </li>
      </ul>
    </nav>

    <CommunityCta v-if="post.cta" />
  </article>

  <div v-else class="mx-auto max-w-2xl px-4 py-32 text-center">
    <h1 class="text-3xl font-black text-gold">Không tìm thấy bản tin</h1>
    <RouterLink to="/news/" class="mt-6 inline-flex min-h-11 items-center text-cream underline">
      Xem tất cả tin tức
    </RouterLink>
  </div>
</template>
