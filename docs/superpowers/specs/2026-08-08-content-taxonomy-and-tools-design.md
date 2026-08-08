# Thiết kế: Chuyên mục nội dung và mục Công cụ

> Ngày: 2026-08-08 · Phạm vi: định hình lại kiến trúc thông tin của aoe4.vn thành 5 chuyên mục cấp cao, thêm `/tools`, nhóm `/guides` theo `kind` · Tác giả: solo dev
> Kế thừa: spec 2026-08-03 (header menu trim), spec 2026-08-02 (content automation), hệ thống `/guides` + `content-queue.json` đã có trên main.

## 1. Vấn đề

Mọi bài viết dạng chữ trên site đều rơi vào `/guides/`, bất kể nó là bài tra cứu, bài chiến thuật hay bài so sánh. Hai hệ quả:

1. **Nhãn sai và sẽ ngày càng sai.** `content-queue.json` đang có 19 đề tài, trong đó **15 là `comparison`**. Chạy hết hàng đợi thì khoảng 2/3 nội dung dưới nhãn "Hướng dẫn Đế chế 4" thực chất là bài so sánh giữa các game.
2. **Không có chỗ cho nội dung không phải bài viết.** Công cụ của bên thứ ba (tra ELO, nháp ban/pick, máy tính sản xuất quân) không có kiểu dữ liệu nào phù hợp: chúng không có `sections`, không có `paragraphs`, và điểm đến là một tên miền khác.

Phân loại thực ra đã tồn tại trong code từ trước: `src/data/guides/index.ts` có field `kind?: 'utility' | 'strategy' | 'comparison'`. Nhưng nó chỉ được guide-evaluator dùng để chọn sàn điểm - chưa bao giờ xuất hiện trên URL, trên navbar, hay trên trang danh sách. `GuidesView.vue` render đúng một danh sách phẳng.

## 2. Ràng buộc

- **Không đổi slug đã publish.** Luật của CLAUDE.md. 13 guide hiện tại phải giữ nguyên `/guides/<slug>/`.
- **Site tĩnh trên GitHub Pages.** Không có redirect phía server; mọi phương án dời URL đều tốn kém bất tương xứng.
- **Cổng accessibility.** Route mới bắt buộc thêm một dòng vào mảng `PAGES` của `src/__tests__/accessibility.spec.ts`.
- Không commit lên `main`; đi qua branch → PR → merge.

## 3. Quyết định: 5 chuyên mục cấp cao

Mỗi chuyên mục phải trả lời được bằng một câu "khác 4 cái kia ở chỗ nào".

| # | Chuyên mục | Route | Ranh giới | Trạng thái |
|---|---|---|---|---|
| 1 | Hướng dẫn | `/guides` | Kiến thức không hết hạn, chia 3 nhóm bên trong | có, cần nhóm lại |
| 2 | Công cụ | `/tools` | Thứ người đọc bấm sang tên miền khác để dùng | **thêm mới** |
| 3 | Giải đấu | `/tournaments` | Có ngày diễn ra và có người thắng | có, không đổi |
| 4 | Tin tức | `/news` | Nội dung hết hạn theo thời gian | có, không đổi |
| 5 | Hỏi đáp | `/faq` | Câu trả lời ngắn, có `FAQPage` JSON-LD | có, không đổi |

**Đã cân nhắc và loại:** tách riêng `Chiến thuật`, `So sánh`, `Người mới`, `Nền văn minh` thành chuyên mục ngang hàng. Cả bốn đều là kiến thức không hết hạn, tức là trùng ranh giới với `Hướng dẫn`. Chúng là **nhóm bên trong** `/guides`, không phải chuyên mục.

**Đã cân nhắc và loại:** dời bài so sánh sang route riêng `/compare/:slug`. Phương án này sạch về mặt ngữ nghĩa nhưng buộc phải chọn giữa (a) bỏ rơi 2 bài đã publish ở `/guides/`, khiến cùng một loại nội dung nằm ở hai nơi, hoặc (b) prerender kép cộng logic canonical chéo - chi phí không xứng với lợi ích khi tổng nội dung còn dưới 20 bài. Quyết định của owner: giữ nguyên URL, chỉ nhóm lại ở tầng hiển thị. Nếu sau này lượng bài so sánh vượt xa phần còn lại thì mở lại quyết định này.

## 4. `/tools` - thư mục link

Một route tĩnh duy nhất. **Không có `/tools/:slug`.**

### Kiểu dữ liệu

Kiểu mới trong `src/data/tools/index.ts`, không tái dùng `Guide`:

```ts
export interface Tool {
  /** Tên hiển thị của công cụ. */
  name: string
  /** URL đầy đủ tới trang chủ công cụ. */
  url: string
  /** Nhóm hiển thị trên trang. */
  category: ToolCategory
  /** Game mà công cụ phục vụ, viết theo quy ước đặt tên: 'Đế chế 4', 'Đế chế 2'. */
  games: string[]
  /** 2-3 câu tiếng Việt: làm được gì, dùng khi nào. */
  description: string
}
```

`ToolCategory` là union đóng: `'Tra cứu' | 'Nháp chiến thuật' | 'Tính toán'`.

### Nội dung khởi tạo

| Công cụ | URL | Nhóm | Game |
|---|---|---|---|
| AoE4 World | `https://aoe4world.com/` | Tra cứu | Đế chế 4 |
| AoE2 Captains Mode | `https://aoe2cm.net/` | Nháp chiến thuật | Đế chế 2 |
| Aegis | `https://aoe-aegis.vercel.app/` | Tính toán | Đế chế 4 |
| AoE4 Production Calculator | `https://www.aoe4-production-calculator.com/` | Tính toán | Đế chế 4 |

Trường `games` tồn tại chính vì `aoe2cm.net` là công cụ của **Đế chế 2**, không phải Đế chế 4. Trang phải nói rõ điều đó, nếu không người đọc mở ra sẽ tưởng bị lạc.

Mô tả phải theo quy ước đặt tên game của CLAUDE.md: văn xuôi dùng `Đế chế 4`, viết tắt chỉ được xuất hiện trong `name` (là tên riêng của công cụ) và trong `title`/`description` của `useHead`.

### Trang `/tools`

`src/views/ToolsView.vue`, dựng theo đúng khuôn `GuidesView.vue`:

- `useHead` với `title`, `description`, canonical `https://aoe4.vn/tools/` (có dấu `/` cuối), OG, và `collectionPageJsonLd` + `breadcrumbJsonLd` từ `@/lib/structuredData`.
- Nhóm theo `category`, mỗi nhóm một `<h2>`, mỗi công cụ một thẻ.
- Link ra ngoài: `target="_blank"` kèm `rel="noopener noreferrer"`, và văn bản link phải tự mô tả được - không dùng "tại đây".
- Đo lường: gọi `trackOutboundClick` từ `@/lib/analytics` với `placement: 'tools'`. Union `placement` ở `src/lib/analytics.ts:13` hiện đóng ở `'header' | 'article_footer' | 'homepage'`, nên bắt buộc phải nới thêm `'tools'`.

## 5. `/guides` - nhóm theo `kind`

**Không đổi một ký tự URL nào.** Chỉ đổi tầng hiển thị và siết kiểu dữ liệu.

### Siết `kind` thành bắt buộc

Hiện 7/13 guide không khai `kind` nên rơi vào mặc định `strategy`. Trong đó `aoe4-khac-de-che-the-nao.ts` (export `aoe4VsAoe1Guide`) rõ ràng là bài so sánh nhưng đang bị xếp nhầm nhóm.

Đổi `kind?:` thành `kind:` trong interface `Guide`, rồi khai tường minh cho cả 7 file thiếu. `type-check` sẽ chỉ đúng từng file còn thiếu, nên không có đường bỏ sót.

Phân nhóm dự kiến sau khi khai đủ:

- `utility`: `cach-tai-aoe4`, `cau-hinh-may-aoe4`, `tim-nguoi-viet-choi-aoe4`, `de-che-co-nhung-ban-nao`
- `comparison`: `aoe4-vs-aoe2-khac-biet-cot-loi`, `game-rts-nao-de-bat-dau-2026`, `aoe4-khac-de-che-the-nao`
- `strategy`: 6 bài còn lại

### Hiển thị

`GuidesView.vue` đổi từ danh sách phẳng thành 3 nhóm theo thứ tự cố định, mỗi nhóm một `<h2>`:

1. **Tra cứu** (`utility`)
2. **Chiến thuật** (`strategy`)
3. **So sánh** (`comparison`)

Nhóm rỗng thì không render heading. Thứ tự nhóm là hằng số trong code, không suy ra từ dữ liệu, để trang không tự đổi bố cục khi thêm bài.

`collectionPageJsonLd` giữ nguyên danh sách phẳng đủ 13 mục - việc nhóm là chuyện của mắt người đọc, không phải của crawler.

## 6. Navbar

Thêm `Công cụ` → `/tools/`. Thứ tự cuối cùng:

```
Hỏi đáp | Giải đấu | Hướng dẫn | Công cụ | Tin tức | Blog ↗ | [Facebook]
```

`Công cụ` đặt ngay sau `Hướng dẫn` vì công cụ là thứ người đọc tìm tới sau khi đọc hướng dẫn.

### Xung đột đã biết với spec 2026-08-03

Spec `2026-08-03-header-menu-trim-design.md` cố ý rút header xuống **đúng 6 mục** vì "too dense", và đã được owner duyệt. Thêm `Công cụ` đưa con số lên 7, tức là đi ngược một phần quyết định đó.

Owner đã xác nhận vẫn muốn `Công cụ` trên navbar. Spec này ghi nhận điều đó là quyết định thay thế, giới hạn ở đúng một mục.

**Lối thoát nếu muốn giữ mốc 6 mục:** chuyển `Blog ↗` xuống footer. Đó là link ra ngoài site, không phải chuyên mục nội dung, nên nó là ứng viên hy sinh hợp lý hơn bất kỳ mục nào trong 5 chuyên mục. Đây là quyết định để mở, mặc định là **giữ 7 mục**.

## 7. Danh sách file phải sửa

**Thêm mới**

- `src/data/tools/index.ts` - interface `Tool`, `ToolCategory`, mảng `tools`
- `src/data/tools/__tests__/index.spec.ts` - kiểm tra tính toàn vẹn dữ liệu
- `src/views/ToolsView.vue`
- `src/views/__tests__/GuidesView.spec.ts` - trang này hiện chưa có test riêng

**Sửa**

- `src/router/index.ts` - route `/tools` tên `tools`
- `src/components/AppNavbar.vue` - thêm link `Công cụ`
- `src/data/guides/index.ts` - `kind` thành bắt buộc
- 7 file guide thiếu `kind` - khai tường minh
- `src/views/GuidesView.vue` - nhóm theo `kind`
- `src/lib/sitemap.ts` - thêm `{ loc: '/tools/' }` vào mảng `entries`
- `src/__tests__/accessibility.spec.ts` - thêm `{ name: 'công cụ', path: '/tools' }` vào `PAGES`
- `src/lib/analytics.ts` - thêm `'tools'` vào union `placement`

**Ghi chú về CLAUDE.md.** Mục "Routes & SEO" đang hướng dẫn thêm URL vào "mảng `urls` trong `vite.config.ts`". Mảng đó không còn tồn tại - sitemap thực tế được dựng bởi `buildSitemapXml` trong `src/lib/sitemap.ts`, với danh sách route tĩnh hardcode ngay trong hàm. Sửa lại câu đó trong CLAUDE.md như một phần của PR này.

`vite.config.ts` **không cần sửa**: `includedRoutes` đã tự nhận mọi route tĩnh qua `paths.filter((p) => !p.includes(':'))`, và `/tools` không có tham số.

## 8. Kiểm thử

- `src/data/tools/__tests__/index.spec.ts`: mọi `url` là HTTPS tuyệt đối, `name` và `description` không rỗng, không trùng `url`, `category` nằm trong union, `games` không rỗng.
- `src/views/__tests__/GuidesView.spec.ts` (file mới): khẳng định trang render đủ 3 heading nhóm và mọi guide xuất hiện đúng một lần, không rơi rớt bài nào.
- `src/components/__tests__/AppNavbar.spec.ts`: bổ sung khẳng định có link `/tools/`.
- Accessibility: `/tools` được `PAGES` quét tự động sau khi thêm dòng. Trang có link ra ngoài nên phải tự kiểm tra bằng mắt phần văn bản link - axe xác nhận có tên khả truy cập chứ không xác nhận tên đó **đúng**.
- Cổng trước PR: `npm run lint:check && npm run type-check && npm run test:run`.
- Sweep thủ công theo ACCESSIBILITY.md: PR này thêm một widget mới (thẻ công cụ) và đổi bố cục trang `/guides`, nên cổng jsdom không phủ hết phần màu sắc, khoảng cách và tap target.

## 9. Ngoài phạm vi

- Trang con cho từng công cụ (`/tools/:slug`) và bài hướng dẫn dùng công cụ.
- Route `/compare` cho bài so sánh - đã cân nhắc và loại ở mục 3.
- Bộ lọc hoặc tab tương tác trên `/guides`; bản này chỉ nhóm tĩnh bằng heading.
- Ảnh chụp màn hình hoặc logo của công cụ.
- Đổi `content-queue.json` hay bất kỳ skill nào trong `.claude/skills/`.
- Đưa `tools` vào `llms.txt`. Cân nhắc riêng sau, vì `LlmsInput` trong `src/lib/llmsTxt.ts` là hợp đồng có kiểm thử riêng.

## 10. Rủi ro

**Bài so sánh vẫn nằm dưới nhãn "Hướng dẫn".** Đây là cái giá đã chấp nhận để không đụng URL. Giảm nhẹ bằng heading nhóm rõ ràng trên trang. Nếu lượng bài so sánh sau này áp đảo, mở lại quyết định ở mục 3.

**Đổi `kind` của `aoe4-khac-de-che-the-nao` sang `comparison`.** Sàn điểm không đổi - comment ở `src/data/guides/index.ts` ghi rõ comparison chấm sàn như strategy. Nhưng guide-evaluator kỳ vọng bài `comparison` có `sources[]` để truy vết claim, mà bài này chưa có. Cần bổ sung nguồn cho bài đó, hoặc chấp nhận evaluator cảnh báo cho tới khi bổ sung.

**Link công cụ bên thứ ba có thể chết.** `aoe-aegis.vercel.app` nằm trên tên miền miễn phí, rủi ro cao nhất trong bốn. Không tự động hóa việc kiểm tra ở bản này; ghi nhận là việc cần rà tay khi chạy `seo-audit` hàng tháng.

**Header dày lên 7 mục.** Xem mục 6.
