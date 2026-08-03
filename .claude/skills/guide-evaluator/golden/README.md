# Golden set - bộ kiểm định judge của guide-evaluator

Thư mục này chứa các bài mẫu ĐÃ BIẾT TRƯỚC verdict để skill /evaluator-calibrate
phát hiện judge lỏng/trôi. Quy tắc:

- KHÔNG BAO GIỜ import bất cứ thứ gì từ đây vào src/ (có test guard chặn).
- Các file bad-* là FIXTURE CỐ TÌNH SAI - không dùng làm nguồn facts, không dùng
  làm mẫu văn.
- Các file frozen-* là bản đông lạnh bài thật tại thời điểm gán nhãn - không theo
  dõi file gốc; nhãn của owner là chân lý, không phải điểm evaluator cũ.
- expected.json là sổ đăng ký case: key = tên file (bỏ .md), cặp regression là một
  case "regression-pair". Kỳ vọng là NGƯỠNG CÓ HƯỚNG (voiceMax, contradictionsMin...),
  không so điểm chính xác.
- Kho facts đổi có thể làm bad-wrong-facts hết sai ("fixture mục") - xem mục chẩn
  đoán trong skill evaluator-calibrate.
