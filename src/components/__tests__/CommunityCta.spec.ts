import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import CommunityCta from '@/components/CommunityCta.vue'
import { site } from '@/data/site'

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/guides/cach-tai-aoe4/' }),
}))

describe('CommunityCta', () => {
  beforeEach(() => {
    delete window.gtag
  })

  it('hiển thị hai nút Facebook Group và Discord', () => {
    const wrapper = mount(CommunityCta)
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain(site.links.facebook)
    expect(hrefs).toContain(site.links.discord)
  })

  it('click Discord bắn event với placement mặc định article_footer', async () => {
    const gtag = vi.fn()
    window.gtag = gtag
    const wrapper = mount(CommunityCta)
    await wrapper.get(`a[href="${site.links.discord}"]`).trigger('click')
    expect(gtag).toHaveBeenCalledWith('event', 'join_community_click', {
      channel: 'discord',
      placement: 'article_footer',
      page_path: '/guides/cach-tai-aoe4/',
    })
  })

  it('click Facebook tôn trọng prop placement', async () => {
    const gtag = vi.fn()
    window.gtag = gtag
    const wrapper = mount(CommunityCta, { props: { placement: 'homepage' } })
    await wrapper.get(`a[href="${site.links.facebook}"]`).trigger('click')
    expect(gtag).toHaveBeenCalledWith('event', 'join_community_click', {
      channel: 'facebook',
      placement: 'homepage',
      page_path: '/guides/cach-tai-aoe4/',
    })
  })
})
