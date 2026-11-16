import type { Ref } from 'vue'

/**
 * Plays a muted video while at least half of it is on screen and pauses it
 * when it leaves. With «reduce motion» on, it never starts by itself (the
 * poster and the native controls stay). Browser-only: runs after mount, so
 * the server and client HTML are the same.
 *
 * Owns: the observer and its cleanup. The caller owns the <video> element.
 */
export function useInViewAutoplay(video: Ref<HTMLVideoElement | null>) {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = video.value
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // A pause while the video is on screen is the person's choice: scrolling
    // away and back does not undo it. Our own pause happens off screen.
    let isVisible = false
    let pausedByPerson = false
    el.addEventListener('pause', () => { pausedByPerson = isVisible && !el.ended })
    el.addEventListener('play', () => { pausedByPerson = false })

    observer = new IntersectionObserver(([entry]) => {
      isVisible = !!entry?.isIntersecting
      if (isVisible && !pausedByPerson) {
        el.play().catch(() => { /* autoplay refused: the poster stays */ })
      } else if (!isVisible && !el.paused) {
        el.pause()
      }
    }, { threshold: 0.5 })
    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
