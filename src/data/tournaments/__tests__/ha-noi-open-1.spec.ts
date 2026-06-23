import { describe, it, expect } from 'vitest'
import { haNoiOpen1 } from '../ha-noi-open-1'

describe('haNoiOpen1', () => {
  it('là giải 2vs2 với slug đúng', () => {
    expect(haNoiOpen1.slug).toBe('ha-noi-open-1')
    expect(haNoiOpen1.format).toBe('2vs2')
  })

  it('có 8 mức giải thưởng và tổng đúng', () => {
    expect(haNoiOpen1.prizes).toHaveLength(8)
    expect(haNoiOpen1.prizePoolTotal).toBe('5.000.000đ')
  })

  it('có preset ban/pick và map pool trên aoe2cm', () => {
    expect(haNoiOpen1.links.banPick).toBe('https://aoe2cm.net/preset/YaBIh')
    expect(haNoiOpen1.links.mapPool).toBe('https://aoe2cm.net/preset/xfrpM')
  })

  it('thời gian dùng offset +07:00', () => {
    expect(haNoiOpen1.startsAt).toMatch(/\+07:00$/)
    expect(haNoiOpen1.endsAt).toMatch(/\+07:00$/)
  })
})
