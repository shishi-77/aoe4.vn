import { describe, it, expect } from 'vitest'
import { tools, TOOL_CATEGORIES, toolsByCategory } from '@/data/tools'
import { gameNamingFailures } from '@/lib/gameNaming'

describe('tools collection', () => {
  it('có ít nhất một công cụ', () => {
    expect(tools.length).toBeGreaterThan(0)
  })

  it('mọi URL là https tuyệt đối và không trùng nhau', () => {
    for (const t of tools) {
      expect(t.url.startsWith('https://')).toBe(true)
    }
    const urls = tools.map((t) => t.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('mọi công cụ có tên, mô tả đủ dài và ít nhất một game', () => {
    for (const t of tools) {
      expect(t.name.trim()).toBeTruthy()
      expect(t.description.trim().length).toBeGreaterThan(40)
      expect(t.games.length).toBeGreaterThan(0)
      for (const g of t.games) {
        expect(g.trim()).toBeTruthy()
      }
    }
  })

  it('category của mọi công cụ nằm trong TOOL_CATEGORIES', () => {
    for (const t of tools) {
      expect(TOOL_CATEGORIES).toContain(t.category)
    }
  })

  it('TOOL_CATEGORIES không trùng lặp', () => {
    expect(new Set(TOOL_CATEGORIES).size).toBe(TOOL_CATEGORIES.length)
  })

  it('không dùng em-dash', () => {
    for (const t of tools) {
      expect(`${t.name} ${t.description} ${t.games.join(' ')}`).not.toContain('—')
    }
  })

  /*
   * Only `description` is reader-facing prose. `name` is the tool's proper name and
   * carries abbreviations on purpose (AoE4 World), so it must never reach this gate.
   */
  it('mô tả tuân thủ quy ước đặt tên game', () => {
    expect(gameNamingFailures(tools.map((t) => t.description))).toEqual([])
  })

  it('toolsByCategory lọc đúng và trả mảng rỗng khi không có gì', () => {
    for (const category of TOOL_CATEGORIES) {
      for (const t of toolsByCategory(category)) {
        expect(t.category).toBe(category)
      }
    }
    const total = TOOL_CATEGORIES.reduce((n, c) => n + toolsByCategory(c).length, 0)
    expect(total).toBe(tools.length)
  })
})
