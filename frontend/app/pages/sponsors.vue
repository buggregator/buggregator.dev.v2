<script setup lang="ts">
import { sponsors } from '~/data/sponsors'
import SponsorCard from '~/components/sections/SponsorsSection/SponsorCard.vue'
import PatreonIcon from '~/components/icons/PatreonIcon.vue'

definePageMeta({ layout: 'landing' })

const { t } = useI18n()
const { patreonUrl, sponsorEmail } = useRuntimeConfig().public

useSeoMeta({
  title: 'Sponsor Buggregator — Support Free Open Source PHP Debugging',
  description: 'Buggregator is a free, open-source debugging server for PHP developers. Support its development via Patreon or company sponsorship.',
  ogTitle: 'Sponsor Buggregator',
  ogDescription: 'Keep Buggregator free forever. Support via Patreon or become a company sponsor.',
})

const hasSponsors = computed(() => sponsors.length > 0)

const individualPerks = [
  'Your name in the FUNDING.yml',
  'Your avatar in the Sponsors section',
  'Our eternal gratitude',
]

const companyPerks = [
  'Your logo on buggregator.dev homepage',
  'Your logo in the GitHub README',
  'Your logo in the docs header',
  'A thank-you post on our socials',
]
</script>

<template>
  <div class="pt-24 pb-16">
    <!-- Hero -->
    <section class="py-20 text-center bg-section-dark">
      <div class="max-w-2xl mx-auto px-4">
        <h1 class="text-3xl lg:text-4xl font-bold text-white mb-4 font-sans">
          {{ t('sponsors.page.title') }}
        </h1>
        <p class="text-base text-on-dark-secondary leading-relaxed mb-8 font-sans">
          {{ t('sponsors.page.subheadline') }}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <a
            :href="patreonUrl as string"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white no-underline"
            style="background: #FF424D;"
          >
            <PatreonIcon />
            {{ t('sponsors.page.ctaPatreon') }}
          </a>
          <a
            :href="`mailto:${sponsorEmail}`"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-on-dark-secondary no-underline font-sans"
            style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);"
          >
            {{ t('sponsors.page.ctaEmail') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Why sponsor -->
    <section class="py-16 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4">
        <h2 class="text-xl font-bold text-white mb-8 text-center font-sans">
          {{ t('sponsors.page.why.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="key in ['free', 'recognition', 'oss']"
            :key="key"
            class="rounded-xl p-6"
            style="background: rgba(255,255,255,0.04); border: 1px solid #1e2128;"
          >
            <h3 class="text-sm font-semibold text-white mb-2 font-sans">
              {{ t(`sponsors.page.why.${key}.title`) }}
            </h3>
            <p class="text-xs text-on-dark-secondary leading-relaxed font-sans">
              {{ t(`sponsors.page.why.${key}.body`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Current sponsors -->
    <section class="py-16 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 text-center">
        <h2 class="text-xl font-bold text-white mb-8 font-sans">
          {{ hasSponsors ? t('sponsors.page.currentSponsors') : t('sponsors.page.noSponsors') }}
        </h2>
        <div v-if="hasSponsors" class="flex flex-wrap justify-center gap-4">
          <SponsorCard v-for="s in sponsors" :key="s.id" :sponsor="s" :tier="s.tier" />
        </div>
      </div>
    </section>

    <!-- Tiers -->
    <section class="py-16 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[800px] mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Individual -->
          <div class="rounded-xl p-6" style="background: rgba(255,69,77,0.08); border: 1px solid rgba(255,69,77,0.2);">
            <p class="text-sm font-semibold text-white font-sans">{{ t('sponsors.page.tiers.individual.label') }}</p>
            <p class="text-xs text-on-dark-muted font-sans mb-3">{{ t('sponsors.page.tiers.individual.via') }}</p>
            <p class="text-xs text-on-dark-secondary font-sans mb-4">{{ t('sponsors.page.tiers.individual.from') }}</p>
            <ul class="space-y-2 mb-6">
              <li v-for="perk in individualPerks" :key="perk" class="flex items-start gap-2 text-xs text-on-dark-secondary font-sans">
                <svg class="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ perk }}
              </li>
            </ul>
            <a
              :href="patreonUrl as string"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 text-sm font-medium text-[#FF424D] no-underline hover:underline font-sans"
            >
              <PatreonIcon />
              {{ t('sponsors.page.tiers.individual.cta') }}
            </a>
          </div>

          <!-- Company -->
          <div class="rounded-xl p-6" style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);">
            <p class="text-sm font-semibold text-white font-sans">{{ t('sponsors.page.tiers.company.label') }}</p>
            <p class="text-xs text-on-dark-muted font-sans mb-3">{{ t('sponsors.page.tiers.company.via') }}</p>
            <p class="text-xs text-on-dark-secondary font-sans mb-4">{{ t('sponsors.page.tiers.company.from') }}</p>
            <ul class="space-y-2 mb-6">
              <li v-for="perk in companyPerks" :key="perk" class="flex items-start gap-2 text-xs text-on-dark-secondary font-sans">
                <svg class="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ perk }}
              </li>
            </ul>
            <a
              :href="`mailto:${sponsorEmail}`"
              class="inline-flex items-center gap-2 text-sm font-medium text-accent no-underline hover:underline font-sans"
            >
              {{ t('sponsors.page.tiers.company.cta') }} {{ sponsorEmail }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-lg mx-auto px-4 text-center">
        <h3 class="text-lg font-semibold text-white mb-3 font-sans">
          {{ t('sponsors.page.contact.title') }}
        </h3>
        <p class="text-sm text-on-dark-secondary mb-6 font-sans">
          {{ t('sponsors.page.contact.body') }}
        </p>
        <a
          :href="`mailto:${sponsorEmail}`"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white no-underline font-mono"
          style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);"
        >
          {{ sponsorEmail }}
        </a>
        <p class="text-xs text-on-dark-muted mt-6 font-sans">
          {{ t('sponsors.page.contact.or') }}
        </p>
        <a
          :href="patreonUrl as string"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 mt-3 text-sm text-[#FF424D] no-underline hover:underline font-mono"
        >
          <PatreonIcon />
          patreon.com/butschster
        </a>
      </div>
    </section>
  </div>
</template>
