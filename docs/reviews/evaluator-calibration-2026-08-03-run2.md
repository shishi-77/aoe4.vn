# Calibration run 2 - 2026-08-03 (sau anchor swap văn mẫu + 3 fixture v2)

Bối cảnh: chạy sau khi (1) mỏ neo voice ~8 đổi sang trích đoạn thật từ voice corpus,
(2) thêm 3 fixture frozen-bad-voice-v2-* đông lạnh bản main hiện tại của 3 bài owner
chê "đơ/nhạt dù PASS" (nhãn owner 2026-08-03).

| Case | Kỳ vọng | Thực tế | Kết quả |
| --- | --- | --- | --- |
| bad-ai-voice | voiceMax 4 | voice 1 (3/1/1) | ĐẠT |
| bad-forced-slang | voiceMax 4 | voice 2 (3/2/2) | ĐẠT |
| bad-empty-hook | conversionMax 4 | conversion 1 (3/2/1) | ĐẠT |
| bad-aoe1-disparagement | aoe1DisparagementMin 1 | 3 câu dìm | ĐẠT |
| bad-wrong-facts | contradictionsMin 1 | 2 mâu thuẫn | ĐẠT |
| regression-pair | winner old | old | ĐẠT |
| frozen-good-build-order | allDims >= sàn strategy | 8/8/8 | ĐẠT |
| frozen-good-cau-hinh | allDims >= sàn utility | 8/7/8 | ĐẠT |
| frozen-bad-voice-cung-r (v1) | voiceMax 6 | voice 6 | ĐẠT |
| frozen-bad-voice-tuong-thanh (v1) | voiceMax 6 | voice 5 | ĐẠT |
| frozen-bad-voice-aoe4-khac (v1) | voiceMax 6 | voice 2 | ĐẠT |
| frozen-bad-voice-v2-aoe4-khac | voiceMax 6 | voice 7 (7,7,7) | TRƯỢT |
| frozen-bad-voice-v2-tuong-thanh | voiceMax 6 | voice 7 (7,7,7) | TRƯỢT |
| frozen-bad-voice-v2-cung-r | voiceMax 6 | voice 8 (8,8,8) | TRƯỢT |

## Chẩn đoán 3 case TRƯỢT: judge lỏng so với gu owner (không phải fixture mục)

- Cả 9 lượt chấm (3 case x 3 judge) đều cho voice 7-8, lệch 1-2 điểm so với nhãn
  owner (<= 6). Đây đúng là kiểu lệch "judge dễ tính hơn owner" mà fixture v2 được
  tạo ra để bắt - kết quả mong đợi ở lần chạy đầu sau khi gán nhãn mới (xem README
  golden set).
- Mỏ neo văn-mẫu mới (văn kể chuyện từ corpus) chưa đủ sức kéo chuẩn xuống: các bài
  v2 đọc trơn tru hơn hẳn nhóm anchor ~5 hiện có, nên judge xếp chúng lên 7-8 dù
  vẫn còn câu đơ (một số judge tự trích câu đơ trong fixes nhưng vẫn chấm 7 - vi
  phạm đúng luật "nhận ra câu đơ mà vẫn chấm 7-8 là chấm sai").
- Gợi ý chỉnh (chờ owner quyết): bổ sung mỏ neo mức ~5-6 bằng CÂU THẬT do owner chỉ
  ra từ chính 3 bài v2 (đúng cơ chế "owner-picked anchors" đã dùng ở vòng
  tuong-thanh trước đây, commit 0a322cb). Không nâng sàn, không tự chế câu.

KẾT LUẬN: 11/14 ĐẠT - CÓ DRIFT (3 case v2), cần owner chọn câu neo để siết judge.

## Cập nhật run 3 (sau fix c85671a - thêm 8 câu neo owner chọn)

Chạy lại 3 case trượt + frozen-good-build-order (canh tác dụng phụ):

| Case | Trước | Sau | Kết quả |
| --- | --- | --- | --- |
| frozen-bad-voice-v2-aoe4-khac | voice 7 | voice 5 (5,5,5) | ĐẠT |
| frozen-bad-voice-v2-tuong-thanh | voice 7 | voice 6 (6,6,6) | ĐẠT |
| frozen-bad-voice-v2-cung-r | voice 8 | voice 6 (6,5,6) | ĐẠT |
| frozen-good-build-order | voice 8 | voice 7 (7,7,7) | ĐẠT (vẫn trên sàn 7 - không kéo oan bài tốt) |

Checker run 3 (calibration-results-2026-08-03-run3.json): 14/14 ĐẠT.
KẾT LUẬN CUỐI: judge đã khớp nhãn owner trên toàn bộ golden set sau khi thêm mỏ neo
owner-picked. Không nâng sàn, không sửa fixture.
