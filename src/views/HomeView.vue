<script setup lang="ts">
import { lacHong } from '@/data/tournaments/lac-hong'
import HeroSection from '@/components/sections/HeroSection.vue'
import FooterSection from '@/components/sections/FooterSection.vue'
</script>

<template>
  <HeroSection :tournament="lacHong" />
  <FooterSection :tournament="lacHong" />
</template>
