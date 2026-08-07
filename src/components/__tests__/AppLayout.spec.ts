import { mount } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import AppLayout from '../AppLayout.vue'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

const Blank = { template: '<div />' }

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Blank },
      { path: '/faq/', component: Blank },
      { path: '/tournaments/', component: Blank },
      { path: '/guides/', component: Blank },
      { path: '/news/', component: Blank },
    ],
  })
}

async function mountLayout() {
  const router = createTestRouter()
  router.push('/')
  await router.isReady()
  return mount(AppLayout, { attachTo: document.body, global: { plugins: [router] } })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('AppLayout', () => {
  it('đặt skip link làm phần tử focus được đầu tiên của trang', async () => {
    const wrapper = await mountLayout()
    const firstFocusable = wrapper.element.parentElement?.querySelector(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    )

    expect(firstFocusable?.getAttribute('href')).toBe('#main-content')
    expect(firstFocusable?.textContent?.trim()).toBe('Bỏ qua tới nội dung chính')
  })

  it('ẩn skip link cho tới khi nhận focus', async () => {
    const wrapper = await mountLayout()
    const skip = wrapper.get('a[href="#main-content"]')

    expect(skip.classes()).toContain('sr-only')
    expect(skip.classes()).toContain('focus:not-sr-only')
  })

  it('cho skip link một đích nhảy focus được trong main', async () => {
    const wrapper = await mountLayout()
    const main = wrapper.get('main')

    expect(main.attributes('id')).toBe('main-content')
    expect(main.attributes('tabindex')).toBe('-1')
  })

  it('chuyển focus vào main khi bấm skip link, không đổi route', async () => {
    const wrapper = await mountLayout()
    const skip = wrapper.get('a[href="#main-content"]')

    await skip.trigger('click')

    expect(document.activeElement).toBe(wrapper.get('main').element)
  })
})
