<script setup lang="ts">
import Toast from 'primevue/toast'
import { useAppConfig } from '~/composables/useAppConfig'

const { appName } = useAppConfig()

useHead({
  title: appName,
  meta: [
    { name: 'description', content: computed(() => `${appName.value} - Your application`) },
  ],
})

const hydrated = ref(false)

onMounted(() => {
  nextTick(() => {
    hydrated.value = true
  })
})
</script>

<template>
  <!-- Full-screen preloader — shown during SSR, fades out after hydration -->
  <div v-if="!hydrated" id="app-loader">
    <span class="loader-text">{{ appName }}</span>
    <span class="loader-dot" />
  </div>

  <Toast position="bottom-right" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
