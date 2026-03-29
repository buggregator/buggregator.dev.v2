export function useGtag() {
  function trackEvent(eventName: string, params?: Record<string, unknown>) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
  }

  return { trackEvent }
}
