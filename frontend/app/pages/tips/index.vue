<script setup lang="ts">
import TipCard from '~/components/tips/TipCard.vue'
import TipFeatureFilter from '~/components/tips/TipFeatureFilter.vue'
import { useTipFilter, useTipList } from '~/composables/useTips'

definePageMeta({ layout: 'landing' })
// English only, like the feature pages.
defineI18nRoute(false)

// Copy: server-copywriter, #4759 (2026-11-10).
const seoTitle = 'Local debugging tips: mail, errors, logs — Buggregator'
const seoDescription = 'One task per page: catch mail, errors, dumps, logs and HTTP calls on your machine. Each tip is a short answer, the steps with code, and a docs link.'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
})

const { data: tips, error } = await useTipList()
const { active, features, visible } = useTipFilter(tips)
</script>

<template>
  <div class="bg-section-dark">
    <section class="pt-24 lg:pt-32 pb-8 lg:pb-10">
      <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <p class="font-mono text-xs uppercase tracking-wider text-accent mb-4">Tips</p>
        <h1 class="text-hero-sm lg:text-hero font-bold text-white mb-4 max-w-[800px]">Local debugging tips</h1>
        <p class="text-lg text-on-dark-secondary leading-relaxed max-w-[700px]">
          Short how-tos, one task each: the answer first, then the steps with code you can copy, then a link to the docs.
        </p>
      </div>
    </section>

    <section class="pb-20 lg:pb-28" aria-labelledby="tips-list-heading">
      <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <h2 id="tips-list-heading" class="sr-only">
          {{ active ? `${active} tips` : 'All tips' }}, newest first
        </h2>

        <p v-if="error" class="text-on-dark-secondary" role="alert">
          The tips could not be loaded. Reload the page to try again.
        </p>

        <template v-else>
          <TipFeatureFilter v-if="features.length > 1" :features="features" :active="active" class="mb-8" />

          <p class="sr-only" aria-live="polite">{{ visible.length }} tips</p>

          <ul v-if="visible.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
            <li v-for="tip in visible" :key="tip.slug">
              <TipCard :tip="tip" heading-level="h3" />
            </li>
          </ul>
          <p v-else class="text-on-dark-secondary">
            No tips here yet.
            <NuxtLink to="/tips" class="text-accent no-underline hover:underline">See all tips</NuxtLink>
          </p>
        </template>
      </div>
    </section>
  </div>
</template>
