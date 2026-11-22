import { useGitHubStore } from '~/stores/github'

/**
 * GitHub stars of buggregator/server: the exact count and a short one
 * («1.1k»). Both are null until the GitHub data has loaded.
 */
export function useServerStars() {
  const github = useGitHubStore()
  const count = computed(() => github.getRepo('server')?.stars || null)
  const short = computed(() => count.value === null
    ? null
    : new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count.value))
  const exact = computed(() => count.value === null ? null : new Intl.NumberFormat('en').format(count.value))
  return { count, short, exact }
}
