<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { tournaments } from '@/data/tournaments'
import { site } from '@/data/site'
import TournamentCard from '@/components/TournamentCard.vue'

useHead({
  title: `Giải đấu - ${site.name}`,
  link: [{ rel: 'canonical', href: `${site.url}/tournaments/` }],
  meta: [
    { name: 'description', content: 'Danh sách giải đấu Age of Empires IV tại Việt Nam.' },
    { property: 'og:url', content: `${site.url}/tournaments/` },
    { property: 'og:title', content: `Giải đấu - ${site.name}` },
    { property: 'og:description', content: 'Danh sách giải đấu Age of Empires IV tại Việt Nam.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
  ],
})
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-20">
    <h1 class="mb-10 text-4xl font-black uppercase text-gold">Giải đấu</h1>
    <div class="grid gap-4 sm:grid-cols-2">
      <TournamentCard v-for="t in tournaments" :key="t.slug" :tournament="t" />
    </div>
  </section>
</template>
