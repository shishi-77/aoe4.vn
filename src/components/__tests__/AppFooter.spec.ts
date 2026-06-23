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

  it('liên kết GitHub repo mã nguồn mở', () => {
    const wrapper = mount(AppFooter)
    const link = wrapper.find(`a[href="${site.links.github}"]`)
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.text()).toContain('Mã nguồn mở')
  })
})
