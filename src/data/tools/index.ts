/** Display group a tool belongs to on /tools. */
export type ToolCategory = 'Tra cứu' | 'Tính toán' | 'Nháp chiến thuật' | 'Luyện tập'

export interface Tool {
  /**
   * Proper name of the tool. Carries abbreviations on purpose (AoE4 World), so it
   * sits in the technical zone and must never be run through gameNamingFailures.
   */
  name: string
  /** Absolute https URL of the tool's home page. */
  url: string
  category: ToolCategory
  /** Games the tool serves, named per the house convention: 'Đế chế 4'. */
  games: string[]
  /** Reader-facing Vietnamese prose: what it does, when to reach for it. */
  description: string
}

/**
 * Fixed render order of the groups on /tools. Declared here rather than derived
 * from `tools`, so adding a tool can never reshuffle the page.
 */
export const TOOL_CATEGORIES: ToolCategory[] = [
  'Tra cứu',
  'Tính toán',
  'Nháp chiến thuật',
  'Luyện tập',
]

/*
 * Facts verified 2026-08-08. Three of the four sites are SPAs that serve an empty
 * HTML shell, so the descriptions trace to static sources instead:
 * - aoe4world.com: its own home page.
 * - aoe2cm.net: the README of github.com/SiegeEngineers/aoe2cm2.
 * - aoe-aegis.vercel.app and aoe4-production-calculator.com: aoe4world.com/tools,
 *   where AoE4 World lists both as community tools.
 */
export const tools: Tool[] = [
  {
    name: 'AoE4 World',
    url: 'https://aoe4world.com/',
    category: 'Tra cứu',
    games: ['Đế chế 4'],
    description:
      'Trang tra cứu số liệu lớn nhất của Đế chế 4: bảng xếp hạng ranked và quick match, hồ sơ người chơi, lịch sử trận, tỉ lệ thắng theo nền văn minh và theo bản đồ. Có thêm mục tra cứu nền văn minh, quân, nhà và công nghệ. Dùng khi bạn muốn xem lại trận vừa đánh hoặc dò trình độ đối thủ.',
  },
  {
    name: 'AoE4 Production Calculator',
    url: 'https://www.aoe4-production-calculator.com/',
    category: 'Tính toán',
    games: ['Đế chế 4'],
    description:
      'Máy tính sản xuất cho Đế chế 4: cho biết cần bao nhiêu dân thu mỗi loại tài nguyên để nuôi một dàn quân chạy liên tục. Dùng khi bạn muốn biết nên bổ dân vào gỗ, vàng hay lương trước khi bấm quân.',
  },
  {
    name: 'AoE2 Captains Mode',
    url: 'https://aoe2cm.net/',
    category: 'Nháp chiến thuật',
    games: ['Đế chế 2', 'Đế chế 3', 'Đế chế 4'],
    description:
      'Phòng nháp cấm chọn (ban/pick) cho giải đấu: hai bên lần lượt cấm và chọn nền văn minh theo một preset định sẵn, có vai chủ phòng, người chơi và khán giả riêng. Bộ preset phủ nhiều đời trong dòng Đế chế, gồm cả Đế chế 4.',
  },
  {
    name: 'Aegis',
    url: 'https://aoe-aegis.vercel.app/',
    category: 'Luyện tập',
    games: ['Đế chế 4'],
    description:
      'Game nhỏ luyện phím tắt xây nhà cho Đế chế 4: luyện bấm đúng phím cho từng công trình để quen tay mà không phải vào trận thật.',
  },
]

/** Tools in one group, in declaration order. */
export function toolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category)
}
