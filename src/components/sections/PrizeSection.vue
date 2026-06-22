<script setup lang="ts">
import type { Tournament } from '@/data/tournaments'
import SectionTitle from '@/components/SectionTitle.vue'

const props = defineProps<{ tournament: Tournament }>()

const podium = props.tournament.prizes.slice(0, 3)
const rest = props.tournament.prizes.slice(3)
</script>

<template>
  <section class="bg-surface/40 py-20">
    <div class="mx-auto max-w-5xl px-4">
      <SectionTitle :eyebrow="`Tổng giải thưởng ${props.tournament.prizePoolTotal}`" title="Giải thưởng" />

      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="p in podium"
          :key="p.rank"
          class="rounded-xl border border-gold/30 bg-ink p-6 text-center"
        >
          <div class="text-4xl">{{ p.medal }}</div>
          <div class="mt-2 text-sm uppercase tracking-wide text-muted">{{ p.label }}</div>
          <div class="mt-1 text-2xl font-black text-gold">{{ p.amount }}</div>
          <div v-if="p.note" class="mt-1 text-sm text-cream/80">{{ p.note }}</div>
        </div>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <div
          v-for="p in rest"
          :key="p.rank"
          class="flex items-center justify-between rounded-lg border border-gold-dim/15 bg-ink px-5 py-3"
        >
          <span class="font-bold text-cream">{{ p.label }}</span>
          <span class="font-black text-gold-dim">{{ p.amount }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
