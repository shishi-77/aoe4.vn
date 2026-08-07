import type { TournamentData } from './types'

/**
 * Mẫu thêm giải đấu mới - cấu trúc hai lớp:
 *
 * 1. Copy file này thành `ten-giai.data.ts`, điền đầy đủ field bên dưới.
 *    File .data.ts KHÔNG được import ảnh - vite.config.ts đọc nó lúc build,
 *    trước khi alias @/ tồn tại.
 * 2. Tạo `ten-giai.ts` chỉ để gắn banner:
 *      import banner from '@/assets/imgs/ten-giai-banner.webp'
 *      import type { Tournament } from './types'
 *      import { tenGiaiData } from './ten-giai.data'
 *      export const tenGiai: Tournament = { ...tenGiaiData, banner }
 * 3. Thêm vào `tournaments` trong index.ts và `tournamentsData` trong data.ts.
 * 4. Thêm URL vào `includedRoutes` trong vite.config.ts và vào src/lib/sitemap.ts.
 */
export const templateData: TournamentData = {
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
  bracketFormat: '',
  prizes: [],
  maps: [],
  links: { discord: '', banPick: '', mapPool: '', youtube: '' },
  rules: [],
  notes: [],
  registrationDeadline: '',
}
