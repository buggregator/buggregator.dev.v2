<script setup lang="ts">
import CopyCommand from '~/components/ui/CopyCommand.vue'

const { t } = useI18n()
</script>

<template>
  <section class="py-20 lg:py-28 bg-white border-t border-[#e5e7eb]">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-section font-bold text-on-light-primary mb-3 font-sans">
          {{ t('ecosystem.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Trap card -->
        <div class="rounded-2xl border border-[#e5e7eb] p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div class="w-10 h-10 rounded-xl bg-[rgba(6,182,212,0.12)] flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-ray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-on-light-primary mb-2 font-sans">{{ t('ecosystem.trap.title') }}</h3>
          <p class="text-sm text-on-light-muted leading-relaxed mb-4 font-sans">{{ t('ecosystem.trap.description') }}</p>

          <div class="mb-4 bg-section-light rounded-xl border border-[#e5e7eb] p-3">
            <code class="font-mono text-xs text-on-light-secondary">composer require --dev buggregator/trap -W</code>
          </div>

          <div class="flex flex-wrap gap-3">
            <a
              href="https://github.com/buggregator/trap"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
            >
              {{ t('ecosystem.trap.github') }} →
            </a>
            <a
              href="https://docs.buggregator.dev/trap"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
            >
              {{ t('ecosystem.trap.docs') }} →
            </a>
          </div>
        </div>

        <!-- JetBrains card -->
        <div class="rounded-2xl border border-[#e5e7eb] p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div class="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.12)] flex items-center justify-center mb-4">
            <svg class="w-5 h-5 text-profiler" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-on-light-primary mb-2 font-sans">{{ t('ecosystem.jetbrains.title') }}</h3>
          <p class="text-sm text-on-light-muted leading-relaxed mb-4 font-sans">{{ t('ecosystem.jetbrains.description') }}</p>

          <div class="flex flex-wrap gap-3">
            <a
              href="https://plugins.jetbrains.com/plugin/18529-buggregator"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
            >
              {{ t('ecosystem.jetbrains.install') }} →
            </a>
            <a
              href="https://docs.buggregator.dev/phpstorm"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
            >
              {{ t('ecosystem.jetbrains.docs') }} →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
