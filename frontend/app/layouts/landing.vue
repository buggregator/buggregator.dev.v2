<script setup lang="ts">
import AppNavbar from '~/components/layout/AppNavbar.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import { useGitHubStore } from '~/stores/github'
import { useRealtimeUpdates } from '~/composables/useRealtimeUpdates'

const github = useGitHubStore()
await Promise.all([github.load(), github.loadStats()])

const { connect, disconnect, onMessage } = useRealtimeUpdates()

onMessage('github.stars', (data: { slug: string, stars: number }) => {
  github.updateStars(data.slug, data.stars)
})

onMessage('github.release', (data: { slug: string, version: string, url: string, published_at?: string }) => {
  github.updateRelease(data.slug, data.version, data.url, data.published_at)
})

if (import.meta.client) {
  connect()
}

onScopeDispose(() => {
  if (import.meta.client) {
    disconnect()
  }
})
</script>

<template>
  <div class="landing min-h-screen bg-section-dark">
    <!-- Skip to main content (a11y) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
    >
      Skip to main content
    </a>

    <ClientOnly>
      <AppNavbar />
    </ClientOnly>

    <main id="main-content">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
