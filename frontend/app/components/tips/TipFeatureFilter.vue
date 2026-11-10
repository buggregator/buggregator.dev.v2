<script setup lang="ts">
import { tipFeatureColor, tipFeatureKey, type TipFeature } from '~/composables/useTips'

// Filter by feature as plain links (?feature=<key>): works without JS,
// can be shared, and the server renders the filtered list.
defineProps<{
  features: TipFeature[]
  active: TipFeature | null
}>()
</script>

<template>
  <nav aria-label="Filter tips by feature">
    <ul class="flex flex-wrap gap-2 list-none p-0 m-0">
      <li>
        <NuxtLink
          to="/tips"
          class="tip-chip"
          :class="{ 'tip-chip-active': active === null }"
          :aria-current="active === null ? 'page' : undefined"
        >All</NuxtLink>
      </li>
      <li v-for="f in features" :key="f">
        <NuxtLink
          :to="{ path: '/tips', query: { feature: tipFeatureKey(f) } }"
          class="tip-chip"
          :class="{ 'tip-chip-active': active === f }"
          :aria-current="active === f ? 'page' : undefined"
        >
          <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: tipFeatureColor(f) }" />
          {{ f }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tip-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0 0.875rem;
  border-radius: 0.5rem;
  border: 1px solid theme('colors.landing-border-subtle');
  background: theme('colors.landing-surface');
  color: theme('colors.on-dark.secondary');
  font-family: theme('fontFamily.sans');
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 150ms, border-color 150ms;
}
.tip-chip:hover {
  color: #fff;
  border-color: theme('colors.landing-border');
}
.tip-chip:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}
.tip-chip-active {
  color: #fff;
  border-color: theme('colors.accent.DEFAULT');
  background: theme('colors.accent.subtle');
}
</style>
