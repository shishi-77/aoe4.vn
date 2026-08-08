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

## Danh sách cần owner đọc lại - ĐÃ XONG 2026-08-08

Owner trả lời từng dòng một, hỏi theo dạng lựa chọn. Kết quả: **14 giữ nguyên, 1 retract,
2 sửa cách ghi**. Toàn bộ đã ghi vào kho.

### A. Từ phiên 2026-07-06 (phiên đã sinh ra hai lỗi trên)

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| A1 | "cung A" = Composite Bowman, là archer ĐI BỘ | ✅ Đúng, giữ nguyên |
| A2 | "cung R" = Chariot Archer, là archer CƯỠI (kỵ cung) - khác hẳn cung A | ✅ Đúng, giữ nguyên |
| A3 | Cung A KHÔNG có xuyên giáp, KHÔNG có bonus damage vs class nào; lợi thế chỉ là giá và tầm | ✅ Đúng, giữ nguyên |
| A4 | Cung R KHÔNG khắc chế class nào; lợi thế là cơ động, đánh rồi rút | ✅ Đúng, giữ nguyên |
| A5 | Slinger ("quẩy đá") có bonus vs archer, nhưng CHỈ vs archer đi bộ, KHÔNG vs kỵ cung | ❌ **SAI - quẩy đá khắc tất cả loại cung, kể cả kỵ cung.** Đã retract có để vết. Nguồn heavengames chỉ ghi "+2 attack vs. archers", không hề tách cung bộ với kỵ cung - tức vế giới hạn là phần owner-only đắp thêm lên một dòng vốn có nguồn |
| A6 | "Đời 3 không thành" là luật nhà có thật của cộng đồng Việt (đánh từ đời 3, bỏ thành và chòi) | ✅ Đúng, giữ nguyên |
| A7 | Xếp hạng nhịp trận cả dòng: AoE3 > AoE1 > AoE4 > AoE2 (dòng này nằm ở `aoe4-facts.md` nhưng cùng phiên duyệt) | ⚠️ Thứ tự đúng, nhưng gọi là **tốc độ (speed setting)** chứ không phải "nhịp trận". Trùng đúng chỗ owner đã sửa sáng cùng ngày, nay chốt lại cả ở câu mở đầu mục |

### B. Bản đồ từ lóng (đầu file, không ghi ngày duyệt riêng)

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| B1 | "ngựa chém" / "ngựa" = dòng kỵ binh cận chiến: Scout → Cavalry → Heavy Cavalry → Cataphract | ✅ Đúng, giữ nguyên |
| B2 | "ngựa dò" = Scout, đơn vị kỵ khởi điểm dùng để đi dò | ✅ Đúng, giữ nguyên |
| B3 | "lạc đà" = Camel Rider (chỉ có ở Rise of Rome, đời Bronze, ra từ Stable) | ⚠️ Sửa cách ghi. Owner vặn "chỉ có ở Rise of Rome là sao, bản nào chả có" - vặn đúng, vì từ RoR trở đi bản nào cũng có. Owner cho rằng lạc đà có từ bản đầu và RoR chỉ thêm Palmyran; Wikipedia ghi RoR thêm **cả năm** đơn vị (slinger, camel rider, scythe chariot, armored elephant, fire galley) lẫn bốn civ (Rome, Carthage, Palmyra, Macedonia). Owner chốt: ghi theo nguồn, kèm URL |
| B4 | "kỵ cung" = Horse Archer / Heavy Horse Archer, hoặc rộng hơn là mọi archer cưỡi | ✅ Đúng, giữ nguyên |

### C. Từ phiên 2026-08-07

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| C1 | Số dân lúc lên đời KHÔNG cố định: quanh 23 dân với bài chém, quanh 26 dân với bài cung, và trôi theo meta | ✅ Đúng, giữ nguyên |

### D. Từ phiên 2026-08-08 (hôm nay, chưa qua vòng đọc lại nào)

| # | Claim đang ghi trong kho | Đúng / Sai / Cần sửa |
| --- | --- | --- |
| D1 | Đế chế 1 có cộng đồng lớn nhất và lâu đời nhất Việt Nam trong cả dòng | ✅ Đúng, giữ nguyên |
| D2 | Cộng đồng đó đang đi xuống vì thiếu lớp kế cận, không phải vì game | ✅ Đúng, giữ nguyên |
| D3 | Đế chế 1 DE (2018) không bắt được cộng đồng Việt, dân Việt ở lại bản cũ | ✅ Đúng, giữ nguyên |
| D4 | Đế chế 2 và Đế chế 4 ở Việt Nam hiện ngang nhau, cả hai đều nhỏ hơn Đế chế 1 | ✅ Đúng, giữ nguyên |
| D5 | Theo đà hiện nay, Đế chế 4 là bản sẽ bứt lên trong hai cái tên đó | ✅ Đúng, giữ nguyên |

## Bài học rút ra từ chính vòng rà này

1. **Tỉ lệ hỏng thật của phiên 2026-07-06 là 3/7**, không phải 2/2 như phần đầu file dự đoán -
   thêm A5. Cả ba lỗi đều là claim về CƠ CHẾ (build, bonus damage), còn claim về TỪ LÓNG và về
   CỘNG ĐỒNG thì đúng hết 9/9. Đó là ranh giới đáng nhớ: owner là nguồn không thể thay thế cho
   tiếng lóng và cho chuyện cộng đồng Việt, nhưng với số liệu cơ chế thì lời owner cần nguồn
   chống lưng y như mọi dòng khác.
2. **Hai lỗi lộ ra được là nhờ đối chiếu nguồn ngay trong lúc hỏi, không phải nhờ hỏi.** A5 owner
   tự bác, nhưng B3 thì owner trả lời sai và chỉ vỡ ra khi tra Wikipedia giữa chừng. Nếu vòng rà
   này chỉ ghi lại lời owner thì B3 đã thành một dòng sai mới, đúng kiểu "7 thực 3 vàng" tập hai.
   Vòng rà sau phải giữ nguyên thói quen tra nguồn cho mọi claim cơ chế, kể cả khi owner khẳng
   định chắc.
3. **Dòng có nguồn vẫn có thể bị đắp thêm một vế không nguồn.** A5 là một câu sourced ("+2 vs
   archers") bị nối thêm một mệnh đề owner-only thu hẹp phạm vi. Lần quét tới nên soi riêng loại
   này: câu có URL nhưng mang thêm vế mà URL đó không nói.
