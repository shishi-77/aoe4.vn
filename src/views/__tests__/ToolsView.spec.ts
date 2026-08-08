import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ToolsView from '@/views/ToolsView.vue'
import { tools, TOOL_CATEGORIES, toolsByCategory } from '@/data/tools'

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn(),
  useHeadSafe: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/tools/' }),
}))

const trackToolClick = vi.fn()
vi.mock('@/lib/analytics', () => ({
  trackToolClick: (...args: unknown[]) => trackToolClick(...args),
}))

describe('ToolsView', () => {
  it('hiển thị mọi công cụ đúng một lần, kèm mô tả', () => {
    const wrapper = mount(ToolsView)
    for (const t of tools) {
      expect(wrapper.findAll(`a[href="${t.url}"]`)).toHaveLength(1)
      expect(wrapper.text()).toContain(t.description)
    }
  })

  it('mọi link ra ngoài mở tab mới và có rel an toàn', () => {
    const wrapper = mount(ToolsView)
    for (const t of tools) {
      const link = wrapper.get(`a[href="${t.url}"]`)
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    }
  })

  it('văn bản link là tên công cụ, không phải "tại đây"', () => {
    const wrapper = mount(ToolsView)
    for (const t of tools) {
      expect(wrapper.get(`a[href="${t.url}"]`).text()).toContain(t.name)
    }
  })

  it('nhóm theo TOOL_CATEGORIES và bỏ qua nhóm rỗng', () => {
    const wrapper = mount(ToolsView)
    const headings = wrapper.findAll('h2').map((h) => h.text())
    const expected = TOOL_CATEGORIES.filter((c) => toolsByCategory(c).length > 0)
    expect(headings).toEqual([...expected])
  })

  it('nêu rõ game mà công cụ phục vụ', () => {
    const wrapper = mount(ToolsView)
    expect(wrapper.text()).toContain('Đế chế 2')
  })

  it('báo click công cụ về analytics', async () => {
    trackToolClick.mockClear()
    const wrapper = mount(ToolsView)
    await wrapper.get(`a[href="${tools[0].url}"]`).trigger('click')
    expect(trackToolClick).toHaveBeenCalledWith({ tool: tools[0].name, path: '/tools/' })
  })
})
