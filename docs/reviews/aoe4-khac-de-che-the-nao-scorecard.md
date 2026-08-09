# Scorecard v3: aoe4-khac-de-che-the-nao

Ngày chấm: 2026-08-09 (rà lại theo sàn mới)
Giao thức: median-of-5, sàn `comparison` 8/7/7
Loại bài (kind): comparison
SEO hygiene: PASS

| Chiều | Điểm (median 5) | Sàn (comparison) | Đạt |
|-------|:---:|:---:|:---:|
| structure  | 8 | 8 | ✅ |
| voice      | 7 | 7 | ✅ |
| conversion | 8 | 7 | ✅ |
| TỔNG (thông tin, không phải gate) | 23/30 | - | - |

Điểm thô 5 judge vòng cuối: structure 8/8/8/8/8, voice 7/7/7/7/7, conversion 8/8/8/8/8.
**Nhất trí tuyệt đối cả ba chiều.** Voice nằm đúng sàn nhưng không phân tán, nên lần chạy sau
khó lật.

Chống thụt lùi: bản mới >= bản cũ (winner: new - "giữ đúng giọng cẩm nang cộng đồng với heading
rõ nghĩa hơn và diễn giải tốc độ đúng phạm vi di chuyển của quân, trong khi bản cũ chứa câu sai
sự thật bị cấm về nhịp trận")

Tôn trọng game RTS: không có câu dìm game/cộng đồng RTS nào

Phạm vi so sánh: chỉ so hai game trong tiêu đề. Đế chế 2 và Đế chế 3 mỗi game xuất hiện đúng
một lần, cùng trong câu xếp hạng tốc độ - đúng ngoại lệ skill cho phép. StarCraft 0 lần.

Truy vết nguồn: facts sheet `docs/facts-review/aoe4-khac-de-che-the-nao.md` lập 2026-08-09.
Bài đã xuất bản từ trước mà chưa từng có sheet; cổng này lúc đó chưa nằm trong script.

Accuracy:
- Mâu thuẫn sự thật (FAIL cứng): không có

## Lịch sử chấm 2026-08-09

| Vòng | str | voice | conv | Chuyện gì xảy ra |
|:---:|:---:|:---:|:---:|---|
| 1 | 8 | 6 | 8 | FAIL. 4/5 judge chỉ cùng một câu ("Có một khác biệt về cơ chế cần lưu ý") |
| 2 | 8 | 7 | 8 | Điểm đạt, nhưng fact-check bắt `kèo "đời 3 không thành"` |
| 3 | - | - | - | Fact-check bắt tiếp 2 lỗi mới, xem dưới |
| 4 | 8 | 7 | 8 | PASS, fact-check sạch |

### Ba lỗi fact-check bắt được mà điểm số không thấy

1. **`kèo "đời 3 không thành"`** - đây là **luật**, không phải **kèo**. Đúng lỗi owner đã bắt một
   lần trong draft `de-che-co-nhung-ban-nao` và đã ghi thành luật trong `aoe1-facts.md`. Bài tự
   mâu thuẫn với chính mình: hai chỗ khác trong cùng bài gọi đúng là "luật".
2. **`description` còn chữ "nhịp trận"** sau khi thân bài đã sửa. Vi phạm WRITING RULE (owner
   2026-08-08): bảng xếp hạng tốc độ chỉ nói tốc độ DI CHUYỂN của quân, không được diễn thành
   pacing. Sửa thân bài mà quên metadata là lỗ hổng đáng nhớ - vòng chấm định tính không đọc
   `description`.
3. **Câu "muốn bịt đường phải xây tường" viết như luật tuyệt đối**, trong khi kho ghi Mông Cổ
   không dựng được tường nào cả. Bản sửa còn làm câu này MẠNH hơn bản gốc trước khi bị bắt.

Ngoài ra sửa một mâu thuẫn chéo bài: bài này viết đồ công thành "giá dễ chịu", trong khi
`tuong-thanh-phong-thu-aoe4` viết "vừa đắt vừa giòn" - mà hai bài link thẳng sang nhau đúng ở
hai đoạn đó. Đã bỏ hẳn vế giá ở bài này.

## Claim cần owner duyệt (không chặn PASS)

- Ba cơ chế tự động (rally dân vào bãi tài nguyên, rally quân, dân xây xong tự chuyển việc).
  Vế thứ ba cụ thể nhất và đáng hỏi nhất.
- "Ngay từ đời 1 quân đã đủ loại để đánh nhau" - đáng ngờ nhất: kho đặt vòng khắc chế chính ở
  đời 2 và quân nặng ở đời 3.
- Cơ chế "không bo nhà được" bằng công trình.
- "Bo nhà" chưa nằm trong vocabulary map của `aoe1-facts.md`.
- Động cơ của luật cấm thành chòi ("để trận nhanh và gắt hơn").
- Tốc độ lên đời mỗi phe mỗi khác.

## Cần sửa

Không có mục nào chặn PASS.
