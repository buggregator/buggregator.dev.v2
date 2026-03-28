import { useAppConfigStore } from '~/stores/appConfig'

export function useAppConfig() {
  const store = useAppConfigStore()
  return {
    appName: computed(() => store.config.appName),
    supportEmail: computed(() => store.config.supportEmail),
    privacyEmail: computed(() => store.config.privacyEmail),
    legalEmail: computed(() => store.config.legalEmail),
  }
}
