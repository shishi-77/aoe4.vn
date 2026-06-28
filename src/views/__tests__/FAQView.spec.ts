import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FAQView from '@/views/FAQView.vue'
import { faqItems } from '@/data/faq'
import { site } from '@/data/site'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

const mountOptions = {
  global: {
    stubs: { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } },
  },
}

describe('FAQView', () => {
  it('hiển thị tất cả câu hỏi FAQ', () => {
    const wrapper = mount(FAQView, mountOptions)
    for (const item of faqItems) {
      expect(wrapper.text()).toContain(item.question)
    }
  })

  it('có CTA Discord dẫn về cộng đồng', () => {
    const wrapper = mount(FAQView, mountOptions)
    expect(wrapper.find(`a[href="${site.links.discord}"]`).exists()).toBe(true)
  })

  it('liên kết nội bộ tới guide cho mỗi mục có guide', () => {
    const wrapper = mount(FAQView, mountOptions)
    for (const item of faqItems) {
      if (!item.guide) continue
      const link = wrapper.find(`a[href="/guides/${item.guide.slug}"]`)
      expect(link.exists()).toBe(true)
      expect(link.text()).toContain(item.guide.label)
    }
  })
})
