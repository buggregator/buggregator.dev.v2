declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(() => {
  const { public: { gaMeasurementId } } = useRuntimeConfig()

  if (!gaMeasurementId) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // page_view is sent below, the first load included: with config's own
  // page_view every load counted twice.
  window.gtag('config', gaMeasurementId, { send_page_view: false })

  // Page views, the first load and every route change. Sent once the new page's head is in the DOM, so page_title is the new
  // title (router.afterEach reported the previous page's one). The timer
  // covers a navigation that renders no head change.
  const nuxtApp = useNuxtApp()
  const head = injectHead()
  let pending: ReturnType<typeof setTimeout> | null = null

  const sendPageView = () => {
    if (!pending) return
    clearTimeout(pending)
    pending = null
    window.gtag('event', 'page_view', {
      page_path: useRouter().currentRoute.value.fullPath,
      page_title: document.title,
    })
  }

  nuxtApp.hook('page:finish', () => {
    if (pending) clearTimeout(pending)
    pending = setTimeout(sendPageView, 500)
  })
  head.hooks.hook('dom:rendered', sendPageView)
})
