import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterSection from '@/components/sections/FooterSection.vue'
import { lacHong } from '@/data/tournaments/lac-hong'

describe('FooterSection', () => {
  it('renders a Discord CTA and contact link', () => {
    const wrapper = mount(FooterSection, { props: { tournament: lacHong } })
    const discordLinks = wrapper.findAll(`a[href="${lacHong.links.discord}"]`)
    expect(discordLinks.length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain(lacHong.name)
  })
})
