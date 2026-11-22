<script setup lang="ts">
// The product on the first screen: real Buggregator screenshots in a window
// frame, one tab per event type. Tabs move on by themselves every 3.5 s
// until the visitor touches them; never with prefers-reduced-motion.
const { t } = useI18n()

const TABS = [
  { id: 'exceptions', src: '/img/ui/sentry.webp' },
  { id: 'email', src: '/img/ui/smtp.webp' },
  { id: 'dumps', src: '/img/ui/dumps.webp' },
  { id: 'profiler', src: '/img/ui/profiler.webp' },
] as const
type TabId = typeof TABS[number]['id']
const ids = TABS.map(tab => tab.id)

// Intrinsic size of every shot: the browser reserves the space.
const SHOT_W = 1920
const SHOT_H = 1200

const active = ref<TabId>('exceptions')
const current = computed(() => TABS.find(tab => tab.id === active.value) ?? TABS[0])
const { setTabRef, tabindex, onKeydown, select } = useRovingTabs(ids, active)

const ROTATE_MS = 3500
let timer: ReturnType<typeof setInterval> | null = null

function stopRotation() {
  if (timer) clearInterval(timer)
  timer = null
}

function choose(id: TabId) {
  stopRotation()
  select(id)
}

function onTabsKeydown(e: KeyboardEvent) {
  stopRotation()
  onKeydown(e)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    const i = ids.indexOf(active.value)
    active.value = ids[(i + 1) % ids.length]!
  }, ROTATE_MS)
})

onBeforeUnmount(stopRotation)
</script>

<template>
  <div class="hero-preview" role="group" :aria-label="t('hero.preview.label')" @focusin="stopRotation">
    <div class="hero-preview__bar">
      <span class="hero-preview__dots" aria-hidden="true"><i /><i /><i /></span>
      <div class="hero-preview__tabs" role="tablist" :aria-label="t('hero.preview.label')" @keydown="onTabsKeydown">
        <button
          v-for="tab in TABS"
          :id="`hero-tab-${tab.id}`"
          :key="tab.id"
          :ref="el => setTabRef(tab.id, el)"
          type="button"
          role="tab"
          class="hero-preview__tab"
          :aria-selected="active === tab.id"
          aria-controls="hero-preview-panel"
          :tabindex="tabindex(tab.id)"
          @click="choose(tab.id)"
        >
          {{ t(`hero.preview.tabs.${tab.id}`) }}
        </button>
      </div>
      <span class="hero-preview__live" aria-hidden="true">127.0.0.1:8000 · live</span>
    </div>
    <div id="hero-preview-panel" role="tabpanel" :aria-labelledby="`hero-tab-${current.id}`">
      <img
        :src="current.src"
        :alt="t(`hero.preview.alt.${current.id}`)"
        :width="SHOT_W"
        :height="SHOT_H"
        class="hero-preview__img"
        fetchpriority="high"
        decoding="async"
      />
    </div>
  </div>
</template>

<style scoped>
.hero-preview {
  max-width: 1040px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid theme('colors.landing-border');
  border-bottom: 0;
  border-radius: 12px 12px 0 0;
  background: theme('colors.landing-surface');
  box-shadow: 0 -20px 60px rgba(59, 130, 246, 0.08);
  text-align: left;
}

.hero-preview__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid theme('colors.landing-border');
  background: theme('colors.landing-elevated');
}

.hero-preview__dots {
  display: flex;
  gap: 6px;
}

.hero-preview__dots i {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: theme('colors.landing-border-hover');
}

.hero-preview__tabs {
  display: flex;
  gap: 4px;
  margin-left: 14px;
}

.hero-preview__tab {
  padding: 6px 10px;
  border-radius: 6px;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: theme('colors.on-dark.secondary');
  white-space: nowrap;
  transition: color 150ms ease, background-color 150ms ease;
}

.hero-preview__tab:hover {
  color: theme('colors.on-dark.primary');
}

.hero-preview__tab[aria-selected="true"] {
  background: theme('colors.landing-surface');
  color: theme('colors.on-dark.primary');
  box-shadow: inset 0 0 0 1px theme('colors.landing-border');
}

.hero-preview__tab:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -2px;
}

.hero-preview__live {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  color: theme('colors.on-dark.secondary');
}

.hero-preview__live::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: theme('colors.http-dump');
}

.hero-preview__img {
  display: block;
  width: 100%;
  height: 360px;
  object-fit: cover;
  object-position: top;
}

@media (max-width: 639px) {
  .hero-preview {
    border-radius: 10px 10px 0 0;
  }

  .hero-preview__dots,
  .hero-preview__live {
    display: none;
  }

  .hero-preview__tabs {
    margin-left: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .hero-preview__tab {
    min-height: 44px;
  }

  .hero-preview__img {
    height: 240px;
  }
}
</style>
