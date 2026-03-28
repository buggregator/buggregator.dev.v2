import { useGitHubStore } from '~/stores/github'

export type ReleaseInfo = {
  version: string | null
  publishedAt: string | null
  url: string | null
  isNew: boolean
}

export const useLatestRelease = () => {
  const store = useGitHubStore()

  const release = computed<ReleaseInfo | null>(() => {
    const repo = store.getRepo('server')
    if (!repo?.latest_version) return null

    return {
      version: repo.latest_version,
      publishedAt: repo.published_at || null,
      url: repo.latest_version_url || null,
      isNew: repo.published_at
        ? (Date.now() - new Date(repo.published_at).getTime()) < 7 * 24 * 60 * 60 * 1000
        : false,
    }
  })

  return {
    release,
    isLoading: computed(() => !store.loaded),
  }
}
