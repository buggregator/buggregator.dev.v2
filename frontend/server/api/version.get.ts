const CACHE_KEY = 'version:latest'
const CACHE_TTL = 60 * 60 // 1 hour in seconds

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
      tag_name?: string
      published_at?: string
      html_url?: string
    }>('https://api.github.com/repos/buggregator/server/releases/latest', {
      headers,
    })

    const result = {
      version: data.tag_name?.replace(/^v/, '') ?? null,
      publishedAt: data.published_at ?? null,
      url: data.html_url ?? null,
    }

    await storage.setItem(CACHE_KEY, result, { ttl: CACHE_TTL })
    return result
  } catch {
    return { version: null, publishedAt: null, url: null }
  }
})
