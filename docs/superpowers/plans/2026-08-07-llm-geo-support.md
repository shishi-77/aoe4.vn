# LLM Crawler & GEO Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho aoe4.vn một lớp máy đọc dành riêng cho answer engine: `llms.txt`, `llms-full.txt`, bản Markdown từng bài, robots.txt khai báo tường minh AI crawler, và JSON-LD giàu hơn (BreadcrumbList, citation, CollectionPage).

**Architecture:** Mọi thứ sinh từ TS data đã có. Hàm thuần trả về string hoặc mảng `{path, content}`; chỉ `vite.config.ts` chạm đĩa, trong `onFinished`, ngay cạnh chỗ ghi `sitemap.xml`. Task 1 là bước dọn đường bắt buộc: tách import ảnh ra khỏi dữ liệu giải đấu, vì `vite.config.ts` không đi qua được alias `@/`.

**Tech Stack:** Vue 3 + vite-ssg, TypeScript, unhead (`useHead`), Vitest, Tailwind (không đụng tới). Không thêm dependency nào.

**Spec:** `docs/superpowers/specs/2026-08-07-llm-geo-support-design.md`

## Global Constraints

Lấy nguyên văn từ CLAUDE.md và spec. Mọi task đều phải thoả:

- **Branch:** làm trên `claude/llm-geo-support` (đã tạo, đã có commit spec). Không bao giờ commit vào `main`.
- **Identifier tiếng Anh:** tên file, biến, hàm, route đều tiếng Anh. Tiếng Việt chỉ dùng trong chữ người đọc thấy và trong tên test (`it('...')`) - đây là quy ước sẵn có của repo.
- **Import bằng alias `@/`**, không dùng `../` - áp dụng cho cả source lẫn test. **Ngoại lệ: `vite.config.ts`** dùng đường dẫn tương đối `./src/data/...` vì alias chưa được phân giải lúc Vite đọc config. Đây là pattern có sẵn, đừng "sửa".
- **Dùng gạch nối `-`, không bao giờ dùng em-dash `—`** trong mọi nội dung.
- **Không HTML comment trong `<template>` của Vue.**
- **Quy ước tên game:** văn xuôi người đọc thấy dùng `Đế chế 1/2/3/4`; viết tắt `AoE4` / `Age of Empires IV` chỉ được dùng ở vùng kỹ thuật (title, description, meta, JSON-LD, `sources[].label`, brand `AoE4 VN`). File `.md` sinh ra chép nguyên prose đã publish nên tự động hợp lệ; **chữ mới do plan này viết ra** (header của `llms.txt`, tên breadcrumb) phải theo luật này.
- **Không sửa một chữ prose nào:** `git diff` cuối cùng không được chạm `src/data/guides/*.ts`, `src/data/news/*.ts`, `src/data/faq.ts`. Task 1 có động vào `src/data/tournaments/` nhưng chỉ đổi *cấu trúc file*, không đổi một giá trị dữ liệu nào.
- **Không thêm route,** nên `PAGES` trong `src/__tests__/accessibility.spec.ts` giữ nguyên.
- **Gate trước khi mở PR:** `npm run lint:check && npm run type-check && npm run test:run`, cộng `npm run build` (bắt buộc với PR này vì `onFinished` dài ra).
- **Commit message tiếng Anh.**

## File Structure

| File | Trạng thái | Trách nhiệm |
|---|---|---|
| `src/data/tournaments/types.ts` | Tạo | Interface giải đấu, cộng `TournamentData` (bản không có `banner`). |
| `src/data/tournaments/lac-hong.data.ts` | Tạo | Dữ liệu Lạc Hồng Cup, không import asset. |
| `src/data/tournaments/ha-noi-open-1.data.ts` | Tạo | Dữ liệu Hà Nội Open 1, không import asset. |
| `src/data/tournaments/data.ts` | Tạo | `tournamentsData` - cửa vào sạch cho build tooling. |
| `src/data/tournaments/lac-hong.ts` | Viết lại | Chỉ còn việc gắn banner vào dữ liệu. |
| `src/data/tournaments/ha-noi-open-1.ts` | Viết lại | Như trên. |
| `src/data/tournaments/index.ts` | Sửa | Re-export type từ `./types`. |
| `src/data/tournaments/_template.ts` | Viết lại | Mẫu theo cấu trúc hai lớp mới. |
| `CONTRIBUTING.md` | Sửa | Quy trình thêm giải đấu theo cấu trúc mới. |
| `src/lib/contentMarkdown.ts` | Tạo | Render một đơn vị nội dung thành Markdown. Thuần, không fs. |
| `src/lib/__tests__/contentMarkdown.spec.ts` | Tạo | Test khuôn Markdown. |
| `src/lib/llmsTxt.ts` | Tạo | Gộp thành `llms.txt` / `llms-full.txt` / danh sách file `.md`. Thuần. |
| `src/lib/__tests__/llmsTxt.spec.ts` | Tạo | Test chống lệch, chạy trên dữ liệu thật. |
| `vite.config.ts` | Sửa | Ghi file trong `onFinished`. |
| `public/robots.txt` | Sửa | Khai báo tường minh 16 AI crawler. |
| `src/data/site.ts` | Sửa | Thêm trường tuỳ chọn `author`. |
| `src/lib/structuredData.ts` | Sửa | Thêm `breadcrumbJsonLd`, `collectionPageJsonLd`, làm giàu Article/NewsArticle. |
| `src/lib/__tests__/structuredData.spec.ts` | Sửa | Test cho phần thêm. |
| `src/views/*.vue` (7 file) | Sửa | Gắn JSON-LD mới. |

Thứ tự: Task 1 dọn đường → 2, 3, 4 xây lớp máy đọc → 5 độc lập (robots.txt) → 6, 7, 8 lớp JSON-LD → 9 gate cuối.

---

### Task 1: Tách banner khỏi dữ liệu giải đấu

**Lý do tồn tại của task này** (đã đo, không phải suy đoán): `vite.config.ts` cần đọc dữ liệu giải đấu để đưa vào `llms.txt`. Nhưng `lac-hong.ts` mở đầu bằng `import banner from '@/assets/imgs/lac-hong-cup-banner.webp'`, mà Vite nạp file config **trước khi** alias `@/` tồn tại. Thử thật thì build đổ ngay ở bước nạp config:

```
failed to load config from vite.probe.config.ts
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@/assets'
```

Task này tách dữ liệu khỏi ảnh. **Không đổi một giá trị dữ liệu nào, không đổi hành vi.** Mọi component và test đang import `lacHong` / `haNoiOpen1` / `Tournament` phải tiếp tục chạy mà không cần sửa.

**Files:**
- Create: `src/data/tournaments/types.ts`
- Create: `src/data/tournaments/lac-hong.data.ts`
- Create: `src/data/tournaments/ha-noi-open-1.data.ts`
- Create: `src/data/tournaments/data.ts`
- Rewrite: `src/data/tournaments/lac-hong.ts`, `src/data/tournaments/ha-noi-open-1.ts`, `src/data/tournaments/_template.ts`
- Modify: `src/data/tournaments/index.ts`, `CONTRIBUTING.md`

**Interfaces:**
- Consumes: không có (task đầu tiên).
- Produces:
  - `types.ts`: `Prize`, `TournamentLinks`, `Venue`, `Tournament`, và `TournamentData = Omit<Tournament, 'banner'>`
  - `data.ts`: `tournamentsData: TournamentData[]` - đây là thứ duy nhất `vite.config.ts` được phép import.
  - `lac-hong.ts` / `ha-noi-open-1.ts` vẫn export `lacHong` / `haNoiOpen1` kiểu `Tournament`, y hệt trước.
  - Task 2 dùng `TournamentData`; Task 4 dùng `tournamentsData`.

- [ ] **Step 1: Tạo `types.ts`**

Cắt **nguyên văn** bốn interface `Prize`, `TournamentLinks`, `Venue`, `Tournament` đang nằm ở đầu `src/data/tournaments/lac-hong.ts` (dòng 3 đến hết `export interface Tournament {...}`) sang file mới `src/data/tournaments/types.ts`. Giữ nguyên mọi JSDoc. Rồi thêm vào cuối file:

```ts
/**
 * A tournament minus its bundled banner image.
 *
 * `vite.config.ts` is loaded before the `@/` alias exists, so anything it reads
 * must not import an asset. Build-time tooling consumes this shape; the runtime
 * app keeps using `Tournament`.
 */
export type TournamentData = Omit<Tournament, 'banner'>
```

- [ ] **Step 2: Tạo hai file `.data.ts`**

`src/data/tournaments/lac-hong.data.ts`:

```ts
import type { TournamentData } from './types'

export const lacHongData: TournamentData = {
  // ... toàn bộ object literal của lacHong hiện tại, BỎ đúng một dòng `banner,`
}
```

Chép nguyên object literal từ `lac-hong.ts`, xoá dòng `banner,`, giữ mọi field khác **y nguyên từng ký tự**. Làm tương tự cho `src/data/tournaments/ha-noi-open-1.data.ts` với `haNoiOpen1Data`.

- [ ] **Step 3: Viết lại hai file gắn banner**

`src/data/tournaments/lac-hong.ts` rút gọn còn:

```ts
import lacHongBanner from '@/assets/imgs/lac-hong-cup-banner.webp'
import type { Tournament } from './types'
import { lacHongData } from './lac-hong.data'

export const lacHong: Tournament = { ...lacHongData, banner: lacHongBanner }
```

`src/data/tournaments/ha-noi-open-1.ts`:

```ts
import banner from '@/assets/imgs/ha-noi-open-1-banner.webp'
import type { Tournament } from './types'
import { haNoiOpen1Data } from './ha-noi-open-1.data'

export const haNoiOpen1: Tournament = { ...haNoiOpen1Data, banner }
```

- [ ] **Step 4: Tạo `data.ts` và sửa `index.ts`**

`src/data/tournaments/data.ts`:

```ts
import type { TournamentData } from './types'
import { lacHongData } from './lac-hong.data'
import { haNoiOpen1Data } from './ha-noi-open-1.data'

/**
 * Asset-free tournament data, safe to import from build tooling that runs
 * before the `@/` alias is available. Same order as `tournaments`.
 */
export const tournamentsData: TournamentData[] = [lacHongData, haNoiOpen1Data]
```

Trong `src/data/tournaments/index.ts`, đổi đúng một dòng - re-export type từ `./types` thay vì `./lac-hong`:

```ts
export type { Tournament, Prize, TournamentLinks, Venue } from './types'
```

Giữ nguyên mọi dòng còn lại (`import { lacHong } ...`, `export const tournaments`, `getTournamentBySlug`).

- [ ] **Step 5: Sửa hai import type còn trỏ vào `./lac-hong`**

`src/data/tournaments/_template.ts` dòng 1 và bất kỳ chỗ nào khác đang có `import type { Tournament } from './lac-hong'` phải đổi thành `from './types'`.

Tìm cho chắc: `grep -rn "from './lac-hong'" src/data/tournaments`
Expected sau khi sửa: chỉ còn `index.ts` (import giá trị `lacHong`) và không còn dòng import type nào.

- [ ] **Step 6: Viết lại `_template.ts` cho khớp cấu trúc mới**

Mẫu phải dạy đúng quy trình hai file, nếu không lần thêm giải sau sẽ làm sai và build đổ. Nội dung:

```ts
import type { TournamentData } from './types'

/**
 * Mẫu thêm giải đấu mới - cấu trúc hai lớp:
 *
 * 1. Copy file này thành `ten-giai.data.ts`, điền đầy đủ field bên dưới.
 *    File .data.ts KHÔNG được import ảnh - vite.config.ts đọc nó lúc build,
 *    trước khi alias @/ tồn tại.
 * 2. Tạo `ten-giai.ts` chỉ để gắn banner:
 *      import banner from '@/assets/imgs/ten-giai-banner.webp'
 *      import type { Tournament } from './types'
 *      import { tenGiaiData } from './ten-giai.data'
 *      export const tenGiai: Tournament = { ...tenGiaiData, banner }
 * 3. Thêm vào `tournaments` trong index.ts và `tournamentsData` trong data.ts.
 * 4. Thêm URL vào `urls`/`includedRoutes` trong vite.config.ts và vào sitemap.ts.
 */
export const templateData: TournamentData = {
  // ... giữ nguyên toàn bộ field mẫu đang có trong _template.ts, bỏ dòng `banner`
}
```

- [ ] **Step 7: Cập nhật CONTRIBUTING.md**

Tìm phần hướng dẫn thêm giải đấu (`grep -n "giải đấu" CONTRIBUTING.md`) và sửa các bước cho khớp cấu trúc hai lớp ở Step 6. Bắt buộc nêu rõ **vì sao** file `.data.ts` không được import ảnh, nếu không người sau sẽ gộp lại và làm đổ build.

- [ ] **Step 8: Chạy toàn bộ test - phải xanh mà KHÔNG sửa test nào**

Run: `npm run test:run`
Expected: PASS toàn bộ. Đặc biệt `src/data/tournaments/__tests__/`, `src/components/sections/__tests__/`, `src/components/__tests__/TournamentCard.spec.ts`, `src/lib/__tests__/structuredData.spec.ts` - tất cả đều import `lacHong` và không được sửa.

Nếu phải sửa một test để nó xanh, nghĩa là task này đã đổi hành vi. Quay lại xem đã bỏ sót field nào khi chép object literal.

- [ ] **Step 9: Type-check và build**

Run: `npm run type-check && npm run build`
Expected: xanh cả hai.

- [ ] **Step 10: Xác nhận `data.ts` nạp được trong ngữ cảnh config**

Đây là mục đích của cả task, phải kiểm chứng chứ không tin suông. Tạo file tạm ở gốc repo:

```bash
cat > vite.probe.config.ts <<'EOF'
import { defineConfig } from 'vite'
import { tournamentsData } from './src/data/tournaments/data'
console.log('PROBE_OK', tournamentsData.length, tournamentsData[0].slug)
export default defineConfig({})
EOF
npx vite build --config vite.probe.config.ts --logLevel error 2>&1 | head -5
rm -f vite.probe.config.ts
```

Expected: dòng đầu in ra `PROBE_OK 2 lac-hong`. Sau đó build sẽ báo lỗi `.vue` vì probe config không có plugin vue - **lỗi đó là bình thường và không liên quan**; điều cần thấy là `PROBE_OK` được in ra, tức config nạp thành công.

Nếu vẫn thấy `Cannot find package '@/assets'` thì còn một đường import ảnh lọt vào chuỗi phụ thuộc của `data.ts` - lần lại và cắt nó.

Nhớ xoá `vite.probe.config.ts`, đừng commit.

- [ ] **Step 11: Commit**

```bash
git add src/data/tournaments CONTRIBUTING.md
git commit -m "refactor(tournaments): split banner asset from tournament data

vite.config.ts is loaded before the @/ alias exists, so build tooling cannot
import a module that pulls in a .webp. Data now lives in asset-free .data.ts
files; the .ts files only bind the banner. No data values changed."
```

---

### Task 2: Markdown renderers

**Files:**
- Create: `src/lib/contentMarkdown.ts`
- Test: `src/lib/__tests__/contentMarkdown.spec.ts`

**Interfaces:**
- Consumes: `TournamentData` từ `@/data/tournaments/types` (Task 1); `Guide` từ `@/data/guides`; `NewsPost` từ `@/data/news`; `FaqItem` từ `@/data/faq`; `site` từ `@/data/site`.
- Produces:
  - `guideToMarkdown(guide: Guide, site: Site): string`
  - `newsPostToMarkdown(post: NewsPost, site: Site): string`
  - `faqToMarkdown(items: FaqItem[], site: Site): string`
  - `tournamentToMarkdown(tournament: TournamentData, site: Site): string`
  - `type Site = typeof siteData` khai nội bộ, không export - giống `structuredData.ts` đang làm.

- [ ] **Step 1: Viết test thất bại**

Tạo `src/lib/__tests__/contentMarkdown.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  guideToMarkdown,
  newsPostToMarkdown,
  faqToMarkdown,
  tournamentToMarkdown,
} from '@/lib/contentMarkdown'
import { site } from '@/data/site'
import { lacHong } from '@/data/tournaments/lac-hong'
import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { FaqItem } from '@/data/faq'

const guide = (over: Partial<Guide> = {}): Guide => ({
  slug: 'build-order-co-ban',
  title: 'Build order cơ bản Đế chế 4',
  description: 'Thứ tự xây dựng mở đầu cho người mới.',
  updatedAt: '2026-08-01',
  sections: [
    { heading: 'Mở đầu', paragraphs: ['Đoạn một.', 'Đoạn hai.'] },
    {
      heading: 'Lên đời',
      paragraphs: ['Đoạn ba.'],
      link: { slug: 'cach-tai-aoe4', label: 'Cách tải game' },
    },
  ],
  ...over,
})

const post = (over: Partial<NewsPost> = {}): NewsPost => ({
  slug: 'ra-mat-tin-tuc',
  title: 'Ra mắt chuyên mục tin tức',
  description: 'Chuyên mục mới cho cộng đồng.',
  publishedAt: '2026-08-02',
  sources: [{ label: 'Trang chủ Age of Empires', url: 'https://www.ageofempires.com/' }],
  sections: [{ heading: 'Có gì mới', paragraphs: ['Đoạn tin.'] }],
  ...over,
})

describe('guideToMarkdown', () => {
  it('phát H1 là tiêu đề, rồi description', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain('# Build order cơ bản Đế chế 4')
    expect(md).toContain('Thứ tự xây dựng mở đầu cho người mới.')
  })

  it('phát mỗi section thành H2 kèm đủ mọi paragraph', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain('## Mở đầu')
    expect(md).toContain('Đoạn một.')
    expect(md).toContain('Đoạn hai.')
    expect(md).toContain('## Lên đời')
    expect(md).toContain('Đoạn ba.')
  })

  it('link nội bộ trỏ bản HTML tuyệt đối có dấu / cuối, không trỏ .md', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain(`[Cách tải game](${site.url}/guides/cach-tai-aoe4/)`)
    expect(md).not.toContain('cach-tai-aoe4.md')
  })

  it('ghi URL canonical và ngày cập nhật của chính bài', () => {
    const md = guideToMarkdown(guide(), site)
    expect(md).toContain(`${site.url}/guides/build-order-co-ban/`)
    expect(md).toContain('2026-08-01')
  })

  it('phát khối Nguồn tham khảo khi guide có sources', () => {
    const md = guideToMarkdown(guide({ sources: ['https://liquipedia.net/ageofempires/'] }), site)
    expect(md).toContain('## Nguồn tham khảo')
    expect(md).toContain('- https://liquipedia.net/ageofempires/')
  })

  it('không phát khối Nguồn tham khảo khi guide không có sources', () => {
    expect(guideToMarkdown(guide(), site)).not.toContain('## Nguồn tham khảo')
  })

  it('ném lỗi khi guide không có section nào', () => {
    expect(() => guideToMarkdown(guide({ sections: [] }), site)).toThrow(/không có section/)
  })
})

describe('newsPostToMarkdown', () => {
  it('phát tiêu đề, ngày đăng và nội dung', () => {
    const md = newsPostToMarkdown(post(), site)
    expect(md).toContain('# Ra mắt chuyên mục tin tức')
    expect(md).toContain('2026-08-02')
    expect(md).toContain('## Có gì mới')
    expect(md).toContain('Đoạn tin.')
  })

  it('phát nguồn dạng link có nhãn', () => {
    const md = newsPostToMarkdown(post(), site)
    expect(md).toContain('## Nguồn tham khảo')
    expect(md).toContain('- [Trang chủ Age of Empires](https://www.ageofempires.com/)')
  })

  it('ghi thêm ngày cập nhật khi có', () => {
    expect(newsPostToMarkdown(post({ updatedAt: '2026-08-05' }), site)).toContain('2026-08-05')
  })
})

describe('faqToMarkdown', () => {
  const items: FaqItem[] = [
    { question: 'Đế chế 4 là gì?', answer: 'Là game chiến thuật thời gian thực.' },
    {
      question: 'Tải ở đâu?',
      answer: 'Trên Steam.',
      guide: { slug: 'cach-tai-aoe4', label: 'Xem cách tải' },
    },
  ]

  it('phát mỗi câu hỏi thành H2 kèm câu trả lời', () => {
    const md = faqToMarkdown(items, site)
    expect(md).toContain('## Đế chế 4 là gì?')
    expect(md).toContain('Là game chiến thuật thời gian thực.')
    expect(md).toContain('## Tải ở đâu?')
  })

  it('phát link tới guide khi câu hỏi có', () => {
    expect(faqToMarkdown(items, site)).toContain(
      `[Xem cách tải](${site.url}/guides/cach-tai-aoe4/)`,
    )
  })
})

describe('tournamentToMarkdown', () => {
  it('nhận Tournament đầy đủ dù chỉ khai tham số là TournamentData', () => {
    const md = tournamentToMarkdown(lacHong, site)
    expect(md).toContain(`# ${lacHong.name}`)
  })

  it('phát dạng danh sách fact, không dựng đoạn văn', () => {
    const md = tournamentToMarkdown(lacHong, site)
    expect(md).toContain(`- Thời gian: ${lacHong.dateLabel}`)
    expect(md).toContain(`- Địa điểm: ${lacHong.venue.name}`)
    expect(md).toContain(`- Tổng giải thưởng: ${lacHong.prizePoolTotal}`)
  })

  it('không nhắc tới banner', () => {
    expect(tournamentToMarkdown(lacHong, site)).not.toContain('.webp')
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó đỏ**

Run: `npx vitest run src/lib/__tests__/contentMarkdown.spec.ts`
Expected: FAIL - `Failed to resolve import "@/lib/contentMarkdown"`.

- [ ] **Step 3: Viết implementation tối thiểu**

Tạo `src/lib/contentMarkdown.ts`:

```ts
import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { FaqItem } from '@/data/faq'
import type { TournamentData } from '@/data/tournaments/types'
import type { site as siteData } from '@/data/site'

type Site = typeof siteData

/** Absolute canonical URL of a content page, always with a trailing slash. */
function pageUrl(site: Site, path: string): string {
  return `${site.url}${path}`
}

/** Join non-empty blocks with one blank line between them, ending in a newline. */
function joinBlocks(blocks: string[]): string {
  return `${blocks.filter((b) => b.trim().length > 0).join('\n\n')}\n`
}

/** Markdown link to a guide's canonical HTML page, never to its .md mirror. */
function guideLink(site: Site, slug: string, label: string): string {
  return `Xem thêm: [${label}](${pageUrl(site, `/guides/${slug}/`)})`
}

export function guideToMarkdown(guide: Guide, site: Site): string {
  if (!guide.slug) throw new Error('guideToMarkdown: guide thiếu slug')
  if (guide.sections.length === 0) {
    throw new Error(`guideToMarkdown: guide "${guide.slug}" không có section nào`)
  }

  const blocks = [
    `# ${guide.title}`,
    guide.description,
    `Nguồn: ${pageUrl(site, `/guides/${guide.slug}/`)} · Cập nhật: ${guide.updatedAt}`,
  ]

  for (const section of guide.sections) {
    blocks.push(`## ${section.heading}`)
    blocks.push(...section.paragraphs)
    if (section.link) blocks.push(guideLink(site, section.link.slug, section.link.label))
  }

  if (guide.sources && guide.sources.length > 0) {
    blocks.push('## Nguồn tham khảo')
    blocks.push(guide.sources.map((url) => `- ${url}`).join('\n'))
  }

  return joinBlocks(blocks)
}

export function newsPostToMarkdown(post: NewsPost, site: Site): string {
  if (!post.slug) throw new Error('newsPostToMarkdown: post thiếu slug')
  if (post.sections.length === 0) {
    throw new Error(`newsPostToMarkdown: post "${post.slug}" không có section nào`)
  }

  const updated = post.updatedAt ? ` · Cập nhật: ${post.updatedAt}` : ''
  const blocks = [
    `# ${post.title}`,
    post.description,
    `Nguồn: ${pageUrl(site, `/news/${post.slug}/`)} · Đăng: ${post.publishedAt}${updated}`,
  ]

  for (const section of post.sections) {
    blocks.push(`## ${section.heading}`)
    blocks.push(...section.paragraphs)
  }

  if (post.sources.length > 0) {
    blocks.push('## Nguồn tham khảo')
    blocks.push(post.sources.map((s) => `- [${s.label}](${s.url})`).join('\n'))
  }

  return joinBlocks(blocks)
}

export function faqToMarkdown(items: FaqItem[], site: Site): string {
  if (items.length === 0) throw new Error('faqToMarkdown: không có câu hỏi nào')

  const blocks = [
    '# Đế chế 4 - câu hỏi thường gặp',
    'Giải đáp nhanh cho người mới tìm hiểu Đế chế 4.',
    `Nguồn: ${pageUrl(site, '/faq/')}`,
  ]

  for (const item of items) {
    blocks.push(`## ${item.question}`)
    blocks.push(item.answer)
    if (item.guide) blocks.push(guideLink(site, item.guide.slug, item.guide.label))
  }

  return joinBlocks(blocks)
}

export function tournamentToMarkdown(tournament: TournamentData, site: Site): string {
  if (!tournament.slug) throw new Error('tournamentToMarkdown: giải đấu thiếu slug')

  const facts = [
    `- Thể thức: ${tournament.format} · ${tournament.bracketFormat}`,
    `- Thời gian: ${tournament.dateLabel}`,
    `- Địa điểm: ${tournament.venue.name}, ${tournament.venue.address}`,
    `- Ban tổ chức: ${tournament.organizer}`,
    `- Lệ phí: ${tournament.entryFee}`,
    `- Tổng giải thưởng: ${tournament.prizePoolTotal}`,
    `- Hạn đăng ký: ${tournament.registrationDeadline}`,
  ]

  return joinBlocks([
    `# ${tournament.name}`,
    `Giải ${tournament.game} do ${tournament.organizer} tổ chức.`,
    `Nguồn: ${pageUrl(site, `/tournaments/${tournament.slug}/`)}`,
    facts.join('\n'),
  ])
}
```

- [ ] **Step 4: Chạy test để xác nhận xanh**

Run: `npx vitest run src/lib/__tests__/contentMarkdown.spec.ts`
Expected: PASS, toàn bộ.

- [ ] **Step 5: Commit**

```bash
git add src/lib/contentMarkdown.ts src/lib/__tests__/contentMarkdown.spec.ts
git commit -m "feat(llm): render guides, news, FAQ and tournaments to Markdown"
```

---

### Task 3: llms.txt builders và test chống lệch

**Files:**
- Create: `src/lib/llmsTxt.ts`
- Test: `src/lib/__tests__/llmsTxt.spec.ts`

**Interfaces:**
- Consumes: bốn hàm từ `@/lib/contentMarkdown` (Task 2); `tournamentsData` từ `@/data/tournaments/data` (Task 1).
- Produces:
  - `interface LlmsInput { site: Site; guides: Guide[]; news: NewsPost[]; faq: FaqItem[]; tournaments: TournamentData[] }` (export)
  - `interface GeneratedFile { path: string; content: string }` (export) - `path` tương đối so với `dist`, dùng `/`, không có `/` đầu.
  - `buildLlmsTxt(input: LlmsInput): string`
  - `buildLlmsFullTxt(input: LlmsInput): string`
  - `buildMarkdownFiles(input: LlmsInput): GeneratedFile[]`

- [ ] **Step 1: Viết test thất bại**

Tạo `src/lib/__tests__/llmsTxt.spec.ts`. Khối `describe('chống lệch...')` chạy trên **dữ liệu thật** - đó là lý do chính file này tồn tại:

```ts
import { describe, it, expect } from 'vitest'
import { buildLlmsTxt, buildLlmsFullTxt, buildMarkdownFiles } from '@/lib/llmsTxt'
import type { LlmsInput } from '@/lib/llmsTxt'
import { site } from '@/data/site'
import { guides } from '@/data/guides'
import { newsPosts } from '@/data/news'
import { faqItems } from '@/data/faq'
import { tournamentsData } from '@/data/tournaments/data'

const realInput: LlmsInput = {
  site,
  guides,
  news: newsPosts,
  faq: faqItems,
  tournaments: tournamentsData,
}

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt(realInput)

  it('mở đầu bằng H1 tên site và một dòng blockquote mô tả', () => {
    expect(txt.startsWith(`# ${site.name}\n`)).toBe(true)
    expect(txt).toContain(`> ${site.description}`)
  })

  it('trỏ tới bản đầy đủ', () => {
    expect(txt).toContain(`${site.url}/llms-full.txt`)
  })

  it('có đủ bốn mục lục', () => {
    expect(txt).toContain('## Hướng dẫn')
    expect(txt).toContain('## Tin tức')
    expect(txt).toContain('## Câu hỏi thường gặp')
    expect(txt).toContain('## Giải đấu')
  })

  it('mục lục guide trỏ bản .md kèm description', () => {
    const g = guides[0]
    expect(txt).toContain(`- [${g.title}](${site.url}/guides/${g.slug}.md): ${g.description}`)
  })

  it('giải đấu trỏ bản HTML chứ không phải .md', () => {
    const t = tournamentsData[0]
    expect(txt).toContain(`(${site.url}/tournaments/${t.slug}/)`)
    expect(txt).not.toContain(`/tournaments/${t.slug}.md`)
  })
})

describe('buildLlmsFullTxt', () => {
  const txt = buildLlmsFullTxt(realInput)

  it('ngăn cách các bài bằng đường kẻ ngang', () => {
    expect(txt).toContain('\n\n---\n\n')
  })

  it('chứa toàn văn, không chỉ tiêu đề', () => {
    expect(txt).toContain(guides[0].sections[0].paragraphs[0])
  })
})

describe('buildMarkdownFiles', () => {
  it('luôn sinh faq.md', () => {
    expect(buildMarkdownFiles(realInput).map((f) => f.path)).toContain('faq.md')
  })

  it('mọi path đều tương đối, không có dấu / đầu', () => {
    for (const file of buildMarkdownFiles(realInput)) {
      expect(file.path.startsWith('/')).toBe(false)
    }
  })

  it('không có file rỗng', () => {
    for (const file of buildMarkdownFiles(realInput)) {
      expect(file.content.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('chống lệch với dữ liệu thật', () => {
  const txt = buildLlmsTxt(realInput)
  const full = buildLlmsFullTxt(realInput)
  const paths = buildMarkdownFiles(realInput).map((f) => f.path)

  it.each(guides.map((g) => [g.slug, g.title] as const))(
    'guide %s có mục trong llms.txt, có file .md và có mặt trong llms-full.txt',
    (slug, title) => {
      expect(txt).toContain(`${site.url}/guides/${slug}.md`)
      expect(paths).toContain(`guides/${slug}.md`)
      expect(full).toContain(title)
    },
  )

  it.each(newsPosts.map((p) => [p.slug, p.title] as const))(
    'news %s có mục trong llms.txt, có file .md và có mặt trong llms-full.txt',
    (slug, title) => {
      expect(txt).toContain(`${site.url}/news/${slug}.md`)
      expect(paths).toContain(`news/${slug}.md`)
      expect(full).toContain(title)
    },
  )

  it.each(tournamentsData.map((t) => [t.slug, t.name] as const))(
    'giải %s có mục trong llms.txt và trong llms-full.txt',
    (slug, name) => {
      expect(txt).toContain(`/tournaments/${slug}/`)
      expect(full).toContain(name)
    },
  )

  it('sinh đúng số file: mỗi guide một file, mỗi news một file, cộng faq.md', () => {
    expect(paths).toHaveLength(guides.length + newsPosts.length + 1)
  })

  it('không có path trùng nhau', () => {
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('ném lỗi khi hai bài trùng slug', () => {
    const dup = { ...realInput, guides: [guides[0], guides[0]] }
    expect(() => buildMarkdownFiles(dup)).toThrow(/trùng/)
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó đỏ**

Run: `npx vitest run src/lib/__tests__/llmsTxt.spec.ts`
Expected: FAIL - `Failed to resolve import "@/lib/llmsTxt"`.

- [ ] **Step 3: Viết implementation tối thiểu**

Tạo `src/lib/llmsTxt.ts`:

```ts
import type { Guide } from '@/data/guides'
import type { NewsPost } from '@/data/news'
import type { FaqItem } from '@/data/faq'
import type { TournamentData } from '@/data/tournaments/types'
import type { site as siteData } from '@/data/site'
import {
  guideToMarkdown,
  newsPostToMarkdown,
  faqToMarkdown,
  tournamentToMarkdown,
} from '@/lib/contentMarkdown'

type Site = typeof siteData

export interface LlmsInput {
  site: Site
  guides: Guide[]
  news: NewsPost[]
  faq: FaqItem[]
  tournaments: TournamentData[]
}

export interface GeneratedFile {
  /** Path relative to dist, forward slashes, no leading slash. */
  path: string
  content: string
}

/** Newest first, matching the order NewsView shows to readers. */
function newestFirst(news: NewsPost[]): NewsPost[] {
  return [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/** Shared opening block of both llms.txt and llms-full.txt. */
function header(site: Site): string {
  return [`# ${site.name}`, '', `> ${site.description} Toàn bộ nội dung viết bằng tiếng Việt.`].join(
    '\n',
  )
}

export function buildLlmsTxt(input: LlmsInput): string {
  const { site, guides, faq, tournaments } = input
  const news = newestFirst(input.news)

  const lines = [
    header(site),
    '',
    `Bản đầy đủ gộp một file: ${site.url}/llms-full.txt`,
    '',
    '## Hướng dẫn',
    '',
    ...guides.map((g) => `- [${g.title}](${site.url}/guides/${g.slug}.md): ${g.description}`),
    '',
    '## Tin tức',
    '',
    ...news.map((p) => `- [${p.title}](${site.url}/news/${p.slug}.md): ${p.description}`),
    '',
    '## Câu hỏi thường gặp',
    '',
    `- [Đế chế 4 - câu hỏi thường gặp](${site.url}/faq.md): ${faq.length} câu giải đáp nhanh cho người mới.`,
    '',
    '## Giải đấu',
    '',
    ...tournaments.map(
      (t) =>
        `- [${t.name}](${site.url}/tournaments/${t.slug}/): ${t.dateLabel}, ${t.venue.name}, tổng giải thưởng ${t.prizePoolTotal}.`,
    ),
  ]

  return `${lines.join('\n')}\n`
}

export function buildLlmsFullTxt(input: LlmsInput): string {
  const { site, guides, faq, tournaments } = input
  const news = newestFirst(input.news)

  const parts = [
    `${header(site)}\n\nBản mục lục: ${site.url}/llms.txt`,
    faqToMarkdown(faq, site).trimEnd(),
    ...guides.map((g) => guideToMarkdown(g, site).trimEnd()),
    ...news.map((p) => newsPostToMarkdown(p, site).trimEnd()),
    ...tournaments.map((t) => tournamentToMarkdown(t, site).trimEnd()),
  ]

  return `${parts.join('\n\n---\n\n')}\n`
}

export function buildMarkdownFiles(input: LlmsInput): GeneratedFile[] {
  const { site, guides, faq } = input

  const files: GeneratedFile[] = [
    { path: 'faq.md', content: faqToMarkdown(faq, site) },
    ...guides.map((g) => ({ path: `guides/${g.slug}.md`, content: guideToMarkdown(g, site) })),
    ...input.news.map((p) => ({ path: `news/${p.slug}.md`, content: newsPostToMarkdown(p, site) })),
  ]

  const seen = new Set<string>()
  for (const file of files) {
    if (seen.has(file.path)) throw new Error(`buildMarkdownFiles: path trùng "${file.path}"`)
    seen.add(file.path)
  }

  return files
}
```

- [ ] **Step 4: Chạy test để xác nhận xanh**

Run: `npx vitest run src/lib/__tests__/llmsTxt.spec.ts`
Expected: PASS. Số ca `it.each` bằng số guide (11) cộng news (1) cộng giải đấu (2).

- [ ] **Step 5: Commit**

```bash
git add src/lib/llmsTxt.ts src/lib/__tests__/llmsTxt.spec.ts
git commit -m "feat(llm): build llms.txt, llms-full.txt and per-article Markdown files"
```

---

### Task 4: Ghi file lúc build

**Files:**
- Modify: `vite.config.ts` (khối import ở đầu file, và `onFinished` trong `ssgOptions`)

**Interfaces:**
- Consumes: `buildLlmsTxt`, `buildLlmsFullTxt`, `buildMarkdownFiles` (Task 3); `tournamentsData` (Task 1).
- Produces: file thật trong `dist/`. Không có API mới.

**Bắt buộc:** import `tournamentsData` từ `./src/data/tournaments/data`, **không phải** từ `./src/data/tournaments` - import cái sau sẽ kéo theo `.webp` và làm đổ toàn bộ build (lý do Task 1 tồn tại). File này dùng đường dẫn tương đối, không dùng alias `@/`.

- [ ] **Step 1: Thêm import**

Đổi hai dòng node builtin hiện có:

```ts
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
```

thành:

```ts
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
```

Và ngay dưới `import { buildSitemapXml } from './src/lib/sitemap'`, thêm:

```ts
import { site } from './src/data/site'
import { faqItems } from './src/data/faq'
import { tournamentsData } from './src/data/tournaments/data'
import { buildLlmsTxt, buildLlmsFullTxt, buildMarkdownFiles } from './src/lib/llmsTxt'
```

- [ ] **Step 2: Ghi file trong onFinished**

`onFinished` hiện là:

```ts
    onFinished() {
      writeFileSync('dist/sitemap.xml', buildSitemapXml('https://aoe4.vn', guides, newsPosts))
      assertPagesDeclareVietnamese('dist')
    },
```

Đổi thành:

```ts
    onFinished() {
      writeFileSync('dist/sitemap.xml', buildSitemapXml('https://aoe4.vn', guides, newsPosts))

      // Machine-readable mirror for LLM crawlers. Same data as the HTML pages,
      // rendered by pure functions in src/lib so it can never drift untested.
      const llmsInput = {
        site,
        guides,
        news: newsPosts,
        faq: faqItems,
        tournaments: tournamentsData,
      }
      writeFileSync('dist/llms.txt', buildLlmsTxt(llmsInput))
      writeFileSync('dist/llms-full.txt', buildLlmsFullTxt(llmsInput))
      for (const file of buildMarkdownFiles(llmsInput)) {
        const target = join('dist', file.path)
        mkdirSync(dirname(target), { recursive: true })
        writeFileSync(target, file.content)
      }

      assertPagesDeclareVietnamese('dist')
    },
```

- [ ] **Step 3: Chạy build**

Run: `npm run build`
Expected: build xanh. Nếu thấy `Cannot find package '@/assets'` thì import sai đường dẫn ở Step 1 - phải là `./src/data/tournaments/data`.

- [ ] **Step 4: Kiểm tra file được ghi thật**

Run:

```bash
ls dist/llms.txt dist/llms-full.txt dist/faq.md
ls dist/guides/*.md | wc -l
ls dist/news/*.md | wc -l
head -20 dist/llms.txt
```

Expected: ba file đầu tồn tại; `dist/guides/*.md` đếm được **11**; `dist/news/*.md` đếm được **1**; `head` in ra `# AoE4 VN` rồi dòng blockquote.

Nếu số file không khớp, dừng lại - đó là dấu hiệu `buildMarkdownFiles` lệch với data, đúng thứ Task 3 định bắt.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts
git commit -m "build: emit llms.txt and Markdown mirrors into dist"
```

---

### Task 5: robots.txt khai báo AI crawler

**Files:**
- Modify: `public/robots.txt`

**Interfaces:**
- Consumes: không có. Task này độc lập hoàn toàn.
- Produces: không có API.

- [ ] **Step 1: Viết lại file**

Thay toàn bộ nội dung `public/robots.txt` bằng:

```
# aoe4.vn - cộng đồng Age of Empires IV Việt Nam
# Toàn bộ nội dung mở cho cả công cụ tìm kiếm lẫn trợ lý AI.
# Machine-readable index: https://aoe4.vn/llms.txt

User-agent: *
Allow: /

# AI assistants and answer engines - explicitly allowed.
# A bot with its own group ignores the "*" group entirely, so this block is
# equivalent in effect; it exists to state intent and to give a single place
# to change policy for one bot later.
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
User-agent: Bytespider
User-agent: meta-externalagent
User-agent: Amazonbot
User-agent: DuckAssistBot
User-agent: cohere-ai
Allow: /

Sitemap: https://aoe4.vn/sitemap.xml
```

Ba điều **không** được làm, ghi rõ để người sau không sửa nhầm:

1. Không bịa ra directive `Llms:` - robots.txt không có chuẩn nào cho nó. Dòng trỏ `llms.txt` cố ý để dạng comment.
2. Không xoá nhóm `User-agent: *` - crawler không nằm trong danh sách vẫn cần nó.
3. Không đổi `Allow: /` thành `Disallow:` cho bất kỳ bot nào; quyết định "mở hết" đã chốt ở spec mục 2.

- [ ] **Step 2: Đếm cho chắc**

Run: `grep -c '^User-agent:' public/robots.txt`
Expected: **17** (16 bot AI cộng dòng `*`).

Run: `grep -c '^Sitemap:' public/robots.txt`
Expected: **1**.

- [ ] **Step 3: Commit**

```bash
git add public/robots.txt
git commit -m "feat(seo): declare AI crawlers explicitly in robots.txt"
```

---

### Task 6: Trường author tuỳ chọn và làm giàu Article JSON-LD

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/lib/structuredData.ts` (hàm `guideArticleJsonLd`, `newsArticleJsonLd`)
- Test: `src/lib/__tests__/structuredData.spec.ts` (bổ sung vào file có sẵn)

**Interfaces:**
- Consumes: `Guide`, `NewsPost`, `site`.
- Produces:
  - `site.author: { name: string; url: string }` - **mặc định giao hàng là hai chuỗi rỗng**, tức hành vi không đổi.
  - `guideArticleJsonLd(guide, site)` và `newsArticleJsonLd(post, site)` giữ nguyên chữ ký, thêm khoá `inLanguage`, `isPartOf`, `about`, và `citation` (có điều kiện).

- [ ] **Step 1: Viết test thất bại**

Thêm vào cuối `src/lib/__tests__/structuredData.spec.ts`. File này đã import sẵn `guideArticleJsonLd`, `newsArticleJsonLd`, `downloadGuide`, `site`, và `type { NewsPost }` - dùng lại, đừng import trùng.

```ts
describe('Article được làm giàu cho GEO', () => {
  const postWithSources: NewsPost = {
    slug: 'tin-mau',
    title: 'Tin mẫu',
    description: 'Mô tả tin mẫu.',
    publishedAt: '2026-08-02',
    sources: [{ label: 'Patch notes chính thức', url: 'https://www.ageofempires.com/news/' }],
    sections: [{ heading: 'Nội dung', paragraphs: ['Đoạn.'] }],
  }

  it('guide khai báo ngôn ngữ, thuộc về WebSite và nói về game nào', () => {
    const ld = guideArticleJsonLd(downloadGuide, site)
    expect(ld.inLanguage).toBe('vi-VN')
    expect(ld.isPartOf).toMatchObject({ '@type': 'WebSite', url: `${site.url}/` })
    expect(ld.about).toMatchObject({ '@type': 'VideoGame', name: 'Age of Empires IV' })
  })

  it('news cũng khai báo ba trường đó', () => {
    const ld = newsArticleJsonLd(postWithSources, site)
    expect(ld.inLanguage).toBe('vi-VN')
    expect(ld.isPartOf).toMatchObject({ '@type': 'WebSite' })
    expect(ld.about).toMatchObject({ '@type': 'VideoGame' })
  })

  it('news phát citation kèm nhãn nguồn', () => {
    const ld = newsArticleJsonLd(postWithSources, site)
    expect(ld.citation).toEqual([
      {
        '@type': 'CreativeWork',
        name: 'Patch notes chính thức',
        url: 'https://www.ageofempires.com/news/',
      },
    ])
  })

  it('guide có sources thì phát citation chỉ gồm url', () => {
    const ld = guideArticleJsonLd(
      { ...downloadGuide, sources: ['https://liquipedia.net/ageofempires/'] },
      site,
    )
    expect(ld.citation).toEqual([
      { '@type': 'CreativeWork', url: 'https://liquipedia.net/ageofempires/' },
    ])
  })

  it('guide không có sources thì bỏ hẳn khoá citation, không phát mảng rỗng', () => {
    const ld = guideArticleJsonLd({ ...downloadGuide, sources: undefined }, site)
    expect('citation' in ld).toBe(false)
  })

  it('news có sources rỗng cũng bỏ hẳn khoá citation', () => {
    const ld = newsArticleJsonLd({ ...postWithSources, sources: [] }, site)
    expect('citation' in ld).toBe(false)
  })

  it('author là Organization khi site.author.name rỗng', () => {
    const ld = guideArticleJsonLd(downloadGuide, { ...site, author: { name: '', url: '' } })
    expect(ld.author).toMatchObject({ '@type': 'Organization', name: site.name })
  })

  it('author thành Person khi owner đã điền tên', () => {
    const ld = guideArticleJsonLd(downloadGuide, {
      ...site,
      author: { name: 'Nguyễn Văn A', url: 'https://example.com/a' },
    })
    expect(ld.author).toEqual({
      '@type': 'Person',
      name: 'Nguyễn Văn A',
      url: 'https://example.com/a',
    })
  })

  it('Person bỏ khoá url khi owner chỉ điền tên', () => {
    const ld = guideArticleJsonLd(downloadGuide, {
      ...site,
      author: { name: 'Nguyễn Văn A', url: '' },
    })
    expect(ld.author).toEqual({ '@type': 'Person', name: 'Nguyễn Văn A' })
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó đỏ**

Run: `npx vitest run src/lib/__tests__/structuredData.spec.ts`
Expected: FAIL. `{ ...site, author: ... }` báo lỗi type vì `site` chưa có trường `author`, và mọi assertion về `inLanguage` / `citation` đều undefined.

- [ ] **Step 3: Thêm trường author vào site.ts**

Trong `src/data/site.ts`, thêm ngay sau khối `links`:

```ts
  /**
   * Tác giả mặc định cho bài viết, dùng cho tín hiệu E-E-A-T.
   * Để trống -> JSON-LD giữ nguyên author là Organization.
   */
  author: {
    name: '',
    url: '',
  },
```

Giữ nguyên giá trị rỗng. Đây là chỗ owner tự điền sau, không phải việc của PR này.

- [ ] **Step 4: Làm giàu hai hàm trong structuredData.ts**

Thêm ba helper ngay dưới hàm `absoluteUrl` có sẵn:

```ts
/** Person when the owner has filled in site.author, Organization otherwise. */
function articleAuthor(site: Site): Record<string, unknown> {
  if (!site.author.name) return { '@type': 'Organization', name: site.name }
  const person: Record<string, unknown> = { '@type': 'Person', name: site.author.name }
  if (site.author.url) person.url = site.author.url
  return person
}

/** Shared fields telling an answer engine what this article is and where it lives. */
function articleContext(site: Site): Record<string, unknown> {
  return {
    inLanguage: 'vi-VN',
    isPartOf: { '@type': 'WebSite', name: site.name, url: absoluteUrl(site.url, '/') },
    about: { '@type': 'VideoGame', name: 'Age of Empires IV' },
  }
}

/**
 * Schema.org citation list. Returns an empty object when there are no sources,
 * so spreading it omits the key entirely - an empty array trips Search Console.
 */
function citations(sources: Array<{ name?: string; url: string }>): Record<string, unknown> {
  if (sources.length === 0) return {}
  return {
    citation: sources.map((s) => ({
      '@type': 'CreativeWork',
      ...(s.name ? { name: s.name } : {}),
      url: s.url,
    })),
  }
}
```

Thay thân `guideArticleJsonLd` bằng:

```ts
export function guideArticleJsonLd(guide: Guide, site: Site): Record<string, unknown> {
  const url = absoluteUrl(site.url, `/guides/${guide.slug}/`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: absoluteUrl(site.url, '/og.jpg'),
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: url,
    ...articleContext(site),
    author: articleAuthor(site),
    publisher: { '@type': 'Organization', name: site.name },
    ...citations((guide.sources ?? []).map((u) => ({ url: u }))),
  }
}
```

Thay thân `newsArticleJsonLd` bằng:

```ts
export function newsArticleJsonLd(post: NewsPost, site: Site): Record<string, unknown> {
  const url = absoluteUrl(site.url, `/news/${post.slug}/`)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.description,
    image: absoluteUrl(site.url, '/og.jpg'),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: url,
    ...articleContext(site),
    author: articleAuthor(site),
    publisher: { '@type': 'Organization', name: site.name },
    ...citations(post.sources.map((s) => ({ name: s.label, url: s.url }))),
  }
}
```

- [ ] **Step 5: Chạy test để xác nhận xanh**

Run: `npx vitest run src/lib/__tests__/structuredData.spec.ts`
Expected: PASS, cả test cũ lẫn test mới.

- [ ] **Step 6: Commit**

```bash
git add src/data/site.ts src/lib/structuredData.ts src/lib/__tests__/structuredData.spec.ts
git commit -m "feat(seo): emit citation, language and site context in article JSON-LD"
```

---

### Task 7: breadcrumbJsonLd và collectionPageJsonLd

**Files:**
- Modify: `src/lib/structuredData.ts`
- Test: `src/lib/__tests__/structuredData.spec.ts`

**Interfaces:**
- Consumes: `absoluteUrl` (hàm private đã có trong file).
- Produces:
  - `breadcrumbJsonLd(trail: Array<{ name: string; path: string }>, site: Site): Record<string, unknown>`
  - `collectionPageJsonLd(page: { name: string; description: string; path: string }, items: Array<{ name: string; path: string }>, site: Site): Record<string, unknown>`
  - Task 8 gọi cả hai.

- [ ] **Step 1: Viết test thất bại**

Thêm hai tên `breadcrumbJsonLd`, `collectionPageJsonLd` vào khối import ở đầu `src/lib/__tests__/structuredData.spec.ts`, rồi thêm vào cuối file:

```ts
describe('breadcrumbJsonLd', () => {
  const ld = breadcrumbJsonLd(
    [
      { name: 'Trang chủ', path: '/' },
      { name: 'Hướng dẫn', path: '/guides/' },
      { name: 'Cách tải Đế chế 4', path: '/guides/cach-tai-aoe4/' },
    ],
    site,
  )
  const items = ld.itemListElement as Array<Record<string, unknown>>

  it('là BreadcrumbList hợp lệ', () => {
    expect(ld['@context']).toBe('https://schema.org')
    expect(ld['@type']).toBe('BreadcrumbList')
  })

  it('đánh position từ 1 và giữ đúng thứ tự', () => {
    expect(items.map((i) => i.position)).toEqual([1, 2, 3])
    expect(items.map((i) => i.name)).toEqual(['Trang chủ', 'Hướng dẫn', 'Cách tải Đế chế 4'])
  })

  it('mọi item là URL tuyệt đối có dấu / cuối', () => {
    for (const item of items) {
      expect(String(item.item).startsWith(site.url)).toBe(true)
      expect(String(item.item).endsWith('/')).toBe(true)
    }
  })
})

describe('collectionPageJsonLd', () => {
  const ld = collectionPageJsonLd(
    { name: 'Hướng dẫn Đế chế 4', description: 'Tổng hợp hướng dẫn.', path: '/guides/' },
    [
      { name: 'Bài một', path: '/guides/mot/' },
      { name: 'Bài hai', path: '/guides/hai/' },
    ],
    site,
  )
  const list = ld.mainEntity as Record<string, unknown>
  const items = list.itemListElement as Array<Record<string, unknown>>

  it('là CollectionPage bọc một ItemList', () => {
    expect(ld['@type']).toBe('CollectionPage')
    expect(list['@type']).toBe('ItemList')
    expect(list.numberOfItems).toBe(2)
  })

  it('mỗi mục có position, name và url tuyệt đối', () => {
    expect(items[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Bài một',
      url: `${site.url}/guides/mot/`,
    })
  })

  it('khai báo ngôn ngữ và url của chính trang', () => {
    expect(ld.inLanguage).toBe('vi-VN')
    expect(ld.url).toBe(`${site.url}/guides/`)
  })
})
```

- [ ] **Step 2: Chạy test để xác nhận nó đỏ**

Run: `npx vitest run src/lib/__tests__/structuredData.spec.ts`
Expected: FAIL - không tìm thấy export `breadcrumbJsonLd`.

- [ ] **Step 3: Viết implementation**

Thêm vào cuối `src/lib/structuredData.ts`:

```ts
/**
 * Schema.org BreadcrumbList. `trail` goes from the site root to the current
 * page; names must match the wording readers see in the navbar.
 */
export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
  site: Site,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: absoluteUrl(site.url, step.path),
    })),
  }
}

/** Schema.org CollectionPage wrapping an ItemList, for the guide and news indexes. */
export function collectionPageJsonLd(
  page: { name: string; description: string; path: string },
  items: Array<{ name: string; path: string }>,
  site: Site,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.name,
    description: page.description,
    url: absoluteUrl(site.url, page.path),
    inLanguage: 'vi-VN',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(site.url, item.path),
      })),
    },
  }
}
```

- [ ] **Step 4: Chạy test để xác nhận xanh**

Run: `npx vitest run src/lib/__tests__/structuredData.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/structuredData.ts src/lib/__tests__/structuredData.spec.ts
git commit -m "feat(seo): add BreadcrumbList and CollectionPage builders"
```

---

### Task 8: Gắn JSON-LD mới vào bảy view

**Files:**
- Modify: `src/views/GuideView.vue`, `src/views/NewsPostView.vue`, `src/views/TournamentDetailView.vue`, `src/views/GuidesView.vue`, `src/views/NewsView.vue`, `src/views/TournamentsView.vue`, `src/views/FAQView.vue`

**Interfaces:**
- Consumes: `breadcrumbJsonLd`, `collectionPageJsonLd` (Task 7).
- Produces: không có API mới.

**Tên breadcrumb phải khớp chữ trong navbar** (`src/components/AppNavbar.vue`): `Hỏi đáp`, `Giải đấu`, `Hướng dẫn`, `Tin tức`. Cấp gốc gọi là `Trang chủ`. Đừng tự đặt tên khác - người đọc thấy một đằng, breadcrumb nói một nẻo là mâu thuẫn.

- [ ] **Step 1: GuideView.vue**

Đổi dòng import có sẵn:

```ts
import { guideArticleJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'
```

Trong `useHead(() => {...})`, thay mảng `script` bằng:

```ts
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(guideArticleJsonLd(g, site)) },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(
          breadcrumbJsonLd(
            [
              { name: 'Trang chủ', path: '/' },
              { name: 'Hướng dẫn', path: '/guides/' },
              { name: g.title, path: `/guides/${g.slug}/` },
            ],
            site,
          ),
        ),
      },
    ],
```

- [ ] **Step 2: NewsPostView.vue**

Import:

```ts
import { newsArticleJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'
```

Mảng `script`:

```ts
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(newsArticleJsonLd(p, site)) },
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(
          breadcrumbJsonLd(
            [
              { name: 'Trang chủ', path: '/' },
              { name: 'Tin tức', path: '/news/' },
              { name: p.title, path: `/news/${p.slug}/` },
            ],
            site,
          ),
        ),
      },
    ],
```

- [ ] **Step 3: TournamentDetailView.vue**

View này dùng `useHead(() => ({...}))` với `script` là biểu thức ba ngôi trên `tournament.value`. Import:

```ts
import { tournamentEventJsonLd, breadcrumbJsonLd } from '@/lib/structuredData'
```

Thay nhánh `script`:

```ts
  script: tournament.value
    ? [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(tournamentEventJsonLd(tournament.value, site)),
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(
            breadcrumbJsonLd(
              [
                { name: 'Trang chủ', path: '/' },
                { name: 'Giải đấu', path: '/tournaments/' },
                { name: tournament.value.name, path: `/tournaments/${tournament.value.slug}/` },
              ],
              site,
            ),
          ),
        },
      ]
    : [],
```

- [ ] **Step 4: GuidesView.vue**

Thêm import (view này chưa import gì từ `structuredData`):

```ts
import { breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/structuredData'
```

Thêm khoá `script` vào lời gọi `useHead({...})` có sẵn, ngay sau mảng `meta`. View này đã có sẵn hai const `title` và `description` - dùng lại chúng:

```ts
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        collectionPageJsonLd(
          { name: title, description, path: '/guides/' },
          guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}/` })),
          site,
        ),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd(
          [
            { name: 'Trang chủ', path: '/' },
            { name: 'Hướng dẫn', path: '/guides/' },
          ],
          site,
        ),
      ),
    },
  ],
```

- [ ] **Step 5: NewsView.vue**

Import giống Step 4. View này đã có biến `posts` (đã sắp mới nhất trước) - **dùng `posts`, không dùng `newsPosts` thô**, để thứ tự trong ItemList khớp thứ tự người đọc thấy:

```ts
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        collectionPageJsonLd(
          { name: title, description, path: '/news/' },
          posts.map((p) => ({ name: p.title, path: `/news/${p.slug}/` })),
          site,
        ),
      ),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd(
          [
            { name: 'Trang chủ', path: '/' },
            { name: 'Tin tức', path: '/news/' },
          ],
          site,
        ),
      ),
    },
  ],
```

- [ ] **Step 6: TournamentsView.vue và FAQView.vue**

Chỉ thêm breadcrumb, **không** thêm CollectionPage (spec mục 6.3 loại trừ `/tournaments`; `/faq` đã có `FAQPage`).

`TournamentsView.vue` - thêm `import { breadcrumbJsonLd } from '@/lib/structuredData'` và thêm khoá `script` vào `useHead({...})`:

```ts
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd(
          [
            { name: 'Trang chủ', path: '/' },
            { name: 'Giải đấu', path: '/tournaments/' },
          ],
          site,
        ),
      ),
    },
  ],
```

`FAQView.vue` - đã có `script: [{ type: 'application/ld+json', innerHTML: faqJsonLd }]`. Thêm `import { breadcrumbJsonLd } from '@/lib/structuredData'` rồi **nối thêm** phần tử thứ hai, giữ nguyên phần tử FAQPage:

```ts
  script: [
    { type: 'application/ld+json', innerHTML: faqJsonLd },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbJsonLd(
          [
            { name: 'Trang chủ', path: '/' },
            { name: 'Hỏi đáp', path: '/faq/' },
          ],
          site,
        ),
      ),
    },
  ],
```

- [ ] **Step 7: Chạy toàn bộ test**

Run: `npm run test:run`
Expected: PASS toàn bộ, gồm cả `src/__tests__/accessibility.spec.ts`. Không sửa file spec đó - JSON-LD nằm trong `<head>`, axe không đụng tới.

- [ ] **Step 8: Xác nhận JSON-LD thật sự lên trang pre-render**

Run:

```bash
npm run build
grep -c 'BreadcrumbList' dist/guides/cach-tai-aoe4/index.html
grep -c 'CollectionPage' dist/guides/index.html
grep -c 'citation' dist/news/ra-mat-chuyen-muc-tin-tuc/index.html
```

Expected: cả ba lệnh in ra **1**.

Nếu ra `0`, vấn đề nằm ở `onPageRendered` / unhead chứ không phải ở JSON-LD builder - kiểm tra rằng khoá `script` nằm **bên trong** lời gọi `useHead`, không phải ngoài nó.

- [ ] **Step 9: Commit**

```bash
git add src/views/
git commit -m "feat(seo): add breadcrumb and collection JSON-LD to every listing and detail page"
```

---

### Task 9: Gate cuối và mở PR

**Files:** không sửa file nào; chỉ chạy kiểm tra và mở PR.

- [ ] **Step 1: Chạy đủ bộ gate của CLAUDE.md**

Run: `npm run lint:check && npm run type-check && npm run test:run`
Expected: cả ba xanh. Không được mở PR nếu còn đỏ.

- [ ] **Step 2: Chạy build**

Run: `npm run build`
Expected: xanh, gồm cả `assertPagesDeclareVietnamese`.

- [ ] **Step 3: Xác nhận từng tiêu chí hoàn thành của spec**

Run:

```bash
ls dist/llms.txt dist/llms-full.txt dist/faq.md
ls dist/guides/*.md | wc -l
ls dist/news/*.md | wc -l
grep -c '^User-agent:' public/robots.txt
git diff --name-only main -- src/data/guides src/data/news src/data/faq.ts
git status --short
```

Expected: ba file tồn tại; `11`; `1`; `17`; lệnh `git diff` in ra **rỗng** (bằng chứng không chữ prose nào bị sửa, tiêu chí spec 9.7); `git status` sạch, đặc biệt **không còn `vite.probe.config.ts`** sót lại từ Task 1.

- [ ] **Step 4: Đọc bằng mắt nội dung sinh ra**

Run: `head -30 dist/llms.txt && head -20 dist/guides/cach-tai-aoe4.md`

Xác nhận: không có em-dash `—`, không có Tailwind class lọt vào, không có HTML thô, và phần chữ mới viết theo đúng quy ước tên game (văn xuôi dùng `Đế chế 4`).

- [ ] **Step 5: Sweep a11y thủ công - bỏ qua có lý do**

PR này không đụng màu, khoảng cách, hay widget tương tác nào; toàn bộ thay đổi nằm trong `<head>`, trong file sinh lúc build, và trong cấu trúc file dữ liệu. Theo ACCESSIBILITY.md, sweep browser thủ công không bắt buộc ở đây. Ghi rõ điều này trong mô tả PR thay vì im lặng bỏ qua.

- [ ] **Step 6: Push và mở PR**

```bash
git push -u origin claude/llm-geo-support
gh pr create --title "feat: support LLM crawlers and generative engine optimization" --body "$(cat <<'EOF'
## Summary

Adds a machine-readable layer aimed at answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews) on top of the existing search-engine SEO.

- `llms.txt` and `llms-full.txt` generated at build from the same TS data the HTML pages use
- Per-article Markdown mirrors: `/guides/<slug>.md`, `/news/<slug>.md`, `/faq.md`
- `robots.txt` now declares 16 AI crawlers explicitly, all allowed
- JSON-LD: `BreadcrumbList` on every detail and listing page, `CollectionPage` on the guide and news indexes, plus `citation`, `inLanguage`, `isPartOf` and `about` on articles
- Optional `site.author` field so the owner can upgrade article authorship from Organization to Person; ships empty, so behaviour is unchanged

Spec: `docs/superpowers/specs/2026-08-07-llm-geo-support-design.md`

## Prerequisite refactor

`vite.config.ts` is loaded before the `@/` alias exists, so it could not import the tournament data - that module pulls in a `.webp` banner and the whole build failed with `Cannot find package '@/assets'`. Tournament data now lives in asset-free `*.data.ts` files; the existing `*.ts` files only bind the banner on top. No data values changed, and no existing test needed editing.

## Notes

- No published prose was touched. `git diff main -- src/data/guides src/data/news src/data/faq.ts` is empty.
- No new routes, so the accessibility spec's `PAGES` array is unchanged.
- `.md` files are deliberately kept out of `sitemap.xml`, and every internal link inside them points at the canonical HTML page, to avoid duplicate-content signals.
- `llms.txt` is a community convention, not a standard any major crawler has committed to reading. It is a cheap bet, not a sure thing - see the ROI section in the spec.
- Manual accessibility sweep skipped deliberately: this PR changes only `<head>` output, build-time files and data file structure - no colour, spacing or interactive widget.

## Test plan

- `npm run lint:check && npm run type-check && npm run test:run` green
- `npm run build` green, including `assertPagesDeclareVietnamese`
- Verified in `dist/`: 11 guide `.md` files, 1 news `.md`, `faq.md`, `llms.txt`, `llms-full.txt`
- Verified `BreadcrumbList`, `CollectionPage` and `citation` appear in the pre-rendered HTML

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 7: Không tự merge**

Dừng ở đây. PR để owner review và merge.

---

## Ghi chú cho người thực thi

**Đừng làm những việc sau, dù thấy hợp lý:**

1. **Đừng import `./src/data/tournaments` vào `vite.config.ts`.** Phải là `./src/data/tournaments/data`. Import nhầm làm đổ toàn bộ build ở bước nạp config, và thông báo lỗi (`Cannot find package '@/assets'`) không hề gợi ý nguyên nhân thật.
2. **Đừng gộp `*.data.ts` ngược lại vào `*.ts`** cho "gọn". Đó chính là thứ Task 1 vừa tách ra.
3. **Đừng thêm `.md` hay `.txt` vào `sitemap.xml`.** Sẽ tạo tín hiệu nội dung trùng lặp. Spec mục 4.3.
4. **Đừng back-fill `sources` cho 10 guide còn thiếu.** Việc đó cần tra nguồn thật cho từng claim, là PR nội dung riêng. Spec mục 6.2.
5. **Đừng đổi `author` mặc định thành một cái tên.** Trường này giao hàng rỗng có chủ đích.
6. **Đừng "sửa" import tương đối trong `vite.config.ts` thành alias `@/`.** Sẽ hỏng build.
7. **Đừng thêm RSS feed.** Owner đã loại khỏi phạm vi.
8. **Đừng sửa `src/__tests__/accessibility.spec.ts`.** Không có route mới.
9. **Đừng sửa test nào đang có để Task 1 xanh.** Nếu phải sửa, nghĩa là refactor đã đổi hành vi - quay lại sửa refactor.
