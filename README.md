# AoE4 VN

Ứng dụng Vue 3 + Vite + TypeScript với Tailwind CSS, Pinia, Vue Router, ESLint, Prettier và Vitest.

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
| `npm run build`       | Type-check + build production                  |
| `npm run preview`     | Xem thử bản build                              |
| `npm run type-check`  | Kiểm tra kiểu với `vue-tsc`                     |
| `npm run lint`        | Chạy ESLint và tự sửa                           |
| `npm run lint:check`  | Chạy ESLint (không sửa)                          |
| `npm run format`      | Định dạng code bằng Prettier                    |
| `npm run test`        | Chạy Vitest ở chế độ watch                       |
| `npm run test:run`    | Chạy toàn bộ test một lần                        |

## Cấu trúc thư mục

```
src/
├── assets/         # CSS, hình ảnh (Tailwind nạp tại main.css)
├── components/     # Component tái sử dụng (+ __tests__)
├── router/         # Cấu hình Vue Router
├── stores/         # Pinia stores
├── views/          # Trang gắn với route
├── App.vue         # Component gốc
└── main.ts         # Điểm khởi tạo ứng dụng
```

## Công nghệ

- **Vue 3** (`<script setup>`), **TypeScript**
- **Vite 6** + **vite-plugin-vue-devtools**
- **Tailwind CSS v4** (qua `@tailwindcss/vite`)
- **Pinia** (state) + **Vue Router** (định tuyến)
- **ESLint 9** (flat config) + **Prettier**
- **Vitest** + **@vue/test-utils** + **jsdom**
