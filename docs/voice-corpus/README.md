# Kho văn mẫu (voice corpus)

Nơi owner dán văn mẫu "chuẩn gu" để máy học giọng. Máy KHÔNG bao giờ trích đăng
các đoạn này lên site - chỉ dùng nội bộ để chưng cất `voice-guide.md`.

## Cách thêm mẫu

Mở `samples.md`, dán thêm một mục theo format:

    ## Mẫu N
    - Nguồn: <post cộng đồng Đế chế / cây bút ngoài Đế chế - ghi chung chung, không cần link>
    - Thích vì: <1 dòng, không bắt buộc>

    > Đoạn văn nguyên bản dán vào đây.
    > Giữ xuống dòng bằng nhiều dòng ">".

Sau khi thêm/sửa mẫu: chạy lại "Bước 0 - Chuẩn bị giọng văn" trong skill
write-article để sinh lại `voice-guide.md`. Không sửa tay voice-guide.md.

## Quy tắc

- 10-20 mẫu là đủ dùng; thêm dần khi gặp mẫu đắt.
- Mẫu chỉ cần là đoạn 2-6 câu có chất giọng rõ; không cần cả bài.
- Văn mẫu chỉ dùng nội bộ - không trích đăng, không chép nguyên câu vào bài.
- Thư mục này nằm trong `docs/` (gitignore) nên khi commit phải dùng `git add -f`.
