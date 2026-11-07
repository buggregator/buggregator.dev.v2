<script setup lang="ts">
import VersionBadge from '~/components/ui/VersionBadge.vue'
import VideoBackground from '~/components/sections/HeroSection/VideoBackground.vue'
import BinaryPlatformPicker from '~/components/ui/BinaryPlatformPicker.vue'
import InstallPlatformsNote from '~/components/ui/InstallPlatformsNote.vue'
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const { trackEvent } = useGtag()
const github = useGitHubStore()

const format = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

// The first thing a visitor does is start the server: the command sits on
// the first screen and is in the server HTML. Star lives in the header and
// in the community section.
const { copied, copy } = useClipboardCopy()

// The one-line command split into shell lines with «\», so it reads whole
// instead of being cut by the box: two ports a line on wider screens, one
// on phones. Copy always takes the original one-liner.
function commandLines(portsPerLine: number): string {
  const [head, ...rest] = t('hero.command').split(' -p ')
  const last = rest.pop() ?? ''
  const cut = last.indexOf(' ')
  const ports = [...rest, last.slice(0, cut)].map(p => `-p ${p}`)
  const image = last.slice(cut + 1)
  const lines = [head]
  for (let i = 0; i < ports.length; i += portsPerLine) {
    lines.push('  ' + ports.slice(i, i + portsPerLine).join(' '))
  }
  lines.push('  ' + image)
  return lines.join(' \\\n')
}

const commandWide = computed(() => commandLines(2))
const commandNarrow = computed(() => commandLines(1))

// Docker or the standalone binary: two equal ways to start. Docker stays
// the default, so the server HTML is today's command.
type StartMethod = 'docker' | 'binary'
const startMethods: StartMethod[] = ['docker', 'binary']
const startMethod = ref<StartMethod>('docker')
const binary = useBinaryPlatform()

async function copyStartCommand() {
  const text = startMethod.value === 'binary' ? binary.copyText.value : t('hero.command')
  if (await copy(text)) {
    trackEvent('copy_install_command', {
      cta_location: 'hero',
      install_method: startMethod.value,
      ...(startMethod.value === 'binary' ? { platform: binary.platform.value.id } : {}),
    })
  }
}

const formattedDownloads = computed(() => {
  const count = github.totalDownloads
  if (count === 0) return null
  return format(count)
})
</script>

<template>
  <section class="hero">
    <ClientOnly>
      <VideoBackground />
    </ClientOnly>

    <div class="hero__overlay" />

    <div class="hero__container">
      <div class="hero__card">
        <!-- Version badge -->
        <div class="hero-stagger mb-5" style="--i: 0">
          <ClientOnly>
            <VersionBadge />
          </ClientOnly>
        </div>

        <!-- Headline -->
        <h1 class="hero-stagger" style="--i: 1">
          <span class="hero__headline">{{ t('hero.headline') }}</span>
          <br />
          <span class="hero__headline-sub">{{ t('hero.headlineSub') }}</span>
        </h1>

        <!-- Subheadline -->
        <p class="hero__subheadline hero-stagger" style="--i: 2">
          {{ t('hero.subheadline') }}
        </p>

        <!-- Start command -->
        <div class="hero__start hero-stagger" style="--i: 3">
          <div class="hero__methods" role="group" :aria-label="t('hero.install.label')">
            <button
              v-for="m in startMethods"
              :key="m"
              type="button"
              class="hero__method"
              :class="{ 'hero__method--active': startMethod === m }"
              :aria-pressed="startMethod === m"
              @click="startMethod = m"
            >
              {{ t(`hero.install.${m}`) }}
            </button>
          </div>
          <div v-if="startMethod === 'binary'" class="hero__command hero__command--binary">
            <BinaryPlatformPicker class="mb-3" />
            <pre><template v-for="(cmd, i) in binary.commands.value" :key="i"><span class="hero__prompt" aria-hidden="true">{{ binary.prompt.value }} </span>{{ cmd }}
</template></pre>
            <p v-if="binary.platform.value.os === 'windows'" class="hero__binary-note">
              {{ t('install.binary.windowsNote') }}
            </p>
          </div>
          <div
            v-else
            class="hero__command"
            tabindex="0"
            role="region"
            :aria-label="t('hero.cta.copy')"
          >
            <pre class="hidden sm:block"><span class="hero__prompt" aria-hidden="true">$ </span>{{ commandWide }}</pre>
            <pre class="sm:hidden"><span class="hero__prompt" aria-hidden="true">$ </span>{{ commandNarrow }}</pre>
          </div>
          <button type="button" class="hero__copy" @click="copyStartCommand">
            <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span aria-live="polite">{{ copied ? t('hero.cta.copied') : t('hero.cta.copy') }}</span>
          </button>
          <InstallPlatformsNote class="hero__platforms" />
        </div>

        <!-- Trust row -->
        <div class="hero__trust hero-stagger" style="--i: 4">
          <a href="#showcase" class="hero__trust-link" @click="trackEvent('cta_click', { cta_location: 'hero', cta_text: 'see_it_live' })">
            {{ t('hero.seeItLive') }}
          </a>
          <span class="hero__trust-dot" />
          <span v-if="formattedDownloads">{{ formattedDownloads }}+ {{ t('hero.trustRow.downloads') }}</span>
          <span v-if="formattedDownloads" class="hero__trust-dot" />
          <span>{{ t('hero.trustRow.license') }}</span>
          <span class="hero__trust-dot" />
          <span>{{ t('hero.trustRow.free') }}</span>
        </div>
      </div>
    </div>

    <!-- Scroll-down indicator -->
    <a href="#showcase" class="hero__scroll" aria-label="Scroll down">
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" stroke-width="1.5" />
        <circle class="hero__scroll-dot" cx="10" cy="8" r="2" fill="currentColor" />
      </svg>
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: #000;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 100%);
  pointer-events: none;
}

.hero__container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 120px 24px 80px;
}

.hero__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 40px 36px;
  border-radius: 24px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(20px) saturate(1.2);
  border: none;
  box-shadow: none;
}

/* ── Typography ──────────────────────────────────────────── */
.hero__headline {
  display: block;
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-size: 3rem;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #fff;
}

.hero__headline-sub {
  display: block;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
}

h1 {
  margin-bottom: 20px;
}

.hero__subheadline {
  font-family: "DM Sans", sans-serif;
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.55);
  max-width: 480px;
  margin-bottom: 32px;
}

/* ── Start command ───────────────────────────────────────── */
.hero__start {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 640px;
  margin-bottom: 20px;
}

.hero__command {
  width: 100%;
  padding: 14px 18px;
  overflow-x: auto;
  border-radius: 12px;
  background: theme('colors.code.bg');
  border: 1px solid theme('colors.code.border');
  text-align: left;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  color: theme('colors.code.text');
  line-height: 1.7;
}

.hero__command pre {
  margin: 0;
  font: inherit;
  white-space: pre;
}

.hero__methods {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid theme('colors.code.border');
}

.hero__method {
  min-height: 36px;
  min-width: 96px;
  padding: 0 16px;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: theme('colors.on-dark.secondary');
  transition: background-color 150ms ease, color 150ms ease;
}

.hero__method:hover {
  color: #fff;
}

.hero__method--active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.hero__command--binary pre {
  overflow-x: auto;
}

.hero__binary-note {
  margin-top: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.75rem;
  white-space: normal;
  color: theme('colors.on-dark.secondary');
}

.hero__platforms {
  margin-top: 4px;
  font-size: 0.8125rem;
}

.hero__command:focus-visible {
  outline-offset: -2px;
}

.hero__prompt {
  color: theme('colors.code.prompt');
  user-select: none;
}

.hero__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  background: theme('colors.accent.strong');
  color: #fff;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 150ms ease;
}

.hero__copy:hover {
  background: theme('colors.accent.strong-hover');
}

/* ── Trust row ───────────────────────────────────────────── */
.hero__trust {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  color: theme('colors.on-dark.secondary');
  letter-spacing: 0.02em;
}

.hero__trust-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 0.875rem;
  color: var(--accent, #3b82f6);
  text-decoration: none;
  transition: color 150ms ease;
}

.hero__trust-link:hover {
  color: var(--accent-hover, #2563eb);
}

.hero__trust-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

/* ── Scroll indicator ────────────────────────────────────── */
.hero__scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  color: rgba(255, 255, 255, 0.25);
  transition: color 300ms ease;
  animation: heroFadeIn 600ms ease-out 1.2s both;
}

.hero__scroll:hover {
  color: rgba(255, 255, 255, 0.6);
}

.hero__scroll-dot {
  animation: scrollBounce 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% { cy: 8; opacity: 1; }
  50% { cy: 18; opacity: 0.3; }
}

/* ── Stagger ─────────────────────────────────────────────── */
.hero-stagger {
  opacity: 0;
  transform: translateY(12px);
  animation: heroFadeIn 500ms ease-out both;
  animation-delay: calc(var(--i, 0) * 80ms + 200ms);
}

@keyframes heroFadeIn {
  to { opacity: 1; transform: translateY(0); }
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .hero__container {
    padding: 100px 16px 64px;
  }

  .hero__card {
    padding: 36px 20px 28px;
    border-radius: 20px;
  }

  .hero__headline {
    font-size: 2.25rem;
  }

  .hero__headline-sub {
    font-size: 1.5rem;
  }

  .hero__subheadline {
    font-size: 0.9375rem;
  }

  .hero__copy {
    width: 100%;
  }

  .hero__scroll {
    bottom: 20px;
  }
}

/* ── Reduced motion ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero-stagger {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .hero__scroll-dot {
    animation: none;
  }
}
</style>
