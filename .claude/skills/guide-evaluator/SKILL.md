---
name: guide-evaluator
description: Use when scoring or polishing a guide in src/data/guides or a news post in src/data/news before publish, or when running a write→score→fix loop. Grades one guide with a pinned strict rubric (SEO hygiene gate + structure/voice/conversion via median-of-3 judges + accuracy fact-checked against committed AoE facts files), writes a scorecard with VERDICT PASS/FAIL and a concrete fix list. Judge only - does not write the guide.
---

# Guide Evaluator (v3)

Chấm MỘT guide trong `src/data/guides/*.ts` (đã đăng ký trong `index.ts`). Judge thuần:
chỉ chấm + ghi góp ý, KHÔNG tự viết lại bài.

v3 vá lỗi Goodhart của v2 (loop tối ưu điểm rubric làm bài dở đi so với bản gốc):
- **Mỏ neo hai đầu**: điểm không còn tăng đơn điệu theo độ slang/hook. "Cố quá thành lố"
  (forced hook, slang gượng, CTA nhét bừa) bị chấm thấp y như "văn AI".
- **Cổng chống thụt lùi**: nếu đã có bản trước, một judge head-to-head phải xác nhận bản mới
  KHÔNG đọc dở hơn bản cũ. Bản mới thua bản cũ -> FAIL dù điểm rubric cao.
- **Sàn theo loại bài**: bài `utility` (tra cứu/thao tác) chấm nặng clarity, KHÔNG ép
  hook/slang; bài `strategy` giữ sàn chặt cả voice/conversion.
- **Cổng tôn trọng AoE1 (cứng)**: TUYỆT ĐỐI không dìm/hạ thấp Đế chế 1 (AoE1) hay cộng đồng
  AoE1 - đây là cộng đồng RTS gốc và lớn nhất VN, người đọc chính là dân AoE1. Có bất kỳ câu
  chê AoE1 dở/nhàm/"các phe na ná nhau" -> FAIL cứng như một mâu thuẫn sự thật. So sánh
  AoE1<->AoE4 để LÀM RÕ thì được; hạ thấp AoE1 thì KHÔNG.

## Đầu vào
Một `<slug>` đã có trong `@/data/guides`.

## Giao thức chấm (mỗi lần chạy)

### Bước 1 - Cổng vệ sinh SEO + đọc loại bài (tất định)
Chạy: `npx vite-node scripts/score-guide-seo.ts <slug>`
- Đọc `hygiene`. Nếu `hygiene.pass === false` -> guide bị loại ngay, ghi scorecard FAIL với
  `hygiene.failures`, KHÔNG chấm tiếp. SEO KHÔNG cho điểm chất lượng (nó cho ~10 với mọi bài
  thật nên vô dụng làm tín hiệu chất lượng).
- Đọc `kind` (`'utility'` | `'strategy'`). Đây là loại bài, quyết định bộ sàn ở Bước 4.

### Bước 2 - Chấm định tính bằng median-of-3 (structure / voice / conversion)
Dispatch **3 subagent fresh-eyes ĐỘC LẬP**, mỗi cái chấm cùng một bài bằng ĐÚNG prompt ghim
dưới đây. Điểm mỗi chiều = **TRUNG VỊ** của 3 lần (bỏ dao động ±1). Không tự nới tay: dùng
nguyên văn prompt, không thêm bớt giọng.

PROMPT GHIM (dán y nguyên cho mỗi subagent, thay `<slug>`):
```
Chấm bài src/data/guides/<slug>.ts cho dân kỳ cựu Đế chế 1 (AoE1) đọc AoE4. Chấm THẲNG TAY,
không nới. Mỗi chiều 0-10 số nguyên.

QUAN TRỌNG: chất lượng là ĐƯỜNG CONG HÌNH CHUÔNG, không phải "càng nhiều càng tốt". Vừa đủ
tự nhiên = cao điểm. THIẾU (khô cứng, không hook) VÀ THỪA (cố quá thành lố, slang gượng, hook
câu view, CTA nhét bừa) đều là điểm THẤP. Một câu thông tin sạch gọn, đi thẳng việc thường
TỐT HƠN một câu nhồi slang/hook - đừng thưởng điểm cho sự cố gắng lộ liễu.

- structure: bố cục, heading rõ, đoạn không dài, câu ngắn gãy gọn.
- voice: giọng trò chuyện dân Đế chế tự nhiên, KHÔNG "văn AI" và cũng KHÔNG slang gượng/xưng
  hô "anh em ơi" nhồi nhét. Có em-dash bất kỳ đâu -> voice <= 3. TUYỆT ĐỐI KHÔNG dìm/hạ thấp
  Đế chế 1 (AoE1) hay cộng đồng AoE1 (vd "phe AoE1 na ná nhau", "AoE1 nhàm/cũ kỹ"); so sánh
  AoE1<->AoE4 để làm rõ thì được, chê AoE1 dở thì KHÔNG. Có câu dìm AoE1 -> voice <= 2.
  Bài đúng thông tin nhưng giọng đơ, máy móc, nhịp câu lặp đều đều -> voice cao nhất là 5-6,
  KHÔNG phải 7-8.
- conversion: mở bài dẫn dắt đúng nhu cầu người đọc (không phải hook câu view rỗng), mạch
  dẫn tới CTA/cộng đồng tự nhiên. Với bài tra cứu, đi thẳng vào thông tin CŨNG là dẫn dắt tốt;
  hook cản đường thông tin -> trừ điểm.

Mỏ neo chuẩn (đối chiếu để chấm nhất quán):
- voice ~1 (thiếu, sáo AI): "Trong thế giới game chiến thuật đầy màu sắc, không thể phủ nhận rằng..."
- voice ~3 (thừa, slang gượng): "Chơi Đế chế 1 mãi cũng chán tay hả anh em ơi, vào chơi luôn cho nóng!"
- voice ~5 (lủng củng máy móc: đúng thông tin nhưng câu đơ, nhịp gãy, đọc như dịch):
  "Đó chính là cơ chế khắc chế quân rất chặt của Đế chế 4." / "Tuy nhiên, chẳng có gì miễn phí."
  Mẫu owner duyệt thêm, cùng mức ~5: "Vì sao Đế chế 4 bỏ được luật không thành thì bài
  so sánh hai game đã nói rồi." / "Sang Đế chế 4, thành không phải thứ để cấm mà là thứ
  để học." / "Càng về cuối đồ công càng khỏe hơn đồ thủ, nên rùa tới cuối game không phải
  kèo thơm." / "Tường không chỉ để chặn - nó là chỗ đứng đánh nhau."
  Mẫu owner chọn thêm 2026-08-03 (từ các bài PASS-nhưng-đơ, cùng mức ~5-6): "Game có 4 đời,
  chơi trọn cả 4 đời là chuyện bình thường." / "Chơi thành ở đây là một phần của game, chẳng
  ai coi đó là cù nhầy." / "Nếu xếp theo tốc độ: AoE3 > AoE1 > AoE4 > AoE2." / "Muốn biết vì
  sao Đế chế 4 để xây thành thoải mái mà game vẫn cân, đọc bài so sánh hai game." / "Biết lúc
  nào đáng bỏ gỗ ra xây, lúc nào phải đóng ram là đỡ bỡ ngỡ hẳn so với người mới cùng xuất
  phát." / "Kỵ nặng bên Đế chế 4 là xe tăng thời trung cổ: lì, chạy nhanh, chém đau." / "Nên
  trước khi lao kỵ vào, cân nhắc kỹ bài toán kinh tế." / "Camel Archer (lạc đà tên) ra từ
  đời 2, vừa chạy vừa bắn."
  LUẬT CỨNG: bài có vài câu dạng này (câu tuyên bố đơ "Đó chính là...", chuyển ý sáo
  "Tuy nhiên, chẳng...", câu kết kiểu thuyết minh, câu đúc kết đối xứng kiểu khẩu hiệu
  "không phải X mà là Y", câu tham chiếu lười "bài kia đã nói rồi") -> voice CẢ BÀI tối đa 6;
  nhận ra câu đơ trong fixes mà vẫn chấm voice 7-8 là chấm sai. Giọng hướng dẫn gãy gọn
  tự nhiên (câu lệnh ngắn, bước đánh số) KHÔNG tính là đơ.
- voice ~8 (vừa, văn thật của người thật - chuẩn đối chiếu): "Quân La Mã bị rơi vào vòng vây của quân Carthage." /
  "Thế nhưng, Milde chần chừ thiếu quyết đoán, không chịu thừa thắng truy kích, mất cơ hội tiêu diệt toàn bộ quân của Tướng Lee.". Bài đạt 8+ khi đọc lẫn được vào giọng này; thấp hơn rõ rệt -> 6 trở xuống.
- conversion ~1 (thiếu hook): "Bài viết dưới đây sẽ cung cấp cho bạn những thông tin hữu ích nhất."
- conversion ~3 (thừa, hook câu view rỗng chặn thông tin): "Bạn đã bao giờ tự hỏi làm sao để...? Đọc tiếp để biết bí mật!"
- conversion ~8 (vừa): mở bài chạm đúng thứ người đọc cần rồi đưa họ tới bước tiếp/cộng đồng.

Trả JSON: {"structure":X,"voice":X,"conversion":X,"fixes":[{"dimension":"...","quote":"câu trích đúng","suggestion":"câu thay"}]}
```

### Bước 2.5 - Cổng chống thụt lùi (head-to-head vs bản trước)
Mục tiêu: chặn loop "tối ưu chỉ số" đẩy một bài vốn đã tốt qua đỉnh đường cong (bản gốc sạch
bị viết lại thành slang gượng/hook rỗng mà điểm rubric lại CAO hơn).

1. Lấy bản trước từ git: `git show HEAD:src/data/guides/<slug>.ts`
2. Nếu working tree GIỐNG HỆT bản HEAD (bài chưa bị sửa vòng này) -> KHÔNG có gì để so,
   `regressedVsPrevious = false`, bỏ qua bước này.
3. Nếu KHÁC (bài đã bị viết lại): dispatch 1 subagent judge head-to-head. Đưa cho nó
   phần văn (paragraphs) của BẢN CŨ và BẢN MỚI, hỏi ĐÚNG:
   ```
   Hai phiên bản của cùng một bài guide AoE4 cho dân kỳ cựu Đế chế 1. Bản nào ĐỌC HAY HƠN
   cho người đọc đó (rõ, tự nhiên, không cố quá)? KHÔNG thưởng điểm cho bản chỉ vì nhiều
   slang/hook/CTA hơn - nếu thêm thắt làm bài lố hoặc chậm thông tin thì bản gọn hơn thắng.
   TUYỆT ĐỐI KHÔNG chọn bản có câu dìm/hạ thấp Đế chế 1 (AoE1) hay cộng đồng AoE1: bản nào
   dìm AoE1 thì bản kia thắng, dù nó "có duyên" hơn.
   BẢN CŨ: <dán paragraphs bản cũ>
   BẢN MỚI: <dán paragraphs bản mới>
   Trả JSON: {"winner":"old"|"new"|"tie","why":"1 câu"}
   ```
4. `regressedVsPrevious = (winner === "old")`. "tie" và "new" -> false.

### Bước 3 - Fact-check accuracy + kiểm tra tôn trọng AoE1 (đối chiếu facts file, KHÔNG tự đoán)
Dispatch 1 subagent đọc:
- `.claude/skills/guide-evaluator/facts/aoe1-facts.md`
- `.claude/skills/guide-evaluator/facts/aoe4-facts.md`
Nhiệm vụ 1 - trích MỌI claim sự thật trong bài, rồi phân loại theo facts file:
- Claim MÂU THUẪN facts -> `contradictions[]` (mỗi cái: câu trích + fact bị vi phạm).
- Claim facts XÁC NHẬN đúng -> bỏ qua.
- Claim KHÔNG có trong facts -> `claimsToVerify[]` (chờ người duyệt). TUYỆT ĐỐI không tự
  khẳng định sai với thứ ngoài facts (tránh nghi oan - lỗi đã thấy ở calibration).
Nhiệm vụ 2 - quét MỌI câu DÌM/HẠ THẤP Đế chế 1 (AoE1) hoặc cộng đồng AoE1 -> `aoe1Disparagement[]`
(mỗi cái: câu trích + vì sao là dìm). Người đọc chính là dân AoE1; hạ thấp AoE1 là cấm.
- Là dìm: "phe AoE1 na ná nhau", "AoE1 nhàm/cũ kỹ/lỗi thời", "AoE1 nông", "chọn phe AoE1 chỉ đổi màu".
- KHÔNG phải dìm: so sánh trung tính làm rõ điểm khác biệt AoE4 mà không chê AoE1 (vd "AoE4 mỗi
  phe một cơ chế riêng" - nêu đặc điểm AoE4, không đụng chạm AoE1).
Trả JSON: {"contradictions":[...],"claimsToVerify":[...],"aoe1Disparagement":[...]}
Ví dụ mâu thuẫn phải bắt: câu ngụ ý "cung R khắc tất" -> facts nói cung R (Chariot Archer) và
cung A (Composite Bowman) KHÔNG khắc chế class nào -> contradiction.
Ví dụ dìm phải bắt: "Bên Đế chế 1 các phe đánh na ná nhau, chọn phe gần như chỉ đổi màu" -> aoe1Disparagement.

### Bước 4 - Verdict tất định
Điểm cuối mỗi chiều = trung vị 3 lần ở Bước 2. Chọn sàn theo loại bài:
`floorsForKind(kind)` từ `@/lib/guideVerdict` (kind từ Bước 1). Rồi tính:
```
guideVerdict(
  hygiene.pass,
  {structure, voice, conversion},
  {contradictions: contradictions.length, aoe1Disparagement: aoe1Disparagement.length},
  floorsForKind(kind),
  {regressedVsPrevious},   // từ Bước 2.5
)
```
Sàn: `strategy` = structure/voice 7, conversion 6. `utility` = structure 7, voice 5, conversion 3
(nặng clarity, không ép hook/slang). Không có ngưỡng tổng.
PASS chỉ khi hàm trả `pass: true`. Mâu thuẫn sự thật VÀ dìm AoE1 là cổng cứng - chỉ cần > 0
là FAIL bất kể điểm. `claimsToVerify` KHÔNG chặn PASS - đây là danh sách advisory, người duyệt
xem lại SAU KHI bài đã PASS, không phải điều kiện để loop tiếp tục chạy.

### Bước 5 - Ghi scorecard
Ghi ra `docs/reviews/<slug>-scorecard.md` theo mẫu:
```
# Scorecard v3: <slug>

Loại bài (kind): utility/strategy
SEO hygiene: PASS/FAIL (nếu FAIL: liệt kê failures)

| Chiều | Điểm (median 3) | Sàn (<kind>) | Đạt |
|-------|:---:|:---:|:---:|
| structure  | X | 7 | ✅/❌ |
| voice      | X | 7 hoặc 5 | ✅/❌ |
| conversion | X | 6 hoặc 3 | ✅/❌ |
| TỔNG (thông tin, không phải gate) | XX/30 | - | - |

Chống thụt lùi: <"không có bản trước để so" | "bản mới >= bản cũ (winner: new/tie)" | "THỤT LÙI: bản cũ đọc hay hơn (FAIL cứng)">

Tôn trọng AoE1: <"không có câu dìm AoE1" | "VI PHẠM (FAIL cứng): <liệt kê câu dìm>">

Accuracy:
- Mâu thuẫn sự thật (FAIL cứng): <liệt kê câu + fact bị vi phạm, hoặc "không có">

Claim cần bạn duyệt sau khi PASS (không chặn loop):
- <liệt kê claimsToVerify, hoặc "không có">

VERDICT: <ghi đúng một từ: PASS hoặc FAIL>
Reasons (nếu FAIL): <copy reasons từ guideVerdict>

## Cần sửa
- [chiều] "câu có vấn đề" -> câu thay
```
Dòng `VERDICT: PASS` / `VERDICT: FAIL` là mốc harness bám vào - phải đúng dạng, đúng một từ.

## Chạy trong loop với ralph-loop
```
/ralph-loop "Trau chuốt guide <slug> trong src/data/guides. Mỗi vòng: (1) dùng skill guide-evaluator chấm <slug>; (2) đọc docs/reviews/<slug>-scorecard.md; (3) nếu VERDICT FAIL, sửa file guide đúng theo 'Cần sửa' và các mâu thuẫn sự thật - chỉ sửa văn/nội dung, giữ slug + cấu trúc dữ liệu; TUYỆT ĐỐI không thêm câu dìm/hạ thấp Đế chế 1 (AoE1); nếu lý do FAIL là 'regressed' thì HOÀN NGUYÊN về bản cũ (git) thay vì sửa thêm; (4) chấm lại. CHỈ in <promise>GUIDE-PASSED</promise> khi scorecard mới nhất VERDICT: PASS. Chỉ mâu thuẫn sự thật, dìm AoE1, hygiene, chất lượng dưới sàn và thụt lùi PHẢI hết mới được PASS - claimsToVerify không chặn loop - KHÔNG in promise giả." --completion-promise "GUIDE-PASSED" --max-iterations 12
```
Lưu ý:
- Cổng chống thụt lùi so với bản `git HEAD`. Trong một phiên loop, đừng commit bài giữa chừng,
  nếu không baseline sẽ trôi theo bản mới và cổng mất tác dụng.
- Claim ngoài facts (`claimsToVerify`) là danh sách advisory - bạn (người duyệt) xem lại sau
  khi bài đã PASS, chốt đúng/sai hoặc bổ sung vào facts file. Loop không chờ việc này để PASS.

## Chế độ news (bài trong src/data/news)

Khi `<slug>` nằm trong `@/data/news` (không phải guides), chấm theo ĐÚNG giao thức trên với
các thay đổi sau - mọi thứ không nhắc tới thì giữ nguyên:

1. **Bước 1**: chạy `npx vite-node scripts/score-news-seo.ts <slug>` thay cho score-guide-seo.
   `kind` luôn là `news`.
2. **Bước 2**: prompt ghim giữ nguyên, thay đường dẫn file thành `src/data/news/<slug>.ts` và
   thêm đúng một câu vào cuối đoạn QUAN TRỌNG: "Đây là BẢN TIN: đi thẳng thông tin, ngắn gọn
   thời sự; hook/slang không được chặn thông tin." Chấm conversion như bài tra cứu (đi thẳng
   vào thông tin là dẫn dắt tốt).
3. **Bước 2.5**: giữ nguyên, so với `git show HEAD:src/data/news/<slug>.ts`.
4. **Bước 3 (fact-check news)**: ngoài 2 nhiệm vụ cũ (đối chiếu facts corpus + quét dìm AoE1),
   subagent làm thêm nhiệm vụ XÁC MINH NGUỒN TRỰC TIẾP:
   a) Đọc facts sheet `docs/facts-review/<slug>.md` (bảng claim -> nguồn). Không có
      facts sheet -> FAIL hygiene luôn, ghi rõ lý do.
   b) WebFetch TỪNG URL trong `sources[]` của bài, đối chiếu TỪNG claim sự kiện/số liệu
      với nội dung nguồn thật (không tin facts sheet mù quáng). Mỗi claim ra đúng một
      trong ba kết cục:
      - Nguồn xác nhận claim -> qua.
      - Nguồn nói NGƯỢC LẠI claim -> `contradictions[]` (với news, sai so với nguồn
        nghiêm trọng ngang sai facts). Claim không có dòng nào trong facts sheet cũng
        tính vào đây như trước.
      - KHÔNG XÁC MINH ĐƯỢC (URL chết, timeout, hoặc nguồn không nhắc tới claim - có
        thể là diễn giải tổng hợp) -> `unverifiableClaims[]` (câu trích + lý do).
   WebFetch lỗi KHÔNG BAO GIỜ làm sập vòng chấm - claim liên quan rơi về
   `unverifiableClaims`. JSON trả về thêm trường: {"unverifiableClaims":[...]}.
   `unverifiableClaims` KHÔNG chặn PASS ở giai đoạn 1 (advisory như claimsToVerify)
   nhưng là điều kiện chặn auto-merge ở giai đoạn 2 (xem skill write-article).
5. **Bước 4**: dùng `floorsForArticleKind('news')` từ `@/lib/guideVerdict` (structure 7,
   voice 5, conversion 3).
6. **Bước 5**: scorecard ghi `Loại bài (kind): news` và thêm dòng
   `Truy vết nguồn: <"mọi claim xác minh trực tiếp từ nguồn" | "VI PHẠM: <claim bị
   nguồn nói ngược / thiếu nguồn>" | "CHƯA XÁC MINH ĐƯỢC (không chặn PASS giai đoạn 1):
   <liệt kê unverifiableClaims>">`.
