import { newsLaunchPost } from './ra-mat-chuyen-muc-tin-tuc'

export interface NewsSource {
  /** Display label, e.g. "Patch notes 12.1 - ageofempires.com". */
  label: string
  /** Canonical source URL backing the claims in this post. */
  url: string
}

export interface NewsSection {
  heading: string
  paragraphs: string[]
}

export interface NewsPost {
  slug: string
  title: string
  description: string
  /** Publication date YYYY-MM-DD; drives sitemap lastmod and JSON-LD. */
  publishedAt: string
  /** Last significant update; falls back to publishedAt when absent. */
  updatedAt?: string
  /** Every news post must trace its claims to at least one source URL. */
  sources: NewsSource[]
  sections: NewsSection[]
  /** Show the community CTA block at the end. */
  cta?: boolean
}

export const newsPosts: NewsPost[] = [newsLaunchPost]

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((p) => p.slug === slug)
}
