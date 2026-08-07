<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AppLayout from '@/components/AppLayout.vue'

// unhead's SSR transform rewrites <html> from its own state and defaults the
// language to "en", discarding the lang="vi" in index.html. Declaring it here
// is what actually ships; vite.config.ts asserts it on every built page.
useHead({ htmlAttrs: { lang: 'vi' } })
</script>

<template>
  <div class="min-h-screen bg-ink font-display text-cream antialiased">
    <AppLayout />
  </div>
</template>
