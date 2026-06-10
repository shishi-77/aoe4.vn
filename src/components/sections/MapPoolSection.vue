<script setup lang="ts">
import { tournament } from '@/data/tournament'
import SectionTitle from '@/components/SectionTitle.vue'
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-16">
    <SectionTitle eyebrow="9 bản đồ" title="Map Pool" />
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
        v-for="map in tournament.maps"
        :key="map"
        class="rounded-lg border border-gold-dim/20 bg-surface px-4 py-4 text-center font-bold text-cream"
      >
        {{ map }}
      </div>
    </div>
    <div class="mt-8 text-center">
      <a
        :href="tournament.links.mapPool"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
      >
        🗺️ Xem Map Pool
      </a>
    </div>
  </section>
</template>
