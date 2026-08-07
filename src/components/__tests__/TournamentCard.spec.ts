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

  it('mặc định đặt tên giải ở h2, cho trang danh sách giải đấu', () => {
    const wrapper = mount(TournamentCard, { props: { tournament: lacHong }, ...mountOptions })
    expect(wrapper.get('h2').text()).toBe(lacHong.name)
  })

  it('hạ xuống h3 khi nằm dưới một section title trên trang chủ', () => {
    const wrapper = mount(TournamentCard, {
      props: { tournament: lacHong, headingLevel: 'h3' },
      ...mountOptions,
    })
    expect(wrapper.get('h3').text()).toBe(lacHong.name)
    expect(wrapper.find('h2').exists()).toBe(false)
  })
})
