<script setup lang="ts">
import { lacHong } from '@/data/tournaments/lac-hong'
import HeroSection from '@/components/sections/HeroSection.vue'
import QuickInfoSection from '@/components/sections/QuickInfoSection.vue'
import PrizeSection from '@/components/sections/PrizeSection.vue'
import FormatSection from '@/components/sections/FormatSection.vue'
import MapPoolSection from '@/components/sections/MapPoolSection.vue'
import RulesSection from '@/components/sections/RulesSection.vue'
import CasterSection from '@/components/sections/CasterSection.vue'
import FooterSection from '@/components/sections/FooterSection.vue'
</script>

<template>
  <HeroSection :tournament="lacHong" />
  <QuickInfoSection :tournament="lacHong" />
  <PrizeSection :tournament="lacHong" />
  <FormatSection :tournament="lacHong" />
  <MapPoolSection :tournament="lacHong" />
  <RulesSection :tournament="lacHong" />
  <CasterSection :tournament="lacHong" />
  <FooterSection :tournament="lacHong" />
</template>
