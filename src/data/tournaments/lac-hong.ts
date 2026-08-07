import lacHongBanner from '@/assets/imgs/lac-hong-cup-banner.webp'
import type { Tournament } from './types'
import { lacHongData } from './lac-hong.data'

export const lacHong: Tournament = { ...lacHongData, banner: lacHongBanner }
