<script setup lang="ts">
import { FEATURE_ICONS, type FeatureIconName } from '~/data/feature-icons'

// One app icon, in the text colour: static markup, the same on server and client.
defineProps<{ name: FeatureIconName }>()
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span class="feature-icon" aria-hidden="true" v-html="FEATURE_ICONS[name]" />
</template>

<style scoped>
.feature-icon {
  display: inline-flex;
  flex: none;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
}

.feature-icon :deep(svg) {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

/* Outline icons (bolt) stay outlined. */
.feature-icon :deep(svg[fill="none"]) {
  fill: none;
  stroke: currentColor;
}
</style>
