<script setup lang="ts">
import { tournament } from '@/data/tournament'

const items = [
  { icon: '🎮', label: 'Game', value: tournament.game },
  { icon: '⚔️', label: 'Thể thức', value: tournament.format },
  { icon: '📋', label: 'Hình thức', value: tournament.registrationType },
  { icon: '🎟️', label: 'Phí tham gia', value: tournament.entryFee },
  { icon: '🏛️', label: 'Đơn vị tổ chức', value: tournament.organizer },
]
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-20">
    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <div
        v-for="(item, i) in items"
        :key="item.label"
        class="rounded-xl border border-gold-dim/20 bg-surface p-5 text-center"
        :class="{ 'col-span-2 sm:col-span-1': i === items.length - 1 && items.length % 2 === 1 }"
      >
        <div class="text-3xl">{{ item.icon }}</div>
        <div class="mt-2 text-xs uppercase tracking-wide text-muted">{{ item.label }}</div>
        <div class="mt-1 font-bold text-cream">{{ item.value }}</div>
      </div>
    </div>
  </section>
</template>
