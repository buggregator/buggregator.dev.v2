<script setup lang="ts">
const { t } = useI18n()
const { discordUrl } = useRuntimeConfig().public

const { data: repoData } = useFetch<{ stars: number; forks: number }>('/api/stars', { lazy: true })

const format = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
</script>

<template>
  <section class="py-20 lg:py-28 bg-section-dark">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-section font-bold text-white mb-3 font-sans">
        {{ t('community.title') }}
      </h2>
      <p class="text-lg text-on-dark-secondary mb-10 max-w-xl mx-auto font-sans">
        {{ t('community.description') }}
      </p>

      <!-- Stats row -->
      <ClientOnly>
        <div v-if="repoData" class="flex flex-wrap justify-center gap-8 mb-10">
          <div class="text-center">
            <p class="text-3xl font-bold text-white font-sans">{{ format(repoData.stars) }}</p>
            <p class="text-sm text-on-dark-muted mt-1 font-sans">{{ t('community.stats.stars') }}</p>
          </div>
          <div class="w-px h-12 bg-landing-border-subtle hidden sm:block" />
          <div class="text-center">
            <p class="text-3xl font-bold text-white font-sans">MIT</p>
            <p class="text-sm text-on-dark-muted mt-1 font-sans">{{ t('community.stats.license') }}</p>
          </div>
        </div>
      </ClientOnly>

      <!-- Buttons -->
      <div class="flex flex-wrap justify-center gap-3">
        <a
          href="https://github.com/buggregator/server"
          target="_blank"
          rel="noopener"
          class="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors no-underline font-sans"
        >
          {{ t('community.star') }}
        </a>
        <a
          href="https://github.com/buggregator/server/issues"
          target="_blank"
          rel="noopener"
          class="px-5 py-2.5 rounded-lg text-sm font-medium text-on-dark-secondary transition-colors no-underline font-sans"
          style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);"
        >
          {{ t('community.issues') }}
        </a>
        <a
          href="https://github.com/buggregator/server/blob/master/CONTRIBUTING.md"
          target="_blank"
          rel="noopener"
          class="px-5 py-2.5 rounded-lg text-sm font-medium text-on-dark-secondary transition-colors no-underline font-sans"
          style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);"
        >
          {{ t('community.contribute') }}
        </a>
        <a
          :href="discordUrl"
          target="_blank"
          rel="noopener"
          class="px-5 py-2.5 rounded-lg text-sm font-medium text-on-dark-secondary transition-colors no-underline font-sans"
          style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);"
        >
          {{ t('community.discord') }}
        </a>
      </div>
    </div>
  </section>
</template>
