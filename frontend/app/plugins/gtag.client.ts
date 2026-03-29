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
  window.gtag('config', gaMeasurementId)

  // Track SPA page views on route change
  const router = useRouter()
  router.afterEach((to) => {
    window.gtag('event', 'page_view', {
      page_path: to.fullPath,
      page_title: document.title,
    })
  })
})
