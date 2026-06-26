import { describe, it, expect } from 'vitest'
import { faqItems } from '../faq'

describe('faqItems', () => {
  it('giữ số lượng giới hạn (4-8 mục)', () => {
    expect(faqItems.length).toBeGreaterThanOrEqual(4)
    expect(faqItems.length).toBeLessThanOrEqual(8)
  })

  it('mỗi mục có câu hỏi và câu trả lời không rỗng', () => {
    for (const item of faqItems) {
      expect(item.question.trim()).toBeTruthy()
      expect(item.answer.trim().length).toBeGreaterThan(20)
    }
  })

  it('câu hỏi không trùng lặp', () => {
    const questions = faqItems.map((i) => i.question)
    expect(new Set(questions).size).toBe(questions.length)
  })
})
