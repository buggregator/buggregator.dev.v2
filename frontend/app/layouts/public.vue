<script setup lang="ts">
import { useAppConfig } from '~/composables/useAppConfig'

const { appName } = useAppConfig()
const route = useRoute()

const navLinks = [
  { label: 'Terms', to: '/legal/terms' },
  { label: 'Privacy', to: '/legal/privacy' },
]
</script>

<template>
  <div class="min-h-screen bg-surface-950 flex flex-col">
    <!-- Header -->
    <header class="shrink-0 border-b border-surface-800">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <span class="text-white text-sm font-bold">A</span>
          </div>
          <span class="text-sm font-semibold text-surface-100">{{ appName }}</span>
        </NuxtLink>

        <nav class="hidden sm:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="route.path === link.to
              ? 'text-surface-100 bg-surface-800'
              : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-surface-800 py-8">
      <div class="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-[11px] text-surface-600 font-mono">
          © {{ new Date().getFullYear() }} {{ appName }}
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/legal/terms" class="text-[11px] text-surface-600 hover:text-surface-400 transition-colors">Terms</NuxtLink>
          <NuxtLink to="/legal/privacy" class="text-[11px] text-surface-600 hover:text-surface-400 transition-colors">Privacy</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>
