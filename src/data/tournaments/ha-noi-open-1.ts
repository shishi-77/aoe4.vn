import type { Tournament } from './lac-hong'
import banner from '@/assets/imgs/ha-noi-open-1-banner.webp'

export const haNoiOpen1: Tournament = {
  slug: 'ha-noi-open-1',
  name: 'Hà Nội Open 1',
  game: 'Age of Empires IV',
  format: '2vs2',
  banner,
  organizer: 'Cộng Đồng AOE IV Việt Nam',
  entryFee: 'Miễn phí',
  registrationType: 'Đăng ký theo đội (2 người)',
  venue: {
    name: 'SPARTACUS Gaming Center',
    address: '1 P. Trương Công Giai, Cầu Giấy, Hà Nội',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=SPARTACUS%20Gaming%20Center%2C%201%20P.%20Tr%C6%B0%C6%A1ng%20C%C3%B4ng%20Giai%2C%20C%E1%BA%A7u%20Gi%E1%BA%A5y%2C%20H%C3%A0%20N%E1%BB%99i',
  },
  startsAt: '2026-05-16T13:00:00+07:00',
  endsAt: '2026-05-16T18:00:00+07:00',
  registrationClosesAt: '2026-05-13T20:00:00+07:00',
  dateLabel: 'Thứ Bảy, 16/05/2026 · 13h00',
  prizePoolTotal: '5.000.000đ',
  bracketFormat: 'BO3 loại trực tiếp · Chung kết BO5',
  prizes: [
    { rank: 1, label: 'Vô địch', amount: '2.000.000đ', medal: '🥇', note: '+ cúp' },
    { rank: 2, label: 'Hạng nhì', amount: '1.000.000đ', medal: '🥈' },
    { rank: 3, label: 'Hạng ba', amount: '500.000đ', medal: '🥉' },
    { rank: 4, label: 'Hạng tư', amount: '400.000đ' },
    { rank: 5, label: 'Hạng năm', amount: '300.000đ' },
    { rank: 6, label: 'Hạng sáu', amount: '200.000đ' },
    { rank: 7, label: 'Hạng bảy', amount: '100.000đ' },
    { rank: 8, label: 'Hạng tám', amount: '100.000đ' },
  ],
  maps: ['Dry Arabia', 'Lipany', 'Wetlands', 'Rocky River', 'Gorge', 'Hill and Dale', 'MegaRandom'],
  links: {
    discord: 'https://discord.gg/Tzc8rnRk',
    banPick: '',
    mapPool: '',
    youtube: 'https://www.youtube.com/@clearmanaoe4',
  },
  rules: [
    'Không sử dụng hack/cheat dưới mọi hình thức',
    'Có mặt check-in trong khung 11h00–13h00',
    'Mọi tình huống phát sinh do BTC quyết định cuối cùng',
  ],
  notes: [
    'Tài trợ bởi Quỹ RoV',
    'Hỗ trợ 70.000đ cho mỗi người chơi tham gia offline',
    'Lịch trình: check-in 11h–13h · thi đấu 13h–18h · giao lưu 18h30',
  ],
  registrationDeadline: 'Trước 20h00 Thứ Năm, 13/05/2026',
}
