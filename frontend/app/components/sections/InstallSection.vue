<script setup lang="ts">
import CopyCommand from '~/components/ui/CopyCommand.vue'
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const github = useGitHubStore()

const imageTag = computed(() => {
  const v = github.serverVersion
  return v ? `v${v}` : 'latest'
})

type TabId = 'docker' | 'compose' | 'trap'
const activeTab = ref<TabId>('docker')

const tabs: { id: TabId; label: string }[] = [
  { id: 'docker', label: 'install.tabs.docker' },
  { id: 'compose', label: 'install.tabs.compose' },
  { id: 'trap', label: 'install.tabs.trap' },
]

const snippets = computed<Record<TabId, string>>(() => ({
  docker: `docker run \\
  -p 127.0.0.1:8000:8000 \\
  -p 127.0.0.1:1025:1025 \\
  -p 127.0.0.1:9912:9912 \\
  -p 127.0.0.1:9913:9913 \\
  -p 127.0.0.1:9914:9914 \\
  ghcr.io/buggregator/server:${imageTag.value}`,
  compose: `services:
  buggregator:
    image: ghcr.io/buggregator/server:${imageTag.value}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025
      - 127.0.0.1:9912:9912
      - 127.0.0.1:9913:9913
      - 127.0.0.1:9914:9914`,
  trap: 'composer require --dev buggregator/trap -W',
}))

const trustBadges = computed(() => [
  t('install.trust.free'),
  t('install.trust.noReg'),
  t('install.trust.noCard'),
  t('install.trust.oss'),
])
</script>

<template>
  <section id="install" class="py-20 lg:py-28 bg-section-mid">
    <div class="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title -->
      <div class="text-center mb-10">
        <h2 class="text-section font-bold text-white mb-3 font-sans">
          {{ t('install.title') }}
        </h2>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-code-bg rounded-t-xl px-2 pt-2 border-b border-code-border">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-5 py-2.5 font-mono text-sm transition-colors duration-150 border-b-2 rounded-t-md"
          :class="activeTab === tab.id
            ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
            : 'text-[#6e7681] border-transparent hover:text-code-text'"
          @click="activeTab = tab.id"
        >
          {{ t(tab.label) }}
        </button>
      </div>

      <!-- Code block -->
      <div class="bg-code-bg rounded-b-xl p-5 mb-4">
        <Transition name="tab-fade" mode="out-in">
          <div :key="activeTab">
            <CopyCommand :command="snippets[activeTab]" no-bg />
            <p
              v-if="activeTab === 'trap'"
              class="mt-3 text-sm text-on-dark-muted font-sans italic"
            >
              {{ t('install.trapNote') }}
            </p>
          </div>
        </Transition>
      </div>

      <!-- Trust badges -->
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
        <span
          v-for="badge in trustBadges"
          :key="badge"
          class="inline-flex items-center gap-2 text-sm text-on-dark-secondary font-sans"
        >
          <svg class="w-4 h-4 text-[#22c55e] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ badge }}
        </span>
      </div>

      <!-- Links -->
      <div class="flex flex-wrap justify-center gap-6 mt-8">
        <a
          href="https://docs.buggregator.dev/getting-started"
          target="_blank"
          rel="noopener"
          class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
        >
          {{ t('install.links.fullGuide') }}
        </a>
        <a
          href="https://docs.buggregator.dev/config"
          target="_blank"
          rel="noopener"
          class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
        >
          {{ t('install.links.config') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 150ms ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
