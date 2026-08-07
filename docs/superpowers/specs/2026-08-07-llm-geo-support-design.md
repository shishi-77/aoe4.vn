# Thiết kế: hỗ trợ LLM crawler và GEO

> Ngày: 2026-08-07 · Phạm vi: lớp máy đọc (llms.txt, bản Markdown, robots.txt, JSON-LD mở
> rộng) · Tác giả: solo dev
> KHÔNG đụng một chữ prose nào đã publish, KHÔNG đổi rubric guide-evaluator, KHÔNG thêm route.

## 1. Vấn đề

Site đã tối ưu tốt cho crawler tìm kiếm truyền thống: pre-render tĩnh bằng vite-ssg, HTML
semantic, sitemap tự sinh, JSON-LD cho Organization/WebSite/Article/NewsArticle/SportsEvent/
FAQPage. Nhưng lớp "answer engine" - ChatGPT, Claude, Perplexity, Google AI Overviews - thì
chưa được phục vụ có chủ đích:

1. **Không có bề mặt máy đọc.** Mọi nội dung chỉ tồn tại dưới dạng HTML có Tailwind class dày
   đặc. Crawler phải bóc HTML để lấy prose.
2. **robots.txt không phát tín hiệu.** Ba dòng `User-agent: * / Allow: / / Sitemap:`. Về hiệu
   lực là mở, nhưng không nói gì về chủ đích với từng bot.
3. **`guide.sources` chết trong data.** Trường này đã tồn tại trong `Guide` interface, đang
   được evaluator dùng để truy vết claim, nhưng **không bao giờ được phát ra HTML**. Đây là
   tín hiệu dẫn nguồn mạnh nhất mà site đang có và đang lãng phí hoàn toàn.
4. **Thiếu breadcrumb.** Không trang nào phát `BreadcrumbList`, dù cấu trúc phân cấp rất rõ.

## 2. Quyết định của owner (chốt trong phiên brainstorm 2026-08-07)

1. **Chỉ làm hạ tầng máy đọc.** Không viết lại nội dung theo hướng TL;DR / heading dạng câu
   hỏi. Việc đó nếu làm sẽ là spec riêng.
2. **Mở hết với AI crawler, khai báo tường minh từng bot.** Site là cộng đồng phi lợi nhuận,
   mục tiêu là được trích dẫn càng nhiều càng tốt. Chặn bot training không đem lại gì ngoài
   việc mất hiển diện.
3. **Làm bộ đầy đủ**: `llms.txt` + `llms-full.txt` + `.md` từng bài. Owner đã được trình bày
   rõ rằng `llms.txt` là **đặt cược rẻ, không phải khoản chắc ăn** - chưa crawler lớn nào
   công bố chính thức có đọc nó - và vẫn chọn làm, vì chi phí biên so với chỉ hai file root
   là khoảng 10 dòng code (cùng dùng chung hàm render Markdown).
4. **Không làm RSS feed** trong đợt này.

### ROI đã cân, ghi lại để không phải cân lại

Chi phí hạ tầng trên GitHub free là không đáng kể: `dist` hiện 1.2MB trên hạn mức 1GB, gói
này thêm khoảng 100KB (0.01% quota); repo public nên Actions minutes không giới hạn; build
thêm dưới 1 giây. **Chi phí thật là code phải nuôi vĩnh viễn**, nên thiết kế phải tối thiểu
hoá bề mặt bảo trì (xem mục 4) và phải có test chống lệch (mục 8).

Giá trị xếp theo độ chắc chắn, cao xuống thấp:

| Hạng mục | Độ chắc | Ghi chú |
|---|---|---|
| `BreadcrumbList` | Cao | Google dùng trực tiếp cho rich result và grounding, áp cho mọi trang |
| `citation` từ `sources` | Cao | Phủ 100% news (trường bắt buộc), 1/11 guide (trường tuỳ chọn) |
| robots.txt khai báo bot | Trung bình | Gần như miễn phí, loại bỏ rủi ro diễn giải nhầm |
| `llms.txt` / `llms-full.txt` | Thấp, đầu cơ | Quy ước cộng đồng, chưa được chuẩn hoá |
| `.md` từng bài | Thấp nhất | Nhưng chi phí biên ~0 vì dùng lại hàm của `llms-full.txt` |

## 3. Không làm gì (YAGNI)

- Không RSS/JSON feed.
- Không sinh `.md` riêng cho từng giải đấu. Dữ liệu giải theo mùa, và JSON-LD `SportsEvent`
  đã phục vụ đúng nhu cầu đó. Giải đấu chỉ xuất hiện dạng khối fact gọn trong `llms.txt` và
  `llms-full.txt`.
- Không sửa prose, không thêm khối TL;DR, không đổi heading.
- Không thêm route nào, nên `PAGES` trong `src/__tests__/accessibility.spec.ts` giữ nguyên.
- Không tự bịa danh tính tác giả (xem mục 6.4).

## 4. Kiến trúc

Nguyên tắc bám đúng pattern đã có của `buildSitemapXml`: **hàm thuần trả về string, chỉ
`vite.config.ts` chạm đĩa.** Không đẻ ra cơ chế build mới.

```
src/data/tournaments/        tách dữ liệu khỏi asset (xem 4.0 - điều kiện tiên quyết)
src/lib/contentMarkdown.ts   render một đơn vị nội dung -> Markdown (thuần, không fs)
src/lib/llmsTxt.ts           gộp thành llms.txt / llms-full.txt / danh sách file .md (thuần)
vite.config.ts onFinished    +6 dòng: gọi hàm, writeFileSync, ngay cạnh sitemap
public/robots.txt            viết lại tay, file tĩnh
src/lib/structuredData.ts    thêm breadcrumb + làm giàu Article/NewsArticle + listing
```

### 4.0 Điều kiện tiên quyết: tách banner khỏi dữ liệu giải đấu

**Đo thực tế, không phải suy đoán.** Thử import `tournaments` vào một vite config rồi chạy
build:

```
failed to load config from vite.probe.config.ts
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@/assets'
```

Nguyên nhân: `lac-hong.ts` và `ha-noi-open-1.ts` mở đầu bằng
`import banner from '@/assets/imgs/....webp'`. Vite nạp file config **trước khi** alias `@/`
tồn tại, nên toàn bộ build đổ. `site` và `faqItems` thì sạch, đã thử và nạp bình thường.

Vì thế `vite.config.ts` **không được** import module giải đấu hiện tại. Cách xử lý đã chốt:
tách mỗi giải làm hai lớp, giữ đúng một nguồn sự thật.

```
src/data/tournaments/types.ts             interface + TournamentData = Omit<Tournament, 'banner'>
src/data/tournaments/lac-hong.data.ts     dữ liệu thuần, KHÔNG import asset
src/data/tournaments/ha-noi-open-1.data.ts    nt
src/data/tournaments/data.ts              export tournamentsData - cửa vào sạch cho build tooling
src/data/tournaments/lac-hong.ts          { ...lacHongData, banner } - chỉ gắn ảnh
src/data/tournaments/ha-noi-open-1.ts     nt
```

Ràng buộc của bước tách này:

- **Không đổi hành vi.** `lacHong` và `haNoiOpen1` xuất ra vẫn y hệt, mọi component và test
  đang import chúng không phải sửa.
- **Không trùng lặp dữ liệu.** Lớp `.ts` spread từ lớp `.data.ts`, không chép tay.
- `index.ts` re-export type từ `./types`; `_template.ts` và `CONTRIBUTING.md` phải được cập
  nhật cho khớp quy trình thêm giải mới, nếu không lần sau thêm giải sẽ làm sai.
- `tournamentToMarkdown` và `LlmsInput.tournaments` nhận `TournamentData`, không nhận
  `Tournament` - chúng không dùng tới `banner`. `Tournament` vẫn gán được vào `TournamentData`
  nên test có thể truyền thẳng `lacHong`.

Luồng dữ liệu:

```
src/data/{guides,news,faq,tournaments}
        |
        +--> contentMarkdown  --> llmsTxt --> [{path, content}] --> onFinished ghi dist/
        |
        +--> structuredData   --> useHead script[ld+json] --> HTML pre-render
```

### 4.1 `src/lib/contentMarkdown.ts`

Hàm thuần, mỗi hàm nhận một đơn vị nội dung và trả về chuỗi Markdown hoàn chỉnh có
front matter tối giản dạng heading + metadata line (không dùng YAML, giữ đơn giản).

```ts
export function guideToMarkdown(guide: Guide, site: Site): string
export function newsPostToMarkdown(post: NewsPost, site: Site): string
export function faqToMarkdown(items: FaqItem[], site: Site): string
export function tournamentToMarkdown(tournament: Tournament, site: Site): string
```

Khuôn của `guideToMarkdown`:

```markdown
# <title>

<description>

Nguồn: https://aoe4.vn/guides/<slug>/ · Cập nhật: <updatedAt>

## <section.heading>

<paragraph>

<paragraph>

Xem thêm: [<link.label>](https://aoe4.vn/guides/<link.slug>/)

## Nguồn tham khảo        <- chỉ khi guide.sources có phần tử

- <url>
```

Quy tắc render dùng chung:

- Mọi URL trong Markdown là **tuyệt đối**, có dấu `/` cuối, dựng từ `site.url` - vì file
  `.md` có thể bị tách khỏi ngữ cảnh site.
- Link nội bộ giữa các bài trỏ tới **bản HTML** (`/guides/x/`), không trỏ `.md`. Bản HTML là
  canonical; chỉ `llms.txt` mới trỏ `.md`.
- Không chèn HTML thô, không chèn Tailwind class.
- Không escape ký tự Markdown trong prose: nội dung là tiếng Việt thuần, không chứa `*`,
  `_`, `` ` `` ở vị trí gây hiểu nhầm. Nếu sau này có, xử lý lúc đó.
- `tournamentToMarkdown` render dạng danh sách fact (`- Thể thức: ...`), không dựng đoạn văn.

### 4.2 `src/lib/llmsTxt.ts`

```ts
interface LlmsInput {
  site: Site
  guides: Guide[]
  news: NewsPost[]
  faq: FaqItem[]
  /** TournamentData, không phải Tournament - xem 4.0. */
  tournaments: TournamentData[]
}

export function buildLlmsTxt(input: LlmsInput): string
export function buildLlmsFullTxt(input: LlmsInput): string
export function buildMarkdownFiles(input: LlmsInput): Array<{ path: string; content: string }>
```

`buildMarkdownFiles` **trả về mảng chứ không tự ghi đĩa**. Đây là ranh giới quan trọng: toàn
bộ logic sinh file test được 100% bằng vitest thuần, không cần mock fs, và `vite.config.ts`
chỉ còn là vòng lặp `writeFileSync`.

`path` là đường dẫn tương đối so với `dist`, dùng dấu `/`; bên ghi tự `mkdir` thư mục cha nếu
cần (thực tế `dist/guides` và `dist/news` đã tồn tại do pre-render, nhưng không dựa vào đó).

Khuôn `llms.txt` theo quy ước cộng đồng:

```markdown
# AoE4 VN

> Cộng đồng Age of Empires IV Việt Nam - giải đấu, hướng dẫn và tin tức, viết bằng tiếng Việt.

Toàn bộ nội dung tiếng Việt. Bản đầy đủ một file: https://aoe4.vn/llms-full.txt

## Hướng dẫn

- [<title>](https://aoe4.vn/guides/<slug>.md): <description>

## Tin tức

- [<title>](https://aoe4.vn/news/<slug>.md): <description>

## Câu hỏi thường gặp

- [Đế chế 4 là gì? Câu hỏi thường gặp](https://aoe4.vn/faq.md): <n> câu hỏi đáp nhanh.

## Giải đấu

- [<name>](https://aoe4.vn/tournaments/<slug>/): <dateLabel>, <venue.name>, giải thưởng <prizePoolTotal>.
```

`llms-full.txt` = header giống trên + nối toàn văn mọi guide, news, FAQ, cộng khối fact giải
đấu, ngăn cách bằng `\n\n---\n\n`. Thứ tự: FAQ trước (câu hỏi nền tảng), rồi guides theo thứ
tự trong `guides[]`, rồi news mới nhất trước, rồi giải đấu.

### 4.3 File sinh ra

| Đường dẫn trong `dist` | Nguồn |
|---|---|
| `llms.txt` | `buildLlmsTxt` |
| `llms-full.txt` | `buildLlmsFullTxt` |
| `guides/<slug>.md` | `guideToMarkdown`, 11 file hiện tại |
| `news/<slug>.md` | `newsPostToMarkdown`, 1 file hiện tại |
| `faq.md` | `faqToMarkdown` |

Cả `.md` lẫn `.txt` đều **không** vào `sitemap.xml` - sitemap chỉ liệt kê URL canonical dạng
HTML. Thêm vào sẽ tạo nội dung trùng lặp trong mắt Google.

Deploy dùng `actions/upload-pages-artifact` (upload tĩnh, không chạy Jekyll), nên `.md` được
phục vụ nguyên trạng, không bị xử lý.

### 4.4 Sửa `vite.config.ts`

Trong `onFinished`, ngay sau dòng ghi sitemap:

```ts
const llmsInput = { site, guides, news: newsPosts, faq: faqItems, tournaments }
writeFileSync('dist/llms.txt', buildLlmsTxt(llmsInput))
writeFileSync('dist/llms-full.txt', buildLlmsFullTxt(llmsInput))
for (const file of buildMarkdownFiles(llmsInput)) {
  mkdirSync(dirname(join('dist', file.path)), { recursive: true })
  writeFileSync(join('dist', file.path), file.content)
}
```

`vite.config.ts` cần import thêm `site`, `faqItems`, và `tournamentsData` **từ
`./src/data/tournaments/data`** - không phải từ `./src/data/tournaments`, xem mục 4.0.

Lưu ý: file này dùng đường dẫn tương đối (`./src/data/...`) chứ không dùng alias `@/`, vì
alias chưa được phân giải lúc Vite đọc config - đây là pattern có sẵn của `guides` và
`newsPosts`, đừng "sửa" nó cho khớp quy ước của `src/`. Đây cũng chính là lý do gốc của mục
4.0: bất cứ thứ gì `vite.config.ts` chạm tới đều không được đi qua alias.

## 5. robots.txt

Viết lại `public/robots.txt`. Giữ nhóm `*`, giữ dòng `Sitemap:`, thêm khối bot tường minh.

```
# aoe4.vn - cộng đồng Age of Empires IV Việt Nam
# Toàn bộ nội dung mở cho cả công cụ tìm kiếm lẫn trợ lý AI.
# Bản máy đọc: https://aoe4.vn/llms.txt

User-agent: *
Allow: /

# AI assistants and answer engines - explicitly allowed
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

Ghi chú kỹ thuật, để người sau không sửa nhầm:

- Bot nào có nhóm `User-agent` riêng thì **bỏ qua hoàn toàn** nhóm `*`. Nhiều dòng
  `User-agent` liên tiếp rồi một `Allow` là cú pháp hợp lệ, tạo một nhóm dùng chung.
- Vì thế khối này **tương đương về hiệu lực** với `*`; giá trị của nó là phát tín hiệu chủ
  đích và tạo chỗ neo nếu sau này muốn đổi chính sách với riêng một bot.
- robots.txt **không có directive chuẩn cho llms.txt**. Dòng trỏ tới nó là comment, cố ý.
  Không phát minh ra directive mới.
- Comment trong file viết tiếng Việt cho phần mô tả site, tiếng Anh cho phần kỹ thuật - đây
  là file người ngoài đọc.

## 6. JSON-LD mở rộng

`FAQPage` đã có ở `FAQView.vue`, giữ nguyên. Phần thêm vào `src/lib/structuredData.ts`:

### 6.1 `breadcrumbJsonLd`

```ts
export function breadcrumbJsonLd(
  trail: Array<{ name: string; path: string }>,
  site: Site,
): Record<string, unknown>
```

Trả về `BreadcrumbList` với `itemListElement` đánh số từ 1, mỗi item có `name` và `item` là
URL tuyệt đối có `/` cuối. Gắn vào:

| Trang | Trail |
|---|---|
| `/guides/:slug` | Trang chủ > Hướng dẫn > `<title>` |
| `/news/:slug` | Trang chủ > Tin tức > `<title>` |
| `/tournaments/:slug` | Trang chủ > Giải đấu > `<name>` |
| `/guides`, `/news`, `/tournaments`, `/faq` | Trang chủ > `<tên mục>` |

Tên mục trong breadcrumb phải khớp chữ trong navbar để không mâu thuẫn với những gì người
đọc thấy.

### 6.2 Làm giàu `guideArticleJsonLd` / `newsArticleJsonLd`

Thêm vào cả hai:

- `inLanguage: 'vi-VN'`
- `isPartOf`: `{ '@type': 'WebSite', name, url }` trỏ về gốc site
- `about`: `{ '@type': 'VideoGame', name: 'Age of Empires IV' }`

Thêm `citation` khi có nguồn. Hai loại nội dung có hình dạng `sources` **khác nhau**, đừng
gộp làm một:

| | Kiểu | Bắt buộc? | Phủ sóng hôm nay |
|---|---|---|---|
| `Guide.sources` | `string[]` (URL trần) | Tuỳ chọn | 1/11 bài |
| `NewsPost.sources` | `{ label, url }[]` | **Bắt buộc** | 1/1 bài, và mọi bài sau |

Cả hai render thành `citation` là mảng `CreativeWork` cho đồng nhất: guide chỉ có `url`, news
có thêm `name` lấy từ `label`.

`NewsPost.sources` bắt buộc theo type, nên `citation` phủ **toàn bộ chuyên mục tin tức** ngay
từ ngày đầu - đây mới là chỗ thay đổi này có tác dụng thật, chứ không phải ở guides.

Đo thực tế phía guides: **chỉ 1 trong 11 guide hiện có `sources`** -
`aoe4-vs-aoe2-khac-biet-cot-loi.ts`. Nên hôm nay `citation` chỉ lên sóng ở đúng một bài. Giá
trị của thay đổi này nằm ở chỗ nó **tự lớn theo thời gian**: mỗi guide `comparison` viết sau
đều bắt buộc có `sources`, và cơ chế phát ra HTML sẽ có sẵn thay vì phải nhớ làm sau.

Back-fill `sources` cho 10 guide còn lại **nằm ngoài phạm vi spec này** - việc đó đòi tra
nguồn thật cho từng claim, không phải điền URL cho có, và phải là một PR nội dung riêng.

**Ràng buộc**: khi `sources` rỗng hoặc `undefined`, **không phát khoá `citation`** với giá
trị rỗng - JSON-LD có mảng rỗng bị Search Console cảnh báo. Bỏ hẳn khoá.

### 6.3 Listing pages

Thêm `collectionPageJsonLd(items, site)` phát `CollectionPage` có `mainEntity` là `ItemList`,
mỗi `ListItem` gồm `position`, `url`, `name`. Gắn vào `/guides` và `/news`.

Không gắn cho `/tournaments` trong đợt này - trang đó là landing có bố cục riêng, và mỗi giải
đã có `SportsEvent` riêng ở trang chi tiết.

### 6.4 Tác giả và E-E-A-T - cần owner quyết, KHÔNG chặn

`author` hiện là `Organization` tên "AoE4 VN". Tín hiệu E-E-A-T mạnh hơn nếu là `Person` có
tên thật kèm link hồ sơ.

**Spec này không bịa danh tính.** Thay vào đó thêm trường tuỳ chọn vào `src/data/site.ts`:

```ts
/** Tác giả mặc định cho bài viết. Bỏ trống -> dùng Organization. */
author: {
  name: '',
  url: '',
},
```

`guideArticleJsonLd` và `newsArticleJsonLd` phát `Person` khi `site.author.name` khác rỗng,
ngược lại giữ nguyên `Organization` như hiện tại. Mặc định giao hàng là **rỗng**, tức hành vi
không đổi. Owner điền sau nếu muốn, không cần đụng code.

## 7. Xử lý lỗi

Bám đúng cách `assertPagesDeclareVietnamese` đang làm: **hỏng thì đổ build, không im lặng.**

- Hàm thuần ném `Error` khi gặp dữ liệu không hợp lệ (slug rỗng, guide không có section nào).
  `onFinished` không bắt lỗi, nên build đỏ ngay.
- Không có cơ chế fallback "sinh file rỗng cho xong". File `.md` rỗng còn tệ hơn không có
  file, vì crawler sẽ ghi nhận nội dung rỗng cho URL đó.

## 8. Test

Đặt tại `src/lib/__tests__/`, chạy trong `npm run test:run` cùng gate hiện có.

### 8.1 `contentMarkdown.spec.ts`

- `guideToMarkdown` phát đúng H1, description, mọi heading thành `##`, mọi paragraph.
- Link nội bộ trỏ URL tuyệt đối dạng HTML có `/` cuối, không trỏ `.md`.
- Khối "Nguồn tham khảo" xuất hiện khi và chỉ khi `sources` có phần tử.
- `faqToMarkdown` phát đủ số câu hỏi.
- `tournamentToMarkdown` phát dạng danh sách fact.

### 8.2 `llmsTxt.spec.ts` - test chống lệch, quan trọng nhất

Chạy trên **dữ liệu thật** (`guides`, `newsPosts`, `faqItems`, `tournaments`), không phải
fixture:

- Mọi slug trong `guides` có đúng một dòng trong `llms.txt` và đúng một file
  `guides/<slug>.md` trong `buildMarkdownFiles`.
- Điều tương tự cho `newsPosts`.
- Không có `path` trùng nhau trong kết quả `buildMarkdownFiles`.
- `llms-full.txt` chứa title của mọi guide và mọi news post.

Mục đích: thêm bài mới mà generator quên xử lý là **đỏ ngay**, không âm thầm trôi ra production.

### 8.3 `structuredData.spec.ts` (mở rộng file có sẵn)

- `breadcrumbJsonLd` đánh `position` từ 1, URL tuyệt đối có `/` cuối.
- `guideArticleJsonLd` có `citation` khi guide có `sources`, và **không có khoá `citation`**
  khi không có.
- `inLanguage`, `isPartOf`, `about` xuất hiện ở cả guide lẫn news.
- `author` là `Organization` khi `site.author.name` rỗng, là `Person` khi có tên.

### 8.4 Gate sẵn có

- `src/__tests__/accessibility.spec.ts`: **không sửa**. Không thêm route nào.
- `npm run lint:check && npm run type-check && npm run test:run` phải xanh.
- `npm run build` bắt buộc chạy trên PR này: xác nhận file được ghi thật vào `dist`, và
  `assertPagesDeclareVietnamese` vẫn xanh sau khi `onFinished` dài ra.
- Kiểm tay sau build: `dist/llms.txt`, `dist/llms-full.txt`, `dist/faq.md` tồn tại và đếm
  đúng số file `.md` trong `dist/guides` và `dist/news`.

## 9. Tiêu chí hoàn thành

1. `https://aoe4.vn/llms.txt` và `/llms-full.txt` phục vụ được, liệt kê đủ nội dung hiện có.
2. Mỗi guide và news post có bản `.md` tương ứng, nội dung khớp bản HTML.
3. `robots.txt` khai báo tường minh 16 bot, giữ `Sitemap:`.
4. Mọi news post phát `citation`; guide có `sources` phát `citation`, guide không có thì
   không phát khoá đó (không phát mảng rỗng).
5. Guide/news/tournament detail và bốn trang listing phát `BreadcrumbList`.
6. Toàn bộ gate trong CLAUDE.md xanh, cộng `npm run build`.
6b. Tách banner không đổi hành vi: mọi test giải đấu và component section đang có vẫn xanh mà
   không phải sửa; `_template.ts` và `CONTRIBUTING.md` đã cập nhật theo cấu trúc mới.
7. Không một chữ prose nào bị sửa - `git diff` **không chạm** `src/data/guides/*.ts` và
   `src/data/news/*.ts`. Không back-fill `sources`, không sửa `faq.ts`.

## 10. Rủi ro đã biết

- **`llms.txt` có thể không bao giờ được crawler lớn đọc.** Đã chấp nhận ở mục 2. Nếu sau 6
  tháng không có tín hiệu nào và chi phí bảo trì gây phiền, gỡ hai file root là đủ - hàm
  render Markdown vẫn còn dùng cho `.md` từng bài.
- **`.md` bị coi là nội dung trùng lặp.** Giảm thiểu bằng cách không đưa vào sitemap, và mọi
  link nội bộ trong `.md` đều trỏ về bản HTML canonical.
- **Generator lệch với data.** Đây là rủi ro bảo trì thật nhất, và là lý do mục 8.2 tồn tại.
