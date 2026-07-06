---
name: guide-evaluator
description: Use when scoring or polishing a guide in src/data/guides before publish, or when running a write→score→fix loop. Grades one guide with a pinned strict rubric (SEO hygiene gate + structure/voice/conversion via median-of-3 judges + accuracy fact-checked against committed AoE facts files), writes a scorecard with VERDICT PASS/FAIL and a concrete fix list. Judge only - does not write the guide.
---

# Guide Evaluator (v2)

Chấm MỘT guide trong `src/data/guides/*.ts` (đã đăng ký trong `index.ts`). Judge thuần:
chỉ chấm + ghi góp ý, KHÔNG tự viết lại bài. v2 làm verdict phụ thuộc CHẤT LƯỢNG bài,
không phụ thuộc giọng prompt: prompt được GHIM cứng, có mỏ neo, lấy trung vị 3 lần, và
sự thật được đối chiếu với facts file thay vì để model tự đoán.

## Đầu vào
Một `<slug>` đã có trong `@/data/guides`.

## Giao thức chấm (mỗi lần chạy)

### Bước 1 - Cổng vệ sinh SEO (tất định)
Chạy: `npx vite-node scripts/score-guide-seo.ts <slug>`
Đọc `hygiene`. Nếu `hygiene.pass === false` -> guide bị loại ngay, ghi scorecard FAIL với
`hygiene.failures`, KHÔNG chấm tiếp. SEO KHÔNG cho điểm chất lượng nữa (nó cho ~10 với mọi
bài thật nên vô dụng làm tín hiệu chất lượng).

### Bước 2 - Chấm định tính bằng median-of-3 (structure / voice / conversion)
Dispatch **3 subagent fresh-eyes ĐỘC LẬP**, mỗi cái chấm cùng một bài bằng ĐÚNG prompt ghim
dưới đây. Điểm mỗi chiều = **TRUNG VỊ** của 3 lần (bỏ dao động ±1). Không tự nới tay: dùng
nguyên văn prompt, không thêm bớt giọng.

PROMPT GHIM (dán y nguyên cho mỗi subagent, thay `<slug>`):
```
Chấm bài src/data/guides/<slug>.ts cho dân kỳ cựu Đế chế 1 (AoE1) đọc AoE4. Chấm THẲNG TAY,
không nới. Mỗi chiều 0-10 số nguyên:
- structure: bố cục, heading rõ, đoạn không dài, câu ngắn gãy gọn.
- voice: giọng trò chuyện dân Đế chế, tiếng lóng cộng đồng đúng, KHÔNG "văn AI". Có em-dash
  bất kỳ đâu -> voice <= 3.
- conversion: mở bài có hook, mạch dẫn tới CTA/cộng đồng cuối bài.
Mỏ neo chuẩn (đối chiếu để chấm nhất quán):
- voice ~1: "Trong thế giới game chiến thuật đầy màu sắc, không thể phủ nhận rằng..." (sáo AI)
- voice ~8: "Đế chế đánh random, ra quân nào đánh theo bài quân đó." (giọng dân Đế chế, gãy gọn)
- conversion ~1: "Bài viết dưới đây sẽ cung cấp cho bạn những thông tin hữu ích nhất." (không hook)
Trả JSON: {"structure":X,"voice":X,"conversion":X,"fixes":[{"dimension":"...","quote":"câu trích đúng","suggestion":"câu thay"}]}
```

### Bước 3 - Fact-check accuracy (đối chiếu facts file, KHÔNG tự đoán)
Dispatch 1 subagent đọc:
- `.claude/skills/guide-evaluator/facts/aoe1-facts.md`
- `.claude/skills/guide-evaluator/facts/aoe4-facts.md`
Nhiệm vụ: trích MỌI claim sự thật trong bài, rồi phân loại theo facts file:
- Claim MÂU THUẪN facts -> `contradictions[]` (mỗi cái: câu trích + fact bị vi phạm).
- Claim facts XÁC NHẬN đúng -> bỏ qua.
- Claim KHÔNG có trong facts -> `claimsToVerify[]` (chờ người duyệt). TUYỆT ĐỐI không tự
  khẳng định sai với thứ ngoài facts (tránh nghi oan - lỗi đã thấy ở calibration).
Trả JSON: {"contradictions":[...],"claimsToVerify":[...]}
Ví dụ mâu thuẫn phải bắt: câu ngụ ý "cung R khắc tất" -> facts nói cung R (Chariot Archer) và
cung A (Composite Bowman) KHÔNG khắc chế class nào -> contradiction.

### Bước 4 - Verdict tất định
Điểm cuối mỗi chiều = trung vị 3 lần ở Bước 2. Tính:
`guideVerdict(hygiene.pass, {structure,voice,conversion}, {contradictions: contradictions.length, unresolvedFlags: claimsToVerify.length})`
từ `@/lib/guideVerdict` (sàn `QUALITY_FLOOR`=7, tổng `QUALITY_TOTAL`=21, tối đa 30).
PASS chỉ khi hàm trả `pass: true`. `claimsToVerify` chưa được người duyệt -> coi là unresolved
-> chưa PASS được (người duyệt chốt từng claim rồi mới hạ về 0).

### Bước 5 - Ghi scorecard
Ghi ra `docs/reviews/<slug>-scorecard.md` theo mẫu:
```
# Scorecard v2: <slug>

SEO hygiene: PASS/FAIL (nếu FAIL: liệt kê failures)

| Chiều | Điểm (median 3) | Sàn 7 | Đạt |
|-------|:---:|:---:|:---:|
| structure  | X | 7 | ✅/❌ |
| voice      | X | 7 | ✅/❌ |
| conversion | X | 7 | ✅/❌ |
| TỔNG       | XX/30 | 21 | ✅/❌ |

Accuracy:
- Mâu thuẫn sự thật (FAIL cứng): <liệt kê câu + fact bị vi phạm, hoặc "không có">
- Claim cần người duyệt: <liệt kê, hoặc "không có">

VERDICT: <ghi đúng một từ: PASS hoặc FAIL>
Reasons (nếu FAIL): <copy reasons từ guideVerdict>

## Cần sửa
- [chiều] "câu có vấn đề" -> câu thay
```
Dòng `VERDICT: PASS` / `VERDICT: FAIL` là mốc harness bám vào - phải đúng dạng, đúng một từ.

## Chạy trong loop với ralph-loop
```
/ralph-loop "Trau chuốt guide <slug> trong src/data/guides. Mỗi vòng: (1) dùng skill guide-evaluator chấm <slug>; (2) đọc docs/reviews/<slug>-scorecard.md; (3) nếu VERDICT FAIL, sửa file guide đúng theo 'Cần sửa' và các mâu thuẫn sự thật - chỉ sửa văn/nội dung, giữ slug + cấu trúc dữ liệu; (4) chấm lại. CHỈ in <promise>GUIDE-PASSED</promise> khi scorecard mới nhất VERDICT: PASS. Mâu thuẫn sự thật và claim chưa duyệt PHẢI về 0 mới được PASS - KHÔNG in promise giả." --completion-promise "GUIDE-PASSED" --max-iterations 12
```
Lưu ý: claim ngoài facts (`claimsToVerify`) cần người thật chốt hoặc bổ sung vào facts file
trước khi bài đó PASS được - loop không tự quyết đúng/sai với thứ ngoài facts.
