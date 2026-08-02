import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'
import { checkCalibration, type CalibrationExpectation, type CalibrationResult } from '@/lib/calibration'

const exp = (over: Partial<CalibrationExpectation> = {}): CalibrationExpectation => ({
  kind: 'strategy',
  expect: {},
  ...over,
})

const res = (over: Partial<CalibrationResult> = {}): CalibrationResult => ({
  case: 'case-a',
  scores: { structure: 8, voice: 8, conversion: 7 },
  contradictions: 0,
  aoe1Disparagement: 0,
  ...over,
})

describe('checkCalibration', () => {
  it('allDimsAtLeastFloor đạt khi mọi chiều >= sàn theo kind', () => {
    const verdicts = checkCalibration(
      { 'case-a': exp({ kind: 'strategy', expect: { allDimsAtLeastFloor: true } }) },
      [res()],
    )
    expect(verdicts).toEqual([{ case: 'case-a', pass: true, problems: [] }])
  })

  it('allDimsAtLeastFloor trượt khi một chiều dưới sàn (strategy: voice sàn 7)', () => {
    const verdicts = checkCalibration(
      { 'case-a': exp({ kind: 'strategy', expect: { allDimsAtLeastFloor: true } }) },
      [res({ scores: { structure: 8, voice: 6, conversion: 7 } })],
    )
    expect(verdicts[0].pass).toBe(false)
    expect(verdicts[0].problems.some((p) => p.includes('voice'))).toBe(true)
  })

  it('sàn tra theo kind: utility cho voice 5 qua, strategy thì không', () => {
    const scores = { structure: 8, voice: 5, conversion: 4 }
    const utility = checkCalibration(
      { 'case-a': exp({ kind: 'utility', expect: { allDimsAtLeastFloor: true } }) },
      [res({ scores })],
    )
    expect(utility[0].pass).toBe(true)
    const strategy = checkCalibration(
      { 'case-a': exp({ kind: 'strategy', expect: { allDimsAtLeastFloor: true } }) },
      [res({ scores })],
    )
    expect(strategy[0].pass).toBe(false)
  })

  it('voiceMax/conversionMax trượt khi điểm cao hơn trần (judge quá lỏng)', () => {
    const verdicts = checkCalibration(
      { 'case-a': exp({ expect: { voiceMax: 4, conversionMax: 4 } }) },
      [res({ scores: { structure: 8, voice: 6, conversion: 3 } })],
    )
    expect(verdicts[0].pass).toBe(false)
    expect(verdicts[0].problems).toHaveLength(1)
    expect(verdicts[0].problems[0]).toContain('voice')
  })

  it('contradictionsMin/aoe1DisparagementMin trượt khi cổng cứng không sập', () => {
    const verdicts = checkCalibration(
      {
        'case-facts': exp({ expect: { contradictionsMin: 1 } }),
        'case-aoe1': exp({ expect: { aoe1DisparagementMin: 1 } }),
      },
      [
        res({ case: 'case-facts', contradictions: 0 }),
        res({ case: 'case-aoe1', aoe1Disparagement: 1 }),
      ],
    )
    expect(verdicts.find((v) => v.case === 'case-facts')?.pass).toBe(false)
    expect(verdicts.find((v) => v.case === 'case-aoe1')?.pass).toBe(true)
  })

  it('contradictionsMax/aoe1DisparagementMax trượt khi bài tốt bị buộc tội oan', () => {
    const verdicts = checkCalibration(
      { 'case-a': exp({ expect: { contradictionsMax: 0, aoe1DisparagementMax: 0 } }) },
      [res({ contradictions: 1 })],
    )
    expect(verdicts[0].pass).toBe(false)
  })

  it('winner: kỳ vọng old mà head-to-head trả new hoặc tie -> trượt', () => {
    const make = (winner: 'old' | 'new' | 'tie') =>
      checkCalibration(
        { pair: exp({ expect: { winner: 'old' } }) },
        [{ case: 'pair', winner }],
      )[0]
    expect(make('old').pass).toBe(true)
    expect(make('new').pass).toBe(false)
    expect(make('tie').pass).toBe(false)
  })

  it('thiếu scores khi kỳ vọng cần điểm -> trượt kèm lý do rõ', () => {
    const verdicts = checkCalibration(
      { 'case-a': exp({ expect: { voiceMax: 4 } }) },
      [{ case: 'case-a' }],
    )
    expect(verdicts[0].pass).toBe(false)
    expect(verdicts[0].problems[0]).toContain('missing scores')
  })

  it('case có trong expected nhưng không có result -> trượt; result lạ không có expected -> trượt', () => {
    const verdicts = checkCalibration(
      { 'case-a': exp() },
      [res({ case: 'case-b' })],
    )
    expect(verdicts.find((v) => v.case === 'case-a')?.pass).toBe(false)
    expect(verdicts.find((v) => v.case === 'case-b')?.pass).toBe(false)
  })
})

describe('cách ly golden/', () => {
  it('không file nào trong src/ import từ thư mục golden', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const full = join(dir, name)
        return statSync(full).isDirectory() ? walk(full) : [full]
      })
    const files = walk(join(process.cwd(), 'src')).filter((f) => /\.(ts|vue)$/.test(f))
    const importRe = /from\s+['"][^'"]*guide-evaluator\/golden/
    const offenders = files.filter((f) => importRe.test(readFileSync(f, 'utf8')))
    expect(offenders).toEqual([])
  })
})
