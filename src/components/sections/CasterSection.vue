<script setup lang="ts">
import { tournament } from '@/data/tournament'
import SectionTitle from '@/components/SectionTitle.vue'
</script>

<template>
  <section class="bg-surface/40 py-20">
    <div class="mx-auto max-w-3xl px-4 text-center">
      <SectionTitle eyebrow="Caster & Bình luận" title="Theo dõi trực tiếp" />
      <p class="text-cream/90">Giải đấu được bình luận bởi Clearman AOE4.</p>
      <a
        :href="tournament.links.youtube"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-6 inline-flex items-center gap-2 rounded-md bg-wine px-6 py-3 font-bold text-cream transition hover:opacity-90"
      >
        🎙️ Xem trên YouTube
      </a>
    </div>
  </section>
</template>
