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
}

export interface Tournament {
  name: string
  game: string
  format: string
  organizer: string
  entryFee: string
  registrationType: string
  venue: Venue
  /** ISO 8601 with explicit +07:00 offset (Vietnam time). */
  startsAt: string
  /** Human-readable Vietnamese date/time label for display (kept in sync with startsAt). */
  dateLabel: string
  prizePoolTotal: string
  prizes: Prize[]
  maps: string[]
  links: TournamentLinks
  rules: string[]
  notes: string[]
  registrationDeadline: string
}

export const tournament: Tournament = {
  name: 'Lạc Hồng Cup',
  game: 'Age of Empires IV',
  format: '4vs4',
  organizer: 'Cộng Đồng AOE IV Việt Nam',
  entryFee: 'Miễn phí',
  registrationType: 'Đăng ký tự do, BTC ghép đội',
  venue: {
    name: 'Net 269',
    address: '73 Ung Văn Khiêm, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh',
  },
  startsAt: '2026-06-14T13:30:00+07:00',
  dateLabel: 'Chủ Nhật, 14/06/2026 · 13h30',
  prizePoolTotal: '3.000.000đ',
  prizes: [
    { rank: 1, label: 'Vô địch', amount: '1.000.000đ', medal: '🥇', note: '+ cúp' },
    { rank: 2, label: 'Hạng nhì', amount: '700.000đ', medal: '🥈' },
    { rank: 3, label: 'Hạng ba', amount: '500.000đ', medal: '🥉' },
    { rank: 4, label: 'Hạng 4', amount: '360.000đ' },
    { rank: 5, label: 'Hạng 5', amount: '240.000đ' },
    { rank: 6, label: 'Hạng 6', amount: '200.000đ' },
  ],
  maps: [
    'Dry Arabia',
    'Lipany',
    'Gorge',
    'MegaRandom',
    'Rocky River',
    'Holy Island',
    'Forts',
    'West Lake',
    'Sunkenland',
  ],
  links: {
    discord: 'https://discord.gg/Tzc8rnRk',
    banPick: 'https://aoe2cm.net/preset/QHani',
    mapPool: 'https://aoe2cm.net/preset/MivJN',
    youtube: 'https://www.youtube.com/@clearmanaoe4',
  },
  rules: ['Không sử dụng hack/cheat'],
  notes: [
    'Khi đăng ký, bạn cam kết tuân thủ luật giải đấu',
    'Tôn trọng quyết định của Ban tổ chức',
  ],
  registrationDeadline: '1 tuần trước giải đấu',
}
