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

## Bước 0 - Chuẩn bị giọng văn (bắt buộc trước khi viết bất kỳ bài nào)

1. Đọc `docs/voice-corpus/voice-guide.md`. Nếu file chưa có, hoặc
   `docs/voice-corpus/samples.md` đã đổi sau lần sinh ghi ở đầu voice-guide ->
   chưng cất lại: đọc TOÀN BỘ samples.md, viết voice-guide.md gồm đúng hai mục:
   - `## Đặc điểm giọng`: nhịp và độ dài câu, từ vựng và xưng hô, cách vào bài,
     cách chốt, cách nêu quan điểm - MỖI đặc điểm kèm một trích dẫn nguyên văn
     từ corpus làm ví dụ.
   - `## Few-shot (5-8 đoạn đắt nhất)`: mỗi đoạn dưới một heading `###` nhãn
     ngữ cảnh (mở bài / giải thích cơ chế / nêu quan điểm / chốt hạ), trích
     nguyên văn dạng blockquote.
   Dòng đầu file: `> Sinh tự động từ samples.md ngày YYYY-MM-DD, N mẫu - không sửa tay.`
   Commit bằng `git add -f` (docs/ nằm trong gitignore).
2. Văn mẫu CHỈ để học giọng - TUYỆT ĐỐI không chép nguyên câu từ corpus vào bài.
   Bài viết ra là văn mới cùng chất giọng.
3. Chống công thức: đọc mở bài + chốt bài của 3 bài mới nhất trên site (theo
   updatedAt/publishedAt); bài sắp viết không được lặp khuôn mở/chốt của chúng.

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
   - Bài `comparison`: phân tầng theo game claim nói về:
     | Claim về | Yêu cầu |
     | --- | --- |
     | AoE1 / meta VN | Trong kho `aoe1-facts.md` -> `[ĐÃ CÓ TRONG KHO]`; ngoài kho -> `[CẦN XÁC NHẬN]` (câu hỏi cho owner) |
     | AoE4 | Kho `aoe4-facts.md` -> `[ĐÃ CÓ TRONG KHO]`; hoặc URL nguồn chính thức (WebFetch trích đúng) |
     | AoE2 / AoE3 / StarCraft | Kho `aoe2-facts.md` / `aoe3-facts.md` / `starcraft-facts.md` TRƯỚC -> `[ĐÃ CÓ TRONG KHO]` kèm trích dòng fact VÀ URL nguồn đi kèm dòng đó; ngoài kho thì BẮT BUỘC URL nguồn chính thức (wiki game, Liquipedia, patch notes); không kho không nguồn -> `[KHÔNG CÓ NGUỒN - SẼ BỎ KHỎI BÀI]` |

   Ba kho AoE2/AoE3/StarCraft là bản cache của thao tác fetch, dựng ngày 2026-08-08 vì phiên
   headless không ra được internet (network policy chỉ mở GitHub/npm). Mỗi dòng fact mang theo
   URL nó lấy từ đâu, nên dùng kho vẫn thỏa luật "claim phải truy vết được về nguồn".
   HAI NGOẠI LỆ CỨNG:
   - Dòng nào trong kho có cờ `⚠️ CẦN NGƯỜI DUYỆT` thì KHÔNG tính là `[ĐÃ CÓ TRONG KHO]`. Nó là
     `[CẦN XÁC NHẬN]`, tức item rớt điều kiện headless. Cờ đó có mặt chính là để chặn chỗ này.
   - Ba kho này CHƯA qua vòng duyệt của owner như `aoe1-facts.md`/`aoe4-facts.md`. Mục "Open
     questions" cuối mỗi file liệt kê đúng những chỗ còn hổng; claim rơi vào vùng đó thì đừng
     viết, dù có vẻ hiển nhiên.
3. Mẫu bảng:
   | # | Claim | Trạng thái | Nguồn / fact đối chiếu |

## Bước 2 - Cổng owner

- Guide có claim `[CẦN XÁC NHẬN]`: đặt status queue = `facts-pending`, DỪNG và mời owner
  duyệt file facts sheet (sửa/xác nhận trực tiếp trong file). Không có owner trong phiên ->
  kết thúc tại đây, phiên sau chạy lại skill sẽ tiếp tục.
- Guide 100% claim `[ĐÃ CÓ TRONG KHO]`: bỏ qua cổng, ghi vào facts sheet dòng
  "Bỏ qua cổng owner: 100% facts từ kho đã xác minh". (Đây là cơ chế mở khóa giai đoạn 2.)
- News: cổng nhanh - owner liếc bảng claim->nguồn và gật (hoặc tự bỏ claim thiếu nguồn).
- Comparison: 0 claim `[CẦN XÁC NHẬN]` (mọi claim có kho hoặc nguồn) -> bỏ qua cổng owner,
  ghi dòng "Bỏ qua cổng owner: mọi claim có kho/nguồn" vào facts sheet. Có claim AoE1/meta VN
  ngoài kho -> status `facts-pending`, chờ owner như guide thường.
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
   Comparison: tạo `src/data/guides/<slug>.ts` như guide với `kind: 'comparison'`,
   `sources[]` = đúng các URL trong facts sheet, `cta: true`; internal link >= 1 tới bài
   liên quan có thật (ưu tiên bài so sánh/guide AoE4 gần chủ đề).
3. CHỈ dùng claim đã duyệt trong facts sheet. Giọng văn: viết theo
   `docs/voice-corpus/voice-guide.md` (đặc điểm + few-shot, đã đọc ở Bước 0) ngay từ
   nháp đầu - không viết chay rồi chờ evaluator vá. Tự nhiên, không "văn AI", không
   slang gượng, TUYỆT ĐỐI không dìm game/cộng đồng RTS nào (AoE1, AoE2, AoE3, StarCraft...).
   ĐẶT TÊN GAME theo quy ước ở CLAUDE.md mục "Naming the games": thân bài (đoạn văn,
   heading, anchor text) gọi `Đế chế 1/2/3/4`, KHÔNG dùng `AoE4` hay `Age of Empires IV`
   làm nhãn thường trực; `Đế chế` trơ chỉ để chỉ CẢ DÒNG và phải đi sau `dòng`/`cộng đồng`/
   `làng`. Viết tắt để dành cho title, description, slug, meta. Vi phạm là FAIL hygiene ở
   Bước 4, không phải góp ý.
4. HAI LUẬT NỘI DUNG CỨNG (owner chốt 2026-08-07, sau lần fact-check lại các bài đã đăng):
   - **Không neo số của meta làm luật chung.** Con số kiểu "23 dân lên đời" bên Đế chế 1 tùy
     bài mà đổi (~23 cho bài chém, ~26 cho bài cung) và trôi theo meta, viết ra thành luật
     chung là SAI chứ không phải hơi rộng. Muốn gợi lại kèo AoE1 thì tả DẠNG BÀI: "bài chém
     sớm", "bài chủ lực khoẻ". Số chỉ được dùng khi câu văn nói rõ đó là ví dụ.
   - **Bài `comparison` chỉ so đúng HAI game trong tiêu đề.** Game thứ ba (kể cả Đế chế 1)
     chỉ được nhắc qua, không cấp đoạn riêng, không dựng khung "bên kia đọc cũng dùng được
     nguyên bài", không lấy làm anchor text. Nhắc qua một câu để định vị hai game chính (vd
     xếp hạng nhịp trận cả dòng) thì được. Muốn phục vụ nhóm đọc đó thì để khối `related`
     và internal link làm việc, đừng kéo game thứ ba vào thân bài.
5. Status queue = `drafted`. Bài MỚI (chưa có trên `main`): CHƯA commit file bài ở bước này, để
   nguyên trong working tree tới khi evaluator PASS ở Bước 4 rồi commit một lần cùng status
   queue. Sở dĩ phải chờ là bởi commit bản nháp làm nó thành mốc đối chiếu cho các vòng sau và
   dễ kéo cả loop đi sai (ca thật: dry run comparison 2026-08-06). Bài đã có trên `main` mà đang
   trau chuốt lại thì cũng KHÔNG commit giữa loop, giữ nguyên bản main làm mốc.

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
4. Mở PR bằng `gh pr create`. Chuyện account: máy owner có hai gh account nên phải
   `gh auth switch --user shishi-77` trước và switch về sau khi xong. Phiên headless chạy
   trong sandbox cloud CHỈ có một identity - KHÔNG chạy `gh auth switch` ở đó, lệnh sẽ fail
   và kéo đổ luôn bước PR. Không chắc đang ở đâu thì `gh auth status` trước: thấy đúng một
   account -> bỏ qua switch.
   Body PR gồm: tóm tắt bài, VERDICT PASS + điểm từ scorecard, danh sách claimsToVerify
   (nếu có) để owner liếc, và 2 link share UTM (owner copy khi đăng FB/Discord).
5. Owner merge -> phiên sau (hoặc ngay nếu owner còn đó) đổi status = `published`, gộp vào
   PR/branch queue kế tiếp.

## Điều kiện headless (scheduled agent dùng - đang bật)

Một queue item ĐỦ ĐIỀU KIỆN cho phiên chạy không có owner khi thỏa MỘT trong:

1. `comparison` hoặc `news`: facts sheet KHÔNG có claim `[CẦN XÁC NHẬN]` - mọi claim có kho
   hoặc URL nguồn. Sau khi chấm, scorecard có `unverifiableClaims` -> PR vẫn mở nhưng liệt kê
   rõ trong PR body mục "Cần owner liếc trước khi merge".
2. `guide`: 100% claim `[ĐÃ CÓ TRONG KHO]`.

Item không đủ điều kiện -> phiên headless BỎ QUA (đặt/giữ `facts-pending` nếu vừa soạn facts
sheet), thử item kế tiếp trong queue. Headless TUYỆT ĐỐI không merge PR - owner là người merge
duy nhất, mọi trường hợp.
