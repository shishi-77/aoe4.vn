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

/** Loại bài quyết định sàn nào áp lên. Mặc định 'strategy' (chặt hơn). */
export type GuideKind = 'utility' | 'strategy'

/**
 * Bài chiến thuật/quan điểm (build order, phân tích civ, so sánh). Hưởng lợi từ
 * giọng cộng đồng + hook nên sàn voice/conversion cao.
 */
export const STRATEGY_FLOORS: QualityFloors = {
  structure: STRUCTURE_FLOOR,
  voice: VOICE_FLOOR,
  conversion: CONVERSION_FLOOR,
}

/**
 * Bài tiện ích/tra cứu (tải game, cấu hình máy, tìm người chơi). Người đọc muốn
 * rõ + nhanh gọn, KHÔNG cần hook hay slang cộng đồng. Ép engagement-bait vào đây
 * làm bài dở đi (đúng lỗi Goodhart đã thấy ở cach-tai-aoe4). Nên hạ sàn
 * voice/conversion, giữ nguyên sàn structure vì clarity mới là thứ quan trọng nhất.
 */
export const UTILITY_FLOORS: QualityFloors = {
  structure: STRUCTURE_FLOOR,
  voice: 5,
  conversion: 3,
}

/** Backward-compat alias: sàn mặc định là bộ 'strategy'. */
export const DEFAULT_FLOORS: QualityFloors = STRATEGY_FLOORS

/** Chọn bộ sàn theo loại bài. `undefined` -> coi như 'strategy'. */
export function floorsForKind(kind: GuideKind | undefined): QualityFloors {
  return kind === 'utility' ? UTILITY_FLOORS : STRATEGY_FLOORS
}

export interface RegressionResult {
  /**
   * True khi ĐÃ có bản trước để so VÀ một judge head-to-head thấy bản mới ĐỌC DỞ
   * HƠN bản cũ. Cổng chống thụt lùi: chặn loop "tối ưu chỉ số" đẩy bài đã tốt qua
   * đỉnh đường cong chất lượng (forced hook, slang gượng, CTA nhét bừa).
   */
  regressedVsPrevious: boolean
}

export interface Verdict {
  pass: boolean
  reasons: string[]
}

/**
 * Cổng PASS/FAIL tất định cho một guide. Không có LLM cộng điểm bằng tay ở đây.
 * PASS khi: hygiene ok VÀ không mâu thuẫn sự thật VÀ không thụt lùi so với bản
 * trước VÀ mỗi chiều >= sàn riêng của nó (theo loại bài). Không có ngưỡng tổng.
 *
 * Trust boundary: `scores` are trusted to already be integers in the 0-10 range,
 * as produced by the median-of-3 judge upstream. This gate does not re-validate
 * bounds or types on the incoming scores.
 */
export function guideVerdict(
  hygienePass: boolean,
  scores: QualityScores,
  accuracy: AccuracyResult,
  floors: QualityFloors = STRATEGY_FLOORS,
  regression?: RegressionResult,
): Verdict {
  const reasons: string[] = []
  if (!hygienePass) reasons.push('SEO hygiene failed')
  if (accuracy.contradictions > 0)
    reasons.push(`accuracy: ${accuracy.contradictions} contradiction(s) with facts`)
  if (regression?.regressedVsPrevious)
    reasons.push('regressed: bản mới bị đánh giá dở hơn bản trước - giữ bản cũ')
  for (const dim of ['structure', 'voice', 'conversion'] as const) {
    if (scores[dim] < floors[dim]) reasons.push(`${dim} ${scores[dim]} below floor ${floors[dim]}`)
  }
  return { pass: reasons.length === 0, reasons }
}
