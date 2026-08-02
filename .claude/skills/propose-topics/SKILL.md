---
name: propose-topics
description: Use monthly, or whenever the owner drops a fresh Search Console CSV into docs/search-console/, to propose new article topics for aoe4.vn. Parses the Queries CSV, finds gap and page-2 opportunities against existing guides+news, curates with the owner, and appends approved topics to src/data/content-queue.json via a small PR. Requires an owner in the session - do not run headless.
---

# Propose Topics (M1 - chọn đề tài theo dữ liệu Search Console)

Đề xuất đề tài mới cho hàng đợi `src/data/content-queue.json` từ dữ liệu Search Console.
Skill này CẦN owner trong phiên để gật/lắc từng đề tài - không chạy headless.

## Đầu vào

File CSV owner export tay từ Search Console (Performance -> Queries -> Export), bỏ vào
`docs/search-console/` (thư mục local, gitignore). Nếu chưa có file hoặc file cũ hơn 60
ngày, script sẽ từ chối - nhắc owner export mới rồi dừng.

## Các bước

1. Tìm file CSV mới nhất trong `docs/search-console/` (theo mtime). Chạy:
   `npx vite-node scripts/propose-topics.ts docs/search-console/<file>.csv`
   Script in JSON `{gaps, page2}` đã xếp theo impressions giảm dần.
2. Đọc `src/data/content-queue.json`. LOẠI các cơ hội đã có trong queue (kể cả trạng thái
   `rejected` - owner đã lắc thì không hỏi lại) bằng cách so query/targetKeyword.
3. Chọn tối đa 5 ứng viên tốt nhất. Với mỗi ứng viên soạn: slug đề xuất (không dấu, dạng
   `-aoe4` nếu hợp), targetKeyword (query gốc), kind (`guide` cho chủ đề evergreen, `news`
   cho chủ đề thời sự patch/giải/DLC), và 1 câu lý do (impressions, position, gap hay page-2).
   Với `page-2` kèm `coveredBy`: đề xuất CẢI THIỆN bài đó (ghi vào notes) thay vì bài mới.
4. Hỏi owner từng ứng viên (AskUserQuestion, mỗi lần 1 câu): nhận / sửa / bỏ.
5. Với các đề tài owner nhận: thêm vào `src/data/content-queue.json` với `status: "proposed"`,
   `evidence.source: "search-console"`, `createdAt`/`updatedAt` = hôm nay (YYYY-MM-DD).
   Giữ JSON xếp theo createdAt tăng dần. Chạy test hàng đợi:
   `npm run test:run -- src/lib/__tests__/contentQueue.spec.ts`
6. Tạo branch `claude/queue-<YYYY-MM>`, commit `chore(queue): propose topics <YYYY-MM>`,
   mở PR (gh với account collaborator - xem lưu ý bên dưới). Owner merge = đề tài vào hàng đợi.

## Lưu ý

- KHÔNG tự viết bài trong skill này - chỉ quản lý hàng đợi. Viết bài là việc của
  skill write-article.
- Đề tài từ ý owner (không qua Search Console): thêm tay với `evidence.source: "manual"`,
  impressions/position ghi 0.
- `gh pr create` cần account có quyền trên repo (`gh auth switch --user shishi-77`
  trước, switch về account cũ sau).
