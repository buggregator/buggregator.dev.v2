<script setup lang="ts">
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const { trackEvent } = useGtag()
const github = useGitHubStore()

const trapRepo = computed(() => github.getRepo('trap'))
const pluginRepo = computed(() => github.getRepo('plugin'))

const formatStars = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
</script>

<template>
  <section id="ecosystem" class="py-20 lg:py-28 bg-section-mid border-t border-landing-border-subtle ecosystem-gradient">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-section font-bold text-white mb-3 font-sans">
          {{ t('ecosystem.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Trap card -->
        <div class="rounded-2xl border border-landing-border-subtle bg-landing-surface p-6 hover:-translate-y-0.5 transition-all duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-[rgba(6,182,212,0.12)] flex items-center justify-center">
              <svg class="w-5 h-5 text-ray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <ClientOnly>
              <div v-if="trapRepo" class="flex items-center gap-3">
                <span v-if="trapRepo.latest_version" class="text-xs font-mono text-on-dark-muted bg-landing-elevated px-2 py-0.5 rounded-full border border-landing-border-subtle">
                  v{{ trapRepo.latest_version }}
                </span>
                <span v-if="trapRepo.stars" class="inline-flex items-center gap-1 text-xs text-on-dark-muted">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                  {{ formatStars(trapRepo.stars) }}
                </span>
              </div>
            </ClientOnly>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2 font-sans">{{ t('ecosystem.trap.title') }}</h3>
          <p class="text-sm text-on-dark-muted leading-relaxed mb-4 font-sans">{{ t('ecosystem.trap.description') }}</p>

          <!-- Code examples -->
          <div class="mb-4 space-y-2">
            <div class="bg-landing-elevated rounded-xl border border-landing-border-subtle p-3 font-mono text-xs leading-relaxed">
              <div><span class="text-code-comment">// Dump variables — clean output, never pollutes your response</span></div>
              <div><span class="text-[#06b6d4]">trap</span><span class="text-code-text">(</span><span class="text-code-string">$user</span><span class="text-code-text">)-></span><span class="text-[#06b6d4]">depth</span><span class="text-code-text">(</span><span class="text-code-string">3</span><span class="text-code-text">);</span></div>
              <div class="mt-1.5"><span class="text-code-comment">// Dump and return — use inline without breaking flow</span></div>
              <div><span class="text-code-keyword">$response</span> <span class="text-code-text">=</span> <span class="text-[#06b6d4]">tr</span><span class="text-code-text">(</span><span class="text-code-string">$api</span><span class="text-code-text">-></span><span class="text-code-string">call</span><span class="text-code-text">());</span></div>
              <div class="mt-1.5"><span class="text-code-comment">// Dump and die</span></div>
              <div><span class="text-[#06b6d4]">td</span><span class="text-code-text">(</span><span class="text-code-string">$error</span><span class="text-code-text">);</span></div>
            </div>
            <div class="bg-landing-elevated rounded-xl border border-landing-border-subtle p-3">
              <code class="font-mono text-xs text-on-dark-secondary">composer require --dev buggregator/trap -W</code>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <a
              href="https://github.com/buggregator/trap"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
              @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'trap_github' })"
            >
              {{ t('ecosystem.trap.github') }} →
            </a>
            <a
              href="https://docs.buggregator.dev/trap/what-is-trap.html"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
              @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'trap_docs' })"
            >
              {{ t('ecosystem.trap.docs') }} →
            </a>
          </div>
        </div>

        <!-- JetBrains card -->
        <div class="rounded-2xl border border-landing-border-subtle bg-landing-surface p-6 hover:-translate-y-0.5 transition-all duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.12)] flex items-center justify-center">
              <svg class="w-5 h-5 text-profiler" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <ClientOnly>
              <div v-if="pluginRepo" class="flex items-center gap-3">
                <span v-if="pluginRepo.latest_version" class="text-xs font-mono text-on-dark-muted bg-landing-elevated px-2 py-0.5 rounded-full border border-landing-border-subtle">
                  v{{ pluginRepo.latest_version }}
                </span>
                <span v-if="pluginRepo.stars" class="inline-flex items-center gap-1 text-xs text-on-dark-muted">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
                  </svg>
                  {{ formatStars(pluginRepo.stars) }}
                </span>
              </div>
            </ClientOnly>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2 font-sans">{{ t('ecosystem.jetbrains.title') }}</h3>
          <p class="text-sm text-on-dark-muted leading-relaxed mb-4 font-sans">{{ t('ecosystem.jetbrains.description') }}</p>

          <div class="flex flex-wrap gap-3">
            <a
              href="https://plugins.jetbrains.com/plugin/26344-buggregator"
              target="_blank"
              rel="noopener"
              class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
              @click="trackEvent('cta_click', { cta_location: 'ecosystem', cta_text: 'jetbrains_install' })"
            >
              {{ t('ecosystem.jetbrains.install') }} →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ecosystem-gradient {
  background-image:
    radial-gradient(ellipse 40% 50% at 0% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 100% 50%, rgba(139, 92, 246, 0.04) 0%, transparent 70%);
}
</style>
