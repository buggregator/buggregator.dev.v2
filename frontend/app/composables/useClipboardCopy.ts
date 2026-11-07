/**
 * Copy text to the clipboard and show «copied» for a short while.
 * `copy(text)` resolves to true when the text reached the clipboard;
 * older browsers without the Clipboard API get a hidden-textarea fallback.
 */
export function useClipboardCopy(resetAfterMs = 2000) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function fallbackCopy(text: string): boolean {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  }

  async function copy(text: string): Promise<boolean> {
    let ok: boolean
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      ok = fallbackCopy(text)
    }
    if (ok) {
      copied.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { copied.value = false }, resetAfterMs)
    }
    return ok
  }

  onUnmounted(() => { if (timer) clearTimeout(timer) })

  return { copied, copy }
}
