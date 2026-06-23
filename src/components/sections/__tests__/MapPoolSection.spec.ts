import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapPoolSection from '@/components/sections/MapPoolSection.vue'
import { lacHong } from '@/data/tournaments/lac-hong'

describe('MapPoolSection', () => {
  it('renders all nine maps', () => {
    const wrapper = mount(MapPoolSection, { props: { tournament: lacHong } })
    const text = wrapper.text()
    expect(lacHong.maps).toHaveLength(9)
    for (const map of lacHong.maps) {
      expect(text).toContain(map)
    }
  })

  it('links to the map pool preset', () => {
    const wrapper = mount(MapPoolSection, { props: { tournament: lacHong } })
    const link = wrapper.find('a[href="https://aoe2cm.net/preset/IZcEi"]')
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
  })

  it('ẩn nút map pool khi không có link', () => {
    const noLink = { ...lacHong, links: { ...lacHong.links, mapPool: '' } }
    const wrapper = mount(MapPoolSection, { props: { tournament: noLink } })
    expect(wrapper.text()).not.toContain('Xem Map Pool')
  })
})
