import type { Ref } from 'vue'

/**
 * Tracks whether a horizontally scrollable element has more content
 * to the left (`canScrollLeft`) and to the right (`canScrollRight`).
 * Both are false on the server and before mount, so server and client
 * HTML match; they update on scroll and on resize.
 */
export function useScrollEdges(el: Ref<HTMLElement | null | undefined>) {
  const canScrollLeft = ref(false)
  const canScrollRight = ref(false)
  let observer: ResizeObserver | null = null

  const update = () => {
    const node = el.value
    if (!node) return
    const max = node.scrollWidth - node.clientWidth
    canScrollLeft.value = node.scrollLeft > 1
    canScrollRight.value = node.scrollLeft < max - 1
  }

  onMounted(() => {
    const node = el.value
    if (!node) return
    node.addEventListener('scroll', update, { passive: true })
    observer = new ResizeObserver(update)
    observer.observe(node)
    update()
  })

  onUnmounted(() => {
    el.value?.removeEventListener('scroll', update)
    observer?.disconnect()
  })

  return { canScrollLeft, canScrollRight }
}
