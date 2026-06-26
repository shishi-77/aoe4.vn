# CLAUDE.md

Hướng dẫn cho Claude (và các AI assistant) khi làm việc trong repo **AoE4 VN**.
Đây là hub cộng đồng Age of Empires IV Việt Nam: Vue 3 + Vite (vite-ssg pre-render tĩnh) + Tailwind, deploy lên GitHub Pages.

## Môi trường dev

- Dùng **Node 22** cho mọi lệnh build/test local. Máy có thể mặc định Node cũ (16) khiến cài đặt/build lỗi (`crypto.getRandomValues`, `@tailwindcss/oxide`). Chuyển bằng `nvm use 22` trước khi chạy npm.
- Lệnh hay dùng: `npm run dev`, `npm run build`, `npm run lint:check`, `npm run type-check`, `npm run test:run`.

## Quy ước code

- **Đặt tên bằng tiếng Anh:** route path và name, tên component/file, biến và mọi identifier đều tiếng Anh (vd `/faq`, `FAQView.vue`, `faqItems` — KHÔNG dùng `/de-che-4`, `DeChe4View`, `deChe4Faq`). Chỉ **text hiển thị cho người dùng** (nhãn nav, copy trên trang) mới được tiếng Việt.
- **Import luôn dùng alias `@/`** (trỏ tới `src/`), không dùng đường dẫn tương đối `../` hay `./`. Áp dụng cho cả code lẫn test. Vd: `import { faqItems } from '@/data/faq'`.
- **Nội dung/copy dùng dấu gạch ngắn `-`**, không bao giờ dùng gạch dài `—`.
- **Không viết comment HTML** bên trong markup `<template>` của Vue.

## Quy ước Git

- **Mọi văn bản git/GitHub bằng tiếng Anh:** tên nhánh, commit (title + body), tiêu đề và mô tả PR. (Trao đổi/chat có thể tiếng Việt.)
- **Tạo nhánh mới trước khi bắt đầu tính năng** — không code/commit thẳng lên `main`. Workflow chỉ deploy từ `main`, nên thay đổi đi theo: nhánh → PR → merge (chủ repo duyệt).

## Trước khi gửi PR

Chạy và đảm bảo tất cả PASS:

```sh
npm run lint:check && npm run type-check && npm run test:run
```

## Thêm route / nội dung mới

- Route **tĩnh** (không có `:`) được vite-ssg tự pre-render, nhưng **phải tự thêm URL vào mảng `urls`** trong `onFinished` của `vite.config.ts` để có trong `sitemap.xml`.
- Route **động** (vd `/tournaments/:slug`) phải khai báo từng slug cụ thể trong cả `includedRoutes` lẫn sitemap. Xem chi tiết trong [CONTRIBUTING.md](./CONTRIBUTING.md).
- Đặt meta SEO (title, description, canonical, og, JSON-LD) qua `useHead` từ `@unhead/vue`; canonical dùng URL có dấu `/` ở cuối.
