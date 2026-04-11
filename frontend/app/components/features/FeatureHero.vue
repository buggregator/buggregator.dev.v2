<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  description: string
  accentColor: string
}>()
</script>

<template>
  <section class="relative pt-24 lg:pt-32 pb-10 lg:pb-12 bg-section-dark overflow-hidden">
    <!-- Subtle gradient blob -->
    <div
      class="absolute inset-0 pointer-events-none"
      :style="`background-image: radial-gradient(ellipse 60% 50% at 50% 0%, ${accentColor}08 0%, transparent 70%);`"
    />

    <div class="relative max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <!-- Breadcrumb -->
      <div class="feature-stagger mb-6" style="--i: 0">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 font-mono text-xs text-on-dark-muted hover:text-on-dark-secondary transition-colors no-underline"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Buggregator
        </NuxtLink>
      </div>

      <!-- Color indicator + label -->
      <div class="feature-stagger flex items-center justify-center gap-2 mb-5" style="--i: 1">
        <span class="w-2 h-2 rounded-full" :style="{ background: accentColor }" />
        <span class="font-mono text-xs uppercase tracking-wider" :style="{ color: accentColor }">
          {{ subtitle }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="feature-stagger font-sans font-bold text-white mb-6" style="--i: 2">
        <span class="block text-[2.5rem] lg:text-[3rem] leading-[1.1] tracking-tight">
          {{ title }}
        </span>
      </h1>

      <!-- Description -->
      <p class="feature-stagger font-sans text-lg lg:text-xl text-on-dark-secondary leading-relaxed max-w-[640px] mx-auto mb-10" style="--i: 3">
        {{ description }}
      </p>

      <!-- CTA -->
      <div class="feature-stagger" style="--i: 4">
        <slot name="cta" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-stagger {
  opacity: 0;
  transform: translateY(12px);
  animation: featureFadeIn 500ms ease-out both;
  animation-delay: calc(var(--i, 0) * 80ms + 100ms);
}

@keyframes featureFadeIn {
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .feature-stagger {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
