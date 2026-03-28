<script setup lang="ts">
import { sponsors } from '~/data/sponsors'
import SponsorCard from '~/components/sections/SponsorsSection/SponsorCard.vue'
import PatreonIcon from '~/components/icons/PatreonIcon.vue'

const { t } = useI18n()
const { patreonUrl } = useRuntimeConfig().public

const goldSponsors = computed(() => sponsors.filter(s => s.tier === 'gold'))
const otherSponsors = computed(() => sponsors.filter(s => s.tier !== 'gold'))
const hasSponsors = computed(() => sponsors.length > 0)
</script>

<template>
  <section class="py-20 lg:py-28 bg-section-mid border-t border-landing-border-subtle">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl font-bold text-white mb-2 font-sans">
        {{ t('sponsors.headline') }}
      </h2>
      <p class="text-sm text-on-dark-muted mb-10 font-sans">
        {{ t('sponsors.subheadline') }}
      </p>

      <!-- Gold sponsors row -->
      <div v-if="goldSponsors.length" class="flex flex-wrap justify-center gap-4 mb-6">
        <SponsorCard v-for="s in goldSponsors" :key="s.id" :sponsor="s" tier="gold" />
      </div>

      <!-- Silver + community sponsors -->
      <div v-if="otherSponsors.length" class="flex flex-wrap justify-center items-center gap-4 mb-6">
        <SponsorCard v-for="s in otherSponsors" :key="s.id" :sponsor="s" :tier="s.tier" />
      </div>

      <!-- Empty state -->
      <p v-if="!hasSponsors" class="text-sm text-on-dark-muted mb-6 font-sans">
        {{ t('sponsors.empty') }}
      </p>

      <!-- "Become a sponsor" card -->
      <div class="flex justify-center mb-10">
        <NuxtLink
          to="/sponsors"
          class="flex flex-col items-center justify-center w-32 h-24 rounded-xl border-2 border-dashed border-landing-border text-on-dark-muted hover:border-accent hover:text-accent transition-all duration-200 no-underline"
        >
          <span class="text-2xl mb-1">+</span>
          <span class="text-xs font-sans">{{ t('sponsors.becomeCard') }}</span>
        </NuxtLink>
      </div>

      <!-- CTAs -->
      <div class="flex flex-wrap justify-center gap-4">
        <a
          :href="patreonUrl as string"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white no-underline transition-colors"
          style="background: #FF424D;"
        >
          <PatreonIcon />
          {{ t('sponsors.patreonBtn') }}
        </a>
        <NuxtLink
          to="/sponsors"
          class="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-on-dark-secondary no-underline transition-colors font-sans"
          style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);"
        >
          {{ t('sponsors.learnMore') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
