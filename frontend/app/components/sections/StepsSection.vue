<script setup lang="ts">
import CopyCommand from '~/components/ui/CopyCommand.vue'
import StepItem from '~/components/sections/StepsSection/StepItem.vue'
import TerminalMockup from '~/components/sections/StepsSection/TerminalMockup.vue'
import FrameworkTabs from '~/components/sections/StepsSection/FrameworkTabs.vue'
import BrowserMockup from '~/components/sections/StepsSection/BrowserMockup.vue'

const { t } = useI18n()

const dockerCommand = `docker run --pull always \\
  -p 127.0.0.1:8000:8000 \\
  -p 127.0.0.1:1025:1025 \\
  -p 127.0.0.1:9912:9912 \\
  ghcr.io/buggregator/server:latest`

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
      <div class="max-w-4xl mx-auto">
        <!-- Step 1: Run one command -->
        <StepItem
          :number="1"
          :title="t('howItWorks.steps.run.title')"
          :description="t('howItWorks.steps.run.description')"
        >
          <template #code>
            <CopyCommand :command="dockerCommand" />
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
            <!-- Code editor mockup -->
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

        <!-- Step 4: See everything -->
        <StepItem
          :number="4"
          :title="t('howItWorks.steps.everything.title')"
          :description="t('howItWorks.steps.everything.description')"
          :is-last="true"
        >
          <template #code>
            <div class="flex flex-wrap gap-3 mt-2">
              <span
                v-for="evt in eventTypes"
                :key="evt.label"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium font-sans"
                :style="{ background: `${evt.color}15`, color: evt.color }"
              >
                <span class="w-2 h-2 rounded-full" :style="{ background: evt.color }" />
                {{ evt.label }}
              </span>
            </div>
          </template>
          <template #preview>
            <!-- Mini event list mockup -->
            <div class="space-y-2">
              <div
                v-for="(evt, i) in eventTypes.slice(0, 4)"
                :key="i"
                class="rounded-lg bg-landing-surface border border-landing-border-subtle p-3"
                :style="{ borderLeft: `3px solid ${evt.color}` }"
              >
                <div class="flex items-center justify-between">
                  <span
                    class="text-xs font-semibold px-2 py-0.5 rounded"
                    :style="{ background: `${evt.color}20`, color: evt.color }"
                  >{{ evt.label }}</span>
                  <span class="font-mono text-xs text-on-dark-muted">just now</span>
                </div>
              </div>
            </div>
          </template>
        </StepItem>
      </div>
    </div>
  </section>
</template>
