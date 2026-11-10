<script setup lang="ts">
import TipCard from '~/components/tips/TipCard.vue'
import { usePageTips } from '~/composables/useTips'

// «Tips for <feature>» on a feature page: the tips whose feature_page is
// this page. Renders nothing until such tips exist.
const props = defineProps<{
  label: string
}>()

const route = useRoute()
const { tips } = await usePageTips(route.path.replace(/\/+$/, ''))
</script>

<template>
  <section v-if="tips.length" class="py-14 lg:py-16 bg-section-dark" aria-labelledby="feature-tips-heading">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <div class="flex flex-wrap items-baseline justify-between gap-4 mb-6">
        <h2 id="feature-tips-heading" class="text-2xl lg:text-[1.75rem] font-bold text-white tracking-tight">
          Tips for {{ props.label }}
        </h2>
        <NuxtLink to="/tips" class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover no-underline">
          All tips
        </NuxtLink>
      </div>
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
        <li v-for="tip in tips" :key="tip.slug">
          <TipCard :tip="tip" heading-level="h3" />
        </li>
      </ul>
    </div>
  </section>
</template>
