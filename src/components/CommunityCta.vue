<script setup lang="ts">
import { site } from '@/data/site'
import CtaButton from '@/components/CtaButton.vue'
</script>

<template>
  <div class="mt-12 rounded-xl border border-gold-dim/20 bg-surface px-6 py-10 text-center">
    <h2 class="text-2xl font-black uppercase text-cream">Tham gia cộng đồng AoE4 Việt Nam</h2>
    <p class="mx-auto mt-3 max-w-xl text-muted">
      Giao lưu, tìm đồng đội và hỏi đáp cùng người chơi Đế chế 4 trong nước.
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
      <CtaButton v-if="site.links.facebook" :href="site.links.facebook">Facebook Group</CtaButton>
      <CtaButton :href="site.links.discord">Discord</CtaButton>
    </div>
  </div>
</template>
