<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  items: Array<{
    name: string
    detail: string
  }>
}>()
</script>

<template>
  <section class="py-16 lg:py-20 bg-section-dark">
    <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-section font-bold text-white mb-3 font-sans">{{ title || 'Works with any stack' }}</h2>
        <p v-if="description" class="text-lg text-on-dark-secondary font-sans max-w-[600px] mx-auto">{{ description }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[700px] mx-auto">
        <div
          v-for="item in items"
          :key="item.name"
          class="flex items-center gap-3 px-4 py-3 rounded-lg bg-landing-surface border border-landing-border-subtle"
        >
          <svg class="w-4 h-4 text-[#22c55e] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <span class="font-sans text-sm font-medium text-white">{{ item.name }}</span>
            <span class="font-sans text-sm text-on-dark-muted ml-1.5">{{ item.detail }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
