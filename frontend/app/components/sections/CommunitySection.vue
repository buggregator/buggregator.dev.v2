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
  <section class="py-20 lg:py-28 bg-section-dark community-glow">
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

      <!-- Star button (same style as Hero) -->
      <div class="mb-6">
        <ClientOnly>
          <a
            href="https://github.com/buggregator/server"
            target="_blank"
            rel="noopener"
            class="star-btn"
          >
            <span class="star-btn__content">
              <svg class="star-btn__icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
              <span>{{ t('community.star') }}</span>
              <span v-if="formattedServerStars" class="star-btn__count">{{ formattedServerStars }}</span>
            </span>
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

<style scoped>
.community-glow {
  background-image:
    radial-gradient(ellipse 50% 40% at 50% 100%, rgba(245, 158, 11, 0.05) 0%, transparent 70%);
}

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
.star-btn:active { transform: translateY(0); }
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
.star-btn:hover .star-btn__content { background: rgba(0, 0, 0, 0.7); }
.star-btn__icon {
  width: 17px; height: 17px;
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
@media (max-width: 639px) {
  .star-btn { display: flex; width: 100%; }
  .star-btn__content { flex: 1; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .star-btn { animation: none; }
  .star-btn:hover { transform: none; }
  .star-btn:hover .star-btn__icon { transform: none; }
}
</style>
