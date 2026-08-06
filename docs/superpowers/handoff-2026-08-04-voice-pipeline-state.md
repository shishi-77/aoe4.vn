# Handoff 2026-08-04: trạng thái thực thi plan voice + comparison scale

> CẬP NHẬT 2026-08-06: ĐÃ GIẢI QUYẾT. Owner chỉ định 5 bài aoe.vn làm giọng chuẩn;
> corpus + voice-guide + mỏ neo evaluator làm lại (calibration 14/14); 3 bài polish lại
> từ bản cũ PASS sàn máy và owner chọn bản MỚI 3/3 ở blind test 2026-08-06. Cổng ĐÃ QUA,
> Phase B được mở khóa. File này chỉ còn giá trị lịch sử.

> Dành cho phiên làm việc tiếp theo (Claude web hoặc CLI). Đọc file này TRƯỚC khi làm gì.
> Plan gốc: `docs/superpowers/plans/2026-08-03-voice-and-comparison-scale.md` (đã merge vào main qua PR #43, spec cùng chỗ).
> Branch làm việc hiện tại: `claude/voice-foundation` (đã push). KHÔNG commit lên main.

## Đã xong (Phase A, Task 1-3)

- **Task 1 - corpus:** `docs/voice-corpus/` (README + samples.md với 12 trích đoạn sách "100 cuộc chiến lẫy lừng" owner duyệt giữ 12/12). Commit 1a98e00, 93ed6f0.
- **Task 2 - chưng cất:** `docs/voice-corpus/voice-guide.md` (11 đặc điểm + 8 few-shot) + "Bước 0 - Chuẩn bị giọng văn" trong `.claude/skills/write-article/SKILL.md`. Commit 02adf55. Review sạch, 2 minor deferred (trait dùng ### thay bullet; corpus toàn văn kể trận ngôi ba, thiếu giọng đối thoại - RỦI RO NÀY ĐÃ THÀNH SỰ THẬT, xem dưới).
- **Task 3 - evaluator:** mỏ neo voice ~8 đổi sang trích corpus; 3 fixture golden mới `frozen-bad-voice-v2-*` (bản main của 3 bài owner chê: aoe4-khac-de-che-the-nao, tuong-thanh-phong-thu-aoe4, cung-r-ngua-chem-aoe4, nhãn voiceMax 6); sau fix c85671a (8 câu neo owner chọn) calibration đạt **14/14**. Commits d417977, c85671a, d21e261. Báo cáo: `docs/reviews/evaluator-calibration-2026-08-03-run2.md`.

## Task 4 - blind test gate: TRƯỢT 0/3 (đang dở)

Quy trình đã chạy: 3 bài được viết lại theo voice-guide (3 vòng polish, mỗi vòng 3 judge + head-to-head + fact-check). Kết thúc vòng 3: cả 3 bài PASS sàn máy (voice trung vị 7, head-to-head máy nói bản mới thắng, fact sạch, test xanh).

Blind test với owner (2026-08-04): **owner chê cả 3**:
- aoe4-khac: bản MỚI tệ hơn bản cũ
- tuong-thanh: cả hai đều tệ
- cung-r: bản MỚI tệ hơn bản cũ

=> Working tree đã HOÀN NGUYÊN về bản cũ (bản viết lại bị loại lưu ở
`docs/voice-corpus/rejected-drafts/*.rejected-2026-08-04.ts` + blind-mapping.md để đối chiếu).

## Chẩn đoán (giả thuyết chính, chưa được owner xác nhận)

1. Corpus 100% văn kể trận DỊCH từ một cuốn sách, ngôi thứ ba -> máy học ra giọng
   "sử thi gồng" áp vào bài hướng dẫn game, owner thấy giả. Thiếu hẳn nửa corpus
   "người thật nói chuyện" (post/comment cộng đồng Đế chế) mà owner đã hứa bổ sung.
2. Cả judge lẫn head-to-head giờ vẫn lệch gu owner (máy khen bản mới, owner chê) -
   mỏ neo văn-sách không đại diện cho gu thật.

## Câu hỏi đang CHỜ OWNER trả lời (đã hỏi, chưa có đáp án)

1. Trích 1-2 câu trong bản mới (rejected-drafts) làm owner khó chịu nhất + vì sao.
2. Một mẫu giọng ĐÚNG GU: owner tự viết 3-5 câu mở bài đúng kiểu muốn đọc, HOẶC dán
   2-3 post/comment thật từ cộng đồng Đế chế.

## Việc tiếp theo (theo thứ tự)

1. Lấy đáp án 2 câu hỏi trên từ owner.
2. Bổ sung mẫu giọng đối thoại vào `docs/voice-corpus/samples.md` (đánh dấu nguồn),
   chưng cất LẠI voice-guide với trọng tâm mới: giọng đối thoại làm chủ đạo, văn kể
   trận chỉ làm gia vị (mở bài/cao trào). Cân lại mỏ neo ~8 trong guide-evaluator
   theo mẫu mới + chạy lại evaluator-calibrate (giữ 14/14).
3. Polish lại 3 bài từ BẢN CŨ (không phải từ bản rejected) theo chuẩn mới, blind test
   lại. Cổng: owner chọn bản mới >= 2/3. QUA CỔNG MỚI ĐƯỢC làm Task 5-11 (Phase B).
4. Phase B (comparison kind + seed queue + scheduled routine) làm đúng theo plan,
   chưa đụng gì vào code src/ ngoài các bài guide.

## Trạng thái kỹ thuật

- Branch `claude/voice-foundation` push lên origin, working tree sạch, test/lint/type xanh.
- Ledger SDD local (không theo repo) đã chép nội dung chính vào file này.
- 3 bài guide trên site vẫn là BẢN CŨ (chưa có gì ship ra ngoài từ Phase A ngoài skill/corpus/fixtures).
- Queue `src/data/content-queue.json` vẫn rỗng. Chưa tạo scheduled routine.
- PR #43 (spec + plan) đã merge. Chưa có PR nào cho Phase A.

## Ghi chú vận hành

- docs/ nằm trong .gitignore - mọi commit file docs/ phải `git add -f`.
- Gạch nối `-`, cấm em-dash. Không commit lên main. gh PR dùng `gh auth switch --user shishi-77`.
- Chấm bài = giao thức trong `.claude/skills/guide-evaluator/SKILL.md` (median-of-3,
  chấm mù khi calibrate). Bài FAIL không bao giờ ship.
