import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormatSection from '@/components/sections/FormatSection.vue'
import { lacHong } from '@/data/tournaments/lac-hong'

describe('FormatSection', () => {
  it('links to the ban/pick preset in a new tab', () => {
    const wrapper = mount(FormatSection, { props: { tournament: lacHong } })
    const link = wrapper.find('a[href="https://aoe2cm.net/preset/QHani"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('mentions the BO3 knockout format', () => {
    expect(mount(FormatSection, { props: { tournament: lacHong } }).text()).toContain('BO3')
  })
})
