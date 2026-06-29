import type { Guide } from './index'

export const gameModesGuide: Guide = {
  slug: 'cac-che-do-choi-aoe4',
  title: 'Các chế độ chơi trong Age of Empires IV',
  description:
    'Đế chế 4 có những chế độ chơi nào? Giải thích nhanh Chiến dịch, Art of War, đấu với máy, tìm trận nhanh, đấu xếp hạng và phòng tùy chỉnh để bạn chọn đúng chỗ bắt đầu.',
  updatedAt: '2026-06-28',
  cta: true,
  sections: [
    {
      heading: 'Chơi một mình: Chiến dịch và luyện tập',
      paragraphs: [
        'Chiến dịch (Campaign) là loạt màn chơi theo lịch sử, rất hợp để người mới làm quen điều khiển và nhịp game trong môi trường dễ thở.',
        'Art of War là các bài tập kỹ năng ngắn dạy thu tài nguyên, lên đời nhanh và ra quân hiệu quả. Đấu với máy (Skirmish) cho bạn tạo trận tùy chỉnh với AI ở nhiều mức khó - sân tập lý tưởng trước khi lên mạng.',
      ],
    },
    {
      heading: 'Chơi mạng với người thật',
      paragraphs: [
        'Tìm trận nhanh (Quick Match) ghép bạn với người có trình độ tương đương để chơi giải trí, không nặng nề chuyện thắng thua.',
        'Đấu xếp hạng (Ranked) dành cho ai muốn leo hạng và đo trình độ qua từng mùa. Cả hai có chế độ 1v1 lẫn đánh đội (2v2, 3v3, 4v4).',
      ],
    },
    {
      heading: 'Chơi cùng bạn bè: phòng tùy chỉnh',
      paragraphs: [
        'Phòng tùy chỉnh (Custom) cho bạn tự tạo trận và mời bạn bè vào chơi chung, tự chọn bản đồ và luật. Đây là cách hợp nhất để chơi với hội bạn người Việt hoặc tổ đội cùng đánh máy.',
        'Nếu chưa có nhóm bạn chơi cùng, hãy tham gia cộng đồng AoE4 Việt Nam để rủ kèo và lập đội - chi tiết ở bài hướng dẫn tìm người Việt chơi cùng.',
      ],
    },
  ],
  related: [
    { slug: 'tim-nguoi-viet-choi-aoe4', label: 'Tìm người Việt chơi cùng' },
    { slug: 'huong-dan-aoe4-nguoi-moi', label: 'Hướng dẫn chơi cho người mới' },
  ],
}
