<script setup lang="ts">
const props = defineProps<{
  words?: string[]
  color?: string
  radius?: number
  density?: number
  autoReveal?: boolean
}>()

const defaultWords = [
  // Core debugging
  'dump()', 'ray()', 'dd()', 'var_dump()', 'print_r()', 'xdebug',
  'breakpoint', 'stack trace', 'backtrace', 'debug_backtrace()',
  // Tools & SDKs
  'Sentry', 'Monolog', 'XHProf', 'VarDumper', 'Inspector', 'Profiler',
  'SMTP', 'Blackfire', 'Telescope', 'Clockwork',
  // PHP ecosystem
  'PHP 8.4', 'composer', 'Laravel', 'Symfony', 'Spiral', 'WordPress',
  'RoadRunner', 'Octane', 'Swoole', 'FrankenPHP', 'Nginx', 'Caddy',
  // Standards & protocols
  'PSR-3', 'PSR-7', 'PSR-15', 'RFC 7807', 'HTTP/2', 'gRPC',
  'WebSocket', 'SSE', 'JSON', 'AMQP', 'Redis',
  // Ports & infra
  ':8000', ':1025', ':9912', ':9913', ':9914',
  'docker run', '.env', 'docker-compose.yml',
  // Easter eggs
  'star me ★', 'buggregator is cool', 'install me!',
  'zero overhead', 'MIT License', 'free forever',
  'no cloud needed', 'works offline', 'just one command',
  'butschster was here', 'hello from PHP',
  'console.log? nah', 'echo "debug"', 'tail -f laravel.log',
  '¯\\_(ツ)_/¯', '// TODO: fix later', '// FIXME',
  'git blame', 'composer require', 'php artisan',
  'catch (\\Throwable $e)', '$this->debug()', 'Log::debug()',
]

const wordList = props.words || defaultWords
const revealRadius = props.radius || 220
const accent = props.color || '#3b82f6'

function seededRandom(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647 }
}

const rng = seededRandom(42)
const count = props.density || Math.min(wordList.length, 28)

const items = ref(
  Array.from({ length: count }, (_, i) => ({
    word: wordList[i % wordList.length],
    top: rng() * 88 + 4,
    left: rng() * 90 + 3,
    size: 11 + Math.floor(rng() * 6),
    rotate: Math.floor(rng() * 30) - 15,
    opacity: 0,
  }))
)

const containerRef = ref<HTMLElement>()

let mousePos = { x: -9999, y: -9999 }

const autoSpots = props.autoReveal ? [
  { phase: 0,   speedX: 0.00015, speedY: 0.00012, ampX: 0.35, ampY: 0.30, cx: 0.3, cy: 0.4 },
  { phase: 2.1, speedX: 0.00011, speedY: 0.00016, ampX: 0.30, ampY: 0.35, cx: 0.7, cy: 0.3 },
  { phase: 4.2, speedX: 0.00013, speedY: 0.00010, ampX: 0.25, ampY: 0.25, cx: 0.5, cy: 0.6 },
] : []

let animFrame = 0

function calcOpacity(now: number) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const w = rect.width
  const h = rect.height

  items.value.forEach(item => {
    const ix = (item.left / 100) * w
    const iy = (item.top / 100) * h

    const mouseDist = Math.sqrt((mousePos.x - ix) ** 2 + (mousePos.y - iy) ** 2)
    let best = Math.max(0, 1 - mouseDist / revealRadius)

    for (const spot of autoSpots) {
      const sx = (spot.cx + Math.sin(now * spot.speedX + spot.phase) * spot.ampX) * w
      const sy = (spot.cy + Math.cos(now * spot.speedY + spot.phase) * spot.ampY) * h
      const spotDist = Math.sqrt((sx - ix) ** 2 + (sy - iy) ** 2)
      const t = Math.max(0, 1 - spotDist / (revealRadius * 0.7))
      best = Math.max(best, t * 0.5)
    }

    item.opacity = best * best * best
  })

  if (props.autoReveal) {
    animFrame = requestAnimationFrame(() => calcOpacity(performance.now()))
  }
}

function handleMouse(e: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  if (!props.autoReveal) calcOpacity(performance.now())
}

function handleLeave() {
  mousePos = { x: -9999, y: -9999 }
  if (!props.autoReveal) {
    items.value.forEach(item => { item.opacity = 0 })
  }
}

onMounted(() => {
  if (props.autoReveal) {
    calcOpacity(performance.now())
  }
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
})

defineExpose({ handleMouse, handleLeave })
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 overflow-hidden pointer-events-none z-[5]"
    aria-hidden="true"
  >
    <span
      v-for="(item, i) in items"
      :key="i"
      class="absolute font-mono font-semibold whitespace-nowrap select-none"
      :style="{
        top: item.top + '%',
        left: item.left + '%',
        fontSize: item.size + 'px',
        transform: `rotate(${item.rotate}deg)`,
        color: accent,
        opacity: item.opacity,
        letterSpacing: '0.05em',
        textShadow: item.opacity > 0.3 ? `0 0 14px ${accent}60` : 'none',
        transition: autoReveal ? 'none' : 'opacity 0.15s ease',
      }"
    >{{ item.word }}</span>
  </div>
</template>
