<script setup lang="ts">
import type { Tournament } from '@/data/tournaments'
import SectionTitle from '@/components/SectionTitle.vue'

const props = defineProps<{ tournament: Tournament }>()
</script>

<template>
  <section class="py-20">
    <div class="mx-auto max-w-5xl px-4">
      <SectionTitle eyebrow="Thể thức thi đấu" :title="`${props.tournament.format} có Ban / Pick`" />
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-gold-dim/20 bg-ink p-6">
          <h3 class="text-xl font-bold text-gold">Luật thi đấu</h3>
          <ul class="mt-3 space-y-2 text-cream/90">
            <li>• {{ props.tournament.format }} có ban/pick civ</li>
            <li>• {{ props.tournament.bracketFormat }}</li>
          </ul>
        </div>
        <div
          class="flex flex-col justify-center gap-3 rounded-xl border border-gold-dim/20 bg-ink p-6"
        >
          <a
            v-if="props.tournament.links.banPick"
            :href="props.tournament.links.banPick"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border border-gold px-4 py-3 text-center font-bold text-gold transition hover:bg-gold hover:text-ink"
          >
            🔗 Link Ban / Pick
          </a>
          <p class="text-center text-sm text-muted">Map pool chi tiết xem ở mục bên dưới</p>
        </div>
      </div>
    </div>
  </section>
</template>
