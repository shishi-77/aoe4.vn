FIXTURE ĐÔNG LẠNH từ src/data/guides/cung-r-ngua-chem-aoe4.ts tại main (185a72d) - nhãn owner: đơ/nhạt dù PASS (owner 2026-08-03). Không theo dõi file gốc.
FIXTURE dùng làm mẫu TRƯỢT voice - KHÔNG DÙNG LÀM MẪU VĂN TỐT.

```ts
import type { Guide } from './index'

export const mobilityUnitsGuide: Guide = {
  slug: 'cung-r-ngua-chem-aoe4',
  title: 'Cung R, ngựa chém, lạc đà: dân Đế chế mê tốc độ chơi lính gì ở AoE4 (Đế chế 4)?',
  description:
    'Cung R, ngựa chém hay lạc đà của Đế chế sang Đế chế 4 là lính nào? Kỵ cung Mangudai, Horse Archer, Onna-Musha, kỵ nặng Pháp và lạc đà Abbasid - bản đồ lính cho dân Đế chế mê đánh nhanh.',
  updatedAt: '2026-08-03',
  cta: true,
  sections: [
    {
      heading: 'Kỵ binh thống trị chiến trường',
      paragraphs: [
        'Đế chế đánh random, ra quân nào đánh theo bài quân đó. Nhưng có một thứ không đổi: quân nào cũng mở màn bằng ngựa dò, rồi mới tới cung R, ngựa chém, lạc đà. Trận nào cũng dùng kỵ, nên nhịp trận thường rất nhanh.',
        'Đế chế 4 tổng thể nhịp chậm hơn, nhưng vẫn có nguyên một nhóm quân giữ được cái nhịp cũ: kỵ cung, kỵ nặng và lạc đà. Bài này chỉ chỗ cho anh em mê đánh nhanh.',
      ],
      link: { slug: 'aoe4-khac-de-che-the-nao', label: 'Đọc lại: Đế chế 4 khác Đế chế thế nào?' },
    },
    {
      heading: 'Cung R: sang Đế chế 4 là kỵ cung',
      paragraphs: [
        'Bên Đế chế 1, mấy quân tuyển như Hit, Assy gần như mặc định lên cung R, chơi bài hit and run kinh điển.',
        'Bên Đế chế 4, muốn giữ đúng cảm giác đó thì đừng tìm ở cung bộ - tìm ở kỵ cung. Mangudai của Mông Cổ ra từ đời 2, vừa chạy vừa bắn, hợp lối raid tỉa, đánh du kích. Nga có Horse Archer từ đời 3, gom số đông thành cung chủ lực dàn trận. Nhật có Onna-Musha, kỵ cung chuyên xuyên giáp nặng.',
        'Giá thì chát: một con Mangudai đắt gần gấp đôi cung thường, mất vài con là hụt hẳn thế trận. Kỵ cung chưa đủ đông cũng vẫn bị kỵ nhẹ săn như thường - Đế chế 4 khắc chế quân chặt lắm, mạnh mấy cũng có khắc tinh.',
      ],
    },
    {
      heading: 'Ngựa chém: xe tăng của thời trung cổ',
      paragraphs: [
        'Ngựa chém thì quân nào cũng đánh được. Cầm kỵ là nắm nhịp trận, muốn đẩy nhanh hay câu chậm tùy tay mình. Nhất là ở team game map rộng, vai trò của kỵ càng nặng ký.',
        'Kỵ nặng bên Đế chế 4 là xe tăng thời trung cổ: lì, chạy nhanh, chém đau. Mê món này thì cầm Pháp - Royal Knight có từ đời 2, là quân kỵ tuyển, chém đầu trận rất rát. Tư duy điều quân gần như không khác Đế chế 1.',
        'Bù lại, kỵ nặng đắt đỏ, mà thứ khắc nó lại rẻ hơn hẳn - combo giáo cộng nỏ. Bên Đế chế, khắc tinh nổi tiếng nhất của ngựa chém là lạc đà; bên này giáo nỏ đứng chờ sẵn là đủ. Nên trước khi lao kỵ vào, cân nhắc kỹ bài toán kinh tế.',
      ],
    },
    {
      heading: 'Lạc đà bay: Đế chế 4 trao vai đó cho Abbasid',
      paragraphs: [
        'Đội lạc đà bay Palmyran đi tới đâu là ngựa bên kia dạt tới đó - cầm rất đã tay, đủ sức xoay cả cục diện trận đấu.',
        'Camel Archer (lạc đà tên) ra từ đời 2, vừa chạy vừa bắn. Camel Rider (lạc đà chém) ra từ đời 3, cận chiến chuyên trị kỵ. Ngựa của đối thủ đứng gần lạc đà còn bị trừ 20% sát thương - đúng chất ngựa sợ lạc đà như bên Đế chế.',
        'Lạc đà khắc kỵ chứ không khắc bộ binh. Cầm lạc đà đi đấm giáo với bộ binh cận chiến là nướng quân - nhưng Abbasid vốn mạnh kinh tế, đè được tiền thì đổi quân thoải mái hơn thiên hạ.',
      ],
    },
    {
      heading: 'Anh em thuộc hệ nào',
      paragraphs: [
        'Chơi Đế chế mấy chục năm, ai cũng có một hệ ruột. Quen tay đảo chém thì cầm Pháp, thích cung chủ lực thì cầm Nga, mê lạc đà và boom kinh tế thì cầm Abbasid.',
        'Cứ ôm hệ ruột mà đánh là lên tay nhanh nhất. Vào một trận với máy, ra đúng dòng lính quen tay - kẹt chỗ nào thì vào nhóm anh em Đế chế hỏi, có người chỉ ngay.',
      ],
    },
  ],
  related: [
    { slug: 'aoe4-khac-de-che-the-nao', label: 'Đế chế 4 khác Đế chế thế nào? Góc nhìn người chơi AoE1' },
    { slug: 'cac-nen-van-minh-aoe4', label: 'Các nền văn minh trong AoE4' },
    { slug: 'huong-dan-aoe4-nguoi-moi', label: 'Hướng dẫn chơi AoE4 cho người mới' },
  ],
}
```
