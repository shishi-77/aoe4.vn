# Kiểm định judge (evaluator-calibrate) - 2026-08-06

Bối cảnh: chạy lại NGAY SAU khi cân lại mỏ neo voice trong prompt ghim của guide-evaluator
theo chuẩn giọng mới owner chốt 2026-08-06 (5 bài aoe.vn). Thay đổi so với bản 2026-08-03:

- Mỏ neo voice ~8 đổi từ 2 câu văn sách "100 cuộc chiến lẫy lừng" sang 3 câu aoe.vn
  (giọng cẩm nang cộng đồng).
- Thêm nhóm mỏ neo ~5-6 mới: 4 câu từ 3 bản rewrite bị owner loại ở blind test 2026-08-04
  (văn gằn câu cụt, ra vẻ "chất văn chương").
- Mô tả chiều voice ghi rõ chuẩn giọng cẩm nang cộng đồng, câu dài nhiều vế nối mạch lạc
  KHÔNG bị trừ điểm; chiều structure bỏ yêu cầu "câu ngắn gãy gọn".
- Head-to-head (Bước 2.5) thêm câu neo chuẩn giọng: bản gằn câu cụt không được thắng chỉ vì
  đọc "văn" hơn.

Giao thức: đúng SKILL evaluator-calibrate - chấm mù qua file tạm tên trung tính,
median-of-3 judge cho các case điểm số, 1 fact-check cho các case cổng cứng,
1 head-to-head cho regression-pair. Kết quả thô: `calibration-results-2026-08-06.json`.

## Kết quả

| Case | Kỳ vọng | Thực tế | Đạt |
|------|---------|---------|-----|
| bad-ai-voice | voice <= 4 | voice 1 (median 1/1/1) | ĐẠT |
| bad-forced-slang | voice <= 4 | voice 2 (2/1/2) | ĐẠT |
| bad-empty-hook | conversion <= 4 | conversion 1 (1/1/1) | ĐẠT |
| bad-aoe1-disparagement | dìm AoE1 >= 1 | 2 câu dìm | ĐẠT |
| bad-wrong-facts | mâu thuẫn >= 1 | 2 mâu thuẫn | ĐẠT |
| regression-pair | winner = old | old | ĐẠT |
| frozen-good-build-order | đủ sàn strategy 7/7/6, 0 mâu thuẫn, 0 dìm | 8/7/8, 0, 0 | ĐẠT |
| frozen-good-cau-hinh-may | đủ sàn utility 7/5/3, 0 mâu thuẫn, 0 dìm | 8/7/8, 0, 0 | ĐẠT |
| frozen-bad-voice-cung-r (v1) | voice <= 6 | 5 (5/5/5) | ĐẠT |
| frozen-bad-voice-tuong-thanh (v1) | voice <= 6 | 5 (5/5/4) | ĐẠT |
| frozen-bad-voice-aoe4-khac (v1) | voice <= 6 | 2 (2/2/2) | ĐẠT |
| frozen-bad-voice-v2-aoe4-khac | voice <= 6 | 5 (6/5/5) | ĐẠT |
| frozen-bad-voice-v2-tuong-thanh | voice <= 6 | 5 (5/5/5) | ĐẠT |
| frozen-bad-voice-v2-cung-r | voice <= 6 | 5 (5/5/5) | ĐẠT |

## Ghi chú

- frozen-bad-voice-aoe4-khac (v1) voice 2 vì cả 3 judge bắt câu "Đời 1 và đời 2 quá ít
  loại quân... chơi mãi thành nhàm" theo luật dìm AoE1 (voice <= 2). Vẫn thỏa kỳ vọng
  voiceMax 6; nghiêm hơn kỳ vọng, không phải drift.
- Hai bài frozen-good giữ nguyên điểm đạt sàn sau khi đổi mỏ neo - việc chuyển chuẩn ~8
  từ văn sách sang giọng aoe.vn không làm judge chấm oan bài tốt hiện có.
- Fact-check bài build-order trả nhiều claimsToVerify (đã có cờ CẦN NGƯỜI DUYỆT sẵn trong
  facts) - advisory, không chặn.

KẾT LUẬN: 14/14 ĐẠT - ổn định.
