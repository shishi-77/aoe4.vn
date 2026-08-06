import { describe, it, expect } from 'vitest'
import { gameNamingFailures } from '@/lib/gameNaming'

describe('gameNamingFailures', () => {
  it('accepts Vietnamese names carrying a number', () => {
    expect(
      gameNamingFailures([
        'Đế chế 4 chậm hơn Đế chế 1 một nhịp, còn Đế chế 2 thong thả nhất.',
      ]),
    ).toEqual([])
  })

  it('accepts bare Đế chế when it follows a series marker', () => {
    expect(
      gameNamingFailures([
        'Cả dòng Đế chế đều vậy.',
        'Cộng đồng Đế chế ở Việt Nam đông nhất ở phía bắc.',
        'Game nào trong dòng game Đế chế cũng có phần may rủi.',
        'Làng Đế chế vẫn nhắc lại kèo đó.',
      ]),
    ).toEqual([])
  })

  it('rejects bare Đế chế used as the name of one game', () => {
    const failures = gameNamingFailures(['Người chơi Đế chế sang Đế chế 4 quen tay rất nhanh.'])
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('bare "Đế chế" must name a game')
  })

  it('rejects abbreviations in prose', () => {
    const failures = gameNamingFailures(['Nếu xếp theo nhịp trận thì AoE3 nhanh nhất.'])
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('abbreviation "AoE3" in prose')
  })

  it('rejects a bare AoE standing in for the series', () => {
    const failures = gameNamingFailures(['Suy cho cùng vẫn là AoE cả.'])
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('abbreviation "AoE" in prose')
  })

  it('allows an alias glossed right after the Vietnamese name', () => {
    expect(
      gameNamingFailures([
        'Đế chế 4 (tên chính thức Age of Empires IV, viết tắt AoE4) ra năm 2021.',
        'Dòng Đế chế (tên gốc Age of Empires) đã đi qua bốn phần chính.',
      ]),
    ).toEqual([])
  })

  it('allows a quoted official name the reader must search for', () => {
    expect(
      gameNamingFailures(['Tìm "Age of Empires IV" trong cửa hàng rồi bấm Cài đặt.']),
    ).toEqual([])
  })

  it('rejects the official name used as the routine label', () => {
    const failures = gameNamingFailures(['So với game cùng thời, Age of Empires IV nhẹ hơn.'])
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('official name "Age of Empires IV" in prose')
  })

  it('ignores the aoe4.vn hostname', () => {
    expect(gameNamingFailures(['Từ hôm nay, aoe4.vn có thêm chuyên mục Tin tức.'])).toEqual([])
  })

  it('allows a quoted Đế chế that mentions the name itself', () => {
    expect(
      gameNamingFailures(['Dòng Đế chế là cách người Việt gọi "Đế chế", không ai gọi tên gốc.']),
    ).toEqual([])
  })

  it('does not let a gloss on one game license aliases elsewhere in the text', () => {
    const failures = gameNamingFailures([
      'Đế chế 4 (viết tắt AoE4) khác Đế chế 2 ở chỗ AoE2 cho lên đời tại nhà chính.',
    ])
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('abbreviation "AoE2" in prose')
  })
})
