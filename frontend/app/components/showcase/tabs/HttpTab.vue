<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'
import httpData from '~/data/mocks/http-dump.json'
</script>

<template>
  <EventCard type="http-dump" label="HTTP Dump" time="3s ago">
    <div class="space-y-3">
      <!-- Request line -->
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded text-xs font-bold font-mono bg-[rgba(34,197,94,0.15)] text-[#4ade80]">
          {{ httpData.method }}
        </span>
        <span class="font-mono text-sm text-on-dark-secondary">{{ httpData.uri }}</span>
        <span class="font-mono text-xs text-on-dark-muted">{{ httpData.httpVersion }}</span>
      </div>

      <!-- Headers -->
      <div class="bg-code-bg border border-code-border p-3 font-mono text-xs overflow-x-auto">
        <div class="text-on-dark-muted">Host: <span class="text-code-string">{{ httpData.host }}</span></div>
        <div v-for="(value, key) in httpData.headers" :key="key" class="text-on-dark-muted">
          {{ key }}: <span class="text-code-string">{{ value }}</span>
        </div>
      </div>

      <!-- Body -->
      <div class="bg-code-bg border border-code-border p-3 font-mono text-xs overflow-x-auto">
        <pre class="text-code-text whitespace-pre">{{ httpData.body }}</pre>
      </div>

      <!-- cURL button (decorative) -->
      <button
        class="px-3 py-1.5 rounded-md text-xs font-medium bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted cursor-default"
        disabled
      >
        cURL
      </button>
    </div>
  </EventCard>
</template>
