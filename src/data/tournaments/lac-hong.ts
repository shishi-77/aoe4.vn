import lacHongBanner from '@/assets/imgs/lac-hong-cup-banner.webp'

export interface Prize {
  rank: number
  label: string
  amount: string
  medal?: string
  note?: string
}

export interface TournamentLinks {
  discord: string
  banPick: string
  mapPool: string
  youtube: string
}

export interface Venue {
  name: string
  address: string
  /** Google Maps link for the venue address. */
  mapsUrl: string
}

export interface Tournament {
  slug: string
  name: string
  game: string
  format: string
  /** Bundled banner image (import from @/assets/imgs/...). */
  banner: string
  organizer: string
  entryFee: string
  registrationType: string
  venue: Venue
  /** ISO 8601 with explicit +07:00 offset (Vietnam time). */
  startsAt: string
  /** When the event is considered finished (ISO 8601, +07:00). */
  endsAt: string
  /** Registration cut-off (ISO 8601, +07:00). After this the CTAs switch to "join Discord". */
  registrationClosesAt: string
  /** Human-readable Vietnamese date/time label for display (kept in sync with startsAt). */
  dateLabel: string
  prizePoolTotal: string
  /** Bracket/series description shown in FormatSection, e.g. "BO3 - loại trực tiếp". */
  bracketFormat: string
  prizes: Prize[]
  maps: string[]
  links: TournamentLinks
  rules: string[]
  notes: string[]
  registrationDeadline: string
  ogImage?: string
}

export const lacHong: Tournament = {
  slug: 'lac-hong',
  name: 'Lạc Hồng Cup',
  game: 'Age of Empires IV',
  format: '4vs4',
  banner: lacHongBanner,
  organizer: 'Cộng Đồng AOE IV Việt Nam',
  entryFee: 'Miễn phí',
  registrationType: 'Đăng ký tự do, BTC ghép đội',
  venue: {
    name: 'Net 269',
    address: '73 Ung Văn Khiêm, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Net+269%2C+73+Ung+V%C4%83n+Khi%C3%AAm%2C+Th%E1%BA%A1nh+M%E1%BB%B9+T%C3%A2y%2C+TP+H%E1%BB%93+Ch%C3%AD+Minh',
  },
  startsAt: '2026-06-14T13:30:00+07:00',
  endsAt: '2026-06-14T23:59:00+07:00',
  registrationClosesAt: '2026-06-07T23:59:00+07:00',
  dateLabel: 'Chủ Nhật, 14/06/2026 · 13h30',
  prizePoolTotal: '3.000.000đ',
  bracketFormat: 'BO3 - loại trực tiếp',
  prizes: [
    { rank: 1, label: 'Vô địch', amount: '1.000.000đ', medal: '🥇', note: '+ cúp' },
    { rank: 2, label: 'Hạng nhì', amount: '700.000đ', medal: '🥈' },
    { rank: 3, label: 'Hạng ba', amount: '500.000đ', medal: '🥉' },
    { rank: 4, label: 'Hạng tư', amount: '360.000đ' },
    { rank: 5, label: 'Hạng năm', amount: '240.000đ' },
    { rank: 6, label: 'Hạng sáu', amount: '200.000đ' },
  ],
  maps: [
    'Dry Arabia',
    'Lipany',
    'Gorge',
    'MegaRandom',
    'Rocky River',
    'Continental',
    'Forts',
    'West Lake',
    'Sunkenland',
  ],
  links: {
    discord: 'https://discord.gg/Bshbqw7nHN',
    banPick: 'https://aoe2cm.net/preset/QHani',
    mapPool: 'https://aoe2cm.net/preset/IZcEi',
    youtube: 'https://youtu.be/vRdFhHsSuQ8?t=2776',
  },
  rules: [
    'Không sử dụng hack/cheat dưới mọi hình thức',
    'Có mặt tại địa điểm trước giờ thi đấu 15 phút để check-in',
    'Mất kết nối giữa trận: báo ngay cho trọng tài, BTC quyết định xử lý',
    'Mọi tình huống phát sinh do BTC quyết định cuối cùng',
  ],
  notes: [
    'Khi đăng ký, bạn cam kết tuân thủ luật giải đấu',
    'Tôn trọng quyết định của Ban tổ chức',
  ],
  registrationDeadline: 'Trước 23h59 Chủ Nhật, 07/06/2026 (1 tuần trước giải)',
}
