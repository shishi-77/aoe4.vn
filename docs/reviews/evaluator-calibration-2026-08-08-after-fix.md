# Evaluator calibration 2026-08-08 - sau khi sửa case trượt

Tiếp nối `evaluator-calibration-2026-08-08.md` (13/14 ĐẠT, trượt
`frozen-good-build-order-co-ban-aoe4`). Owner chọn hướng (a): sửa bài, không nới thước.
File này ghi lại việc đã làm và kết quả chấm lại.

## Đã làm

1. **Sửa bài `src/data/guides/build-order-co-ban-aoe4.ts`** - thêm vế lý do cho đúng những
   câu mà cả 6 judge trừ điểm, không đụng vào bất kỳ con số hay claim nào:
   - "nhà chính không bao giờ được nghỉ" nay kèm hệ quả (hụt một con dân, khoảng chênh dồn lại).
   - "không để dân chơi" nay kèm lý do (vài giây đứng không, cộng dồn làm chậm nhịp lên đời).
   - "Người mới không cần biết nhiều build" nay nói rõ vì sao (chạy trơn một công thức ăn đứt
     việc thuộc nhiều công thức).
   - Câu công thức 7 thực + 3 vàng và câu "kinh tế mới là thứ nuôi cả trận" nối thành câu dài
     có mạch, thay vì hai câu tuyên bố cụt.
   - `updatedAt` -> 2026-08-08.
2. **Chụp lại fixture** `golden/frozen-good-build-order-co-ban-aoe4.md` từ bản mới. Fixture cũ
   giữ ảnh chụp TRƯỚC bản sửa Landmark ngày 2026-08-07 nên đang mục.

## Chấm lại (chấm mù, median-of-3, prompt ghim nguyên văn)

| vòng | structure | voice | conversion |
| --- | --- | --- | --- |
| bản sửa vòng 1 | 8 / 8 / 8 | 7 / 6 / 7 | 7 / 7 / 7 |
| bản cuối | 8 / 8 / 8 | **7 / 7 / 7** | 7 / 7 / 7 |

Sàn strategy 7/7/6 -> ĐẠT. Fact-check bản sửa: **0 mâu thuẫn, 0 dìm** (trước đó là 1 mâu
thuẫn do câu Landmark tuyệt đối trong fixture cũ).

Giữa hai vòng có một lần sửa nữa, do chính judge chỉ ra: khuôn "Sở dĩ... là bởi" bị lặp 3 lần
thành công thức - đúng loại lỗi nhịp mà rubric phạt. Đã rút xuống còn 1 lần, hai chỗ kia đổi
sang cách nối khác. Fact-check chỉ chạy trên bản vòng 1; hai sửa đổi sau đó thuần về cách
diễn đạt, không thêm bớt claim nào.

## Trạng thái golden set

`npx vite-node scripts/check-calibration.ts docs/reviews/calibration-results-2026-08-08-after-fix.json`
-> **14/14 ĐẠT**.

Lưu ý cách đọc file results: chỉ dòng `frozen-good-build-order-co-ban-aoe4` là chạy lại; 13
dòng còn lại bê nguyên từ lần chạy cùng ngày, vì bản sửa không đụng tới fixture nào khác.

## Còn treo (không nằm trong phạm vi lần này)

- Chiều voice của judge đang chặt hơn so với 2026-08-06: `frozen-good-cau-hinh-may` vẫn ở
  voice 6 (trước là 7), chỉ đạt vì sàn utility là 5. Chưa cần xử lý, nhưng nếu lần calibrate
  sau nó tụt tiếp thì đây là case thứ hai cần sửa bài.
- Fact-check hai bài frozen-good vẫn trả nhiều `claimsToVerify` (7 thực + 3 vàng cho Đế chế 4,
  6 dân khởi điểm, cơ chế nhà dân, mốc phút 10-12). Advisory, không chặn, nhưng đó là danh
  sách sẵn có nếu owner muốn bổ sung kho facts AoE4.
