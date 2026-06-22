<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@unhead/vue'
import { civs } from '@/data/civs'
import { maps } from '@/data/maps'
import { pickRandom } from '@/composables/useRandomPicker'
import { site } from '@/data/site'

useHead({
  title: `Random Civ / Map - ${site.name}`,
  meta: [
    { name: 'description', content: 'Quay ngẫu nhiên civ hoặc map từ pool trong Age of Empires IV.' },
    { property: 'og:title', content: `Random Civ / Map - ${site.name}` },
    { property: 'og:description', content: 'Quay ngẫu nhiên civ hoặc map từ pool trong Age of Empires IV.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
  ],
})

const mode = ref<'civ' | 'map'>('civ')
const playerCount = ref(1)
const result = ref<string[]>([])

function roll() {
  const pool =
    mode.value === 'civ'
      ? civs.filter((c) => !c.upcoming).map((c) => c.name)
      : maps.map((m) => m.name)
  result.value = pickRandom(pool, mode.value === 'civ' ? playerCount.value : 1)
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 class="mb-6 text-3xl font-black uppercase text-gold">Random Civ / Map</h1>

    <div class="mb-6 flex justify-center gap-3">
      <button
        v-for="m in (['civ', 'map'] as const)"
        :key="m"
        class="rounded-md px-4 py-2 font-bold"
        :class="mode === m ? 'bg-gold text-ink' : 'border border-gold text-gold'"
        @click="mode = m; result = []"
      >
        {{ m === 'civ' ? 'Civ' : 'Map' }}
      </button>
    </div>

    <div v-if="mode === 'civ'" class="mb-6">
      <label class="text-cream">Số người chơi:
        <input v-model.number="playerCount" type="number" min="1" max="8" class="ml-2 w-16 rounded bg-surface px-2 py-1 text-center text-cream" />
      </label>
    </div>

    <button class="rounded-md bg-gold px-8 py-3 text-lg font-black text-ink hover:bg-gold-dim" @click="roll">
      🎲 Quay
    </button>

    <ul v-if="result.length" class="mt-8 space-y-2">
      <li v-for="(r, i) in result" :key="i" class="text-2xl font-black text-gold">{{ r }}</li>
    </ul>
  </section>
</template>
