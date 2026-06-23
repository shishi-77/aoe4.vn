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

### Quy trình release (deploy qua tag)

Deploy lên https://aoe4.vn **chỉ chạy khi push tag** khớp `v.release-*`. Merge vào `main` KHÔNG tự deploy.

```sh
# 1. Từ main đã merge xong các PR cần release
git checkout main && git pull

# 2. Tạo branch release đóng băng snapshot
git checkout -b release-20260623
git push -u origin release-20260623

# 3. Tag và push tag (bước này trigger deploy)
git tag v.release-20260623
git push origin v.release-20260623
```

> Release lần 2 trong cùng ngày: thêm hậu tố, vd `v.release-20260623-2`.

Sau khi Actions deploy xong, vào **Releases → Draft a new release**, chọn tag vừa tạo và viết release note thủ công.

**Rollback:** tab **Actions → Deploy to GitHub Pages → Run workflow**, chọn ref là tag `v.release-*` cũ. Không cần tạo tag mới.

## Công nghệ

- **Vue 3** (`<script setup>`), **TypeScript**
- **Vite 6** + **vite-ssg** (pre-render SSG) + **vite-plugin-vue-devtools**
- **Tailwind CSS v4** (qua `@tailwindcss/vite`)
- **Vue Router 4** (định tuyến)
- **@unhead/vue** (SEO meta tags)
- **ESLint 9** (flat config) + **Prettier**
- **Vitest** + **@vue/test-utils** + **jsdom**

## Giấy phép

Dự án phát hành theo giấy phép [MIT](LICENSE) — tự do sử dụng, chỉnh sửa và phân phối.
