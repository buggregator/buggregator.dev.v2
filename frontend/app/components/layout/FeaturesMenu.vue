<script setup lang="ts">
import FeatureMenuLink from '~/components/layout/FeaturesMenu/FeatureMenuLink.vue'
import FeatureMenuFooter from '~/components/layout/FeaturesMenu/FeatureMenuFooter.vue'
import { FEATURE_MENU_COLUMNS, FEATURE_PAGES } from '~/data/features'

// «Features» mega-menu (desktop): six task groups in three columns.
// Opens on click, Enter, Space or ↓, and on hover after a short pause.
// Keys inside: ↑/↓ in a column, ←/→ to the next column, Home/End;
// Esc closes and gives focus back to «Features»; tabbing out closes it.
const { t } = useI18n()

const open = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const panel = ref<HTMLElement | null>(null)

const HOVER_DELAY = 150
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let openedByHover = false

function clearHover() {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = null
}

function onEnter() {
  clearHover()
  if (open.value) return
  hoverTimer = setTimeout(() => {
    open.value = true
    openedByHover = true
  }, HOVER_DELAY)
}

function onLeave() {
  clearHover()
  hoverTimer = setTimeout(() => { open.value = false }, HOVER_DELAY)
}

// A tap fires mouseenter and click at once; a click right after a hover
// open keeps the menu open. Enter/Space (detail 0) always toggle.
function onTriggerClick(e: MouseEvent) {
  clearHover()
  if (e.detail !== 0 && open.value && openedByHover) {
    openedByHover = false
    return
  }
  openedByHover = false
  open.value = !open.value
}

function close(returnFocus = false) {
  clearHover()
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

// The links of each column, top to bottom, as rendered.
function columns(): HTMLElement[][] {
  if (!panel.value) return []
  return [...panel.value.querySelectorAll<HTMLElement>('[data-menu-column]')]
    .map(col => [...col.querySelectorAll<HTMLElement>('[data-menu-item]')])
}

async function focusFirst() {
  open.value = true
  await nextTick()
  columns()[0]?.[0]?.focus()
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusFirst()
  }
}

function onPanelKeydown(e: KeyboardEvent) {
  const cols = columns()
  const current = document.activeElement as HTMLElement | null
  const ci = cols.findIndex(col => current !== null && col.includes(current))
  if (ci < 0) return
  const col = cols[ci]!
  const ri = col.indexOf(current!)
  const across = (dir: 1 | -1) => {
    const next = cols[ci + dir]
    return next ? next[Math.min(ri, next.length - 1)] : undefined
  }
  let target: HTMLElement | undefined
  if (e.key === 'ArrowDown') target = col[ri + 1]
  else if (e.key === 'ArrowUp') target = ri > 0 ? col[ri - 1] : trigger.value ?? undefined
  else if (e.key === 'ArrowRight') target = across(1)
  else if (e.key === 'ArrowLeft') target = across(-1)
  else if (e.key === 'Home') target = col[0]
  else if (e.key === 'End') target = col[col.length - 1]
  if (!target) return
  e.preventDefault()
  target.focus()
}

function onFocusOut(e: FocusEvent) {
  const box = e.currentTarget as HTMLElement
  if (!box.contains(e.relatedTarget as Node | null)) close()
}

function onDocumentClick(e: MouseEvent) {
  const box = trigger.value?.parentElement
  if (open.value && box && !box.contains(e.target as Node)) close()
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => {
  clearHover()
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <!-- Not positioned: the panel hangs from the navbar, centred on the page. -->
  <div
    class="features-menu"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusout="onFocusOut"
    @keydown.esc="close(true)"
  >
    <button
      ref="trigger"
      type="button"
      class="features-menu__trigger"
      :aria-expanded="open"
      aria-controls="features-menu-panel"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      {{ t('nav.features') }}
      <svg class="features-menu__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div
      v-show="open"
      id="features-menu-panel"
      ref="panel"
      class="features-menu__panel"
      @keydown="onPanelKeydown"
    >
      <div class="features-menu__cols">
        <div v-for="(column, ci) in FEATURE_MENU_COLUMNS" :key="ci" data-menu-column>
          <div
            v-for="group in column"
            :key="group.id"
            class="features-menu__group"
            role="group"
            :aria-labelledby="`fm-group-${group.id}`"
          >
            <p :id="`fm-group-${group.id}`" class="features-menu__group-title">
              {{ t(`featureMenu.groups.${group.id}`) }}
            </p>
            <FeatureMenuLink
              v-for="id in group.features"
              :key="id"
              :feature="FEATURE_PAGES[id]"
              data-menu-item
              @click="close()"
            />
          </div>
        </div>
      </div>
      <FeatureMenuFooter @navigate="close()" />
    </div>
  </div>
</template>

<style scoped>
.features-menu__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 64px;
  padding: 0 2px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: theme('colors.on-dark.secondary');
  transition: color 150ms ease;
}

.features-menu__trigger:hover,
.features-menu__trigger[aria-expanded="true"] {
  color: theme('colors.on-dark.primary');
}

.features-menu__trigger:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -14px;
  border-radius: 6px;
}

.features-menu__trigger[aria-expanded="true"]::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: theme('colors.on-dark.primary');
}

.features-menu__chevron {
  transition: transform 150ms ease;
}

.features-menu__trigger[aria-expanded="true"] .features-menu__chevron {
  transform: rotate(180deg);
}

.features-menu__panel {
  position: absolute;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: max-content;
  max-width: calc(100vw - 32px);
  background: theme('colors.landing-surface');
  border: 1px solid theme('colors.landing-border');
  border-top: 0;
  border-radius: 0 0 14px 14px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.features-menu__cols {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 8px 40px;
  padding: 24px 28px 18px;
}

.features-menu__group + .features-menu__group {
  margin-top: 18px;
}

.features-menu__group-title {
  margin: 0 0 6px;
  padding: 0 10px;
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: theme('colors.on-dark.muted');
}

@media (prefers-reduced-motion: reduce) {
  .features-menu__chevron {
    transition: none;
  }
}
</style>
