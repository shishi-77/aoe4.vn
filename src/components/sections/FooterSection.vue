<script setup lang="ts">
import type { Tournament } from '@/data/tournaments'
import CtaButton from '@/components/CtaButton.vue'
import { site } from '@/data/site'

const props = defineProps<{ tournament: Tournament }>()

const registrationClosed = Date.now() >= new Date(props.tournament.registrationClosesAt).getTime()
</script>

<template>
  <footer class="border-t border-gold-dim/20 bg-ink py-20 text-center">
    <div class="mx-auto max-w-2xl px-4">
      <h2 class="text-3xl font-black uppercase text-cream">Sẵn sàng tham chiến?</h2>
      <p v-if="registrationClosed" class="mt-3 text-cream/80">
        Đã hết hạn đăng ký · tham gia Discord để theo dõi giải đấu và nhận thông báo.
      </p>
      <p v-else class="mt-3 text-cream/80">Đăng ký miễn phí · BTC sẽ ghép đội cho bạn.</p>
      <div class="mt-6">
        <CtaButton v-if="registrationClosed" :href="props.tournament.links.discord">
          💬 Tham gia Discord
        </CtaButton>
        <CtaButton v-else :href="props.tournament.links.discord">▶ Đăng ký qua Discord</CtaButton>
      </div>
      <p class="mt-10 text-sm text-muted">
        Liên hệ BTC:
        <a
          :href="props.tournament.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gold hover:underline"
          >Discord</a
        >
        ·
        <a
          :href="props.tournament.venue.mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gold hover:underline"
          >Chỉ đường tới {{ props.tournament.venue.name }}</a
        >
      </p>
      <p class="mt-2 text-xs text-muted">
        © 2026 {{ props.tournament.organizer }} · {{ props.tournament.name }}
      </p>
      <p class="mt-4 text-center text-xs text-muted">
        Trang được xây bởi cộng đồng - powered by
        <a :href="site.ahaslides.url" target="_blank" rel="noopener noreferrer" class="text-gold hover:underline">AhaSlides</a>
      </p>
    </div>
  </footer>
</template>
