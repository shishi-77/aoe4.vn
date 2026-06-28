import { cachTaiAoe4 } from './cach-tai-aoe4'

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

export const guides: Guide[] = [cachTaiAoe4]

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug)
}
