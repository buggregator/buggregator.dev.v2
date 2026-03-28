<script setup lang="ts">
const { t } = useI18n()

const features = [
  { key: 'sso', icon: '🔐' },
  { key: 'db', icon: '🗄️' },
  { key: 'k8s', icon: '☸️' },
  { key: 'webhooks', icon: '🔔' },
  { key: 'prometheus', icon: '📊' },
  { key: 'multiproject', icon: '📁' },
]
</script>

<template>
  <section class="py-20 lg:py-28 bg-[#f3f4f6]">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-section font-bold text-on-light-primary mb-3 font-sans">
          {{ t('advanced.title') }}
        </h2>
        <p class="text-lg text-on-light-muted font-sans">
          {{ t('advanced.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="feat in features"
          :key="feat.key"
          class="rounded-xl bg-white border border-[#e5e7eb] p-5 shadow-card"
        >
          <span class="text-2xl mb-3 block">{{ feat.icon }}</span>
          <h3 class="text-sm font-semibold text-on-light-primary mb-1 font-sans">
            {{ t(`advanced.features.${feat.key}.title`) }}
          </h3>
          <p class="text-sm text-on-light-muted font-sans leading-relaxed">
            {{ t(`advanced.features.${feat.key}.desc`) }}
          </p>
        </div>
      </div>

      <div class="text-center mt-8">
        <a
          href="https://docs.buggregator.dev/config"
          target="_blank"
          rel="noopener"
          class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
        >
          {{ t('advanced.viewAll') }}
        </a>
      </div>
    </div>
  </section>
</template>
