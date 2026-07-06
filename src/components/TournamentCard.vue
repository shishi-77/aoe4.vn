<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Tournament } from '@/data/tournaments'

const props = defineProps<{ tournament: Tournament }>()

const status = computed(() => {
  const now = Date.now()
  if (now >= new Date(props.tournament.endsAt).getTime()) return 'Đã kết thúc'
  if (now >= new Date(props.tournament.startsAt).getTime()) return 'Đang diễn ra'
  return 'Sắp diễn ra'
})
</script>

<template>
  <RouterLink
    :to="`/tournaments/${tournament.slug}/`"
    class="block rounded-lg border border-gold-dim/20 bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/5 motion-reduce:transform-none motion-reduce:transition-none"
  >
    <span class="text-xs font-bold uppercase tracking-wide text-gold">{{ status }}</span>
    <h2 class="mt-1 text-xl font-bold text-cream">{{ tournament.name }}</h2>
    <p class="mt-1 text-sm text-muted">{{ tournament.dateLabel }}</p>
    <p class="mt-1 text-sm text-muted">{{ tournament.format }} · {{ tournament.prizePoolTotal }}</p>
  </RouterLink>
</template>
