import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Ghi vị trí cuộn (px) vào CSS var `--scroll` trên `el`, để các lớp nền hero
 * dịch chuyển parallax bằng calc(). Hero nằm ở đầu trang nên dùng thẳng
 * window.scrollY. Tắt hoàn toàn khi prefers-reduced-motion hoặc không có window.
 */
export function useParallax(): { el: Ref<HTMLElement | null> } {
  const el = ref<HTMLElement | null>(null)
  let onScroll: (() => void) | undefined

  onMounted(() => {
    const node = el.value
    if (!node || typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const update = () => {
      node.style.setProperty('--scroll', `${window.scrollY}`)
    }
    onScroll = update
    update()
    window.addEventListener('scroll', update, { passive: true })
  })

  onUnmounted(() => {
    if (onScroll) window.removeEventListener('scroll', onScroll)
  })

  return { el }
}
