<script setup lang="ts">
import CopyCommand from '~/components/ui/CopyCommand.vue'
import StepItem from '~/components/sections/StepsSection/StepItem.vue'
import TerminalMockup from '~/components/sections/StepsSection/TerminalMockup.vue'
import FrameworkTabs from '~/components/sections/StepsSection/FrameworkTabs.vue'
import BrowserMockup from '~/components/sections/StepsSection/BrowserMockup.vue'

const { t } = useI18n()

// Step 1: install method tabs
type InstallTab = 'docker' | 'compose'
const installTab = ref<InstallTab>('docker')

const dockerCommand = `docker run --pull always \\
  -p 127.0.0.1:8000:8000 \\
  -p 127.0.0.1:1025:1025 \\
  -p 127.0.0.1:9912:9912 \\
  ghcr.io/buggregator/server:latest`

const composeCommand = `services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025
      - 127.0.0.1:9912:9912
      - 127.0.0.1:9913:9913
      - 127.0.0.1:9914:9914`

const activeCommand = computed(() => installTab.value === 'docker' ? dockerCommand : composeCommand)

const eventTypes = [
  { label: 'Exceptions', color: '#f43f5e' },
  { label: 'Profiler', color: '#8b5cf6' },
  { label: 'VarDump', color: '#ef4444' },
  { label: 'Ray', color: '#06b6d4' },
  { label: 'Emails', color: '#f59e0b' },
  { label: 'Logs', color: '#6b7280' },
  { label: 'HTTP', color: '#22c55e' },
  { label: 'Inspector', color: '#eab308' },
  { label: 'SMS', color: '#a855f7' },
]

const trustBadges = computed(() => [
  t('install.trust.free'),
  t('install.trust.noReg'),
  t('install.trust.noCard'),
  t('install.trust.oss'),
])
</script>

<template>
  <section id="how-it-works" class="py-20 lg:py-28 bg-section-dark">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-16">
        <h2 class="text-section font-bold text-white mb-3 font-sans">
          {{ t('howItWorks.title') }}
        </h2>
        <p class="text-lg text-on-dark-secondary font-sans">
          {{ t('howItWorks.subtitle') }}
        </p>
      </div>

      <!-- Steps -->
      <div class="max-w-5xl mx-auto">
        <!-- Step 1: Run one command -->
        <StepItem
          :number="1"
          :title="t('howItWorks.steps.run.title')"
          :description="t('howItWorks.steps.run.description')"
        >
          <template #code>
            <!-- Docker / Docker Compose tabs -->
            <div class="rounded-xl border border-code-border overflow-hidden">
              <div class="flex gap-1 bg-code-bg px-2 pt-2 border-b border-code-border">
                <button
                  class="px-3 py-1.5 font-mono text-xs transition-colors duration-150 border-b-2 rounded-t-md"
                  :class="installTab === 'docker'
                    ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
                    : 'text-[#6e7681] border-transparent hover:text-code-text'"
                  @click="installTab = 'docker'"
                >
                  {{ t('install.tabs.docker') }}
                </button>
                <button
                  class="px-3 py-1.5 font-mono text-xs transition-colors duration-150 border-b-2 rounded-t-md"
                  :class="installTab === 'compose'
                    ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
                    : 'text-[#6e7681] border-transparent hover:text-code-text'"
                  @click="installTab = 'compose'"
                >
                  {{ t('install.tabs.compose') }}
                </button>
              </div>
              <div class="bg-code-bg p-4">
                <CopyCommand :command="activeCommand" no-bg />
              </div>
            </div>
          </template>
          <template #preview>
            <TerminalMockup />
          </template>
        </StepItem>

        <!-- Step 2: Add one env variable -->
        <StepItem
          :number="2"
          :title="t('howItWorks.steps.connect.title')"
          :description="t('howItWorks.steps.connect.description')"
        >
          <template #code>
            <FrameworkTabs />
          </template>
          <template #preview>
            <div class="rounded-xl overflow-hidden border border-code-border shadow-code-block">
              <div class="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-code-border">
                <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span class="ml-4 font-mono text-xs text-on-dark-muted">.env</span>
              </div>
              <div class="bg-code-bg p-4 font-mono text-xs leading-relaxed">
                <div><span class="text-code-comment"># Buggregator</span></div>
                <div><span class="text-code-keyword">SENTRY_LARAVEL_DSN</span><span class="text-code-text">=</span><span class="text-code-string">http://sentry@127.0.0.1:8000/1</span></div>
                <div><span class="text-code-keyword">VAR_DUMPER_SERVER</span><span class="text-code-text">=</span><span class="text-code-string">127.0.0.1:9912</span></div>
                <div><span class="text-code-keyword">MAIL_HOST</span><span class="text-code-text">=</span><span class="text-code-string">127.0.0.1</span></div>
                <div><span class="text-code-keyword">MAIL_PORT</span><span class="text-code-text">=</span><span class="text-code-string">1025</span></div>
              </div>
            </div>
          </template>
        </StepItem>

        <!-- Step 3: Open your browser -->
        <StepItem
          :number="3"
          :title="t('howItWorks.steps.open.title')"
          :description="t('howItWorks.steps.open.description')"
          :is-last="true"
        >
          <template #code>
            <a
              href="http://127.0.0.1:8000"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 font-mono text-base text-accent hover:text-accent-hover transition-colors no-underline"
            >
              http://127.0.0.1:8000 →
            </a>
          </template>
          <template #preview>
            <BrowserMockup />
          </template>
        </StepItem>
      </div>

      <!-- Trust badges + links -->
      <div class="max-w-5xl mx-auto mt-12 pt-10">
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
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

        <div class="flex flex-wrap justify-center gap-6 mt-6">
          <a
            href="https://docs.buggregator.dev"
            target="_blank"
            rel="noopener"
            class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
          >
            {{ t('install.links.fullGuide') }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
