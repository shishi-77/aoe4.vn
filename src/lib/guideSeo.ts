import type { Guide } from '@/data/guides'

export interface SeoRule {
  id: string
  label: string
  points: number
  max: number
  actual: string | number
  note: string
}

export interface SeoResult {
  slug: string
  rules: SeoRule[]
  dimensionScore: number
}

/** Bỏ dấu tiếng Việt để so khớp từ khóa không phân biệt dấu. */
export function normalizeVi(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

/** Band scorer: full điểm trong dải ideal, nửa điểm trong dải chấp nhận, 0 ngoài. */
function bandPoints(value: number, ideal: [number, number], tolerant: [number, number], max: number): number {
  if (value >= ideal[0] && value <= ideal[1]) return max
  if (value >= tolerant[0] && value <= tolerant[1]) return max / 2
  return 0
}

// Tokens are assumed to be clean ASCII kebab-case (enforced by the `slug-clean` rule),
// so they are matched against `normalizeVi(text)` as-is without normalizing them themselves.
function slugTokens(slug: string): string[] {
  return slug.split('-').filter((t) => t.length >= 2 && t !== 'aoe4')
}

function keywordCoverage(tokens: string[], text: string): number {
  if (tokens.length === 0) return 1
  const norm = normalizeVi(text)
  return tokens.filter((t) => norm.includes(t)).length / tokens.length
}

/** True nếu guide có ít nhất một internal link (ở related hoặc trong một section). */
export function hasInternalLink(guide: Guide): boolean {
  return (guide.related?.length ?? 0) > 0 || guide.sections.some((s) => s.link !== undefined)
}

export function scoreGuideSeo(guide: Guide): SeoResult {
  const tokens = slugTokens(guide.slug)
  const hasLink = hasInternalLink(guide)
  const titleCov = keywordCoverage(tokens, guide.title)
  const descCov = keywordCoverage(tokens, guide.description)

  const rules: SeoRule[] = [
    {
      id: 'title-length',
      label: 'Độ dài title',
      points: bandPoints(guide.title.length, [30, 80], [20, 100], 2),
      max: 2,
      actual: guide.title.length,
      note: 'Ideal 30-80 ký tự',
    },
    {
      id: 'description-length',
      label: 'Độ dài description',
      points: bandPoints(guide.description.length, [70, 210], [50, 260], 2),
      max: 2,
      actual: guide.description.length,
      note: 'Ideal 70-210 ký tự',
    },
    {
      id: 'internal-link',
      label: 'Có internal link',
      points: hasLink ? 2 : 0,
      max: 2,
      actual: hasLink ? 'yes' : 'no',
      note: '≥ 1 link ở related hoặc trong section',
    },
    {
      id: 'slug-clean',
      label: 'Slug không dấu, đúng dạng',
      points: /^[a-z0-9]+(-[a-z0-9]+)*$/.test(guide.slug) ? 1 : 0,
      max: 1,
      actual: guide.slug,
      note: 'chỉ a-z, 0-9, gạch nối',
    },
    {
      id: 'cta',
      label: 'Có khối CTA',
      points: guide.cta === true ? 1 : 0,
      max: 1,
      actual: guide.cta === true ? 'yes' : 'no',
      note: 'cta: true',
    },
    {
      id: 'keyword-in-title',
      label: 'Từ khóa slug trong title',
      points: Math.round(titleCov * 1 * 10) / 10,
      max: 1,
      actual: `${Math.round(titleCov * 100)}%`,
      note: 'tỉ lệ token slug xuất hiện trong title',
    },
    {
      id: 'keyword-in-description',
      label: 'Từ khóa slug trong description',
      points: Math.round(descCov * 1 * 10) / 10,
      max: 1,
      actual: `${Math.round(descCov * 100)}%`,
      note: 'tỉ lệ token slug xuất hiện trong description',
    },
  ]

  const raw = rules.reduce((sum, r) => sum + r.points, 0)
  const dimensionScore = Math.min(10, Math.max(0, Math.round(raw * 10) / 10))

  return { slug: guide.slug, rules, dimensionScore }
}

export interface SeoHygiene {
  pass: boolean
  failures: string[]
}

/**
 * Bộ lọc vệ sinh SEO: chỉ các luật CỨNG. Không cho điểm - chỉ pass/fail để chặn
 * bài metadata hỏng trước khi chấm định tính. (v2: SEO không còn tính vào điểm chất lượng.)
 */
export function seoHygiene(guide: Guide): SeoHygiene {
  const failures: string[] = []
  if (!hasInternalLink(guide)) failures.push('no internal link (need >=1 in related or a section)')
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(guide.slug)) failures.push(`slug not clean: ${guide.slug}`)
  if (guide.cta !== true) failures.push('cta not set to true')
  if (guide.title.length < 20 || guide.title.length > 100)
    failures.push(`title length ${guide.title.length} out of [20,100]`)
  if (guide.description.length < 50)
    failures.push(`description length ${guide.description.length} < 50`)
  return { pass: failures.length === 0, failures }
}
