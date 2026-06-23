<script setup lang="ts">
import type { Tournament } from '@/data/tournaments'
import { useCountdown } from '@/composables/useCountdown'
import CtaButton from '@/components/CtaButton.vue'

const props = defineProps<{ tournament: Tournament }>()

const { days, hours, minutes, seconds, isLive } = useCountdown(props.tournament.startsAt)

const isOver = Date.now() >= new Date(props.tournament.endsAt).getTime()
const registrationClosed = Date.now() >= new Date(props.tournament.registrationClosesAt).getTime()
</script>

<template>
  <section
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
  >
    <img
      :src="props.tournament.banner"
      :alt="`Banner ${props.tournament.name}`"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink"></div>

    <div class="relative z-10 mx-auto max-w-3xl py-20">
      <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">
        {{ props.tournament.organizer }}
      </p>
      <h1 class="text-5xl font-black uppercase leading-tight text-cream sm:text-7xl">
        {{ props.tournament.name }}
      </h1>
      <div class="mt-4 flex items-center justify-center">
        <span
          class="rounded border border-gold px-4 py-1 text-sm font-bold tracking-widest text-gold"
        >
          {{ props.tournament.format }}
        </span>
      </div>

      <p class="mt-6 text-base text-cream/90 sm:text-lg">
        🗓️ {{ props.tournament.dateLabel }} · 📍
        <a
          :href="props.tournament.venue.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-cream/40 underline-offset-4 transition hover:text-gold"
          >{{ props.tournament.venue.name }}</a
        >
      </p>
      <p class="mt-1 text-sm text-cream/70">{{ props.tournament.venue.address }}</p>

      <div
        v-if="!isLive"
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
          :aria-label="`${unit.value} ${unit.label}`"
        >
          <div class="text-3xl font-black tabular-nums text-gold sm:text-4xl">
            {{ String(unit.value).padStart(2, '0') }}
          </div>
          <div class="text-xs uppercase tracking-wide text-muted">{{ unit.label }}</div>
        </div>
      </div>
      <p v-else-if="isOver" class="mt-8 text-2xl font-black uppercase text-gold">
        🏆 Giải đấu đã kết thúc
      </p>
      <p v-else class="mt-8 text-2xl font-black uppercase text-gold">
        🔴 Giải đấu đang diễn ra
      </p>

      <div class="mt-10">
        <CtaButton v-if="isOver" :href="props.tournament.links.youtube">🎬 Xem lại trên YouTube</CtaButton>
        <CtaButton v-else-if="isLive" :href="props.tournament.links.youtube">
          🔴 Xem trực tiếp
        </CtaButton>
        <CtaButton v-else-if="registrationClosed" :href="props.tournament.links.discord">
          💬 Tham gia Discord
        </CtaButton>
        <CtaButton v-else :href="props.tournament.links.discord">▶ Đăng ký ngay</CtaButton>
      </div>
      <p v-if="registrationClosed && !isLive" class="mt-3 text-sm text-cream/70">
        Đã hết hạn đăng ký · theo dõi giải đấu qua Discord
      </p>
    </div>
  </section>
</template>
