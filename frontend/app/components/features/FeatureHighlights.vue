<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  items: Array<{
    icon: string
    title: string
    description: string
  }>
  accentColor?: string
}>()
</script>

<template>
  <section class="py-20 lg:py-28 bg-section-mid">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-section font-bold text-white mb-3 font-sans">{{ title }}</h2>
        <p class="text-lg text-on-dark-secondary font-sans max-w-[600px] mx-auto">{{ subtitle }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="item in items"
          :key="item.title"
          class="p-5 rounded-xl bg-landing-surface border border-landing-border-subtle"
        >
          <div class="text-2xl mb-3">{{ item.icon }}</div>
          <h3 class="font-sans text-base font-semibold text-white mb-1.5">{{ item.title }}</h3>
          <p class="font-sans text-sm text-on-dark-secondary leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
