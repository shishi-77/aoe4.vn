<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { site } from '@/data/site'
import { faqItems } from '@/data/faq'

const pageUrl = `${site.url}/faq/`
const title = 'Đế chế 4 (Age of Empires IV) là gì? Câu hỏi thường gặp'
const description =
  'Giải đáp nhanh cho người chơi Đế chế: Đế chế 4 là gì, có giống Đế chế không, giá, cấu hình và cách bắt đầu - kèm cộng đồng AoE4 Việt Nam.'

const faqJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

useHead({
  title: `${title} - ${site.name}`,
  link: [{ rel: 'canonical', href: pageUrl }],
  meta: [
    { name: 'description', content: description },
    { property: 'og:url', content: pageUrl },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
  ],
  script: [{ type: 'application/ld+json', innerHTML: faqJsonLd }],
})
</script>

<template>
  <article class="mx-auto max-w-3xl px-4 py-16">
    <header class="text-center">
      <p class="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-gold-dim">Đế chế 4 · AoE4</p>
      <h1 class="text-3xl font-black uppercase text-cream sm:text-4xl">
        Đế chế 4 là gì? Câu hỏi thường gặp
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-muted">
        Bạn chơi Đế chế và tò mò về "Đế chế 4"? Đây là những giải đáp nhanh dành riêng cho người Việt
        mới tìm hiểu Age of Empires IV.
      </p>
      <div class="mx-auto mt-4 h-1 w-16 bg-gold"></div>
    </header>

    <div class="mt-12 space-y-8">
      <section v-for="item in faqItems" :key="item.question">
        <h2 class="text-xl font-bold text-gold">{{ item.question }}</h2>
        <p class="mt-2 leading-relaxed text-cream/90">{{ item.answer }}</p>
      </section>
    </div>

    <p class="mt-10 text-center text-muted">
      Muốn tìm hiểu sâu hơn?
      <a
        :href="site.links.blog"
        target="_blank"
        rel="noopener noreferrer"
        class="text-gold hover:underline"
      >
        Đọc các bài viết chi tiết trên blog ↗
      </a>
    </p>

    <div class="mt-12 rounded-xl border border-gold-dim/20 bg-surface px-6 py-10 text-center">
      <h2 class="text-2xl font-black uppercase text-cream">Tham gia cộng đồng AoE4 Việt Nam</h2>
      <p class="mx-auto mt-3 max-w-xl text-muted">
        Giao lưu, tìm đồng đội và hỏi đáp cùng người chơi Đế chế 4 trong nước.
      </p>
      <div class="mt-6 flex flex-wrap items-center justify-center gap-4">
        <a
          v-if="site.links.facebook"
          :href="site.links.facebook"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-base font-extrabold uppercase tracking-wide text-ink shadow-lg shadow-gold/20 transition hover:bg-cream hover:shadow-gold/40"
        >
          Facebook Group
        </a>
        <a
          :href="site.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-base font-extrabold uppercase tracking-wide text-ink shadow-lg shadow-gold/20 transition hover:bg-cream hover:shadow-gold/40"
        >
          Discord
        </a>
      </div>
    </div>
  </article>
</template>
