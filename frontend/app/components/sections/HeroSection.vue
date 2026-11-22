<script setup lang="ts">
import HeroCommand from '~/components/sections/HeroSection/HeroCommand.vue'
import HeroPreview from '~/components/sections/HeroSection/HeroPreview.vue'
import { FEATURE_RELEASE } from '~/data/features'

// First screen, «product first»: who and what in one line, one line about
// other languages, one `docker run` with Copy, then the real interface.
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
        <div class="hero__under">
          <a href="#how-it-works" @click="trackEvent('cta_click', { cta_location: 'hero', cta_text: 'other_ways' })">{{ t('hero.install.otherWays') }}</a>
          <a
            :href="AGENT_SETUP_URL"
            target="_blank"
            rel="noopener"
            @click="trackEvent('cta_click', { cta_location: 'hero', cta_text: 'agent_setup' })"
          >{{ t('hero.aiAgent') }}</a>
        </div>
        <p class="hero__trust">{{ t('hero.trustLine') }}</p>
      </div>

      <HeroPreview class="hero__preview hero-stagger" style="--i: 4" />
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
  gap: 6px 20px;
  margin-top: 14px;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
}

.hero__under a {
  color: theme('colors.accent.DEFAULT');
  text-decoration: none;
}

.hero__under a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.hero__trust {
  margin: 10px 0 0;
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: theme('colors.on-dark.muted');
}

.hero__preview {
  margin-top: 44px;
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

  .hero__under {
    gap: 0 14px;
  }

  .hero__under a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
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
