<script setup lang="ts">
import { flameTextColor, useFlameGraph, type FlameFrame, type FlameNode } from '~/composables/useFlameGraph'

const props = defineProps<{
  data: FlameNode[]
  /** Accessible name of the graph. */
  label: string
}>()

const ROW = 20
const GAP = 1
const CARD_WIDTH = 288

const { frames, byId, rootIds, depth, total, ticks, zoomedId, place, zoom, neighbour } = useFlameGraph(toRef(props, 'data'))

const wrapper = ref<HTMLElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
const graph = ref<HTMLElement | null>(null)
const { canScrollLeft, canScrollRight } = useScrollEdges(scroller)

// Width of the bar area: assumed on the server, measured after mount.
const graphWidth = ref(960)
// Pointer devices get a floating card and click-to-zoom; touch gets tap-to-select
// and the card below the graph. False on the server and before mount.
const canHover = ref(false)
let observer: ResizeObserver | null = null

onMounted(() => {
  canHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (graph.value) {
    observer = new ResizeObserver(() => { graphWidth.value = graph.value?.clientWidth ?? graphWidth.value })
    observer.observe(graph.value)
  }
})
onUnmounted(() => observer?.disconnect())

const visible = computed(() =>
  frames.value
    .map(frame => ({ frame, box: place(frame) }))
    .filter((v): v is { frame: FlameFrame, box: { left: number, width: number } } => v.box !== null),
)

// Roving focus: the graph is one tab stop.
const focusedId = ref<string>(rootIds.value[0] ?? '0')
const activeId = ref<string | null>(null)
const active = computed(() => (activeId.value ? byId.value.get(activeId.value) ?? null : null))
const cardAt = ref({ x: 0, y: 0 })

function pointAt(clientX: number, clientY: number) {
  const rect = wrapper.value?.getBoundingClientRect()
  if (!rect) return
  const x = clientX - rect.left + 16
  cardAt.value = {
    x: Math.max(8, Math.min(x, rect.width - CARD_WIDTH - 8)),
    y: clientY - rect.top + 16,
  }
}

function onEnter(frame: FlameFrame, event: MouseEvent) {
  if (!canHover.value) return
  activeId.value = frame.id
  pointAt(event.clientX, event.clientY)
}

function onMove(event: MouseEvent) {
  if (canHover.value && activeId.value) pointAt(event.clientX, event.clientY)
}

function onLeave() {
  if (canHover.value) activeId.value = null
}

function onClick(frame: FlameFrame) {
  focusedId.value = frame.id
  if (canHover.value) zoom(frame.id)
  else activeId.value = activeId.value === frame.id ? null : frame.id
}

function onFocus(frame: FlameFrame, event: FocusEvent) {
  focusedId.value = frame.id
  // Card follows keyboard focus only; a mouse click keeps the pointer card.
  if (!(event.target as HTMLElement).matches(':focus-visible')) return
  activeId.value = frame.id
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  pointAt(rect.left + Math.min(rect.width, 160) / 2, rect.bottom - 8)
}

function onFocusOut(event: FocusEvent) {
  if (canHover.value && !graph.value?.contains(event.relatedTarget as Node | null)) activeId.value = null
}

function focusFrame(id: string) {
  focusedId.value = id
  nextTick(() => graph.value?.querySelector<HTMLElement>(`[data-frame="${id}"]`)?.focus())
}

const KEYS: Record<string, 'left' | 'right' | 'up' | 'down'> = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
}

function onKeydown(event: KeyboardEvent) {
  const dir = KEYS[event.key]
  if (dir) {
    event.preventDefault()
    const next = neighbour(focusedId.value, dir)
    const frame = next ? byId.value.get(next) : undefined
    if (frame && place(frame)) focusFrame(frame.id)
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    zoom(focusedId.value)
  } else if (event.key === 'Escape') {
    resetZoom()
  }
}

function resetZoom() {
  if (!zoomedId.value) return
  const id = zoomedId.value
  zoom(null)
  if (graph.value?.contains(document.activeElement)) focusFrame(id)
}

function zoomActive() {
  if (activeId.value) zoom(activeId.value)
}

const zoomedName = computed(() => (zoomedId.value ? byId.value.get(zoomedId.value)?.node.name : null))

function ms(value: number) {
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ms`
}

function bytes(value: number) {
  if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`
  if (value >= 1024) return `${Math.round(value / 1024)} KB`
  return `${value} B`
}

const nameParts = computed(() => active.value?.node.name.split(/(?<=\\|::)/) ?? [])

const stats = computed(() => {
  const frame = active.value
  if (!frame) return []
  const { cost } = frame.node
  const share = ((frame.end - frame.start) / (total.value.end || 1)) * 100
  return [
    { label: 'Wall time', value: ms(cost.wt / 1000) },
    { label: 'CPU time', value: ms(cost.cpu / 1000) },
    { label: 'Memory', value: bytes(cost.mu) },
    { label: 'Calls', value: String(cost.ct) },
    { label: 'Of request', value: `${share < 1 ? share.toFixed(1) : Math.round(share)}%` },
  ]
})
</script>

<template>
  <div ref="wrapper" class="relative rounded-xl border border-landing-border-subtle bg-landing-deepest">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-3 px-3 py-1.5 border-b border-landing-border-subtle">
      <p class="min-w-0 truncate font-mono text-xs text-on-dark-muted">
        <template v-if="zoomedName">
          Zoomed: <span class="text-on-dark-secondary">{{ zoomedName }}</span>
        </template>
        <template v-else>
          {{ ms(total.end) }} · {{ frames.length }} calls
        </template>
      </p>
      <button
        type="button"
        class="shrink-0 min-h-11 px-3 rounded-lg font-sans text-sm text-on-dark-secondary hover:bg-white/5 hover:text-white transition-colors"
        :class="zoomedId ? '' : 'opacity-50 cursor-default hover:bg-transparent hover:text-on-dark-secondary'"
        :aria-disabled="!zoomedId"
        @click="resetZoom"
      >
        Reset zoom
      </button>
    </div>

    <!-- Graph: scrolls sideways on narrow screens -->
    <div class="relative">
      <div ref="scroller" class="overflow-x-auto">
        <div class="min-w-[720px] px-3 pt-2 pb-3">
          <!-- Time axis -->
          <div class="relative h-5 font-mono text-[10px] text-on-dark-muted" aria-hidden="true">
            <span
              v-for="tick in ticks"
              :key="tick.percent"
              class="absolute top-0 pl-1 border-l border-landing-border-subtle h-full"
              :style="{ left: `${tick.percent}%` }"
            >{{ ms(tick.ms) }}</span>
          </div>

          <div
            ref="graph"
            role="group"
            :aria-label="label"
            :aria-describedby="'flame-help'"
            class="relative"
            :style="{ height: `${depth * (ROW + GAP)}px` }"
            @keydown="onKeydown"
            @mousemove="onMove"
            @mouseleave="onLeave"
            @focusout="onFocusOut"
          >
            <button
              v-for="{ frame, box } in visible"
              :key="frame.id"
              type="button"
              :data-frame="frame.id"
              :tabindex="frame.id === focusedId ? 0 : -1"
              :aria-label="`${frame.node.name}, ${ms(frame.end - frame.start)}`"
              :aria-pressed="!canHover ? activeId === frame.id : undefined"
              class="flame-bar absolute block overflow-hidden whitespace-nowrap text-ellipsis rounded-[2px] px-1 text-left font-mono text-[11px] leading-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-2"
              :class="activeId === frame.id ? (canHover ? 'brightness-110' : 'outline outline-2 outline-white -outline-offset-2') : ''"
              :style="{
                left: `${box.left}%`,
                width: `max(${box.width}%, 1px)`,
                top: `${frame.depth * (ROW + GAP)}px`,
                height: `${ROW}px`,
                background: frame.node.color ?? '#B3E5FC',
                color: flameTextColor(frame.node.color),
              }"
              @mouseenter="onEnter(frame, $event)"
              @click="onClick(frame)"
              @focus="onFocus(frame, $event)"
            >
              <span v-if="(box.width / 100) * graphWidth >= 40">{{ frame.node.name }}</span>
            </button>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-landing-deepest to-transparent transition-opacity duration-150"
        :class="canScrollLeft ? 'opacity-100' : 'opacity-0'"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-landing-deepest to-transparent transition-opacity duration-150"
        :class="canScrollRight ? 'opacity-100' : 'opacity-0'"
      />
    </div>

    <p id="flame-help" class="sr-only">
      Arrow keys move between calls: left and right for siblings, up for the caller, down for the first callee.
      Enter zooms into a call, Escape resets the zoom.
    </p>

    <!-- Stat card: floating on pointer devices, below the graph on touch -->
    <div
      v-if="active"
      class="z-20 rounded-lg border border-landing-border-subtle bg-landing-surface p-3 shadow-showcase"
      :class="canHover ? 'absolute pointer-events-none' : 'm-3 mt-0'"
      :style="canHover ? { left: `${cardAt.x}px`, top: `${cardAt.y}px`, width: `${CARD_WIDTH}px` } : {}"
      aria-live="polite"
    >
      <!-- Breaks only after «\\» and «::», anywhere as a last resort -->
      <p class="font-mono text-xs text-white [overflow-wrap:anywhere] mb-2">
        <template v-for="(part, i) in nameParts" :key="i">{{ part }}<wbr></template>
      </p>
      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
        <template v-for="row in stats" :key="row.label">
          <dt class="text-on-dark-muted">{{ row.label }}</dt>
          <dd class="text-on-dark-secondary text-right">{{ row.value }}</dd>
        </template>
      </dl>
      <button
        v-if="!canHover"
        type="button"
        class="mt-3 w-full min-h-11 rounded-lg border border-landing-border-subtle font-sans text-sm text-white hover:bg-white/5"
        @click="zoomActive"
      >
        Zoom in
      </button>
    </div>
  </div>
</template>

<style scoped>
.flame-bar {
  transition: left 200ms ease-out, width 200ms ease-out;
}
@media (prefers-reduced-motion: reduce) {
  .flame-bar { transition: none; }
}
</style>
