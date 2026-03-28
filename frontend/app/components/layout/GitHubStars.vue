<script setup lang="ts">
const { data } = useFetch<{ stars: number }>('/api/stars', { lazy: true })

const formatted = computed(() => {
  const count = data.value?.stars ?? 0
  if (count === 0) return null
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count)
})
</script>

<template>
  <a
    v-if="formatted"
    href="https://github.com/buggregator/server"
    target="_blank"
    rel="noopener"
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-sm text-on-dark-secondary no-underline transition-colors hover:text-on-dark-primary"
    style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10);"
  >
    <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 8 .2Z" />
    </svg>
    {{ formatted }}
  </a>
</template>
