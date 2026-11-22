<script setup lang="ts">
// Feature pages exist only in English: in the ru/es site a link to one
// carries a small «EN» so the language switch is not a surprise.
const { t, locale } = useI18n()
</script>

<template>
  <span v-if="locale !== 'en'" class="en-marker" :title="t('featureMenu.enMarkerLabel')">
    <span aria-hidden="true">{{ t('featureMenu.enMarker') }}</span>
    <span class="sr-only">{{ t('featureMenu.enMarkerLabel') }}</span>
  </span>
</template>

<style scoped>
.en-marker {
  display: inline-flex;
  align-items: center;
  flex: none;
  padding: 0 4px;
  border: 1px solid theme('colors.landing-border-hover');
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: theme('colors.on-dark.muted');
  text-decoration: none;
}
</style>
