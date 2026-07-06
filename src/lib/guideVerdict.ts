export const STRUCTURE_FLOOR = 7
export const VOICE_FLOOR = 7
export const CONVERSION_FLOOR = 6

export interface QualityScores {
  structure: number
  voice: number
  conversion: number
}

export interface AccuracyResult {
  /** Số câu mâu thuẫn với facts file (mỗi cái là lỗi sự thật cứng). */
  contradictions: number
}

export interface QualityFloors {
  structure: number
  voice: number
  conversion: number
}

export const DEFAULT_FLOORS: QualityFloors = {
  structure: STRUCTURE_FLOOR,
  voice: VOICE_FLOOR,
  conversion: CONVERSION_FLOOR,
}

export interface Verdict {
  pass: boolean
  reasons: string[]
}

/**
 * Cổng PASS/FAIL tất định cho một guide. Không có LLM cộng điểm bằng tay ở đây.
 * PASS khi: hygiene ok VÀ không mâu thuẫn sự thật VÀ mỗi chiều >= sàn riêng của nó
 * (structure/voice >= 7, conversion >= 6). Không có ngưỡng tổng.
 */
export function guideVerdict(
  hygienePass: boolean,
  scores: QualityScores,
  accuracy: AccuracyResult,
  floors: QualityFloors = DEFAULT_FLOORS,
): Verdict {
  const reasons: string[] = []
  if (!hygienePass) reasons.push('SEO hygiene failed')
  if (accuracy.contradictions > 0)
    reasons.push(`accuracy: ${accuracy.contradictions} contradiction(s) with facts`)
  for (const dim of ['structure', 'voice', 'conversion'] as const) {
    if (scores[dim] < floors[dim]) reasons.push(`${dim} ${scores[dim]} below floor ${floors[dim]}`)
  }
  return { pass: reasons.length === 0, reasons }
}
