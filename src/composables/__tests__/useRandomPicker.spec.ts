import { describe, it, expect } from 'vitest'
import { pickRandom } from '../useRandomPicker'

describe('pickRandom', () => {
  it('không trùng phần tử', () => {
    const out = pickRandom(['a', 'b', 'c', 'd'], 3, () => 0)
    expect(new Set(out).size).toBe(out.length)
    expect(out).toHaveLength(3)
  })

  it('count >= pool.length trả toàn bộ', () => {
    const out = pickRandom(['a', 'b'], 5, () => 0)
    expect(out.sort()).toEqual(['a', 'b'])
  })

  it('rng cố định cho kết quả xác định', () => {
    const out = pickRandom(['a', 'b', 'c'], 1, () => 0.99)
    expect(out).toEqual(['c'])
  })
})
