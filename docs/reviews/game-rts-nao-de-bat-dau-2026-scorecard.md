# Scorecard v3: game-rts-nao-de-bat-dau-2026

Loại bài (kind): comparison
SEO hygiene: PASS (dimensionScore 9.1, failures: không có - gồm cả cổng đặt tên game)

| Chiều | Điểm (median 3) | Sàn (comparison) | Đạt |
|-------|:---:|:---:|:---:|
| structure  | 8 | 7 | ✅ |
| voice      | 8 | 7 | ✅ |
| conversion | 8 | 6 | ✅ |
| TỔNG (thông tin, không phải gate) | 24/30 | - | - |

Vòng 1 (bản nháp đầu): 8/6/8, 8/7/8, 8/7/8 -> trung vị 8/7/8, nhưng FAIL vì 1 mâu thuẫn sự thật.
Vòng 2 (sau khi sửa): 7/8/8, 8/8/8, 8/8/8 -> trung vị 8/8/8.

Chống thụt lùi: bài mới, không có bản trước trên main

Tôn trọng game RTS: không có câu dìm game/cộng đồng RTS nào (cả hai vòng đều 0)

Phạm vi so sánh: chỉ so hai game bài thực sự bắc cầu (Đế chế 1 của người đọc và Đế chế 4),
`comparisonScopeViolations` rỗng ở cả hai vòng. Đế chế 2 và Đế chế 3 chỉ xuất hiện trong một
đoạn điểm tin bản mở rộng, không có mục riêng, không làm anchor text.

Accuracy:
- Mâu thuẫn sự thật (FAIL cứng): không có ở vòng 2.
  Vòng 1 có 1 và đã sửa: "nửa đầu năm nhà phát hành cũng đứng ra tổ chức giải Red Bull Wololo:
  Londinium" - nguồn chỉ nói người hâm mộ và đội ngũ tới London dự một sự kiện phá kỷ lục,
  KHÔNG nói nhà phát hành đứng ra tổ chức. Câu đã sửa thành "làng Đế chế còn có giải ...
  tổ chức tại London, mà trong bài tổng kết nửa đầu năm nhà phát hành gọi là một sự kiện phá
  kỷ lục".

Truy vết nguồn:
- Xác minh trực tiếp được từ nguồn chính thức: toàn bộ dữ kiện bản mở rộng (The Last
  Chieftains, The Viking Sagas, The Baltic Powers 10/9, Yue Fei's Legacy, Raiders of the North
  với Vikings + Scots, 4 nhiệm vụ Crucible, 2 biome), 35 nền văn minh của Đế chế 2, bảng xếp
  hạng và mùa xếp hạng của Đế chế 4, và tên giải Red Bull Wololo: Londinium.
- CHƯA XÁC MINH ĐƯỢC (không chặn PASS): mọi câu thuật lại thread Reddit. WebFetch bị chặn với
  reddit.com ở cả hai vòng, nên nguồn duy nhất là ảnh chụp owner gửi 2026-08-08, đã ghi từng
  dòng trong facts sheet. Owner nên liếc lại ảnh để xác nhận các con số 44 upvote / 101 bình
  luận / 42 lượt đồng tình.

Claim cần bạn duyệt sau khi PASS (không chặn loop):
- "hệ thống tự lo việc ghép bạn với người cùng trình" - nguồn xác nhận Đế chế 4 CÓ bảng xếp
  hạng và mùa xếp hạng, nhưng không nói rõ cơ chế ghép theo trình độ. Đây là suy diễn.
- "Phản xạ kinh tế và thói quen dò bản đồ thì mang sang được gần như nguyên vẹn" - nhận định
  kinh nghiệm, không có trong hai kho facts.
- "ra quân lệch bài là rất dễ thua" - vòng khắc chế giáo/kỵ/cung và "kỵ nhẹ săn mọi loại quân
  bắn" thì kho aoe4 xác nhận; riêng mức độ hệ quả là đánh giá.
- "Trong làng Đế chế mình thì câu hỏi đó nghe quen tới mức nhàm" - quan sát cộng đồng VN.

VERDICT: PASS

## Ghi chú quy trình

- Sau vòng chấm 2, bài còn được sửa thêm đúng hai cụm từ theo góp ý accuracy của fact-check
  ("bài tổng kết năm" -> "bài tổng kết nửa đầu năm"; "nền văn minh mới mỗi năm" -> "năm nay
  vẫn có nền văn minh mới"). Đây là sửa độ chính xác ở mức từ ngữ, không đụng bố cục hay
  giọng, nên điểm 8/8/8 vẫn mô tả đúng bản hiện tại.
- Cổng phạm vi so sánh của kind `comparison` viết cho bài so kèo hai game có tên trong tiêu đề.
  Bài này trả lời một câu hỏi thay vì so kèo, nên diễn giải áp dụng đã ghi rõ trong facts sheet
  và được subagent fact-check kiểm lại độc lập ở cả hai vòng.
