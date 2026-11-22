<script setup lang="ts">
import EnMarker from '~/components/ui/EnMarker.vue'

export type ReplacesRowData = {
  // Key of replaces.table.rows.<key>: instead, with, desc.
  key: string
  // Feature page: English only, no locale prefix.
  to: string
  color: string
  // Inner markup of a 24×24 stroked icon.
  icon: string
}

const props = defineProps<{ row: ReplacesRowData }>()
const { t, locale } = useI18n()

// «Sentry self-hosted · GlitchTip, for local dev»: the names stand out,
// the note after the first comma or dash is quieter.
const instead = computed(() => {
  const text = t(`replaces.table.rows.${props.row.key}.instead`)
  const m = text.match(/^(.*?)((?:, | — ).*)$/)
  return m ? { names: m[1], note: m[2] } : { names: text, note: '' }
})

// Phone layout: the feature on top, «instead of …» under it.
const insteadOf = computed(() => t('replaces.table.label').toLocaleLowerCase(locale.value))
</script>

<template>
  <NuxtLink :to="row.to" class="replaces-row group" :data-replaces-item="row.key">
    <span class="replaces-row__was">
      <span class="replaces-row__prefix">{{ insteadOf }} </span>
      <span class="replaces-row__names">{{ instead.names }}</span><span class="replaces-row__note">{{ instead.note }}</span>
    </span>
    <span class="replaces-row__arrow" aria-hidden="true">→</span>
    <span class="replaces-row__now">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <svg class="replaces-row__icon" viewBox="0 0 24 24" fill="none" :stroke="row.color" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="row.icon" />
      <span class="min-w-0">
        <span class="replaces-row__name">{{ t(`replaces.table.rows.${row.key}.with`) }}</span>
        <EnMarker class="ml-2 align-[2px]" />
        <span class="replaces-row__desc">{{ t(`replaces.table.rows.${row.key}.desc`) }}</span>
      </span>
    </span>
    <svg class="replaces-row__go" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  </NuxtLink>
</template>

<style scoped>
.replaces-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 32px minmax(0, 1.15fr) 24px;
  gap: 16px;
  align-items: center;
  padding: 11px 24px;
  font-family: "DM Sans", sans-serif;
  text-decoration: none;
  transition: background-color 150ms ease;
}

.replaces-row__was {
  font-family: "JetBrains Mono", monospace;
  font-variant-ligatures: none;
  font-size: 14px;
  line-height: 1.45;
  color: theme('colors.on-dark.secondary');
}

.replaces-row__names {
  color: theme('colors.on-dark.primary');
}

.replaces-row__note {
  color: theme('colors.on-dark.muted');
}

/* «instead of» shows on phones; on wider screens the column header says it. */
.replaces-row__prefix {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.replaces-row__arrow {
  font-size: 18px;
  line-height: 1;
  text-align: center;
  color: theme('colors.on-dark.muted');
  transform: translateY(-2px);
}

.replaces-row__now {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.replaces-row__icon {
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}

.replaces-row__name {
  font-size: 16px;
  font-weight: 600;
  color: theme('colors.on-dark.primary');
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.replaces-row__desc {
  display: block;
  font-size: 14px;
  color: theme('colors.on-dark.secondary');
}

.replaces-row__go {
  color: theme('colors.on-dark.muted');
  transition: transform 150ms ease, color 150ms ease;
}

/* States: hover lighter row, arrow moves, name underlined; keyboard focus
   2 px #60a5fa ring; pressed one step darker. */
.replaces-row:hover {
  background: theme('colors.landing-elevated');
}

.replaces-row:hover .replaces-row__go {
  color: theme('colors.on-dark.primary');
  transform: translateX(3px);
}

.replaces-row:hover .replaces-row__name {
  text-decoration-line: underline;
}

.replaces-row:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -2px;
  background: theme('colors.landing-elevated');
}

.replaces-row:active {
  background: theme('colors.landing-border');
}

@media (max-width: 639px) {
  .replaces-row {
    grid-template-columns: minmax(0, 1fr) 20px;
    grid-template-areas: "now go" "was go";
    gap: 6px 12px;
    min-height: 44px;
    padding: 14px 16px;
  }

  .replaces-row__now {
    grid-area: now;
  }

  .replaces-row__was {
    grid-area: was;
    padding-left: 32px;
    font-size: 13px;
  }

  .replaces-row__prefix {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    font-family: "DM Sans", sans-serif;
    color: theme('colors.on-dark.muted');
  }

  .replaces-row__arrow {
    display: none;
  }

  .replaces-row__go {
    grid-area: go;
  }
}

@media (prefers-reduced-motion: reduce) {
  .replaces-row,
  .replaces-row__go {
    transition: none;
  }
}
</style>
