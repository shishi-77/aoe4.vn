import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Gắn `el` vào phần tử có class `reveal`. Khi phần tử vào viewport, thêm class
 * `is-visible` (kích hoạt hiệu ứng fade-up trong CSS) rồi ngừng theo dõi.
 * Nếu không có IntersectionObserver, hiện ngay.
 */
export function useReveal(): { el: Ref<HTMLElement | null> } {
  const el = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    const node = el.value
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
  })

  onUnmounted(() => observer?.disconnect())

  return { el }
}
