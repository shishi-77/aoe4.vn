import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PrizeSection from '@/components/sections/PrizeSection.vue'

describe('PrizeSection', () => {
  it('renders all six prize amounts', () => {
    const text = mount(PrizeSection).text()
    for (const amount of ['1.000.000đ', '700.000đ', '500.000đ', '360.000đ', '240.000đ', '200.000đ']) {
      expect(text).toContain(amount)
    }
  })

  it('shows the total prize pool', () => {
    expect(mount(PrizeSection).text()).toContain('3.000.000đ')
  })
})
