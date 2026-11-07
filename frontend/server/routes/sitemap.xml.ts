// Canonical addresses only, no trailing slash. Feature pages are English
// only, so they have no /ru or /es entries. Add a page here when one is added.
// No lastmod: a build date would change on every deploy and mean nothing.
export const SITEMAP_PAGES = [
  '/',
  '/features/sentry',
  '/features/email-testing',
  '/features/profiler',
  '/features/http-proxy',
  '/features/sms',
  '/features/mock-server',
  '/features/xdebug',
  '/features/logs',
  '/features/http-dumps',
  '/features/mcp-api',
  '/sponsors',
  '/ru',
  '/ru/sponsors',
  '/es',
  '/es/sponsors',
]

export default defineEventHandler((event) => {
  const base = useRuntimeConfig().public.siteUrl
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const urls = SITEMAP_PAGES.map(p => `<url><loc>${base}${p}</loc></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
})
