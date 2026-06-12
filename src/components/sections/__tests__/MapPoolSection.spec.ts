import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapPoolSection from '@/components/sections/MapPoolSection.vue'
import { tournament } from '@/data/tournament'

describe('MapPoolSection', () => {
  it('renders all nine maps', () => {
    const text = mount(MapPoolSection).text()
    expect(tournament.maps).toHaveLength(9)
    for (const map of tournament.maps) {
      expect(text).toContain(map)
    }
  })

  it('links to the map pool preset', () => {
    const wrapper = mount(MapPoolSection)
    const link = wrapper.find('a[href="https://aoe2cm.net/preset/IZcEi"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
  })
})
