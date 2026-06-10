import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '@/components/sections/HeroSection.vue'
import { tournament } from '@/data/tournament'

describe('HeroSection', () => {
  it('renders the tournament name and a Discord registration CTA', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).toContain(tournament.name)
    const cta = wrapper.get('a')
    expect(cta.attributes('href')).toBe(tournament.links.discord)
    expect(cta.attributes('target')).toBe('_blank')
  })

  it('renders the event date and venue', () => {
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).toContain('14/06/2026')
    expect(wrapper.text()).toContain(tournament.venue.name)
  })
})
