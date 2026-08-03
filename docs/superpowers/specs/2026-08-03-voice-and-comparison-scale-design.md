# Thiết kế: Móng giọng văn + bài so sánh + tăng tốc tự động

> Ngày: 2026-08-03 · Phạm vi: sửa tận gốc chất lượng văn phong, mở rộng chủ đề sang AoE2/AoE3/StarCraft bằng bài so sánh, đẩy pipeline lên nhịp 2-3 bài/tuần chạy theo lịch · Tác giả: solo dev
> Kế thừa: spec 2026-08-02 (content automation - queue, /write-article, /propose-topics, guide-evaluator v3, evaluator-calibrate). Spec này KHÔNG thay thế spec đó - nó vá điểm yếu giọng văn và nới phạm vi chủ đề.

## 1. Vấn đề & mục tiêu

Hiện trạng sau khi pipeline 2026-08-02 lên main:

- Bài PASS evaluator nhưng owner đọc vẫn thấy đơ, văn AI - judge dễ tính hơn gu owner.
- Bài sạch câu chữ nhưng nhạt, vô hồn, không có chất giọng người thật.
- Số bài quá ít (10 guide + 1 news), queue rỗng, chưa có nhịp ra bài.
- Chủ đề bó trong AoE4/AoE1, chưa chạm cộng đồng AoE2, AoE3, StarCraft.

Mục tiêu (theo thứ tự, cái trước là điều kiện của cái sau):

1. **Móng giọng văn:** dạy máy viết bằng văn mẫu thật (không tả giọng bằng rubric tự chế nữa), nâng chuẩn judge lên đúng gu owner. Có cổng kiểm chứng blind test trước khi scale.
2. **Mở rộng chủ đề:** kind bài mới `comparison` - bài so sánh làm cầu nối kéo dân AoE2/AoE3/StarCraft khám phá AoE4. Facts truy vết về nguồn chính thức nên không cần cổng owner.
3. **Tăng tốc:** scheduled cloud agent viết + mở PR theo lịch, nhịp 2-3 bài/tuần. Việc duy nhất của owner là đọc lướt và merge.

**Quyết định của owner (đã chốt trong phiên brainstorm):**

- Văn mẫu lấy từ: post/comment hay của cộng đồng Đế chế + cây bút tiếng Việt ngoài Đế chế. Owner tự paste vào repo, máy chưng cất.
- Facts AoE2/AoE3/StarCraft: nguồn chính thức (wiki, Liquipedia, patch notes) là đủ, không cần insider VN. Riêng AoE1/meta VN giữ luật cũ (kho facts).
- Vai trò game khác trên site: chỉ bài so sánh hướng về AoE4, không viết guide thuần AoE2/AoE3/SC.
- Mức tự động: máy viết + mở PR, owner merge. KHÔNG auto-merge.
- Nhịp mục tiêu: 2-3 bài/tuần.

**Ngoài phạm vi:** auto-merge, guide thuần cho game khác, tự đăng bài lên FB/Discord, thay đổi website (routes, components) - bài comparison dùng nguyên hạ tầng /guides sẵn có.

## 2. Giai đoạn 1 - Móng giọng văn

### 2.1 Kho văn mẫu `docs/voice-corpus/`

- `samples.md`: owner paste văn mẫu, mỗi mẫu một mục theo format:
  - Nguồn (post cộng đồng / cây bút ngoài Đế chế - ghi chung chung, không cần link)
  - Đoạn văn nguyên bản
  - (Không bắt buộc) 1 dòng owner ghi "thích vì gì"
- Máy dựng sẵn file khung + `README.md` hướng dẫn format; owner chỉ việc dán (~30 phút lần đầu, 10-20 mẫu; bổ sung dần).
- **Văn mẫu chỉ dùng nội bộ để học giọng - TUYỆT ĐỐI không trích đăng lên site** (tránh vấn đề bản quyền/đạo văn). Bài viết ra phải là văn mới cùng chất giọng, không phải văn ghép từ mẫu.

### 2.2 Chưng cất: `docs/voice-corpus/voice-guide.md` (file sinh tự động)

Máy phân tích samples và sinh:

- Đặc điểm giọng: nhịp câu, độ dài câu, từ vựng dân Đế chế, cách vào bài, cách chốt, cách nêu quan điểm - mỗi đặc điểm kèm trích dẫn thật từ corpus làm ví dụ.
- Bộ few-shot: 5-8 đoạn đắt nhất, gắn nhãn ngữ cảnh dùng (mở bài / giải thích cơ chế / chốt hạ / nêu quan điểm).
- File này sinh lại mỗi khi corpus đổi, không sửa tay. Quy trình chưng cất ghi thẳng vào skill write-article (bước chuẩn bị), không tạo skill riêng.

### 2.3 Nâng cấp writer (skill write-article, Bước 3)

- Trước khi viết: BẮT BUỘC đọc `voice-guide.md` + few-shot, viết theo giọng đó ngay từ nháp đầu - không viết chay rồi để evaluator vá.
- Luật chống công thức: trước khi viết, liếc mở bài + chốt bài của 3 bài gần nhất trên site; không được lặp lại khuôn của chúng.

### 2.4 Nâng cấp evaluator (guide-evaluator, chiều voice)

- Mỏ neo voice ~8 trong prompt ghim (hiện là câu tự chế) thay bằng trích đoạn thật từ corpus - judge đối chiếu với văn thật, chuẩn tự khắt lên đúng gu owner.
- Các bài hiện tại PASS-nhưng-owner-chê được gắn nhãn FAIL vào golden set của evaluator-calibrate (kèm lý do "voice đơ/nhạt theo gu owner") - từ giờ calibration bắt được kiểu lệch "judge dễ tính hơn owner".
- Sau khi đổi mỏ neo: chạy lại evaluator-calibrate, xác nhận không vỡ các fixture cũ.

### 2.5 Cổng kiểm chứng (bắt buộc qua mới sang giai đoạn 2)

1. Polish lại 2-3 bài cũ (chọn bài owner chê nhất) bằng writer + evaluator mới.
2. Owner đọc mù: bản cũ/mới trộn ngẫu nhiên, không đánh dấu bản nào là bản nào.
3. Owner chọn bản mới ≥ 2/3 bài → móng đạt, sang giai đoạn 2.
4. Không đạt → chỉnh corpus/voice-guide, lặp lại. KHÔNG bật scale khi chưa qua cổng.

## 3. Giai đoạn 2 - Bài so sánh + tăng tốc

### 3.1 Kind mới `comparison`

- Nằm trong `src/data/guides/` như kind thứ ba: `utility` | `strategy` | `comparison`.
- Sàn chấm như strategy: structure 7, voice 7, conversion 6 (bài cầu nối sống chết ở giọng văn). Bổ sung `floorsForKind('comparison')` trong `@/lib/guideVerdict` + unit test.
- Data file có thêm `sources[]` (như news) - mỗi claim truy vết được về URL.

**Luật facts phân tầng theo game:**

| Claim về | Yêu cầu |
| --- | --- |
| AoE1 / meta VN | Phải nằm trong kho `aoe1-facts.md` (wiki thế giới không biết luật đời 3 không thành - giữ nguyên luật cũ) |
| AoE4 | Kho `aoe4-facts.md` HOẶC URL nguồn chính thức |
| AoE2 / AoE3 / StarCraft | URL nguồn chính thức (wiki game, Liquipedia, patch notes); evaluator WebFetch xác minh trực tiếp như news mode |

- Mọi claim có nguồn/kho → không cần cổng owner duyệt facts → viết headless được ngay. Claim AoE1 ngoài kho → rơi về `facts-pending` chờ owner như guide thường.

**Mở rộng cổng tôn trọng:** luật cứng "không dìm AoE1" mở rộng thành "không dìm bất kỳ game/cộng đồng RTS nào" (AoE1, AoE2, AoE3, StarCraft...). Người đọc bài so sánh chính là dân game đó; chê game của họ là tự đuổi khách. So sánh làm rõ khác biệt thì được; phán game nào dở hơn/nhàm/lỗi thời → FAIL cứng, cùng cơ chế với cổng AoE1 hiện tại (đổi tên `aoe1Disparagement` thành khái niệm chung, giữ tương thích scorecard).

### 3.2 Seed đề tài so sánh

- Một phiên làm việc có owner: máy đề xuất ~15 đề tài so sánh (ví dụ: "Chơi AoE2 lâu năm thì AoE4 khác gì", "Tư duy StarCraft áp vào AoE4 được không", "Dân AoE3 sang AoE4 mất gì được gì"...), owner gật/lắc từng cái.
- Đề tài được gật vào `content-queue.json` với `kind: comparison`, `source: manual`.
- Về sau khi Search Console có data từ queries AoE2/AoE3/SC, `/propose-topics` mở rộng logic tìm cơ hội sang nhóm query so sánh (việc của kỳ chạy propose-topics hàng tháng, không làm bây giờ).

### 3.3 Scheduled agent (nhịp 2-3 bài/tuần)

- Cloud routine (skill schedule) chạy theo lịch, ví dụ sáng T2-T4-T6.
- Mỗi lần chạy: đọc queue → chọn item ĐỦ ĐIỀU KIỆN HEADLESS đầu tiên → chạy write-article trọn gói (facts sheet → viết → chấm tối đa 3 vòng → PR) → dừng.
- Đủ điều kiện headless = một trong:
  - `comparison` / `news`: mọi claim có nguồn hoặc trong kho (không có claim AoE1 ngoài kho)
  - `guide`: 100% facts từ kho đã xác minh (cơ chế sẵn có từ spec 2026-08-02)
- Item không đủ điều kiện (guide đụng meta VN chưa có trong kho) → agent bỏ qua, item đi đường cũ chờ phiên có owner.
- Queue cạn hoặc không item nào đủ điều kiện → agent báo (không viết bừa) và dừng.
- Owner: đọc lướt PR + merge. Không auto-merge ở bất kỳ trường hợp nào.

## 4. Xử lý lỗi

Giữ nguyên nguyên tắc spec 2026-08-02: máy không bao giờ tự ship thứ đáng ngờ.

| Tình huống | Hành vi |
| --- | --- |
| FAIL evaluator 3 vòng | `parked` + scorecard + PR draft, không ship |
| Nguồn chết / claim không xác minh được | Claim vào `unverifiableClaims`, ghi rõ trong PR body để owner liếc trước khi merge (owner là chốt chặn cuối, không cần gate cứng mới) |
| Có câu dìm game/cộng đồng RTS khác | FAIL cứng (cùng cơ chế cổng AoE1) |
| Claim AoE1 ngoài kho trong bài comparison | Item rơi về `facts-pending`, agent headless bỏ qua |
| Queue cạn | Agent báo nhắc seed thêm, dừng |
| lint / type-check / test đỏ | Không mở PR |

## 5. Kiểm thử

- Unit test `floorsForKind('comparison')` + test registry guides (pattern sẵn có).
- Chạy lại evaluator-calibrate sau khi đổi mỏ neo voice và thêm fixture golden mới - xác nhận judge mới bắt được bài PASS-nhưng-đơ và không vỡ fixture cũ.
- Cổng blind test (mục 2.5) là kiểm thử chính của toàn giai đoạn 1.
- Dry-run scheduled agent một lần ở chế độ có owner xem, trước khi thả chạy theo lịch.
- Trước mỗi PR: `npm run lint:check && npm run type-check && npm run test:run` (convention repo).

## 6. Tiêu chí thành công

- Cổng blind test: owner chọn bản mới ≥ 2/3 bài.
- Scheduled agent giữ nhịp 2-3 PR/tuần; tháng đầu sau khi bật: ≥ 10 bài so sánh lên site.
- Search Console bắt đầu có impressions từ queries chứa AoE2/AoE3/StarCraft.
- Tổng việc tay của owner ≤ ~15 phút/tuần (merge PR + gật/lắc đề tài mới).

## 7. Thứ tự triển khai đề xuất

1. Dựng khung `docs/voice-corpus/` → owner paste văn mẫu (việc owner, ~30 phút).
2. Chưng cất voice-guide + nâng cấp write-article + đổi mỏ neo evaluator + thêm fixture golden → chạy lại calibration.
3. Polish 2-3 bài cũ → blind test với owner. Qua cổng mới đi tiếp.
4. Kind `comparison`: floors + luật facts phân tầng + mở rộng cổng tôn trọng trong evaluator + write-article.
5. Seed ~15 đề tài so sánh với owner.
6. Dry-run 1 bài comparison đầu tay trong phiên có owner → chỉnh nếu cần.
7. Bật scheduled agent lịch T2-T4-T6 → theo dõi 2 tuần đầu qua PR.
