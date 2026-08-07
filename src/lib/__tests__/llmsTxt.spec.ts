import { describe, it, expect } from 'vitest'
import { buildLlmsTxt, buildLlmsFullTxt, buildMarkdownFiles } from '@/lib/llmsTxt'
import type { LlmsInput } from '@/lib/llmsTxt'
import { site } from '@/data/site'
import { guides } from '@/data/guides'
import { newsPosts } from '@/data/news'
import { faqItems } from '@/data/faq'
import { tournamentsData } from '@/data/tournaments/data'

const realInput: LlmsInput = {
  site,
  guides,
  news: newsPosts,
  faq: faqItems,
  tournaments: tournamentsData,
}

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt(realInput)

  it('mở đầu bằng H1 tên site và một dòng blockquote mô tả', () => {
    expect(txt.startsWith(`# ${site.name}\n`)).toBe(true)
    expect(txt).toContain(`> ${site.description}`)
  })

  it('trỏ tới bản đầy đủ', () => {
    expect(txt).toContain(`${site.url}/llms-full.txt`)
  })

  it('có đủ bốn mục lục', () => {
    expect(txt).toContain('## Hướng dẫn')
    expect(txt).toContain('## Tin tức')
    expect(txt).toContain('## Câu hỏi thường gặp')
    expect(txt).toContain('## Giải đấu')
  })

  it('mục lục guide trỏ bản .md kèm description', () => {
    const g = guides[0]
    expect(txt).toContain(`- [${g.title}](${site.url}/guides/${g.slug}.md): ${g.description}`)
  })

  it('giải đấu trỏ bản HTML chứ không phải .md', () => {
    const t = tournamentsData[0]
    expect(txt).toContain(`(${site.url}/tournaments/${t.slug}/)`)
    expect(txt).not.toContain(`/tournaments/${t.slug}.md`)
  })
})

describe('buildLlmsFullTxt', () => {
  const txt = buildLlmsFullTxt(realInput)

  it('ngăn cách các bài bằng đường kẻ ngang', () => {
    expect(txt).toContain('\n\n---\n\n')
  })

  it('chứa toàn văn, không chỉ tiêu đề', () => {
    expect(txt).toContain(guides[0].sections[0].paragraphs[0])
  })
})

describe('buildMarkdownFiles', () => {
  it('luôn sinh faq.md', () => {
    expect(buildMarkdownFiles(realInput).map((f) => f.path)).toContain('faq.md')
  })

  it('mọi path đều tương đối, không có dấu / đầu', () => {
    for (const file of buildMarkdownFiles(realInput)) {
      expect(file.path.startsWith('/')).toBe(false)
    }
  })

  it('không có file rỗng', () => {
    for (const file of buildMarkdownFiles(realInput)) {
      expect(file.content.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('chống lệch với dữ liệu thật', () => {
  const txt = buildLlmsTxt(realInput)
  const full = buildLlmsFullTxt(realInput)
  const paths = buildMarkdownFiles(realInput).map((f) => f.path)

  it.each(guides.map((g) => [g.slug, g.title] as const))(
    'guide %s có mục trong llms.txt, có file .md và có mặt trong llms-full.txt',
    (slug, title) => {
      expect(txt).toContain(`${site.url}/guides/${slug}.md`)
      expect(paths).toContain(`guides/${slug}.md`)
      expect(full).toContain(title)
    },
  )

  it.each(newsPosts.map((p) => [p.slug, p.title] as const))(
    'news %s có mục trong llms.txt, có file .md và có mặt trong llms-full.txt',
    (slug, title) => {
      expect(txt).toContain(`${site.url}/news/${slug}.md`)
      expect(paths).toContain(`news/${slug}.md`)
      expect(full).toContain(title)
    },
  )

  it.each(tournamentsData.map((t) => [t.slug, t.name] as const))(
    'giải %s có mục trong llms.txt và trong llms-full.txt',
    (slug, name) => {
      expect(txt).toContain(`/tournaments/${slug}/`)
      expect(full).toContain(name)
    },
  )

  it('sinh đúng số file: mỗi guide một file, mỗi news một file, cộng faq.md', () => {
    expect(paths).toHaveLength(guides.length + newsPosts.length + 1)
  })

  it('không có path trùng nhau', () => {
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('ném lỗi khi hai bài trùng slug', () => {
    const dup = { ...realInput, guides: [guides[0], guides[0]] }
    expect(() => buildMarkdownFiles(dup)).toThrow(/trùng/)
  })
})
