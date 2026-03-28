<script setup lang="ts">
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const { discordUrl } = useRuntimeConfig().public
const github = useGitHubStore()

const format = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

const formattedServerStars = computed(() => {
  const server = github.getRepo('server')
  const count = server?.stars ?? 0
  if (count === 0) return null
  return format(count)
})
</script>

<template>
  <section class="py-20 lg:py-28 bg-section-dark">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-section font-bold text-white mb-3 font-sans">
        {{ t('community.title') }}
      </h2>
      <p class="text-lg text-on-dark-secondary mb-4 max-w-xl mx-auto font-sans">
        {{ t('community.description') }}
      </p>

      <!-- Star help note -->
      <p class="text-sm text-on-dark-muted mb-10 font-sans">
        {{ t('hero.starHelp') }}
      </p>

      <!-- Stats row -->
      <ClientOnly>
        <div v-if="github.totalStars > 0" class="flex flex-wrap justify-center gap-8 mb-10">
          <div class="text-center">
            <p class="text-3xl font-bold text-white font-sans">{{ format(github.totalStars) }}</p>
            <p class="text-sm text-on-dark-muted mt-1 font-sans">{{ t('community.stats.stars') }}</p>
          </div>
          <div class="w-px h-12 bg-landing-border-subtle hidden sm:block" />
          <div class="text-center">
            <p class="text-3xl font-bold text-white font-sans">{{ github.contributors.length }}+</p>
            <p class="text-sm text-on-dark-muted mt-1 font-sans">{{ t('community.stats.contributors') }}</p>
          </div>
          <div class="w-px h-12 bg-landing-border-subtle hidden sm:block" />
          <div class="text-center">
            <p class="text-3xl font-bold text-white font-sans">MIT</p>
            <p class="text-sm text-on-dark-muted mt-1 font-sans">{{ t('community.stats.license') }}</p>
          </div>
        </div>
      </ClientOnly>

      <!-- Top contributors -->
      <ClientOnly>
        <div v-if="github.contributors.length > 0" class="mb-10">
          <div class="flex flex-wrap justify-center gap-2">
            <a
              v-for="contributor in github.contributors.slice(0, 30)"
              :key="contributor.login"
              :href="contributor.html_url"
              target="_blank"
              rel="noopener"
              class="group relative"
              :title="`${contributor.login} — ${contributor.contributions} contributions`"
            >
              <img
                :src="`${contributor.avatar_url}&s=64`"
                :alt="contributor.login"
                class="w-10 h-10 rounded-full border-2 border-transparent transition-all duration-200 group-hover:border-accent group-hover:scale-110"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </ClientOnly>

      <!-- Elevated Star button -->
      <div class="mb-6">
        <ClientOnly>
          <a
            href="https://github.com/buggregator/server"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2.5 px-8 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white text-base font-medium transition-colors no-underline font-sans w-full sm:w-auto justify-center"
          >
            <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            {{ t('community.star') }}
            <span v-if="formattedServerStars" class="opacity-75">({{ formattedServerStars }})</span>
          </a>
        </ClientOnly>
      </div>

      <!-- Secondary buttons -->
      <div class="flex flex-wrap justify-center gap-3">
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
