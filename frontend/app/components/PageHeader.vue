<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  icon: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="px-5 py-4 border-b border-surface-200 dark:border-surface-700 bg-surface-card shrink-0">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
          <Icon :icon="icon" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ title }}</h1>
          <p v-if="subtitle" class="text-[11px] text-surface-400">{{ subtitle }}</p>
        </div>
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>
