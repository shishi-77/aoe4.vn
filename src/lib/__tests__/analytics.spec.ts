import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initAnalytics, trackOutboundClick } from '@/lib/analytics'

beforeEach(() => {
  delete window.gtag
  delete window.dataLayer
  document.head
    .querySelectorAll('script[src*="googletagmanager"]')
    .forEach((s) => s.remove())
})

describe('initAnalytics', () => {
  it('không làm gì khi measurement id rỗng', () => {
    initAnalytics('')
    expect(window.gtag).toBeUndefined()
    expect(document.head.querySelector('script[src*="googletagmanager"]')).toBeNull()
  })

  it('khai báo gtag và chèn script loader khi có id', () => {
    initAnalytics('G-TEST123')
    expect(typeof window.gtag).toBe('function')
    const script = document.head.querySelector('script[src*="googletagmanager"]')
    expect(script?.getAttribute('src')).toContain('G-TEST123')
    expect(script?.hasAttribute('async')).toBe(true)
  })
})

describe('trackOutboundClick', () => {
  it('không ném lỗi khi gtag chưa được nạp', () => {
    expect(() =>
      trackOutboundClick({ channel: 'discord', placement: 'header', path: '/' }),
    ).not.toThrow()
  })

  it('bắn event join_community_click kèm channel, placement, page_path', () => {
    const gtag = vi.fn()
    window.gtag = gtag
    trackOutboundClick({
      channel: 'facebook',
      placement: 'article_footer',
      path: '/guides/cach-tai-aoe4/',
    })
    expect(gtag).toHaveBeenCalledWith('event', 'join_community_click', {
      channel: 'facebook',
      placement: 'article_footer',
      page_path: '/guides/cach-tai-aoe4/',
    })
  })
})
