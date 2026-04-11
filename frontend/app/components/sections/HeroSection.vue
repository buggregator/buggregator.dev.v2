<script setup lang="ts">
import VersionBadge from '~/components/ui/VersionBadge.vue'
import VideoBackground from '~/components/sections/HeroSection/VideoBackground.vue'
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const { trackEvent } = useGtag()
const github = useGitHubStore()

const format = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const formattedStars = computed(() => {
  const server = github.getRepo('server')
  const count = server?.stars ?? 0
  if (count === 0) return null
  return format(count)
})

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

        <!-- Star CTA -->
        <div class="hero-stagger mb-7" style="--i: 3">
          <ClientOnly>
            <a
              href="https://github.com/buggregator/server"
              target="_blank"
              rel="noopener"
              class="star-btn"
              :title="formattedStars ? new Intl.NumberFormat('en').format(github.getRepo('server')?.stars ?? 0) + ' stars' : undefined"
              @click="trackEvent('cta_click', { cta_location: 'hero', cta_text: 'star_github' })"
            >
              <span class="star-btn__content">
                <svg class="star-btn__icon" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                </svg>
                <span>{{ t('hero.starCta') }}</span>
                <span v-if="formattedStars" class="star-btn__count">{{ formattedStars }}</span>
              </span>
            </a>
          </ClientOnly>
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

/* ── Star button ─────────────────────────────────────────── */
.star-btn {
  display: inline-flex;
  text-decoration: none;
  padding: 1.5px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f59e0b, #f97316, #3b82f6, #8b5cf6, #f59e0b);
  background-size: 300% 300%;
  animation: glowShift 4s ease-in-out infinite;
  transition: transform 200ms ease, box-shadow 300ms ease;
  box-shadow: 0 0 20px -6px rgba(245, 158, 11, 0.3);
}

.star-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 32px -4px rgba(245, 158, 11, 0.5);
}

.star-btn:active {
  transform: translateY(0);
}

.star-btn__content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 28px;
  border-radius: 10.5px;
  background: rgba(0, 0, 0, 0.85);
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  font-size: 0.9375rem;
  color: #fff;
  transition: background 200ms ease;
}

.star-btn:hover .star-btn__content {
  background: rgba(0, 0, 0, 0.7);
}

.star-btn__icon {
  width: 17px;
  height: 17px;
  color: #f59e0b;
  filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
  transition: transform 300ms ease, filter 300ms ease;
}

.star-btn:hover .star-btn__icon {
  transform: scale(1.15) rotate(-8deg);
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8));
}

.star-btn__count {
  padding: 2px 9px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
}

@keyframes glowShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ── Trust row ───────────────────────────────────────────── */
.hero__trust {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.02em;
}

.hero__trust-link {
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

  .star-btn {
    display: flex;
    width: 100%;
  }

  .star-btn__content {
    flex: 1;
    justify-content: center;
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
  .star-btn {
    animation: none;
  }
  .star-btn:hover {
    transform: none;
  }
  .star-btn:hover .star-btn__icon {
    transform: none;
  }
  .hero__scroll-dot {
    animation: none;
  }
}
</style>
