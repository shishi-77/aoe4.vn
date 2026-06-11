import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSection from '@/components/sections/HeroSection.vue'
import { tournament } from '@/data/tournament'

describe('HeroSection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('before registration closes', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-06-01T12:00:00+07:00'))
    })

    it('renders the tournament name and a Discord registration CTA', () => {
      const wrapper = mount(HeroSection)
      expect(wrapper.text()).toContain(tournament.name)
      expect(wrapper.text()).toContain('Đăng ký ngay')
      const cta = wrapper.get(`a[href="${tournament.links.discord}"]`)
      expect(cta.attributes('target')).toBe('_blank')
    })

    it('renders the event date and a venue link to Google Maps', () => {
      const wrapper = mount(HeroSection)
      expect(wrapper.text()).toContain('14/06/2026')
      const venueLink = wrapper.get(`a[href="${tournament.venue.mapsUrl}"]`)
      expect(venueLink.text()).toContain(tournament.venue.name)
    })

    it('renders a countdown with fixed-width unit boxes', () => {
      const wrapper = mount(HeroSection)
      const timer = wrapper.get('[role="timer"]')
      expect(timer.findAll('div[aria-label]')).toHaveLength(4)
      expect(timer.html()).toContain('tabular-nums')
    })
  })

  describe('after registration closes, before the event', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-06-10T12:00:00+07:00'))
    })

    it('switches the CTA to joining Discord', () => {
      const wrapper = mount(HeroSection)
      expect(wrapper.text()).toContain('Tham gia Discord')
      expect(wrapper.text()).toContain('hết hạn đăng ký')
      expect(wrapper.text()).not.toContain('Đăng ký ngay')
    })
  })

  describe('while the event is live', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-06-14T15:00:00+07:00'))
    })

    it('shows the live banner with a YouTube CTA instead of the countdown', () => {
      const wrapper = mount(HeroSection)
      expect(wrapper.text()).toContain('Giải đấu đang diễn ra')
      expect(wrapper.find('[role="timer"]').exists()).toBe(false)
      expect(wrapper.find(`a[href="${tournament.links.youtube}"]`).exists()).toBe(true)
    })
  })

  describe('after the event ends', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00+07:00'))
    })

    it('shows the ended banner with a YouTube replay CTA', () => {
      const wrapper = mount(HeroSection)
      expect(wrapper.text()).toContain('Giải đấu đã kết thúc')
      expect(wrapper.find(`a[href="${tournament.links.youtube}"]`).exists()).toBe(true)
    })
  })
})
