import type { Tournament } from './lac-hong'

/**
 * Mẫu thêm giải đấu mới:
 * 1. Copy file này thành ten-giai.ts
 * 2. Điền đầy đủ field bên dưới
 * 3. Import vào index.ts và thêm vào mảng `tournaments`
 */
export const template: Tournament = {
  slug: 'ten-giai',
  name: 'Tên giải',
  game: 'Age of Empires IV',
  format: '1vs1',
  organizer: 'Cộng Đồng AOE IV Việt Nam',
  entryFee: 'Miễn phí',
  registrationType: 'Đăng ký tự do',
  venue: { name: '', address: '', mapsUrl: '' },
  startsAt: '2026-01-01T13:30:00+07:00',
  endsAt: '2026-01-01T23:59:00+07:00',
  registrationClosesAt: '2025-12-25T23:59:00+07:00',
  dateLabel: '',
  prizePoolTotal: '',
  prizes: [],
  maps: [],
  links: { discord: '', banPick: '', mapPool: '', youtube: '' },
  rules: [],
  notes: [],
  registrationDeadline: '',
}
