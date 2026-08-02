---
name: write-article
description: Use to produce one article (guide or news) for aoe4.vn from a topic in src/data/content-queue.json - runs the full semi-auto pipeline: facts sheet, owner validation gate, draft following the repo data-file pattern, guide-evaluator scoring loop (max 3 rounds), then a PR with UTM share links. Never writes AoE facts from generic knowledge; owner must be in the session for the facts gate.
---

# Write Article (M1 - viết một bài từ hàng đợi)

Đầu vào: một `<slug>` có trong `src/data/content-queue.json` với status `proposed`,
`facts-pending` hoặc `facts-approved`. Status khác -> dừng, báo owner.

NGUYÊN TẮC CỨNG (xem memory vn-aoe-domain-content): KHÔNG BAO GIỜ viết facts Đế chế/AoE
từ kiến thức generic. Guide: mọi claim phải nằm trong kho facts đã duyệt hoặc được owner
xác nhận ở Bước 2. News: mọi claim phải truy vết được về URL nguồn chính thức.

## Bước 1 - Facts sheet

Soạn `docs/facts-review/<slug>.md`:

1. Phác dàn ý bài (heading + ý chính mỗi mục) từ targetKeyword + notes trong queue item.
2. Liệt kê MỌI claim sự thật bài sẽ cần, mỗi claim một dòng bảng:
   - Bài `guide`: đối chiếu `.claude/skills/guide-evaluator/facts/aoe1-facts.md` và
     `aoe4-facts.md`. Claim có trong kho -> đánh dấu `[ĐÃ CÓ TRONG KHO]` kèm trích dòng fact.
     Claim chưa có -> `[CẦN XÁC NHẬN]` kèm câu hỏi cụ thể cho owner.
   - Bài `news`: mỗi claim kèm URL nguồn chính thức (patch notes ageofempires.com, Liquipedia,
     Steam...). Dùng WebFetch đọc nguồn để trích đúng; claim không tìm được nguồn thì GHI RÕ
     `[KHÔNG CÓ NGUỒN - SẼ BỎ KHỎI BÀI]`.
3. Mẫu bảng:
   | # | Claim | Trạng thái | Nguồn / fact đối chiếu |

## Bước 2 - Cổng owner

- Guide có claim `[CẦN XÁC NHẬN]`: đặt status queue = `facts-pending`, DỪNG và mời owner
  duyệt file facts sheet (sửa/xác nhận trực tiếp trong file). Không có owner trong phiên ->
  kết thúc tại đây, phiên sau chạy lại skill sẽ tiếp tục.
- Guide 100% claim `[ĐÃ CÓ TRONG KHO]`: bỏ qua cổng, ghi vào facts sheet dòng
  "Bỏ qua cổng owner: 100% facts từ kho đã xác minh". (Đây là cơ chế mở khóa giai đoạn 2.)
- News: cổng nhanh - owner liếc bảng claim->nguồn và gật (hoặc tự bỏ claim thiếu nguồn).
- Sau khi owner duyệt: status = `facts-approved`. Facts guide mới được xác nhận -> APPEND vào
  đúng file facts corpus (`aoe1-facts.md` / `aoe4-facts.md`) theo format sẵn có, kèm dòng
  `Confirmed by site owner <YYYY-MM-DD>` - commit cùng PR của bài.

## Bước 3 - Viết bài

1. Tạo branch `claude/article-<slug>`.
2. Guide: tạo `src/data/guides/<slug>.ts` theo `_template.ts`, đăng ký vào `index.ts`, đặt
   `kind` (`utility` | `strategy`) theo bản chất bài, `cta: true`, `updatedAt` hôm nay;
   internal link: >= 1 link tới bài liên quan có thật (theo design internal-linking).
   News: tạo `src/data/news/<slug>.ts` theo `_template.ts` của news, đăng ký vào `index.ts`,
   `sources[]` = đúng các URL trong facts sheet, `cta: true`, `publishedAt` hôm nay.
3. CHỈ dùng claim đã duyệt trong facts sheet. Giọng văn: theo mỏ neo trong guide-evaluator
   (tự nhiên, không "văn AI", không slang gượng, TUYỆT ĐỐI không dìm AoE1).
4. Status queue = `drafted` (commit cùng bài).

## Bước 4 - Chấm và sửa (tối đa 3 vòng)

1. Dùng skill guide-evaluator chấm `<slug>` (bài news tự vào chế độ news).
2. Đọc scorecard `docs/reviews/<slug>-scorecard.md`. FAIL -> sửa đúng theo "Cần sửa" +
   contradictions, chấm lại. Lý do FAIL là `regressed` -> hoàn nguyên bản cũ thay vì sửa thêm.
3. FAIL cả 3 vòng: status = `parked` + notes = lý do từ scorecard, commit, mở PR draft để
   owner xem, DỪNG. Không bao giờ ship bài FAIL.

## Bước 5 - PR

1. `npm run lint:check && npm run type-check && npm run test:run` - xanh hết mới đi tiếp.
2. Status queue = `in-pr`.
3. Lấy link share: `npx vite-node scripts/share-links.ts /guides/<slug>/` (hoặc `/news/...`).
4. Mở PR (gh account collaborator: `gh auth switch --user shishi-77`, switch về sau khi xong)
   với body gồm: tóm tắt bài, VERDICT PASS + điểm từ scorecard, danh sách claimsToVerify
   (nếu có) để owner liếc, và 2 link share UTM (owner copy khi đăng FB/Discord).
5. Owner merge -> phiên sau (hoặc ngay nếu owner còn đó) đổi status = `published`, gộp vào
   PR/branch queue kế tiếp.

## Giai đoạn 2 (chưa bật - chỉ ghi nhận)

Chạy headless theo lịch chỉ khi: bài guide 100% facts từ kho + evaluator PASS + gate xanh +
kind nằm trong danh sách owner cho phép. Thiếu một điều kiện -> PR để mở chờ owner như thường.
Không tự merge trong giai đoạn hiện tại.
