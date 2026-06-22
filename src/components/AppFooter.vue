<script setup lang="ts">
import { site } from '@/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gold-dim/20 bg-ink py-10 text-center">
    <div class="mx-auto max-w-2xl px-4">
      <p class="text-xs text-muted">
        © {{ year }} {{ site.name }} - Cộng đồng Age of Empires IV Việt Nam
      </p>
      <p class="mt-2 text-xs text-muted">
        Trang được xây bởi cộng đồng - powered by
        <a
          :href="site.ahaslides.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gold hover:underline"
          >AhaSlides</a
        >
      </p>
    </div>
  </footer>
</template>
