# Thiết kế: thống nhất cách gọi tên game trên toàn site

> Ngày: 2026-08-07 · Phạm vi: quy ước đặt tên game trong mọi chữ người đọc thấy, cộng cơ chế
> chặn tự động · Tác giả: solo dev
> Kế thừa: spec 2026-08-03 (móng giọng văn + kind `comparison`). Spec này KHÔNG đổi giọng văn -
> nó chốt phần danh pháp mà spec kia để ngỏ khi mở site sang AoE2/AoE3/StarCraft.

## 1. Vấn đề

Site mở rộng khỏi phạm vi cộng đồng AoE1, và danh pháp trôi theo từng bài. Đo trên `src/`
trước khi sửa: `Đế chế 4` 87 lần, `AoE4` 46, `Age of Empires IV` 31, `Đế chế` trơ 41,
`AoE2/AoE1/AoE3` 32, `Đế chế 1/2` 6. Bốn hệ đặt tên song song.

Nặng nhất là lẫn trong cùng một câu:

> `aoe4-khac-de-che-the-nao.ts` - "nếu xếp cả dòng game theo nhịp trận thì **AoE3** nhanh nhất,
> kế đến là **Đế chế**, rồi mới tới **Đế chế 4**, còn **AoE2** chậm nhất."

Bốn game, ba hệ đặt tên, một câu. Thêm một bẫy riêng: `Đế chế` trơ đang mang nghĩa AoE1 - đúng
cách cộng đồng Việt nói, nhưng đặt cạnh `Đế chế 4` thì người đọc mới không thể biết `Đế chế`
là cả dòng hay là một game cụ thể.

## 2. Quyết định của owner (chốt trong phiên brainstorm 2026-08-06)

1. **Hệ Việt hoá làm chuẩn** trong văn xuôi, viết tắt vẫn được dùng nhưng phải có luật.
2. **Ranh giới:** Việt hoá trong văn xuôi, viết tắt ở vùng kỹ thuật. Trong một đoạn văn tuyệt
   đối không đổi hệ giữa dòng.
3. **`Đế chế` trơ chỉ dành cho CẢ DÒNG**, không bao giờ trỏ một game. Game cụ thể luôn có số.
4. **Chặn cả ba tầng:** test tự động + quy ước cho writer + chỉ tiêu cho evaluator.

## 3. Quy ước

**Vùng văn xuôi** (Việt hoá, bắt buộc): `section.heading`, `section.paragraphs`, câu hỏi và câu
trả lời FAQ, anchor text (`related[].label`, `section.link.label`), và mọi chuỗi hiển thị trong
`<template>` của view/component.

**Vùng kỹ thuật** (giữ viết tắt và tên tiếng Anh, vì chúng gánh traffic tìm kiếm): `title`,
`description`, slug, meta trong `useHead`, JSON-LD, `sources[].label`, và tên thương hiệu
`AoE4 VN`. Slug đã publish thì KHÔNG bao giờ đổi.

Luật:

| # | Luật | Ví dụ sai | Ví dụ đúng |
| --- | --- | --- | --- |
| R1 | Văn xuôi gọi game bằng `Đế chế 1/2/3/4` | `Bên AoE2, tường gỗ có từ Dark Age` | `Bên Đế chế 2, tường gỗ có từ Dark Age` |
| R2 | `Đế chế` trơ = cả dòng; phải có số hoặc đi sau `dòng`/`series`/`cộng đồng`/`làng` | `người chơi Đế chế sang Đế chế 4` | `người chơi Đế chế 1 sang Đế chế 4` |
| R3 | `AoE` trơ không dùng trong văn xuôi | `game nào trong dòng AoE cũng vậy` | `game nào trong dòng Đế chế cũng vậy` |
| R4 | Tên tiếng Anh không làm nhãn thường trực | `Age of Empires IV nhẹ hơn đáng kể` | `Đế chế 4 nhẹ hơn đáng kể` |

Hai ngoại lệ trong văn xuôi, cả hai đều máy kiểm được:

1. **Gloss** - dấu ngoặc mở ngay sau tên Việt, để người đọc học alias đúng một lần:
   `Đế chế 4 (tên chính thức Age of Empires IV, viết tắt AoE4)`, `dòng Đế chế (tên gốc Age of Empires)`.
2. **Trích literal** - chuỗi người đọc phải gõ hoặc tìm, đặt trong ngoặc kép:
   `Tìm "Age of Empires IV" trong cửa hàng`.

Tên miền `aoe4.vn` không tính là tham chiếu game.

## 4. Cơ chế chặn

`gameNamingFailures(texts: string[]): string[]` trong `@/lib/gameNaming` - tất định, không LLM.
Cách hoạt động: tính trước các span gloss (`Đế chế[ n](...)`) và span ngoặc kép, rồi soi từng
match của `AoE\d?`, `Age of Empires <numeral>` và `Đế chế`; match nằm ngoài span cho phép thì
thành một failure kèm trích đoạn 70 ký tự quanh chỗ lỗi.

Ba cổng dùng chung một hàm đó:

| Cổng | Chỗ cắm | Chặn cái gì |
| --- | --- | --- |
| Test | `src/data/__tests__/game-naming.spec.ts` | `npm run test:run` đỏ nếu guide/news/FAQ lệch |
| Audit | `auditContent` trong `@/lib/seoAudit` | skill `seo-audit` báo cùng chỗ với lỗi em-dash |
| Evaluator | `hygiene.failures` từ `scripts/score-guide-seo.ts` và `score-news-seo.ts` | guide-evaluator FAIL ngay Bước 1, không chấm tiếp |

Tầng người/máy đọc: CLAUDE.md mục "Naming the games" (nạp mọi session), skill `write-article`
Bước 3, skill `guide-evaluator` Bước 1. KHÔNG ghi vào `voice-guide.md` vì file đó sinh tự động
và sẽ mất quy ước ở lần chưng cất kế tiếp; `docs/voice-corpus/README.md` chỉ trỏ sang CLAUDE.md.

**Không phủ tự động:** chuỗi hiển thị trong `<template>` của view/component - trong cùng file
lẫn cả chữ hiển thị và meta nên không phân biệt máy móc được. Phần này sửa tay lần này và đi
theo checklist thủ công của skill `seo-audit`, giống cách các trang tĩnh đang được xử lý.

## 5. Phạm vi đã sửa

- Cả 11 guide: `aoe4-khac-de-che-the-nao`, `aoe4-vs-aoe2-khac-biet-cot-loi`,
  `cung-r-ngua-chem-aoe4`, `tuong-thanh-phong-thu-aoe4`, `tim-nguoi-viet-choi-aoe4`,
  `cac-che-do-choi-aoe4`, `cac-nen-van-minh-aoe4`, `cach-tai-aoe4`, `cau-hinh-may-aoe4`,
  `build-order-co-ban-aoe4`, `huong-dan-aoe4-nguoi-moi`.
- `src/data/faq.ts`, `src/data/news/ra-mat-chuyen-muc-tin-tuc.ts`.
- Chữ hiển thị: `FAQView.vue`, `HomeView.vue`, `AppFooter.vue`, `CommunityCta.vue`.
- Title/description/slug giữ nguyên hoàn toàn, TRỪ hai title có `Đế chế` trơ nhập nhằng được
  thêm số (`aoe4-khac-de-che-the-nao`, `cung-r-ngua-chem-aoe4`) - từ khoá cũ vẫn là substring
  của title mới nên không mất coverage.

## 6. Rủi ro SEO đã kiểm

`scoreGuideSeo` chỉ đọc `title` và `description`, không đọc thân bài, nên đổi văn xuôi không
ảnh hưởng điểm SEO. Xác nhận sau khi sửa: `seo-audit` 0 finding, `dimensionScore` bài comparison
vẫn 9.5. Từ khoá viết tắt vẫn hiện diện on-page qua title (là H1) và qua gloss ở bài
`cac-nen-van-minh-aoe4`, `cach-tai-aoe4`, FAQ item 1, eyebrow FAQView.

## 7. Kiểm thử

- 13 unit test cho `gameNamingFailures`, gồm các ca âm: alias trong văn xuôi, `AoE` trơ, tên
  tiếng Anh làm nhãn thường trực, gloss của game này không bảo kê alias của game khác.
- Chứng minh cổng thật sự chặn: tiêm một `AoE4` vào anchor text rồi xác nhận cả ba cổng đỏ, sau
  đó hoàn nguyên.
- `npm run lint:check && npm run type-check && npm run test:run` xanh (38 file, 235 test).

## 8. Tiêu chí thành công

- 0 finding từ `seo-audit` và test naming trên toàn bộ content hiện có.
- Bài mới do scheduled agent viết không thể lệch danh pháp mà vẫn PASS evaluator.
- Không mất impressions cho các query chứa `aoe4`, `aoe2` (theo dõi ở kỳ `propose-topics` kế tiếp).
