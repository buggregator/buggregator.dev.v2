import { defineStore } from 'pinia'

export interface AppConfig {
  appName: string
  supportEmail: string
  privacyEmail: string
  legalEmail: string
}

const DEFAULTS: AppConfig = {
  appName: 'App Template',
  supportEmail: 'support@example.com',
  privacyEmail: 'privacy@example.com',
  legalEmail: 'legal@example.com',
}

export const useAppConfigStore = defineStore('appConfig', () => {
  const config = ref<AppConfig>({ ...DEFAULTS })
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return

    try {
      const data = await $fetch<Record<string, string>>('/api/public/env/config.json')
      config.value = {
        appName: data.PUBLIC_APP_NAME || DEFAULTS.appName,
        supportEmail: data.PUBLIC_SUPPORT_EMAIL || DEFAULTS.supportEmail,
        privacyEmail: data.PUBLIC_PRIVACY_EMAIL || DEFAULTS.privacyEmail,
        legalEmail: data.PUBLIC_LEGAL_EMAIL || DEFAULTS.legalEmail,
      }
      loaded.value = true
    } catch {
      loaded.value = true
    }
  }

  return { config, loaded, load }
})
