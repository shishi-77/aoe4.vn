<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <nav class="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
        <span class="text-lg font-bold text-amber-700">AoE4 VN</span>
        <RouterLink to="/" class="hover:text-amber-700">Trang chủ</RouterLink>
        <RouterLink to="/about" class="hover:text-amber-700">Giới thiệu</RouterLink>
      </nav>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
