import { bugCatchToast, BUG_CATCH_FINAL } from '~/data/footer'

/**
 * The footer's «catch the bug» easter egg (#6758): clicks on the logo count
 * caught bugs, the toast says so. Nothing leaves the page.
 */
export function useBugCatch() {
  const count = ref(0)
  const toast = computed(() => bugCatchToast(count.value))

  function catchOne() {
    count.value = Math.min(count.value + 1, BUG_CATCH_FINAL)
  }

  function close() {
    count.value = 0
  }

  return { toast, catchOne, close }
}
