# AoE4 VN

**Hub cộng đồng Age of Empires IV Việt Nam** — tra cứu giải đấu và đếm ngược DLC mới nhất.

Blog tin tức của cộng đồng: [aoe4vietnam.org](https://aoe4vietnam.org)

## Yêu cầu

- Node.js `^20.19.0 || >=22.12.0`
- npm

## Cài đặt

```sh
npm install
```

## Lệnh thường dùng

| Lệnh                  | Mô tả                                          |
| --------------------- | ---------------------------------------------- |
| `npm run dev`         | Chạy dev server (Vite) kèm Vue DevTools        |
| `npm run build`       | Type-check + build production (vite-ssg)       |
| `npm run preview`     | Xem thử bản build                              |
| `npm run type-check`  | Kiểm tra kiểu với `vue-tsc`                     |
| `npm run lint`        | Chạy ESLint và tự sửa                           |
| `npm run lint:check`  | Chạy ESLint (không sửa)                         |
| `npm run format`      | Định dạng code bằng Prettier                    |
| `npm run test`        | Chạy Vitest ở chế độ watch                      |
| `npm run test:run`    | Chạy toàn bộ test một lần                       |

## Routes

| Đường dẫn                  | Trang                                          |
| -------------------------- | ---------------------------------------------- |
| `/`                        | Hub: đếm ngược DLC + giải đấu nổi bật + cộng đồng |
| `/tournaments`             | Danh sách giải đấu                             |
| `/tournaments/:slug`       | Chi tiết giải đấu (ví dụ: `/tournaments/lac-hong`) |

## Cấu trúc thư mục

```
src/
├── assets/         # CSS, hình ảnh (Tailwind nạp tại main.css)
├── components/     # Component tái sử dụng (+ __tests__)
├── data/           # Dữ liệu tĩnh (dlc, site, tournaments/)
│   └── tournaments/
│       ├── _template.ts   # Mẫu thêm giải đấu mới
│       ├── index.ts       # Mảng tournaments + getTournamentBySlug
│       └── lac-hong.ts    # Giải Lạc Hồng (ví dụ)
├── router/         # Cấu hình Vue Router
├── views/          # Trang gắn với route
├── App.vue         # Component gốc
└── main.ts         # Điểm khởi tạo ứng dụng
```

## Build & Deploy

Build dùng [vite-ssg](https://github.com/antfu/vite-ssg) để pre-render toàn bộ route thành HTML tĩnh. File sitemap được tạo tự động tại `dist/sitemap.xml` sau mỗi lần build.

```sh
npm run build   # output: dist/
```

> Khi thêm route giải đấu mới, nhớ cập nhật `includedRoutes` và `urls` trong `vite.config.ts`. Xem hướng dẫn chi tiết trong [CONTRIBUTING.md](CONTRIBUTING.md).

## Công nghệ

- **Vue 3** (`<script setup>`), **TypeScript**
- **Vite 6** + **vite-ssg** (pre-render SSG) + **vite-plugin-vue-devtools**
- **Tailwind CSS v4** (qua `@tailwindcss/vite`)
- **Vue Router 4** (định tuyến)
- **@unhead/vue** (SEO meta tags)
- **ESLint 9** (flat config) + **Prettier**
- **Vitest** + **@vue/test-utils** + **jsdom**
