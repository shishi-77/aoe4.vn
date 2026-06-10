<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <section class="space-y-4">
    <h1 class="text-3xl font-bold">Chào mừng đến AoE4 VN</h1>
    <p class="text-slate-600">
      Dự án Vue 3 + Vite + TypeScript + Tailwind đã sẵn sàng để phát triển.
    </p>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="rounded-md bg-amber-700 px-4 py-2 text-white transition hover:bg-amber-800"
        @click="counter.increment"
      >
        Đếm: {{ counter.count }}
      </button>
      <span class="text-slate-500">Gấp đôi: {{ counter.doubleCount }}</span>
    </div>
  </section>
</template>
