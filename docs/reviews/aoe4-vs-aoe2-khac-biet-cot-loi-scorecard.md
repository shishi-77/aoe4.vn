# Scorecard v3: aoe4-vs-aoe2-khac-biet-cot-loi

Loại bài (kind): comparison
SEO hygiene: PASS (dimensionScore 9.5, không failure)

Vòng chấm: 3/3 (hết số vòng cho phép của skill write-article)

## Vòng 3 (bản working tree hiện tại)

| Chiều | Điểm (median 3) | Sàn (comparison) | Đạt |
|-------|:---:|:---:|:---:|
| structure  | 8 (8/8/8) | 7 | ✅ |
| voice      | 7 (7/6/7) | 7 | ✅ |
| conversion | 7 (7/7/7) | 6 | ✅ |
| TỔNG (thông tin, không phải gate) | 22/30 | - | - |

Chống thụt lùi: THỤT LÙI - judge head-to-head chọn BẢN CŨ (bản nháp tại git HEAD) đọc hay hơn
bản vòng 3 (FAIL cứng). Lý do judge đưa ra: bản cũ giữ mạch giải thích kèm lý do chặt hơn, thứ
tự so sánh "nền AoE2 trước, AoE4 sau", luận điểm "chọn phe là chọn luôn cách chơi", và "cầu nối
bảng bonus damage của AoE2".

Tôn trọng game RTS: không có câu dìm game/cộng đồng RTS nào (cả 3 vòng, cả 3 judge + fact-check
đều xác nhận).

Truy vết nguồn: mọi claim AoE2 trong bài đều có URL nguồn chính thức trong facts sheet và đã
được WebFetch xác minh trực tiếp (3/3 URL sống, xác nhận claim 10-16).

Accuracy:
- Mâu thuẫn sự thật (FAIL cứng): không có ở vòng 2 và vòng 3.
- Vòng 1 có 2 mâu thuẫn, đều là claim về AoE2 viết mà không có nguồn ("bảng bonus damage bên
  AoE2", "các phe dùng chung phần lớn bộ khung"). Đã gỡ khỏi bài từ vòng 2. Đây đúng là loại lỗi
  mà luật cứng của kind comparison sinh ra để chặn.

Claim cần owner duyệt sau khi PASS (không chặn loop):
- "bên Đế chế 4 tường và thành là phần nằm sẵn trong game, ai xây được thì cứ xây" - kho
  aoe4-facts.md chưa có mục xác nhận Keep/thành và luật cấm; đối chiếu fact "Mongols CANNOT
  build ANY walls" thì không mâu thuẫn cứng (câu đã tự hạn định "ai xây được thì cứ xây" và mục
  sau nói rõ Mông Cổ không xây được tường), nhưng nên owner gật hoặc thêm "trừ Mông Cổ".
- "cái nhà vừa dựng lên thì đối thủ nhìn thấy, họ đoán được hướng đi của mình" - claim về
  trinh sát/thông tin của Landmark, ngoài kho.

Chưa xác minh được (không chặn PASS trong phiên có owner, CHẶN điều kiện headless):
- "Chơi AoE2 lâu năm thì ai cũng quen cảnh đang thua vẫn gỡ lại được" - hệ quả diễn giải từ
  claim #9 (xếp hạng nhịp), 3 URL chính thức không nhắc tới comeback/pacing.

VERDICT: FAIL
Reasons: regressed: bản mới bị đánh giá dở hơn bản trước - giữ bản cũ

## Cần sửa

Đây là ca FAIL đặc biệt: điểm rubric ĐẠT cả ba sàn, accuracy sạch, không dìm game, chỉ trượt ở
cổng chống thụt lùi. Không thể áp luật "regressed -> hoàn nguyên bản cũ" một cách máy móc, bởi
bản cũ (git HEAD) chính là bản có 2 MÂU THUẪN SỰ THẬT - hoàn nguyên là ship bài sai sự thật.

Gap phát hiện được từ dry run này (thuộc Task 10 Step 2 của plan
`docs/superpowers/plans/2026-08-03-voice-and-comparison-scale.md`):

1. Judge head-to-head KHÔNG được biết ràng buộc nguồn của kind comparison, nên nó chấm cao đúng
   đoạn văn bị luật cứng loại ("cầu nối bảng bonus damage của AoE2" là claim không nguồn). Cổng
   chống thụt lùi và cổng truy vết nguồn đang đá nhau.
2. Bước 3.4 của skill write-article yêu cầu commit bản nháp (status `drafted`), nên baseline của
   cổng chống thụt lùi là BẢN NHÁP CHƯA QUA FACT-CHECK, chứ không phải một bản đã từng PASS.

Đề xuất sửa (chờ owner chốt, làm trên nhánh `claude/fix-comparison-dryrun` trước khi bật routine
ở Task 11):
- Thêm vào prompt head-to-head một dòng: "Nếu một bản chứa câu đã bị fact-check đánh dấu
  contradiction/không có nguồn, KHÔNG được chọn bản đó, dù nó đọc mượt hơn."
- Ghi rõ trong skill: với bài MỚI (chưa từng có bản PASS), cổng chống thụt lùi chỉ áp khi bản
  baseline đã sạch accuracy; nếu baseline có contradiction thì bỏ qua cổng và ghi lý do vào
  scorecard.
