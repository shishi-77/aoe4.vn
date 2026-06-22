# Hướng dẫn đóng góp (Contributing Guide)

Chào mừng bạn đóng góp cho **AoE4 VN**! Tài liệu này hướng dẫn các tác vụ đóng góp phổ biến nhất.

---

## Mục lục

1. [Thêm một giải đấu](#1-thêm-một-giải-đấu)
2. [Cập nhật danh sách civ / map](#2-cập-nhật-danh-sách-civ--map)
3. [Cập nhật ngày phát hành DLC](#3-cập-nhật-ngày-phát-hành-dlc)
4. [Kiểm tra trước khi gửi PR](#4-kiểm-tra-trước-khi-gửi-pr)

---

## 1. Thêm một giải đấu

Thêm giải đấu mới cần cập nhật **ba nơi**. Thiếu bước thứ ba là lỗi thường gặp nhất — route sẽ không được pre-render và không xuất hiện trong sitemap.

### Bước 1 — Tạo file dữ liệu giải đấu

Copy file mẫu `src/data/tournaments/_template.ts` thành file mới, đặt tên theo slug của giải (chỉ dùng chữ thường, số và dấu gạch ngang):

```sh
cp src/data/tournaments/_template.ts src/data/tournaments/ten-giai.ts
```

Mở file vừa tạo và điền đầy đủ thông tin:

```ts
// src/data/tournaments/ten-giai.ts
import type { Tournament } from './lac-hong'

export const tenGiai: Tournament = {
  slug: 'ten-giai',           // phải khớp với tên file và URL route
  name: 'Tên giải đấu',
  game: 'Age of Empires IV',
  format: '1vs1',
  organizer: 'Cộng Đồng AOE IV Việt Nam',
  entryFee: 'Miễn phí',
  registrationType: 'Đăng ký tự do',
  venue: { name: '', address: '', mapsUrl: '' },
  startsAt: '2026-06-01T13:30:00+07:00',   // ISO 8601 +07:00
  endsAt: '2026-06-01T23:59:00+07:00',
  registrationClosesAt: '2026-05-25T23:59:00+07:00',
  dateLabel: '01/06/2026',
  prizePoolTotal: '500,000 VND',
  prizes: [{ place: 1, label: 'Nhất', amount: '300,000 VND' }],
  maps: [],
  links: { discord: '', banPick: '', mapPool: '', youtube: '' },
  rules: [],
  notes: [],
  registrationDeadline: '25/05/2026',
}
```

> Xem file `src/data/tournaments/lac-hong.ts` để tham khảo ví dụ đầy đủ.

### Bước 2 — Import vào index.ts

Mở `src/data/tournaments/index.ts` và thêm import + phần tử vào mảng `tournaments`:

```ts
// src/data/tournaments/index.ts
import { lacHong } from './lac-hong'
import { tenGiai } from './ten-giai'      // thêm dòng này
export type { Tournament, Prize, TournamentLinks, Venue } from './lac-hong'

export const tournaments = [lacHong, tenGiai]  // thêm vào mảng

export function getTournamentBySlug(slug: string) {
  return tournaments.find((t) => t.slug === slug)
}
```

### Bước 3 — Thêm route vào vite.config.ts (QUAN TRỌNG)

Mở `vite.config.ts` và thêm slug vào **cả hai chỗ**: `includedRoutes` và mảng `urls` (sitemap):

```ts
// vite.config.ts
ssgOptions: {
  includedRoutes(paths: string[]) {
    return [
      ...paths.filter((p) => !p.includes(':')),
      '/tournaments/lac-hong',
      '/tournaments/ten-giai',   // thêm dòng này
    ]
  },
  onFinished() {
    const urls = [
      '/',
      '/tournaments',
      '/tournaments/lac-hong',
      '/tournaments/ten-giai',   // thêm dòng này
      '/tools/civ-draft',
      '/tools/random',
    ]
    // ...
  },
},
```

> **Tại sao cần bước này?** vite-ssg chỉ pre-render các route được liệt kê rõ ràng trong `includedRoutes`. Route `/tournaments/:slug` là dynamic — nếu không khai báo slug cụ thể, trang sẽ không được tạo ra lúc build và không có trong sitemap.

---

## 2. Cập nhật danh sách civ / map

### Civ mới

Mở `src/data/civs.ts` và thêm vào mảng `civs`:

```ts
{
  id: 'vikings',        // bắt buộc duy nhất, chỉ chữ thường + gạch dưới
  name: 'Vikings',
  upcoming: true,       // true = civ chưa phát hành (hiển thị badge "Sắp ra")
}
```

- `id` phải **duy nhất** trong toàn bộ mảng — trùng id sẽ gây lỗi logic ở ban-pick.
- Đặt `upcoming: true` cho mọi civ chưa được phát hành chính thức.
- Xóa `upcoming` (hoặc đặt `false`) khi civ đã ra mắt.

### Map mới

Mở `src/data/maps.ts` và thêm vào mảng `maps`:

```ts
{
  id: 'dry_arabia',     // bắt buộc duy nhất
  name: 'Dry Arabia',
}
```

- `id` phải **duy nhất** trong toàn bộ mảng.

---

## 3. Cập nhật ngày phát hành DLC

Khi Microsoft công bố ngày phát hành chính xác cho DLC, hãy cập nhật `src/data/dlc.ts`:

```ts
// src/data/dlc.ts
export const dlc = {
  name: 'Raiders of the North',
  // ...
  /**
   * null = chưa có ngày; điền ISO +07:00 để bật đồng hồ đếm ngược trên trang chủ.
   * Ví dụ: '2026-10-15T10:00:00+07:00'
   */
  releaseDate: '2026-10-15T10:00:00+07:00',   // thay null bằng ngày thực tế
  releaseLabel: 'Q4 2026',                     // cập nhật nhãn hiển thị nếu cần
  // ...
}
```

- Khi `releaseDate` là `null`, trang chủ hiển thị nhãn `releaseLabel` (ví dụ: "Dự kiến Q4 2026") thay vì đồng hồ đếm ngược.
- Sau khi DLC ra mắt và đếm ngược kết thúc, có thể đặt lại `releaseDate: null` để ẩn widget.

---

## 4. Kiểm tra trước khi gửi PR

Chạy ba lệnh sau và đảm bảo tất cả **PASS** trước khi mở Pull Request:

```sh
npm run lint:check && npm run type-check && npm run test:run
```

| Lệnh                 | Kiểm tra                              |
| -------------------- | ------------------------------------- |
| `npm run lint:check` | ESLint — lỗi style và code quality    |
| `npm run type-check` | TypeScript — kiểm tra kiểu tĩnh       |
| `npm run test:run`   | Vitest — chạy toàn bộ unit test       |

Nếu có lỗi ESLint có thể tự sửa, chạy `npm run lint` (có `--fix`) rồi kiểm tra lại.
