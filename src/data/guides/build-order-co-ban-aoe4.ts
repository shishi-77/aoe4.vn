import type { Guide } from './index'

export const buildOrderGuide: Guide = {
  slug: 'build-order-co-ban-aoe4',
  title: 'Build order cơ bản cho người mới chơi AoE4',
  description:
    'Build order là gì và người mới nên mở đầu trận AoE4 thế nào? Một build order lên Đời II đơn giản dùng được cho mọi nền văn minh, kèm cách luyện cho thuộc.',
  updatedAt: '2026-07-02',
  cta: true,
  sections: [
    {
      heading: 'Build order là gì và vì sao phải thuộc một build',
      paragraphs: [
        'Build order là trình tự làm việc trong vài phút đầu trận: dân nào đi thu gì, đóng nhà dân lúc nào, khi nào lên đời. Đầu trận ai cũng có tài nguyên như nhau, nên người mở đầu gọn gàng hơn sẽ có kinh tế mạnh hơn và ra quân sớm hơn.',
        'Người mới không cần biết nhiều build. Chỉ cần thuộc lòng một build lên Đời II đơn giản và lặp lại nó mỗi trận, bạn đã vượt phần lớn người chơi mới khác.',
      ],
    },
    {
      heading: 'Ba nguyên tắc quan trọng hơn mọi con số',
      paragraphs: [
        'Thứ nhất: nhà chính (Town Center) không bao giờ được nghỉ - lúc nào cũng phải có dân đang ra. Mỗi lần nhà chính đứng im là kinh tế của bạn tụt lại một nhịp.',
        'Thứ hai: không để dân chơi. Dân vừa đóng xong nhà hay vừa hết cừu thì giao việc mới ngay.',
        'Thứ ba: dùng ngựa dò (Scout) ngay từ giây đầu để gom cừu quanh nhà chính và xem đối thủ ở đâu. Cừu là nguồn thực nhanh nhất đầu trận.',
      ],
    },
    {
      heading: 'Build order lên Đời II đơn giản',
      paragraphs: [
        'Công thức cơ bản nhất, nền văn minh nào cũng áp dụng được: 7 dân thực + 3 dân vàng. Đủ vàng đủ thực là lên đời.',
        'Mở đầu: cho cả 6 dân khởi điểm ăn cừu cạnh nhà chính, ngựa dò đi tìm thêm cừu, và giữ nhà chính ra dân liên tục.',
        'Con dân đầu tiên vừa ra, cho đi đóng một cái nhà dân (House) rồi quay về ăn cừu - vậy là đủ 7 dân thực. Những con dân ra tiếp theo cho đi đào vàng, đủ 3 dân vàng thì dừng. Nhớ đóng thêm nhà dân trước khi chạm giới hạn dân số.',
        'Đủ 400 thực và 200 vàng thì chọn một công trình biểu tượng (Landmark) để lên Đời II. Trong lúc landmark đang xây, kéo dần dân sang chặt gỗ, tiếp tục ra dân và đóng trại lính - đừng ngồi chờ.',
      ],
      link: { slug: 'cac-nen-van-minh-aoe4', label: 'Chưa biết chọn phe nào? Xem bài nền văn minh' },
    },
    {
      heading: 'Sau khi lên Đời II thì làm gì',
      paragraphs: [
        'Chọn một hướng thật đơn giản và theo tới cùng. Hướng dễ nhất cho người mới: đóng một trại lính, ra quân đều tay để phòng thủ, đồng thời tiếp tục ra dân và mở rộng kinh tế để lên Đời III.',
        'Sai lầm phổ biến là dừng ra dân để dồn hết tài nguyên vào lính. Kinh tế mới là thứ nuôi cả trận đấu - người mới nên ra dân gần như liên tục cho tới ít nhất phút 10-12.',
      ],
    },
    {
      heading: 'Luyện build order thế nào cho nhanh thuộc',
      paragraphs: [
        'Đánh với máy ở độ khó thấp và chỉ tập đúng phần mở đầu: chơi tới phút 6-7 rồi thoát, làm lại. Lặp khoảng chục lần là tay bạn tự nhớ, không cần nhìn ghi chú nữa.',
        'Khi đã thuộc, nâng dần độ khó của máy rồi mới lên mạng tìm trận. Xem lại replay của chính mình để soi hai lỗi kinh điển: nhà chính đứng im và để dân chơi.',
      ],
      link: { slug: 'cac-che-do-choi-aoe4', label: 'Xem các chế độ chơi để luyện tập' },
    },
  ],
  related: [
    { slug: 'huong-dan-aoe4-nguoi-moi', label: 'Hướng dẫn chơi AoE4 cho người mới' },
    { slug: 'cac-nen-van-minh-aoe4', label: 'Chọn nền văn minh nào?' },
  ],
}
