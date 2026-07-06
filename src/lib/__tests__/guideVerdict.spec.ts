import { describe, it, expect } from 'vitest'
import {
  guideVerdict,
  STRUCTURE_FLOOR,
  VOICE_FLOOR,
  CONVERSION_FLOOR,
} from '@/lib/guideVerdict'

const strong = { structure: 8, voice: 8, conversion: 8 }
const clean = { contradictions: 0 }

describe('guideVerdict', () => {
  it('pass khi hygiene ok, không mâu thuẫn, mọi chiều >= sàn riêng', () => {
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

  it('fail nếu voice dưới sàn riêng', () => {
    const v = guideVerdict(true, { structure: 8, voice: 6, conversion: 8 }, clean)
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('voice'))).toBe(true)
  })

  it('pass đúng tại biên sàn riêng của từng chiều', () => {
    const v = guideVerdict(true, { structure: 7, voice: 7, conversion: 6 }, clean)
    expect(v.pass).toBe(true)
    expect(v.reasons).toEqual([])
  })

  it('fail nếu conversion dưới sàn riêng', () => {
    const v = guideVerdict(true, { structure: 8, voice: 8, conversion: 5 }, clean)
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('conversion'))).toBe(true)
  })

  it('hằng số sàn từng chiều đúng', () => {
    expect(STRUCTURE_FLOOR).toBe(7)
    expect(VOICE_FLOOR).toBe(7)
    expect(CONVERSION_FLOOR).toBe(6)
  })
})
