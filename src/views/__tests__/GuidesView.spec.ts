import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import GuidesView from '@/views/GuidesView.vue'
import { guides, GUIDE_GROUPS, guidesByKind } from '@/data/guides'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

const mountOptions = {
  global: {
    stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
  },
}

describe('GuidesView', () => {
  it('hiển thị mọi guide đúng một lần, không bỏ sót bài nào', () => {
    const wrapper = mount(GuidesView, mountOptions)
    for (const g of guides) {
      expect(wrapper.findAll(`a[href="/guides/${g.slug}/"]`)).toHaveLength(1)
    }
  })

  it('nhóm theo GUIDE_GROUPS và bỏ qua nhóm rỗng', () => {
    const wrapper = mount(GuidesView, mountOptions)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    const expected = GUIDE_GROUPS.filter((g) => guidesByKind(g.kind).length > 0).map(
      (g) => g.heading,
    )
    expect(headings).toEqual(expected)
  })

  it('đặt tiêu đề bài ở h3 để không nhảy cấp heading', () => {
    const wrapper = mount(GuidesView, mountOptions)
    const titles = wrapper.findAll('h3').map((h) => h.text())
    expect(titles).toHaveLength(guides.length)
  })
})
