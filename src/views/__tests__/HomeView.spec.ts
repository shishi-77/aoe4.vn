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
})
