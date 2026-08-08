import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initAnalytics, trackOutboundClick, trackToolClick } from '@/lib/analytics'

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

describe('trackToolClick', () => {
  it('bắn event tool_click kèm tên công cụ và đường dẫn', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackToolClick({ tool: 'AoE4 World', path: '/tools/' })

    expect(gtag).toHaveBeenCalledWith('event', 'tool_click', {
      tool: 'AoE4 World',
      page_path: '/tools/',
    })
  })

  it('không bắn event join_community_click', () => {
    const gtag = vi.fn()
    window.gtag = gtag

    trackToolClick({ tool: 'Aegis', path: '/tools/' })

    const events = gtag.mock.calls.map((c) => c[1])
    expect(events).not.toContain('join_community_click')
  })

  it('im lặng khi analytics tắt', () => {
    window.gtag = undefined
    expect(() => trackToolClick({ tool: 'Aegis', path: '/tools/' })).not.toThrow()
  })
})
