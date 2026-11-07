<script setup lang="ts">
const { t } = useI18n()
const { trackEvent } = useGtag()
</script>

<template>
  <div class="rounded-2xl border border-landing-border-subtle bg-landing-surface p-6 hover:-translate-y-0.5 hover:border-accent/45 transition-all duration-200">
    <div class="flex items-start justify-between mb-4">
      <div class="w-10 h-10 rounded-xl bg-[rgba(34,197,94,0.12)] flex items-center justify-center">
        <svg class="w-5 h-5 text-code-prompt" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <span class="text-xs font-mono text-on-dark-muted bg-landing-elevated px-2 py-0.5 rounded-full border border-landing-border-subtle">
        {{ t('ecosystem.testo.badge') }}
      </span>
    </div>
    <h3 class="text-lg font-semibold text-white mb-2 font-sans">{{ t('ecosystem.testo.title') }}</h3>
    <i18n-t keypath="ecosystem.testo.description" tag="p" scope="global" class="text-sm text-on-dark-muted leading-relaxed mb-4 font-sans">
      <template #attr>
        <code class="font-mono text-xs whitespace-nowrap">#[Bench]</code>
      </template>
    </i18n-t>

    <div class="mb-2 bg-landing-elevated rounded-xl border border-landing-border-subtle p-3 overflow-x-auto">
      <code class="font-mono text-xs text-on-dark-secondary whitespace-pre">{{ t('ecosystem.testo.code') }}</code>
    </div>

    <div class="flex flex-wrap gap-x-5">
      <a
        href="https://php-testo.github.io/"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
        @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'testo_site' })"
      >
        {{ t('ecosystem.testo.cta') }} ↗
      </a>
      <a
        href="https://github.com/php-testo/testo"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
        @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'testo_github' })"
      >
        {{ t('ecosystem.testo.github') }} ↗
      </a>
    </div>
  </div>
</template>
