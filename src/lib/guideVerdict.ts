/** Sàn mỗi chiều định tính (0-10). Provisional - cân lại ở bước calibration. */
export const QUALITY_FLOOR = 7
/** Ngưỡng tổng 3 chiều (structure+voice+conversion, tối đa 30). Provisional. */
export const QUALITY_TOTAL = 21

export interface QualityScores {
  structure: number
  voice: number
  conversion: number
}

export interface AccuracyResult {
  /** Số câu mâu thuẫn với facts file (mỗi cái là lỗi sự thật cứng). */
  contradictions: number
}

export interface Verdict {
  pass: boolean
  reasons: string[]
}

/**
 * Cổng PASS/FAIL tất định cho một guide. Không có LLM cộng điểm bằng tay ở đây.
 * PASS khi: hygiene ok VÀ không mâu thuẫn sự thật
 * VÀ mọi chiều >= floor VÀ tổng 3 chiều >= total.
 */
export function guideVerdict(
  hygienePass: boolean,
  scores: QualityScores,
  accuracy: AccuracyResult,
  floor: number = QUALITY_FLOOR,
  total: number = QUALITY_TOTAL,
): Verdict {
  const reasons: string[] = []
  if (!hygienePass) reasons.push('SEO hygiene failed')
  if (accuracy.contradictions > 0)
    reasons.push(`accuracy: ${accuracy.contradictions} contradiction(s) with facts`)
  for (const dim of ['structure', 'voice', 'conversion'] as const) {
    if (scores[dim] < floor) reasons.push(`${dim} ${scores[dim]} below floor ${floor}`)
  }
  const sum = scores.structure + scores.voice + scores.conversion
  if (sum < total) reasons.push(`total ${sum} below threshold ${total}`)
  return { pass: reasons.length === 0, reasons }
}
