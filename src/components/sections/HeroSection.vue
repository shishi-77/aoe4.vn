<script setup lang="ts">
import { tournament } from '@/data/tournament'
import { useCountdown } from '@/composables/useCountdown'
import CtaButton from '@/components/CtaButton.vue'
import banner from '@/assets/imgs/Lac_Hong_Cup_Banner.jpg'

const { days, hours, minutes, seconds, isLive } = useCountdown(tournament.startsAt)
</script>

<template>
  <section
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
  >
    <img
      :src="banner"
      :alt="`Banner ${tournament.name}`"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink"></div>

    <div class="relative z-10 mx-auto max-w-3xl py-20">
      <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">
        {{ tournament.organizer }}
      </p>
      <h1 class="text-5xl font-black uppercase leading-none text-cream sm:text-7xl">
        {{ tournament.name }}
      </h1>
      <div class="mt-4 flex items-center justify-center">
        <span
          class="rounded border border-gold px-4 py-1 text-sm font-bold tracking-widest text-gold"
        >
          {{ tournament.format }} · BO3
        </span>
      </div>

      <p class="mt-6 text-base text-cream/90 sm:text-lg">
        🗓️ {{ tournament.dateLabel }} — 📍 {{ tournament.venue.name }}
      </p>

      <div v-if="!isLive" class="mt-8 flex items-center justify-center gap-3 sm:gap-5">
        <div
          v-for="unit in [
            { value: days, label: 'Ngày' },
            { value: hours, label: 'Giờ' },
            { value: minutes, label: 'Phút' },
            { value: seconds, label: 'Giây' },
          ]"
          :key="unit.label"
          class="min-w-[64px] rounded-lg bg-surface/80 px-3 py-2"
        >
          <div class="text-3xl font-black text-gold sm:text-4xl">
            {{ String(unit.value).padStart(2, '0') }}
          </div>
          <div class="text-xs uppercase tracking-wide text-muted">{{ unit.label }}</div>
        </div>
      </div>
      <p v-else class="mt-8 text-2xl font-black uppercase text-gold">
        🔴 Giải đấu đang diễn ra
      </p>

      <div class="mt-10">
        <CtaButton :href="tournament.links.discord">▶ Đăng ký ngay</CtaButton>
      </div>
    </div>
  </section>
</template>
