---
name: seo-audit
description: Use monthly (same cadence as propose-topics) to audit on-page SEO across aoe4.vn content. Runs the deterministic sweep over all guides and news posts (hygiene + em-dash), fixes metadata-level failures in one focused PR, and walks a manual checklist for the static pages' useHead blocks. Metadata and links only - never rewrites article prose.
---

# SEO Audit (M1 - vệ sinh on-page hàng tháng)

## Bước 1 - Quét tự động

Chạy `npx vite-node scripts/seo-audit.ts`. Exit 0 và `findings: []` -> phần nội dung sạch,
sang Bước 3.

## Bước 2 - Sửa (chỉ khi có findings)

1. Tạo branch `claude/seo-audit-<YYYY-MM>`.
2. Sửa ĐÚNG các failure liệt kê: title/description/slug/cta/sources/internal link/em-dash.
   CHỈ sửa metadata và link - KHÔNG viết lại văn bài (đó là việc của write-article + evaluator).
3. Chạy lại script đến khi exit 0, rồi `npm run lint:check && npm run type-check &&
   npm run test:run`.
4. Commit `fix(seo): audit <YYYY-MM>`, mở PR (gh account collaborator:
   `gh auth switch --user shishi-77`, switch về sau).

## Bước 3 - Checklist trang tĩnh (tay, 5 phút)

Script không quét được metadata viết trong component. Mở lần lượt `HomeView.vue`,
`FAQView.vue`, `GuidesView.vue`, `NewsView.vue`, `TournamentsView.vue` và soát khối
`useHead`:

- canonical có trailing slash và khớp `og:url`
- title <= 100 ký tự, description 50-260 ký tự
- có `og:image`

Sai chỗ nào sửa chỗ đó trong cùng PR ở Bước 2 (hoặc PR riêng nếu Bước 2 không có findings).

## Bước 4 - Ghi nhận

Báo cáo ngắn cho owner: số trang quét, số finding đã sửa, link PR. Nếu tháng này sạch
hoàn toàn: nói rõ "sạch, không cần PR".
