<script setup lang="ts">
import VersionBadge from '~/components/ui/VersionBadge.vue'
import VideoBackground from '~/components/sections/HeroSection/VideoBackground.vue'
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const github = useGitHubStore()

const formattedStars = computed(() => {
  const server = github.getRepo('server')
  const count = server?.stars ?? 0
  if (count === 0) return null
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count)
})

const imageTag = computed(() => {
  const v = github.serverVersion
  return v ? `v${v}` : 'latest'
})

const copied = ref(false)

const fullCommand = computed(() =>
  `docker run --pull always -p 127.0.0.1:8000:8000 -p 127.0.0.1:1025:1025 -p 127.0.0.1:9912:9912 -p 127.0.0.1:9913:9913 -p 127.0.0.1:9914:9914 ghcr.io/buggregator/server:${imageTag.value}`,
)

const ports = [
  { port: '8000:8000', hint: 'Web UI + Sentry + Ray + Inspector' },
  { port: '1025:1025', hint: 'SMTP — email capture' },
  { port: '9912:9912', hint: 'VarDumper — dump() output' },
  { port: '9913:9913', hint: 'Monolog — application logs' },
  { port: '9914:9914', hint: 'XHProf — performance profiling' },
]

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(fullCommand.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <section class="hero">
    <!-- Video background (fullscreen behind content) -->
    <ClientOnly>
      <VideoBackground />
    </ClientOnly>

    <!-- Content (on top of video) -->
    <div class="relative z-10 max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <!-- Version badge -->
      <div class="mb-6 hero-stagger" style="--i: 0">
        <ClientOnly>
          <VersionBadge />
        </ClientOnly>
      </div>

      <!-- Headline -->
      <h1 class="hero-stagger mb-5" style="--i: 1">
        <span class="hero__headline">{{ t('hero.headline') }}</span>
        <br />
        <span class="hero__headline-sub">{{ t('hero.headlineSub') }}</span>
      </h1>

      <!-- Subheadline -->
      <p class="hero__subheadline hero-stagger" style="--i: 2">
        {{ t('hero.subheadline') }}
      </p>

      <!-- Docker command -->
      <div class="hero-stagger max-w-[620px]" style="--i: 3">
        <div class="relative rounded-xl bg-code-bg/90 backdrop-blur-sm border border-code-border overflow-hidden">
          <div class="p-5 pr-14 font-mono text-xs leading-relaxed">
            <div>
              <span class="text-code-prompt select-none">$ </span>
              <span class="text-code-text">docker run --pull always \</span>
            </div>
            <div v-for="(p, i) in ports" :key="p.port" class="pl-6">
              <span class="text-code-text">-p 127.0.0.1:</span>
              <span class="port-hint">
                <span class="text-accent cursor-help border-b border-dashed border-accent/30">{{ p.port }}</span>
                <span class="port-tooltip">{{ p.hint }}</span>
              </span>
              <span v-if="i < ports.length - 1" class="text-code-text"> \</span>
            </div>
            <div class="pl-6">
              <span class="text-code-string">ghcr.io/buggregator/server:{{ imageTag }}</span>
            </div>
          </div>

          <!-- Copy button -->
          <button
            class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
            :class="copied
              ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
              : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted hover:bg-[rgba(255,255,255,0.12)] hover:text-white'"
            :aria-label="copied ? t('hero.cta.copied') : t('hero.cta.copy')"
            @click="copyCommand"
          >
            <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- "See it live" + Trust row -->
      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-5 hero-stagger" style="--i: 4">
        <a
          href="#demo"
          class="hidden lg:inline-flex text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-150 no-underline"
        >
          {{ t('hero.seeItLive') }}
        </a>
        <ClientOnly>
          <template v-if="formattedStars">
            <span class="font-mono text-xs text-on-dark-muted">{{ formattedStars }} {{ t('hero.trustRow.stars') }}</span>
          </template>
          <span class="font-mono text-xs text-on-dark-muted">{{ t('hero.trustRow.license') }}</span>
          <span class="font-mono text-xs text-on-dark-muted">{{ t('hero.trustRow.free') }}</span>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: #000000;
  min-height: 100vh;
  padding-top: 128px;
  padding-bottom: 96px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero__headline {
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-size: 3.5rem;
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: #ffffff;
}

.hero__headline-sub {
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 2.25rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #8b919a;
}

.hero__subheadline {
  font-family: "DM Sans", sans-serif;
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(139, 145, 154, 0.9);
  max-width: 560px;
  margin-bottom: 32px;
}

.hero-stagger {
  opacity: 0;
  transform: translateY(16px);
  animation: heroFadeIn 400ms ease-out both;
  animation-delay: calc(var(--i, 0) * 100ms + 150ms);
}

@keyframes heroFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Port tooltips */
.port-hint {
  position: relative;
  display: inline;
}

.port-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 6px;
  background: #22262e;
  border: 1px solid #2a2f38;
  color: #8b919a;
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}

.port-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #2a2f38;
}

.port-hint:hover .port-tooltip {
  display: block;
}

@media (max-width: 1023px) {
  .hero {
    min-height: auto;
    padding-top: 100px;
    padding-bottom: 64px;
  }
  .hero__headline {
    font-size: 2.25rem;
  }
  .hero__headline-sub {
    font-size: 1.5rem;
  }
}
</style>
