import { describe, it, expect } from 'vitest'
import { guideVerdict, QUALITY_FLOOR, QUALITY_TOTAL } from '@/lib/guideVerdict'

const strong = { structure: 8, voice: 8, conversion: 8 }
const clean = { contradictions: 0 }

describe('guideVerdict', () => {
  it('pass khi hygiene ok, không mâu thuẫn, không cờ, mọi chiều >= floor, tổng >= total', () => {
    const v = guideVerdict(true, strong, clean)
    expect(v.pass).toBe(true)
    expect(v.reasons).toEqual([])
  })

  it('fail nếu hygiene fail', () => {
    const v = guideVerdict(false, strong, clean)
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('hygiene'))).toBe(true)
  })

  it('fail nếu có mâu thuẫn sự thật (dù điểm cao)', () => {
    const v = guideVerdict(true, strong, { contradictions: 1 })
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('contradiction'))).toBe(true)
  })

  it('fail nếu một chiều dưới sàn', () => {
    const v = guideVerdict(true, { structure: 8, voice: 4, conversion: 8 }, clean)
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('voice'))).toBe(true)
  })

  it('fail nếu tổng dưới ngưỡng dù mỗi chiều chạm sàn', () => {
    // floor 7 mỗi chiều nhưng tổng 7+7+7=21; hạ total ép fail để test nhánh tổng
    const v = guideVerdict(true, { structure: 7, voice: 7, conversion: 7 }, clean, 7, 22)
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('total'))).toBe(true)
  })

  it('hằng số mặc định đúng', () => {
    expect(QUALITY_FLOOR).toBe(7)
    expect(QUALITY_TOTAL).toBe(21)
  })
})
