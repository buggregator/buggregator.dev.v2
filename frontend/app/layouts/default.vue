<script setup lang="ts">
import { useRealtimeUpdates } from '~/composables/useRealtimeUpdates'
import { useAppConfig } from '~/composables/useAppConfig'

const { appName } = useAppConfig()

const route = useRoute()
const { connect, disconnect, onMessage } = useRealtimeUpdates()

const mobileMenuOpen = ref(false)

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
  <div class="h-screen flex flex-col overflow-hidden">

    <header class="shrink-0 border-b border-surface-200 dark:border-surface-700">
      <div class="flex items-stretch">
        <!-- Logo block -->
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2.5 px-5 py-3 transition-colors"
        >
          <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600">
            <span class="text-white text-sm font-bold">A</span>
          </div>
          <span class="text-sm font-semibold text-surface-900 dark:text-surface-100 hidden sm:inline">{{ appName }}</span>
        </NuxtLink>

        <!-- Nav links (desktop) -->
        <nav class="hidden md:flex items-center gap-1 px-4">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            :class="route.path === '/dashboard'
              ? 'text-surface-900 dark:text-surface-100 font-medium'
              : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-200'"
          >
            Dashboard
          </NuxtLink>
        </nav>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Hamburger (mobile) -->
        <button
          class="md:hidden flex items-center justify-center w-10 h-10 my-auto mr-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </div>

      <!-- Mobile nav menu -->
      <nav v-if="mobileMenuOpen" class="md:hidden border-t border-surface-200 dark:border-surface-700 px-4 py-3 flex flex-col gap-1">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
          :class="route.path === '/dashboard'
            ? 'text-surface-900 dark:text-surface-100 font-medium bg-surface-100 dark:bg-surface-800'
            : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800'"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </NuxtLink>
      </nav>
    </header>
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
