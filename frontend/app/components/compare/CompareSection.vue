<script setup lang="ts">
// One block of a compare page: a heading and its content, same width and
// rhythm on every page.
withDefaults(defineProps<{
  id?: string
  title: string
  tone?: 'dark' | 'mid'
  wide?: boolean
}>(), { id: undefined, tone: 'dark', wide: false })
</script>

<template>
  <section
    :id="id"
    class="py-14 lg:py-16"
    :class="tone === 'dark' ? 'bg-section-dark' : 'bg-section-mid'"
  >
    <div class="mx-auto px-4 sm:px-6 lg:px-8 font-sans" :class="wide ? 'max-w-[1100px]' : 'max-w-[800px]'">
      <h2 class="text-2xl lg:text-[1.75rem] font-bold text-white mb-6 tracking-tight">{{ title }}</h2>
      <div class="compare-prose text-base leading-relaxed text-on-dark-secondary space-y-4">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.compare-prose :deep(a) {
  color: theme('colors.accent.DEFAULT');
  text-decoration: none;
}
.compare-prose :deep(a:hover) {
  text-decoration: underline;
}
.compare-prose :deep(strong) {
  color: #fff;
  font-weight: 600;
}
.compare-prose :deep(code) {
  font-family: theme('fontFamily.mono');
  font-size: 0.875em;
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  background: theme('colors.landing-surface');
}
</style>
