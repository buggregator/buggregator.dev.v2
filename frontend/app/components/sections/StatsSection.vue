<script setup lang="ts">
import { useGitHubStore } from '~/stores/github'
import type { StatsHistoryEntry } from '~/stores/github'

const { t } = useI18n()
const github = useGitHubStore()

const format = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const formatFull = (n: number) =>
  new Intl.NumberFormat('en').format(n)

const formatDate = (d: string) => {
  const date = new Date(d)
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

// SVG chart dimensions
const W = 480
const H = 140
const PAD = { top: 8, right: 8, bottom: 24, left: 8 }
const chartW = W - PAD.left - PAD.right
const chartH = H - PAD.top - PAD.bottom

function buildPath(entries: StatsHistoryEntry[], key: keyof StatsHistoryEntry) {
  if (entries.length < 2) return { line: '', area: '', points: [] as { x: number; y: number; value: number; date: string }[] }

  const values = entries.map(e => Number(e[key]))
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = entries.map((e, i) => ({
    x: PAD.left + (i / (entries.length - 1)) * chartW,
    y: PAD.top + chartH - ((Number(e[key]) - min) / range) * chartH,
    value: Number(e[key]),
    date: e.date,
  }))

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${PAD.top + chartH} L${points[0].x},${PAD.top + chartH} Z`

  return { line, area, points }
}

const starsChart = computed(() => buildPath(github.statsHistory, 'total_stars'))
const serverChart = computed(() => buildPath(github.statsHistory, 'server_downloads'))
const trapChart = computed(() => buildPath(github.statsHistory, 'trap_downloads'))

const hasHistory = computed(() => github.statsHistory.length >= 2)

// Tooltip state per chart
const hovered = ref<Record<string, { x: number; y: number; value: number; date: string } | null>>({
  stars: null,
  server: null,
  trap: null,
})

function onChartHover(
  event: MouseEvent,
  points: { x: number; y: number; value: number; date: string }[],
  key: string,
) {
  const svg = (event.currentTarget as SVGSVGElement)
  const rect = svg.getBoundingClientRect()
  const mouseX = ((event.clientX - rect.left) / rect.width) * W

  let closest = points[0]
  let minDist = Infinity
  for (const p of points) {
    const dist = Math.abs(p.x - mouseX)
    if (dist < minDist) {
      minDist = dist
      closest = p
    }
  }

  hovered.value = { ...hovered.value, [key]: closest }
}

function onChartLeave(key: string) {
  hovered.value = { ...hovered.value, [key]: null }
}
</script>

<template>
  <section class="stats-section py-20 lg:py-28 bg-section-dark">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-14">
        <h2 class="text-section font-bold text-white mb-3 font-sans">
          {{ t('stats.title') }}
        </h2>
        <p class="text-lg text-white/70 max-w-xl mx-auto font-sans">
          {{ t('stats.description') }}
        </p>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Stars -->
        <div class="stats-card">
          <div class="stats-card__header">
            <div>
              <p class="stats-card__label">{{ t('stats.stars') }}</p>
              <p class="stats-card__value">
                <ClientOnly>
                  <template #fallback><span class="text-white/20">—</span></template>
                  {{ github.totalStars > 0 ? formatFull(github.totalStars) : '—' }}
                </ClientOnly>
              </p>
            </div>
            <div class="stats-card__icon stats-card__icon--stars">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
            </div>
          </div>

          <ClientOnly>
            <div v-if="hasHistory" class="stats-card__chart">
              <svg
                :viewBox="`0 0 ${W} ${H}`"
                class="w-full h-auto"
                preserveAspectRatio="none"
                @mousemove="onChartHover($event, starsChart.points, 'stars')"
                @mouseleave="onChartLeave('stars')"
              >
                <defs>
                  <linearGradient id="starsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.02" />
                  </linearGradient>
                </defs>
                <path :d="starsChart.area" fill="url(#starsFill)" />
                <path :d="starsChart.line" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round" />
                <template v-if="hovered.stars">
                  <line :x1="hovered.stars.x" :y1="PAD.top" :x2="hovered.stars.x" :y2="PAD.top + chartH" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                  <circle :cx="hovered.stars.x" :cy="hovered.stars.y" r="4" fill="#f59e0b" stroke="#000" stroke-width="1.5" />
                  <rect :x="Math.max(4, Math.min(hovered.stars.x - 44, W - 92))" :y="hovered.stars.y - 32" width="88" height="22" rx="4" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
                  <text :x="Math.max(48, Math.min(hovered.stars.x, W - 48))" :y="hovered.stars.y - 17" text-anchor="middle" fill="white" font-size="11" font-family="JetBrains Mono, monospace">
                    {{ formatFull(hovered.stars.value) }}
                  </text>
                </template>
                <text v-if="github.statsHistory.length > 0" :x="PAD.left" :y="H - 4" fill="rgba(255,255,255,0.3)" font-size="10" font-family="JetBrains Mono, monospace">{{ formatDate(github.statsHistory[0].date) }}</text>
                <text v-if="github.statsHistory.length > 0" :x="W - PAD.right" :y="H - 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-size="10" font-family="JetBrains Mono, monospace">{{ formatDate(github.statsHistory[github.statsHistory.length - 1].date) }}</text>
              </svg>
            </div>
            <div v-else class="stats-card__empty">
              <p>{{ t('stats.collectingData') }}</p>
            </div>
          </ClientOnly>
        </div>

        <!-- Server Downloads -->
        <div class="stats-card">
          <div class="stats-card__header">
            <div>
              <p class="stats-card__label">{{ t('stats.serverDownloads') }}</p>
              <p class="stats-card__value">
                <ClientOnly>
                  <template #fallback><span class="text-white/20">—</span></template>
                  {{ github.serverDownloads > 0 ? format(github.serverDownloads) : '—' }}
                </ClientOnly>
              </p>
              <p class="stats-card__hint">
                <ClientOnly>
                  <template #fallback>&nbsp;</template>
                  Docker + Releases
                </ClientOnly>
              </p>
            </div>
            <div class="stats-card__icon stats-card__icon--server">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5">
                <path d="M2.75 14A1.75 1.75 0 011 12.25v-2.5a.75.75 0 011.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-2.5a.75.75 0 011.5 0v2.5A1.75 1.75 0 0113.25 14H2.75z" />
                <path d="M7.25 7.689V2a.75.75 0 011.5 0v5.689l1.97-1.969a.749.749 0 111.06 1.06l-3.25 3.25a.749.749 0 01-1.06 0L4.22 6.78a.749.749 0 111.06-1.06l1.97 1.969z" />
              </svg>
            </div>
          </div>

          <ClientOnly>
            <div v-if="hasHistory" class="stats-card__chart">
              <svg
                :viewBox="`0 0 ${W} ${H}`"
                class="w-full h-auto"
                preserveAspectRatio="none"
                @mousemove="onChartHover($event, serverChart.points, 'server')"
                @mouseleave="onChartLeave('server')"
              >
                <defs>
                  <linearGradient id="serverFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.02" />
                  </linearGradient>
                </defs>
                <path :d="serverChart.area" fill="url(#serverFill)" />
                <path :d="serverChart.line" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linejoin="round" />
                <template v-if="hovered.server">
                  <line :x1="hovered.server.x" :y1="PAD.top" :x2="hovered.server.x" :y2="PAD.top + chartH" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                  <circle :cx="hovered.server.x" :cy="hovered.server.y" r="4" fill="#3b82f6" stroke="#000" stroke-width="1.5" />
                  <rect :x="Math.max(4, Math.min(hovered.server.x - 44, W - 92))" :y="hovered.server.y - 32" width="88" height="22" rx="4" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
                  <text :x="Math.max(48, Math.min(hovered.server.x, W - 48))" :y="hovered.server.y - 17" text-anchor="middle" fill="white" font-size="11" font-family="JetBrains Mono, monospace">
                    {{ formatFull(hovered.server.value) }}
                  </text>
                </template>
                <text v-if="github.statsHistory.length > 0" :x="PAD.left" :y="H - 4" fill="rgba(255,255,255,0.3)" font-size="10" font-family="JetBrains Mono, monospace">{{ formatDate(github.statsHistory[0].date) }}</text>
                <text v-if="github.statsHistory.length > 0" :x="W - PAD.right" :y="H - 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-size="10" font-family="JetBrains Mono, monospace">{{ formatDate(github.statsHistory[github.statsHistory.length - 1].date) }}</text>
              </svg>
            </div>
            <div v-else class="stats-card__empty">
              <p>{{ t('stats.collectingData') }}</p>
            </div>
          </ClientOnly>
        </div>

        <!-- Trap Downloads -->
        <div class="stats-card">
          <div class="stats-card__header">
            <div>
              <p class="stats-card__label">{{ t('stats.trapDownloads') }}</p>
              <p class="stats-card__value">
                <ClientOnly>
                  <template #fallback><span class="text-white/20">—</span></template>
                  {{ github.trapDownloads > 0 ? format(github.trapDownloads) : '—' }}
                </ClientOnly>
              </p>
              <p class="stats-card__hint">
                <ClientOnly>
                  <template #fallback>&nbsp;</template>
                  Packagist
                </ClientOnly>
              </p>
            </div>
            <div class="stats-card__icon stats-card__icon--trap">
              <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M8.878.392a1.75 1.75 0 00-1.756 0l-5.25 3.045A1.75 1.75 0 001 4.951v6.098c0 .624.332 1.2.872 1.514l5.25 3.045a1.75 1.75 0 001.756 0l5.25-3.045c.54-.313.872-.89.872-1.514V4.951c0-.624-.332-1.2-.872-1.514L8.878.392zM7.875 1.69a.25.25 0 01.25 0l4.63 2.685L8 7.133 3.245 4.375l4.63-2.685zM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432L2.5 5.677zm6.25 8.271l4.625-2.683a.25.25 0 00.125-.216V5.677L8.75 8.432v5.516z" />
              </svg>
            </div>
          </div>

          <ClientOnly>
            <div v-if="hasHistory" class="stats-card__chart">
              <svg
                :viewBox="`0 0 ${W} ${H}`"
                class="w-full h-auto"
                preserveAspectRatio="none"
                @mousemove="onChartHover($event, trapChart.points, 'trap')"
                @mouseleave="onChartLeave('trap')"
              >
                <defs>
                  <linearGradient id="trapFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#22c55e" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#22c55e" stop-opacity="0.02" />
                  </linearGradient>
                </defs>
                <path :d="trapChart.area" fill="url(#trapFill)" />
                <path :d="trapChart.line" fill="none" stroke="#22c55e" stroke-width="2" stroke-linejoin="round" />
                <template v-if="hovered.trap">
                  <line :x1="hovered.trap.x" :y1="PAD.top" :x2="hovered.trap.x" :y2="PAD.top + chartH" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                  <circle :cx="hovered.trap.x" :cy="hovered.trap.y" r="4" fill="#22c55e" stroke="#000" stroke-width="1.5" />
                  <rect :x="Math.max(4, Math.min(hovered.trap.x - 44, W - 92))" :y="hovered.trap.y - 32" width="88" height="22" rx="4" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
                  <text :x="Math.max(48, Math.min(hovered.trap.x, W - 48))" :y="hovered.trap.y - 17" text-anchor="middle" fill="white" font-size="11" font-family="JetBrains Mono, monospace">
                    {{ formatFull(hovered.trap.value) }}
                  </text>
                </template>
                <text v-if="github.statsHistory.length > 0" :x="PAD.left" :y="H - 4" fill="rgba(255,255,255,0.3)" font-size="10" font-family="JetBrains Mono, monospace">{{ formatDate(github.statsHistory[0].date) }}</text>
                <text v-if="github.statsHistory.length > 0" :x="W - PAD.right" :y="H - 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-size="10" font-family="JetBrains Mono, monospace">{{ formatDate(github.statsHistory[github.statsHistory.length - 1].date) }}</text>
              </svg>
            </div>
            <div v-else class="stats-card__empty">
              <p>{{ t('stats.collectingData') }}</p>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  position: relative;
}

.stats-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 200ms ease;
}

.stats-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.stats-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stats-card__label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.stats-card__value {
  font-family: "DM Sans", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.stats-card__hint {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.25);
  margin-top: 2px;
}

.stats-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-card__icon--stars {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.stats-card__icon--server {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.stats-card__icon--trap {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.stats-card__chart {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 12px;
}

.stats-card__chart svg {
  cursor: crosshair;
}

.stats-card__empty {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
  text-align: center;
}

.stats-card__empty p {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.25);
}

@media (max-width: 640px) {
  .stats-card__value {
    font-size: 1.5rem;
  }
}
</style>
