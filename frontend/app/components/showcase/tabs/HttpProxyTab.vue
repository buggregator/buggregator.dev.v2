<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'
import proxyData from '~/data/mocks/http-dump-proxy.json'

const activePanel = ref<'request' | 'response'>('response')
</script>

<template>
  <EventCard type="http-dump" label="HTTP Proxy" time="1s ago">
    <div class="space-y-3">
      <!-- Request line + status -->
      <div class="flex items-center gap-2 flex-wrap">
        <span class="px-2 py-0.5 rounded text-xs font-bold font-mono bg-[rgba(34,197,94,0.15)] text-[#4ade80]">
          {{ proxyData.method }}
        </span>
        <span class="font-mono text-sm text-on-dark-secondary truncate">
          https://{{ proxyData.host }}{{ proxyData.uri }}
        </span>
        <span class="px-2 py-0.5 rounded text-xs font-bold font-mono bg-[rgba(34,197,94,0.15)] text-[#4ade80]">
          {{ proxyData.response.statusCode }}
        </span>
        <span class="font-mono text-xs text-on-dark-muted">{{ proxyData.durationMs }}ms</span>
        <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[rgba(168,85,247,0.15)] text-[#c084fc]">
          proxy
        </span>
      </div>

      <!-- Request / Response toggle -->
      <div class="flex gap-1 bg-[rgba(255,255,255,0.03)] rounded-lg p-0.5 w-fit">
        <button
          class="px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150"
          :class="activePanel === 'request'
            ? 'bg-[rgba(255,255,255,0.08)] text-white'
            : 'text-on-dark-muted hover:text-on-dark-secondary'"
          @click="activePanel = 'request'"
        >
          Request
        </button>
        <button
          class="px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150"
          :class="activePanel === 'response'
            ? 'bg-[rgba(255,255,255,0.08)] text-white'
            : 'text-on-dark-muted hover:text-on-dark-secondary'"
          @click="activePanel = 'response'"
        >
          Response
        </button>
      </div>

      <!-- Request panel -->
      <div v-if="activePanel === 'request'" class="space-y-3">
        <div class="bg-code-bg border border-code-border p-3 font-mono text-xs overflow-x-auto">
          <div class="text-on-dark-muted">Host: <span class="text-code-string">{{ proxyData.host }}</span></div>
          <div v-for="(value, key) in proxyData.headers" :key="key" class="text-on-dark-muted">
            {{ key }}: <span class="text-code-string">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- Response panel -->
      <div v-else class="space-y-3">
        <div class="bg-code-bg border border-code-border p-3 font-mono text-xs overflow-x-auto">
          <div v-for="(value, key) in proxyData.response.headers" :key="key" class="text-on-dark-muted">
            {{ key }}: <span class="text-code-string">{{ value }}</span>
          </div>
        </div>
        <div class="bg-code-bg border border-code-border p-3 font-mono text-xs overflow-x-auto">
          <pre class="text-code-text whitespace-pre">{{ proxyData.response.body }}</pre>
        </div>
      </div>
    </div>
  </EventCard>
</template>
