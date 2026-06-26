<script setup lang="ts">
// Lớp nền trang trí cho hero DLC: ảnh key art mờ, gradient bầu trời→biển,
// sóng biển trôi, thuyền longship Viking nhấp nhô, và tuyết/tàn lửa rơi.
// Mọi chuyển động đều tắt dưới prefers-reduced-motion (xem main.css).
import heroArt from '@/assets/imgs/raiders-of-the-north-hero.jpg'
</script>

<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- Ảnh key art mờ tạo không khí (zoom chậm Ken Burns) -->
    <img
      :src="heroArt"
      alt=""
      class="kenburns absolute inset-0 h-full w-full scale-105 object-cover opacity-40 blur-2xl"
    />

    <!-- Gradient bầu trời tối dần xuống mặt biển -->
    <div class="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink/95"></div>

    <!-- Sóng lớp sau -->
    <div class="wave wave-back"></div>

    <!-- Thuyền longship Viking nhấp nhô trên sóng -->
    <svg
      class="ship-bob absolute bottom-[64px] left-1/2 w-[200px] -translate-x-1/2 text-gold-dim/35 sm:bottom-[84px] sm:w-[280px]"
      viewBox="0 0 260 160"
      fill="none"
    >
      <g fill="currentColor">
        <!-- thân thuyền -->
        <path d="M14,92 Q130,108 246,92 Q224,150 130,150 Q36,150 14,92 Z" />
        <!-- đuôi thuyền cuộn -->
        <path d="M16,92 q-12,-22 4,-40 q0,16 10,22 q-12,4 -14,18 z" />
        <!-- mũi thuyền + đầu rồng -->
        <path
          d="M246,92 c14,-24 10,-46 -2,-64 c16,6 22,26 12,44 c10,-4 16,-14 16,-26 c6,16 -2,34 -18,42 c8,4 18,2 24,-6 c-6,18 -24,22 -44,18 z"
        />
        <!-- cột buồm -->
        <rect x="126" y="20" width="7" height="74" />
        <!-- buồm -->
        <path d="M72,30 q58,-12 116,0 v54 q-58,12 -116,0 z" />
        <!-- khiên dọc mạn thuyền -->
        <circle cx="66" cy="98" r="7" />
        <circle cx="94" cy="102" r="7" />
        <circle cx="130" cy="104" r="7" />
        <circle cx="166" cy="102" r="7" />
        <circle cx="194" cy="98" r="7" />
      </g>
      <!-- sọc dọc trên buồm -->
      <g class="text-ink" stroke="currentColor" stroke-width="7" opacity="0.45">
        <line x1="98" y1="27" x2="98" y2="89" />
        <line x1="122" y1="25" x2="122" y2="91" />
        <line x1="146" y1="25" x2="146" y2="91" />
        <line x1="170" y1="27" x2="170" y2="89" />
      </g>
    </svg>

    <!-- Sóng lớp trước (thuyền nằm giữa hai lớp sóng) -->
    <div class="wave wave-front"></div>

    <!-- Tuyết / tàn lửa rơi -->
    <div class="snow absolute inset-0"></div>
  </div>
</template>
