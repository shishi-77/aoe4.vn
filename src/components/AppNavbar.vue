<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { site } from '@/data/site'
import BrandIcon from '@/components/BrandIcon.vue'
import { trackOutboundClick, type OutboundClickEvent } from '@/lib/analytics'

const open = ref(false)
const toggleButton = ref<HTMLButtonElement | null>(null)
const route = useRoute()

const MENU_ID = 'primary-menu'

/*
 * Tap targets. Every control in the bar is at least 44x44, per WCAG 2.2 SC
 * 2.5.8's comfortable target rather than its 24x24 floor. The bar keeps py-2
 * on mobile so growing the toggle to 44 does not make the sticky header taller
 * and eat viewport; lg renders no toggle, so it keeps the roomier py-3. The
 * menu links only need the extra height while they are a stacked mobile panel,
 * hence the lg:py-0 reset.
 */
const MENU_LINK_CLASS =
  'flex min-h-11 items-center py-2.5 font-bold text-cream hover:text-gold lg:min-h-0 lg:py-0'

// Escape closes the mobile menu and hands focus back to the trigger, so
// keyboard users are not dropped at the top of the document.
function closeMenu() {
  if (!open.value) return
  open.value = false
  toggleButton.value?.focus()
}

// The navbar lives outside RouterView, so it survives navigation: close the
// mobile menu whenever the route changes.
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)

function onJoin(channel: OutboundClickEvent['channel']) {
  trackOutboundClick({ channel, placement: 'header', path: route.path })
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-gold-dim/20 bg-ink/90 backdrop-blur"
    @keydown.esc="closeMenu"
  >
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 lg:py-3">
      <RouterLink to="/" class="flex min-h-11 items-center gap-2">
        <img src="/favicon.webp" alt="" class="h-8 w-8" width="32" height="32" />
        <span class="text-xl font-black uppercase tracking-wider text-gold">AoE4 VN</span>
      </RouterLink>

      <button
        ref="toggleButton"
        class="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-xl leading-none text-cream transition hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:hidden"
        :aria-expanded="open"
        :aria-controls="MENU_ID"
        :aria-label="open ? 'Đóng menu' : 'Mở menu'"
        @click="open = !open"
      >
        {{ open ? '✕' : '☰' }}
      </button>

      <div
        :id="MENU_ID"
        class="absolute left-0 top-full w-full flex-col gap-4 border-b border-gold-dim/20 bg-ink px-4 py-4 lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:py-0"
        :class="open ? 'flex' : 'hidden'"
        @click="open = false"
      >
        <RouterLink to="/faq/" :class="MENU_LINK_CLASS"> Hỏi đáp </RouterLink>
        <RouterLink to="/tournaments/" :class="MENU_LINK_CLASS"> Giải đấu </RouterLink>
        <RouterLink to="/guides/" :class="MENU_LINK_CLASS"> Hướng dẫn </RouterLink>
        <RouterLink to="/news/" :class="MENU_LINK_CLASS"> Tin tức </RouterLink>
        <a
          :href="site.links.blog"
          target="_blank"
          rel="noopener noreferrer"
          :class="MENU_LINK_CLASS"
        >
          Blog ↗
        </a>
        <a
          :href="site.links.facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center gap-2 self-start rounded-md bg-facebook px-4 py-2 font-bold text-white transition hover:bg-facebook-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          @click="onJoin('facebook')"
        >
          <BrandIcon name="facebook" />
          Facebook
        </a>
      </div>
    </nav>
  </header>
</template>
