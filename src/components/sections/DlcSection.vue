<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { useParallax } from '@/composables/useParallax'
import type { dlc as DlcType } from '@/data/dlc'
import HeroBackdrop from '@/components/sections/HeroBackdrop.vue'
import NorseDivider from '@/components/NorseDivider.vue'

const props = defineProps<{ dlc: typeof DlcType }>()

const targetDate = computed(() => props.dlc.releaseDate ?? props.dlc.predictedReleaseDate)
const isPredicted = computed(() => !props.dlc.releaseDate && !!props.dlc.predictedReleaseDate)
// showTimer chặn khi không có ngày, nên useCountdown không bao giờ render với chuỗi rỗng/NaN.
const { days, hours, minutes, seconds, isLive } = useCountdown(targetDate.value ?? '')
const showTimer = computed(() => !!targetDate.value && !isLive.value)

const units = computed(() => [
  { value: days.value, label: 'Ngày' },
  { value: hours.value, label: 'Giờ' },
  { value: minutes.value, label: 'Phút' },
  { value: seconds.value, label: 'Giây' },
])

// Phe lạnh (Scots) nhuốm steel, còn lại (Vikings) nhuốm gold ấm.
const toneOf = (civ: string) => (civ === 'Scots' ? 'scot' : 'viking')

// Parallax ghi --scroll lên section để HeroBackdrop dịch lớp theo cuộn.
const { el: heroEl } = useParallax()
</script>

<template>
  <section
    ref="heroEl"
    class="hero-enter relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 pb-40 pt-20 text-center"
  >
    <HeroBackdrop />

    <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">DLC sắp ra mắt</p>
    <h1
      class="max-w-[15ch] break-words text-3xl font-black uppercase leading-tight text-cream drop-shadow-lg sm:max-w-none sm:text-6xl"
    >
      {{ dlc.name }}
    </h1>

    <NorseDivider class="mt-4" />

    <p class="mt-3 text-cream/80">{{ dlc.fullName }}</p>

    <ul class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <li
        v-for="civ in dlc.civs"
        :key="civ"
        data-testid="civ-chip"
        :data-tone="toneOf(civ)"
        class="civ-chip rounded-full border bg-surface/60 px-4 py-1 text-sm font-bold backdrop-blur-sm"
      >
        {{ civ }}
      </li>
    </ul>

    <div
      v-if="showTimer"
      class="mt-8 grid grid-cols-2 place-items-center gap-3 sm:flex sm:items-center sm:justify-center sm:gap-5"
      role="timer"
    >
      <div
        v-for="unit in units"
        :key="unit.label"
        class="w-[72px] rounded-lg bg-surface/80 px-2 py-2 backdrop-blur-sm sm:w-[88px]"
      >
        <div class="text-3xl font-black tabular-nums text-gold sm:text-4xl">
          {{ String(unit.value).padStart(2, '0') }}
        </div>
        <div class="text-xs uppercase tracking-wide text-muted">{{ unit.label }}</div>
      </div>
    </div>
    <p v-if="showTimer && isPredicted" class="mt-3 text-xs uppercase tracking-[0.2em] text-muted">
      (dự kiến) {{ dlc.releaseLabel }}
    </p>
    <p
      v-if="!showTimer"
      class="mt-8 inline-block rounded border border-gold px-6 py-2 text-2xl font-black text-gold"
    >
      Dự kiến {{ dlc.releaseLabel }}
    </p>

    <ul class="mt-8 flex max-w-full flex-wrap items-center justify-center gap-3">
      <li
        v-for="h in dlc.highlights"
        :key="h"
        class="min-w-0 break-words rounded-lg border border-steel/25 bg-surface/60 px-4 py-2 text-sm text-cream/90 backdrop-blur-sm"
      >
        {{ h }}
      </li>
    </ul>

    <a
      :href="dlc.steamUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="cta-ember mt-8 inline-block rounded-md bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-dim"
    >
      Xem trên Steam
    </a>
  </section>
</template>

<style scoped>
.civ-chip[data-tone='viking'] {
  border-color: rgba(231, 185, 85, 0.5);
  color: var(--color-gold);
}
.civ-chip[data-tone='scot'] {
  border-color: rgba(91, 138, 166, 0.55);
  color: var(--color-ice);
}
</style>
