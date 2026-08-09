# Facts sheet: ra-mat-chuyen-muc-tin-tuc

Lập 2026-08-08, khi rà lại bài theo sàn mới. Bài đã xuất bản từ 2026-08-02 mà chưa có sheet;
chế độ news của `guide-evaluator` bắt buộc mỗi bản tin phải có một sheet, nếu không thì FAIL
hygiene ngay ở Bước 3a.

**Đây là bài thông báo của chính trang, không phải bản tin về sự kiện bên ngoài.** Mọi claim
trong bài đều nói về việc aoe4.vn sẽ làm gì, nên nguồn duy nhất hợp lệ là chính trang, và
không có URL bên thứ ba nào để WebFetch đối chiếu.

| Claim trong bài | Nguồn | Trạng thái |
|---|---|---|
| aoe4.vn mở chuyên mục Tin tức từ 2026-08-02 | chính trang (`publishedAt` của bài, route `/news` đã chạy) | Xác nhận |
| Chuyên mục tổng hợp patch notes, lịch + kết quả giải đấu, các đợt DLC của Đế chế 4 | tuyên bố chủ trương của trang | Xác nhận (là cam kết, không phải sự kiện) |
| Mọi bản tin kèm link nguồn chính thức | quy ước biên tập của trang; `NewsPost.sources[]` là trường bắt buộc trong `src/data/news/index.ts` | Xác nhận bằng chính kiểu dữ liệu |
| Bài mới được chia sẻ trong Facebook Group và Discord của cộng đồng | kênh cộng đồng của trang, có link ở footer | Xác nhận |

## Câu hỏi cho owner

Luật "news không có facts sheet thì FAIL hygiene" viết cho bản tin về sự kiện bên ngoài, nơi
mỗi con số phải truy được về nguồn. Bài thông báo của chính trang không có claim ngoài nào để
truy, nên sheet này gần như chỉ là thủ tục.

Có nên thêm một ngoại lệ vào skill cho loại bài "thông báo của chính trang" (không `sources[]`
bên thứ ba thì không cần sheet), hay giữ luật cứng để không ai lách? Giữ nguyên cũng có lý:
một dòng thủ tục rẻ hơn nhiều so với việc mở đường lách cho bản tin thật.
