<script setup lang="ts">
import { tournament } from '@/data/tournament'
import SectionTitle from '@/components/SectionTitle.vue'
</script>

<template>
  <section class="py-16">
    <div class="mx-auto max-w-5xl px-4">
      <SectionTitle eyebrow="Thể thức thi đấu" title="4vs4 có Ban / Pick" />
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-xl border border-gold-dim/20 bg-ink p-6">
          <h3 class="text-xl font-bold text-gold">Luật thi đấu</h3>
          <ul class="mt-3 space-y-2 text-cream/90">
            <li>• Thể thức {{ tournament.format }} có ban/pick</li>
            <li>• Format: BO3 (loại trực tiếp)</li>
            <li>• {{ tournament.registrationType }}</li>
          </ul>
        </div>
        <div
          class="flex flex-col justify-center gap-3 rounded-xl border border-gold-dim/20 bg-ink p-6"
        >
          <a
            :href="tournament.links.banPick"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border border-gold px-4 py-3 text-center font-bold text-gold transition hover:bg-gold hover:text-ink"
          >
            🔗 Link Ban / Pick
          </a>
          <a
            :href="tournament.links.mapPool"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-md border border-gold px-4 py-3 text-center font-bold text-gold transition hover:bg-gold hover:text-ink"
          >
            🗺️ Link Map Pool
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
