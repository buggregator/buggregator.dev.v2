// One listener for every link to the docs site (sections, footer, feature
// pages), instead of a handler on each link: sends docs_click with where the
// link sits and which docs page it opens.
const DOCS_HOST = 'docs.buggregator.dev'

function docsClickParams(link: HTMLAnchorElement): Record<string, string> | null {
  let url: URL
  try {
    url = new URL(link.href)
  } catch {
    return null
  }
  if (url.hostname !== DOCS_HOST) return null

  const place = link.closest<HTMLElement>('[data-cta-location], section[id], footer, nav')
  const location = place?.dataset.ctaLocation
    || (place?.tagName === 'SECTION' ? place.id : place?.tagName.toLowerCase())
    || 'page'

  return { cta_location: location, target_page: url.pathname }
}

export default defineNuxtPlugin(() => {
  const { trackEvent } = useGtag()

  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a[href]')
    if (!(link instanceof HTMLAnchorElement)) return
    const params = docsClickParams(link)
    if (params) trackEvent('docs_click', params)
  }, { capture: true })
})
