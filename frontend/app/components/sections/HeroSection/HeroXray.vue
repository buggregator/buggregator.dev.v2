<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  autoPoint, coverRect, easeFactor, keyStep, readout, readoutHidden, restPoint, ringTicks,
  type Box, type Point, type Rect,
} from '~/data/xray'

// The hero background (#6838, owner's pick A on #6837): the closed beetle,
// dimmed, fills the band; a ring lens shows the X-ray layer at full
// brightness. The copy (default slot) sits on top and stays usable.
//
// Server: renders the dimmed base picture only (LCP), no lens.
// Client, after mount: measures the stage, loads the X-ray picture when idle,
// then shows the lens. Moves only by transform, written straight to the DOM
// in requestAnimationFrame while the hero is on screen; no reactivity per
// frame. Reduced motion: no auto scan, no easing, no loop; the lens rests
// right of the copy and jumps to the pointer.
defineProps<{
  label: string
  hintPointer: string
  hintTouch: string
  hintStill: string
}>()

// Where the picture sits on wide screens (CSS object-position, the same
// numbers go to coverRect). On phones the stage is the picture's own box.
const POS: Point = { x: 0.51, y: 0.47 }
const IDLE_MS = 2000

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

const lensR = ref(160)
const ticks = computed(() => ringTicks(lensR.value))
const hudSize = computed(() => (lensR.value + 14) * 2)
const showXray = ref(false)
const ready = ref(false)
const reduced = ref(false)
const hintKind = ref<'pointer' | 'touch' | 'still'>('pointer')

// Per-frame state: plain variables, not refs.
let R: Rect = { l: 0, t: 0, w: 0, h: 0, s: 1 }
let SW = 0
let CR: Box | null = null
const pos: Point = { x: 0, y: 0 }
const target: Point = { x: 0, y: 0 }
let placed = false
let lastInput = -Infinity
let pointerInside = false
let autoT = 0
let prev = 0
let rdLast = 0
let raf = 0
let visible = false
const cleanups: Array<() => void> = []

function layout() {
  const st = stage.value
  if (!st || !root.value) return
  SW = st.clientWidth
  const SH = st.clientHeight
  // On phones the stage is shaped like the picture, so cover = its own box.
  R = coverRect(SW, SH, POS)
  lensR.value = parseFloat(getComputedStyle(root.value).getPropertyValue('--xr-lens-r')) || 160
  const d = lensR.value * 2
  lens.value!.style.width = lens.value!.style.height = `${d}px`
  if (lensImg.value) sizeLensImg()
  const c = copy.value!.getBoundingClientRect()
  const sb = st.getBoundingClientRect()
  CR = { l: c.left - sb.left, t: c.top - sb.top, r: c.right - sb.left, b: c.bottom - sb.top }
  if (!placed) {
    const p = reduced.value ? restPoint(R, CR.r, lensR.value) : autoPoint(0, R)
    pos.x = target.x = p.x
    pos.y = target.y = p.y
    placed = true
  }
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

function idle(now: number) {
  return !pointerInside || now - lastInput > IDLE_MS
}

function tick(now: number) {
  raf = 0
  const dt = Math.min(64, now - prev)
  prev = now
  if (idle(now)) {
    autoT += dt / 1000
    const a = autoPoint(autoT, R)
    target.x = a.x
    target.y = a.y
  }
  const k = easeFactor(dt, false)
  pos.x += (target.x - pos.x) * k
  pos.y += (target.y - pos.y) * k
  place(now)
  start()
}

// The loop runs only while the hero is on screen and motion is allowed.
function start() {
  if (raf || !visible || reduced.value || !ready.value) return
  raf = requestAnimationFrame(tick)
}
function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

// Reduced motion: no loop; every input places the lens at once.
function jump() {
  if (!reduced.value) return
  if (idle(performance.now())) {
    const p = restPoint(R, CR?.r ?? 0, lensR.value)
    target.x = p.x
    target.y = p.y
  }
  pos.x = target.x
  pos.y = target.y
  place()
}

function toStage(e: PointerEvent): Point {
  const b = stage.value!.getBoundingClientRect()
  return { x: e.clientX - b.left, y: e.clientY - b.top }
}

function onPointer(e: PointerEvent) {
  const p = toStage(e)
  target.x = p.x
  target.y = p.y
  lastInput = performance.now()
  pointerInside = true
  jump()
}

function onLeave(e: PointerEvent) {
  if (e.pointerType === 'mouse') pointerInside = false
  if (reduced.value) {
    lastInput = -Infinity
    jump()
  }
}

// A vertical swipe turned into a page scroll: keep the lens where it was.
function onCancel() {
  lastInput = performance.now()
}

function onKey(e: KeyboardEvent) {
  if (e.target !== root.value) return
  const step = keyStep(e.key, e.shiftKey)
  if (!step) return
  e.preventDefault()
  const now = performance.now()
  if (idle(now)) {
    target.x = pos.x
    target.y = pos.y
  }
  target.x = Math.max(0, Math.min(SW, target.x + step[0]))
  target.y = Math.max(0, Math.min(stage.value!.clientHeight, target.y + step[1]))
  lastInput = now
  pointerInside = true
  jump()
}

function onXrayLoad() {
  sizeLensImg()
  ready.value = true
  if (reduced.value) jump()
  else start()
}

onMounted(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)')
  const coarse = matchMedia('(pointer: coarse)')
  const setHint = () => {
    hintKind.value = reduced.value ? 'still' : coarse.matches ? 'touch' : 'pointer'
  }
  reduced.value = rm.matches
  setHint()
  const onRm = () => {
    reduced.value = rm.matches
    setHint()
    if (reduced.value) {
      stop()
      jump()
    } else {
      prev = performance.now()
      start()
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
    if (visible) {
      prev = performance.now()
      start()
    } else {
      stop()
    }
  })
  io.observe(root.value!)
  cleanups.push(() => io.disconnect())

  // The X-ray layer is decoration: it waits until the page is idle, so the
  // closed beetle (the LCP picture) loads first.
  const load = () => { showXray.value = true }
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(load, { timeout: 1500 })
    cleanups.push(() => cancelIdleCallback(id))
  } else {
    const id = setTimeout(load, 300)
    cleanups.push(() => clearTimeout(id))
  }
})

onBeforeUnmount(() => {
  stop()
  cleanups.forEach(fn => fn())
})
</script>

<template>
  <div
    ref="root"
    class="xray"
    :class="{ 'xray--ready': ready, 'xray--still': reduced }"
    role="group"
    tabindex="0"
    :aria-label="label"
    @pointermove="onPointer"
    @pointerdown="onPointer"
    @pointerleave="onLeave"
    @pointercancel="onCancel"
    @keydown="onKey"
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

    <p class="xray__hint" aria-hidden="true">
      {{ hintKind === 'still' ? hintStill : hintKind === 'touch' ? hintTouch : hintPointer }}
    </p>
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
  cursor: crosshair;
  touch-action: pan-y;
  outline: none;
}

.xray:focus-visible {
  box-shadow: inset 0 0 0 2px theme('colors.accent.DEFAULT');
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

.xray--ready .xray__lens,
.xray--ready .xray__hud {
  opacity: 1;
}

.xray--still .xray__lens,
.xray--still .xray__hud {
  transition: none;
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

.xray__hint {
  position: absolute;
  z-index: 1;
  left: 32px;
  bottom: 28px;
  margin: 0;
  padding: 5px 9px;
  border-radius: 4px;
  background: rgba(12, 14, 20, 0.85);
  font: 500 12px "JetBrains Mono", monospace;
  letter-spacing: 0.03em;
  color: theme('colors.on-dark.muted');
  pointer-events: none;
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

  .xray__hint {
    left: 16px;
    bottom: 20px;
  }
}
</style>
