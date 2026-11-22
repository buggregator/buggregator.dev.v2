<script setup lang="ts">
import HeroCommand from '~/components/sections/HeroSection/HeroCommand.vue'
import FeatureViewer from '~/components/sections/HeroSection/FeatureViewer.vue'
import { FEATURE_RELEASE } from '~/data/features'

// First screen, «product first»: who and what in one line, one line about
// other languages, one `docker run` with Copy, then the real interface:
// one tab per feature (FeatureViewer).
// Other ways to install live in «How it works», step 1.
const { t } = useI18n()
const { trackEvent } = useGtag()

// Docs page that walks an AI assistant through the setup.
const AGENT_SETUP_URL = 'https://docs.buggregator.dev/agent-setup.html'
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__inner">
      <a
        :href="FEATURE_RELEASE.url"
        target="_blank"
        rel="noopener"
        class="hero__badge hero-stagger"
        style="--i: 0"
      >{{ t('hero.badge.release', { version: FEATURE_RELEASE.tag }) }}</a>

      <h1 id="hero-title" class="hero__title hero-stagger" style="--i: 1">
        {{ t('hero.headline') }} <span class="whitespace-nowrap">{{ t('hero.headlineSub') }}</span>
      </h1>

      <p class="hero__lead hero-stagger" style="--i: 2">{{ t('hero.subheadline') }}</p>
      <p class="hero__langs hero-stagger" style="--i: 2">{{ t('hero.languages') }}</p>

      <div class="hero__action hero-stagger" style="--i: 3">
        <HeroCommand />
        <!-- Secondary ways in: ghost buttons with an icon, no arrows. -->
        <div class="hero__under">
          <a
            href="#how-it-works"
            class="hero__alt"
            @click="trackEvent('cta_click', { cta_location: 'hero', cta_text: 'other_ways' })"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" />
            </svg>
            {{ t('hero.install.otherWays') }}
          </a>
          <a
            :href="AGENT_SETUP_URL"
            target="_blank"
            rel="noopener"
            class="hero__alt"
            @click="trackEvent('cta_click', { cta_location: 'hero', cta_text: 'agent_setup' })"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" /><path d="m12 8 1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2L12 8Z" />
            </svg>
            {{ t('hero.aiAgent') }}
          </a>
        </div>
        <p class="hero__trust">{{ t('hero.trustLine') }}</p>
      </div>

      <FeatureViewer class="hero__preview hero-stagger" style="--i: 4" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background-color: theme('colors.section-dark');
  background-image: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(59, 130, 246, 0.10), transparent 70%);
}

.hero__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 136px 32px 0;
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid theme('colors.landing-border');
  border-radius: 3px;
  background: theme('colors.landing-surface');
  font-family: "JetBrains Mono", monospace;
  font-size: 12px;
  line-height: 24px;
  color: theme('colors.on-dark.secondary');
  text-decoration: none;
  transition: border-color 150ms ease, color 150ms ease;
}

.hero__badge:hover {
  border-color: theme('colors.landing-border-hover');
  color: theme('colors.on-dark.primary');
}

.hero__title {
  margin: 20px 0 16px;
  font-family: "DM Sans", sans-serif;
  font-size: 56px;
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.025em;
  color: theme('colors.on-dark.primary');
  text-wrap: balance;
}

.hero__lead {
  max-width: 700px;
  margin: 0 auto 10px;
  font-family: "DM Sans", sans-serif;
  font-size: 19px;
  line-height: 1.5;
  color: theme('colors.on-dark.secondary');
}

.hero__langs {
  margin: 0;
  font-family: "DM Sans", sans-serif;
  font-size: 15px;
  color: theme('colors.on-dark.muted');
}

.hero__action {
  max-width: 860px;
  margin: 28px auto 0;
}

.hero__under {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
}

.hero__alt {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid theme('colors.landing-border');
  border-radius: 999px;
  background: theme('colors.landing-surface');
  color: theme('colors.on-dark.secondary');
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 150ms ease, border-color 150ms ease;
}

.hero__alt svg {
  width: 16px;
  height: 16px;
  flex: none;
  color: theme('colors.accent.DEFAULT');
}

.hero__alt:hover {
  color: #fff;
  border-color: theme('colors.accent.DEFAULT');
}

.hero__alt:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}

.hero__trust {
  margin: 10px 0 0;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: theme('colors.on-dark.muted');
}

.hero__preview {
  /* Wider than the text above: all eight feature tabs fit in one row
     from 1132 px up. Below that the tab row scrolls. */
  --preview-w: min(1100px, calc(100vw - 32px));
  width: var(--preview-w);
  margin-top: 44px;
  margin-left: calc((100% - var(--preview-w)) / 2);
}

/* ── Stagger ─────────────────────────────────────────────── */
.hero-stagger {
  animation: heroFadeIn 500ms ease-out both;
  animation-delay: calc(var(--i, 0) * 80ms + 100ms);
}

@keyframes heroFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 639px) {
  .hero__inner {
    padding: 112px 16px 0;
  }

  .hero__title {
    font-size: 36px;
  }

  .hero__lead {
    font-size: 17px;
  }

  .hero__action {
    margin-top: 24px;
  }

  .hero__alt {
    height: 44px;
  }

  .hero__preview {
    margin-top: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-stagger {
    animation: none;
  }
}
</style>
