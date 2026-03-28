<script setup lang="ts">
defineProps<{
  number: number
  title: string
  description: string
  isLast?: boolean
}>()
</script>

<template>
  <div class="relative flex gap-6 lg:gap-12">
    <!-- Left: number + connector -->
    <div class="flex flex-col items-center shrink-0">
      <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg font-sans shrink-0">
        {{ number }}
      </div>
      <div v-if="!isLast" class="w-0.5 flex-1 bg-landing-border-subtle mt-3" />
    </div>

    <!-- Content -->
    <div class="flex-1 pb-16 lg:pb-20">
      <div class="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-10">
        <!-- Left column: text + code -->
        <div>
          <h3 class="font-sans text-xl font-semibold text-white mb-2">{{ title }}</h3>
          <p class="font-sans text-base text-on-dark-secondary leading-relaxed mb-4">{{ description }}</p>
          <slot name="code" />
        </div>

        <!-- Right column: preview (hidden on mobile) -->
        <div class="hidden lg:block">
          <slot name="preview" />
        </div>
      </div>
    </div>
  </div>
</template>
