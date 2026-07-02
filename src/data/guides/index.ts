import { downloadGuide } from './cach-tai-aoe4'
import { systemRequirementsGuide } from './cau-hinh-may-aoe4'
import { beginnerGuide } from './huong-dan-aoe4-nguoi-moi'
import { findPlayersGuide } from './tim-nguoi-viet-choi-aoe4'
import { civilizationsGuide } from './cac-nen-van-minh-aoe4'
import { gameModesGuide } from './cac-che-do-choi-aoe4'
import { buildOrderGuide } from './build-order-co-ban-aoe4'
import { aoe4VsAoe1Guide } from './aoe4-khac-de-che-the-nao'

export interface GuideLink {
  /** Slug of the target guide under /guides/:slug. */
  slug: string
  /** Anchor text shown to the reader. */
  label: string
}

export interface GuideSection {
  heading: string
  paragraphs: string[]
  /** Optional contextual link rendered after this section's paragraphs. */
  link?: GuideLink
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
  /** Khối "Bài liên quan" cuối bài. */
  related?: GuideLink[]
}

export const guides: Guide[] = [
  downloadGuide,
  systemRequirementsGuide,
  beginnerGuide,
  findPlayersGuide,
  civilizationsGuide,
  gameModesGuide,
  buildOrderGuide,
  aoe4VsAoe1Guide,
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}
