<script setup lang="ts">
import FeatureMenuLink from '~/components/layout/FeaturesMenu/FeatureMenuLink.vue'
import FeatureMenuFooter from '~/components/layout/FeaturesMenu/FeatureMenuFooter.vue'
import { FEATURE_MENU_COLUMNS, FEATURE_PAGES } from '~/data/features'

// «Features» in the phone menu: the same six groups as an accordion, one
// group open at a time (the one with the current page, else the first).
const emit = defineEmits<{ navigate: [] }>()

const { t } = useI18n()
const route = useRoute()

const groups = FEATURE_MENU_COLUMNS.flat()
const currentGroup = groups.find(g => g.features.some(id => FEATURE_PAGES[id].to === route.path.replace(/\/$/, '')))
const openGroup = ref<string | null>(currentGroup?.id ?? groups[0]?.id ?? null)

function toggle(id: string) {
  openGroup.value = openGroup.value === id ? null : id
}
</script>

<template>
  <div class="features-accordion">
    <p class="features-accordion__label">{{ t('nav.features') }}</p>
    <div v-for="group in groups" :key="group.id" class="features-accordion__group">
      <button
        :id="`fa-head-${group.id}`"
        type="button"
        class="features-accordion__head"
        :aria-expanded="openGroup === group.id"
        :aria-controls="`fa-body-${group.id}`"
        @click="toggle(group.id)"
      >
        {{ t(`featureMenu.groups.${group.id}`) }}
        <span class="features-accordion__count">{{ group.features.length }}</span>
        <svg class="features-accordion__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        v-show="openGroup === group.id"
        :id="`fa-body-${group.id}`"
        role="region"
        :aria-labelledby="`fa-head-${group.id}`"
        class="features-accordion__body"
      >
        <FeatureMenuLink
          v-for="id in group.features"
          :key="id"
          :feature="FEATURE_PAGES[id]"
          size="sheet"
          @click="emit('navigate')"
        />
      </div>
    </div>
    <FeatureMenuFooter size="sheet" @navigate="emit('navigate')" />
  </div>
</template>

<style scoped>
.features-accordion__label {
  margin: 0;
  padding: 12px 0 6px;
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: theme('colors.on-dark.muted');
}

.features-accordion__group {
  border-top: 1px solid theme('colors.landing-border-subtle');
}

.features-accordion__head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 52px;
  font-family: "DM Sans", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: theme('colors.on-dark.primary');
  text-align: left;
}

.features-accordion__head:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -2px;
}

.features-accordion__count {
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  color: theme('colors.on-dark.muted');
}

.features-accordion__chevron {
  margin-left: auto;
  color: theme('colors.on-dark.muted');
  transition: transform 150ms ease;
}

.features-accordion__head[aria-expanded="true"] .features-accordion__chevron {
  transform: rotate(180deg);
}

.features-accordion__body {
  padding: 0 0 10px;
}

@media (prefers-reduced-motion: reduce) {
  .features-accordion__chevron {
    transition: none;
  }
}
</style>
