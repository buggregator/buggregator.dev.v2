/**
 * True once mounted on a screen at least `lg` (1024 px) wide.
 * False on the server and before mount, so server and client HTML match;
 * heavy media (hero video, demo iframe) loads only when this turns true.
 */
export function useIsDesktop(minWidth = 1024) {
  const isDesktop = ref(false)
  let query: MediaQueryList | null = null
  const update = () => { isDesktop.value = query?.matches ?? false }

  onMounted(() => {
    query = window.matchMedia(`(min-width: ${minWidth}px)`)
    update()
    query.addEventListener('change', update)
  })
  onUnmounted(() => query?.removeEventListener('change', update))

  return isDesktop
}
