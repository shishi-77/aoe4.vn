import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import { site } from '@/data/site'
import AppNavbar from '../AppNavbar.vue'

const Blank = { template: '<div />' }

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Blank },
      { path: '/faq/', component: Blank },
      { path: '/tournaments/', component: Blank },
      { path: '/guides/', component: Blank },
      { path: '/tools/', component: Blank },
      { path: '/news/', component: Blank },
    ],
  })
}

async function mountNavbar() {
  const router = createTestRouter()
  router.push('/')
  await router.isReady()
  // Attached to the document so focus assertions can read document.activeElement.
  return {
    router,
    wrapper: mount(AppNavbar, { attachTo: document.body, global: { plugins: [router] } }),
  }
}

describe('AppNavbar', () => {
  it('hiển thị logo trong brand link về trang chủ', async () => {
    const { wrapper } = await mountNavbar()
    const brand = wrapper.get('a[href="/"]')
    const img = brand.get('img')
    expect(img.attributes('src')).toBe('/favicon.webp')
    expect(img.attributes('alt')).toBe('')
    expect(img.attributes('width')).toBe('32')
    expect(img.attributes('height')).toBe('32')
    expect(brand.text()).toContain('AoE4 VN')
  })

  it('dùng Facebook làm CTA duy nhất, bỏ Discord và link Trang chủ', async () => {
    const { wrapper } = await mountNavbar()

    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).not.toContain(site.links.discord)
    expect(wrapper.text()).not.toContain('Trang chủ')

    const facebookLinks = wrapper.findAll(`a[href="${site.links.facebook}"]`)
    expect(facebookLinks).toHaveLength(1)
    const facebook = facebookLinks[0]
    expect(facebook.classes()).toContain('bg-facebook')
    expect(facebook.attributes('target')).toBe('_blank')
    expect(facebook.attributes('rel')).toBe('noopener noreferrer')
  })

  it('giữ menu sau nút ☰ cho tới breakpoint lg, gồm cả tablet', async () => {
    const { wrapper } = await mountNavbar()

    const toggle = wrapper.get('button[aria-label="Mở menu"]')
    expect(toggle.classes()).toContain('lg:hidden')
    expect(toggle.classes()).not.toContain('sm:hidden')

    const panel = wrapper.get('nav > div')
    expect(panel.classes()).toContain('lg:flex')
    expect(panel.classes()).not.toContain('sm:flex')
  })

  it('tự đóng menu mobile sau khi điều hướng sang trang khác', async () => {
    const { router, wrapper } = await mountNavbar()
    const toggle = wrapper.get('button[aria-label="Mở menu"]')
    const panel = wrapper.get('nav > div')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(panel.classes()).toContain('flex')

    await router.push('/guides/')
    await flushPromises()

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(panel.classes()).toContain('hidden')
  })

  it('đổi nhãn ARIA của nút theo trạng thái menu', async () => {
    const { wrapper } = await mountNavbar()
    const toggle = wrapper.get('header button')

    expect(toggle.attributes('aria-label')).toBe('Mở menu')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-label')).toBe('Đóng menu')
  })

  it('trỏ aria-controls của nút tới đúng id của panel menu', async () => {
    const { wrapper } = await mountNavbar()
    const controls = wrapper.get('header button').attributes('aria-controls')

    expect(controls).toBeTruthy()
    expect(wrapper.get('nav > div').attributes('id')).toBe(controls)
  })

  it('đóng menu và trả focus về nút khi nhấn Escape', async () => {
    const { wrapper } = await mountNavbar()
    const toggle = wrapper.get('header button')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await wrapper.get('header').trigger('keydown', { key: 'Escape' })

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('nav > div').classes()).toContain('hidden')
    expect(document.activeElement).toBe(toggle.element)
  })

  it('đóng menu mobile khi bấm link của chính trang đang xem', async () => {
    const { router, wrapper } = await mountNavbar()
    await router.push('/guides/')
    await flushPromises()

    const toggle = wrapper.get('button[aria-label="Mở menu"]')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await wrapper.get('nav > div a[href="/guides/"]').trigger('click')
    await flushPromises()

    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('nav > div').classes()).toContain('hidden')
  })

  it('có link Công cụ trong menu', async () => {
    const { wrapper } = await mountNavbar()
    const link = wrapper.get('nav > div a[href="/tools/"]')
    expect(link.text()).toContain('Công cụ')
  })

  it('giữ link Blog trong header', async () => {
    const { wrapper } = await mountNavbar()
    const hrefs = wrapper.findAll('a').map((a) => a.attributes('href'))
    expect(hrefs).toContain(site.links.blog)
  })

  it('có đúng 7 mục trong menu', async () => {
    const { wrapper } = await mountNavbar()
    expect(wrapper.findAll('nav > div a')).toHaveLength(7)
  })
})
