<script setup lang="ts">
import FeatureIcon from '~/components/ui/FeatureIcon.vue'
import EnMarker from '~/components/ui/EnMarker.vue'
import { FEATURE_PAGES, type FeatureId } from '~/data/features'

// The real interface on the first screen, one tab per feature: the
// screenshot of its feature page and a link to that page. It was a block of
// its own («This is what you get») under a second, smaller window in the
// hero; the owner merged the two (#6682). Shots: public/features/*.png with
// WebP twins. The first shot is the page's largest image: loaded eagerly.
const { t } = useI18n()

type Tab = {
  id: FeatureId
  src: string
  width: number
  height: number
  // Caption: replaces.table.rows.<row>.desc where the row exists, else realUiTabs.desc.<id>.
  row?: string
}

const TABS: Tab[] = [
  { id: 'sentry', src: '/features/sentry.png', width: 1317, height: 931, row: 'errors' },
  { id: 'email', src: '/features/email-testing.png', width: 1317, height: 931, row: 'email' },
  { id: 'profiler', src: '/features/profiler.png', width: 1317, height: 931, row: 'prof' },
  { id: 'proxy', src: '/features/http-proxy.png', width: 1317, height: 989, row: 'proxy' },
  { id: 'sms', src: '/features/sms.png', width: 1317, height: 931, row: 'sms' },
  { id: 'cron', src: '/features/cron-monitoring.png', width: 1600, height: 1000 },
  { id: 'broadcast', src: '/features/broadcast-events.png', width: 1600, height: 1000 },
  { id: 'csp', src: '/features/csp-reports.png', width: 1600, height: 1000 },
]
const ids = TABS.map(tab => tab.id)

const active = ref<FeatureId>('sentry')
const current = computed(() => TABS.find(tab => tab.id === active.value) ?? TABS[0]!)
const page = computed(() => FEATURE_PAGES[current.value.id])
const caption = computed(() => current.value.row
  ? t(`replaces.table.rows.${current.value.row}.desc`)
  : t(`realUiTabs.desc.${current.value.id}`))

const { setTabRef, tabindex, onKeydown, select } = useRovingTabs(ids, active)

const tabBar = ref<HTMLElement | null>(null)
const { canScrollLeft, canScrollRight } = useScrollEdges(tabBar)
</script>

<template>
  <div id="real-ui" class="text-left">
    <div class="relative mb-4">
      <div
        ref="tabBar"
        class="real-ui__tabs flex gap-1 overflow-x-auto scroll-px-2"
        role="tablist"
        :aria-label="t('realUiTabs.tabsLabel')"
        @keydown="onKeydown"
      >
        <button
          v-for="tab in TABS"
          :id="`real-ui-tab-${tab.id}`"
          :key="tab.id"
          :ref="el => setTabRef(tab.id, el)"
          type="button"
          role="tab"
          :aria-selected="active === tab.id"
          aria-controls="real-ui-panel"
          :tabindex="tabindex(tab.id)"
          class="real-ui__tab"
          @click="select(tab.id)"
        >
          <FeatureIcon :name="FEATURE_PAGES[tab.id].icon" />
          {{ FEATURE_PAGES[tab.id].label }}
        </button>
      </div>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-section-dark to-transparent transition-opacity duration-150"
        :class="canScrollLeft ? 'opacity-100' : 'opacity-0'"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-section-dark to-transparent transition-opacity duration-150"
        :class="canScrollRight ? 'opacity-100' : 'opacity-0'"
      />
    </div>

    <figure id="real-ui-panel" role="tabpanel" :aria-labelledby="`real-ui-tab-${current.id}`" class="m-0">
      <div class="rounded-xl overflow-hidden border border-landing-border-subtle shadow-showcase bg-landing-deepest">
        <picture>
          <source :srcset="current.src.replace(/\.png$/, '.webp')" type="image/webp" />
          <img
            :src="current.src"
            :alt="t(`realUiTabs.alt.${current.id}`)"
            :width="current.width"
            :height="current.height"
            class="block w-full h-auto"
            :loading="current.id === TABS[0]!.id ? 'eager' : 'lazy'"
            :fetchpriority="current.id === TABS[0]!.id ? 'high' : 'auto'"
            decoding="async"
          />
        </picture>
      </div>
      <figcaption class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6 gap-y-1 font-sans">
        <span class="text-on-dark-secondary">{{ caption }}</span>
        <NuxtLink :to="page.to" class="real-ui__link">
          {{ t('realUiTabs.open', { feature: page.label }) }}
          <EnMarker />
        </NuxtLink>
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
/* Centred while the tabs fit; when they overflow, they start at the left
   edge and scroll. Plain `center` pushed the first tab out of reach. */
.real-ui__tabs {
  justify-content: safe center;
}

.real-ui__tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  color: theme('colors.on-dark.secondary');
  transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
}

.real-ui__tab:hover {
  color: theme('colors.on-dark.primary');
  background: theme('colors.landing-surface');
}

.real-ui__tab[aria-selected="true"] {
  color: theme('colors.on-dark.primary');
  background: theme('colors.landing-elevated');
  border-color: theme('colors.landing-border');
}

.real-ui__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  min-height: 44px;
  font-weight: 500;
  color: theme('colors.accent.DEFAULT');
  text-decoration: none;
}

.real-ui__link:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
