import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '@/components/AppFooter.vue'
import { site } from '@/data/site'

describe('AppFooter', () => {
  const stubs = { RouterLink: { template: '<a><slot /></a>' } }

  it('liên kết Discord, Blog và AhaSlides', () => {
    const wrapper = mount(AppFooter, { global: { stubs } })
    expect(wrapper.find(`a[href="${site.links.discord}"]`).exists()).toBe(true)
    expect(wrapper.find(`a[href="${site.links.blog}"]`).exists()).toBe(true)
    expect(wrapper.find(`a[href="${site.ahaslides.url}"]`).exists()).toBe(true)
  })

  it('hiển thị copyright với năm hiện tại', () => {
    const wrapper = mount(AppFooter, { global: { stubs } })
    expect(wrapper.text()).toContain(String(new Date().getFullYear()))
  })
})
