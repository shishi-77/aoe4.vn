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

Chống thụt lùi: bài mới, không có bản trước trên `main` -> `regressedVsPrevious = false`, cổng
bỏ qua (giao thức cập nhật ở PR #49, main 7513136: baseline là bản trên `origin/main`, không
phải bản nháp trong nhánh).

Ghi lại lần chấm trước để đối chiếu: theo giao thức CŨ (baseline = `git HEAD` = bản nháp vừa
commit), judge head-to-head chọn bản nháp và bài bị FAIL cứng vì "regressed". Lý do judge đưa
ra có nhắc "cầu nối bảng bonus damage của AoE2" - đúng câu mà fact-check đã loại vì không có
nguồn. Chính ca này là bằng chứng cho gap đã sửa ở PR #49.

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

VERDICT: PASS
Reasons: không có (hygiene PASS, cả ba chiều >= sàn comparison, 0 mâu thuẫn, 0 câu dìm game,
cổng chống thụt lùi không áp dụng cho bài mới)

Lưu ý: nội dung bài KHÔNG đổi so với lần chấm vòng 3, nên điểm giữ nguyên; thứ đổi chỉ là kết
quả cổng chống thụt lùi sau khi giao thức được sửa ở PR #49.

## Gap đã phát hiện và đã sửa

Dry run này (Task 10 Step 2 của plan
`docs/superpowers/plans/2026-08-03-voice-and-comparison-scale.md`) lộ ra hai lỗi giao thức, đã
vá ở PR #49:

1. Judge head-to-head KHÔNG được biết ràng buộc nguồn của kind comparison, nên nó chấm cao đúng
   đoạn văn bị luật cứng loại ("cầu nối bảng bonus damage của AoE2" là claim không nguồn). Cổng
   chống thụt lùi và cổng truy vết nguồn đang đá nhau.
2. Bước 3.4 của skill write-article yêu cầu commit bản nháp (status `drafted`), nên baseline của
   cổng chống thụt lùi là BẢN NHÁP CHƯA QUA FACT-CHECK, chứ không phải một bản đã từng PASS.

Đã sửa ở PR #49 (merged, main 7513136):
- Baseline của cổng đổi từ `git HEAD` sang `git show origin/main:` - bản đã từng qua cổng. Bài
  chưa có trên `main` thì không có bản trước, cổng bỏ qua và ghi lý do vào scorecard.
- Bước 2.5 chạy SAU Bước 3, và prompt head-to-head nhận thêm "DANH SÁCH CÂU SAI SỰ THẬT" kèm
  luật: bản chứa câu đó thua, dù đọc mượt hơn.
- write-article Bước 3.4 không commit file bài giữa loop nữa; commit một lần sau khi PASS.
