<script setup lang="ts">
import VersionBadge from '~/components/ui/VersionBadge.vue'
import CopyCommand from '~/components/ui/CopyCommand.vue'
import HeroVisual from '~/components/sections/HeroSection/HeroVisual.vue'

const { t } = useI18n()
</script>

<template>
  <section class="relative bg-section-dark pt-32 pb-24 min-h-screen lg:flex lg:items-center">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="lg:grid lg:grid-cols-[55%_45%] lg:gap-12 lg:items-center">
        <!-- Left column -->
        <div class="max-w-2xl">
          <!-- Badge row -->
          <div class="flex flex-wrap items-center gap-2 mb-6 hero-stagger" style="--i: 0">
            <ClientOnly>
              <VersionBadge />
            </ClientOnly>
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono"
              style="background: var(--badge-bg); border: 1px solid var(--badge-border); color: var(--badge-text);"
            >
              {{ t('hero.badge.free') }}
            </span>
          </div>

          <!-- Headline -->
          <h1 class="font-sans text-hero-sm lg:text-hero font-bold text-white mb-5 hero-stagger" style="--i: 1">
            {{ t('hero.headline1') }}
          </h1>

          <!-- Subheadline -->
          <p class="font-sans text-lg text-on-dark-secondary leading-relaxed max-w-[560px] mb-8 hero-stagger" style="--i: 2">
            {{ t('hero.subheadline') }}
          </p>

          <!-- Copy command -->
          <div class="hero-stagger" style="--i: 3">
            <CopyCommand :command="t('hero.command')" />
          </div>
        </div>

        <!-- Right column: visual (hidden on mobile) -->
        <div class="hidden lg:block">
          <HeroVisual />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
</style>
