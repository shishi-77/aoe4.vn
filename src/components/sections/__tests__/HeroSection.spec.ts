import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '@/components/sections/HeroSection.vue'

describe('HeroSection', () => {
  it('renders the tournament name and a Discord registration CTA', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).toContain('Lạc Hồng Cup')
    const cta = wrapper.get('a')
    expect(cta.attributes('href')).toBe('https://discord.gg/Tzc8rnRk')
    expect(cta.attributes('target')).toBe('_blank')
  })

  it('renders the event date and venue', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).toContain('14/06/2026')
    expect(wrapper.text()).toContain('Net 269')
  })
})
