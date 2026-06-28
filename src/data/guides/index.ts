import { downloadGuide } from './cach-tai-aoe4'
import { systemRequirementsGuide } from './cau-hinh-may-aoe4'
import { beginnerGuide } from './huong-dan-aoe4-nguoi-moi'
import { findPlayersGuide } from './tim-nguoi-viet-choi-aoe4'
import { civilizationsGuide } from './cac-nen-van-minh-aoe4'
import { gameModesGuide } from './cac-che-do-choi-aoe4'

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
  downloadGuide,
  systemRequirementsGuide,
  beginnerGuide,
  findPlayersGuide,
  civilizationsGuide,
  gameModesGuide,
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}
