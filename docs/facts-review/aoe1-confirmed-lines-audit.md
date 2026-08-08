# Rà lại các dòng đóng dấu CONFIRMED trong `aoe1-facts.md`

**Vì sao có file này**: ngày 2026-08-08, owner bắt được claim "7 thực 3 vàng" là quy ước của
Đế chế 4 chứ không phải Đế chế 1. Claim đó nằm trong kho với dấu `CONFIRMED by domain expert`
từ 2026-07-06, còn được tái khẳng định ngày 2026-08-07, và đã lọt qua **năm vòng fact-check**
của bài `de-che-co-nhung-ban-nao` mà không vòng nào chớp mắt.

**Cổng chấm không hỏng.** Subagent fact-check được giao việc bắt claim CHỌI kho. Claim này KHỚP
kho từng chữ, nên nó qua đúng như thiết kế. Hệ quả: **một dòng sai nằm trong kho là điểm mù
tuyệt đối của quy trình hiện tại** - càng nhiều vòng chấm càng vô ích, vì vòng nào cũng soi vào
cùng một nguồn sai.

Cách duy nhất đóng điểm mù đó là owner đọc lại chính các dòng chỉ dựa vào lời owner.

## Phạm vi

Chỉ liệt kê claim mà **nguồn duy nhất là lời owner**, không có URL nào chống lưng. Các dòng có
URL thì subagent tự đối chiếu được, và các dòng đã mang cờ `⚠️ CẦN NGƯỜI DUYỆT` thì quy trình
đã tự coi là chưa xác minh - hai nhóm đó không nằm trong danh sách này.

## Tín hiệu đáng lo nhất

Phiên duyệt 2026-07-06 ghi **hai** quy ước build. Cả hai đều đã hỏng:

| Claim | Số phận |
| --- | --- |
| "23 dân đời 3 không thành" | Nửa "23 dân" bị bác 2026-08-07 (số trôi theo bài và theo meta) |
| "7 thực 3 vàng" | Bị bác hoàn toàn 2026-08-08 (là build của Đế chế 4) |

Tỉ lệ hỏng của nhóm claim build/meta từ phiên đó là 2/2. Các claim khác cùng phiên vì thế đáng
được đọc lại, chứ không phải được tin thêm.

Thêm một chi tiết về cách lỗi sống sót: phiên 2026-08-07 sửa "23 dân" và **cùng lúc tái khẳng
định "7 thực 3 vàng" ngay dòng bên cạnh**. Bài học: rà một dòng không có nghĩa là đã rà hàng
xóm của nó. Danh sách dưới đây cố tình liệt kê từng dòng một để tránh lặp lại đúng chuyện đó.

## Danh sách cần owner đọc lại

### A. Từ phiên 2026-07-06 (phiên đã sinh ra hai lỗi trên)

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| A1 | "cung A" = Composite Bowman, là archer ĐI BỘ | |
| A2 | "cung R" = Chariot Archer, là archer CƯỠI (kỵ cung) - khác hẳn cung A | |
| A3 | Cung A KHÔNG có xuyên giáp, KHÔNG có bonus damage vs class nào; lợi thế chỉ là giá và tầm | |
| A4 | Cung R KHÔNG khắc chế class nào; lợi thế là cơ động, đánh rồi rút | |
| A5 | Slinger ("quẩy đá") có bonus vs archer, nhưng CHỈ vs archer đi bộ, KHÔNG vs kỵ cung | |
| A6 | "Đời 3 không thành" là luật nhà có thật của cộng đồng Việt (đánh từ đời 3, bỏ thành và chòi) | |
| A7 | Xếp hạng nhịp trận cả dòng: AoE3 > AoE1 > AoE4 > AoE2 (dòng này nằm ở `aoe4-facts.md` nhưng cùng phiên duyệt) | |

### B. Bản đồ từ lóng (đầu file, không ghi ngày duyệt riêng)

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| B1 | "ngựa chém" / "ngựa" = dòng kỵ binh cận chiến: Scout → Cavalry → Heavy Cavalry → Cataphract | |
| B2 | "ngựa dò" = Scout, đơn vị kỵ khởi điểm dùng để đi dò | |
| B3 | "lạc đà" = Camel Rider (chỉ có ở Rise of Rome, đời Bronze, ra từ Stable) | |
| B4 | "kỵ cung" = Horse Archer / Heavy Horse Archer, hoặc rộng hơn là mọi archer cưỡi | |

### C. Từ phiên 2026-08-07

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| C1 | Số dân lúc lên đời KHÔNG cố định: quanh 23 dân với bài chém, quanh 26 dân với bài cung, và trôi theo meta | |

### D. Từ phiên 2026-08-08 (hôm nay, chưa qua vòng đọc lại nào)

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| D1 | Đế chế 1 có cộng đồng lớn nhất và lâu đời nhất Việt Nam trong cả dòng | |
| D2 | Cộng đồng đó đang đi xuống vì thiếu lớp kế cận, không phải vì game | |
| D3 | Đế chế 1 DE (2018) không bắt được cộng đồng Việt, dân Việt ở lại bản cũ | |
| D4 | Đế chế 2 và Đế chế 4 ở Việt Nam hiện ngang nhau, cả hai đều nhỏ hơn Đế chế 1 | |
| D5 | Theo đà hiện nay, Đế chế 4 là bản sẽ bứt lên trong hai cái tên đó | |

## Cách dùng file này

Owner điền cột cuối rồi báo lại; tôi sẽ ghi thẳng vào kho, dòng nào sai thì retract theo đúng
kiểu đã làm với "7 thực 3 vàng" (giữ lại vết, ghi rõ vì sao sai, cấm khôi phục) chứ không xóa
lặng lẽ - để lần sau có ai đọc kho còn biết dòng đó từng tồn tại và đã hỏng thế nào.
