<script setup lang="ts">
import type { Tournament } from '@/data/tournaments'
import SectionTitle from '@/components/SectionTitle.vue'

const props = defineProps<{ tournament: Tournament }>()
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-20">
    <SectionTitle eyebrow="Điều lệ giải đấu" title="Luật & Lưu ý" />
    <div class="grid gap-6 md:grid-cols-3">
      <div class="rounded-xl border border-gold-dim/20 bg-surface p-6">
        <h3 class="mb-3 font-bold text-gold">📌 Luật cơ bản</h3>
        <ul class="space-y-2 text-cream/90">
          <li v-for="rule in props.tournament.rules" :key="rule">• {{ rule }}</li>
        </ul>
      </div>
      <div class="rounded-xl border border-gold-dim/20 bg-surface p-6">
        <h3 class="mb-3 font-bold text-gold">⏳ Hạn đăng ký</h3>
        <p class="text-cream/90">{{ props.tournament.registrationDeadline }}</p>
      </div>
      <div class="rounded-xl border border-gold-dim/20 bg-surface p-6">
        <h3 class="mb-3 font-bold text-gold">⚠️ Lưu ý</h3>
        <ul class="space-y-2 text-cream/90">
          <li v-for="note in props.tournament.notes" :key="note">• {{ note }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
