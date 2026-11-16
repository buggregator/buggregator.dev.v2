<script setup lang="ts">
import { LANGUAGE_TABS, type LanguageTab } from '~/data/languages'

// «Not PHP?»: right under the hero, one tab per language with what works,
// a short snippet and the setup guide. Everything is in the server HTML;
// only the copy button needs the browser.
const { t } = useI18n()
const { trackEvent } = useGtag()

type TabId = LanguageTab['id']
const ids = LANGUAGE_TABS.map(tab => tab.id)
const active = ref<TabId>('node')
const current = computed(() => LANGUAGE_TABS.find(tab => tab.id === active.value) ?? LANGUAGE_TABS[0]!)

const { setTabRef, tabindex, onKeydown, select } = useRovingTabs(ids, active)

// On a phone the tab row is wider than the screen: fade the side that has
// more tabs, so it is clear the row scrolls.
const tabBar = ref<HTMLElement | null>(null)
const { canScrollLeft, canScrollRight } = useScrollEdges(tabBar)
const { copied, copy } = useClipboardCopy()

async function copyCode() {
  if (await copy(current.value.code)) {
    trackEvent('copy_snippet', { cta_location: 'languages', language: current.value.id })
  }
}
</script>

<template>
  <section id="languages" class="py-16 lg:py-20 bg-section-mid border-t border-landing-border-subtle">
    <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-section font-bold text-white mb-3 font-sans">{{ t('languages.title') }}</h2>
        <p class="text-lg text-on-dark-secondary font-sans">{{ t('languages.subtitle') }}</p>
      </div>

      <div class="rounded-xl border border-code-border overflow-hidden">
        <div class="relative">
          <div
            ref="tabBar"
            class="flex gap-1 bg-code-bg px-2 pt-2 border-b border-code-border overflow-x-auto scroll-px-2"
            role="tablist"
            :aria-label="t('languages.tabsLabel')"
            @keydown="onKeydown"
          >
            <button
              v-for="tab in LANGUAGE_TABS"
              :id="`lang-tab-${tab.id}`"
              :key="tab.id"
              :ref="el => setTabRef(tab.id, el)"
              type="button"
              role="tab"
              :aria-selected="active === tab.id"
              aria-controls="lang-panel"
              :tabindex="tabindex(tab.id)"
              class="min-h-[44px] px-4 py-1.5 font-mono text-sm transition-colors duration-150 border-b-2 rounded-t-md whitespace-nowrap"
              :class="active === tab.id
                ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
                : 'text-[#8b949e] border-transparent hover:text-code-text'"
              @click="select(tab.id)"
            >
              {{ tab.label }}
            </button>
          </div>
          <div
            aria-hidden="true"
            class="pointer-events-none absolute top-0 bottom-px left-0 w-6 bg-gradient-to-r from-code-bg to-transparent transition-opacity duration-150"
            :class="canScrollLeft ? 'opacity-100' : 'opacity-0'"
          />
          <div
            aria-hidden="true"
            class="pointer-events-none absolute top-0 bottom-px right-0 w-6 bg-gradient-to-l from-code-bg to-transparent transition-opacity duration-150"
            :class="canScrollRight ? 'opacity-100' : 'opacity-0'"
          />
        </div>

        <div
          id="lang-panel"
          role="tabpanel"
          :aria-labelledby="`lang-tab-${current.id}`"
          class="bg-code-bg"
        >
          <p class="px-4 pt-4 font-sans text-sm text-on-dark-secondary leading-relaxed">
            {{ t(`languages.tabs.${current.id}`) }}
          </p>

          <div class="relative p-4">
            <p class="mb-2 font-mono text-xs text-on-dark-muted">{{ current.file }}</p>
            <pre class="font-mono text-xs leading-relaxed text-code-text whitespace-pre overflow-x-auto pr-10" tabindex="0" :aria-label="current.file">{{ current.code }}</pre>
            <ClientOnly>
              <button
                type="button"
                class="hit-area absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
                :class="copied
                  ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                  : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted hover:bg-[rgba(255,255,255,0.12)] hover:text-white'"
                :aria-label="copied ? t('hero.cta.copied') : t('languages.copy')"
                @click="copyCode"
              >
                <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </ClientOnly>
          </div>

          <div class="px-4 pb-4">
            <a
              :href="current.docs"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
            >{{ t('languages.setupLink') }}<span class="sr-only">: {{ current.label }}</span>&nbsp;<span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </div>

      <p class="mt-4 font-sans text-sm text-on-dark-muted leading-relaxed">
        <i18n-t keypath="languages.docker" scope="global">
          <template #host><code class="font-mono text-code-text">127.0.0.1</code></template>
          <template #example><code class="font-mono text-code-text">http://sentry@buggregator:8000/1</code></template>
        </i18n-t>
      </p>
    </div>
  </section>
</template>
