# Báo cáo kiểm định evaluator - 2026-08-02 (lần chạy đầu tiên)

Giao thức: chấm mù (nội dung fence trích ra file tạm, không header), median-of-3 judge cho case cần điểm, fact-check cho case cổng cứng, head-to-head cho cặp regression. Model judge: model phiên hiện tại (Fable). Kết quả so bằng `scripts/check-calibration.ts` (tất định).

## Bảng kết quả

| Case | Kỳ vọng | Thực tế (median 3) | Kết quả |
|---|---|---|---|
| bad-ai-voice | voice <= 4 | structure 3, voice 1, conversion 1 | ĐẠT |
| bad-forced-slang | voice <= 4 | structure 3, voice 2, conversion 2 | ĐẠT |
| bad-empty-hook | conversion <= 4 | structure 3, voice 2, conversion 1 | ĐẠT |
| bad-aoe1-disparagement | aoe1Disparagement >= 1 | 2 câu dìm bị bắt | ĐẠT |
| bad-wrong-facts | contradictions >= 1 | 2 mâu thuẫn bị bắt (cung R khắc tất; đảo vai trò cơ động R/A) | ĐẠT |
| regression-pair | winner = old | old ("bản mới nhồi hook/slang làm lố và trì hoãn thông tin") | ĐẠT |
| frozen-good-build-order-co-ban-aoe4 | mọi chiều >= sàn strategy (7/7/6), 0 oan | 8/8/8, contradictions 0, aoe1 0 | ĐẠT |
| frozen-good-cau-hinh-may-aoe4 | mọi chiều >= sàn utility (7/5/3), 0 oan | 8/7/8, contradictions 0, aoe1 0 | ĐẠT |
| frozen-bad-voice-cung-r-ngua-chem-aoe4 | voice <= 6 (owner: lủng củng) | structure 8, **voice 7**, conversion 7 | **TRƯỢT** |
| frozen-bad-voice-tuong-thanh-phong-thu-aoe4 | voice <= 6 (owner: lủng củng) | structure 8, **voice 8**, conversion 8 | **TRƯỢT** |
| frozen-bad-voice-aoe4-khac-de-che-the-nao | voice <= 6 (owner: văn AI) | structure 8, **voice 2**, conversion 7 | ĐẠT (xem chẩn đoán) |

**KẾT LUẬN: 9/11 ĐẠT - CÓ DRIFT, cần owner xem.**

## Chẩn đoán từng case TRƯỢT

### 1. frozen-bad-voice-cung-r-ngua-chem-aoe4 (voice 7 > 6) - JUDGE LỎNG

Cả 3 judge đều cho voice 7-8 với bài owner đánh "lủng củng". Các câu judge tự trích ra để "sửa nhẹ" chính là bằng chứng: judge NHẬN RA những câu đơ ("Tuy nhiên, chẳng có gì miễn phí.", "Đó chính là cơ chế khắc chế quân rất chặt của Đế chế 4.") nhưng chỉ trừ 1-2 điểm thay vì kéo xuống dưới sàn. Mỏ neo hiện tại chỉ có mẫu ~1 (sáo AI), ~3 (slang gượng), ~8 (chuẩn) - KHÔNG có mẫu nào cho vùng giữa "đúng ngữ pháp, đúng thông tin, nhưng đơ và máy móc", nên judge mặc định vùng đó là 7.

### 2. frozen-bad-voice-tuong-thanh-phong-thu-aoe4 (voice 8 > 6) - JUDGE LỎNG (nặng nhất)

3/3 judge cho 8/8/8 - hoàn toàn không thấy vấn đề owner thấy. Cùng nguyên nhân thiếu mỏ neo vùng giữa như trên.

### 3. frozen-bad-voice-aoe4-khac-de-che-the-nao (voice 2) - ĐẠT NHƯNG VÌ LÝ DO KHÁC + PHÁT HIỆN PHỤ QUAN TRỌNG

Case này ĐẠT (2 <= 6) nhưng KHÔNG phải vì judge bắt được "văn AI" như owner chê - cả 3 judge kéo voice xuống 2 vì áp luật dìm-AoE1 cho các câu: "Đời 1 và đời 2 quá ít loại quân, đánh nhau quanh đi quẩn lại rìu bổ với quẩy đá, chơi mãi thành nhàm." và "Cộng đồng Đế chế đi qua thời đó rồi mới chốt luật đời 3."

**Phát hiện phụ: đây là bài ĐANG LIVE trên aoe4.vn.** Nếu 3/3 judge độc lập đọc câu đó thành "chê gameplay AoE1 nhàm" thì một phần người đọc AoE1 cũng có thể đọc như vậy. Owner nên xem lại câu này trong `src/data/guides/aoe4-khac-de-che-the-nao.ts` (bài này owner cũng đã đánh "chưa đạt" - việc sửa nằm trong backlog polish).

## Gợi ý chỉnh mỏ neo (owner quyết - calibrate không tự sửa)

Thêm vào PROMPT GHIM của guide-evaluator (Bước 2) một mỏ neo vùng giữa, trích từ chính bài owner chê:

```
- voice ~5 (lủng củng máy móc: đúng thông tin nhưng câu đơ, nhịp gãy, đọc như dịch):
  "Đó chính là cơ chế khắc chế quân rất chặt của Đế chế 4." /
  "Tuy nhiên, chẳng có gì miễn phí."
```

kèm một câu luật: "Bài đúng thông tin nhưng giọng đơ, máy móc, nhịp câu lặp đều đều -> voice cao nhất là 5-6, KHÔNG phải 7-8."

Không đề xuất nâng sàn voice (7 cho strategy đã đúng) - vấn đề là judge định vị vùng giữa sai, không phải sàn thấp.

## Caveat lần chạy đầu

Final review phát hiện nhóm fixture tổng hợp lúc chạy còn mang slug tự tố ('golden-bad-ai-voice'...) và tên file tạm chứa tên case - judge có thể bị mồi ở CHÍNH các case tổng hợp (vốn được thiết kế hiển nhiên nên vẫn có giá trị smoke-test). Nhóm frozen - nơi ra kết luận drift - dùng slug bài thật, KHÔNG bị ảnh hưởng. Đã sửa (commit d6c1629): slug trung tính + file tạm đánh số; từ lần chạy sau giao thức mù hoàn toàn.

## Fixture mục

Không có: cả hai case cổng cứng (bad-wrong-facts, bad-aoe1-disparagement) đều sập đúng cổng với kho facts hiện tại.

## Việc tiếp theo

1. Owner duyệt gợi ý mỏ neo trên -> sửa PROMPT GHIM trong `.claude/skills/guide-evaluator/SKILL.md` -> chạy lại `/evaluator-calibrate` đến khi 11/11 ĐẠT.
2. Owner xem câu "chơi mãi thành nhàm" trong bài aoe4-khac-de-che-the-nao (đang live).
3. Sau khi judge cân chỉnh: chạy polish loop cho 3 bài voice kém (backlog).
