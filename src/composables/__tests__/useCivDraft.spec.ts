import { describe, it, expect } from 'vitest'
import { buildSequence, encodeDraft, decodeDraft } from '../useCivDraft'

describe('buildSequence', () => {
  it('xen kẽ ban trước rồi pick, A trước mỗi vòng', () => {
    const seq = buildSequence(1, 1)
    expect(seq).toEqual([
      { team: 'A', action: 'ban' },
      { team: 'B', action: 'ban' },
      { team: 'A', action: 'pick' },
      { team: 'B', action: 'pick' },
    ])
  })

  it('số bước = 2*(bans+picks)', () => {
    expect(buildSequence(2, 3)).toHaveLength(10)
  })
})

describe('encode/decode round-trip', () => {
  it('khôi phục đúng trạng thái', () => {
    const state = { config: { bansPerTeam: 1, picksPerTeam: 1, teamA: 'X', teamB: 'Y' }, choices: ['english', 'french'] }
    const decoded = decodeDraft(encodeDraft(state))
    expect(decoded).toEqual(state)
  })

  it('decode chuỗi hỏng trả null', () => {
    expect(decodeDraft('@@@khong-hop-le@@@')).toBeNull()
  })
})
