/* @vitest-environment node */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { validateQueue, QUEUE_STATUSES } from '@/lib/contentQueue'

const item = (over: Record<string, unknown> = {}) => ({
  slug: 'vi-du-de-tai',
  targetKeyword: 'ví dụ đề tài',
  kind: 'guide',
  evidence: { query: 'ví dụ', impressions: 120, position: 14.2, source: 'search-console' },
  status: 'proposed',
  createdAt: '2026-08-02',
  updatedAt: '2026-08-02',
  ...over,
})

describe('validateQueue', () => {
  it('chấp nhận mảng rỗng và mảng item hợp lệ', () => {
    expect(validateQueue([])).toEqual([])
    expect(validateQueue([item()])).toEqual([])
  })

  it('bắt slug trùng nhau', () => {
    const problems = validateQueue([item(), item()])
    expect(problems.some((p) => p.includes('duplicate slug'))).toBe(true)
  })

  it('bắt status và kind không hợp lệ', () => {
    expect(validateQueue([item({ status: 'doing' })]).length).toBeGreaterThan(0)
    expect(validateQueue([item({ kind: 'video' })]).length).toBeGreaterThan(0)
  })

  it('bắt ngày sai định dạng và slug bẩn', () => {
    expect(validateQueue([item({ createdAt: '02/08/2026' })]).length).toBeGreaterThan(0)
    expect(validateQueue([item({ slug: 'Có Dấu' })]).length).toBeGreaterThan(0)
  })

  it('bắt dữ liệu không phải mảng', () => {
    expect(validateQueue({}).length).toBeGreaterThan(0)
  })

  it('QUEUE_STATUSES có đủ 8 trạng thái vòng đời', () => {
    expect(QUEUE_STATUSES).toHaveLength(8)
  })
})

describe('src/data/content-queue.json', () => {
  it('file queue đã commit luôn hợp lệ', () => {
    const path = fileURLToPath(new URL('../../data/content-queue.json', import.meta.url))
    const data = JSON.parse(readFileSync(path, 'utf8'))
    expect(validateQueue(data)).toEqual([])
  })
})
