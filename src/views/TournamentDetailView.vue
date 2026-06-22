<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getTournamentBySlug } from '@/data/tournaments'
import { site } from '@/data/site'
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

useHead(() => ({
  title: tournament.value
    ? `${tournament.value.name} - ${site.name}`
    : `Không tìm thấy - ${site.name}`,
  meta: tournament.value
    ? [
        {
          name: 'description',
          content: `${tournament.value.name} - ${tournament.value.format} - ${tournament.value.dateLabel}`,
        },
        { property: 'og:title', content: tournament.value.name },
        { property: 'og:description', content: `${tournament.value.name} - ${tournament.value.format} - ${tournament.value.dateLabel}` },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:image',
          content: `${site.url}${tournament.value.ogImage ?? '/og.jpg'}`,
        },
      ]
    : [],
}))
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
    <p
      v-if="tournament && site.ahaslides.showTournamentHint"
      class="mx-auto max-w-3xl px-4 py-8 text-center text-sm text-muted"
    >
      Tổ chức giải? Tạo poll bình chọn và quiz khán giả trực tiếp với
      <a :href="site.ahaslides.url" target="_blank" rel="noopener noreferrer" class="text-gold hover:underline">AhaSlides</a>.
    </p>
    <FooterSection :tournament="tournament" />
  </template>
  <div v-else class="mx-auto max-w-2xl px-4 py-32 text-center">
    <h1 class="text-3xl font-black text-gold">Không tìm thấy giải đấu</h1>
    <RouterLink to="/tournaments" class="mt-6 inline-block text-cream underline">
      Xem tất cả giải
    </RouterLink>
  </div>
</template>
