<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'

const MAIN_ID = 'main-content'

// The plain `href="#main-content"` keeps the skip link working in the
// pre-rendered HTML before hydration; once Vue is live we move focus
// ourselves so the hash never lands in the router history.
function skipToMain(event: MouseEvent) {
  const main = document.getElementById(MAIN_ID)
  if (!main) return
  event.preventDefault()
  // focus() scrolls the target into view on its own; scroll-mt clears the
  // sticky navbar so the first line of content is not hidden underneath it.
  main.focus()
}
</script>

<template>
  <a
    :href="`#${MAIN_ID}`"
    class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
    @click="skipToMain"
  >
    Bỏ qua tới nội dung chính
  </a>
  <AppNavbar />
  <main :id="MAIN_ID" tabindex="-1" class="scroll-mt-20 focus:outline-none">
    <RouterView />
  </main>
  <AppFooter />
</template>
