# Dry run sàn mới - 13 bài còn lại (2026-08-08)

Chấm khô, KHÔNG sửa bài nào. Mục đích: lấy bản đồ điểm hiện tại để xếp thứ tự việc.

**Giao thức của vòng này: median-of-3, không chạy fact-check, không chạy cổng chống thụt lùi.**
Cổng thật là median-of-5 + fact-check + head-to-head. Dùng số ở đây để CHỌN VIỆC, không dùng
để kết luận một bài đạt hay không đạt. Bài nào nằm đúng biên phải chấm lại đủ 5 judge trước
khi động vào.

Cổng vệ sinh tất định (`scripts/seo-audit.ts`): **14/14 bài sạch, 0 finding.** Không bài nào
bị loại ở Bước 1, nên toàn bộ khoảng cách dưới đây là khoảng cách chất lượng văn.

## Bảng điểm

Sàn: `strategy`/`comparison` = 8/7/7, `utility`/`news` = 8/6/4.

| # | Bài | kind | str | voice | conv | Thiếu | Verdict |
|---|---|---|:---:|:---:|:---:|---|---|
| 1 | game-rts-nao-de-bat-dau-2026 | comparison | 8 | 8 | 8 | - | **PASS** |
| 2 | aoe4-vs-aoe2-khac-biet-cot-loi | comparison | 8 | 7 | 8 | - | **PASS** |
| 3 | de-che-co-nhung-ban-nao | utility | 8 | 6 | 8 | - | **PASS** |
| 4 | ra-mat-chuyen-muc-tin-tuc | news | 7 | 6 | 8 | str -1 | FAIL |
| 5 | aoe4-khac-de-che-the-nao | comparison | 8 | 6 | 8 | voice -1 | FAIL |
| 6 | build-order-co-ban-aoe4 | strategy | 8 | 6 | 7 | voice -1 | FAIL |
| 7 | tuong-thanh-phong-thu-aoe4 | strategy | 8 | 6 | 8 | voice -1 | FAIL |
| 8 | cach-tai-aoe4 | utility | 7 | 5 | 6 | str -1, voice -1 | FAIL |
| 9 | cau-hinh-may-aoe4 | utility | 7 | 5 | 6 | str -1, voice -1 | FAIL |
| 10 | tim-nguoi-viet-choi-aoe4 | utility | 7 | 5 | 6 | str -1, voice -1 | FAIL |
| 11 | cac-che-do-choi-aoe4 | strategy | 7 | 5 | 7 | str -1, voice -2 | FAIL |
| 12 | huong-dan-aoe4-nguoi-moi | strategy | 8 | 5 | 6 | voice -2, conv -1 | FAIL |
| 13 | cac-nen-van-minh-aoe4 | strategy | 6 | 4 | 5 | str -2, voice -3, conv -2 | FAIL |

3 PASS, 10 FAIL. Không bài nào trượt vì mâu thuẫn sự thật hay dìm game (vòng này chưa chạy
fact-check, nhưng cũng không judge nào nêu cờ đỏ nội dung).

## Ba nhóm việc, theo chi phí thật

### Nhóm A - sửa một chỗ là qua (4 bài)

Bài #4 rẻ nhất trong tất cả: chỉ hụt structure 1 điểm, và cả 3 judge chỉ đúng một việc là tách
đoạn cuối làm hai (phần "đăng ở đâu" và phần rủ vào nhóm đang dính chung một khối).

Bài #5, #6, #7 đều chỉ hụt voice 1 điểm, và đều hụt vì cùng một kiểu câu: câu thuyết minh
phẳng ("Bài viết này sẽ đi qua từng khác biệt một", "Đây là sân tập an toàn để...",
"Nói tóm lại, ..."). Đây đúng loại lỗi mà một vòng sửa có định hướng xử lý được.

### Nhóm B - ba bài utility, cùng một cặp lỗi (3 bài: #8, #9, #10)

Cả ba hụt y hệt nhau: structure 7 và voice 5. Và judge chỉ ra cùng hai nguyên nhân:

1. **Quy trình theo thứ tự nhưng không đánh số.** Cả ba bài đều có đoạn dạng "làm cái này, rồi
   cái kia" mà viết thành mấy đoạn văn rời. Judge của cả `cach-tai`, `cau-hinh-may` lẫn
   `tim-nguoi-viet` đều đề nghị đánh số Bước 1/2/3. Sửa cơ học, gần như không đụng văn.
2. **Câu kiểu bảng thông số.** "Cách này không tốn phí mua game khi gói còn hiệu lực." /
   "Đây là sân tập an toàn để thử build order." Thiếu đúng một vế lý do là thành giọng cẩm nang.

Nên làm cả ba trong một lượt vì cùng công thức sửa, không phải nghĩ lại từ đầu cho từng bài.

### Nhóm C - phải viết lại, không chắp vá (3 bài: #11, #12, #13)

`cac-nen-van-minh-aoe4` (#13) là bài tệ nhất trong kho: 6/4/5, hụt cả ba chiều. Judge mô tả nó
là chuỗi câu cụt kiểu ghi chú ("Chọn phe là chọn luôn lối đánh.", "Mới vào thì chọn phe đánh
thẳng, dễ cầm, để lo học nền đã."), và bài liệt kê phe mà không có tên phe cụ thể theo nhóm.
Đây là ca giống hệt `cung-r-ngua-chem-aoe4`: sửa từng câu sẽ không tới đâu.

## Một phát hiện ngoài điểm số: hai bài có thể đang sai `kind`

`cac-che-do-choi-aoe4` (#11) và `cac-nen-van-minh-aoe4` (#13) đều khai `kind: 'strategy'` nên
đang chịu sàn voice 7. Nhưng cả hai đọc như bài tra cứu: một bài liệt kê sáu chế độ chơi, một
bài liệt kê bảng phe. Judge của cả hai đều tự động góp ý theo hướng tra cứu (tách mỗi mục một
đoạn để người đọc quét tìm, thêm đoạn mở định vị).

Nếu đổi sang `utility` (sàn 8/6/4) thì:
- #11 `cac-che-do-choi`: 7/5/7 vs 8/6/4 - vẫn FAIL nhưng chỉ còn hụt str 1, voice 1, tức rơi
  từ nhóm C xuống nhóm B.
- #13 `cac-nen-van-minh`: 6/4/5 vs 8/6/4 - vẫn FAIL, vẫn phải viết lại.

Đây là quyết định của owner, không phải thứ tôi tự đổi: `kind` quyết định bài được ép giọng
cộng đồng tới đâu, và đó là chuyện chủ ý biên tập.

## KẾT QUẢ NHÓM A (làm ngay sau dry run, 2026-08-08)

Chấm lại bằng giao thức thật: median-of-5 + fact-check + cổng chống thụt lùi.

| Bài | str | voice | conv | Fact-check | Thụt lùi | Trạng thái |
|---|:---:|:---:|:---:|---|---|---|
| build-order-co-ban-aoe4 | 8 | 7 | 7 | sạch | new | **PASS** |
| aoe4-khac-de-che-the-nao | 8 | 7 | 8 | sạch sau 3 vòng sửa | new | **PASS** |
| tuong-thanh-phong-thu-aoe4 | 8 | 7 | 8 | sạch sau 2 vòng sửa | new | **PASS** |
| ra-mat-chuyen-muc-tin-tuc | 7 | 6 | 7 | 1 mâu thuẫn có sẵn trên main | tie | **FAIL, đã hoàn nguyên** |

Ba bài PASS đã đóng đủ cổng: hygiene tất định, median-of-5, fact-check, chống thụt lùi.
`aoe4-khac-de-che-the-nao` được chấm lại lần cuối sau mọi lần sửa: 5/5 judge cùng cho 8/7/8.

### Vì sao bài tin bị loại khỏi đợt này

Dry run xếp nó vào nhóm rẻ nhất, nhưng vòng thật cho thấy ngược lại:

1. Bản sửa đầu **thua cổng chống thụt lùi** (winner: old). Judge nói tôi nống câu bằng
   "Sở dĩ... là bởi" đúng chỗ không cần, làm loãng nhịp bản tin.
2. Bản sửa đó còn **tự mâu thuẫn**: "bài lên ở đây trước, sau đó chia sẻ sang nhóm" rồi lại
   "vào nhóm thì nhận tin sớm hơn một nhịp".
3. Hoàn nguyên về `main` + tách đoạn (đúng thứ dry run chỉ ra) thì **structure vẫn 7**, voice
   rơi về 6. Tách đoạn không đủ kéo lên 8.
4. Bản trên `main` còn một mâu thuẫn logic **có sẵn**: "đăng tại đây VÀ chia sẻ trong nhóm" đứng
   cạnh "vào nhóm để nhận tin sớm". Nếu nhóm là kênh phái sinh thì không thể sớm hơn.

Kết luận: bài này cần viết lại phần thân, không phải tách đoạn. Đã hoàn nguyên file về `main`
để đợt này chỉ chứa việc đã qua cổng. Facts sheet vừa lập thì giữ lại, vì nó cần cho mọi vòng sau.

### Ba lỗi fact-check bắt được mà dry run bỏ sót

Dry run không chạy fact-check, nên cả ba lỗi này chỉ lộ ra ở vòng thật.

1. **`kèo "đời 3 không thành"` ở HAI bài** (`aoe4-khac-de-che-the-nao`, `tuong-thanh-phong-thu-aoe4`).
   Đây đúng lỗi owner đã bắt một lần trong draft `de-che-co-nhung-ban-nao` và đã ghi thành luật
   trong `aoe1-facts.md`: **luật** là luật chơi cộng đồng chốt (đời 3 không thành), **kèo** là
   thể thức trận (chạm 3, solo random). Cả hai bài đều tự mâu thuẫn với chính mình, vì chỗ khác
   trong cùng bài lại gọi đúng là "luật". Đã sửa cả hai.

2. **Câu dìm ranh giới ở `tuong-thanh`**: cặp câu "chẳng ai phải giao kèo cấm nhau" + "Đế chế 4
   **dám** để xây thành thoải mái **mà trận đấu vẫn cân**" tạo hàm ý rằng Đế chế 1 phải cấm thành
   vì game không tự cân được. Luật đời 3 là lựa chọn thi đấu của cộng đồng lớn nhất Việt Nam,
   không phải miếng vá cho lỗi thiết kế. Đã viết lại thành mô tả song song.

3. **Bài tin thụt lùi (winner: old)**: bản sửa của tôi nống câu bằng "Sở dĩ... là bởi" đúng chỗ
   không cần, làm loãng nhịp bản tin, VÀ tự mâu thuẫn ("bài lên ở đây trước, sau đó chia sẻ sang
   nhóm" rồi lại "vào nhóm thì nhận tin sớm hơn một nhịp"). Đã hoàn nguyên nguyên văn về bản
   `main`, chỉ giữ đúng thứ dry run chỉ ra là cần: tách đoạn cuối làm hai.

### Hai việc chờ owner

**a) `aoe4-khac-de-che-the-nao` thiếu facts sheet.** Skill quy định bài `kind: comparison` không
có `docs/facts-review/<slug>.md` là FAIL hygiene. Bài này không có. Đáng chú ý hơn:
`scripts/score-guide-seo.ts` **không biết luật đó** và vẫn trả `hygiene.pass: true`. Cổng facts
sheet hiện chỉ sống trong văn bản skill, tức là phụ thuộc vào việc người chấm nhớ ra. Nên đưa
vào script.

**b) Hai kho facts đá nhau về tài nguyên đá của Đế chế 4.** `aoe2-facts.md` viết thẳng
"AoE4 has no stone", trong khi `aoe4-facts.md` có hẳn mục Fortifications nói về Stone Walls.
File nghi sai là `aoe2-facts.md`, vốn ghi "Reviewed by: NOBODY YET". Đây đúng dạng blind spot mà
`aoe1-facts.md` tự cảnh báo: một dòng sai nằm trong kho thì tự khớp với chính nó, đối chiếu bài
bao nhiêu vòng cũng không bắt ra. **Không sửa bài theo dòng này cho tới khi owner chốt.**

Kèm theo: 11/13 mục `claimsToVerify` của `tuong-thanh` rơi vào đúng một dòng ⚠️ có sẵn của
`aoe4-facts.md` (mốc đời của tường/Keep/ram/Mangonel/Trebuchet/pháo, và "đuốc kỵ mạnh nhất").
Một lượt hỏi owner đóng được gần hết danh sách đó.

## Đề xuất thứ tự

1. Nhóm A (4 bài) - rẻ nhất, ra kết quả nhanh nhất.
2. Chốt `kind` cho #11 và #13 trước khi động vào chúng.
3. Nhóm B (3 bài utility) - làm một lượt, cùng công thức.
4. Nhóm C - viết lại, mỗi bài một phiên riêng như đã làm với `cung-r-ngua-chem-aoe4`.
