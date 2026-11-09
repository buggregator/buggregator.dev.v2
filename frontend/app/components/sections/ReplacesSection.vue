<script setup lang="ts">
import RevealWords from '~/components/ui/RevealWords.vue'

const { t } = useI18n()
const revealRef = ref<InstanceType<typeof RevealWords>>()

const tools = [
  { key: 'sentry', tool: 'Sentry (local)', color: '#f43f5e', link: '/features/sentry',
    compare: [{ label: 'vs Spotlight, GlitchTip', to: '/compare/sentry-for-local-development' }] },
  { key: 'mailhog', tool: 'Mailhog / Mailtrap', color: '#f59e0b', link: '/features/email-testing',
    compare: [
      { label: 'vs Mailhog', to: '/compare/mailhog-alternatives' },
      { label: 'vs Mailtrap', to: '/compare/mailtrap-alternative' },
    ] },
  { key: 'ray', tool: 'Ray', color: '#06b6d4' },
  { key: 'blackfire', tool: 'Blackfire / XHProf UI', color: '#8b5cf6', link: '/features/profiler' },
  { key: 'logviewers', tool: 'Log viewers', color: '#6b7280', link: '/features/logs' },
  { key: 'requestbin', tool: 'RequestBin', color: '#22c55e', link: '/features/http-dumps' },
  { key: 'inspector', tool: 'Inspector.dev (local)', color: '#eab308' },
  { key: 'smsgateway', tool: 'SMS gateways (dev)', color: '#a855f7', link: '/features/sms' },
  { key: 'proxy', tool: 'Charles / Fiddler / mitmproxy', color: '#10b981', link: '/features/http-proxy' },
  { key: 'mockapi', tool: 'Mockoon / Beeceptor (dev)', color: '#0ea5e9', link: '/features/mock-server' },
]
</script>

<template>
  <section
    class="py-20 lg:py-28 bg-section-mid replaces-gradient relative"
    @mousemove="revealRef?.handleMouse($event)"
    @mouseleave="revealRef?.handleLeave()"
  >
    <ClientOnly>
      <RevealWords
        ref="revealRef"
        :words="['Sentry', 'Mailtrap', 'Ray', 'Blackfire', 'Telescope', 'RequestBin', 'Mailhog', 'Inspector', 'Twilio', 'Clockwork', 'Papertrail', 'Bugsnag', 'Rollbar', 'free forever', 'all-in-one', 'zero cost', 'no signup', 'one command', 'replaces them all', 'console.log? nah', 'tail -f laravel.log', '¯\\_(ツ)_/¯', 'buggregator is cool']"
        color="#f43f5e"
        :radius="220"
        :density="28"
      />
    </ClientOnly>
    <div class="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-section font-bold text-white mb-3 font-sans">
          {{ t('replaces.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-for="item in tools" :key="item.key">
          <!-- With compare links: the card is not one link (links cannot nest);
               its feature link stretches over the card, the compare links sit above it. -->
          <div
            v-if="item.compare"
            class="relative flex items-center gap-3 p-4 rounded-xl bg-landing-surface border border-landing-border-subtle hover:border-landing-border hover:bg-landing-elevated transition-colors duration-150"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: item.color }" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-on-dark-secondary font-sans line-through opacity-50">{{ item.tool }}</p>
              <NuxtLink
                :to="item.link"
                class="text-sm text-on-dark-secondary font-sans no-underline after:absolute after:inset-0 after:rounded-xl"
              >{{ t(`replaces.tools.${item.key}`) }}</NuxtLink>
              <p class="relative z-10 mt-1 flex flex-wrap gap-x-3 text-xs font-sans">
                <NuxtLink
                  v-for="c in item.compare"
                  :key="c.to"
                  :to="c.to"
                  class="text-accent hover:text-accent-hover no-underline"
                >{{ c.label }} →</NuxtLink>
              </p>
            </div>
            <svg class="w-4 h-4 text-on-dark-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <component
            :is="item.link ? 'NuxtLink' : 'div'"
            v-else
            :to="item.link || undefined"
            class="flex items-center gap-3 p-4 rounded-xl bg-landing-surface border border-landing-border-subtle no-underline"
            :class="item.link ? 'hover:border-landing-border hover:bg-landing-elevated transition-colors duration-150 cursor-pointer' : ''"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: item.color }" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-on-dark-secondary font-sans line-through opacity-50">{{ item.tool }}</p>
              <p class="text-sm text-on-dark-secondary font-sans">{{ t(`replaces.tools.${item.key}`) }}</p>
            </div>
            <svg v-if="item.link" class="w-4 h-4 text-on-dark-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </component>
        </template>
      </div>

      <p class="text-center mt-10 text-lg font-semibold text-white font-sans">
        {{ t('replaces.footer') }}
      </p>

      <p class="text-center mt-3 text-sm text-on-dark-muted font-sans">
        {{ t('replaces.trapNote') }}
        <a
          href="#ecosystem"
          class="text-accent hover:text-accent-hover transition-colors no-underline"
        >→</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.replaces-gradient {
  background-image:
    radial-gradient(ellipse 50% 60% at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 20% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 70%);
}
</style>
