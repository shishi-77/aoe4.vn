import { describe, it, expect } from 'vitest'
import { factsSheetPath, needsFactsSheet, factsSheetFailures } from '@/lib/factsSheet'

const always = () => true
const never = () => false

describe('needsFactsSheet', () => {
  it('comparison và news bắt buộc có sheet', () => {
    expect(needsFactsSheet('comparison')).toBe(true)
    expect(needsFactsSheet('news')).toBe(true)
  })

  it('strategy và utility thì không', () => {
    expect(needsFactsSheet('strategy')).toBe(false)
    expect(needsFactsSheet('utility')).toBe(false)
  })
})

describe('factsSheetFailures', () => {
  it('kind không cần sheet thì bỏ qua, kể cả khi không có file', () => {
    expect(factsSheetFailures('strategy', 'bat-ky', never)).toEqual([])
    expect(factsSheetFailures('utility', 'bat-ky', never)).toEqual([])
  })

  it('comparison thiếu sheet -> failure kèm đúng đường dẫn cần tạo', () => {
    const failures = factsSheetFailures('comparison', 'bai-so-sanh', never)
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('docs/facts-review/bai-so-sanh.md')
  })

  it('news thiếu sheet -> failure', () => {
    expect(factsSheetFailures('news', 'ban-tin', never)).toHaveLength(1)
  })

  it('có sheet thì sạch', () => {
    expect(factsSheetFailures('comparison', 'bai-so-sanh', always)).toEqual([])
    expect(factsSheetFailures('news', 'ban-tin', always)).toEqual([])
  })

  it('hỏi đúng slug đang chấm chứ không phải slug nào khác', () => {
    const asked: string[] = []
    factsSheetFailures('comparison', 'slug-can-hoi', (slug) => {
      asked.push(slug)
      return true
    })
    expect(asked).toEqual(['slug-can-hoi'])
  })
})

describe('factsSheetPath', () => {
  it('trỏ vào docs/facts-review, nơi .gitignore mở ngoại lệ cho pipeline state', () => {
    expect(factsSheetPath('abc')).toBe('docs/facts-review/abc.md')
  })
})
