import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DlcSection from '../DlcSection.vue'

type DlcProps = {
  name: string
  fullName: string
  releaseDate: string | null
  predictedReleaseDate: string | null
  releaseLabel: string
  civs: string[]
  highlights: string[]
  steamUrl: string
}

function makeDlc(overrides: Partial<DlcProps> = {}): DlcProps {
  return {
    name: 'Raiders of the North',
    fullName: 'Age of Empires IV: Raiders of the North',
    releaseDate: null,
    predictedReleaseDate: null,
    releaseLabel: 'Q4 2026',
    civs: ['Vikings', 'Scots'],
    highlights: ['Hai civ mới', '4 nhiệm vụ Crucible', 'Hai biome mới'],
    steamUrl: 'https://store.steampowered.com/app/4336170',
    ...overrides,
  }
}

describe('DlcSection', () => {
  it('hiển thị nhãn release khi cả hai ngày đều null', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    expect(wrapper.text()).toContain('Q4 2026')
    expect(wrapper.find('[role="timer"]').exists()).toBe(false)
  })

  it('bật countdown + nhãn (dự kiến) khi chỉ có ngày dự đoán', () => {
    const wrapper = mount(DlcSection, {
      props: { dlc: makeDlc({ predictedReleaseDate: '2099-01-01T00:00:00+07:00' }) },
    })
    expect(wrapper.find('[role="timer"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('(dự kiến)')
  })

  it('bật countdown KHÔNG có nhãn (dự kiến) khi có ngày chính thức', () => {
    const wrapper = mount(DlcSection, {
      props: { dlc: makeDlc({ releaseDate: '2099-01-01T00:00:00+07:00' }) },
    })
    expect(wrapper.find('[role="timer"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('(dự kiến)')
  })

  it('render chip cho mỗi civ', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    const chips = wrapper.findAll('[data-testid="civ-chip"]')
    expect(chips).toHaveLength(2)
    expect(chips[0].text()).toBe('Vikings')
    expect(chips[1].text()).toBe('Scots')
  })

  it('CTA Steam trỏ đúng url', () => {
    const wrapper = mount(DlcSection, { props: { dlc: makeDlc() } })
    expect(wrapper.find('a[href^="https://store.steampowered.com"]').exists()).toBe(true)
  })
})
