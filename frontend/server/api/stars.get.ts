const CACHE_KEY = 'github:stars'
const CACHE_TTL = 60 * 60 // 1 hour

export default defineEventHandler(async (event) => {
  const storage = useStorage('cache')
  const cached = await storage.getItem(CACHE_KEY)
  if (cached) return cached

  const config = useRuntimeConfig(event)
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'buggregator-landing',
  }
  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`
  }

  try {
    const data = await $fetch<{
      stargazers_count?: number
      forks_count?: number
      open_issues_count?: number
    }>(
      'https://api.github.com/repos/buggregator/server',
      { headers },
    )

    const result = {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      openIssues: data.open_issues_count ?? 0,
    }
    await storage.setItem(CACHE_KEY, result, { ttl: CACHE_TTL })
    return result
  } catch {
    return { stars: 0, forks: 0, openIssues: 0 }
  }
})
