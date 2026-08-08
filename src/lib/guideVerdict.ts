export const STRUCTURE_FLOOR = 8
/**
 * Voice stays at 7 while structure and conversion took the +1 raise (owner, 2026-08-08).
 * The raise briefly put this at 8 and the evidence came back against it: across two full
 * rewrites of `cung-r-ngua-chem-aoe4` and eight judging rounds, the median voice score
 * converged on 7 every time, while each round's judges named different, individually valid
 * faults. That is the signature of a floor above what the writing process reliably hits,
 * not of one bad article. Raise this again only with a thicker ~8 anchor corpus behind it.
 */
export const VOICE_FLOOR = 7
export const CONVERSION_FLOOR = 7

export interface QualityScores {
  structure: number
  voice: number
  conversion: number
}

export interface AccuracyResult {
  /** Số câu mâu thuẫn với facts file (mỗi cái là lỗi sự thật cứng). */
  contradictions: number
  /**
   * Số câu DÌM/HẠ THẤP bất kỳ game/cộng đồng RTS nào (AoE1, AoE2, AoE3, StarCraft...).
   * Người đọc bài so sánh chính là dân game đó - chê game của họ là tự đuổi khách.
   * So sánh làm rõ khác biệt thì được; phán game nào dở/nhàm/lỗi thời -> vi phạm cứng,
   * chặn PASS y như một mâu thuẫn sự thật. Bỏ trống -> coi như 0.
   */
  disparagement?: number
  /** @deprecated Tên cũ (chỉ AoE1). Vẫn được cộng dồn vào disparagement. */
  aoe1Disparagement?: number
}

export interface QualityFloors {
  structure: number
  voice: number
  conversion: number
}

/** Loại bài quyết định sàn nào áp lên. Mặc định 'strategy' (chặt hơn). */
export type GuideKind = 'utility' | 'strategy' | 'comparison'

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
  voice: 6,
  conversion: 4,
}

/**
 * Bài so sánh cầu nối (AoE4 vs AoE2/AoE3/StarCraft...) kéo dân game khác khám phá
 * AoE4. Sống chết ở giọng văn nên sàn giữ nguyên mức strategy.
 */
export const COMPARISON_FLOORS: QualityFloors = STRATEGY_FLOORS

/**
 * News posts: clarity-first like utility (news readers want the information,
 * not community slang), so voice/conversion floors match UTILITY_FLOORS.
 */
export const NEWS_FLOORS: QualityFloors = {
  structure: STRUCTURE_FLOOR,
  voice: 6,
  conversion: 4,
}

/** Backward-compat alias: sàn mặc định là bộ 'strategy'. */
export const DEFAULT_FLOORS: QualityFloors = STRATEGY_FLOORS

/** Chọn bộ sàn theo loại bài. `undefined` -> coi như 'strategy'. */
export function floorsForKind(kind: GuideKind | undefined): QualityFloors {
  if (kind === 'utility') return UTILITY_FLOORS
  if (kind === 'comparison') return COMPARISON_FLOORS
  return STRATEGY_FLOORS
}

/** Article kind across both content types. */
export type ArticleKind = GuideKind | 'news'

/** Floors for any article kind; guide kinds keep floorsForKind behavior. */
export function floorsForArticleKind(kind: ArticleKind | undefined): QualityFloors {
  if (kind === 'news') return NEWS_FLOORS
  return floorsForKind(kind)
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
 * PASS khi: hygiene ok VÀ không mâu thuẫn sự thật VÀ không dìm game RTS nào VÀ không
 * thụt lùi so với bản trước VÀ mỗi chiều >= sàn riêng của nó (theo loại bài). Không
 * có ngưỡng tổng.
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
  const disparagement = (accuracy.disparagement ?? 0) + (accuracy.aoe1Disparagement ?? 0)
  if (disparagement > 0)
    reasons.push(
      `respect: ${disparagement} câu dìm game/cộng đồng RTS (AoE1/AoE2/AoE3/StarCraft...) - cấm`,
    )
  if (regression?.regressedVsPrevious)
    reasons.push('regressed: bản mới bị đánh giá dở hơn bản trước - giữ bản cũ')
  for (const dim of ['structure', 'voice', 'conversion'] as const) {
    if (scores[dim] < floors[dim]) reasons.push(`${dim} ${scores[dim]} below floor ${floors[dim]}`)
  }
  return { pass: reasons.length === 0, reasons }
}
