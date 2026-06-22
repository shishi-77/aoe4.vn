<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getTournamentBySlug } from '@/data/tournaments'
import HeroSection from '@/components/sections/HeroSection.vue'
import QuickInfoSection from '@/components/sections/QuickInfoSection.vue'
import PrizeSection from '@/components/sections/PrizeSection.vue'
import FormatSection from '@/components/sections/FormatSection.vue'
import MapPoolSection from '@/components/sections/MapPoolSection.vue'
import RulesSection from '@/components/sections/RulesSection.vue'
import CasterSection from '@/components/sections/CasterSection.vue'
import FooterSection from '@/components/sections/FooterSection.vue'

const route = useRoute()
const tournament = computed(() => getTournamentBySlug(String(route.params.slug)))
</script>

<template>
  <template v-if="tournament">
    <HeroSection :tournament="tournament" />
    <QuickInfoSection :tournament="tournament" />
    <PrizeSection :tournament="tournament" />
    <FormatSection :tournament="tournament" />
    <MapPoolSection :tournament="tournament" />
    <RulesSection :tournament="tournament" />
    <CasterSection :tournament="tournament" />
    <FooterSection :tournament="tournament" />
  </template>
  <div v-else class="mx-auto max-w-2xl px-4 py-32 text-center">
    <h1 class="text-3xl font-black text-gold">Không tìm thấy giải đấu</h1>
    <RouterLink to="/tournaments" class="mt-6 inline-block text-cream underline">
      Xem tất cả giải
    </RouterLink>
  </div>
</template>
