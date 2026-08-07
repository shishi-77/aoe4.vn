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
- **Cổng tôn trọng game RTS (cứng)**: TUYỆT ĐỐI không dìm/hạ thấp BẤT KỲ game/cộng đồng RTS
  nào - AoE1 (cộng đồng gốc và lớn nhất VN), AoE2, AoE3, StarCraft... Người đọc bài so sánh
  chính là dân game đó; chê game của họ là tự đuổi khách. Có bất kỳ câu chê một game RTS
  dở/nhàm/lỗi thời/"các phe na ná nhau" -> FAIL cứng như một mâu thuẫn sự thật. So sánh
  giữa các game để LÀM RÕ khác biệt thì được; phán game nào dở hơn thì KHÔNG.

## Đầu vào
Một `<slug>` đã có trong `@/data/guides`.

## Giao thức chấm (mỗi lần chạy)

### Bước 1 - Cổng vệ sinh SEO + đọc loại bài (tất định)
Chạy: `npx vite-node scripts/score-guide-seo.ts <slug>`
- Đọc `hygiene`. Nếu `hygiene.pass === false` -> guide bị loại ngay, ghi scorecard FAIL với
  `hygiene.failures`, KHÔNG chấm tiếp. SEO KHÔNG cho điểm chất lượng (nó cho ~10 với mọi bài
  thật nên vô dụng làm tín hiệu chất lượng).
- `hygiene.failures` gộp cả LỖI ĐẶT TÊN GAME (quy ước ở CLAUDE.md mục "Naming the games":
  thân bài gọi `Đế chế 1/2/3/4`; `Đế chế` trơ chỉ dành cho cả dòng). Đây là luật tất định,
  không phải chuyện gu - thấy nó trong `failures` thì ghi FAIL và trả nguyên câu lỗi vào
  "Cần sửa", đừng diễn giải lại.
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

- structure: bố cục, heading rõ, đoạn không dài, câu mạch lạc (câu dài nhiều vế vẫn tốt
  miễn các vế nối rõ ràng, không rối).
- voice: chuẩn giọng là CẨM NANG CỘNG ĐỒNG Đế chế (kiểu aoe.vn, owner chốt 2026-08-06):
  người chơi lâu năm giảng lại cho anh em, từ tốn, giải thích kèm lý do ("Sở dĩ... là bởi"),
  thuật ngữ cộng đồng lần đầu để trong ngoặc kép, câu được phép dài nhiều vế nối bằng
  "Bên cạnh đó/Chính vì vậy/Do đó" - KHÔNG trừ điểm vì câu dài đúng mạch. KHÔNG "văn AI",
  KHÔNG slang gượng/xưng hô "anh em ơi" nhồi nhét, và cũng KHÔNG văn gằn từng câu cụt
  để ra vẻ "chất văn chương". Có em-dash bất kỳ đâu -> voice <= 3. TUYỆT ĐỐI KHÔNG dìm/hạ thấp
  bất kỳ game/cộng đồng RTS nào - AoE1, AoE2, AoE3, StarCraft... (vd "phe AoE1 na ná nhau",
  "AoE2 lỗi thời"); so sánh giữa các game để làm rõ thì được, chê game nào dở thì KHÔNG.
  Có câu dìm game RTS -> voice <= 2.
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
  Mẫu owner LOẠI ở blind test 2026-08-04 (văn gằn câu cụt, ra vẻ "chất" - cùng mức ~5-6):
  "Gặp lính thì kiếm, gặp nhà thì lửa." / "Cầm kỵ trong tay là cầm luôn nhịp: muốn đẩy
  sớm thì đẩy, muốn câu chậm lại thì câu." / "Hớ đúng một nhịp rút là mất sạch, tiền đâu
  mà bù." / "tường đá cứ đứng đó trơ trơ."
  LUẬT CỨNG: bài có vài câu dạng này (câu tuyên bố đơ "Đó chính là...", chuyển ý sáo
  "Tuy nhiên, chẳng...", câu kết kiểu thuyết minh, câu đúc kết đối xứng kiểu khẩu hiệu
  "không phải X mà là Y", câu tham chiếu lười "bài kia đã nói rồi", chuỗi câu gằn cụt
  ra vẻ văn chương) -> voice CẢ BÀI tối đa 6;
  nhận ra câu đơ trong fixes mà vẫn chấm voice 7-8 là chấm sai. Giọng hướng dẫn gãy gọn
  tự nhiên (câu lệnh ngắn, bước đánh số) KHÔNG tính là đơ.
- voice ~8 (vừa, chuẩn đối chiếu - giọng cẩm nang cộng đồng, owner chọn 2026-08-06):
  "Nếu như đối thủ không đào vàng, vậy chắc chắn họ sẽ lựa chọn các loại quân gỗ như cung R, ngựa R hay thậm chí là cung T, quẩy đá." /
  "Sở dĩ có lời khuyên này là bởi, dù nông dân solo 1vs1 gần như chắc thắng, đặc biệt là nếu dân phi trước, tuy nhiên việc dân mất máu khi giết sư tử sẽ gián đoạn việc đi dò." /
  "Cũng nên nhớ rằng AoE vẫn luôn là một trò chơi đầy tính may rủi, hãy sẵn sàng tâm lý cho những bãi quả khó nhằn hoặc không thể ăn được."
  Bài đạt 8+ khi đọc lẫn được vào giọng này; thấp hơn rõ rệt -> 6 trở xuống.
- conversion ~1 (thiếu hook): "Bài viết dưới đây sẽ cung cấp cho bạn những thông tin hữu ích nhất."
- conversion ~3 (thừa, hook câu view rỗng chặn thông tin): "Bạn đã bao giờ tự hỏi làm sao để...? Đọc tiếp để biết bí mật!"
- conversion ~8 (vừa): mở bài chạm đúng thứ người đọc cần rồi đưa họ tới bước tiếp/cộng đồng.

Trả JSON: {"structure":X,"voice":X,"conversion":X,"fixes":[{"dimension":"...","quote":"câu trích đúng","suggestion":"câu thay"}]}
```

### Bước 2.5 - Cổng chống thụt lùi (head-to-head vs bản trước)
Mục tiêu: chặn loop "tối ưu chỉ số" đẩy một bài vốn đã tốt qua đỉnh đường cong (bản gốc sạch
bị viết lại thành slang gượng/hook rỗng mà điểm rubric lại CAO hơn).

Bản trước để so là bản ĐÃ TỪNG QUA CỔNG, tức bản trên `main`, KHÔNG phải bản nháp vừa commit
trong phiên. Cổng này sinh ra để bảo vệ bài đã tốt khỏi bị viết lại dở đi; lấy bản nháp chưa
fact-check làm chuẩn đối chiếu là dùng sai cổng (ca thật: dry run comparison 2026-08-06, judge
chọn bản nháp vì thích đúng câu bị fact-check loại do không có nguồn).

Chạy bước này SAU Bước 3 để có sẵn danh sách `contradictions` mà đưa cho judge.

1. Lấy bản trước từ git: `git show origin/main:src/data/guides/<slug>.ts`
   (chưa fetch thì `git fetch origin main` trước).
2. File KHÔNG tồn tại trên `main` (bài mới, chưa xuất bản lần nào) -> KHÔNG có bản trước để so,
   `regressedVsPrevious = false`, bỏ qua bước này và ghi vào scorecard "bài mới, không có bản
   trước trên main".
3. Nếu working tree GIỐNG HỆT bản trên `main` (bài chưa bị sửa vòng này) -> KHÔNG có gì để so,
   `regressedVsPrevious = false`, bỏ qua bước này.
4. Nếu KHÁC (bài đã bị viết lại): dispatch 1 subagent judge head-to-head. Đưa cho nó
   phần văn (paragraphs) của BẢN CŨ và BẢN MỚI, hỏi ĐÚNG:
   ```
   Hai phiên bản của cùng một bài guide AoE4 cho dân kỳ cựu Đế chế 1. Bản nào ĐỌC HAY HƠN
   cho người đọc đó (rõ, tự nhiên, không cố quá)? KHÔNG thưởng điểm cho bản chỉ vì nhiều
   slang/hook/CTA hơn - nếu thêm thắt làm bài lố hoặc chậm thông tin thì bản gọn hơn thắng.
   Chuẩn giọng để so là giọng cẩm nang cộng đồng Đế chế (từ tốn, giải thích kèm lý do,
   câu dài nhiều vế nối mạch lạc); bản gằn từng câu cụt để ra vẻ "chất văn chương" KHÔNG
   được thắng chỉ vì đọc "văn" hơn.
   TUYỆT ĐỐI KHÔNG chọn bản có câu dìm/hạ thấp bất kỳ game/cộng đồng RTS nào (AoE1, AoE2,
   AoE3, StarCraft...): bản nào dìm game RTS thì bản kia thắng, dù nó "có duyên" hơn.
   TUYỆT ĐỐI KHÔNG chọn bản chứa câu nằm trong DANH SÁCH CÂU SAI SỰ THẬT dưới đây (fact-check
   đã đánh dấu là mâu thuẫn hoặc claim không có nguồn): bản chứa câu đó thua, dù đọc mượt hơn.
   DANH SÁCH CÂU SAI SỰ THẬT: <dán quote của contradictions từ Bước 3, cả hai bản; không có
   thì ghi "không có">
   BẢN CŨ: <dán paragraphs bản cũ>
   BẢN MỚI: <dán paragraphs bản mới>
   Trả JSON: {"winner":"old"|"new"|"tie","why":"1 câu"}
   ```
5. `regressedVsPrevious = (winner === "old")`. "tie" và "new" -> false.

### Bước 3 - Fact-check accuracy + kiểm tra tôn trọng game RTS (đối chiếu facts file, KHÔNG tự đoán)
Dispatch 1 subagent đọc:
- `.claude/skills/guide-evaluator/facts/aoe1-facts.md`
- `.claude/skills/guide-evaluator/facts/aoe4-facts.md`
Nhiệm vụ 1 - trích MỌI claim sự thật trong bài, rồi phân loại theo facts file:
- Claim MÂU THUẪN facts -> `contradictions[]` (mỗi cái: câu trích + fact bị vi phạm).
- Claim facts XÁC NHẬN đúng -> bỏ qua.
- Claim KHÔNG có trong facts -> `claimsToVerify[]` (chờ người duyệt). TUYỆT ĐỐI không tự
  khẳng định sai với thứ ngoài facts (tránh nghi oan - lỗi đã thấy ở calibration).
Nhiệm vụ 2 - quét MỌI câu DÌM/HẠ THẤP bất kỳ game/cộng đồng RTS nào (AoE1, AoE2, AoE3,
StarCraft...) -> `disparagement[]` (mỗi cái: câu trích + game bị dìm + vì sao là dìm).
Người đọc bài so sánh chính là dân game đó; hạ thấp game nào cũng là cấm.
- Là dìm: "phe AoE1 na ná nhau", "AoE1/AoE2 nhàm/cũ kỹ/lỗi thời", "AoE3 là bản thất bại",
  "StarCraft chỉ dành cho hàn xẻng", "chọn phe game X chỉ đổi màu".
- KHÔNG phải dìm: so sánh trung tính làm rõ điểm khác biệt (vd "AoE4 mỗi phe một cơ chế
  riêng" - nêu đặc điểm AoE4, không đụng chạm game khác; "nhịp StarCraft nhanh hơn AoE4" -
  mô tả trung tính).
Trả JSON: {"contradictions":[...],"claimsToVerify":[...],"disparagement":[...]}
Ví dụ mâu thuẫn phải bắt: câu ngụ ý "cung R khắc tất" -> facts nói cung R (Chariot Archer) và
cung A (Composite Bowman) KHÔNG khắc chế class nào -> contradiction.
Ví dụ mâu thuẫn phải bắt (thêm 2026-08-07, cả hai kho đều có WRITING RULE tương ứng):
- Nêu một con số dân lên đời bên Đế chế 1 như luật chung ("kèo quen thuộc là 23 dân") -> kho
  aoe1 nói số dân tùy bài (~23 chém / ~26 cung) và trôi theo meta -> contradiction. Câu nói rõ
  đó chỉ là ví dụ thì KHÔNG tính.
- Nói lên đời trong Đế chế 4 BẮT BUỘC dựng Landmark ("phải dựng Landmark", "không có nút lên
  đời tại nhà chính") -> kho aoe4 nói đó là đường của HẦU HẾT các phe, vẫn có phe lên đời tại
  nhà chính hoặc ở một công trình phụ -> contradiction.
Ví dụ dìm phải bắt: "Bên Đế chế 1 các phe đánh na ná nhau, chọn phe gần như chỉ đổi màu" -> disparagement.

### Bước 4 - Verdict tất định
Điểm cuối mỗi chiều = trung vị 3 lần ở Bước 2. Chọn sàn theo loại bài:
`floorsForKind(kind)` từ `@/lib/guideVerdict` (kind từ Bước 1). Rồi tính:
```
guideVerdict(
  hygiene.pass,
  {structure, voice, conversion},
  {contradictions: contradictions.length, disparagement: disparagement.length},
  floorsForKind(kind),
  {regressedVsPrevious},   // từ Bước 2.5
)
```
Sàn: `strategy` = structure/voice 7, conversion 6. `comparison` = y hệt `strategy`.
`utility` = structure 7, voice 5, conversion 3 (nặng clarity, không ép hook/slang).
Không có ngưỡng tổng.
PASS chỉ khi hàm trả `pass: true`. Mâu thuẫn sự thật VÀ dìm game RTS là cổng cứng - chỉ cần > 0
là FAIL bất kể điểm. `claimsToVerify` KHÔNG chặn PASS - đây là danh sách advisory, người duyệt
xem lại SAU KHI bài đã PASS, không phải điều kiện để loop tiếp tục chạy.

### Bước 5 - Ghi scorecard
Ghi ra `docs/reviews/<slug>-scorecard.md` theo mẫu:
```
# Scorecard v3: <slug>

Loại bài (kind): utility/strategy/comparison
SEO hygiene: PASS/FAIL (nếu FAIL: liệt kê failures)

| Chiều | Điểm (median 3) | Sàn (<kind>) | Đạt |
|-------|:---:|:---:|:---:|
| structure  | X | 7 | ✅/❌ |
| voice      | X | 7 hoặc 5 | ✅/❌ |
| conversion | X | 6 hoặc 3 | ✅/❌ |
| TỔNG (thông tin, không phải gate) | XX/30 | - | - |

Chống thụt lùi: <"không có bản trước để so" | "bản mới >= bản cũ (winner: new/tie)" | "THỤT LÙI: bản cũ đọc hay hơn (FAIL cứng)">

Tôn trọng game RTS: <"không có câu dìm game/cộng đồng RTS nào" | "VI PHẠM (FAIL cứng): <liệt kê câu dìm + game bị dìm>">

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
/ralph-loop "Trau chuốt guide <slug> trong src/data/guides. Mỗi vòng: (1) dùng skill guide-evaluator chấm <slug>; (2) đọc docs/reviews/<slug>-scorecard.md; (3) nếu VERDICT FAIL, sửa file guide đúng theo 'Cần sửa' và các mâu thuẫn sự thật - chỉ sửa văn/nội dung, giữ slug + cấu trúc dữ liệu; TUYỆT ĐỐI không thêm câu dìm/hạ thấp game/cộng đồng RTS nào (AoE1, AoE2, AoE3, StarCraft...); nếu lý do FAIL là 'regressed' thì HOÀN NGUYÊN về bản cũ (git) thay vì sửa thêm; (4) chấm lại. CHỈ in <promise>GUIDE-PASSED</promise> khi scorecard mới nhất VERDICT: PASS. Chỉ mâu thuẫn sự thật, dìm AoE1, hygiene, chất lượng dưới sàn và thụt lùi PHẢI hết mới được PASS - claimsToVerify không chặn loop - KHÔNG in promise giả." --completion-promise "GUIDE-PASSED" --max-iterations 12
```
Lưu ý:
- Cổng chống thụt lùi so với bản trên `origin/main` (bản đã qua cổng), không phải bản `HEAD` của
  nhánh đang làm. Bài mới chưa có trên main thì không có gì để so, cổng tự bỏ qua.
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
3. **Bước 2.5**: giữ nguyên, so với `git show origin/main:src/data/news/<slug>.ts`; bản tin mới
   chưa có trên main thì bỏ qua cổng.
4. **Bước 3 (fact-check news)**: ngoài 2 nhiệm vụ cũ (đối chiếu facts corpus + quét dìm
   game/cộng đồng RTS nào),
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

## Chế độ comparison (guide có kind 'comparison')

Bài so sánh cầu nối (AoE4 vs AoE2/AoE3/StarCraft...) nằm trong `src/data/guides` như guide
thường. Chấm theo ĐÚNG giao thức guide với các thay đổi sau:

1. **Bước 1**: `score-guide-seo.ts` trả `kind: 'comparison'` - sàn ở Bước 4 là
   `floorsForKind('comparison')` (structure 7, voice 7, conversion 6 - như strategy).
2. **Bước 3 (fact-check phân tầng theo game)**: subagent đọc thêm facts sheet
   `docs/facts-review/<slug>.md` (bảng claim -> nguồn). Không có facts sheet -> FAIL hygiene,
   ghi rõ lý do. Phân loại TỪNG claim theo game nó nói về:
   - **AoE1 / meta VN**: chỉ đối chiếu kho `facts/aoe1-facts.md`. Mâu thuẫn kho ->
     `contradictions[]`; ngoài kho -> `claimsToVerify[]` (KHÔNG tự phán đúng sai).
   - **AoE4**: đối chiếu kho `facts/aoe4-facts.md` TRƯỚC; claim ngoài kho nhưng có URL nguồn
     trong facts sheet -> xác minh trực tiếp như news (WebFetch); không kho không nguồn ->
     `claimsToVerify[]`.
   - **AoE2 / AoE3 / StarCraft**: BẮT BUỘC có URL nguồn chính thức trong facts sheet (wiki
     game, Liquipedia, patch notes...). WebFetch từng URL đối chiếu như chế độ news: nguồn
     xác nhận -> qua; nguồn nói ngược -> `contradictions[]`; không xác minh được (URL chết,
     nguồn không nhắc) -> `unverifiableClaims[]`; claim KHÔNG có dòng nguồn nào ->
     `contradictions[]` (luật cứng của kind này).
   WebFetch lỗi không làm sập vòng chấm - claim rơi về `unverifiableClaims`.
3. **Bước 4**: `floorsForKind('comparison')`. `unverifiableClaims` không chặn PASS trong
   phiên có owner nhưng CHẶN điều kiện headless (xem skill write-article).
4. **Cổng phạm vi so sánh (owner chốt 2026-08-07)**: bài so sánh chỉ so đúng HAI game trong
   tiêu đề. Subagent Bước 3 làm thêm nhiệm vụ đếm: game thứ ba (kể cả Đế chế 1) xuất hiện
   trong THÂN BÀI mấy lần, và có được cấp đoạn riêng / khung "bên kia đọc cũng dùng được
   nguyên bài" / anchor text không. Có bất kỳ thứ nào trong ba thứ đó -> ghi vào `Cần sửa`
   và structure tối đa 6. Nhắc qua một câu để định vị hai game chính (vd xếp hạng nhịp trận
   cả dòng Đế chế) thì KHÔNG tính vi phạm. Sở dĩ có cổng này là bởi kéo game thứ ba vào làm
   loãng bài và làm mất tiêu điểm so sánh; nhóm đọc đó đã có khối `related` dẫn sang bài
   dành riêng cho họ. Trả thêm trường: {"comparisonScopeViolations":[...]}.
5. **Bước 5**: scorecard ghi `Loại bài (kind): comparison` + dòng `Truy vết nguồn:` như
   chế độ news, cùng dòng `Phạm vi so sánh: <"chỉ so hai game trong tiêu đề" | "VI PHẠM:
   <liệt kê>">`.
