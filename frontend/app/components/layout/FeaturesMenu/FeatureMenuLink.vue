<script setup lang="ts">
import FeatureIcon from '~/components/ui/FeatureIcon.vue'
import EnMarker from '~/components/ui/EnMarker.vue'
import type { FeaturePage } from '~/data/features'

// One feature page in the «Features» menu: app icon, name, NEW mark for the
// latest release, «EN» on the ru/es site, «you are here» on its own page.
const props = withDefaults(defineProps<{
  feature: FeaturePage
  // `sheet`: the phone menu, bigger rows.
  size?: 'panel' | 'sheet'
}>(), { size: 'panel' })

const { t } = useI18n()
const route = useRoute()
const isCurrent = computed(() => route.path.replace(/\/$/, '') === props.feature.to)
</script>

<template>
  <NuxtLink
    :to="feature.to"
    class="feature-link"
    :class="`feature-link--${size}`"
    :aria-current="isCurrent ? 'page' : undefined"
  >
    <FeatureIcon :name="feature.icon" class="feature-link__icon" />
    <span class="feature-link__name">{{ feature.label }}</span>
    <span v-if="feature.isNew" class="feature-link__new">{{ t('featureMenu.new') }}</span>
    <EnMarker />
    <span v-if="isCurrent" class="feature-link__here">{{ t('featureMenu.current') }}</span>
  </NuxtLink>
</template>

<style scoped>
.feature-link {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 6px 10px;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  white-space: nowrap;
  color: theme('colors.on-dark.secondary');
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;
}

.feature-link__icon {
  margin-right: 4px;
  color: theme('colors.on-dark.muted');
  transition: color 150ms ease;
}

.feature-link:hover {
  background: theme('colors.landing-elevated');
  color: theme('colors.on-dark.primary');
}

.feature-link:hover .feature-link__icon {
  color: theme('colors.on-dark.primary');
}

.feature-link:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -2px;
  background: theme('colors.landing-elevated');
  color: theme('colors.on-dark.primary');
}

.feature-link:active {
  background: theme('colors.landing-border');
}

.feature-link[aria-current="page"] {
  background: theme('colors.landing-elevated');
  color: theme('colors.on-dark.primary');
  font-weight: 600;
}

.feature-link[aria-current="page"] .feature-link__icon {
  color: theme('colors.accent.DEFAULT');
}

.feature-link__new {
  padding: 0 5px;
  border: 1px solid theme('colors.landing-border-hover');
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  color: theme('colors.on-dark.secondary');
}

.feature-link__here {
  font-size: 11px;
  font-weight: 500;
  color: theme('colors.on-dark.muted');
}

/* Phone sheet: 48 px rows, bigger text. */
.feature-link--sheet {
  min-height: 48px;
  padding: 0 12px;
  font-size: 1rem;
  white-space: normal;
}

.feature-link--sheet .feature-link__icon {
  width: 18px;
  height: 18px;
}
</style>
