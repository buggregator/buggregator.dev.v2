<script setup lang="ts">
const { t } = useI18n()
const { trackEvent } = useGtag()

const utm = 'utm_source=buggregator.dev&utm_medium=referral&utm_campaign=built-with-harnsy'
const ctaUrl = `https://harnsy.dev/?${utm}&utm_content=section-cta`
const badgeUrl = `https://harnsy.dev/?${utm}&utm_content=section-badge`
</script>

<template>
  <section
    id="harnsy"
    class="py-20 lg:py-24 bg-section-mid border-y border-landing-border harnsy-glow"
    aria-labelledby="harnsy-title"
  >
    <div class="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <a
        :href="badgeUrl"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center min-h-[44px] mb-4 rounded-full"
        @click="trackEvent('cta_click', { cta_location: 'harnsy', cta_text: 'harnsy_badge' })"
      >
        <img src="/brand/built-with-harnsy-dark.svg" alt="Built with harnsy" width="142" height="28" loading="lazy" class="block h-7 w-auto">
      </a>
      <h2 id="harnsy-title" class="text-section font-bold text-white mb-4 font-sans">
        {{ t('harnsy.title') }}
      </h2>
      <p class="max-w-[60ch] mx-auto text-base text-on-dark-secondary leading-relaxed font-sans">
        {{ t('harnsy.description') }}
      </p>
      <a
        :href="ctaUrl"
        target="_blank"
        rel="noopener"
        class="mt-8 inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto rounded-xl border border-landing-border hover:bg-landing-elevated text-white text-sm font-semibold px-5 no-underline transition-colors font-sans"
        @click="trackEvent('cta_click', { cta_location: 'harnsy', cta_text: 'harnsy_site' })"
      >
        {{ t('harnsy.cta') }} ↗
      </a>
    </div>
  </section>
</template>

<style scoped>
.harnsy-glow {
  background-image: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(59, 130, 246, 0.08), transparent 70%);
}
</style>
