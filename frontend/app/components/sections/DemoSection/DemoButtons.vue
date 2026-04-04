<script setup lang="ts">
const { t } = useI18n()

const activeAction = ref<string | null>(null)

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (l) => `_${l.toLowerCase()}`).slice(1)

const buildCall = (section: string, group: string, action: string) => {
  const prefix = group !== 'common' ? `${section}_${group}` : section
  return `${prefix}:${camelToSnakeCase(action)}`
}

const callAction = async (section: string, group: string, action: string) => {
  const call = buildCall(section, group, action)
  activeAction.value = call
  setTimeout(() => { activeAction.value = null }, 600)

  await $fetch('/api/demo/call', {
    method: 'POST',
    body: { action: call },
  }).catch(() => {})
}

interface Section {
  key: string
  title: string
  color: string
  docs: string
  actions: string[]
  group?: string
}

const primarySections: Section[] = [
  {
    key: 'sentry', title: 'Sentry Exceptions', color: '#f43f5e',
    docs: 'https://docs.buggregator.dev/config/sentry.html',
    actions: ['Report', 'DatabaseError', 'ModelNotFound', 'TypeError'],
  },
  {
    key: 'profiler', title: 'XHProf Profiler', color: '#8b5cf6',
    docs: 'https://docs.buggregator.dev/config/xhprof.html',
    actions: ['Report'],
  },
  {
    key: 'smtp', title: 'SMTP Email', color: '#f59e0b',
    docs: 'https://docs.buggregator.dev/config/smtp.html',
    actions: ['WelcomeMail', 'OrderShipped', 'PasswordReset', 'Invoice'],
  },
  {
    key: 'sms', title: 'SMS Gateway', color: '#a855f7',
    docs: 'https://docs.buggregator.dev/config/sms.html',
    actions: ['Twilio', 'Vonage', 'Plivo', 'Sinch', 'Infobip'],
  },
  {
    key: 'var_dump', title: 'Var Dumper', color: '#ef4444',
    docs: 'https://docs.buggregator.dev/config/var-dumper.html',
    actions: ['String', 'Array', 'Object', 'Exception'],
  },
  {
    key: 'monolog', title: 'Monolog Logs', color: '#6b7280',
    docs: 'https://docs.buggregator.dev/config/monolog.html',
    actions: ['Debug', 'Info', 'Warning', 'Error', 'Critical', 'Exception'],
  },
  {
    key: 'http', title: 'HTTP Requests', color: '#22c55e',
    docs: 'https://docs.buggregator.dev/config/http-dumps.html',
    actions: ['Get', 'Post', 'Put', 'Delete'],
  },
  {
    key: 'http_proxy', title: 'HTTP Proxy', color: '#10b981',
    docs: 'https://docs.buggregator.dev/config/http-proxy.html',
    actions: ['Get', 'Post', 'Put', 'Delete', 'Headers', 'StatusCodes', 'JsonApi'],
  },
]

const secondarySections: Section[] = [
  {
    key: 'inspector', title: 'Inspector', color: '#eab308',
    docs: 'https://docs.buggregator.dev/config/inspector.html',
    actions: ['Request', 'Command', 'Transaction'],
  },
  {
    key: 'ray', title: 'Ray', color: '#06b6d4',
    docs: 'https://docs.buggregator.dev/config/ray.html',
    actions: ['String', 'Array', 'Table', 'Json', 'Measure', 'Exception'],
  },
]
</script>

<template>
  <div class="space-y-6 py-4">
    <!-- Primary sections -->
    <div v-for="section in primarySections" :key="section.key" class="space-y-2">
      <div class="flex items-center gap-2 pb-1.5 border-b border-landing-border-subtle">
        <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: section.color }" />
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-on-dark-muted">
          {{ section.title }}
        </span>
        <a
          :href="section.docs"
          target="_blank"
          rel="noopener"
          class="ml-auto text-[11px] font-mono text-accent hover:text-accent-hover transition-colors no-underline"
        >
          {{ t('demo.docs') }}
        </a>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="action in section.actions"
          :key="action"
          class="demo-btn"
          :class="{ 'demo-btn--active': activeAction === buildCall(section.key, 'common', action) }"
          @click="callAction(section.key, section.group || 'common', action)"
        >
          {{ action }}
        </button>
      </div>
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-3 py-2">
      <div class="flex-1 border-t border-landing-border-subtle" />
      <span class="text-[10px] font-mono uppercase tracking-[0.08em] text-on-dark-muted">
        {{ t('demo.more') }}
      </span>
      <div class="flex-1 border-t border-landing-border-subtle" />
    </div>

    <!-- Secondary sections -->
    <div v-for="section in secondarySections" :key="section.key" class="space-y-2">
      <div class="flex items-center gap-2 pb-1.5 border-b border-landing-border-subtle">
        <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: section.color }" />
        <span class="text-[11px] font-mono font-semibold uppercase tracking-[0.08em] text-on-dark-muted">
          {{ section.title }}
        </span>
        <a
          :href="section.docs"
          target="_blank"
          rel="noopener"
          class="ml-auto text-[11px] font-mono text-accent hover:text-accent-hover transition-colors no-underline"
        >
          {{ t('demo.docs') }}
        </a>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="action in section.actions"
          :key="action"
          class="demo-btn"
          :class="{ 'demo-btn--active': activeAction === buildCall(section.key, 'common', action) }"
          @click="callAction(section.key, 'common', action)"
        >
          {{ action }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-btn {
  @apply inline-flex items-center px-3 py-1 rounded-md font-mono text-xs cursor-pointer transition-all duration-150;
  border: 1px solid #2a2f38;
  background: transparent;
  color: #8b919a;
}

.demo-btn:hover {
  border-color: #3b82f6;
  color: #e8eaed;
  background: rgba(59, 130, 246, 0.08);
}

.demo-btn:active {
  transform: scale(0.96);
  background: rgba(59, 130, 246, 0.15);
}

.demo-btn--active {
  border-color: #3b82f6;
  color: #e8eaed;
  background: rgba(59, 130, 246, 0.15);
}
</style>
