# Scorecard v3: cung-r-ngua-chem-aoe4

Ngày chấm: 2026-08-08 (bản VIẾT LẠI TOÀN BỘ theo góp ý domain của owner)
Giao thức: median-of-5, sàn strategy 8/7/7 (owner chốt 2026-08-08)
Loại bài (kind): strategy
SEO hygiene: PASS

| Chiều | Điểm (median 5) | Sàn (strategy) | Đạt |
|-------|:---:|:---:|:---:|
| structure  | 8 | 8 | ✅ |
| voice      | 7 | 7 | ✅ |
| conversion | 8 | 7 | ✅ |
| TỔNG (thông tin, không phải gate) | 23/30 | - | - |

Điểm thô 5 judge vòng cuối: structure 8/8/8/8/8, voice 6/7/7/8/8, conversion 8/8/8/8/7.
**Chiều voice nằm đúng sàn, điểm thô trải 6-8, median có thể lật ở lần chạy sau.**

## Lịch sử chấm trong phiên 2026-08-08

Bản cũ (chắp vá từng chỗ), median-of-3:

| Vòng | structure | voice | conversion | Verdict |
|:---:|:---:|:---:|:---:|---|
| 1 | 8 | 7 | 8 | FAIL |
| 2 | 7 | 8 | 8 | FAIL |
| 3 | 8 | 7 | 8 | FAIL |
| 4 | 8 | 8 | 8 | PASS |

Bản viết lại toàn bộ, median-of-5:

| Vòng | structure | voice | conversion | Verdict |
|:---:|:---:|:---:|:---:|---|
| 1 | 7 | 6 | 8 | FAIL |
| 2 | 8 | 6 | 8 | FAIL |
| 3 | 8 | 7 | 8 | FAIL (sàn voice 8 lúc đó) |
| 4 | 8 | 7 | 8 | PASS (sau khi owner hạ sàn voice về 7) |

Voice đi 6 → 6 → 7 → 7 rồi dừng. Mỗi vòng judge chỉ ra lỗi cụ thể và có thật, sửa xong thì
lỗi khác nổi lên. Hai bản bài hoàn toàn khác nhau đều hội tụ về voice 7. Chính dữ liệu này
dẫn tới quyết định của owner: giữ structure 8 và conversion 7 đã nâng, trả voice về 7.

Chống thụt lùi: bản mới >= bản cũ (winner: new - "bản mới sạch cả ba câu sai sự thật chỉ có ở
bản cũ và không hạ thấp Đế chế 4, trong khi vẫn giữ đúng giọng cẩm nang giải thích kèm lý do
và phần dài thêm là thông tin thật chứ không phải slang hay hook").

Tôn trọng game RTS: không có câu dìm game/cộng đồng RTS nào

Accuracy:
- Mâu thuẫn sự thật (FAIL cứng): không có

Đã sửa trong phiên (bản trên `main` vi phạm, bản mới sạch):
- "quân nào cũng mở màn bằng con ngựa dò" - sai cảnh. Với luật "đời 3 không thành", trận mở
  ở đời 3 và quân mở màn tùy bài: ngựa dò nếu đánh chém, cung T nếu đánh cung.
- "nhịp chung có chậm hơn" - diễn bảng xếp hạng tốc độ thành nhịp trận, vi phạm WRITING RULE
  của `aoe4-facts.md`. Bản mới lập luận nhịp nhanh đi từ thành phần quân đời 3.
- "sang đây chỉ còn phải học thêm tên quân và vài con số" - hạ thấp chiều sâu Đế chế 4.
- "nỏ là thứ chặn kỵ cung mạnh nhất" - sai; kỵ nhẹ mới săn kỵ cung, nỏ chặn kỵ nặng. Lỗi này
  do bản viết lại tự tạo ra ở vòng 1 và bị fact-check bắt ngay vòng đó.

## Onna-Musha: ĐÃ GIẢI QUYẾT (owner, 2026-08-08)

Owner chốt: **"Onna-Musha là kỵ binh"**. Nghi ngờ của 9 judge là SAI, câu trong bài giữ nguyên,
không còn chặn xuất bản. `aoe4-facts.md` đã được đóng dấu owner kèm ngày, ghi rõ vì sao dòng đó
từng yếu và giờ mạnh, và ghi thêm rằng phần phân loại nhỏ hơn (kỵ cung hay kỵ cận chiến) vẫn
chỉ dựa vào nguồn web chứ chưa hỏi owner - bài được phép viết "kỵ cung" trên cơ sở đó.

Phần điều tra bên dưới giữ lại làm hồ sơ: nó cho thấy một dòng `CONFIRMED` có thể yếu tới mức
nào khi chưa ai đọc lại, và đó là lý do vòng chấm này đưa nó lên hỏi thay vì tự tin theo kho.

### Hồ sơ điều tra (trước khi owner trả lời)

`aoe4-facts.md` dòng 26-31 ghi Onna-Musha là **light ranged cavalry**, và đánh dấu nghi ngờ
"Onna-Musha là bộ binh" là **FALSE**. Nhưng qua các vòng chấm, **9 judge độc lập** đều đọc ra
bộ binh. Vòng fact-check cuối đã điều tra riêng dòng kho đó và tìm thấy:

- Dòng này vào file từ commit đầu tiên (`e45c8c8`, pass 2026-07-06) và **chưa bao giờ qua
  owner**. Vòng full re-read 2026-08-08 chỉ chạm đúng một dòng của `aoe4-facts.md` (bảng xếp
  hạng tốc độ), không chạm dòng này.
- "CONFIRMED via multiple independent sources" nhưng chính nó ghi "fandom wiki *summary*".
  `aoe2-facts.md` và `aoe3-facts.md` đều ghi fandom trả HTTP 402 cho WebFetch, nên ở pass
  2026-07-06 trang đó gần như chắc chắn không đọc được trực tiếp.
- Nguồn thứ ba là thread diễn đàn có slug `onna-musha-horse-archer`. Slug chứa sẵn cụm cần
  chứng minh là bẫy đọc nhầm kinh điển.
- Mâu thuẫn nội tại: cùng dòng đó nói nó "thay chỗ Crossbowman" của Nhật, vai anti-heavy đánh
  Knights/Men-at-Arms, tầm ~5.5. Bộ mô tả này đọc ra một quân bộ chống giáp nặng.
- Câu VERDICT được viết để bảo vệ chính bài đang chấm ("consistent with the guide's grouping").
  Đây đúng vòng tự khớp mà `aoe1-facts.md` tự cảnh báo, và là cách "7 thực 3 vàng" sống sót
  qua năm vòng fact-check.

Phần "đánh vào giáp nặng thì đau hơn" giữ được trong mọi trường hợp (dựa trên dòng owner riêng,
`aoe4-facts.md:182`).

Kết cục: owner trả lời "kỵ binh", tức kho ĐÚNG ở phần quan trọng nhất dù lập luận chống đỡ của
nó yếu. Bài học giữ lại: một dòng đúng vì may mắn vẫn là một dòng chưa được kiểm, và cách duy
nhất phân biệt là hỏi owner.

## Claim cần owner duyệt (không chặn loop)

- "khoảng cách giữa hai sân nhà co lại chỉ còn vài giây" - con số tu từ, chưa có nguồn.
- "khi hai bên đã biết trước nhau sẽ ra gì thì phần thắng dồn cả vào tay ai điều quân khéo hơn"
  - diễn giải thêm từ dòng "bảng quân gọn, ai chơi lâu đều thuộc nằm lòng".
- Định nghĩa "chém bán máu = đổi quân sòng phẳng lấy thế" và "chém quấy = đảo sau lưng phá kinh
  tế" - kho chỉ ghi TÊN ba kiểu, chưa ghi định nghĩa. Owner duyệt giúp hai gloss này.
- "giáo là thứ quân rẻ nhất bảng" - superlative chưa có nguồn.
- "Kỵ cận chiến bên này trải theo từng phe, mỗi phe một con riêng" - kho không xác lập rằng
  MỌI phe đều có kỵ cận chiến riêng.
- "lạc đà gặp bộ binh cận chiến thì vai đảo ngược" - kho ghi "more susceptible to (NOT hard
  countered by)". Câu hiện tại mạnh hơn nguồn một nhịp.

VERDICT: PASS

## Cần sửa

- Không có mục nào chặn PASS.
- [conversion, tùy chọn] Một judge đề xuất đưa câu trả lời lên ngay đầu bài cho đúng ý định
  tra cứu: "cung R sang bên kia nằm ở Mông Cổ và Nga, ngựa chém thì cầm Pháp, lạc đà thì
  Abbasid" rồi mới giải thích từng dòng. Đây là góp ý biên tập đáng cân nhắc, không phải lỗi.
- [voice, ghi nhận] Ở vòng cuối các góp ý voice đã phân tán, mỗi judge chỉ một câu khác nhau,
  tức hết tín hiệu hội tụ để sửa tiếp theo cách chắp vá. Muốn kéo voice lên 8 một cách bền
  vững thì phải làm dày corpus mỏ neo ~8 (hiện chỉ có 3 câu owner chọn), không phải sửa thêm
  câu trong bài này.
