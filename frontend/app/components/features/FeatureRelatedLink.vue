<script setup lang="ts">
defineProps<{
  to: string
  label: string
  color: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-landing-surface border border-landing-border-subtle text-sm text-on-dark-secondary hover:text-white hover:border-landing-border transition-colors duration-150 no-underline font-sans"
  >
    <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: color }" />
    {{ label }}
  </NuxtLink>
</template>
