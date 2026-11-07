// Per-page head for search engines, set once in the landing layout:
// - canonical and og:url: the page's own address, no trailing slash, so
//   /ru and /es do not claim the English home page;
// - lang, hreflang alternates (x-default = English) and og:locale from i18n.
export function canonicalPath(path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function useSiteHead() {
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public
  const url = computed(() => `${siteUrl}${canonicalPath(route.path)}`)

  const i18nHead = useLocaleHead({ seo: true })

  // A page that exists in English only (features/*) gets the same address
  // for every language: no alternates then, they would point at itself.
  const alternates = computed(() => (i18nHead.value.link ?? []).filter(l => l.rel === 'alternate'))
  const translated = computed(() => new Set(alternates.value.map(l => l.href)).size > 1)

  useHead({
    htmlAttrs: { lang: computed(() => i18nHead.value.htmlAttrs?.lang) },
    link: computed(() => [
      { rel: 'canonical', href: url.value },
      ...(translated.value ? alternates.value : []),
    ]),
    meta: computed(() => (i18nHead.value.meta ?? [])
      .filter(m => translated.value || m.property !== 'og:locale:alternate')),
  })

  useSeoMeta({ ogUrl: url })
}
