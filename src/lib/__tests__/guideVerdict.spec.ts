import { describe, it, expect } from 'vitest'
import {
  guideVerdict,
  floorsForKind,
  STRUCTURE_FLOOR,
  VOICE_FLOOR,
  CONVERSION_FLOOR,
  STRATEGY_FLOORS,
  UTILITY_FLOORS,
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

  it('fail nếu dìm Đế chế 1 (dù điểm cao, không mâu thuẫn)', () => {
    const v = guideVerdict(true, strong, { contradictions: 0, aoe1Disparagement: 1 })
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('dìm Đế chế 1'))).toBe(true)
  })

  it('aoe1Disparagement bỏ trống hoặc 0 thì không chặn PASS', () => {
    expect(guideVerdict(true, strong, { contradictions: 0 }).pass).toBe(true)
    expect(guideVerdict(true, strong, { contradictions: 0, aoe1Disparagement: 0 }).pass).toBe(true)
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

  it('floorsForKind: utility hạ sàn voice/conversion, giữ structure', () => {
    expect(floorsForKind('strategy')).toEqual(STRATEGY_FLOORS)
    expect(floorsForKind('utility')).toEqual(UTILITY_FLOORS)
    expect(floorsForKind(undefined)).toEqual(STRATEGY_FLOORS)
    expect(UTILITY_FLOORS.structure).toBe(STRATEGY_FLOORS.structure)
    expect(UTILITY_FLOORS.voice).toBeLessThan(STRATEGY_FLOORS.voice)
    expect(UTILITY_FLOORS.conversion).toBeLessThan(STRATEGY_FLOORS.conversion)
  })

  it('bài utility pass với voice/conversion thấp mà bài strategy sẽ trượt', () => {
    const scores = { structure: 8, voice: 5, conversion: 3 }
    expect(guideVerdict(true, scores, clean, STRATEGY_FLOORS).pass).toBe(false)
    expect(guideVerdict(true, scores, clean, UTILITY_FLOORS).pass).toBe(true)
  })

  it('cổng chống thụt lùi: fail dù điểm cao nếu bản mới dở hơn bản trước', () => {
    const v = guideVerdict(true, strong, clean, STRATEGY_FLOORS, {
      regressedVsPrevious: true,
    })
    expect(v.pass).toBe(false)
    expect(v.reasons.some((r) => r.includes('regressed'))).toBe(true)
  })

  it('không thụt lùi thì không thêm lý do', () => {
    const v = guideVerdict(true, strong, clean, STRATEGY_FLOORS, {
      regressedVsPrevious: false,
    })
    expect(v.pass).toBe(true)
    expect(v.reasons).toEqual([])
  })
})
