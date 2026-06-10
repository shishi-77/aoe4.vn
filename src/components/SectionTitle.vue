<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string }>()
</script>

<template>
  <div class="mb-10 text-center">
    <p
      v-if="eyebrow"
      class="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-gold-dim"
    >
      {{ eyebrow }}
    </p>
    <h2 class="text-3xl font-black uppercase text-cream sm:text-4xl">{{ title }}</h2>
    <div class="mx-auto mt-3 h-1 w-16 bg-gold"></div>
  </div>
</template>
