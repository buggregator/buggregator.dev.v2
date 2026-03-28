<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).filter(
    (l) => l.code !== locale.value,
  ),
)
</script>

<template>
  <div class="relative inline-flex items-center">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      class="px-2 py-1 text-sm font-mono text-on-dark-muted hover:text-on-dark-primary transition-colors duration-150"
      :aria-label="`Switch to ${loc.name}`"
      @click="setLocale(loc.code)"
    >
      {{ loc.code.toUpperCase() }}
    </button>
    <span
      class="px-2 py-1 text-sm font-mono text-on-dark-secondary"
      :aria-label="`Current language: ${locale}`"
    >
      {{ locale.toUpperCase() }}
    </span>
  </div>
</template>
