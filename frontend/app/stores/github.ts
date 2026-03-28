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
}

export interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export const useGitHubStore = defineStore('github', () => {
  const repos = ref<RepoInfo[]>([])
  const contributors = ref<Contributor[]>([])
  const loaded = ref(false)

  const totalStars = computed(() =>
    repos.value.reduce((sum, r) => sum + (r.stars || 0), 0),
  )

  function getRepo(slug: string) {
    return repos.value.find(r => r.slug === slug) || null
  }

  const serverVersion = computed(() => getRepo('server')?.latest_version || null)

  async function load() {
    if (loaded.value) return

    try {
      const [reposRes, contribRes] = await Promise.all([
        $fetch<{ repos: RepoInfo[]; total_stars: number }>('/api/public/github/repos'),
        $fetch<{ contributors: Contributor[] }>('/api/public/github/contributors'),
      ])

      repos.value = reposRes?.repos || []
      contributors.value = contribRes?.contributors || []
    } catch {
      // Data will be empty — components handle this gracefully
    }

    loaded.value = true
  }

  return {
    repos,
    contributors,
    loaded,
    totalStars,
    serverVersion,
    getRepo,
    load,
  }
})
