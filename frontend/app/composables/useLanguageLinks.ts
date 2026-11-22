/**
 * The site's languages as real links to the same page in each language, so
 * every version is a findable address. A page that exists only in English
 * (features/*, tips) links to that language's home page.
 * Used by the header's LanguageSwitcher and the footer's language row.
 */
export function useLanguageLinks() {
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()

  return computed(() =>
    (locales.value as Array<{ code: string, name: string }>).map(loc => ({
      code: loc.code,
      name: loc.name,
      href: switchLocalePath(loc.code) || localePath('/', loc.code),
      current: loc.code === locale.value,
    })),
  )
}
