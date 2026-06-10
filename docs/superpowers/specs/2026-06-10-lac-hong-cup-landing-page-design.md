# Thiết kế: Landing page giải đấu Lạc Hồng Cup (AOE4 4vs4)

**Ngày:** 2026-06-10
**Trạng thái:** Đã chốt thiết kế, chờ viết kế hoạch triển khai

## 1. Mục tiêu

Một landing page **tĩnh, một trang (one-page scroll)** quảng bá giải đấu Age of Empires IV **"Lạc Hồng Cup"** thể thức 4vs4, do Cộng Đồng AOE IV Việt Nam tổ chức. Mục đích chính: giới thiệu thông tin giải và dẫn người chơi đăng ký qua Discord, **trước** ngày thi đấu 14/06/2026.

Phạm vi: **chỉ giai đoạn trước giải** (marketing + đăng ký). Không bao gồm lịch thi đấu trực tiếp, bảng đấu, hay kết quả.

## 2. Quyết định cốt lõi

- **Đăng ký:** chỉ là nút "Đăng ký ngay" dẫn thẳng tới Discord BTC. **Không thu thập dữ liệu, không backend, không form.**
- **Vòng đời:** chỉ phục vụ trước giải.
- **Ngôn ngữ:** tiếng Việt.
- **Phong cách thị giác:** hướng "Modern esports" — nền tối phẳng, sans-serif đậm, viền/đường kẻ gold sắc nét, nhiều khoảng trắng, dễ responsive.

## 3. Kiến trúc kỹ thuật

Tận dụng scaffold sẵn có: **Vue 3 + Vite + TypeScript + Tailwind CSS 4 + Vue Router**.

- Trang tĩnh thuần, build ra HTML/CSS/JS tĩnh; deploy được lên host tĩnh (Vercel / Netlify / GitHub Pages).
- **Một route duy nhất** `/` → `HomeView.vue`, gồm các component theo từng section.
- **Toàn bộ nội dung** đặt trong **một file dữ liệu** `src/data/tournament.ts` (giải thưởng, map pool, links, mốc thời gian, thông tin chung). Sửa thông tin không cần đụng markup.
- **Dọn dẹp scaffold thừa:**
  - Xoá `src/views/AboutView.vue`
  - Xoá `src/stores/counter.ts`
  - Xoá `src/components/__tests__/counter.spec.ts`
  - **Bỏ Pinia** (gỡ khỏi `main.ts` và `package.json`) — trang tĩnh không có state chia sẻ.
  - Giữ Vue Router với một route duy nhất.

### Cấu trúc thư mục dự kiến

```
src/
  data/tournament.ts          # nguồn sự thật duy nhất cho mọi nội dung
  composables/useCountdown.ts # logic đếm ngược
  components/
    CtaButton.vue             # nút gold dẫn Discord (dùng lại ở Hero & Footer)
    sections/
      HeroSection.vue
      QuickInfoSection.vue
      PrizeSection.vue
      FormatSection.vue
      MapPoolSection.vue
      RulesSection.vue
      CasterSection.vue
      FooterSection.vue
  views/HomeView.vue          # ghép 8 section
  assets/imgs/Lac_Hong_Cup_Banner.jpg
```

## 4. Các section (thứ tự cuộn từ trên xuống)

1. **HeroSection** — Banner Lạc Hồng Cup (ảnh nền + overlay tối), tên giải, badge "4VS4 · BO3", ngày 14/06/2026 13h30, địa điểm Net 269, **đồng hồ đếm ngược**, nút CTA "Đăng ký ngay" (→ Discord).
2. **QuickInfoSection** — dải thẻ icon tóm tắt: Game (AOE IV) · Thể thức 4vs4 · BTC ghép đội · Phí miễn phí · Net 269 (73 Ung Văn Khiêm, P. Thạnh Mỹ Tây, TP.HCM).
3. **PrizeSection** — bục vinh danh Top 3 + bảng đủ 6 hạng. Tổng giải thưởng 3.000.000đ:
   - 🥇 Vô địch: 1.000.000đ + cúp
   - 🥈 Hạng nhì: 700.000đ
   - 🥉 Hạng ba: 500.000đ
   - Hạng 4: 360.000đ · Hạng 5: 240.000đ · Hạng 6: 200.000đ
4. **FormatSection** — Thể thức 4vs4 có ban/pick, BO3 loại trực tiếp. Nút mở link ban/pick (`https://aoe2cm.net/preset/QHani`).
5. **MapPoolSection** — lưới 9 bản đồ: Dry Arabia, Lipany, Gorge, MegaRandom, Rocky River, Holy Island, Forts, West Lake, Sunkenland. Nút mở link map pool (`https://aoe2cm.net/preset/MivJN`).
6. **RulesSection** — Luật cơ bản (không hack/cheat), hạn đăng ký (1 tuần trước giải), lưu ý cam kết tuân thủ luật & tôn trọng quyết định BTC.
7. **CasterSection** — giới thiệu kênh caster/bình luận YouTube `https://www.youtube.com/@clearmanaoe4`.
8. **FooterSection** — nhắc lại CTA Discord, liên hệ BTC (`https://discord.gg/Tzc8rnRk`), logo AOE4VN, bản quyền.

## 5. Hành vi động

- **Countdown** (`useCountdown.ts`): đếm ngược tới **14/06/2026 13:30 giờ Việt Nam (UTC+7)**. Khi đã qua mốc → hiển thị "Giải đấu đang diễn ra" (không còn số đếm ngược).
- Mọi link ngoài (Discord, aoe2cm ban/pick, aoe2cm map pool, YouTube) mở **tab mới** với `target="_blank" rel="noopener noreferrer"`.

## 6. Phong cách thị giác

- **Màu:** nền `#0c0b09`, bề mặt thẻ `#1a1814`, accent gold `#e7b955` / `#c79a4b`, chữ kem `#f5ecd8`, phụ `#9c948a`, điểm nhấn đỏ rượu `#7a1f1f`.
- **Font:** Be Vietnam Pro (Google Fonts, hỗ trợ tiếng Việt) — heading 800/900, body 400/600. Số countdown & tiền thưởng dùng weight đậm màu gold.
- **Đặc trưng:** nền phẳng, đường kẻ/viền gold ngăn section, nút bo góc nhỏ, nhiều khoảng trắng, hover tinh tế. Logo AOE4VN + biểu tượng AOE IV ở Hero/Footer.
- Banner dùng làm ảnh nền Hero kèm overlay tối để chữ nổi.

## 7. Responsive & accessibility

- **Mobile-first**, dùng breakpoint Tailwind. Bục giải thưởng & lưới map xếp dọc trên mobile, dàn ngang trên desktop.
- Ảnh có `alt`; link có trạng thái focus rõ; tương phản màu đủ đọc.
- Tối ưu ảnh banner để load nhanh.

## 8. Kiểm thử

- **Unit test (Vitest):**
  - `useCountdown` — tính đúng số ngày/giờ/phút/giây còn lại với mốc thời gian cho trước; chuyển trạng thái "đang diễn ra" khi đã qua mốc.
  - Render section đọc đúng dữ liệu từ `tournament.ts`: đủ 6 hạng giải thưởng với số tiền đúng, đủ 9 map, các link đúng URL.
- **Thủ công:** kiểm tra responsive mobile/desktop, các link mở đúng tab mới.
- `npm run build`, `npm run type-check`, `npm run lint:check` xanh.

## 9. Ngoài phạm vi (YAGNI)

- Không backend, không form đăng ký, không database.
- Không lịch thi đấu trực tiếp, bảng đấu (bracket), kết quả.
- Không đa ngôn ngữ, không chế độ sáng/tối (chỉ tối).
- Không CMS — nội dung sửa trực tiếp trong `tournament.ts`.
