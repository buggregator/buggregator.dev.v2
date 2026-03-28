import { useAppConfigStore } from '~/stores/appConfig'

export default defineNuxtPlugin(async () => {
  const store = useAppConfigStore()
  await store.load()
})
