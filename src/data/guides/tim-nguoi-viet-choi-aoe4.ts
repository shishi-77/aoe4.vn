import type { Guide } from './index'

export const findPlayersGuide: Guide = {
  slug: 'tim-nguoi-viet-choi-aoe4',
  title: 'Tìm người Việt chơi Age of Empires IV cùng',
  description:
    'Muốn chơi Đế chế 4 cùng người Việt, ghép kèo và tìm đồng đội? Hướng dẫn cách kết nối cộng đồng AoE4 Việt Nam qua Discord, Facebook và các chế độ tìm trận trong game.',
  updatedAt: '2026-06-28',
  cta: true,
  sections: [
    {
      heading: 'Vì sao nên chơi cùng cộng đồng người Việt?',
      paragraphs: [
        'Đế chế vui nhất là khi chơi cùng bạn bè. Với AoE4, có một cộng đồng người Việt để ghép kèo, lập đội đánh 2v2, 3v3, 4v4 và trò chuyện bằng tiếng Việt giúp bạn gắn bó với game lâu hơn nhiều.',
        'Ngoài ra, hỏi đáp với người chơi trong nước cũng dễ hơn: từ build order, cách chỉnh game, đến lịch các giải đấu cộng đồng.',
      ],
    },
    {
      heading: 'Chơi cùng nhau bằng phòng tùy chỉnh',
      paragraphs: [
        'AoE4 có các chế độ tìm trận nhanh và đấu xếp hạng, nhưng để chơi với đúng hội bạn người Việt thì Phòng tùy chỉnh (Custom) là hợp nhất: bạn tự tạo phòng, chọn bản đồ và luật, rồi mời mọi người vào chơi chung.',
        'Cách này tiện cho việc lập đội 2v2, 3v3, 4v4 hoặc cùng nhau đánh máy để luyện tay trước khi lên xếp hạng.',
      ],
      link: { slug: 'cac-che-do-choi-aoe4', label: 'Xem chi tiết các chế độ chơi' },
    },
    {
      heading: 'Kết nối cộng đồng AoE4 Việt Nam',
      paragraphs: [
        'Cách nhanh nhất để tìm bạn chơi là tham gia Discord và Facebook Group của cộng đồng AoE4 Việt Nam. Đây là nơi mọi người rủ kèo, lập đội, chia sẻ trận hay và cập nhật giải đấu.',
        'Khi mới vào, cứ mạnh dạn giới thiệu mình là người từ Đế chế mới chuyển sang - cộng đồng rất sẵn lòng chỉ dẫn và rủ chơi cùng.',
      ],
    },
  ],
  related: [
    { slug: 'cac-che-do-choi-aoe4', label: 'Các chế độ chơi trong AoE4' },
    { slug: 'huong-dan-aoe4-nguoi-moi', label: 'Hướng dẫn chơi cho người mới' },
  ],
}
