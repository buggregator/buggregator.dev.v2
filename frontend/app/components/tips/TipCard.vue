<script setup lang="ts">
import { formatTipDate, tipFeatureColor, type TipSummary } from '~/composables/useTips'

// One tip in a list: the whole card is the link (title holds it, the rest is text).
defineProps<{
  tip: TipSummary
  headingLevel?: 'h2' | 'h3'
}>()
</script>

<template>
  <article class="tip-card relative h-full flex flex-col rounded-xl bg-landing-surface border border-landing-border-subtle hover:border-landing-border transition-colors duration-150 p-5 font-sans">
    <div class="flex items-center gap-2 mb-3 font-mono text-xs text-on-dark-muted">
      <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: tipFeatureColor(tip.feature) }" />
      <span>{{ tip.feature }}</span>
      <span aria-hidden="true">·</span>
      <time :datetime="tip.published">{{ formatTipDate(tip.published) }}</time>
    </div>
    <component :is="headingLevel ?? 'h2'" class="text-base lg:text-lg font-semibold text-white leading-snug mb-2">
      <NuxtLink :to="`/tips/${tip.slug}`" class="tip-card-link text-white no-underline">
        {{ tip.title }}
      </NuxtLink>
    </component>
    <p class="text-sm text-on-dark-secondary leading-relaxed">{{ tip.description }}</p>
  </article>
</template>

<style scoped>
/* Stretched link: the card is clickable, one link in the tab order. */
.tip-card-link::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
}
.tip-card-link:focus-visible {
  outline: none;
}
.tip-card-link:focus-visible::after {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}
.tip-card:hover .tip-card-link {
  color: theme('colors.accent.DEFAULT');
}
</style>
