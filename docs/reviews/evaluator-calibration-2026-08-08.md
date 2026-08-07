# Evaluator calibration 2026-08-08

Lý do chạy: mỏ neo voice trong `guide-evaluator/SKILL.md` vừa được thêm một NGOẠI LỆ
(một câu hỏi thay người đọc rồi đáp ngay bằng câu ngắn thì KHÔNG tính là văn gằn), sau khi
`docs/voice-corpus/voice-guide.md` được chưng cất lại từ 39 mẫu ngày 2026-08-08. Cần biết
ngoại lệ đó có làm judge lệch so với golden set hay không.

Giao thức: đúng `evaluator-calibrate` - chấm mù (fixture bị lột header, đổi tên trung tính
trong scratchpad), median-of-3 cho mọi case chấm điểm, 1 subagent fact-check cho case
accuracy, 1 subagent head-to-head cho `regression-pair`. Tổng 38 subagent + 3 subagent
đối chứng (xem mục A/B).

Kết quả CLI: `13/14 ĐẠT` (`docs/reviews/calibration-results-2026-08-08.json`).

| case | kỳ vọng | thực tế | kết quả |
| --- | --- | --- | --- |
| bad-ai-voice | voice <= 4 | voice 1 (1/1/1) | ĐẠT |
| bad-forced-slang | voice <= 4 | voice 2 (2/2/2) | ĐẠT |
| bad-empty-hook | conversion <= 4 | conversion 2 (2/1/2) | ĐẠT |
| bad-aoe1-disparagement | dìm >= 1 | 2 câu dìm | ĐẠT |
| bad-wrong-facts | mâu thuẫn >= 1 | 3 mâu thuẫn | ĐẠT |
| regression-pair | winner = old | old | ĐẠT |
| frozen-good-build-order | sàn strategy 7/7/6, 0 mâu thuẫn, 0 dìm | 8/6/7, 1 mâu thuẫn, 0 dìm | **TRƯỢT** |
| frozen-good-cau-hinh-may | sàn utility 7/5/3, 0 mâu thuẫn, 0 dìm | 8/6/7, 0, 0 | ĐẠT |
| frozen-bad-voice-cung-r (v1) | voice <= 6 | 5 (5/5/5) | ĐẠT |
| frozen-bad-voice-tuong-thanh (v1) | voice <= 6 | 5 (5/5/5) | ĐẠT |
| frozen-bad-voice-aoe4-khac (v1) | voice <= 6 | 2 (2/2/2) | ĐẠT |
| frozen-bad-voice-v2-aoe4-khac | voice <= 6 | 5 (6/5/5) | ĐẠT |
| frozen-bad-voice-v2-tuong-thanh | voice <= 6 | 5 (5/5/5) | ĐẠT |
| frozen-bad-voice-v2-cung-r | voice <= 6 | 5 (5/5/5) | ĐẠT |

## A/B: ngoại lệ mới KHÔNG phải nguyên nhân

Vì case trượt là một fixture "bài tốt", phải tách bạch xem nó tụt điểm do ngoại lệ vừa thêm
hay do judge tự trôi. Đã dựng một bản `SKILL.md` đối chứng (cắt đúng đoạn NGOẠI LỆ, giữ
nguyên mọi thứ khác) rồi cho 3 judge mới chấm lại cùng fixture đó:

| nhánh | voice 3 lần | trung vị |
| --- | --- | --- |
| có ngoại lệ (bản đang đề xuất) | 6 / 6 / 6 | 6 |
| không ngoại lệ (đối chứng) | 6 / 6 / 6 | 6 |

Sáu judge độc lập, cả sáu chấm 6. Ngoại lệ mới không đổi điểm bài này, cũng không nới tay ở
bất kỳ case "bài dở" nào (mọi case voiceMax vẫn <= 5). Kết luận: đoạn ngoại lệ AN TOÀN để giữ.

## Chẩn đoán case trượt

`frozen-good-build-order-co-ban-aoe4` trượt vì hai lý do độc lập.

### 1. voice 6 < sàn 7 - judge trôi theo hướng CHẶT hơn (2026-08-06: 7 -> nay: 6)

Cả 6 judge đều trừ vào cùng một nhóm câu, đúng nhóm mà LUẬT CỨNG mô tả:

- "Kinh tế mới là thứ nuôi cả trận đấu - người mới nên ra dân gần như liên tục..."
- "Cừu là nguồn thực nhanh nhất đầu trận."
- "Công thức cơ bản nhất...: 7 dân thực + 3 dân vàng. Đủ vàng đủ thực là lên đời."

Không judge nào gọi bài là "văn AI" hay "slang gượng"; họ chỉ đòi mỗi câu khuyên phải kèm
một vế "sở dĩ... là bởi". Nói cách khác LUẬT CỨNG (trần 6 khi bài có "vài câu tuyên bố đơ")
đang bắt cả câu chốt gọn của một bài hướng dẫn vốn được chấm đạt cách đây hai ngày.

Ba hướng xử lý, cần owner chọn:

1. **Sửa bài, không sửa thước** - thêm vế lý do cho 3-4 câu trên trong
   `src/data/guides/build-order-co-ban-aoe4.ts` rồi làm mới fixture. Giữ nguyên độ chặt của
   cổng, và bài trên site cũng đúng giọng hơn. Đây là hướng tôi đề xuất.
2. **Nới LUẬT CỨNG một nấc** - chỉ áp trần 6 khi bài có từ 3 câu dạng đó trở lên, thay vì
   "vài câu" như hiện nay. Rẻ nhất, nhưng làm yếu cổng đã dựng lên đúng để chặn giọng đó.
3. **Hạ sàn voice strategy 7 -> 6** - KHÔNG khuyến nghị: sàn 7 chính là thứ chặn ba bài
   owner từng chê.

### 2. contradictions 1 > 0 - fixture mục, KHÔNG phải judge nghi oan

Fact-check bắt câu trong fixture: "Đủ 400 thực và 200 vàng thì chọn một công trình biểu
tượng (Landmark) để lên Đời II" - viết đường Landmark như luật tuyệt đối.

Đối chiếu: WRITING RULE về Landmark được thêm vào kho facts ngày **2026-08-07**, tức SAU
lần calibration gần nhất (2026-08-06). Bài thật trên `main` đã được sửa theo rule đó rồi:

> 'Đủ 400 thực và 200 vàng thì bấm lên Đời II. Với hầu hết các phe, thao tác đó là chọn một
> công trình biểu tượng (Landmark) rồi cho dân dựng, còn vài phe lại lên đời ngay tại nhà
> chính hoặc ở một công trình phụ.' - `src/data/guides/build-order-co-ban-aoe4.ts:32`

Fixture vẫn đang giữ ảnh chụp TRƯỚC bản sửa đó. Judge chấm đúng; cái sai nằm ở fixture.
Xử lý: chụp lại `frozen-good-build-order-co-ban-aoe4.md` từ bản hiện tại trên `main`.
Không tính là drift.

## Ghi chú

- `frozen-good-cau-hinh-may` cũng tụt voice 7 -> 6 nhưng vẫn đạt vì sàn utility là 5. Cùng
  một kiểu trừ điểm với case trên, nên nó là bằng chứng thứ hai cho việc judge đang chặt
  hơn ở chiều voice, chứ không phải một bài cá biệt.
- `bad-aoe1-disparagement` lần này còn kèm 1 mâu thuẫn (câu Landmark tuyệt đối) - hệ quả
  của cùng WRITING RULE mới, và không ảnh hưởng kỳ vọng của case.
- Fact-check hai bài frozen-good trả rất nhiều `claimsToVerify` (cấu hình máy, mốc phút,
  cơ chế nhà dân) - advisory, không chặn.

KẾT LUẬN: 13/14 ĐẠT - CÓ DRIFT ở chiều voice, cần owner chọn hướng xử lý. Ngoại lệ mới thêm
vào mỏ neo đã được A/B chứng minh là vô can và nên giữ.
