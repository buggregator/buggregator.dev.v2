<script setup lang="ts">
import EnMarker from '~/components/ui/EnMarker.vue'

// One footer link: a page of this site (`to`) or another site (`href`, new
// tab, «↗»). `enOnly`: the page has no ru/es version, «EN» on those sites.
defineProps<{
  label: string
  to?: string
  href?: string
  isNew?: boolean
  enOnly?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <li>
    <a v-if="href" :href="href" target="_blank" rel="noopener" class="ft-link">
      <span class="ft-link__text">{{ label }}</span>
      <span class="ft-link__ext" aria-hidden="true">↗</span>
      <span class="sr-only">({{ t('footer.newTab') }})</span>
    </a>
    <NuxtLink v-else :to="to" class="ft-link">
      <span class="ft-link__text">{{ label }}</span>
      <span v-if="isNew" class="ft-link__new">{{ t('featureMenu.new') }}</span>
      <EnMarker v-if="enOnly" />
    </NuxtLink>
  </li>
</template>

<style scoped>
.ft-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  border-radius: 4px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  color: theme('colors.on-dark.muted');
  text-decoration: none;
  transition: color 150ms ease;
}

.ft-link:hover {
  color: theme('colors.on-dark.primary');
}

.ft-link:hover .ft-link__text {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.ft-link:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
  color: theme('colors.on-dark.primary');
}

.ft-link__ext {
  font-size: 11px;
  opacity: 0.7;
}

.ft-link__new {
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

@media (max-width: 639px) {
  .ft-link {
    min-height: 44px;
    font-size: 0.9375rem;
  }
}
</style>
