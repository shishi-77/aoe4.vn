<script setup lang="ts">
import { brandIconPaths, type BrandName } from '@/lib/brands'

defineProps<{ name: BrandName }>()
</script>

<template>
  <svg
    class="h-[1.15em] w-[1.15em] shrink-0"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="brandIconPaths[name]" />
  </svg>
</template>
