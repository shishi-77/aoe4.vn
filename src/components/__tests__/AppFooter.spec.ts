import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '@/components/AppFooter.vue'
import { site } from '@/data/site'

describe('AppFooter', () => {
  it('liên kết AhaSlides', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.find(`a[href="${site.ahaslides.url}"]`).exists()).toBe(true)
  })

  it('hiển thị copyright với năm hiện tại', () => {
    const wrapper = mount(AppFooter)
    expect(wrapper.text()).toContain(String(new Date().getFullYear()))
  })
})
