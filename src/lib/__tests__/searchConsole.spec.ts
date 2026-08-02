import { describe, it, expect } from 'vitest'
import { parseQueriesCsv, findOpportunities } from '@/lib/searchConsole'

const CSV = [
  'Truy vấn hàng đầu,Số lần nhấp,Số lần hiển thị,CTR,Vị trí',
  '"cách tải aoe4",12,340,"3,5%","4,2"',
  'aoe4 lag giật,0,150,0%,15.3',
  'de che 4 cau hinh,1,90,"1.1%",12',
  'query it hien thi,0,5,0%,18',
].join('\n')

describe('parseQueriesCsv', () => {
  it('parse theo vị trí cột (không phụ thuộc ngôn ngữ header), xử lý quote và phẩy thập phân', () => {
    const rows = parseQueriesCsv(CSV)
    expect(rows).toHaveLength(4)
    expect(rows[0]).toEqual({
      query: 'cách tải aoe4',
      clicks: 12,
      impressions: 340,
      ctr: 3.5,
      position: 4.2,
    })
    expect(rows[1].position).toBe(15.3)
  })

  it('bỏ qua dòng rỗng', () => {
    expect(parseQueriesCsv(CSV + '\n\n')).toHaveLength(4)
  })
})

describe('findOpportunities', () => {
  const pages = [
    { path: '/guides/cach-tai-aoe4/', text: 'cach-tai-aoe4 Cách tải Age of Empires IV huong dan tai game' },
    { path: '/guides/cau-hinh-may-aoe4/', text: 'cau-hinh-may-aoe4 Cấu hình máy chơi Đế chế 4' },
  ]

  it('query chưa có bài phủ + đủ impressions -> gap', () => {
    const rows = parseQueriesCsv(CSV)
    const opps = findOpportunities(rows, pages)
    const gap = opps.find((o) => o.query === 'aoe4 lag giật')
    expect(gap?.kind).toBe('gap')
  })

  it('query đã có bài phủ đứng trang 2 -> page-2 kèm coveredBy', () => {
    const rows = parseQueriesCsv(CSV)
    const opps = findOpportunities(rows, pages)
    const p2 = opps.find((o) => o.query === 'de che 4 cau hinh')
    expect(p2?.kind).toBe('page-2')
    expect(p2?.coveredBy).toBe('/guides/cau-hinh-may-aoe4/')
  })

  it('impressions dưới ngưỡng bị loại; kết quả xếp theo impressions giảm dần', () => {
    const rows = parseQueriesCsv(CSV)
    const opps = findOpportunities(rows, pages)
    expect(opps.find((o) => o.query === 'query it hien thi')).toBeUndefined()
    const imps = opps.map((o) => o.impressions)
    expect([...imps].sort((a, b) => b - a)).toEqual(imps)
  })

  it('query đã phủ và đứng top 10 không phải cơ hội', () => {
    const rows = parseQueriesCsv(CSV)
    const opps = findOpportunities(rows, pages)
    expect(opps.find((o) => o.query === 'cách tải aoe4')).toBeUndefined()
  })
})
