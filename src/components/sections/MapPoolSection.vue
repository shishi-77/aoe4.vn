<script setup lang="ts">
import { tournament } from '@/data/tournament'
import SectionTitle from '@/components/SectionTitle.vue'
</script>

<template>
  <section class="bg-surface/40 py-20">
    <div class="mx-auto max-w-5xl px-4">
      <SectionTitle :eyebrow="`${tournament.maps.length} bản đồ`" title="Map Pool" />
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div
          v-for="(map, i) in tournament.maps"
          :key="map"
          class="rounded-lg border border-gold-dim/20 bg-surface px-4 py-4 text-center font-bold text-cream"
          :class="{
            'col-span-2 sm:col-span-1':
              i === tournament.maps.length - 1 && tournament.maps.length % 2 === 1,
          }"
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
    </div>
  </section>
</template>
