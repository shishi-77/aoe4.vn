import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CtaButton from '@/components/CtaButton.vue'

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
})
