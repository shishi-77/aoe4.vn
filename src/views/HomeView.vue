<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { dlc } from '@/data/dlc'
import { guides } from '@/data/guides'
import { tournaments } from '@/data/tournaments'
import { site } from '@/data/site'
import { organizationJsonLd, websiteJsonLd } from '@/lib/structuredData'
import { trackOutboundClick, type OutboundClickEvent } from '@/lib/analytics'
import BrandIcon from '@/components/BrandIcon.vue'
import DlcSection from '@/components/sections/DlcSection.vue'
import NorseDivider from '@/components/NorseDivider.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import TournamentCard from '@/components/TournamentCard.vue'
import { useReveal } from '@/composables/useReveal'

const route = useRoute()

function onJoin(channel: OutboundClickEvent['channel']) {
  trackOutboundClick({ channel, placement: 'homepage', path: route.path })
}

const pageTitle = `${site.name} - Cộng đồng Age of Empires IV Việt Nam`

useHead({
  title: pageTitle,
  link: [{ rel: 'canonical', href: `${site.url}/` }],
  meta: [
    { name: 'description', content: site.description },
    { property: 'og:url', content: `${site.url}/` },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: site.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: pageTitle },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(organizationJsonLd(site)) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(websiteJsonLd(site)) },
  ],
})

const { el: tournamentsEl } = useReveal()
const { el: guidesEl } = useReveal()
const { el: communityEl } = useReveal()
</script>

<template>
  <DlcSection :dlc="dlc" />

  <section ref="tournamentsEl" class="reveal mx-auto max-w-5xl px-4 py-16">
    <SectionTitle title="Giải đấu" />
    <div class="grid gap-4 sm:grid-cols-2">
      <TournamentCard v-for="t in tournaments" :key="t.slug" :tournament="t" />
    </div>
    <div class="mt-8 text-center">
      <RouterLink
        to="/tournaments/"
        class="inline-block rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
      >
        Xem tất cả giải
      </RouterLink>
    </div>
  </section>

  <NorseDivider class="mx-auto my-2 text-steel/40" />

  <section ref="guidesEl" class="reveal mx-auto max-w-5xl px-4 py-16">
    <SectionTitle eyebrow="Bắt đầu" title="Hướng dẫn" />
    <ul class="grid gap-3 sm:grid-cols-2">
      <li v-for="g in guides" :key="g.slug">
        <RouterLink
          :to="`/guides/${g.slug}/`"
          class="block rounded-md border border-steel/15 bg-surface/40 px-4 py-3 font-bold text-cream transition hover:border-gold hover:text-gold"
        >
          {{ g.title }}
        </RouterLink>
      </li>
    </ul>
    <div class="mt-8 text-center">
      <RouterLink
        to="/guides/"
        class="inline-block rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
      >
        Xem tất cả hướng dẫn
      </RouterLink>
    </div>
  </section>

  <NorseDivider class="mx-auto my-2 text-steel/40" />

  <section
    ref="communityEl"
    class="reveal border-t border-steel/15 bg-surface/40 px-4 py-16"
  >
    <div class="mx-auto max-w-3xl text-center">
      <SectionTitle eyebrow="Tham gia" title="Cộng đồng Đế chế 4 Việt Nam" />
      <p class="text-cream/85">
        Nơi quy tụ người chơi Đế chế 4 tại Việt Nam - giải đấu và tin tức.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-4">
        <a
          :href="site.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-discord px-6 py-3 font-bold text-white transition hover:bg-discord-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          @click="onJoin('discord')"
        >
          <BrandIcon name="discord" />
          Discord
        </a>
        <a
          :href="site.links.facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-facebook px-6 py-3 font-bold text-white transition hover:bg-facebook-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          @click="onJoin('facebook')"
        >
          <BrandIcon name="facebook" />
          Facebook Group
        </a>
        <a
          :href="site.links.youtube"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-youtube px-6 py-3 font-bold text-white transition hover:bg-youtube-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <BrandIcon name="youtube" />
          YouTube
        </a>
        <a
          :href="site.links.blog"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Blog
        </a>
      </div>
    </div>
  </section>
</template>
