<script setup lang="ts">
import { tournament } from '@/data/tournament'
import CtaButton from '@/components/CtaButton.vue'
</script>

<template>
  <footer class="border-t border-gold-dim/20 bg-ink py-16 text-center">
    <div class="mx-auto max-w-2xl px-4">
      <h2 class="text-3xl font-black uppercase text-cream">Sẵn sàng tham chiến?</h2>
      <p class="mt-3 text-cream/80">Đăng ký miễn phí — BTC sẽ ghép đội cho bạn.</p>
      <div class="mt-6">
        <CtaButton :href="tournament.links.discord">▶ Đăng ký qua Discord</CtaButton>
      </div>
      <p class="mt-10 text-sm text-muted">
        Liên hệ BTC:
        <a
          :href="tournament.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gold hover:underline"
          >Discord</a
        >
      </p>
      <p class="mt-2 text-xs text-muted">
        © 2026 {{ tournament.organizer }} · {{ tournament.name }}
      </p>
    </div>
  </footer>
</template>
