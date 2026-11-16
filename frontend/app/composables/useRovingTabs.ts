import type { Ref } from 'vue'

/**
 * Keyboard for a WAI-ARIA tab list: ←/→ move to the previous/next tab
 * (wrapping), Home/End to the first/last; the tab that gets focus becomes
 * active. Only the active tab is in the Tab order (`tabindex(id)`).
 *
 * Owns: nothing but the key handling. The caller owns `active` and renders
 * the buttons with `ref`s keyed by id (`setTabRef`).
 */
export function useRovingTabs<T extends string>(ids: readonly T[], active: Ref<T>) {
  const buttons = new Map<T, HTMLElement>()

  function setTabRef(id: T, el: unknown) {
    if (el instanceof HTMLElement) buttons.set(id, el)
    else buttons.delete(id)
  }

  function tabindex(id: T): 0 | -1 {
    return id === active.value ? 0 : -1
  }

  function select(id: T) {
    active.value = id
    buttons.get(id)?.focus()
  }

  function onKeydown(e: KeyboardEvent) {
    const i = ids.indexOf(active.value)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % ids.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + ids.length) % ids.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = ids.length - 1
    if (next === null) return
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    select(ids[next]!)
  }

  return { setTabRef, tabindex, onKeydown }
}
