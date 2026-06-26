import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FAQView from '@/views/FAQView.vue'
import { faqItems } from '@/data/faq'
import { site } from '@/data/site'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

describe('FAQView', () => {
  it('hiển thị tất cả câu hỏi FAQ', () => {
    const wrapper = mount(FAQView)
    for (const item of faqItems) {
      expect(wrapper.text()).toContain(item.question)
    }
  })

  it('có CTA Discord dẫn về cộng đồng', () => {
    const wrapper = mount(FAQView)
    expect(wrapper.find(`a[href="${site.links.discord}"]`).exists()).toBe(true)
  })
})
