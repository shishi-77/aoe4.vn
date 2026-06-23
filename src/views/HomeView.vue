<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { dlc } from '@/data/dlc'
import { tournaments } from '@/data/tournaments'
import { site } from '@/data/site'
import DlcSection from '@/components/sections/DlcSection.vue'
import TournamentCard from '@/components/TournamentCard.vue'

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
</script>

<template>
  <DlcSection :dlc="dlc" />

  <section class="mx-auto max-w-5xl px-4 py-16">
    <h2 class="mb-6 text-2xl font-black uppercase text-gold">Giải đấu</h2>
    <div class="grid gap-4 sm:grid-cols-2">
      <TournamentCard v-for="t in tournaments" :key="t.slug" :tournament="t" />
    </div>
    <RouterLink to="/tournaments" class="mt-6 inline-block text-cream underline">
      Xem tất cả giải
    </RouterLink>
  </section>

  <section class="mx-auto max-w-3xl px-4 py-16 text-center">
    <h2 class="mb-4 text-2xl font-black uppercase text-gold">Cộng đồng AoE4 Việt Nam</h2>
    <p class="text-cream/85">
      Nơi quy tụ người chơi Age of Empires IV tại Việt Nam - giải đấu và tin tức.
    </p>
    <div class="mt-6 flex justify-center gap-4">
      <a :href="site.links.discord" target="_blank" rel="noopener noreferrer" class="rounded-md bg-gold px-6 py-3 font-bold text-ink hover:bg-gold-dim">Discord</a>
      <a :href="site.links.blog" target="_blank" rel="noopener noreferrer" class="rounded-md border border-gold px-6 py-3 font-bold text-gold hover:bg-gold hover:text-ink">Blog</a>
    </div>
  </section>
</template>
