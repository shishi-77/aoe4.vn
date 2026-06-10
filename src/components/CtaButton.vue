<script setup lang="ts">
defineProps<{ href: string }>()
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-base font-extrabold uppercase tracking-wide text-ink shadow-lg shadow-gold/20 transition hover:bg-cream hover:shadow-gold/40"
  >
    <slot />
  </a>
</template>
