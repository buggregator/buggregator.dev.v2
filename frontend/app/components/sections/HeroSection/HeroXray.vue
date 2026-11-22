<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  coverRect, easeFactor, keyStep, readout, readoutHidden, restPoint, ringTicks,
  type Box, type Point, type Rect,
} from '~/data/xray'

// The hero background (#6838): the closed beetle, dimmed, fills the band.
// X-ray is off by default (owner's pick A on #6842): a small «X-ray» toggle
// turns on a ring lens that shows the X-ray layer under the pointer. No
// auto movement, no hint. The copy (default slot) sits on top.
//
// Server: renders the dimmed base picture and the toggle, off.
// Client, after mount: restores the choice for this tab (sessionStorage).
// The X-ray picture loads on the first turn-on (or a hover over the toggle).
// While on, the lens follows the mouse over the hero and hides when it
// leaves; a finger shows it while touching and 1.5 s after; arrow keys move
// it while the toggle has focus. Moves only by transform, written straight
// to the DOM in requestAnimationFrame while the lens is shown and the hero is
// on screen. Reduced motion: no easing, no loop; the lens jumps.
const props = defineProps<{
  button: string
  on: string
  off: string
  saidOn: string
  saidOff: string
}>()

// Where the picture sits on wide screens (CSS object-position, the same
// numbers go to coverRect). On phones the stage is the picture's own box.
const POS: Point = { x: 0.51, y: 0.47 }
const TOUCH_HIDE_MS = 1500
const STORE_KEY = 'xray'

const base = '/img/xray-hero'
const closedAvif = `${base}/closed-960.avif 960w, ${base}/closed-1672.avif 1672w`
const closedWebp = `${base}/closed-960.webp 960w, ${base}/closed-1672.webp 1672w`
const xrayAvif = `${base}/xray-960.avif 960w, ${base}/xray-1672.avif 1672w`
const xrayWebp = `${base}/xray-960.webp 960w, ${base}/xray-1672.webp 1672w`
// Phone: the picture is ~174% of the screen wide; wider screens: cover.
const sizes = '(max-width: 719px) 174vw, 100vw'

const root = ref<HTMLElement>()
const stage = ref<HTMLElement>()
const copy = ref<HTMLElement>()
const lens = ref<HTMLElement>()
const lensIn = ref<HTMLElement>()
const lensImg = ref<HTMLImageElement>()
const hud = ref<HTMLElement>()
const rd = ref<HTMLElement>()
const toggle = ref<HTMLButtonElement>()

const lensR = ref(160)
const ticks = computed(() => ringTicks(lensR.value))
const hudSize = computed(() => (lensR.value + 14) * 2)
const enabled = ref(false)
const showXray = ref(false)
const loaded = ref(false)
const shown = ref(false)
const said = ref('')
let reduced = false

// Per-frame state: plain variables, not refs.
let R: Rect = { l: 0, t: 0, w: 0, h: 0, s: 1 }
let SW = 0
let CR: Box | null = null
const pos: Point = { x: 0, y: 0 }
const target: Point = { x: 0, y: 0 }
let prev = 0
let rdLast = 0
let raf = 0
let visible = false
let hideTimer: ReturnType<typeof setTimeout> | undefined
const cleanups: Array<() => void> = []

function layout() {
  const st = stage.value
  if (!st || !root.value) return
  SW = st.clientWidth
  // On phones the stage is shaped like the picture, so cover = its own box.
  R = coverRect(SW, st.clientHeight, POS)
  lensR.value = parseFloat(getComputedStyle(root.value).getPropertyValue('--xr-lens-r')) || 160
  const d = lensR.value * 2
  lens.value!.style.width = lens.value!.style.height = `${d}px`
  if (lensImg.value) sizeLensImg()
  const c = copy.value!.getBoundingClientRect()
  const sb = st.getBoundingClientRect()
  CR = { l: c.left - sb.left, t: c.top - sb.top, r: c.right - sb.left, b: c.bottom - sb.top }
  place()
}

function sizeLensImg() {
  lensImg.value!.style.width = `${R.w}px`
  lensImg.value!.style.height = `${R.h}px`
}

// Writes the lens, its counter-moving picture and the HUD.
function place(now = performance.now()) {
  const x = Math.round(pos.x * 10) / 10
  const y = Math.round(pos.y * 10) / 10
  const lx = x - lensR.value
  const ly = y - lensR.value
  lens.value!.style.transform = `translate3d(${lx}px,${ly}px,0)`
  lensIn.value!.style.transform = `translate3d(${R.l - lx}px,${R.t - ly}px,0)`
  hud.value!.style.transform = `translate3d(${lx - 14}px,${ly - 14}px,0)`
  if (now - rdLast > 66) { // the numbers change ~15 times a second
    rdLast = now
    rd.value!.style.opacity = readoutHidden(x, y, lensR.value, SW, CR) ? '0' : '1'
    rd.value!.textContent = readout(x, y, R)
  }
}

function tick(now: number) {
  raf = 0
  const dt = Math.min(64, now - prev)
  prev = now
  const k = easeFactor(dt, false)
  pos.x += (target.x - pos.x) * k
  pos.y += (target.y - pos.y) * k
  place(now)
  if (Math.abs(target.x - pos.x) > 0.05 || Math.abs(target.y - pos.y) > 0.05) start()
}

// The loop runs only while the lens is shown, on screen, still catching up
// with its target, and motion is allowed.
function start() {
  if (raf || !visible || reduced || !shown.value) return
  prev = performance.now()
  raf = requestAnimationFrame(tick)
}
function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

function moveTo(p: Point) {
  target.x = p.x
  target.y = p.y
  if (reduced) {
    pos.x = p.x
    pos.y = p.y
    place()
  } else {
    start()
  }
}

function jumpTo(p: Point) {
  pos.x = target.x = p.x
  pos.y = target.y = p.y
  place()
}

function show(v: boolean) {
  clearTimeout(hideTimer)
  shown.value = v && enabled.value
  if (!shown.value) stop()
}

function loadXray() {
  showXray.value = true
}

function setEnabled(v: boolean, announce: boolean) {
  enabled.value = v
  try {
    sessionStorage.setItem(STORE_KEY, v ? 'on' : 'off')
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
  if (v) {
    loadXray()
    jumpTo(restPoint(R, CR?.r ?? 0, lensR.value))
    show(true)
  } else {
    show(false)
  }
  if (announce) said.value = v ? props.saidOn : props.saidOff
}

function toStage(e: PointerEvent): Point {
  const b = stage.value!.getBoundingClientRect()
  return { x: e.clientX - b.left, y: e.clientY - b.top }
}

function onMove(e: PointerEvent) {
  if (!enabled.value) return
  // On the toggle itself the lens stays where it is.
  if (e.pointerType === 'mouse' && toggle.value?.contains(e.target as Node)) return
  const p = toStage(e)
  if (!shown.value) jumpTo(p)
  show(true)
  moveTo(p)
}

function onDown(e: PointerEvent) {
  if (!enabled.value || e.pointerType === 'mouse') return
  if ((e.target as Element).closest('a, button')) return
  jumpTo(toStage(e))
  show(true)
}

function onUp(e: PointerEvent) {
  if (!enabled.value || e.pointerType === 'mouse') return
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => show(false), TOUCH_HIDE_MS)
}

function onLeave(e: PointerEvent) {
  if (e.pointerType === 'mouse') show(false)
}

// Arrow keys on the focused toggle move the lens while X-ray is on.
function onToggleKey(e: KeyboardEvent) {
  if (!enabled.value) return
  const step = keyStep(e.key, e.shiftKey)
  if (!step) return
  e.preventDefault()
  show(true)
  moveTo({
    x: Math.max(0, Math.min(SW, target.x + step[0])),
    y: Math.max(0, Math.min(stage.value!.clientHeight, target.y + step[1])),
  })
}

function onXrayLoad() {
  sizeLensImg()
  loaded.value = true
}

onMounted(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)')
  reduced = rm.matches
  const onRm = () => {
    reduced = rm.matches
    if (reduced) {
      stop()
      jumpTo(target)
    }
  }
  rm.addEventListener('change', onRm)
  cleanups.push(() => rm.removeEventListener('change', onRm))

  layout()
  const ro = new ResizeObserver(() => layout())
  ro.observe(root.value!)
  cleanups.push(() => ro.disconnect())

  const io = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
    if (visible) start()
    else stop()
  })
  io.observe(root.value!)
  cleanups.push(() => io.disconnect())

  let stored = false
  try {
    stored = sessionStorage.getItem(STORE_KEY) === 'on'
  } catch {
    // No storage: X-ray starts off.
  }
  if (stored) setEnabled(true, false)
})

onBeforeUnmount(() => {
  stop()
  clearTimeout(hideTimer)
  cleanups.forEach(fn => fn())
})
</script>

<template>
  <div
    ref="root"
    class="xray"
    :class="{ 'xray--on': enabled, 'xray--shown': shown && loaded }"
    @pointermove="onMove"
    @pointerenter="onMove"
    @pointerdown="onDown"
    @pointerup="onUp"
    @pointercancel="onUp"
    @pointerleave="onLeave"
  >
    <div ref="stage" class="xray__stage" aria-hidden="true">
      <picture>
        <source type="image/avif" :srcset="closedAvif" :sizes="sizes">
        <source type="image/webp" :srcset="closedWebp" :sizes="sizes">
        <img
          class="xray__base"
          :src="`${base}/closed-1672.webp`"
          alt=""
          width="1672"
          height="941"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          draggable="false"
        >
      </picture>
      <div class="xray__dim" />
      <div ref="lens" class="xray__lens">
        <div ref="lensIn" class="xray__lens-in">
          <picture v-if="showXray">
            <source type="image/avif" :srcset="xrayAvif" :sizes="sizes">
            <source type="image/webp" :srcset="xrayWebp" :sizes="sizes">
            <img
              ref="lensImg"
              :src="`${base}/xray-1672.webp`"
              alt=""
              width="1672"
              height="941"
              decoding="async"
              draggable="false"
              @load="onXrayLoad"
            >
          </picture>
        </div>
        <div class="xray__ring" />
      </div>
      <div ref="hud" class="xray__hud">
        <svg :width="hudSize" :height="hudSize" :viewBox="`0 0 ${hudSize} ${hudSize}`">
          <line
            v-for="(t, i) in ticks"
            :key="i"
            :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
            :class="t.long ? 'xray__tick--long' : 'xray__tick'"
          />
          <g class="xray__cross">
            <line :x1="hudSize / 2 - 10" :y1="hudSize / 2" :x2="hudSize / 2 - 3" :y2="hudSize / 2" />
            <line :x1="hudSize / 2 + 3" :y1="hudSize / 2" :x2="hudSize / 2 + 10" :y2="hudSize / 2" />
            <line :x1="hudSize / 2" :y1="hudSize / 2 - 10" :x2="hudSize / 2" :y2="hudSize / 2 - 3" />
            <line :x1="hudSize / 2" :y1="hudSize / 2 + 3" :x2="hudSize / 2" :y2="hudSize / 2 + 10" />
          </g>
        </svg>
        <span
          ref="rd"
          class="xray__rd"
          :style="{ left: `${hudSize / 2 + lensR * 0.72 + 4}px`, top: `${hudSize / 2 - lensR * 0.72 - 18}px` }"
        />
      </div>
      <div class="xray__vig" />
    </div>

    <div ref="copy" class="xray__copy">
      <slot />
    </div>

    <button
      ref="toggle"
      type="button"
      class="xray__toggle"
      :aria-pressed="enabled"
      @click="setEnabled(!enabled, true)"
      @pointerenter="loadXray"
      @focus="loadXray"
      @keydown="onToggleKey"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" /><path d="M8 0.5v3M8 12.5v3M0.5 8h3M12.5 8h3" /></svg>
      <span>{{ button }}</span>
      <span class="xray__toggle-state" aria-hidden="true">{{ enabled ? on : off }}</span>
    </button>
    <p class="xray__said" aria-live="polite">{{ said }}</p>
  </div>
</template>

<style scoped>
.xray {
  /* How dark the closed beetle is (0 = as is, 1 = black). Concept 2 had
     0.80; the owner asked for darker (#6838). */
  --xr-dim: 0.88;
  /* Extra shade right behind the copy, above the lens. */
  --xr-text-shade: 0.6;
  --xr-lens-r: 160px;
  --xr-cyan: #5eead4;
  --xr-ring: rgba(94, 234, 212, 0.85);

  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: clamp(640px, 92svh, 900px);
  padding: 112px 32px 72px;
}

/* X-ray on: the pointer is a crosshair, a sideways drag moves the lens. */
.xray--on {
  cursor: crosshair;
  touch-action: pan-y;
}

.xray__stage {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.xray__stage img {
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.xray__base {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 51% 47%;
}

.xray__dim {
  position: absolute;
  inset: 0;
  background: rgba(10, 11, 16, var(--xr-dim));
}

/* The lens moves by transform; its picture counter-moves by transform. */
.xray__lens {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0;
  transition: opacity 350ms ease;
  will-change: transform;
  -webkit-mask-image: radial-gradient(circle closest-side, #000 97%, transparent 100%);
  mask-image: radial-gradient(circle closest-side, #000 97%, transparent 100%);
}

.xray__lens-in {
  position: absolute;
  left: 0;
  top: 0;
  will-change: transform;
}

.xray__lens-in img {
  max-width: none;
}

.xray__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px var(--xr-ring), inset 0 0 40px rgba(94, 234, 212, 0.18);
}

.xray__hud {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: opacity 350ms ease;
  will-change: transform;
}

.xray__hud svg {
  display: block;
  overflow: visible;
}

.xray__tick {
  stroke: rgba(94, 234, 212, 0.45);
  stroke-width: 1;
}

.xray__tick--long {
  stroke: rgba(94, 234, 212, 0.9);
  stroke-width: 1.5;
}

.xray__cross line {
  stroke: rgba(94, 234, 212, 0.9);
}

.xray__rd {
  position: absolute;
  font: 500 11px/1 "JetBrains Mono", monospace;
  letter-spacing: 0.04em;
  white-space: nowrap;
  color: var(--xr-cyan);
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.9);
  transition: opacity 250ms;
}

.xray--shown .xray__lens,
.xray--shown .xray__hud {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .xray__lens,
  .xray__hud {
    transition: none;
  }
}

/* Top edge under the navbar, bottom edge into the product preview. */
.xray__vig {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 75% 80% at 50% 52%, transparent 55%, rgba(12, 14, 20, 0.75) 100%),
    linear-gradient(180deg, rgba(12, 14, 20, 0.85) 0, rgba(12, 14, 20, 0) 90px),
    linear-gradient(0deg, #0c0e14 0, rgba(12, 14, 20, 0) 140px);
}

.xray__copy {
  position: relative;
  z-index: 1;
  /* As wide as the copy itself, so «right of the copy» means the text. */
  width: 100%;
  max-width: var(--xr-copy-w, 1040px);
  margin: 0 auto;
  isolation: isolate;
  cursor: default;
}

/* A soft shade above the lens, so a bright reveal never sits under the text
   at full strength. */
.xray__copy::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: -70px -160px;
  pointer-events: none;
  background: radial-gradient(
    closest-side,
    rgba(10, 11, 16, var(--xr-text-shade)) 0,
    rgba(10, 11, 16, calc(var(--xr-text-shade) * 0.8)) 55%,
    rgba(10, 11, 16, 0) 100%
  );
}

.xray__toggle {
  position: absolute;
  z-index: 2;
  right: 32px;
  bottom: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px 0 12px;
  border: 0;
  border-radius: 8px;
  background: rgba(12, 14, 20, 0.85);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
  color: theme('colors.on-dark.secondary');
  font: 500 13px "JetBrains Mono", monospace;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: color 150ms ease, box-shadow 150ms ease, background 150ms ease;
}

.xray__toggle svg {
  flex: none;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
}

.xray__toggle:hover {
  color: theme('colors.on-dark.primary');
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.32);
}

.xray__toggle:active {
  background: #1f2430;
}

.xray__toggle:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}

.xray__toggle[aria-pressed="true"] {
  color: var(--xr-cyan);
  box-shadow: inset 0 0 0 1px rgba(94, 234, 212, 0.55), 0 0 18px rgba(94, 234, 212, 0.12);
}

.xray__toggle-state {
  color: theme('colors.on-dark.muted');
}

.xray__toggle[aria-pressed="true"] .xray__toggle-state {
  color: var(--xr-cyan);
}

.xray__said {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 1023px) {
  .xray__copy::before {
    inset: -60px -60px;
  }
}

/* Phone: the copy in the flow, the beetle lies behind the headline — the
   middle of the body across the screen, head and tail off the edges. The
   stage is the picture's own box, faded at the top and bottom. */
@media (max-width: 719px) {
  .xray {
    --xr-lens-r: 92px;
    min-height: 0;
    padding: 112px 16px 64px;
    overflow: hidden;
  }

  .xray__stage {
    inset: auto;
    left: 50%;
    top: 215px;
    width: 174%;
    aspect-ratio: 1672 / 941;
    transform: translate(-51.25%, -47.3%);
    -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 14%, #000 86%, transparent 100%);
    mask-image: linear-gradient(180deg, transparent 0, #000 14%, #000 86%, transparent 100%);
  }

  .xray__vig {
    display: none;
  }

  .xray__copy::before {
    inset: -30px -10px;
  }

  .xray__rd {
    display: none;
  }

  /* Under the copy, full width, 44 px tall. */
  .xray__toggle {
    position: relative;
    right: auto;
    bottom: auto;
    justify-content: center;
    min-height: 44px;
    margin-top: 28px;
  }
}
</style>
