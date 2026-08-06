import { floorsForArticleKind, type ArticleKind } from '@/lib/guideVerdict'

export interface CalibrationExpect {
  /** Every dimension must be at or above the floor for the case's kind. */
  allDimsAtLeastFloor?: boolean
  voiceMax?: number
  conversionMax?: number
  contradictionsMin?: number
  contradictionsMax?: number
  aoe1DisparagementMin?: number
  aoe1DisparagementMax?: number
  /** Regression pair: head-to-head must pick the old version. */
  winner?: 'old'
}

export interface CalibrationExpectation {
  kind: ArticleKind
  expect: CalibrationExpect
}

export interface CalibrationScores {
  structure: number
  voice: number
  conversion: number
}

export interface CalibrationResult {
  case: string
  scores?: CalibrationScores
  contradictions?: number
  aoe1Disparagement?: number
  /** Canonical any-RTS disparagement count; summed with the legacy aoe1Disparagement. */
  disparagement?: number
  winner?: 'old' | 'new' | 'tie'
}

export interface CaseVerdict {
  case: string
  pass: boolean
  problems: string[]
}

/**
 * Compare a calibration run's results against the golden expectations.
 * Directional thresholds only - exact scores wobble by design (median-of-3).
 */
export function checkCalibration(
  expected: Record<string, CalibrationExpectation>,
  results: CalibrationResult[],
): CaseVerdict[] {
  const verdicts: CaseVerdict[] = []

  const caseCounts = new Map<string, number>()
  for (const r of results) caseCounts.set(r.case, (caseCounts.get(r.case) ?? 0) + 1)
  const duplicateCases = new Set(
    [...caseCounts.entries()].filter(([, count]) => count > 1).map(([name]) => name),
  )
  for (const name of duplicateCases) {
    verdicts.push({ case: name, pass: false, problems: ['duplicate result entries for this case'] })
  }

  const byCase = new Map(results.map((r) => [r.case, r]))

  for (const [name, { kind, expect: e }] of Object.entries(expected)) {
    if (duplicateCases.has(name)) continue
    const r = byCase.get(name)
    if (!r) {
      verdicts.push({ case: name, pass: false, problems: ['no result for this case'] })
      continue
    }
    const problems: string[] = []
    const needScores =
      e.allDimsAtLeastFloor || e.voiceMax !== undefined || e.conversionMax !== undefined
    if (needScores && !r.scores) problems.push('missing scores in result')
    if (r.scores) {
      if (e.allDimsAtLeastFloor) {
        const floors = floorsForArticleKind(kind)
        for (const dim of ['structure', 'voice', 'conversion'] as const) {
          if (r.scores[dim] < floors[dim])
            problems.push(`${dim} ${r.scores[dim]} below floor ${floors[dim]} (${kind})`)
        }
      }
      if (e.voiceMax !== undefined && r.scores.voice > e.voiceMax)
        problems.push(`voice ${r.scores.voice} above max ${e.voiceMax} (judge too lenient)`)
      if (e.conversionMax !== undefined && r.scores.conversion > e.conversionMax)
        problems.push(`conversion ${r.scores.conversion} above max ${e.conversionMax} (judge too lenient)`)
    }
    if (e.contradictionsMin !== undefined && (r.contradictions ?? 0) < e.contradictionsMin)
      problems.push(`contradictions ${r.contradictions ?? 0} below min ${e.contradictionsMin} (hard gate did not trip)`)
    if (e.contradictionsMax !== undefined && (r.contradictions ?? 0) > e.contradictionsMax)
      problems.push(`contradictions ${r.contradictions ?? 0} above max ${e.contradictionsMax} (false accusation)`)
    const disp = (r.disparagement ?? 0) + (r.aoe1Disparagement ?? 0)
    if (e.aoe1DisparagementMin !== undefined && disp < e.aoe1DisparagementMin)
      problems.push(`aoe1Disparagement ${disp} below min ${e.aoe1DisparagementMin} (hard gate did not trip)`)
    if (e.aoe1DisparagementMax !== undefined && disp > e.aoe1DisparagementMax)
      problems.push(`aoe1Disparagement ${disp} above max ${e.aoe1DisparagementMax} (false accusation)`)
    if (e.winner !== undefined && r.winner !== e.winner)
      problems.push(`winner ${r.winner ?? 'missing'} but expected ${e.winner} (regression gate did not trip)`)
    verdicts.push({ case: name, pass: problems.length === 0, problems })
  }

  for (const r of results) {
    if (!(r.case in expected) && !duplicateCases.has(r.case))
      verdicts.push({ case: r.case, pass: false, problems: ['result has no matching expectation'] })
  }
  return verdicts
}
