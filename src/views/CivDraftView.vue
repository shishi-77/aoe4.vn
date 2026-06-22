<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { civs } from '@/data/civs'
import {
  useCivDraft,
  decodeDraft,
  LAC_HONG_PRESET,
  type DraftState,
} from '@/composables/useCivDraft'

const route = useRoute()
const playable = civs.filter((c) => !c.upcoming)

function initialState(): DraftState {
  const fromUrl = typeof route.query.d === 'string' ? decodeDraft(route.query.d) : null
  return (
    fromUrl ?? {
      config: { ...LAC_HONG_PRESET, teamA: 'Đội A', teamB: 'Đội B' },
      choices: [],
    }
  )
}

const { config, choices, currentStep, isComplete, used, choose, reset, shareUrl } =
  useCivDraft(initialState())

const copied = ref(false)
async function copyShare() {
  await navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

function civName(id: string) {
  return playable.find((c) => c.id === id)?.name ?? id
}
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-16">
    <h1 class="mb-6 text-3xl font-black uppercase text-gold">Civ Draft / Ban-Pick</h1>

    <div class="mb-6 grid gap-3 sm:grid-cols-2">
      <input v-model="config.teamA" class="rounded bg-surface px-3 py-2 text-cream" aria-label="Tên đội A" />
      <input v-model="config.teamB" class="rounded bg-surface px-3 py-2 text-cream" aria-label="Tên đội B" />
    </div>

    <p v-if="!isComplete && currentStep" class="mb-4 text-lg font-bold text-cream">
      Lượt: {{ currentStep.team === 'A' ? config.teamA : config.teamB }} -
      {{ currentStep.action === 'ban' ? 'CẤM' : 'CHỌN' }}
    </p>
    <p v-else class="mb-4 text-lg font-bold text-gold">Hoàn tất draft!</p>

    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        v-for="c in playable"
        :key="c.id"
        :disabled="used.has(c.id) || isComplete"
        class="rounded border border-gold-dim/30 bg-surface px-3 py-3 text-sm font-bold text-cream enabled:hover:border-gold disabled:opacity-30"
        @click="choose(c.id)"
      >
        {{ c.name }}
      </button>
    </div>

    <ol class="mt-8 space-y-1 text-cream/90">
      <li v-for="(id, i) in choices" :key="i">{{ i + 1 }}. {{ civName(id) }}</li>
    </ol>

    <div class="mt-8 flex gap-3">
      <button class="rounded-md border border-gold px-4 py-2 font-bold text-gold hover:bg-gold hover:text-ink" @click="reset">Làm lại</button>
      <button class="rounded-md bg-gold px-4 py-2 font-bold text-ink hover:bg-gold-dim" @click="copyShare">
        {{ copied ? 'Đã copy!' : 'Copy link chia sẻ' }}
      </button>
    </div>
  </section>
</template>
