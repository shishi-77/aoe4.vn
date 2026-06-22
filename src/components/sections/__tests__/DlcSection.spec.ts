import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DlcSection from '../DlcSection.vue'

describe('DlcSection', () => {
  it('hiển thị nhãn release khi chưa có ngày', () => {
    const wrapper = mount(DlcSection, {
      props: { dlc: { name: 'X', fullName: 'X', releaseDate: null, releaseLabel: 'Q4 2026', civs: [], highlights: ['a'], steamUrl: 'https://store.steampowered.com/app/1' } },
    })
    expect(wrapper.text()).toContain('Q4 2026')
    expect(wrapper.find('[role="timer"]').exists()).toBe(false)
  })

  it('hiển thị đồng hồ khi có releaseDate tương lai', () => {
    const future = '2099-01-01T00:00:00+07:00'
    const wrapper = mount(DlcSection, {
      props: { dlc: { name: 'X', fullName: 'X', releaseDate: future, releaseLabel: 'Q4 2026', civs: [], highlights: ['a'], steamUrl: 'https://store.steampowered.com/app/1' } },
    })
    expect(wrapper.find('[role="timer"]').exists()).toBe(true)
  })
})
