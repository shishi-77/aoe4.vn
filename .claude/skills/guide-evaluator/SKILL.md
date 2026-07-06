---
name: guide-evaluator
description: Use when scoring or polishing a guide in src/data/guides before publish, or when running a write→score→fix loop. Scores one guide against a 5-dimension rubric (SEO, structure, voice, value, conversion), writes a scorecard with VERDICT PASS/FAIL and a concrete fix list. Judge only - does not write the guide.
---

# Guide Evaluator

Chấm MỘT guide trong `src/data/guides/*.ts` (đã đăng ký trong `index.ts`) theo rubric
5 chiều. Đây là **quan tòa thuần**: chỉ chấm và ghi góp ý, KHÔNG tự viết lại bài.

## Đầu vào

Một `<slug>` đã có trong `@/data/guides`. Nếu chưa đăng ký trong `src/data/guides/index.ts`,
báo lỗi và dừng - SEO runner cần guide nằm trong index.

## Giao thức chấm (mỗi lần chạy)

1. **Chiều #1 - SEO (số liệu cứng).** Chạy:
   `npx vite-node scripts/score-guide-seo.ts <slug>`
   Đọc `dimensionScore` (0-10) và từng `rule`. KHÔNG tự đếm ký tự bằng mắt - dùng số của script.

2. **Chiều #2-#5 - định tính, chấm bằng subagent fresh-eyes.** Dispatch một subagent
   (general-purpose) đọc guide và chấm 4 chiều dưới. Fresh-eyes để không tự bào chữa câu
   mình vừa viết. Yêu cầu subagent trả JSON:
   `{ structure: {score, notes[]}, voice: {...}, value: {...}, conversion: {...}, fixes: [{dimension, quote, suggestion}] }`
   với mỗi `score` là 0-10, và mỗi `fix` phải trích ĐÚNG câu/đoạn có vấn đề + câu thay đề xuất.

3. **Tổng hợp scorecard** theo mẫu ở dưới và ghi ra `docs/reviews/<slug>-scorecard.md`.

## Rubric (mỗi chiều 0-10)

| # | Chiều | Chấm gì | Sàn cứng |
|---|-------|---------|:---:|
| 1 | SEO kỹ thuật | từ script (title/desc length, internal link, slug, cta, keyword) | ✅ ≥ 7 |
| 2 | Cấu trúc & dễ đọc | section hợp lý, heading rõ, đoạn không quá dài, câu ngắn gãy gọn | ❌ |
| 3 | Văn phong & giọng | giọng trò chuyện dân Đế chế, KHÔNG "văn AI", không em-dash, đúng từ vựng cộng đồng | ✅ ≥ 7 |
| 4 | Giá trị & chính xác | thông tin game đúng, insight thật cho dân AoE1, không lan man | ✅ ≥ 7 |
| 5 | Chuyển đổi | mở bài hook, mạch dẫn tới CTA, CTA rõ, related giữ chân | ✅ ≥ 7 |

### Luật giọng (chiều #3) - dấu hiệu "văn AI" phải trừ điểm

- Có em-dash `—` bất kỳ đâu → tự động dưới sàn (repo cấm tuyệt đối).
- Sáo rỗng ("trong thế giới game đầy màu sắc", "không thể phủ nhận rằng"), liệt kê máy
  móc, câu dài lê thê, giọng trung lập vô hồn.
- Viết cho dân Đế chế AoE1 (đa số người chơi miền Bắc): câu gãy gọn, dùng đúng tiếng
  cộng đồng - ví dụ "ngựa dò" (Scout), "đóng nhà dân", "23 dân đời 3 không thành",
  "build 7 thực 3 vàng". Sai/thiếu chất này → trừ mạnh.

## Logic PASS

- **PASS** khi: SEO ≥ 7 VÀ voice ≥ 7 VÀ value ≥ 7 VÀ conversion ≥ 7 VÀ tổng 5 chiều ≥ 40/50.
- Bất kỳ chiều sàn nào < 7 → **FAIL** ngay, bất kể tổng.
- (Thang/sàn/ngưỡng chỉnh ở đây nếu calibration lệch.)

## Mẫu scorecard (`docs/reviews/<slug>-scorecard.md`)

```
# Scorecard: <slug>

| Chiều | Điểm | Sàn | Đạt sàn |
|-------|:----:|:---:|:-------:|
| 1 SEO         | X/10 | 7 | ✅/❌ |
| 2 Cấu trúc    | X/10 | - | -    |
| 3 Văn phong   | X/10 | 7 | ✅/❌ |
| 4 Giá trị     | X/10 | 7 | ✅/❌ |
| 5 Chuyển đổi  | X/10 | 7 | ✅/❌ |
| TỔNG          | XX/50 | 40 | ✅/❌ |

VERDICT: <ghi đúng một từ: PASS hoặc FAIL>

## Cần sửa (nếu FAIL)
- [chiều] "trích câu có vấn đề" → đề xuất câu thay
- ...
```

Dòng `VERDICT: PASS` / `VERDICT: FAIL` là mốc để harness loop bám vào - phải xuất hiện đúng dạng.

## Chạy trong loop với ralph-loop

Prompt mẫu (thay `<slug>`):

```
/ralph-loop "Trau chuốt guide <slug> trong src/data/guides. Mỗi vòng: (1) dùng skill guide-evaluator chấm <slug>; (2) đọc docs/reviews/<slug>-scorecard.md; (3) nếu VERDICT là FAIL, sửa file guide đúng theo mục 'Cần sửa' - chỉ sửa văn/nội dung, giữ slug và cấu trúc dữ liệu; (4) chấm lại. CHỈ in <promise>GUIDE-PASSED</promise> khi scorecard mới nhất ghi VERDICT: PASS. Nếu sau nhiều vòng vẫn kẹt một chiều, ghi rõ chiều kẹt + đã thử gì vào scorecard rồi dừng, KHÔNG in promise giả." --completion-promise "GUIDE-PASSED" --max-iterations 12
```

Luôn đặt `--max-iterations` làm phanh. Không in `GUIDE-PASSED` khi scorecard chưa PASS.
