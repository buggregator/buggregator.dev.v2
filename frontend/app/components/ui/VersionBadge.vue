<script setup lang="ts">
import { useLatestRelease } from '~/composables/useLatestRelease'

const { t } = useI18n()
const { release, isLoading } = useLatestRelease()
</script>

<template>
  <!-- Loading skeleton -->
  <span
    v-if="isLoading"
    class="inline-block w-32 h-7 rounded-full animate-pulse"
    style="background: var(--badge-bg);"
  />

  <!-- Version badge -->
  <a
    v-else-if="release?.version"
    :href="release.url ?? undefined"
    target="_blank"
    rel="noopener"
    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-sm no-underline transition-opacity hover:opacity-80"
    style="background: var(--version-bg); border: 1px solid var(--version-border); color: var(--version-text);"
  >
    <span
      class="w-1.5 h-1.5 rounded-full shrink-0"
      :class="release.isNew ? 'bg-[#f59e0b] animate-pulse-dot' : 'bg-[#22c55e]'"
    />
    <span v-if="release.isNew">{{ t('hero.badge.version', { version: release.version }) }}</span>
    <span v-else>v{{ release.version }}</span>
  </a>
</template>
