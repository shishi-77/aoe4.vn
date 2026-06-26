# Làm mới trang chủ — điểm nhấn DLC Viking

**Ngày:** 2026-06-26
**Trạng thái:** Đã duyệt thiết kế

## Mục tiêu

Trang chủ hiện tại đơn điệu: hero DLC chỉ là chữ xếp chồng trên nền đen phẳng, đồng hồ
đếm ngược bị tắt (`releaseDate: null`), hai phần dưới (giải đấu, cộng đồng) tự render `<h2>`
thô và không có chuyển động. DLC "Raiders of the North" (Vikings + Scots) là bản mở rộng lớn,
đáng mong chờ — trang chủ cần sinh động và cuốn hút hơn, lấy hero Viking làm điểm nhấn chính,
kèm đồng hồ đếm ngược tới một **ngày dự đoán** (10/11/2026).

## Phạm vi

- **Trong phạm vi:** toàn bộ trang chủ (`src/views/HomeView.vue` và các phần của nó).
  - `src/data/dlc.ts`: thêm trường ngày dự đoán.
  - `src/components/sections/DlcSection.vue`: làm lại hero Viking (ảnh nền, motion, badge,
    countdown sống, highlights dạng chip).
  - `HomeView.vue`: dùng `SectionTitle` cho phần giải đấu & cộng đồng; thêm link YouTube;
    bọc các phần bằng hiệu ứng reveal khi cuộn.
  - Thêm composable `useReveal` (IntersectionObserver) + ảnh key art Viking trong
    `src/assets/imgs/`.
  - Cập nhật/bổ sung test tương ứng.
- **Ngoài phạm vi:** navbar, footer, trang giải đấu (`/tournaments`, chi tiết), dữ liệu giải
  đấu, đổi theme màu toàn cục, thêm thư viện animation/canvas.

## Cách tiếp cận

**Treatment "điện ảnh" một trang, thuần Vue + Tailwind + CSS — không thêm dependency.**

Trọng tâm là hero Viking; hai phần dưới chỉ chỉnh nhẹ cho đồng bộ. Đã cân nhắc và **loại**
hai phương án nặng hơn: (a) thư viện animation kiểu Framer Motion, (b) particle engine bằng
`<canvas>` — cả hai thêm trọng lượng và gánh nặng bảo trì cho thứ mà CSS làm được. Chọn:
**ảnh key art chính thức + lớp motion CSS/SVG**, tất cả chuyển động đều tắt dưới
`prefers-reduced-motion: reduce`.

## Quyết định dữ liệu: ngày dự đoán là trường riêng

Comment hiện tại trong `dlc.ts` quy ước `releaseDate: null` = *"chưa có ngày chính thức; điền
khi Microsoft công bố"*. Không để một **dự đoán** giả làm ngày chính thức. Vì vậy:

- **Giữ** `releaseDate: null` (chính thức, vẫn chưa biết).
- **Thêm** `predictedReleaseDate: '2026-11-10T00:00:00+07:00'` (ISO +07:00).
- Hero đếm ngược tới `releaseDate ?? predictedReleaseDate`. Khi đang dùng ngày dự đoán, hiển
  thị nhãn nhỏ **"(dự kiến)"** cạnh đồng hồ.

Quy trình "điền ngày thật sau" vẫn nguyên vẹn: khi Microsoft công bố, set `releaseDate` thì
nhãn "(dự kiến)" tự biến mất và countdown chuyển sang ngày chính thức.

```ts
// src/data/dlc.ts (bổ sung)
export const dlc = {
  // ...giữ nguyên các trường hiện có...
  releaseDate: null as string | null, // null = chưa có ngày chính thức
  /** Ngày dự đoán để bật countdown trước khi có ngày chính thức. */
  predictedReleaseDate: '2026-11-10T00:00:00+07:00' as string | null,
  // ...
}
```

## Hero Viking (`DlcSection.vue`) — điểm nhấn chính

```
┌──────────────────────────────────────────────┐
│  [ ảnh key art Viking full-bleed ]            │
│  [ overlay gradient ink→trong suốt ]          │
│  [ Ken Burns zoom chậm + lớp tuyết/tàn lửa ]  │
│                                                │
│            DLC SẮP RA MẮT                      │  ← eyebrow
│       RAIDERS OF THE NORTH                     │  ← tiêu đề lớn
│      Age of Empires IV expansion               │
│        [⚔ Vikings]  [🏴 Scots]                  │  ← chip civ
│                                                │
│      ┌──┐ ┌──┐ ┌──┐ ┌──┐                       │
│      │04│ │12│ │30│ │57│   (dự kiến)           │  ← countdown SỐNG
│      └──┘ └──┘ └──┘ └──┘                       │
│       Ngày  Giờ  Phút  Giây                    │
│                                                │
│  [🗺 2 civ mới][⚔ 4 Crucible][🌲 2 biome]      │  ← highlights dạng chip
│                                                │
│         [ Xem trên Steam ]                     │
│              ↓ cuộn xuống                      │
└──────────────────────────────────────────────┘
```

Thành phần:

- **Ảnh nền:** key art Viking chính thức, full-bleed, phủ gradient tối (`ink` → trong suốt)
  để chữ đọc rõ; Ken Burns zoom chậm.
- **Lớp motion:** tuyết/tàn lửa trôi nhẹ bằng CSS (chủ đề phương bắc).
- **Nội dung:** eyebrow → tiêu đề → dòng `fullName` → chip 2 civ (Vikings, Scots) → countdown
  sống (bật nhờ ngày dự đoán) + nhãn "(dự kiến)" + `releaseLabel` → highlights restyle thành
  3 chip có icon (thay cho bullet list) → CTA "Xem trên Steam" → mũi tên cuộn xuống.
- **Fallback ảnh:** nếu không lấy được key art chính thức gọn gàng khi build, hero tự xuống
  cấp thành gradient giàu + hoạ tiết SVG (rune/longship) — vẫn sinh động, không bao giờ vỡ.

## Phần Giải đấu & Cộng đồng — chỉnh đồng bộ

- Cả hai phần dùng component `SectionTitle` đã có (sửa luôn việc `HomeView` đang hand-roll
  `<h2>` không nhất quán).
- Composable `useReveal` (IntersectionObserver) làm hiệu ứng fade-up nhẹ khi mỗi phần cuộn vào
  viewport.
- `TournamentCard` thêm hover-lift nhẹ.
- Dải cộng đồng: thêm link **YouTube** (`site.links.youtube`, đã có sẵn) cạnh Discord/Blog,
  đặt trên nền có texture nhẹ thay vì đen phẳng.

## Chi tiết kỹ thuật

- **Ảnh:** lưu key art tại `src/assets/imgs/raiders-of-the-north-hero.webp`, `import` để Vite
  hash/optimize. Đặt `width`/`height` cố định và dùng `loading`/gradient overlay để tránh
  layout shift. Ghi nguồn (Microsoft/Relic) ở `alt` và/hoặc comment.
- **Countdown:** tái dùng `useCountdown` sẵn có; truyền `releaseDate ?? predictedReleaseDate`.
  Giữ `tabular-nums` để số không nhảy ngang. `isLive` → ẩn timer, hiện trạng thái đã ra mắt.
- **`useReveal`:** IntersectionObserver, thêm class khi phần tử vào viewport, tự `unobserve`
  sau lần đầu; trả về `ref` để gắn vào element. Tôn trọng `prefers-reduced-motion`.
- **Accessibility & motion:** MỌI chuyển động (Ken Burns, tuyết/tàn lửa, reveal, hover) tắt
  dưới `@media (prefers-reduced-motion: reduce)`. Không gây layout shift. `role="timer"` giữ
  trên khối countdown.
- **Không thêm dependency.** Chỉ Vue 3 + Tailwind v4 (theme token trong `main.css`) + CSS.

## Kiểm thử

Repo dùng vitest + `@vue/test-utils`.

- **`DlcSection.spec.ts`** (cập nhật): countdown nay luôn sống nhờ `predictedReleaseDate` →
  assert có khối `role="timer"` với 4 đơn vị; có nhãn "(dự kiến)" khi dùng ngày dự đoán; chip
  civ render đủ Vikings + Scots; CTA Steam giữ `href` đúng.
- **`shared-data.spec.ts`** (cập nhật): `dlc.predictedReleaseDate` tồn tại và parse được thành
  ngày hợp lệ (ISO +07:00).
- **`useReveal` (mới):** test composable thêm class/observe đúng (mock IntersectionObserver).
- Giữ toàn bộ test xanh.

## Tiêu chí hoàn thành

- Hero Viking full-bleed có ảnh key art (hoặc fallback gradient/SVG), motion nhẹ, đồng hồ đếm
  ngược **sống** tới 10/11/2026 kèm nhãn "(dự kiến)".
- Phần giải đấu & cộng đồng dùng `SectionTitle`, có reveal khi cuộn, có link YouTube.
- Mọi animation tắt khi `prefers-reduced-motion: reduce`; không layout shift.
- `npm run test:run` xanh; `npm run type-check` và `npm run lint:check` không lỗi.
- `npm run build` thành công.
