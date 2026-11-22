<script setup lang="ts">
import ReplacesRow, { type ReplacesRowData } from '~/components/sections/ReplacesSection/ReplacesRow.vue'

const { t } = useI18n()

// «Instead of → in Buggregator»: what a visitor runs today, and the feature
// page that does the same job. Every row is a link. Order: search volume and
// fit (marketing, Keyword Planner 2026-11-21). Texts: replaces.table.rows.<key>.
const rows: ReplacesRowData[] = [
  { key: 'email', to: '/features/email-testing', color: '#f59e0b', icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>' },
  { key: 'http', to: '/features/http-dumps', color: '#22c55e', icon: '<path d="M4 7h11M4 12h16M4 17h8"/><path d="m16 14 4 3-4 3"/>' },
  { key: 'errors', to: '/features/sentry', color: '#f43f5e', icon: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/>' },
  { key: 'mock', to: '/features/mock-server', color: '#38bdf8', icon: '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>' },
  { key: 'dumps', to: '/features/dumps', color: '#06b6d4', icon: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>' },
  { key: 'prof', to: '/features/profiler', color: '#a78bfa', icon: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>' },
  { key: 'logs', to: '/features/logs', color: '#9ca3af', icon: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 19h4"/>' },
  { key: 'proxy', to: '/features/http-proxy', color: '#10b981', icon: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>' },
  { key: 'sms', to: '/features/sms', color: '#c084fc', icon: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>' },
]
</script>

<template>
  <section id="replaces" class="py-16 lg:py-24 bg-section-mid replaces-gradient" aria-labelledby="replaces-title">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h2 id="replaces-title" class="text-[1.75rem] sm:text-4xl leading-tight font-bold text-white mb-3 font-sans">
          {{ t('replaces.table.title') }}
        </h2>
        <p class="max-w-[620px] mx-auto text-base sm:text-[17px] text-on-dark-secondary font-sans">
          {{ t('replaces.table.subtitle') }}
        </p>
      </div>

      <div class="replaces-table">
        <div class="replaces-table__head" aria-hidden="true">
          <span>{{ t('replaces.table.label') }}</span>
          <span />
          <span>Buggregator</span>
          <span />
        </div>
        <ul class="list-none m-0 p-0">
          <li v-for="row in rows" :key="row.key">
            <ReplacesRow :row="row" />
          </li>
        </ul>
        <p class="replaces-table__note">{{ t('replaces.table.footer') }}</p>
      </div>

      <p class="text-center mt-9 text-lg font-semibold text-white font-sans">
        {{ t('replaces.footer') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.replaces-gradient {
  background-image:
    radial-gradient(ellipse 50% 60% at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 20% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 70%);
}

.replaces-table {
  overflow: hidden;
  border: 1px solid theme('colors.landing-border');
  border-radius: 12px;
  background: theme('colors.landing-surface');
}

.replaces-table__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px minmax(0, 1.15fr) 24px;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid theme('colors.landing-border');
  font-family: "DM Sans", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: theme('colors.on-dark.muted');
}

.replaces-table li + li {
  border-top: 1px solid theme('colors.landing-border-subtle');
}

.replaces-table__note {
  margin: 0;
  padding: 12px 24px;
  border-top: 1px solid theme('colors.landing-border');
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  color: theme('colors.on-dark.secondary');
}

@media (max-width: 639px) {
  .replaces-table__head {
    display: none;
  }

  .replaces-table__note {
    padding: 12px 16px;
  }
}
</style>
