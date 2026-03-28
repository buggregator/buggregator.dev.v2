<script setup lang="ts">
import logoSvg from '~/assets/img/logo.svg'

const { t } = useI18n()
const { discordUrl } = useRuntimeConfig().public

const productLinks = [
  { label: 'footer.links.docs', href: 'https://docs.buggregator.dev' },
  { label: 'footer.links.features', href: '#showcase' },
  { label: 'footer.links.trap', href: 'https://github.com/buggregator/trap' },
  { label: 'footer.links.plugin', href: 'https://plugins.jetbrains.com/plugin/18529-buggregator' },
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

      <!-- Bottom bar -->
      <div class="border-t border-landing-border-subtle mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-on-dark-muted font-sans">
          &copy; {{ new Date().getFullYear() }} Buggregator. MIT License.
        </p>
      </div>
    </div>
  </footer>
</template>
