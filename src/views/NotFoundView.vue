<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { site } from '@/data/site'

useHead({
  title: `Không tìm thấy - ${site.name}`,
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: 'Trang bạn tìm không tồn tại.' },
    { property: 'og:title', content: `Không tìm thấy - ${site.name}` },
    { property: 'og:description', content: 'Trang bạn tìm không tồn tại.' },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-32 text-center">
    <h1 class="text-5xl font-black text-gold">404</h1>
    <p class="mt-4 text-cream">Trang không tồn tại.</p>
    <RouterLink to="/" class="mt-6 inline-block text-cream underline">Về trang chủ</RouterLink>
  </section>
</template>
