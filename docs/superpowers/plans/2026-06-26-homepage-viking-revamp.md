# Homepage Viking Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Làm mới trang chủ aoe4.vn với hero DLC Viking sinh động (ảnh key art + motion CSS), đồng hồ đếm ngược sống tới ngày dự đoán 10/11/2026, và polish nhẹ cho hai phần dưới.

**Architecture:** Treatment một-trang thuần Vue 3 + Tailwind v4 + CSS, không thêm dependency. Hero = ảnh nền (Ken Burns) phủ gradient + lớp tuyết CSS, countdown bật nhờ trường dữ liệu `predictedReleaseDate` mới (tách khỏi `releaseDate` chính thức). Hai phần dưới dùng lại `SectionTitle` và một composable `useReveal` (IntersectionObserver) cho hiệu ứng fade-up khi cuộn.

**Tech Stack:** Vue 3 (`<script setup>` + TS), Tailwind CSS v4 (theme token trong `src/assets/main.css`), Vite, Vitest + `@vue/test-utils`.

## Global Constraints

- **Node 22 bắt buộc** cho `build`/`test` (Node 16 mặc định làm vỡ `@tailwindcss/oxide`). Phiên hiện tại đã là v22.23.0; nếu shell mới báo Node 16 thì chạy `export PATH="$HOME/.nvm/versions/node/v22.22.3/bin:$PATH"` trước.
- **Không thêm dependency mới** (không thư viện animation/canvas).
- **Mọi animation phải tắt** dưới `@media (prefers-reduced-motion: reduce)`.
- **Không gây layout shift:** ảnh có `width`/`height` cố định; số countdown dùng `tabular-nums`.
- **Tiếng Việt** cho mọi chữ hiển thị trên UI (giữ nguyên giọng văn hiện có).
- **Git tiếng Anh:** commit message bằng tiếng Anh; cuối mỗi commit thêm dòng `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- **`docs/` bị gitignore** — khi commit file kế hoạch/spec phải dùng `git add -f`.
- Đang ở nhánh `feature/homepage-viking-revamp`. Tất cả task commit trên nhánh này.

---

## File Structure

| File | Trách nhiệm | Hành động |
| --- | --- | --- |
| `src/data/dlc.ts` | Thêm `predictedReleaseDate` | Modify |
| `src/data/__tests__/shared-data.spec.ts` | Assert trường mới | Modify |
| `src/composables/useReveal.ts` | IntersectionObserver fade-up | Create |
| `src/composables/__tests__/useReveal.spec.ts` | Test composable | Create |
| `src/assets/main.css` | Keyframes + reduced-motion | Modify |
| `src/assets/imgs/raiders-of-the-north-hero.jpg` | Ảnh key art hero | Create (tải về) |
| `src/components/sections/DlcSection.vue` | Hero Viking | Rewrite |
| `src/components/sections/__tests__/DlcSection.spec.ts` | Test hero | Modify |
| `src/components/TournamentCard.vue` | Hover-lift | Modify |
| `src/views/HomeView.vue` | SectionTitle + reveal + YouTube | Modify |

---

## Task 1: Trường ngày dự đoán trong dữ liệu DLC

**Files:**
- Modify: `src/data/dlc.ts`
- Test: `src/data/__tests__/shared-data.spec.ts`

**Interfaces:**
- Produces: `dlc.predictedReleaseDate: string | null` = `'2026-11-10T00:00:00+07:00'`. Các task sau đếm ngược tới `dlc.releaseDate ?? dlc.predictedReleaseDate`.

- [ ] **Step 1: Viết test thất bại**

Trong `src/data/__tests__/shared-data.spec.ts`, thêm test mới vào `describe('shared data integrity', ...)`:

```ts
  it('dlc có ngày dự đoán hợp lệ (ISO +07:00)', () => {
    expect(dlc.predictedReleaseDate).toBe('2026-11-10T00:00:00+07:00')
    expect(Number.isNaN(Date.parse(dlc.predictedReleaseDate ?? ''))).toBe(false)
  })
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/data/__tests__/shared-data.spec.ts`
Expected: FAIL — `dlc.predictedReleaseDate` là `undefined` (property không tồn tại).

- [ ] **Step 3: Thêm trường vào dữ liệu**

Trong `src/data/dlc.ts`, ngay sau dòng `releaseDate: null as string | null,` thêm:

```ts
  /** Ngày dự đoán để bật countdown trước khi Microsoft công bố ngày chính thức. */
  predictedReleaseDate: '2026-11-10T00:00:00+07:00' as string | null,
```

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `npx vitest run src/data/__tests__/shared-data.spec.ts`
Expected: PASS (toàn bộ file xanh).

- [ ] **Step 5: Commit**

```bash
git add src/data/dlc.ts src/data/__tests__/shared-data.spec.ts
git commit -m "feat: add predicted release date to DLC data

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Composable `useReveal` (fade-up khi cuộn)

**Files:**
- Create: `src/composables/useReveal.ts`
- Test: `src/composables/__tests__/useReveal.spec.ts`

**Interfaces:**
- Produces: `useReveal(): { el: Ref<HTMLElement | null> }`. Gắn `el` vào một phần tử có class `reveal`; khi phần tử vào viewport, composable thêm class `is-visible` rồi `unobserve`. Nếu môi trường không có `IntersectionObserver`, thêm `is-visible` ngay (degrade an toàn).

- [ ] **Step 1: Viết test thất bại**

Tạo `src/composables/__tests__/useReveal.spec.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useReveal } from '@/composables/useReveal'

type IOCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void

describe('useReveal', () => {
  let lastCallback: IOCallback | undefined
  let observed: Element[]
  let unobserved: Element[]

  beforeEach(() => {
    observed = []
    unobserved = []
    lastCallback = undefined
    class FakeIO {
      constructor(cb: IOCallback) {
        lastCallback = cb
      }
      observe(node: Element) {
        observed.push(node)
      }
      unobserve(node: Element) {
        unobserved.push(node)
      }
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', FakeIO)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function mountHost() {
    const Host = defineComponent({
      setup() {
        const { el } = useReveal()
        return () => h('div', { ref: el, class: 'reveal' })
      },
    })
    return mount(Host, { attachTo: document.body })
  }

  it('observe phần tử khi mount', () => {
    const wrapper = mountHost()
    expect(observed.length).toBe(1)
    expect(observed[0]).toBe(wrapper.element)
    wrapper.unmount()
  })

  it('thêm is-visible và unobserve khi phần tử vào viewport', () => {
    const wrapper = mountHost()
    lastCallback?.([{ isIntersecting: true, target: wrapper.element }])
    expect(wrapper.element.classList.contains('is-visible')).toBe(true)
    expect(unobserved).toContain(wrapper.element)
    wrapper.unmount()
  })

  it('không thêm is-visible khi chưa giao nhau', () => {
    const wrapper = mountHost()
    lastCallback?.([{ isIntersecting: false, target: wrapper.element }])
    expect(wrapper.element.classList.contains('is-visible')).toBe(false)
    wrapper.unmount()
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/composables/__tests__/useReveal.spec.ts`
Expected: FAIL — không import được `useReveal` (file chưa tồn tại).

- [ ] **Step 3: Viết composable tối thiểu**

Tạo `src/composables/useReveal.ts`:

```ts
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Gắn `el` vào phần tử có class `reveal`. Khi phần tử vào viewport, thêm class
 * `is-visible` (kích hoạt hiệu ứng fade-up trong CSS) rồi ngừng theo dõi.
 * Nếu không có IntersectionObserver, hiện ngay.
 */
export function useReveal(): { el: Ref<HTMLElement | null> } {
  const el = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const node = el.value
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
  })

  onUnmounted(() => observer?.disconnect())

  return { el }
}
```

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `npx vitest run src/composables/__tests__/useReveal.spec.ts`
Expected: PASS (cả 3 test).

- [ ] **Step 5: Commit**

```bash
git add src/composables/useReveal.ts src/composables/__tests__/useReveal.spec.ts
git commit -m "feat: add useReveal scroll-reveal composable

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Keyframes + reduced-motion trong CSS

**Files:**
- Modify: `src/assets/main.css`

**Interfaces:**
- Produces các class CSS dùng ở task sau: `.kenburns` (zoom chậm ảnh nền), `.snow` (lớp hạt trôi), `.reveal` + `.reveal.is-visible` (fade-up). Tất cả tắt dưới `prefers-reduced-motion: reduce`.

> Task này thuần CSS, không có unit test runner cho keyframes. "Test" = `npm run build` xanh ở Step cuối và mắt thường khi chạy dev. Vẫn commit độc lập vì là nền tảng cho Task 4–5.

- [ ] **Step 1: Thêm keyframes và class vào cuối `src/assets/main.css`**

Thêm vào cuối file (sau block `body { ... }`):

```css
/* ---- Hiệu ứng trang chủ ---- */
@keyframes kenburns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.12);
  }
}

@keyframes snowfall {
  from {
    background-position:
      0 0,
      0 0;
  }
  to {
    background-position:
      0 680px,
      0 980px;
  }
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.kenburns {
  animation: kenburns 22s ease-in-out infinite alternate;
}

.snow {
  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(245, 236, 216, 0.5), transparent),
    radial-gradient(1.5px 1.5px at 70% 60%, rgba(245, 236, 216, 0.35), transparent);
  background-size:
    340px 340px,
    220px 220px;
  animation: snowfall 14s linear infinite;
}

.reveal {
  opacity: 0;
}

.reveal.is-visible {
  animation: reveal-up 0.6s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .kenburns,
  .snow,
  .reveal.is-visible {
    animation: none;
  }
  .reveal {
    opacity: 1;
  }
}
```

- [ ] **Step 2: Xác nhận build CSS không lỗi**

Run: `npm run build`
Expected: build thành công (Vite + vite-ssg hoàn tất, không lỗi PostCSS/Tailwind).

- [ ] **Step 3: Commit**

```bash
git add src/assets/main.css
git commit -m "feat: add homepage motion keyframes with reduced-motion guard

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Tải ảnh key art Viking

**Files:**
- Create: `src/assets/imgs/raiders-of-the-north-hero.jpg`

**Interfaces:**
- Produces asset `@/assets/imgs/raiders-of-the-north-hero.jpg` để Task 5 `import`.

> **Fallback bắt buộc đọc:** nếu cả hai lệnh tải đều thất bại (CDN chặn/404), **bỏ qua việc tạo file ảnh** và đánh dấu để Task 5 dùng nhánh "không ảnh" (xóa phần `import heroArt` + thẻ `<img>`). Hero vẫn sinh động nhờ gradient + snow + SVG. Ghi rõ trong commit/PR rằng chưa có key art.

- [ ] **Step 1: Tải ảnh key art chính thức từ Steam CDN (app id 4336170)**

```bash
curl -fsSL -o src/assets/imgs/raiders-of-the-north-hero.jpg \
  "https://cdn.cloudflare.steamstatic.com/steam/apps/4336170/library_hero.jpg" \
  || curl -fsSL -o src/assets/imgs/raiders-of-the-north-hero.jpg \
  "https://cdn.cloudflare.steamstatic.com/steam/apps/4336170/page_bg_generated_v6b.jpg"
```

- [ ] **Step 2: Kiểm tra file tải về hợp lệ (là ảnh, kích thước > 10KB)**

```bash
file src/assets/imgs/raiders-of-the-north-hero.jpg && \
  test "$(wc -c < src/assets/imgs/raiders-of-the-north-hero.jpg)" -gt 10000 && echo OK
```
Expected: `... JPEG image data ...` và in `OK`.
Nếu in lỗi hoặc không phải JPEG → kích hoạt **Fallback** ở đầu task: xóa file rỗng (`rm -f src/assets/imgs/raiders-of-the-north-hero.jpg`) và chuyển sang Task 5 nhánh không-ảnh.

- [ ] **Step 3: Commit (chỉ khi có ảnh hợp lệ)**

```bash
git add src/assets/imgs/raiders-of-the-north-hero.jpg
git commit -m "assets: add Raiders of the North key art for hero

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Viết lại hero `DlcSection.vue`

**Files:**
- Rewrite: `src/components/sections/DlcSection.vue`
- Test: `src/components/sections/__tests__/DlcSection.spec.ts`

**Interfaces:**
- Consumes: `dlc.releaseDate`, `dlc.predictedReleaseDate` (Task 1), `useCountdown` (sẵn có), class `.kenburns`/`.snow` (Task 3), asset hero (Task 4, nếu có).
- Logic countdown: `targetDate = dlc.releaseDate ?? dlc.predictedReleaseDate`. Hiện timer khi `targetDate` tồn tại và chưa `isLive`. Hiện nhãn `(dự kiến)` khi đang dùng `predictedReleaseDate` (tức `releaseDate` null nhưng `predictedReleaseDate` có). Khi cả hai null → hiện pill `Dự kiến {releaseLabel}` (giữ hành vi cũ).

- [ ] **Step 1: Cập nhật test (viết kỳ vọng mới, sẽ fail)**

Thay toàn bộ nội dung `src/components/sections/__tests__/DlcSection.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DlcSection from '../DlcSection.vue'

type DlcProps = {
  name: string
  fullName: string
  releaseDate: string | null
  predictedReleaseDate: string | null
  releaseLabel: string
  civs: string[]
  highlights: string[]
  steamUrl: string
}

function makeDlc(overrides: Partial<DlcProps> = {}): DlcProps {
  return {
    name: 'Raiders of the North',
    fullName: 'Age of Empires IV: Raiders of the North',
    releaseDate: null,
    predictedReleaseDate: null,
    releaseLabel: 'Q4 2026',
    civs: ['Vikings', 'Scots'],
    highlights: ['Hai civ mới', '4 nhiệm vụ Crucible', 'Hai biome mới'],
    steamUrl: 'https://store.steampowered.com/app/4336170',
    ...overrides,
  }
}

describe('DlcSection', () => {
  it('hiển thị nhãn release khi cả hai ngày đều null', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    expect(wrapper.text()).toContain('Q4 2026')
    expect(wrapper.find('[role="timer"]').exists()).toBe(false)
  })

  it('bật countdown + nhãn (dự kiến) khi chỉ có ngày dự đoán', () => {
    const wrapper = mount(DlcSection, {
      props: { dlc: makeDlc({ predictedReleaseDate: '2099-01-01T00:00:00+07:00' }) },
    })
    expect(wrapper.find('[role="timer"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('(dự kiến)')
  })

  it('bật countdown KHÔNG có nhãn (dự kiến) khi có ngày chính thức', () => {
    const wrapper = mount(DlcSection, {
      props: { dlc: makeDlc({ releaseDate: '2099-01-01T00:00:00+07:00' }) },
    })
    expect(wrapper.find('[role="timer"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('(dự kiến)')
  })

  it('render chip cho mỗi civ', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    const chips = wrapper.findAll('[data-testid="civ-chip"]')
    expect(chips).toHaveLength(2)
    expect(chips[0].text()).toBe('Vikings')
    expect(chips[1].text()).toBe('Scots')
  })

  it('CTA Steam trỏ đúng url', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    expect(wrapper.find('a[href^="https://store.steampowered.com"]').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận fail**

Run: `npx vitest run src/components/sections/__tests__/DlcSection.spec.ts`
Expected: FAIL — chưa có `[data-testid="civ-chip"]` / nhãn `(dự kiến)` / logic predicted.

- [ ] **Step 3: Viết lại component**

Thay toàn bộ nội dung `src/components/sections/DlcSection.vue`. **Nếu Task 4 có ảnh**, giữ nguyên block dưới. **Nếu Task 4 kích hoạt Fallback (không ảnh)**, xóa 2 dòng `import heroArt ...` và toàn bộ thẻ `<img ... />` (các phần còn lại chạy độc lập).

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import type { dlc as DlcType } from '@/data/dlc'
import heroArt from '@/assets/imgs/raiders-of-the-north-hero.jpg'

const props = defineProps<{ dlc: typeof DlcType }>()

const targetDate = computed(() => props.dlc.releaseDate ?? props.dlc.predictedReleaseDate)
const isPredicted = computed(() => !props.dlc.releaseDate && !!props.dlc.predictedReleaseDate)
// useCountdown an toàn với chuỗi rỗng (isLive=true ngay); chỉ render timer khi có ngày.
const { days, hours, minutes, seconds, isLive } = useCountdown(targetDate.value ?? '')
const showTimer = computed(() => !!targetDate.value && !isLive.value)

const units = computed(() => [
  { value: days.value, label: 'Ngày' },
  { value: hours.value, label: 'Giờ' },
  { value: minutes.value, label: 'Phút' },
  { value: seconds.value, label: 'Giây' },
])
</script>

<template>
  <section
    class="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center"
  >
    <!-- Lớp nền ảnh key art (Ken Burns) -->
    <img
      :src="heroArt"
      alt="Age of Empires IV: Raiders of the North key art (Microsoft / Relic)"
      class="kenburns pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-70"
      width="1920"
      height="620"
    />
    <!-- Gradient phủ (cũng là nền nếu không có ảnh) -->
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-ink/50 via-ink/80 to-ink"></div>
    <!-- Lớp tuyết trôi -->
    <div class="snow pointer-events-none absolute inset-0 -z-10"></div>

    <p class="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-gold">DLC sắp ra mắt</p>
    <h1 class="text-4xl font-black uppercase text-cream drop-shadow-lg sm:text-6xl">
      {{ dlc.name }}
    </h1>
    <p class="mt-3 text-cream/80">{{ dlc.fullName }}</p>

    <ul class="mt-5 flex flex-wrap items-center justify-center gap-2">
      <li
        v-for="civ in dlc.civs"
        :key="civ"
        data-testid="civ-chip"
        class="rounded-full border border-gold/50 bg-surface/60 px-4 py-1 text-sm font-bold text-gold backdrop-blur-sm"
      >
        {{ civ }}
      </li>
    </ul>

    <div
      v-if="showTimer"
      class="mt-8 flex items-center justify-center gap-3 sm:gap-5"
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
        class="rounded-lg border border-gold-dim/20 bg-surface/60 px-4 py-2 text-sm text-cream/90 backdrop-blur-sm"
      >
        {{ h }}
      </li>
    </ul>

    <a
      :href="dlc.steamUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-8 inline-block rounded-md bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-dim"
    >
      Xem trên Steam
    </a>
  </section>
</template>
```

- [ ] **Step 4: Chạy test để xác nhận pass**

Run: `npx vitest run src/components/sections/__tests__/DlcSection.spec.ts`
Expected: PASS (cả 5 test).

- [ ] **Step 5: Type-check**

Run: `npm run type-check`
Expected: không lỗi (`vue-tsc` xanh).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/DlcSection.vue src/components/sections/__tests__/DlcSection.spec.ts
git commit -m "feat: redesign DLC hero with live countdown and motion

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Polish phần Giải đấu & Cộng đồng (`HomeView.vue` + `TournamentCard.vue`)

**Files:**
- Modify: `src/views/HomeView.vue`
- Modify: `src/components/TournamentCard.vue`

**Interfaces:**
- Consumes: `SectionTitle` (sẵn có), `useReveal` (Task 2), `site.links.youtube` (sẵn có), class `.reveal` (Task 3).

> `HomeView.vue` hiện không có file test riêng; xác minh qua `routes.spec.ts` (đã có) + type-check + build. Đây là polish trình bày, không thêm logic cần unit test mới.

- [ ] **Step 1: Thêm hover-lift cho `TournamentCard.vue`**

Trong `src/components/TournamentCard.vue`, sửa class của `<RouterLink>` từ:

```
class="block rounded-lg border border-gold-dim/20 bg-surface p-6 transition hover:border-gold"
```

thành:

```
class="block rounded-lg border border-gold-dim/20 bg-surface p-6 transition duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-gold/5"
```

- [ ] **Step 2: Viết lại `src/views/HomeView.vue`**

Thay toàn bộ nội dung:

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { dlc } from '@/data/dlc'
import { tournaments } from '@/data/tournaments'
import { site } from '@/data/site'
import DlcSection from '@/components/sections/DlcSection.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import TournamentCard from '@/components/TournamentCard.vue'
import { useReveal } from '@/composables/useReveal'

useHead({
  title: `${site.name} - Cộng đồng Age of Empires IV Việt Nam`,
  meta: [
    { name: 'description', content: site.description },
    { property: 'og:title', content: site.name },
    { property: 'og:description', content: site.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${site.url}/og.jpg` },
  ],
})

const { el: tournamentsEl } = useReveal()
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
        to="/tournaments"
        class="inline-block rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
      >
        Xem tất cả giải
      </RouterLink>
    </div>
  </section>

  <section
    ref="communityEl"
    class="reveal border-t border-gold-dim/10 bg-surface/40 px-4 py-16"
  >
    <div class="mx-auto max-w-3xl text-center">
      <SectionTitle eyebrow="Tham gia" title="Cộng đồng AoE4 Việt Nam" />
      <p class="text-cream/85">
        Nơi quy tụ người chơi Age of Empires IV tại Việt Nam - giải đấu và tin tức.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-4">
        <a
          :href="site.links.discord"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md bg-gold px-6 py-3 font-bold text-ink transition hover:bg-gold-dim"
        >
          Discord
        </a>
        <a
          :href="site.links.youtube"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
        >
          YouTube
        </a>
        <a
          :href="site.links.blog"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-md border border-gold px-6 py-3 font-bold text-gold transition hover:bg-gold hover:text-ink"
        >
          Blog
        </a>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Chạy test liên quan để xác nhận không vỡ**

Run: `npx vitest run src/router/__tests__/routes.spec.ts src/components/__tests__/TournamentCard.spec.ts`
Expected: PASS.

- [ ] **Step 4: Type-check**

Run: `npm run type-check`
Expected: không lỗi.

- [ ] **Step 5: Commit**

```bash
git add src/views/HomeView.vue src/components/TournamentCard.vue
git commit -m "feat: polish tournaments and community sections with reveal

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Xác minh toàn bộ

**Files:** không sửa code — chỉ chạy kiểm tra cổng cuối.

- [ ] **Step 1: Lint**

Run: `npm run lint:check`
Expected: không lỗi, không warning.

- [ ] **Step 2: Toàn bộ test**

Run: `npm run test:run`
Expected: tất cả test xanh (gồm shared-data, useReveal, useCountdown, DlcSection, TournamentCard, routes, các spec khác).

- [ ] **Step 3: Type-check**

Run: `npm run type-check`
Expected: `vue-tsc` xanh.

- [ ] **Step 4: Build production**

Run: `npm run build`
Expected: `vite-ssg` build thành công, không lỗi.

- [ ] **Step 5: Kiểm tra mắt thường (tuỳ chọn nhưng khuyến nghị)**

Run: `npm run preview` rồi mở trình duyệt — xác nhận: hero có nền/gradient + countdown chạy + nhãn "(dự kiến)"; cuộn xuống thấy hai phần fade-up; link YouTube hoạt động. Bật "Reduce motion" trong OS để xác nhận animation tắt.

- [ ] **Step 6: Commit cuối (nếu có chỉnh nhỏ từ lint/format)**

```bash
git add -A
git commit -m "chore: final lint and format pass for homepage revamp

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>" || echo "nothing to commit"
```

---

## Self-Review (đã rà)

- **Spec coverage:** ngày dự đoán (T1) · useReveal (T2) · motion+reduced-motion (T3) · key art (T4) · hero redesign: ảnh, gradient, snow, countdown sống, "(dự kiến)", civ chip, highlights chip (T5) · SectionTitle + reveal + YouTube + hover-lift (T6) · type-check/lint/test/build (T7). Tất cả mục trong spec có task tương ứng.
- **Placeholder scan:** không có TBD/TODO; mọi step có code/lệnh cụ thể.
- **Type consistency:** `predictedReleaseDate: string | null` đồng nhất giữa T1, test T5, và logic component T5; `useReveal(): { el }` đồng nhất giữa T2 và T6; class `.kenburns/.snow/.reveal/.is-visible` đồng nhất giữa T3, T5, T6, và composable T2.
- **Fallback ảnh:** xử lý rõ ở T4 + nhánh không-ảnh ở T5 Step 3 — build không vỡ dù không tải được key art.
