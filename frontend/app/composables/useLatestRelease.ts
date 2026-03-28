export type ReleaseInfo = {
  version: string | null
  publishedAt: string | null
  url: string | null
  isNew: boolean
}

export const useLatestRelease = () => {
  const { data, status } = useFetch<Omit<ReleaseInfo, 'isNew'>>('/api/version', {
    transform: (raw): ReleaseInfo => ({
      ...raw,
      isNew: raw.publishedAt
        ? (Date.now() - new Date(raw.publishedAt).getTime()) < 7 * 24 * 60 * 60 * 1000
        : false,
    }),
    lazy: true,
  })

  return {
    release: data as Ref<ReleaseInfo | null>,
    isLoading: computed(() => status.value === 'pending'),
  }
}
