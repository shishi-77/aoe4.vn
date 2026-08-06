---
name: evaluator-calibrate
description: Use quarterly, or immediately after the Claude Code model changes, to verify the guide-evaluator's LLM judges still agree with the owner's labeled golden set. Runs the real judging protocol on committed fixtures in .claude/skills/guide-evaluator/golden/, compares against expected.json via a deterministic CLI, and writes a drift report to docs/reviews/. Report-only - never blocks the content pipeline.
---

# Evaluator Calibrate (kiểm định judge bằng golden set)

Chạy giao thức chấm THẬT của guide-evaluator lên các fixture đã biết trước verdict,
so kết quả với `expected.json`, ghi báo cáo drift. CHỈ BÁO CÁO - không tự chặn
pipeline, không tự sửa prompt; owner đọc báo cáo và quyết.

## Các bước

1. Đọc sổ đăng ký case: `.claude/skills/guide-evaluator/golden/expected.json`.
   Mỗi key là một case; file fixture tương ứng là `golden/<key>.md` (riêng case
   `regression-pair` gồm `regression-pair-old.md` và `regression-pair-new.md`).
2. Với TỪNG case, chạy đúng phần giao thức mà kỳ vọng của nó cần (đọc kỳ vọng
   trong expected.json), dùng NGUYÊN VĂN prompt ghim trong
   `.claude/skills/guide-evaluator/SKILL.md` - chỉ thay đường dẫn bài bằng đường
   dẫn file fixture:

   QUAN TRỌNG - CHẤM MÙ: KHÔNG đưa judge/fact-check đường dẫn file fixture gốc.
   Trước khi dispatch, trích PHẦN TRONG CODE FENCE của fixture (bỏ toàn bộ dòng
   header FIXTURE/nhãn/kỳ vọng) ra file tạm trong thư mục scratchpad của phiên,
   ví dụ <scratchpad>/bai-cham-<n>.ts, và đưa subagent đường dẫn file tạm đó.
   Tên file tạm KHÔNG được chứa tên case hay chữ bad/good/frozen - judge nhìn
   thấy tên là lộ đáp án. Judge thấy kỳ vọng là calibration vô nghĩa.

   - Kỳ vọng có `allDimsAtLeastFloor` / `voiceMax` / `conversionMax`: dispatch
     3 subagent độc lập với prompt ghim Bước 2, dùng đường dẫn file tạm (chứa
     chỉ nội dung bài, không header), lấy TRUNG VỊ từng chiều.
   - Kỳ vọng có `contradictionsMin/Max` / `aoe1DisparagementMin/Max`: dispatch
     1 subagent fact-check theo prompt Bước 3 (đối chiếu facts corpus + quét dìm
     game/cộng đồng RTS nào), dùng đường dẫn file tạm. Ghi số lượng contradictions và
     `disparagement` (tên kỳ vọng trong expected.json giữ nguyên `aoe1Disparagement*`;
     `checkCalibration` cộng dồn hai trường).
   - Kỳ vọng có `winner`: chạy Bước 2.5 head-to-head, BẢN CŨ = trích nội dung fence
     của `regression-pair-old.md` (bỏ header), BẢN MỚI = trích nội dung fence
     của `regression-pair-new.md` (bỏ header), đặt vào file tạm, đưa subagent
     đường dẫn file tạm.
   - Bỏ qua Bước 1 hygiene - phần tất định đã có unit test riêng.
3. Gom kết quả thành một mảng JSON đúng schema `CalibrationResult` của
   `@/lib/calibration` và ghi ra `docs/reviews/calibration-results-<YYYY-MM-DD>.json`:
   `[{"case":"...","scores":{...},"contradictions":N,"disparagement":N,"winner":"..."}]`
   (chỉ ghi các trường mà case đó có chạy).
4. Chạy: `npx vite-node scripts/check-calibration.ts docs/reviews/calibration-results-<YYYY-MM-DD>.json`
5. Ghi báo cáo `docs/reviews/evaluator-calibration-<YYYY-MM-DD>.md`:
   - Bảng: case | kỳ vọng | thực tế | ĐẠT/TRƯỢT (theo output CLI).
   - Với mỗi case TRƯỢT: chẩn đoán một trong hai:
     a) **Judge lỏng/trôi** - kèm gợi ý chỉnh cụ thể: thêm mỏ neo mới vào prompt
        ghim Bước 2 (trích 1 câu thật từ fixture trượt làm mỏ neo điểm thấp),
        hoặc cân nhắc nâng sàn trong `@/lib/guideVerdict`.
     b) **Fixture mục** - CHỈ với case cổng cứng: đối chiếu claim của fixture với
        kho facts HIỆN TẠI; nếu facts đã đổi làm claim hết sai thì ghi "fixture
        mục - cần làm mới fixture", KHÔNG tính là drift.
   - Chốt: "KẾT LUẬN: <N>/<M> ĐẠT - <ổn định | CÓ DRIFT, cần owner xem>".
6. Báo owner một dòng tóm tắt + đường dẫn báo cáo. DỪNG - không tự chỉnh prompt,
   không tự sửa fixture.

## Lưu ý

- Nhịp chạy: mỗi quý, hoặc ngay khi Claude Code đổi model.
- Lần chạy đầu sau khi tạo golden set: TRƯỢT ở nhóm frozen "lủng củng" là KẾT QUẢ
  MONG ĐỢI (judge từng cho các bài đó qua) - báo cáo chính là căn cứ để owner
  chỉnh mỏ neo. Chỉnh xong chạy lại đến khi 100% ĐẠT.
- Không commit gì trong skill này ngoài việc chạy đọc - báo cáo và results nằm
  trong docs/ (local, gitignore).
