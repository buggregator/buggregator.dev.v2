<script setup lang="ts">
import RevealWords from '~/components/ui/RevealWords.vue'

const { t } = useI18n()
const revealRef = ref<InstanceType<typeof RevealWords>>()

// Every item opens a page. `link` is a feature page: these pages are English
// only (defineI18nRoute(false)), so the path has no locale prefix in any locale.
// `docs` is used only where the site has no feature page for that tool yet.
const tools = [
  { key: 'sentry', tool: 'Sentry (local)', color: '#f43f5e', link: '/features/sentry' },
  { key: 'mailhog', tool: 'Mailhog / Mailtrap', color: '#f59e0b', link: '/features/email-testing' },
  { key: 'ray', tool: 'Ray', color: '#06b6d4', docs: 'https://docs.buggregator.dev/config/ray.html' },
  { key: 'blackfire', tool: 'Blackfire / XHProf UI', color: '#8b5cf6', link: '/features/profiler' },
  { key: 'logviewers', tool: 'Log viewers', color: '#6b7280', link: '/features/logs' },
  { key: 'requestbin', tool: 'RequestBin', color: '#22c55e', link: '/features/http-dumps' },
  { key: 'inspector', tool: 'Inspector.dev (local)', color: '#eab308', docs: 'https://docs.buggregator.dev/config/inspector.html' },
  { key: 'smsgateway', tool: 'SMS gateways (dev)', color: '#a855f7', link: '/features/sms' },
  { key: 'proxy', tool: 'Charles / Fiddler / mitmproxy', color: '#10b981', link: '/features/http-proxy' },
  { key: 'mockapi', tool: 'Mockoon / Beeceptor (dev)', color: '#0ea5e9', link: '/features/mock-server' },
]

const items = tools.map(item => ({
  ...item,
  to: item.link ?? item.docs!,
  external: !item.link,
}))
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
        <NuxtLink
          v-for="item in items"
          :key="item.key"
          :to="item.to"
          :target="item.external ? '_blank' : undefined"
          :data-replaces-item="item.key"
          class="replaces-item group flex items-center gap-3 p-4 rounded-xl bg-landing-surface border border-landing-border-subtle no-underline cursor-pointer transition-colors duration-150 hover:border-landing-border hover:bg-landing-elevated"
        >
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: item.color }" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-on-dark-secondary font-sans line-through opacity-50">{{ item.tool }}</p>
            <p class="text-sm text-on-dark-secondary font-sans">{{ t(`replaces.tools.${item.key}`) }}</p>
          </div>
          <!-- Docs open on another site: arrow out instead of the chevron. -->
          <svg v-if="item.external" class="w-4 h-4 text-on-dark-muted shrink-0 transition-colors duration-150 group-hover:text-white group-focus-visible:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M9 7h8v8" />
          </svg>
          <svg v-else class="w-4 h-4 text-on-dark-muted shrink-0 transition-[color,transform] duration-150 group-hover:text-white group-hover:translate-x-0.5 group-focus-visible:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
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
.replaces-item:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
  border-color: theme('colors.landing-border');
  background-color: theme('colors.landing-elevated');
}

.replaces-gradient {
  background-image:
    radial-gradient(ellipse 50% 60% at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 20% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 70%);
}
</style>
