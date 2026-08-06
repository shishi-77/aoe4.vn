<script setup lang="ts">
import BrandIcon from '@/components/BrandIcon.vue'
import { brandButtonClass, type BrandName } from '@/lib/brands'

withDefaults(defineProps<{ href: string; variant?: 'gold' | BrandName }>(), { variant: 'gold' })
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-2 rounded-md px-6 py-3 text-base font-extrabold uppercase tracking-wide shadow-lg transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
    :class="brandButtonClass[variant]"
  >
    <BrandIcon v-if="variant !== 'gold'" :name="variant" />
    <slot />
  </a>
</template>
