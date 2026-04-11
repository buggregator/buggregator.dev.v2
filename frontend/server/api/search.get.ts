export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const host = config.public.typesenseHost as string
  const port = Number(config.public.typesensePort)
  const protocol = config.public.typesenseProtocol as string
  const portStr = (protocol === 'https' && port === 443) || (protocol === 'http' && port === 80) ? '' : `:${port}`
  const baseUrl = `${protocol}://${host}${portStr}`
  const collection = config.public.typesenseCollection as string
  const apiKey = config.public.typesenseSearchKey as string

  const params = new URLSearchParams({
    q: String(query.q || ''),
    query_by: 'hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,content',
    include_fields: 'url,content,content_type,html_content,hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3',
    highlight_full_fields: 'content,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3',
    highlight_start_tag: '<mark>',
    highlight_end_tag: '</mark>',
    per_page: '20',
    prioritize_exact_match: 'false',
  })

  const res = await $fetch(`${baseUrl}/collections/${collection}/documents/search?${params}`, {
    headers: { 'X-TYPESENSE-API-KEY': apiKey },
  })

  return res
})
