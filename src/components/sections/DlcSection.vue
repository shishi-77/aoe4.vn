<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import type { dlc as DlcType } from '@/data/dlc'
import heroArt from '@/assets/imgs/raiders-of-the-north-hero.jpg'

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
</script>

<template>
  <section
    class="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center"
  >
    <!-- Lớp nền không khí: chính ảnh key art, làm mờ + zoom chậm (Ken Burns) -->
    <img
      :src="heroArt"
      alt=""
      aria-hidden="true"
      class="kenburns pointer-events-none absolute inset-0 -z-20 h-full w-full scale-105 object-cover opacity-40 blur-2xl"
    />
    <!-- Gradient phủ làm tối nền cho dễ đọc -->
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink/40 via-ink/75 to-ink"></div>
    <!-- Lớp tuyết trôi -->
    <div class="snow pointer-events-none absolute inset-0 -z-10"></div>

    <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">DLC sắp ra mắt</p>
    <h1 class="text-4xl font-black uppercase text-cream drop-shadow-lg sm:text-6xl">
      {{ dlc.name }}
    </h1>
    <p class="mt-3 text-cream/80">{{ dlc.fullName }}</p>

    <ul class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <li
        v-for="civ in dlc.civs"
        :key="civ"
        data-testid="civ-chip"
        class="rounded-full border border-gold/50 bg-surface/60 px-4 py-1 text-sm font-bold text-gold backdrop-blur-sm"
      >
        {{ civ }}
      </li>
    </ul>

    <div
      v-if="showTimer"
      class="mt-8 flex items-center justify-center gap-3 sm:gap-5"
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

    <ul class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <li
        v-for="h in dlc.highlights"
        :key="h"
        class="rounded-lg border border-gold-dim/20 bg-surface/60 px-4 py-2 text-sm text-cream/90 backdrop-blur-sm"
      >
        {{ h }}
      </li>
    </ul>

    <a
      :href="dlc.steamUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-8 inline-block rounded-md bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-dim"
    >
      Xem trên Steam
    </a>
  </section>
</template>
