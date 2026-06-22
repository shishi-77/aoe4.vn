<script setup lang="ts">
import { tournaments } from '@/data/tournaments'
import TournamentCard from '@/components/TournamentCard.vue'
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-20">
    <h1 class="mb-10 text-4xl font-black uppercase text-gold">Giải đấu</h1>
    <div class="grid gap-4 sm:grid-cols-2">
      <TournamentCard v-for="t in tournaments" :key="t.slug" :tournament="t" />
    </div>
  </section>
</template>
