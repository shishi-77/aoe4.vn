<script setup lang="ts">
// Lớp nền trang trí cho hero DLC, xếp thành 3 dải parallax:
//  - dải TRỜI (.parallax-sky): key art mờ, aurora Bắc Âu, rune phát sáng
//  - dải BIỂN (.parallax-sea): sóng 2 lớp + longship lớn nhấp nhô
//  - tuyết/tàn lửa phủ trên cùng
// Parallax đọc CSS var --scroll do useParallax ghi trên section cha.
// Mọi chuyển động tắt dưới prefers-reduced-motion (xem main.css).
import heroArt from '@/assets/imgs/raiders-of-the-north-hero.jpg'

const runes = ['ᚱ', 'ᚨ', 'ᛁ', 'ᛞ', 'ᛖ', 'ᚾ']
const runePositions = [
  { top: '14%', left: '12%', size: '2rem', delay: '0s' },
  { top: '22%', left: '82%', size: '2.6rem', delay: '1.4s' },
  { top: '34%', left: '28%', size: '1.6rem', delay: '2.8s' },
  { top: '12%', left: '60%', size: '1.8rem', delay: '0.7s' },
  { top: '40%', left: '70%', size: '2.2rem', delay: '2.1s' },
  { top: '46%', left: '46%', size: '1.4rem', delay: '3.5s' },
]
</script>

<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div class="parallax-sky absolute inset-0">
      <img
        :src="heroArt"
        alt=""
        class="kenburns absolute inset-0 h-full w-full scale-105 object-cover opacity-40 blur-2xl"
      />
      <div class="aurora absolute inset-x-0 top-0 h-2/3"></div>
      <span
        v-for="(r, i) in runePositions"
        :key="i"
        class="rune absolute font-black text-ice/70"
        :style="{ top: r.top, left: r.left, fontSize: r.size, animationDelay: r.delay }"
        >{{ runes[i] }}</span
      >
    </div>

    <div class="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink/95"></div>

    <div class="parallax-sea absolute inset-0">
      <div class="wave wave-back"></div>

      <svg
        class="ship-bob absolute bottom-[40px] left-1/2 w-[260px] -translate-x-1/2 text-steel/45 sm:bottom-[56px] sm:w-[360px]"
        viewBox="0 0 260 160"
        fill="none"
      >
        <g fill="currentColor">
          <path d="M14,92 Q130,108 246,92 Q224,150 130,150 Q36,150 14,92 Z" />
          <path d="M16,92 q-12,-22 4,-40 q0,16 10,22 q-12,4 -14,18 z" />
          <path
            d="M246,92 c14,-24 10,-46 -2,-64 c16,6 22,26 12,44 c10,-4 16,-14 16,-26 c6,16 -2,34 -18,42 c8,4 18,2 24,-6 c-6,18 -24,22 -44,18 z"
          />
          <rect x="126" y="20" width="7" height="74" />
          <path d="M72,30 q58,-12 116,0 v54 q-58,12 -116,0 z" />
          <circle cx="66" cy="98" r="8" />
          <circle cx="94" cy="102" r="8" />
          <circle cx="130" cy="104" r="8" />
          <circle cx="166" cy="102" r="8" />
          <circle cx="194" cy="98" r="8" />
        </g>
        <g class="text-ice" stroke="currentColor" stroke-width="2" opacity="0.5">
          <circle cx="66" cy="98" r="8" fill="none" />
          <circle cx="94" cy="102" r="8" fill="none" />
          <circle cx="130" cy="104" r="8" fill="none" />
          <circle cx="166" cy="102" r="8" fill="none" />
          <circle cx="194" cy="98" r="8" fill="none" />
        </g>
        <g class="text-ink" stroke="currentColor" stroke-width="7" opacity="0.45">
          <line x1="98" y1="27" x2="98" y2="89" />
          <line x1="122" y1="25" x2="122" y2="91" />
          <line x1="146" y1="25" x2="146" y2="91" />
          <line x1="170" y1="27" x2="170" y2="89" />
        </g>
      </svg>

      <div class="wave wave-front"></div>
    </div>

    <div class="snow absolute inset-0"></div>
  </div>
</template>
