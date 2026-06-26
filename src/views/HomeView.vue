<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { dlc } from '@/data/dlc'
import { tournaments } from '@/data/tournaments'
import { site } from '@/data/site'
import DlcSection from '@/components/sections/DlcSection.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import TournamentCard from '@/components/TournamentCard.vue'
import { useReveal } from '@/composables/useReveal'

useHead({
  title: `${site.name} - Cộng đồng Age of Empires IV Việt Nam`,
  meta: [
    { name: 'description', content: site.description },
    { property: 'og:title', content: site.name },
    { property: 'og:description', content: site.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
  ],
})

const { el: tournamentsEl } = useReveal()
const { el: communityEl } = useReveal()
</script>

<template>
  <DlcSection :dlc="dlc" />

  <section ref="tournamentsEl" class="reveal mx-auto max-w-5xl px-4 py-16">
    <SectionTitle title="Giải đấu" />
    <div class="grid gap-4 sm:grid-cols-2">
      <TournamentCard v-for="t in tournaments" :key="t.slug" :tournament="t" />
    </div>
    <div class="mt-8 text-center">
      <RouterLink
        to="/tournaments"
        class="inline-block rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
      >
        Xem tất cả giải
      </RouterLink>
    </div>
  </section>

  <section
    ref="communityEl"
    class="reveal border-t border-gold-dim/10 bg-surface/40 px-4 py-16"
  >
    <div class="mx-auto max-w-3xl text-center">
      <SectionTitle eyebrow="Tham gia" title="Cộng đồng AoE4 Việt Nam" />
      <p class="text-cream/85">
        Nơi quy tụ người chơi Age of Empires IV tại Việt Nam - giải đấu và tin tức.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-4">
        <a
          :href="site.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-dim"
        >
          Discord
        </a>
        <a
          :href="site.links.youtube"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
        >
          YouTube
        </a>
        <a
          :href="site.links.blog"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
        >
          Blog
        </a>
      </div>
    </div>
  </section>
</template>
