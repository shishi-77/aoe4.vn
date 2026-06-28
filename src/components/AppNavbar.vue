<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { site } from '@/data/site'

const open = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gold-dim/20 bg-ink/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="flex items-center gap-2">
        <img src="/favicon.webp" alt="" class="h-8 w-8" width="32" height="32" />
        <span class="text-xl font-black uppercase tracking-wider text-gold">AoE4 VN</span>
      </RouterLink>

      <button
        class="text-cream sm:hidden"
        :aria-expanded="open"
        aria-label="Mở menu"
        @click="open = !open"
      >
        ☰
      </button>

      <div
        class="absolute left-0 top-full w-full flex-col gap-4 border-b border-gold-dim/20 bg-ink px-4 py-4 sm:static sm:flex sm:w-auto sm:flex-row sm:items-center sm:border-0 sm:bg-transparent sm:py-0"
        :class="open ? 'flex' : 'hidden'"
      >
        <RouterLink to="/" class="font-bold text-cream hover:text-gold">Trang chủ</RouterLink>
        <RouterLink to="/faq" class="font-bold text-cream hover:text-gold">
          Đế chế 4
        </RouterLink>
        <RouterLink to="/tournaments" class="font-bold text-cream hover:text-gold">
          Giải đấu
        </RouterLink>
        <RouterLink to="/guides" class="font-bold text-cream hover:text-gold">
          Hướng dẫn
        </RouterLink>
        <a
          :href="site.links.blog"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold text-cream hover:text-gold"
        >
          Blog ↗
        </a>
        <a
          :href="site.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md bg-gold px-4 py-2 font-bold text-ink hover:bg-gold-dim"
        >
          Discord
        </a>
      </div>
    </nav>
  </header>
</template>
