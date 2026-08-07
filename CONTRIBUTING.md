# Hướng dẫn đóng góp (Contributing Guide)

Chào mừng bạn đóng góp cho **AoE4 VN**! Tài liệu này hướng dẫn các tác vụ đóng góp phổ biến nhất.

---

## Mục lục

1. [Thêm một giải đấu](#1-thêm-một-giải-đấu)
2. [Thêm một bài hướng dẫn](#2-thêm-một-bài-hướng-dẫn)
3. [Cập nhật ngày phát hành DLC](#3-cập-nhật-ngày-phát-hành-dlc)
4. [Kiểm tra trước khi gửi PR](#4-kiểm-tra-trước-khi-gửi-pr)

---

## 1. Thêm một giải đấu

Thêm giải đấu mới cần cập nhật **bốn nơi**. Thiếu bước thứ tư là lỗi thường gặp nhất - route sẽ không được pre-render và không xuất hiện trong sitemap.

Dữ liệu giải đấu chia làm **hai lớp file**: `.data.ts` (thuần dữ liệu, không import ảnh) và
`.ts` (gắn banner). Lý do bắt buộc chia: `vite.config.ts` cần đọc dữ liệu giải đấu (để liệt kê
vào `llms.txt`), nhưng Vite nạp file config **trước khi** alias `@/` tồn tại. Nếu file dữ liệu
mở đầu bằng `import banner from '@/assets/imgs/...'`, việc nạp config sẽ đổ ngay với lỗi
`Cannot find package '@/assets'`. Giữ ảnh tách khỏi dữ liệu là điều kiện để build không vỡ.

### Bước 1 — Tạo file dữ liệu giải đấu (không import ảnh)

Copy file mẫu `src/data/tournaments/_template.ts` thành `ten-giai.data.ts`, đặt tên theo slug
của giải (chỉ dùng chữ thường, số và dấu gạch ngang):

```sh
cp src/data/tournaments/_template.ts src/data/tournaments/ten-giai.data.ts
```

Mở file vừa tạo và điền đầy đủ thông tin. File này **không được import ảnh**:

```ts
// src/data/tournaments/ten-giai.data.ts
import type { TournamentData } from './types'

export const tenGiaiData: TournamentData = {
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
  bracketFormat: '',
  prizes: [{ rank: 1, label: 'Vô địch', amount: '1.000.000đ', medal: '🥇' }],
  maps: [],
  links: { discord: '', banPick: '', mapPool: '', youtube: '' },
  rules: [],
  notes: [],
  registrationDeadline: '25/05/2026',
}
```

### Bước 2 — Tạo file gắn banner

Tạo `ten-giai.ts` cùng thư mục, chỉ để ghép ảnh banner vào dữ liệu:

```ts
// src/data/tournaments/ten-giai.ts
import banner from '@/assets/imgs/ten-giai-banner.webp'
import type { Tournament } from './types'
import { tenGiaiData } from './ten-giai.data'

export const tenGiai: Tournament = { ...tenGiaiData, banner }
```

> Xem cặp file `src/data/tournaments/lac-hong.data.ts` + `lac-hong.ts` để tham khảo ví dụ đầy đủ.

### Bước 3 — Import vào index.ts và data.ts

Mở `src/data/tournaments/index.ts` và thêm import + phần tử vào mảng `tournaments`:

```ts
// src/data/tournaments/index.ts
import { lacHong } from './lac-hong'
import { tenGiai } from './ten-giai'      // thêm dòng này
export type { Tournament, Prize, TournamentLinks, Venue } from './types'

export const tournaments = [lacHong, tenGiai]  // thêm vào mảng

export function getTournamentBySlug(slug: string) {
  return tournaments.find((t) => t.slug === slug)
}
```

Mở `src/data/tournaments/data.ts` và thêm `tenGiaiData` vào mảng `tournamentsData` - mảng này
là thứ duy nhất `vite.config.ts` được phép import từ thư mục `tournaments/`:

```ts
// src/data/tournaments/data.ts
import { lacHongData } from './lac-hong.data'
import { tenGiaiData } from './ten-giai.data'   // thêm dòng này

export const tournamentsData: TournamentData[] = [lacHongData, tenGiaiData]  // thêm vào mảng
```

### Bước 4 — Thêm route vào vite.config.ts (QUAN TRỌNG)

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
    ]
    // ...
  },
},
```

> **Tại sao cần bước này?** vite-ssg chỉ pre-render các route được liệt kê rõ ràng trong `includedRoutes`. Route `/tournaments/:slug` là dynamic — nếu không khai báo slug cụ thể, trang sẽ không được tạo ra lúc build và không có trong sitemap.

---

## 2. Thêm một bài hướng dẫn

Thêm bài hướng dẫn mới cần cập nhật **bốn nơi**. Thiếu bước thứ ba hoặc thứ tư là lỗi thường gặp nhất — route sẽ không được pre-render và không xuất hiện trong sitemap.

### Bước 1 — Tạo file dữ liệu bài hướng dẫn

Copy file mẫu `src/data/guides/_template.ts` thành file mới, đặt tên theo slug của bài (chỉ dùng chữ thường, số và dấu gạch ngang):

```sh
cp src/data/guides/_template.ts src/data/guides/ten-bai.ts
```

Mở file vừa tạo và điền đầy đủ thông tin:

```ts
// src/data/guides/ten-bai.ts
import type { Guide } from './index'

export const tenBai: Guide = {
  slug: 'ten-bai',           // phải khớp với tên file và URL route
  title: 'Tiêu đề bài hướng dẫn',
  description: 'Mô tả ngắn gọn cho meta description và danh sách hướng dẫn.',
  updatedAt: '2026-06-28',
  cta: true,
  sections: [
    {
      heading: 'Tiêu đề phần',
      paragraphs: ['Nội dung phần 1.', 'Nội dung phần 2.'],
    },
  ],
}
```

> Xem file `src/data/guides/cach-tai-aoe4.ts` để tham khảo ví dụ đầy đủ.

### Bước 2 — Import vào index.ts

Mở `src/data/guides/index.ts` và thêm import + phần tử vào mảng `guides`:

```ts
// src/data/guides/index.ts
import { cachTaiAoe4 } from './cach-tai-aoe4'
import { tenBai } from './ten-bai'      // thêm dòng này

export const guides = [cachTaiAoe4, tenBai]  // thêm vào mảng
```

### Bước 3 — Thêm route vào vite.config.ts (QUAN TRỌNG)

Mở `vite.config.ts` và thêm slug vào **cả hai chỗ**: `includedRoutes` và mảng `urls` (sitemap):

```ts
// vite.config.ts
ssgOptions: {
  includedRoutes(paths: string[]) {
    return [
      ...paths.filter((p) => !p.includes(':')),
      '/guides/cach-tai-aoe4',
      '/guides/ten-bai',   // thêm dòng này vào includedRoutes
    ]
  },
  onFinished() {
    const urls = [
      '/',
      '/guides',
      '/guides/cach-tai-aoe4/',
      '/guides/ten-bai/',   // thêm dòng này vào sitemap (lưu ý dấu / cuối)
    ]
    // ...
  },
},
```

> **Tại sao cần bước này?** vite-ssg chỉ pre-render các route được liệt kê rõ ràng trong `includedRoutes`. Route `/guides/:slug` là dynamic — nếu không khai báo slug cụ thể, trang sẽ không được tạo ra lúc build và không có trong sitemap. Đây là lỗi thường gặp nhất khi thêm bài hướng dẫn mới.

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

## Content pipeline

Bài viết đi qua hàng đợi `src/data/content-queue.json` (trạng thái: proposed -> facts-pending
-> facts-approved -> drafted -> in-pr -> published; nhánh parked/rejected). Ba skill vận hành:

- `/propose-topics` - hàng tháng, đọc CSV Search Console trong `docs/search-console/` (local),
  đề xuất đề tài mới vào hàng đợi.
- `/write-article <slug>` - viết một bài từ hàng đợi: facts sheet (`docs/facts-review/`, local)
  -> owner duyệt -> viết -> guide-evaluator chấm (news có chế độ riêng) -> PR kèm link share UTM.
- `/seo-audit` - hàng tháng, quét hygiene toàn bộ guides + news (`npx vite-node
  scripts/seo-audit.ts`) và sửa metadata trong một PR.

Nguyên tắc: không viết facts Đế chế/AoE từ kiến thức generic - guide dùng kho facts đã duyệt
(`.claude/skills/guide-evaluator/facts/`), news phải trích nguồn https cho mọi claim.
