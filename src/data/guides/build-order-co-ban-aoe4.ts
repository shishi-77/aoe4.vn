import type { Guide } from './index'

export const buildOrderGuide: Guide = {
  slug: 'build-order-co-ban-aoe4',
  title: 'Build order cơ bản cho người mới chơi AoE4',
  description:
    'Build order là gì và người mới nên mở đầu trận AoE4 thế nào? Một build order lên Đời II đơn giản dùng được cho mọi nền văn minh, kèm cách luyện cho thuộc.',
  kind: 'strategy',
  updatedAt: '2026-08-08',
  cta: true,
  sections: [
    {
      heading: 'Build order là gì và vì sao phải thuộc một build',
      paragraphs: [
        'Build order là trình tự làm việc trong vài phút đầu trận: dân nào đi thu gì, đóng nhà dân lúc nào, khi nào lên đời. Đầu trận ai cũng có tài nguyên như nhau, nên người mở đầu gọn gàng hơn sẽ có kinh tế mạnh hơn và ra quân sớm hơn.',
        'Người mới thật ra không cần biết nhiều build, bởi ở giai đoạn này thứ quyết định không phải là bạn biết bao nhiêu công thức mà là bạn chạy trơn tay được một công thức. Chính vì vậy, chỉ cần thuộc lòng một build lên Đời II đơn giản rồi lặp lại nó mỗi trận, bạn đã đi trước phần lớn người chơi mới khác.',
      ],
    },
    {
      heading: 'Ba nguyên tắc quan trọng hơn mọi con số',
      paragraphs: [
        'Thứ nhất: nhà chính (Town Center) không bao giờ được nghỉ, lúc nào cũng phải có dân đang ra. Nguyên tắc này đứng đầu vì mỗi lần nhà chính đứng im là bạn hụt đúng chỗ đó một con dân so với đối thủ chơi đều tay, mà khoảng chênh ấy cứ dồn lại chứ không tự bù được.',
        'Thứ hai: không để dân chơi. Dân vừa đóng xong nhà hay vừa hết cừu thì phải giao việc mới ngay, bởi vài giây đứng không của mỗi con dân là thứ rất khó thấy giữa trận, nhưng cộng dồn lại thì đủ làm chậm cả nhịp lên đời.',
        'Thứ ba: dùng ngựa dò (Scout) ngay từ giây đầu để gom cừu quanh nhà chính và xem đối thủ ở đâu. Cừu là nguồn thực nhanh nhất đầu trận, nên gom được càng nhiều cừu về sát nhà chính thì mấy phút mở màn càng đỡ hụt thực.',
      ],
    },
    {
      heading: 'Build order lên Đời II đơn giản',
      paragraphs: [
        'Công thức cơ bản nhất, nền văn minh nào cũng áp dụng được là 7 dân thực và 3 dân vàng, cứ gom đủ cả hai thứ đó thì bấm lên đời chứ không cần nhớ thêm mốc nào khác.',
        'Mở đầu: cho cả 6 dân khởi điểm ăn cừu cạnh nhà chính, ngựa dò đi tìm thêm cừu, và giữ nhà chính ra dân liên tục.',
        'Con dân đầu tiên vừa ra, cho đi đóng một cái nhà dân (House) rồi quay về ăn cừu - vậy là đủ 7 dân thực. Những con dân ra tiếp theo cho đi đào vàng, đủ 3 dân vàng thì dừng. Nhớ đóng thêm nhà dân trước khi chạm giới hạn dân số.',
        'Đủ 400 thực và 200 vàng thì bấm lên Đời II. Với hầu hết các phe, thao tác đó là chọn một công trình biểu tượng (Landmark) rồi cho dân dựng, còn vài phe lại lên đời ngay tại nhà chính hoặc ở một công trình phụ. Trong lúc công trình lên đời đang xây, kéo dần dân sang chặt gỗ, tiếp tục ra dân và đóng trại lính - đừng ngồi chờ.',
      ],
      link: { slug: 'cac-nen-van-minh-aoe4', label: 'Chưa biết chọn phe nào? Xem bài nền văn minh' },
    },
    {
      heading: 'Sau khi lên Đời II thì làm gì',
      paragraphs: [
        'Chọn một hướng thật đơn giản và theo tới cùng. Hướng dễ nhất cho người mới: đóng một trại lính, ra quân đều tay để phòng thủ, đồng thời tiếp tục ra dân và mở rộng kinh tế để lên Đời III.',
        'Sai lầm phổ biến là dừng ra dân để dồn hết tài nguyên vào lính. Sở dĩ đây là sai lầm là bởi kinh tế mới là thứ nuôi cả trận đấu: cắt dân để dồn lính thì đợt quân đầu có thể đông hơn thật, nhưng chỉ vài phút sau bạn sẽ hụt hơi ở mọi nhịp tiếp theo. Vậy nên người mới cứ giữ nhịp ra dân gần như liên tục cho tới ít nhất phút 10-12.',
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
    { slug: 'huong-dan-aoe4-nguoi-moi', label: 'Hướng dẫn chơi Đế chế 4 cho người mới' },
    { slug: 'cac-nen-van-minh-aoe4', label: 'Chọn nền văn minh nào?' },
  ],
}
