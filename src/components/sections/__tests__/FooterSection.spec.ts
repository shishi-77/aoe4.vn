import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterSection from '@/components/sections/FooterSection.vue'
import { tournament } from '@/data/tournament'

describe('FooterSection', () => {
  it('renders a Discord CTA and contact link', () => {
    const wrapper = mount(FooterSection)
    const discordLinks = wrapper.findAll(`a[href="${tournament.links.discord}"]`)
    expect(discordLinks.length).toBeGreaterThanOrEqual(1)
    expect(wrapper.text()).toContain(tournament.name)
  })
})
