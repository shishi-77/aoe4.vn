import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CtaButton from '@/components/CtaButton.vue'
import { brandIconPaths } from '@/lib/brands'

describe('CtaButton', () => {
  it('renders an external link that opens in a new tab safely', () => {
    const wrapper = mount(CtaButton, {
      props: { href: 'https://discord.gg/Bshbqw7nHN' },
      slots: { default: 'Đăng ký ngay' },
    })
    const a = wrapper.get('a')
    expect(a.attributes('href')).toBe('https://discord.gg/Bshbqw7nHN')
    expect(a.attributes('target')).toBe('_blank')
    expect(a.attributes('rel')).toBe('noopener noreferrer')
    expect(a.text()).toBe('Đăng ký ngay')
  })

  it('mặc định dùng nền vàng và không kèm logo nền tảng', () => {
    const wrapper = mount(CtaButton, {
      props: { href: 'https://discord.gg/Bshbqw7nHN' },
      slots: { default: 'Đăng ký ngay' },
    })
    expect(wrapper.get('a').classes()).toContain('bg-gold')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('variant youtube đổi sang màu thương hiệu kèm logo YouTube', () => {
    const wrapper = mount(CtaButton, {
      props: { href: 'https://youtube.com/@clearmanaoe4', variant: 'youtube' },
      slots: { default: 'Xem trực tiếp' },
    })
    const a = wrapper.get('a')
    expect(a.classes()).toContain('bg-youtube')
    expect(a.classes()).not.toContain('bg-gold')
    expect(wrapper.get('svg path').attributes('d')).toBe(brandIconPaths.youtube)
  })
})
