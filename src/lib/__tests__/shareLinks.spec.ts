import { describe, it, expect } from 'vitest'
import { shareLink } from '@/lib/shareLinks'

describe('shareLink', () => {
  it('sinh URL tuyệt đối kèm đủ 3 tham số UTM', () => {
    const url = new URL(shareLink('/guides/cach-tai-aoe4/', 'facebook'))
    expect(url.origin).toBe('https://aoe4.vn')
    expect(url.pathname).toBe('/guides/cach-tai-aoe4/')
    expect(url.searchParams.get('utm_source')).toBe('facebook')
    expect(url.searchParams.get('utm_medium')).toBe('social')
    expect(url.searchParams.get('utm_campaign')).toBe('article_share')
  })

  it('phân biệt nguồn discord', () => {
    const url = new URL(shareLink('/news/vi-du/', 'discord'))
    expect(url.searchParams.get('utm_source')).toBe('discord')
  })
})
