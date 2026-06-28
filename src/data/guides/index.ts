import { cachTaiAoe4 } from './cach-tai-aoe4'
import { cauHinhMayAoe4 } from './cau-hinh-may-aoe4'
import { aoe4KhacDeCheTheNao } from './aoe4-khac-de-che-the-nao'
import { huongDanAoe4NguoiMoi } from './huong-dan-aoe4-nguoi-moi'
import { timNguoiVietChoiAoe4 } from './tim-nguoi-viet-choi-aoe4'
import { deCheXuaVaNayLinhCoBan } from './de-che-xua-va-nay-linh-co-ban'
import { deCheXuaVaNayLenDoi } from './de-che-xua-va-nay-len-doi'
import { deCheXuaVaNayCongThanh } from './de-che-xua-va-nay-cong-thanh'

export interface GuideSection {
  heading: string
  paragraphs: string[]
}

export interface Guide {
  slug: string
  title: string
  description: string
  /** Ngày cập nhật dạng YYYY-MM-DD. */
  updatedAt: string
  sections: GuideSection[]
  /** Hiện khối CTA cộng đồng ở cuối bài. */
  cta?: boolean
}

export const guides: Guide[] = [
  cachTaiAoe4,
  cauHinhMayAoe4,
  aoe4KhacDeCheTheNao,
  huongDanAoe4NguoiMoi,
  timNguoiVietChoiAoe4,
  deCheXuaVaNayLinhCoBan,
  deCheXuaVaNayLenDoi,
  deCheXuaVaNayCongThanh,
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}
