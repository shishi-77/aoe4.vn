import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import HomeView from '../HomeView.vue'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

describe('HomeView', () => {
  it('chèn NorseDivider giữa các section', () => {
    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    expect(wrapper.find('svg.norse-divider').exists()).toBe(true)
  })

  it('liệt kê link tới từng guide với trailing slash', () => {
    const wrapper = mount(HomeView, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const targets = wrapper
      .findAllComponents(RouterLinkStub)
      .map((l) => l.props('to'))
    expect(targets).toContain('/guides/cach-tai-aoe4/')
    expect(targets).toContain('/guides/')
  })
})
