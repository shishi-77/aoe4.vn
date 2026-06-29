import type { Guide } from './index'

export const systemRequirementsGuide: Guide = {
  slug: 'cau-hinh-may-aoe4',
  title: 'Cấu hình máy chơi Age of Empires IV (Đế chế 4)',
  description:
    'Máy yếu có chơi được Đế chế 4 không? Tổng hợp cấu hình tối thiểu và đề nghị của Age of Empires IV, kèm mẹo chỉnh thiết lập cho máy cấu hình thấp.',
  updatedAt: '2026-06-28',
  cta: true,
  sections: [
    {
      heading: 'Đế chế 4 có nặng máy không?',
      paragraphs: [
        'So với nhiều game 3D ra cùng thời, Age of Empires IV nhẹ hơn đáng kể. Đây là game chiến thuật nên ưu tiên CPU và RAM hơn là card đồ họa khủng, vì vậy nhiều máy tầm trung và cả một số laptop văn phòng đời mới vẫn chơi được ở thiết lập thấp đến trung bình.',
        'Điểm cần lưu ý là khi trận đấu về cuối, quân và hiệu ứng nhiều lên thì máy yếu có thể bị khựng. Giảm số người chơi trong trận và hạ vài thiết lập đồ họa sẽ giúp chơi mượt hơn.',
      ],
    },
    {
      heading: 'Cấu hình tối thiểu (chơi được ở mức thấp)',
      paragraphs: [
        'Hệ điều hành: Windows 10 bản 64-bit.',
        'CPU: Intel Core i5 đời thứ 6 trở lên hoặc AMD Ryzen tương đương.',
        'RAM: 8GB.',
        'Card đồ họa: dòng phổ thông đời mới có hỗ trợ DirectX 12 (ví dụ Nvidia GTX 660, AMD Radeon HD 7660 hoặc card tích hợp Intel đời mới).',
        'Ổ cứng: khoảng 50GB trống, nên dùng ổ SSD để game vào nhanh hơn.',
      ],
    },
    {
      heading: 'Cấu hình đề nghị (chơi mượt mức trung - cao)',
      paragraphs: [
        'CPU: Intel Core i5 đời thứ 8 trở lên hoặc AMD Ryzen 5 tương đương.',
        'RAM: 16GB.',
        'Card đồ họa: Nvidia GTX 970 / GTX 1060 hoặc AMD RX 570 trở lên.',
        'Ổ cứng: SSD để giảm thời gian tải bản đồ.',
        'Thông số có thể thay đổi theo các bản cập nhật, nên xem mục yêu cầu hệ thống mới nhất ngay trên trang Steam của game trước khi mua.',
      ],
    },
    {
      heading: 'Mẹo cho máy cấu hình thấp',
      paragraphs: [
        'Hạ độ phân giải và tắt các thiết lập nặng như khử răng cưa, đổ bóng và hiệu ứng nước xuống mức thấp.',
        'Chơi các trận ít người (1v1 hoặc 2v2) thay vì 4v4 đông quân để giảm tải lúc cuối trận.',
        'Đóng bớt ứng dụng nền và cập nhật driver card đồ họa trước khi chơi.',
      ],
    },
  ],
  related: [
    { slug: 'cach-tai-aoe4', label: 'Cách tải và mua AoE4' },
  ],
}
