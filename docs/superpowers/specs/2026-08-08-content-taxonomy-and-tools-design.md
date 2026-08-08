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

`ToolCategory` là union đóng: `'Tra cứu' | 'Nháp chiến thuật' | 'Tính toán' | 'Luyện tập'`.

### Nội dung khởi tạo

| Công cụ | URL | Nhóm | Game |
|---|---|---|---|
| AoE4 World | `https://aoe4world.com/` | Tra cứu | Đế chế 4 |
| AoE2 Captains Mode | `https://aoe2cm.net/` | Nháp chiến thuật | Đế chế 2, Đế chế 3, Đế chế 4 |
| Aegis | `https://aoe-aegis.vercel.app/` | Luyện tập | Đế chế 4 |
| AoE4 Production Calculator | `https://www.aoe4-production-calculator.com/` | Tính toán | Đế chế 4 |

**Nguồn kiểm chứng (ngày 2026-08-08).** Ba trong bốn trang là SPA nên chỉ trả về vỏ HTML rỗng; nội dung được truy về nguồn tĩnh thay thế:

- `aoe4world.com` - đọc trực tiếp trang chủ. Bao phủ duy nhất Đế chế 4.
- `aoe2cm.net` - README của `github.com/SiegeEngineers/aoe2cm2`. Công cụ dùng asset của cả Đế chế 2, Đế chế 3 và Đế chế 4 qua hệ thống preset, có vai host/guest/spectator, và ba hành động pick/ban/snipe.
- `aoe-aegis.vercel.app` và `aoe4-production-calculator.com` - trang `aoe4world.com/tools`, nơi chính AoE4 World liệt kê hai công cụ cộng đồng này. Aegis là *"a practice game focused on improving building hotkey proficiency"* - **không phải máy tính**. Production Calculator *"determines the quantity of villagers needed per resource for sustained military unit manufacturing"*.

Nhóm `Luyện tập` tồn tại chính vì Aegis: xếp nó vào `Tính toán` là mô tả sai công cụ.

Trường `games` giữ lại vì Captains Mode phủ nhiều đời trong dòng Đế chế còn ba công cụ kia chỉ phục vụ Đế chế 4 - người đọc cần biết trước khi bấm.

### Quy ước đặt tên trong dữ liệu công cụ

`description` là văn xuôi người đọc thấy, nên phải qua `gameNamingFailures`. `name` là **tên riêng** của công cụ (`AoE4 World`, `AoE2 Captains Mode`) nên chứa viết tắt và **sẽ trượt** cổng đó.

Đã kiểm chứng bằng thực nghiệm ngày 2026-08-08: bốn mô tả ở Task 1 của plan cho `gameNamingFailures` trả về mảng rỗng, còn ba `name` nói trên trả về lỗi. Vì vậy test đặt tên chỉ được quét `description`, tuyệt đối không quét `name`.

### Trang `/tools`

`src/views/ToolsView.vue`, dựng theo đúng khuôn `GuidesView.vue`:

- `useHead` với `title`, `description`, canonical `https://aoe4.vn/tools/` (có dấu `/` cuối), OG, và `collectionPageJsonLd` + `breadcrumbJsonLd` từ `@/lib/structuredData`.
- Nhóm theo `category`, mỗi nhóm một `<h2>`, mỗi công cụ một thẻ.
- Link ra ngoài: `target="_blank"` kèm `rel="noopener noreferrer"`, và văn bản link phải tự mô tả được - không dùng "tại đây".
- Đo lường: **event riêng**, không dùng lại `trackOutboundClick`. Xem dưới.

### Vì sao không dùng lại `trackOutboundClick`

`trackOutboundClick` ở `src/lib/analytics.ts:34` bắn event GA4 tên `join_community_click`, và `OutboundClickEvent.channel` là union đóng `'discord' | 'facebook'`. Đó là thước đo chuyển đổi người đọc về cộng đồng.

Click sang một công cụ bên thứ ba **không phải** chuyển đổi cộng đồng. Nhét nó vào cùng event sẽ thổi phồng `join_community_click` bằng lưu lượng không liên quan, làm hỏng đúng chỉ số mà spec 2026-08-02 dựng lên để đo.

Vì vậy thêm hàm riêng `trackToolClick` bắn event `tool_click`, với kiểu riêng `ToolClickEvent { tool: string; path: string }`. Union `placement` và `channel` của CTA cộng đồng giữ nguyên, không đụng tới.

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

Thêm `Công cụ` → `/tools/`. `Blog ↗` **ở nguyên header**. Thứ tự cuối cùng, 7 mục:

```
Hỏi đáp | Giải đấu | Hướng dẫn | Công cụ | Tin tức | Blog ↗ | [Facebook]
```

`Công cụ` đặt ngay sau `Hướng dẫn` vì công cụ là thứ người đọc tìm tới sau khi đọc hướng dẫn.

`AppFooter.vue` **không đổi**.

### Quan hệ với spec 2026-08-03

Spec `2026-08-03-header-menu-trim-design.md` cố ý rút header xuống **đúng 6 mục** vì "too dense". Spec này nâng lên 7.

Owner đã cân nhắc lối thoát giữ mốc 6 - chuyển `Blog ↗` xuống footer - và **từ chối**: giữ Blog trên header, chấp nhận 7 mục.

Đây là quyết định thay thế, giới hạn ở đúng một mục thêm vào. Mốc "gọn" của spec 2026-08-03 vẫn là ý định gốc; lần tới muốn thêm mục thứ 8 thì phải mở lại cuộc thảo luận đó chứ không nới tiếp theo tiền lệ này.

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
- `src/lib/analytics.ts` - thêm `ToolClickEvent` và `trackToolClick`

**Ghi chú về CLAUDE.md.** Mục "Routes & SEO" đang hướng dẫn thêm URL vào "mảng `urls` trong `vite.config.ts`". Mảng đó không còn tồn tại - sitemap thực tế được dựng bởi `buildSitemapXml` trong `src/lib/sitemap.ts`, với danh sách route tĩnh hardcode ngay trong hàm. Sửa lại câu đó trong CLAUDE.md như một phần của PR này.

`vite.config.ts` **không cần sửa**: `includedRoutes` đã tự nhận mọi route tĩnh qua `paths.filter((p) => !p.includes(':'))`, và `/tools` không có tham số.

## 8. Kiểm thử

- `src/data/tools/__tests__/index.spec.ts`: mọi `url` là HTTPS tuyệt đối, `name` và `description` không rỗng, không trùng `url`, `category` nằm trong union, `games` không rỗng, không có em-dash, và `gameNamingFailures` sạch trên **`description`** (không quét `name`).
- `src/views/__tests__/GuidesView.spec.ts` (file mới): khẳng định trang render đủ 3 heading nhóm và mọi guide xuất hiện đúng một lần, không rơi rớt bài nào.
- `src/components/__tests__/AppNavbar.spec.ts`: bổ sung khẳng định header có link `/tools/` và tổng số mục menu là 7.
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
- Bổ sung `sources[]` cho `aoe4-khac-de-che-the-nao`. Xem mục 10.

## 10. Rủi ro

**Bài so sánh vẫn nằm dưới nhãn "Hướng dẫn".** Đây là cái giá đã chấp nhận để không đụng URL. Giảm nhẹ bằng heading nhóm rõ ràng trên trang. Nếu lượng bài so sánh sau này áp đảo, mở lại quyết định ở mục 3.

**Đổi `kind` của `aoe4-khac-de-che-the-nao` sang `comparison`.** Sàn điểm không đổi - comment ở `src/data/guides/index.ts` ghi rõ comparison chấm sàn như strategy. Nhưng guide-evaluator kỳ vọng bài `comparison` có `sources[]` để truy vết claim, mà bài này chưa có.

**Quyết định của owner: bổ sung `sources[]` sau, ngoài phạm vi PR này.** Chấp nhận evaluator cảnh báo cho bài đó cho tới lúc bổ sung. Nhãn đúng ngay bây giờ đáng giá hơn là hoãn cả PR để chờ truy nguồn. Đây là việc còn nợ, cần theo dõi để không rơi.

**Link công cụ bên thứ ba có thể chết.** `aoe-aegis.vercel.app` nằm trên tên miền miễn phí, rủi ro cao nhất trong bốn. Không tự động hóa việc kiểm tra ở bản này; ghi nhận là việc cần rà tay khi chạy `seo-audit` hàng tháng.

**Header dày lên 7 mục.** Owner đã cân nhắc và chấp nhận, xem mục 6. Điểm cần canh: trên mobile menu là panel dọc nên 7 mục không chen nhau, nhưng ở breakpoint `lg` cả 7 nằm ngang cùng brand và nút Facebook. Sweep thủ công phải kiểm tra riêng khoảng `lg` hẹp (1024-1180px), nơi hàng ngang dễ tràn nhất.
