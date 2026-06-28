import type { Guide } from './index'

export const templateGuide: Guide = {
  slug: 'doi-slug-khong-dau',
  title: 'Tiêu đề bài hướng dẫn',
  description: 'Mô tả 1-2 câu cho SEO, trên 20 ký tự.',
  updatedAt: '2026-01-01',
  cta: true,
  sections: [
    {
      heading: 'Tiêu đề mục',
      paragraphs: ['Đoạn văn thứ nhất.', 'Đoạn văn thứ hai.'],
    },
  ],
}
