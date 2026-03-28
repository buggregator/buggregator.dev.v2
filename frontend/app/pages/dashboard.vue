<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="h-full flex flex-col">
    <PageHeader icon="tabler:layout-dashboard" title="Dashboard" subtitle="Overview" />

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-6 space-y-6">
        <!-- Welcome banner -->
        <div class="rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-card p-6">
          <h2 class="text-lg font-semibold text-surface-900 dark:text-surface-0">
            Welcome to the Dashboard
          </h2>
          <p class="text-sm text-surface-400 mt-1">Your application is up and running.</p>
        </div>
      </div>
    </div>
  </div>
</template>
