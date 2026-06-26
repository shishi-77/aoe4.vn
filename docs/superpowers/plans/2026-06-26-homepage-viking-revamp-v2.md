# Homepage Viking DLC Promo Revamp v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage DLC hero as a filled cinematic Viking diorama (sky/content/sea bands) with cold Nordic palette accents, vector Viking ornamentation, scroll parallax + entrance animation, and a mobile overflow fix.

**Architecture:** The hero is a single `<section>` (`DlcSection.vue`) whose absolute-positioned backdrop (`HeroBackdrop.vue`) provides the sky and sea bands while the section's own flow content forms the middle band. A new `useParallax` composable writes scroll position into a `--scroll` CSS custom property on the section root; backdrop layer wrappers consume it via `calc()`. A new reusable `NorseDivider.vue` SVG ornament is used in the hero and between homepage sections. All motion is CSS-driven and gated behind `prefers-reduced-motion`.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Tailwind CSS v4 (`@theme` tokens in `main.css`), Vitest + `@vue/test-utils` (jsdom), Vite.

## Global Constraints

- Vietnamese for all UI copy and code comments; English only for git branch/commit/PR text.
- No HTML comments inside `<template>` markup (use `//` JS comments in `<script>` or CSS comments).
- Every animation must be disabled under `@media (prefers-reduced-motion: reduce)`, and layout must remain correct (content visible, longship centered) when motion is off.
- All Viking imagery is vector (inline SVG / CSS) — no new raster assets.
- Keep the `--color-wine` token: it is still used by `CasterSection.vue`. Only stop using it in the hero waves.
- Decorative layers stay `aria-hidden="true"`; the ambient key-art `<img>` keeps `alt=""`.
- Run commands with Node 22 (`nvm use 22` if needed) per project setup.

---

### Task 1: Cold palette tokens + recolour hero waves

**Files:**
- Modify: `src/assets/main.css` (`@theme` block ~lines 3-12; `.wave-back` ~line 114-119)

**Interfaces:**
- Produces: CSS tokens `--color-steel` (`#5b8aa6`) and `--color-ice` (`#9fc3d6`), usable as Tailwind utilities `steel`/`ice` (e.g. `text-steel`, `border-ice`, `bg-steel`). `--color-surface` becomes `#14161b`. `.wave-back` uses `--color-steel`.

- [ ] **Step 1: Add the cold tokens and cool the surface**

In `src/assets/main.css`, edit the `@theme` block. Change `--color-surface` and add two tokens after `--color-wine`:

```css
@theme {
  --color-ink: #0c0b09;
  --color-surface: #14161b;
  --color-gold: #e7b955;
  --color-gold-dim: #c79a4b;
  --color-cream: #f5ecd8;
  --color-muted: #9c948a;
  --color-wine: #7a1f1f;
  --color-steel: #5b8aa6;
  --color-ice: #9fc3d6;
  --font-display: 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 2: Recolour the back wave from wine to steel**

In `.wave-back`, change the background colour and nudge opacity so the cold sea reads:

```css
.wave-back {
  height: 190px;
  background-color: var(--color-steel);
  opacity: 0.28;
  animation: wave-drift 24s linear infinite;
}
```

- [ ] **Step 3: Verify wine is no longer used in the hero**

Run: `grep -rn "wine" src/`
Expected: only two hits remain — `src/assets/main.css` (the token definition) and `src/components/sections/CasterSection.vue` (unrelated tournament button). No hit in `main.css` `.wave-back`.

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds (type-check + build-only), no CSS errors.

- [ ] **Step 5: Commit**

```bash
git add src/assets/main.css
git commit -m "feat: add steel/ice palette tokens and cool the hero waves"
```

---

### Task 2: NorseDivider ornament component

**Files:**
- Create: `src/components/NorseDivider.vue`
- Test: `src/components/__tests__/NorseDivider.spec.ts`

**Interfaces:**
- Produces: `NorseDivider.vue` — a prop-less decorative SVG. Root element is `<svg class="norse-divider" aria-hidden="true">`; colour follows `currentColor` (set `text-*` on a parent). Reused in `DlcSection.vue` (Task 5) and `HomeView.vue` (Task 6).

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/NorseDivider.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import NorseDivider from '../NorseDivider.vue'

describe('NorseDivider', () => {
  it('render svg trang trí với class norse-divider', () => {
    const wrapper = mount(NorseDivider)
    expect(wrapper.find('svg.norse-divider').exists()).toBe(true)
  })

  it('ẩn khỏi screen reader', () => {
    const wrapper = mount(NorseDivider)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run NorseDivider`
Expected: FAIL — cannot resolve `../NorseDivider.vue`.

- [ ] **Step 3: Create the component**

Create `src/components/NorseDivider.vue`:

```vue
<script setup lang="ts"></script>

<template>
  <svg
    class="norse-divider mx-auto h-4 w-60 text-gold-dim/60"
    viewBox="0 0 240 16"
    fill="none"
    aria-hidden="true"
    role="presentation"
  >
    <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
      <path d="M8 8 H80" />
      <path d="M160 8 H232" />
      <path d="M92 8 q8 -7 16 0 t16 0 t16 0" />
    </g>
    <circle cx="120" cy="8" r="3" fill="currentColor" />
  </svg>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- --run NorseDivider`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/NorseDivider.vue src/components/__tests__/NorseDivider.spec.ts
git commit -m "feat: add reusable NorseDivider knotwork ornament"
```

---

### Task 3: useParallax composable

**Files:**
- Create: `src/composables/useParallax.ts`
- Test: `src/composables/__tests__/useParallax.spec.ts`

**Interfaces:**
- Produces: `useParallax(): { el: Ref<HTMLElement | null> }`. Bind `el` to a `ref` element. On mount (motion allowed), it writes `window.scrollY` into the `--scroll` custom property on `el` on every scroll; under `prefers-reduced-motion` it does nothing (the property stays unset). Consumed by `DlcSection.vue` (Task 5); backdrop layers read `var(--scroll, 0)` (Task 4).

- [ ] **Step 1: Write the failing test**

Create `src/composables/__tests__/useParallax.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useParallax } from '../useParallax'

const Host = defineComponent({
  setup() {
    const { el } = useParallax()
    return { el }
  },
  template: '<div ref="el"></div>',
})

function setMatchMedia(reduced: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true })
}

afterEach(() => {
  setScrollY(0)
})

describe('useParallax', () => {
  it('ghi scrollY vào --scroll khi cuộn (motion cho phép)', async () => {
    setMatchMedia(false)
    const wrapper = mount(Host)
    setScrollY(120)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.element.style.getPropertyValue('--scroll')).toBe('120')
  })

  it('không ghi gì khi prefers-reduced-motion', async () => {
    setMatchMedia(true)
    const wrapper = mount(Host)
    setScrollY(120)
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.element.style.getPropertyValue('--scroll')).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run useParallax`
Expected: FAIL — cannot resolve `../useParallax`.

- [ ] **Step 3: Create the composable**

Create `src/composables/useParallax.ts`:

```ts
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Ghi vị trí cuộn (px) vào CSS var `--scroll` trên `el`, để các lớp nền hero
 * dịch chuyển parallax bằng calc(). Hero nằm ở đầu trang nên dùng thẳng
 * window.scrollY. Tắt hoàn toàn khi prefers-reduced-motion hoặc không có window.
 */
export function useParallax(): { el: Ref<HTMLElement | null> } {
  const el = ref<HTMLElement | null>(null)
  let onScroll: (() => void) | undefined

  onMounted(() => {
    const node = el.value
    if (!node || typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const update = () => {
      node.style.setProperty('--scroll', `${window.scrollY}`)
    }
    onScroll = update
    update()
    window.addEventListener('scroll', update, { passive: true })
  })

  onUnmounted(() => {
    if (onScroll) window.removeEventListener('scroll', onScroll)
  })

  return { el }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- --run useParallax`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/composables/useParallax.ts src/composables/__tests__/useParallax.spec.ts
git commit -m "feat: add useParallax scroll composable (reduced-motion aware)"
```

---

### Task 4: HeroBackdrop — sky band (aurora + runes), enlarged longship, parallax wrappers

**Files:**
- Modify: `src/components/sections/HeroBackdrop.vue`
- Modify: `src/assets/main.css` (new keyframes + classes after the existing `.snow` block; extend reduced-motion guard)
- Test: `src/components/sections/__tests__/HeroBackdrop.spec.ts`

**Interfaces:**
- Consumes: `--scroll` custom property (set by Task 3 on the hero section; inherited into the backdrop).
- Produces: backdrop markup with `.parallax-sky`, `.aurora`, `.rune` (one or more), and `.parallax-sea` wrapping the waves + ship. Existing hooks `.wave-back`, `.wave-front`, `svg.ship-bob` are preserved. The ship is enlarged and raised.

- [ ] **Step 1: Extend the HeroBackdrop test for new layers**

Replace the body of `src/components/sections/__tests__/HeroBackdrop.spec.ts` with:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HeroBackdrop from '../HeroBackdrop.vue'

describe('HeroBackdrop', () => {
  it('render hai lớp sóng và thuyền longship', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('.wave-back').exists()).toBe(true)
    expect(wrapper.find('.wave-front').exists()).toBe(true)
    expect(wrapper.find('svg.ship-bob').exists()).toBe(true)
  })

  it('render dải trời aurora và ít nhất một rune', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('.aurora').exists()).toBe(true)
    expect(wrapper.findAll('.rune').length).toBeGreaterThan(0)
  })

  it('bọc các lớp trong wrapper parallax sky và sea', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('.parallax-sky').exists()).toBe(true)
    expect(wrapper.find('.parallax-sea').exists()).toBe(true)
  })

  it('lớp trang trí được ẩn khỏi screen reader', () => {
    const wrapper = mount(HeroBackdrop)
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
    expect(wrapper.find('img').attributes('alt')).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run HeroBackdrop`
Expected: FAIL — `.aurora` / `.parallax-sky` not found.

- [ ] **Step 3: Rewrite the HeroBackdrop template**

Replace the contents of `src/components/sections/HeroBackdrop.vue` with:

```vue
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
```

- [ ] **Step 4: Add aurora/rune keyframes, parallax wrappers, and extend the reduced-motion guard**

In `src/assets/main.css`, after the `.snow { ... }` block (around line 69) add:

```css
/* Aurora Bắc Âu: dải sáng steel→ice quét ngang chậm. */
@keyframes aurora-drift {
  0%,
  100% {
    transform: translateX(-6%);
    opacity: 0.5;
  }
  50% {
    transform: translateX(6%);
    opacity: 0.85;
  }
}

.aurora {
  background:
    radial-gradient(60% 80% at 30% 0%, rgba(95, 138, 166, 0.35), transparent 70%),
    radial-gradient(50% 70% at 75% 10%, rgba(159, 195, 214, 0.28), transparent 70%);
  filter: blur(8px);
  animation: aurora-drift 18s ease-in-out infinite;
}

/* Rune phát sáng nhấp nháy, lệch pha qua animation-delay inline. */
@keyframes rune-glow {
  0%,
  100% {
    opacity: 0.25;
    text-shadow: 0 0 6px rgba(159, 195, 214, 0.4);
  }
  50% {
    opacity: 0.8;
    text-shadow: 0 0 14px rgba(159, 195, 214, 0.85);
  }
}

.rune {
  animation: rune-glow 5s ease-in-out infinite;
}

/* Parallax: dải trời trôi chậm xuôi chiều cuộn, dải biển trôi ngược nhẹ. */
.parallax-sky {
  transform: translateY(calc(var(--scroll, 0) * 0.06 * 1px));
  will-change: transform;
}

.parallax-sea {
  transform: translateY(calc(var(--scroll, 0) * -0.04 * 1px));
  will-change: transform;
}
```

Then extend the existing reduced-motion guard (around line 134) to also stop the new layers. Replace the selector list so it reads:

```css
@media (prefers-reduced-motion: reduce) {
  .kenburns,
  .snow,
  .reveal.is-visible,
  .wave-back,
  .wave-front,
  .ship-bob,
  .aurora,
  .rune {
    animation: none;
  }
  .parallax-sky,
  .parallax-sea {
    transform: none;
  }
  .reveal {
    opacity: 1;
  }
  .ship-bob {
    transform: translateX(-50%);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- --run HeroBackdrop`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/HeroBackdrop.vue src/components/sections/__tests__/HeroBackdrop.spec.ts src/assets/main.css
git commit -m "feat: add aurora/runes sky band, larger longship, parallax layers to hero backdrop"
```

---

### Task 5: DlcSection — diorama layout, faction-tinted chips, divider, entrance, parallax wiring, mobile fix

**Files:**
- Modify: `src/components/sections/DlcSection.vue`
- Modify: `src/assets/main.css` (entrance keyframe + `.hero-enter` stagger; extend reduced-motion guard)
- Test: `src/components/sections/__tests__/DlcSection.spec.ts`

**Interfaces:**
- Consumes: `useParallax` (Task 3), `NorseDivider` (Task 2), `--color-steel`/`--color-ice` (Task 1).
- Produces: a hero section that tints civ chips by faction (`Vikings` → gold tone, `Scots` → steel tone via `data-tone` attribute), renders a `NorseDivider`, wraps the countdown in a `grid grid-cols-2 sm:flex` container, applies a responsive H1 scale, and binds the parallax `ref` to the section root.

- [ ] **Step 1: Extend the DlcSection test**

Add these cases inside the existing `describe('DlcSection', ...)` block in `src/components/sections/__tests__/DlcSection.spec.ts` (keep all existing cases unchanged):

```ts
  it('nhuốm màu chip theo phe: Vikings=gold, Scots=steel', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    const chips = wrapper.findAll('[data-testid="civ-chip"]')
    expect(chips[0].attributes('data-tone')).toBe('viking')
    expect(chips[1].attributes('data-tone')).toBe('scot')
  })

  it('render ornament NorseDivider trong hero', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    expect(wrapper.find('svg.norse-divider').exists()).toBe(true)
  })

  it('countdown dùng container grid để wrap trên mobile', () => {
    const wrapper = mount(DlcSection, {
      props: { dlc: makeDlc({ predictedReleaseDate: '2099-01-01T00:00:00+07:00' }) },
    })
    const timer = wrapper.find('[role="timer"]')
    expect(timer.classes()).toContain('grid')
    expect(timer.classes()).toContain('grid-cols-2')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run DlcSection`
Expected: FAIL — `data-tone` undefined / `svg.norse-divider` not found / `grid` class missing.

- [ ] **Step 3: Rewrite DlcSection**

Replace the contents of `src/components/sections/DlcSection.vue` with:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { useParallax } from '@/composables/useParallax'
import type { dlc as DlcType } from '@/data/dlc'
import HeroBackdrop from '@/components/sections/HeroBackdrop.vue'
import NorseDivider from '@/components/NorseDivider.vue'

const props = defineProps<{ dlc: typeof DlcType }>()

const targetDate = computed(() => props.dlc.releaseDate ?? props.dlc.predictedReleaseDate)
const isPredicted = computed(() => !props.dlc.releaseDate && !!props.dlc.predictedReleaseDate)
// showTimer chặn khi không có ngày, nên useCountdown không bao giờ render với chuỗi rỗng/NaN.
const { days, hours, minutes, seconds, isLive } = useCountdown(targetDate.value ?? '')
const showTimer = computed(() => !!targetDate.value && !isLive.value)

const units = computed(() => [
  { value: days.value, label: 'Ngày' },
  { value: hours.value, label: 'Giờ' },
  { value: minutes.value, label: 'Phút' },
  { value: seconds.value, label: 'Giây' },
])

// Phe lạnh (Scots) nhuốm steel, còn lại (Vikings) nhuốm gold ấm.
const toneOf = (civ: string) => (civ === 'Scots' ? 'scot' : 'viking')

// Parallax ghi --scroll lên section để HeroBackdrop dịch lớp theo cuộn.
const { el: heroEl } = useParallax()
</script>

<template>
  <section
    ref="heroEl"
    class="hero-enter relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 pb-40 pt-20 text-center"
  >
    <HeroBackdrop />

    <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">DLC sắp ra mắt</p>
    <h1
      class="max-w-[15ch] break-words text-3xl font-black uppercase leading-tight text-cream drop-shadow-lg sm:max-w-none sm:text-6xl"
    >
      {{ dlc.name }}
    </h1>

    <NorseDivider class="mt-4" />

    <p class="mt-3 text-cream/80">{{ dlc.fullName }}</p>

    <ul class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <li
        v-for="civ in dlc.civs"
        :key="civ"
        data-testid="civ-chip"
        :data-tone="toneOf(civ)"
        class="civ-chip rounded-full border bg-surface/60 px-4 py-1 text-sm font-bold backdrop-blur-sm"
      >
        {{ civ }}
      </li>
    </ul>

    <div
      v-if="showTimer"
      class="mt-8 grid grid-cols-2 place-items-center gap-3 sm:flex sm:items-center sm:justify-center sm:gap-5"
      role="timer"
    >
      <div
        v-for="unit in units"
        :key="unit.label"
        class="w-[72px] rounded-lg bg-surface/80 px-2 py-2 backdrop-blur-sm sm:w-[88px]"
      >
        <div class="text-3xl font-black tabular-nums text-gold sm:text-4xl">
          {{ String(unit.value).padStart(2, '0') }}
        </div>
        <div class="text-xs uppercase tracking-wide text-muted">{{ unit.label }}</div>
      </div>
    </div>
    <p v-if="showTimer && isPredicted" class="mt-3 text-xs uppercase tracking-[0.2em] text-muted">
      (dự kiến) {{ dlc.releaseLabel }}
    </p>
    <p
      v-if="!showTimer"
      class="mt-8 inline-block rounded border border-gold px-6 py-2 text-2xl font-black text-gold"
    >
      Dự kiến {{ dlc.releaseLabel }}
    </p>

    <ul class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <li
        v-for="h in dlc.highlights"
        :key="h"
        class="rounded-lg border border-steel/25 bg-surface/60 px-4 py-2 text-sm text-cream/90 backdrop-blur-sm"
      >
        {{ h }}
      </li>
    </ul>

    <a
      :href="dlc.steamUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="cta-ember mt-8 inline-block rounded-md bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-dim"
    >
      Xem trên Steam
    </a>
  </section>
</template>

<style scoped>
.civ-chip[data-tone='viking'] {
  border-color: rgba(231, 185, 85, 0.5);
  color: var(--color-gold);
}
.civ-chip[data-tone='scot'] {
  border-color: rgba(91, 138, 166, 0.55);
  color: var(--color-ice);
}
</style>
```

- [ ] **Step 4: Add the entrance stagger keyframe and hover ember in main.css**

In `src/assets/main.css`, after the `.parallax-sea { ... }` block (added in Task 4) add:

```css
/* Entrance: các phần tử hero trồi lên so le khi tải. */
@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-enter > :not([class*='absolute']) {
  animation: hero-rise 0.6s ease-out both;
}
.hero-enter > :nth-child(2) {
  animation-delay: 0.08s;
}
.hero-enter > :nth-child(3) {
  animation-delay: 0.16s;
}
.hero-enter > :nth-child(4) {
  animation-delay: 0.24s;
}
.hero-enter > :nth-child(5) {
  animation-delay: 0.32s;
}
.hero-enter > :nth-child(n + 6) {
  animation-delay: 0.4s;
}

/* Ánh lửa quét qua CTA khi hover. */
.cta-ember {
  position: relative;
  overflow: hidden;
}
.cta-ember::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(245, 236, 216, 0.5) 50%, transparent 70%);
  transform: translateX(-120%);
  transition: transform 0.6s ease;
}
.cta-ember:hover::after {
  transform: translateX(120%);
}
```

Then extend the reduced-motion guard (the block edited in Task 4) to also neutralise the entrance and CTA sweep. Add these rules inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
  .hero-enter > * {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .cta-ember::after {
    display: none;
  }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- --run DlcSection`
Expected: PASS (all original + 3 new cases).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/DlcSection.vue src/components/sections/__tests__/DlcSection.spec.ts src/assets/main.css
git commit -m "feat: rebuild DLC hero as diorama with faction chips, entrance, parallax, mobile fix"
```

---

### Task 6: HomeView cohesion pass

**Files:**
- Modify: `src/views/HomeView.vue`
- Test: `src/views/__tests__/HomeView.spec.ts` (create if absent)

**Interfaces:**
- Consumes: `NorseDivider` (Task 2).
- Produces: a `NorseDivider` between the Tournaments and Community sections; the community section gains a subtle steel border accent.

- [ ] **Step 1: Write the failing test**

Create (or extend) `src/views/__tests__/HomeView.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { RouterLinkStub } from '@vue/test-utils'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  it('chèn NorseDivider giữa các section', () => {
    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('svg.norse-divider').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- --run HomeView`
Expected: FAIL — `svg.norse-divider` not found in HomeView.

- [ ] **Step 3: Add the divider and steel accent**

In `src/views/HomeView.vue`, add the import:

```ts
import NorseDivider from '@/components/NorseDivider.vue'
```

Then insert a divider between the tournaments `</section>` and the community `<section>`:

```vue
    <NorseDivider class="mx-auto my-2 text-steel/40" />

    <section
      ref="communityEl"
      class="reveal border-t border-steel/15 bg-surface/40 px-4 py-16"
    >
```

(The community `<section>` already exists — only change its `class` to use `border-steel/15` instead of `border-gold-dim/10`, and add the `<NorseDivider>` line immediately before it.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- --run HomeView`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/HomeView.vue src/views/__tests__/HomeView.spec.ts
git commit -m "feat: add Norse divider and steel accent to homepage sections"
```

---

### Task 7: Full verification (build, lint, suite, visual)

**Files:** none (verification only)

- [ ] **Step 1: Run the full unit suite**

Run: `npm run test -- --run`
Expected: PASS — all spec files green (including the new NorseDivider, useParallax, HeroBackdrop, DlcSection, HomeView cases).

- [ ] **Step 2: Type-check and lint**

Run: `npm run type-check && npm run lint`
Expected: no type errors; eslint passes (auto-fix leaves no remaining errors).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Visual verification via headless screenshots**

Start the preview server and capture desktop + mobile:

```bash
npm run dev -- --port 5188 --strictPort &
sleep 3
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SCRATCH="/private/tmp/claude-501/-Users-shishi-Documents-code-2-aoe4-vn/622fec11-aecd-40b6-93fa-b13a7e21e80f/scratchpad"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1440,2600 --screenshot="$SCRATCH/after-desktop.png" --virtual-time-budget=4000 "http://localhost:5188/"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=390,2200 --screenshot="$SCRATCH/after-mobile.png" --virtual-time-budget=4000 "http://localhost:5188/"
kill %1
```

Confirm by viewing the images:
- Hero has no large empty band; content distributes across sky/content/sea.
- The longship is enlarged and sits directly below the CTA (no ~600px black gap).
- Aurora + runes are visible in the sky band; waves read cold (steel), not wine.
- Mobile: H1 "Raiders of the North" and the countdown (now 2×2 grid) are fully visible — no right-edge clipping.

- [ ] **Step 5: Reduced-motion sanity check**

Capture mobile with reduced motion emulated and confirm the layout is intact (content visible, longship centered, no parallax offset):

```bash
npm run dev -- --port 5188 --strictPort &
sleep 3
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SCRATCH="/private/tmp/claude-501/-Users-shishi-Documents-code-2-aoe4-vn/622fec11-aecd-40b6-93fa-b13a7e21e80f/scratchpad"
"$CHROME" --headless --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --window-size=390,2200 --screenshot="$SCRATCH/after-reduced-motion.png" --virtual-time-budget=4000 "http://localhost:5188/"
kill %1
```

Expected: page renders fully, nothing hidden by un-triggered entrance animation.

- [ ] **Step 6: Final commit (if any lint auto-fixes occurred)**

```bash
git add -A
git commit -m "chore: lint pass for homepage revamp v2" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage:**
- §1 Colour tokens → Task 1 (steel/ice added, surface cooled, waves recoloured; `wine` retained per Global Constraints because `CasterSection.vue` uses it — hero usage removed).
- §2 Hero diorama (sky/content/sea bands) → Task 4 (sky + sea bands, enlarged grounded longship) + Task 5 (content band tightened, `min-h-[92vh]` + reduced padding).
- §3 Vector Viking language (runes, NorseDivider, longship) → Task 2 (divider), Task 4 (runes + longship shields).
- §4 Animation (ambient + parallax + entrance + hover) → Task 3 (parallax composable), Task 4 (aurora/rune ambient + parallax wrappers), Task 5 (entrance stagger + CTA ember). Reduced-motion guard extended in Tasks 4 & 5.
- §5 Responsive/mobile fix → Task 5 (clamped H1 `text-3xl`→`sm:text-6xl` + `break-words`, countdown `grid grid-cols-2 sm:flex`).
- §6 Lower-section cohesion → Task 6 (NorseDivider + steel accent).
- Testing/verification → Task 7.

**Placeholder scan:** No TBD/TODO; every code step shows complete code; every command has expected output.

**Type consistency:** `useParallax()` returns `{ el }` (Task 3) and is consumed as `const { el: heroEl } = useParallax()` (Task 5). `NorseDivider` root is `svg.norse-divider` — asserted in Tasks 2, 5, 6 consistently. `data-tone` values `viking`/`scot` produced in Task 5 match the Task 5 test. `.parallax-sky`/`.parallax-sea` classes produced in Task 4 markup match the Task 4 CSS and `--scroll` from Task 3.

> **Deviation from spec (intentional, see Global Constraints):** the spec said "remove `wine`". Implementation keeps the token because `CasterSection.vue` (out of scope) depends on it; only the hero's use of `wine` is removed. No functional gap.
