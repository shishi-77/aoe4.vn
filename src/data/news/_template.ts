import type { NewsPost } from './index'

export const templateNewsPost: NewsPost = {
  slug: 'doi-slug-khong-dau',
  title: 'Tiêu đề bản tin',
  description: 'Mô tả 1-2 câu cho SEO, trên 20 ký tự.',
  publishedAt: '2026-01-01',
  cta: true,
  sources: [{ label: 'Tên nguồn - trang gốc', url: 'https://example.com/patch-notes' }],
  sections: [
    {
      heading: 'Tiêu đề mục',
      paragraphs: ['Đoạn văn thứ nhất.', 'Đoạn văn thứ hai.'],
    },
  ],
}
