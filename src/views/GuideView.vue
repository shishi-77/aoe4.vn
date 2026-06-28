<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getGuideBySlug } from '@/data/guides'
import { site } from '@/data/site'
import { guideArticleJsonLd } from '@/lib/structuredData'

const route = useRoute()
const guide = computed(() => getGuideBySlug(String(route.params.slug)))

useHead(() => {
  const g = guide.value
  if (!g) return { title: `Không tìm thấy - ${site.name}` }
  const url = `${site.url}/guides/${g.slug}/`
  return {
    title: `${g.title} - ${site.name}`,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: g.description },
      { property: 'og:url', content: url },
      { property: 'og:title', content: g.title },
      { property: 'og:description', content: g.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: `${site.url}/og.jpg` },
    ],
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(guideArticleJsonLd(g, site)) },
    ],
  }
})
</script>

<template>
  <article v-if="guide" class="mx-auto max-w-3xl px-4 py-16">
    <header>
      <h1 class="text-3xl font-black uppercase text-cream sm:text-4xl">{{ guide.title }}</h1>
      <div class="mt-4 h-1 w-16 bg-gold"></div>
    </header>

    <div class="mt-10 space-y-8">
      <section v-for="s in guide.sections" :key="s.heading">
        <h2 class="text-xl font-bold text-gold">{{ s.heading }}</h2>
        <p v-for="(p, i) in s.paragraphs" :key="i" class="mt-2 leading-relaxed text-cream/90">
          {{ p }}
        </p>
      </section>
    </div>

    <div
      v-if="guide.cta"
      class="mt-12 rounded-xl border border-gold-dim/20 bg-surface px-6 py-10 text-center"
    >
      <h2 class="text-2xl font-black uppercase text-cream">Tham gia cộng đồng AoE4 Việt Nam</h2>
      <p class="mx-auto mt-3 max-w-xl text-muted">
        Giao lưu, tìm đồng đội và hỏi đáp cùng người chơi Đế chế 4 trong nước.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
        <a
          :href="site.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-base font-extrabold uppercase tracking-wide text-ink shadow-lg shadow-gold/20 transition hover:bg-cream"
        >
          Discord
        </a>
      </div>
    </div>
  </article>

  <section v-else class="mx-auto max-w-3xl px-4 py-24 text-center">
    <h1 class="text-2xl font-black text-cream">Không tìm thấy bài hướng dẫn</h1>
  </section>
</template>
