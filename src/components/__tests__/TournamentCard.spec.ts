import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TournamentCard from '../TournamentCard.vue'
import { lacHong } from '@/data/tournaments/lac-hong'

const mountOptions = {
  global: {
    stubs: { RouterLink: { template: '<a><slot /></a>' } },
  },
}

describe('TournamentCard', () => {
  it('hiển thị tên và ngày', () => {
    const wrapper = mount(TournamentCard, { props: { tournament: lacHong }, ...mountOptions })
    expect(wrapper.text()).toContain('Lạc Hồng Cup')
    expect(wrapper.text()).toContain(lacHong.dateLabel)
  })

  it('hiển thị badge trạng thái', () => {
    const wrapper = mount(TournamentCard, { props: { tournament: lacHong }, ...mountOptions })
    expect(wrapper.text()).toMatch(/sắp diễn ra|đang diễn ra|đã kết thúc/i)
  })
})
