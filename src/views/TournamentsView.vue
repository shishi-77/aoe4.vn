<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { tournaments } from '@/data/tournaments'
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-20">
    <h1 class="mb-10 text-4xl font-black uppercase text-gold">Giải đấu</h1>
    <ul class="grid gap-4 sm:grid-cols-2">
      <li v-for="t in tournaments" :key="t.slug">
        <RouterLink
          :to="`/tournaments/${t.slug}`"
          class="block rounded-lg border border-gold-dim/20 bg-surface p-6 hover:border-gold"
        >
          <h2 class="text-xl font-bold text-cream">{{ t.name }}</h2>
          <p class="mt-1 text-sm text-muted">{{ t.dateLabel }}</p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
