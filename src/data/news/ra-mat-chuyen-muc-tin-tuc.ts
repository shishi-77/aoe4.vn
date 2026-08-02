import type { NewsPost } from './index'

export const newsLaunchPost: NewsPost = {
  slug: 'ra-mat-chuyen-muc-tin-tuc',
  title: 'AoE4 VN ra mắt chuyên mục Tin tức',
  description:
    'Chuyên mục tin tức Đế chế 4 bằng tiếng Việt: patch mới, giải đấu và DLC, kèm link nguồn chính thức cho mọi thông tin.',
  publishedAt: '2026-08-02',
  cta: true,
  sources: [{ label: 'AoE4 VN', url: 'https://aoe4.vn/' }],
  sections: [
    {
      heading: 'Chuyên mục này có gì',
      paragraphs: [
        'Từ hôm nay, aoe4.vn có thêm chuyên mục Tin tức: nơi tổng hợp patch notes, lịch và kết quả giải đấu, cùng các đợt DLC của Age of Empires IV bằng tiếng Việt.',
        'Mọi bản tin đều kèm link về nguồn chính thức để anh em tự kiểm chứng.',
      ],
    },
    {
      heading: 'Theo dõi ở đâu',
      paragraphs: [
        'Bài mới sẽ được đăng tại đây và chia sẻ trong Facebook Group cùng Discord của cộng đồng. Vào nhóm để nhận tin sớm và bàn luận cùng anh em.',
      ],
    },
  ],
}
