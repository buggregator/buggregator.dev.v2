<script setup lang="ts">
import StepItem from '~/components/sections/StepsSection/StepItem.vue'
import TerminalMockup from '~/components/sections/StepsSection/TerminalMockup.vue'
import FrameworkTabs from '~/components/sections/StepsSection/FrameworkTabs.vue'
import BrowserMockup from '~/components/sections/StepsSection/BrowserMockup.vue'
import { useGitHubStore } from '~/stores/github'

const { t } = useI18n()
const github = useGitHubStore()

const imageTag = computed(() => {
  const v = github.serverVersion
  return v ? `v${v}` : 'latest'
})

// Step 1: install method tabs
type InstallTab = 'docker' | 'compose'
const installTab = ref<InstallTab>('docker')

const ports = [
  { port: '8000:8000', hint: 'Web UI + Sentry + Ray + Inspector' },
  { port: '1025:1025', hint: 'SMTP — email capture' },
  { port: '9912:9912', hint: 'VarDumper — dump() output' },
  { port: '9913:9913', hint: 'Monolog — application logs' },
  { port: '9914:9914', hint: 'XHProf — performance profiling' },
  { port: '8080:8080', hint: 'HTTP Proxy — outgoing request capture' },
]

const dockerCommand = computed(() => {
  const portArgs = ports.map(p => `-p 127.0.0.1:${p.port}`).join(' \\\n  ')
  return `docker run \\\n  ${portArgs} \\\n  ghcr.io/buggregator/server:${imageTag.value}`
})

const composeCommand = computed(() => {
  const portLines = ports.map(p => `      - 127.0.0.1:${p.port}`).join('\n')
  return `services:\n  buggregator:\n    image: ghcr.io/buggregator/server:${imageTag.value}\n    ports:\n${portLines}`
})

const activeCommand = computed(() => installTab.value === 'docker' ? dockerCommand.value : composeCommand.value)

const copied = ref(false)

async function copyCmd() {
  try {
    await navigator.clipboard.writeText(activeCommand.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}

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
  { label: 'HTTP Proxy', color: '#10b981' },
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
              <div class="bg-code-bg p-4 font-mono text-xs leading-relaxed relative">
                <!-- Docker run with port tooltips -->
                <div v-if="installTab === 'docker'">
                  <div>
                    <span class="text-code-prompt select-none">$ </span>
                    <span class="text-code-text">docker run \</span>
                  </div>
                  <div v-for="(p, i) in ports" :key="p.port" class="pl-6">
                    <span class="text-code-text">-p 127.0.0.1:</span>
                    <span class="port-hint">
                      <span class="text-accent cursor-help border-b border-dashed border-accent/30">{{ p.port }}</span>
                      <span class="port-tooltip">{{ p.hint }}</span>
                    </span>
                    <span class="text-code-text"> \</span>
                  </div>
                  <div class="pl-6">
                    <span class="text-code-string">ghcr.io/buggregator/server:{{ imageTag }}</span>
                  </div>
                </div>

                <!-- Docker Compose with port tooltips -->
                <div v-else>
                  <div><span class="text-code-keyword">services</span><span class="text-code-text">:</span></div>
                  <div class="pl-4"><span class="text-code-keyword">buggregator</span><span class="text-code-text">:</span></div>
                  <div class="pl-8"><span class="text-code-text">image: </span><span class="text-code-string">ghcr.io/buggregator/server:{{ imageTag }}</span></div>
                  <div class="pl-8"><span class="text-code-text">ports:</span></div>
                  <div v-for="p in ports" :key="p.port" class="pl-10">
                    <span class="text-code-text">- 127.0.0.1:</span>
                    <span class="port-hint">
                      <span class="text-accent cursor-help border-b border-dashed border-accent/30">{{ p.port }}</span>
                      <span class="port-tooltip">{{ p.hint }}</span>
                    </span>
                  </div>
                </div>

                <!-- Copy button -->
                <button
                  class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
                  :class="copied
                    ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                    : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted hover:bg-[rgba(255,255,255,0.12)] hover:text-white'"
                  :aria-label="copied ? t('hero.cta.copied') : t('hero.cta.copy')"
                  @click="copyCmd"
                >
                  <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
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
                <div><span class="text-code-keyword">HTTP_PROXY</span><span class="text-code-text">=</span><span class="text-code-string">http://127.0.0.1:8080</span></div>
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

<style scoped>
.port-hint {
  position: relative;
  display: inline;
}

.port-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  border-radius: 6px;
  background: #22262e;
  border: 1px solid #2a2f38;
  color: #8b919a;
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}

.port-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #2a2f38;
}

.port-hint:hover .port-tooltip {
  display: block;
}
</style>
