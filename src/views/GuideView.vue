<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getGuideBySlug } from '@/data/guides'
import { site } from '@/data/site'
import { guideArticleJsonLd } from '@/lib/structuredData'
import CommunityCta from '@/components/CommunityCta.vue'

const route = useRoute()
const guide = computed(() => getGuideBySlug(String(route.params.slug)))

useHead(() => {
  const g = guide.value
  if (!g)
    return {
      title: `Không tìm thấy - ${site.name}`,
      meta: [{ name: 'robots', content: 'noindex' }],
    }
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
        <RouterLink
          v-if="s.link"
          :to="`/guides/${s.link.slug}`"
          class="mt-3 inline-block text-sm font-semibold text-gold hover:underline"
        >
          {{ s.link.label }} →
        </RouterLink>
      </section>
    </div>

    <nav
      v-if="guide.related?.length"
      aria-label="Bài liên quan"
      class="mt-12 border-t border-gold/20 pt-6"
    >
      <h2 class="text-sm font-bold uppercase tracking-wide text-gold-dim">Bài liên quan</h2>
      <ul class="mt-3 space-y-2">
        <li v-for="r in guide.related" :key="r.slug">
          <RouterLink :to="`/guides/${r.slug}`" class="text-cream hover:text-gold hover:underline">
            {{ r.label }} →
          </RouterLink>
        </li>
      </ul>
    </nav>

    <CommunityCta v-if="guide.cta" />
  </article>

  <div v-else class="mx-auto max-w-2xl px-4 py-32 text-center">
    <h1 class="text-3xl font-black text-gold">Không tìm thấy bài hướng dẫn</h1>
    <RouterLink to="/guides" class="mt-6 inline-block text-cream underline">
      Xem tất cả hướng dẫn
    </RouterLink>
  </div>
</template>
