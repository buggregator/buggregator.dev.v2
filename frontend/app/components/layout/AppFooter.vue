<script setup lang="ts">
import logoSvg from '~/assets/img/logo.svg'

const { t } = useI18n()
const { discordUrl } = useRuntimeConfig().public

const productLinks = [
  { label: 'footer.links.docs', href: 'https://docs.buggregator.dev' },
  { label: 'footer.links.features', href: '#showcase' },
  { label: 'footer.links.trap', href: 'https://github.com/buggregator/trap' },
  { label: 'footer.links.plugin', href: 'https://plugins.jetbrains.com/plugin/26344-buggregator' },
  { label: 'footer.links.gettingStarted', href: 'https://docs.buggregator.dev/getting-started' },
]

const communityLinks = computed(() => [
  { label: 'footer.links.github', href: 'https://github.com/buggregator/server' },
  { label: 'footer.links.discord', href: discordUrl as string },
  { label: 'footer.links.bugs', href: 'https://github.com/buggregator/server/issues' },
  { label: 'footer.links.sponsors', href: '/sponsors' },
])

const resourceLinks = [
  { label: 'footer.links.releases', href: 'https://github.com/buggregator/server/releases' },
]
</script>

<template>
  <footer class="bg-section-mid border-t border-landing-border-subtle py-16">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Logo + tagline -->
        <div>
          <img :src="logoSvg" alt="Buggregator" class="h-6 mb-3" />
          <p class="text-sm text-on-dark-muted font-sans">{{ t('footer.tagline') }}</p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-on-dark-secondary mb-4 font-sans">
            {{ t('footer.product') }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in productLinks" :key="link.href">
              <a
                :href="link.href"
                :target="link.href.startsWith('http') ? '_blank' : undefined"
                :rel="link.href.startsWith('http') ? 'noopener' : undefined"
                class="text-sm text-on-dark-muted hover:text-on-dark-secondary transition-colors duration-150 no-underline font-sans"
              >
                {{ t(link.label) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Community -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-on-dark-secondary mb-4 font-sans">
            {{ t('footer.community') }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in communityLinks" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="text-sm text-on-dark-muted hover:text-on-dark-secondary transition-colors duration-150 no-underline font-sans"
              >
                {{ t(link.label) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-on-dark-secondary mb-4 font-sans">
            {{ t('footer.resources') }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in resourceLinks" :key="link.href">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener"
                class="text-sm text-on-dark-muted hover:text-on-dark-secondary transition-colors duration-150 no-underline font-sans"
              >
                {{ t(link.label) }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Author -->
      <div class="mt-10 pt-6 border-t border-landing-border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
        <a
          href="https://linkedin.com/in/butschster"
          target="_blank"
          rel="noopener"
          class="group inline-flex items-center gap-3 no-underline"
        >
          <img
            src="https://avatars.githubusercontent.com/u/773481?v=4"
            alt="Pavel Buchnev"
            class="w-9 h-9 rounded-full object-cover border-2 border-landing-border-subtle"
          />
          <div>
            <div class="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
              Pavel Buchnev
              <svg class="w-3 h-3 text-[#0a66c2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </div>
            <div class="font-mono text-[9px] uppercase tracking-wider text-on-dark-muted">Creator</div>
          </div>
        </a>

        <div class="flex items-center gap-4 text-on-dark-muted">
          <span class="font-mono text-[10px]">
            Built with <a href="https://wippy.ai" target="_blank" rel="noopener" class="text-on-dark-secondary hover:text-white transition-colors no-underline">Wippy</a>
          </span>
          <span class="font-mono text-[10px]">&copy; {{ new Date().getFullYear() }} Buggregator</span>
        </div>
      </div>
    </div>
  </footer>
</template>
