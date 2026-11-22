<script setup lang="ts">
import { FEATURE_RELEASE } from '~/data/features'

// Bottom row of the «Features» menu: tips, docs and the latest release.
// Tips are English only, like the feature pages: no locale prefix.
withDefaults(defineProps<{ size?: 'panel' | 'sheet' }>(), { size: 'panel' })
const emit = defineEmits<{ navigate: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="menu-footer" :class="`menu-footer--${size}`">
    <NuxtLink to="/tips" class="menu-footer__link" @click="emit('navigate')">
      {{ t('featureMenu.allTips') }}
    </NuxtLink>
    <a
      v-if="size === 'panel'"
      href="https://docs.buggregator.dev"
      target="_blank"
      rel="noopener"
      class="menu-footer__link"
    >{{ t('featureMenu.docs') }}</a>
    <span class="menu-footer__spacer" />
    <a
      :href="FEATURE_RELEASE.url"
      target="_blank"
      rel="noopener"
      class="menu-footer__link"
    >{{ t('featureMenu.whatsNew', { version: FEATURE_RELEASE.version }) }}</a>
  </div>
</template>

<style scoped>
.menu-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 10px 38px 12px;
  border-top: 1px solid theme('colors.landing-border');
  font-family: "DM Sans", sans-serif;
  font-size: 0.8125rem;
}

.menu-footer__link {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  color: theme('colors.on-dark.secondary');
  text-decoration: none;
  transition: color 150ms ease;
}

.menu-footer__link:hover {
  color: theme('colors.on-dark.primary');
}

.menu-footer__spacer {
  flex: 1;
}

.menu-footer--sheet {
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  margin-top: 8px;
  padding: 8px 0 0;
  border-top-color: theme('colors.landing-border-subtle');
  font-size: 1rem;
}

.menu-footer--sheet .menu-footer__link {
  min-height: 48px;
  color: theme('colors.accent.DEFAULT');
}

.menu-footer--sheet .menu-footer__spacer {
  display: none;
}
</style>
