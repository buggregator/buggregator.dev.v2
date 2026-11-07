<script setup lang="ts">
const { t } = useI18n()
const { trackEvent } = useGtag()

const utm = 'utm_source=buggregator.dev&utm_medium=referral&utm_campaign=built-with-harnsy'
const harnsyUrl = `https://harnsy.dev/?${utm}&utm_content=ecosystem-cta`
const badgeUrl = `https://harnsy.dev/?${utm}&utm_content=ecosystem-badge`
</script>

<template>
  <div class="mt-8 rounded-2xl border border-landing-border-subtle bg-landing-surface p-6 sm:p-8 hover:border-accent/45 transition-colors duration-200 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
    <div class="flex-1 min-w-0">
      <a
        :href="badgeUrl"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center min-h-[44px] mb-2 rounded-full"
        @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'harnsy_badge' })"
      >
        <img src="/brand/built-with-harnsy-dark.svg" alt="Built with harnsy" width="142" height="28" loading="lazy" class="block h-7 w-auto">
      </a>
      <h3 class="text-xl font-semibold text-white mb-2 font-sans">{{ t('harnsy.title') }}</h3>
      <p class="text-sm text-on-dark-muted leading-relaxed font-sans">{{ t('harnsy.description') }}</p>
    </div>
    <a
      :href="harnsyUrl"
      target="_blank"
      rel="noopener"
      class="shrink-0 inline-flex items-center justify-center min-h-[44px] w-full lg:w-auto rounded-xl border border-landing-border hover:bg-landing-elevated text-white text-sm font-semibold px-5 no-underline transition-colors font-sans"
      @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'harnsy_site' })"
    >
      {{ t('harnsy.cta') }} ↗
    </a>
  </div>
</template>
