# Báo cáo kiểm định evaluator - 2026-08-03 (chốt: 11/11 ĐẠT)

Phiên tuning judge theo yêu cầu owner, đi qua 3 vòng chỉnh PROMPT GHIM (Bước 2) của
guide-evaluator. Mỗi vòng: sửa prompt -> chấm mù lại các case sát ngưỡng (3 judge độc
lập/case, file tạm đánh số trung tính) -> so bằng `scripts/check-calibration.ts`.
Model judge: model phiên hiện tại (Fable).

## Ba vòng chỉnh

1. **Mỏ neo ~5** (gợi ý báo cáo 2026-08-02, owner duyệt): thêm mỏ neo "lủng củng máy móc"
   trích 2 câu từ bài cung R + luật "giọng đơ máy móc -> voice cao nhất 5-6" vào mô tả
   chiều voice. Kết quả: VẪN 9/11 - judge trích đúng câu mỏ neo vào fixes nhưng chỉ trừ
   1 điểm (voice 7).
2. **LUẬT CỨNG** (PR #39, MERGED): "bài có vài câu dạng mỏ neo ~5 -> voice CẢ BÀI tối đa 6;
   nhận ra câu đơ trong fixes mà vẫn chấm 7-8 là chấm sai", kèm ngoại lệ giọng hướng dẫn
   gãy gọn (câu lệnh ngắn, bước đánh số). Kết quả: 10/11 - cung R về 6/6/6, nhưng tường
   thành vẫn 8/8/8 (bài không chứa dạng câu nào trong danh sách).
3. **Mẫu owner chỉ điểm** (owner chọn cả 4 câu ứng viên từ bài tường thành ngày 2026-08-03):
   thêm 4 câu làm "mẫu owner duyệt" cùng mức ~5, mở rộng danh sách dạng câu trong LUẬT CỨNG
   (câu đúc kết đối xứng kiểu khẩu hiệu "không phải X mà là Y", câu tham chiếu lười "bài kia
   đã nói rồi"). Kết quả: 11/11.

## Bảng kết quả chốt (prompt cuối)

| Case | Kỳ vọng | Thực tế (median 3) | Kết quả |
|---|---|---|---|
| bad-ai-voice | voice <= 4 | 3/1/1 | ĐẠT |
| bad-forced-slang | voice <= 4 | 3/2/2 | ĐẠT |
| bad-empty-hook | conversion <= 4 | 3/2/1 | ĐẠT |
| bad-aoe1-disparagement | aoe1Disparagement >= 1 | 2 câu dìm bị bắt | ĐẠT |
| bad-wrong-facts | contradictions >= 1 | 2 mâu thuẫn bị bắt | ĐẠT |
| regression-pair | winner = old | old | ĐẠT |
| frozen-good-build-order-co-ban-aoe4 | >= sàn strategy, 0 oan | 8/8/8, 0 contradiction, 0 aoe1 | ĐẠT |
| frozen-good-cau-hinh-may-aoe4 | >= sàn utility, 0 oan | 8/7/8, 0 contradiction, 0 aoe1 | ĐẠT |
| frozen-bad-voice-cung-r-ngua-chem-aoe4 | voice <= 6 | 8/**5**/7 | ĐẠT |
| frozen-bad-voice-tuong-thanh-phong-thu-aoe4 | voice <= 6 | 8/**5**/8 | ĐẠT |
| frozen-bad-voice-aoe4-khac-de-che-the-nao | voice <= 6 | 8/2/8 | ĐẠT |

**KẾT LUẬN: 11/11 ĐẠT - judge đã cân theo nhãn owner.**

Kiểm tra chống kéo oan: hai bài frozen-good giữ nguyên trên sàn qua cả 3 vòng
(build-order 8/8/8 - ngoại lệ giọng hướng dẫn hoạt động đúng; cấu hình máy 8/7/8).
4 case voice-thấp không chấm lại ở vòng 3 (điểm 1-2, cách trần 4 rất xa; LUẬT CỨNG chỉ
kéo XUỐNG nên verdict giữ nguyên giá trị).

## Ghi chú vận hành

- Prompt ghim hiện chứa 6 câu mỏ neo ~5 lấy từ 2 bài thật (cung R, tường thành) do owner
  chỉ điểm. Khi 2 bài này được polish (backlog), các câu mỏ neo trong prompt VẪN GIỮ NGUYÊN
  (chúng là mẫu điểm ~5, không phụ thuộc bài còn tồn tại hay không).
- Lần /evaluator-calibrate tới (quý sau hoặc khi đổi model): kỳ vọng 11/11; tụt xuống là
  drift thật.
- Phát hiện phụ còn treo từ 2026-08-02: câu "chơi mãi thành nhàm" trong bài live
  aoe4-khac-de-che-the-nao - 3/3 judge tiếp tục đọc thành dìm AoE1 (voice 2). Chờ owner
  sửa trong đợt polish.

## Việc tiếp theo (backlog polish, owner kéo khi rảnh)

1. Polish 3 bài voice yếu: cung-r (5), tuong-thanh (5), aoe4-khac (2 + câu dìm AoE1) -
   giờ judge đã cân, có thể chạy write->score->fix loop tin được.
2. cach-tai: thêm link Steam. cac-nen-van-minh: viết sâu lại.
