import { defineStore } from 'pinia'

export interface RepoInfo {
  slug: string
  repo: string
  stars: number
  forks: number
  open_issues: number
  description: string
  latest_version: string | null
  latest_version_url: string | null
  published_at: string | null
  total_downloads: number
  releases: RepoRelease[]
}

export interface RepoRelease {
  tag: string
  name: string
  date: string
  downloads: number
}

export interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export interface DownloadsInfo {
  docker_pulls: number
  github_releases: {
    total: number
    by_repo: Record<string, number>
  }
  packagist: Record<string, {
    total: number
    monthly: number
    daily: number
  }>
  total: number
}

export interface StatsHistoryEntry {
  date: string
  total_stars: number
  server_downloads: number
  trap_downloads: number
}

export const useGitHubStore = defineStore('github', () => {
  const repos = ref<RepoInfo[]>([])
  const contributors = ref<Contributor[]>([])
  const downloads = ref<DownloadsInfo | null>(null)
  const statsHistory = ref<StatsHistoryEntry[]>([])
  const loaded = ref(false)
  const statsLoaded = ref(false)

  const totalStars = computed(() =>
    repos.value.reduce((sum, r) => sum + (r.stars || 0), 0),
  )

  const totalDownloads = computed(() => downloads.value?.total || 0)

  const serverDownloads = computed(() => {
    if (!downloads.value) return 0
    return (downloads.value.docker_pulls || 0) + (downloads.value.github_releases?.total || 0)
  })

  const trapDownloads = computed(() => {
    return downloads.value?.packagist?.trap?.total || 0
  })

  function getRepo(slug: string) {
    return repos.value.find(r => r.slug === slug) || null
  }

  const serverVersion = computed(() => getRepo('server')?.latest_version || null)

  async function load() {
    if (loaded.value) return

    try {
      const [reposRes, contribRes] = await Promise.all([
        $fetch<{ repos: RepoInfo[]; total_stars: number; downloads: DownloadsInfo | null }>('/api/public/github/repos'),
        $fetch<{ contributors: Contributor[] }>('/api/public/github/contributors'),
      ])

      repos.value = reposRes?.repos || []
      contributors.value = contribRes?.contributors || []
      if (reposRes?.downloads) {
        downloads.value = reposRes.downloads
      }
    } catch {
      // Data will be empty — components handle this gracefully
    }

    loaded.value = true
  }

  async function loadStats() {
    if (statsLoaded.value) return

    try {
      const res = await $fetch<{
        total_stars: number
        downloads: DownloadsInfo | null
        history: StatsHistoryEntry[]
      }>('/api/public/github/stats')

      statsHistory.value = res?.history || []
      if (res?.downloads) {
        downloads.value = res.downloads
      }
    } catch {
      // Stats history will be empty
    }

    statsLoaded.value = true
  }

  function updateStars(slug: string, stars: number) {
    const repo = repos.value.find(r => r.slug === slug)
    if (repo) {
      repo.stars = stars
    }
  }

  function updateRelease(slug: string, version: string, url: string, publishedAt?: string) {
    const repo = repos.value.find(r => r.slug === slug)
    if (repo) {
      repo.latest_version = version
      repo.latest_version_url = url
      if (publishedAt) {
        repo.published_at = publishedAt
      }
    }
  }

  return {
    repos,
    contributors,
    downloads,
    statsHistory,
    loaded,
    statsLoaded,
    totalStars,
    totalDownloads,
    serverDownloads,
    trapDownloads,
    serverVersion,
    getRepo,
    load,
    loadStats,
    updateStars,
    updateRelease,
  }
})
