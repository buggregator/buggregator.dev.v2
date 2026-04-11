<script setup lang="ts">
import DocSearch from '~/components/layout/DocSearch.vue'
import GitHubStars from '~/components/layout/GitHubStars.vue'
import LanguageSwitcher from '~/components/ui/LanguageSwitcher.vue'
import logoSvg from '~/assets/img/logo.svg'

const { t } = useI18n()
const { discordUrl } = useRuntimeConfig().public

const scrolled = ref(false)
const mobileOpen = ref(false)

const docsUrl = 'https://docs.buggregator.dev'

const navLinks = computed(() => [
  { label: t('nav.howItWorks'), href: '/#how-it-works' },
  { label: t('nav.features'), href: '/#showcase' },
  { label: t('nav.docs'), href: docsUrl, external: true },
])

const featureLinks = [
  { label: 'Email Testing', to: '/features/email-testing', color: '#f59e0b' },
  { label: 'Exception Tracking', to: '/features/sentry', color: '#f43f5e' },
  { label: 'Profiler', to: '/features/profiler', color: '#8b5cf6' },
  { label: 'HTTP Proxy', to: '/features/http-proxy', color: '#10b981' },
  { label: 'SMS Testing', to: '/features/sms', color: '#a855f7' },
]

const featuresOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-100"
    :class="scrolled
      ? 'bg-[#0c0e14]/95 backdrop-blur-md border-b border-landing-border-subtle'
      : 'bg-transparent border-b border-transparent'"
  >
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center shrink-0">
          <img :src="logoSvg" alt="Buggregator" class="h-7" />
        </NuxtLink>

        <!-- Desktop nav links -->
        <div class="hidden md:flex items-center gap-6">
          <template v-for="link in navLinks" :key="link.href">
            <a
              v-if="link.external"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="text-sm font-medium text-on-dark-secondary hover:text-on-dark-primary transition-colors duration-150 no-underline font-sans"
            >
              {{ link.label }}
            </a>
            <a
              v-else
              :href="link.href"
              class="text-sm font-medium text-on-dark-secondary hover:text-on-dark-primary transition-colors duration-150 no-underline font-sans"
            >
              {{ link.label }}
            </a>
          </template>

          <!-- Features dropdown -->
          <div
            class="relative"
            @mouseenter="featuresOpen = true"
            @mouseleave="featuresOpen = false"
          >
            <button
              class="text-sm font-medium text-on-dark-secondary hover:text-on-dark-primary transition-colors duration-150 font-sans flex items-center gap-1"
            >
              Guides
              <svg class="w-3.5 h-3.5 transition-transform duration-150" :class="featuresOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-show="featuresOpen"
              class="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
            >
              <div class="bg-landing-elevated border border-landing-border rounded-xl shadow-card-hover py-2 min-w-[200px]">
                <NuxtLink
                  v-for="fl in featureLinks"
                  :key="fl.to"
                  :to="fl.to"
                  class="flex items-center gap-2.5 px-4 py-2 text-sm text-on-dark-secondary hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-150 no-underline font-sans"
                  @click="featuresOpen = false"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: fl.color }" />
                  {{ fl.label }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side -->
        <div class="hidden md:flex items-center gap-3">
          <ClientOnly>
            <DocSearch />
          </ClientOnly>
          <ClientOnly>
            <GitHubStars />
          </ClientOnly>
          <a
            :href="discordUrl"
            target="_blank"
            rel="noopener"
            aria-label="Discord"
            class="flex items-center justify-center w-8 h-8 rounded-lg text-on-dark-secondary hover:text-on-dark-primary transition-colors duration-150"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
          <LanguageSwitcher />
        </div>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-on-dark-secondary hover:text-on-dark-primary transition-colors"
          :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <div
      v-if="mobileOpen"
      class="md:hidden bg-[#0c0e14] border-t border-landing-border-subtle px-4 py-6"
    >
      <div class="flex flex-col gap-4">
        <template v-for="link in navLinks" :key="link.href">
          <a
            v-if="link.external"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="text-sm font-medium text-on-dark-secondary hover:text-on-dark-primary transition-colors no-underline font-sans py-2"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </a>
          <a
            v-else
            :href="link.href"
            class="text-sm font-medium text-on-dark-secondary hover:text-on-dark-primary transition-colors no-underline font-sans py-2"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </a>
        </template>

        <!-- Feature links (mobile) -->
        <div class="pt-2 border-t border-landing-border-subtle">
          <p class="text-xs font-semibold uppercase tracking-wider text-on-dark-muted mb-2 font-sans">Guides</p>
          <div class="flex flex-col gap-1">
            <NuxtLink
              v-for="fl in featureLinks"
              :key="fl.to"
              :to="fl.to"
              class="flex items-center gap-2 text-sm text-on-dark-secondary hover:text-on-dark-primary transition-colors no-underline font-sans py-1.5"
              @click="mobileOpen = false"
            >
              <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: fl.color }" />
              {{ fl.label }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-3 pt-2 border-t border-landing-border-subtle">
          <ClientOnly>
            <GitHubStars />
          </ClientOnly>
          <a
            :href="discordUrl"
            target="_blank"
            rel="noopener"
            aria-label="Discord"
            class="flex items-center justify-center w-8 h-8 rounded-lg text-on-dark-secondary hover:text-on-dark-primary transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
          <LanguageSwitcher />
        </div>

      </div>
    </div>
  </nav>
</template>
