<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import type { dlc as DlcType } from '@/data/dlc'

const props = defineProps<{ dlc: typeof DlcType }>()

const hasDate = computed(() => !!props.dlc.releaseDate)
// useCountdown an toàn với chuỗi rỗng (isLive=true ngay); chỉ render timer khi hasDate.
const { days, hours, minutes, seconds, isLive } = useCountdown(props.dlc.releaseDate ?? '')
</script>

<template>
  <section class="relative flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center">
    <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">DLC sắp ra mắt</p>
    <h1 class="text-4xl font-black uppercase text-cream sm:text-6xl">{{ dlc.name }}</h1>
    <p class="mt-3 text-cream/80">{{ dlc.fullName }}</p>

    <div
      v-if="hasDate && !isLive"
      class="mt-8 flex items-center justify-center gap-3 sm:gap-5"
      role="timer"
    >
      <div
        v-for="unit in [
          { value: days, label: 'Ngày' },
          { value: hours, label: 'Giờ' },
          { value: minutes, label: 'Phút' },
          { value: seconds, label: 'Giây' },
        ]"
        :key="unit.label"
        class="w-[72px] rounded-lg bg-surface/80 px-2 py-2 sm:w-[88px]"
      >
        <div class="text-3xl font-black tabular-nums text-gold sm:text-4xl">
          {{ String(unit.value).padStart(2, '0') }}
        </div>
        <div class="text-xs uppercase tracking-wide text-muted">{{ unit.label }}</div>
      </div>
    </div>
    <p v-else class="mt-8 inline-block rounded border border-gold px-6 py-2 text-2xl font-black text-gold">
      Dự kiến {{ dlc.releaseLabel }}
    </p>

    <ul class="mt-8 space-y-1 text-cream/90">
      <li v-for="h in dlc.highlights" :key="h">• {{ h }}</li>
    </ul>

    <a
      :href="dlc.steamUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-8 inline-block rounded-md bg-gold px-6 py-3 font-bold text-ink hover:bg-gold-dim"
    >
      Xem trên Steam
    </a>
  </section>
</template>
