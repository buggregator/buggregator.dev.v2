<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'
import mock from '~/data/mocks/mock-server.json'

// Same tones as the app's mock badges: method by verb, status by class.
function methodClass(method: string) {
  if (method === 'GET') return 'bg-[rgba(34,197,94,0.15)] text-[#4ade80]'
  if (method === 'POST') return 'bg-[rgba(59,130,246,0.15)] text-[#60a5fa]'
  return 'bg-[rgba(255,255,255,0.08)] text-on-dark-secondary'
}

function statusClass(status: number) {
  if (status >= 500) return 'bg-[rgba(239,68,68,0.15)] text-[#f87171]'
  if (status >= 400) return 'bg-[rgba(245,158,11,0.15)] text-[#fbbf24]'
  return 'bg-[rgba(34,197,94,0.15)] text-[#4ade80]'
}

// «/payments/{id}»: the {param} part in its own colour, as in the app.
function pathParts(path: string) {
  return path.split(/(\{[^}]+\})/).filter(Boolean).map(text => ({ text, param: text.startsWith('{') }))
}
</script>

<template>
  <EventCard type="mock-server" label="Mock Server" time="live">
    <div class="space-y-3">
      <!-- Base URL -->
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <code class="px-2 py-1 rounded bg-code-bg border border-code-border font-mono text-on-dark-secondary">{{ mock.baseUrl }}</code>
        <span class="inline-flex items-center gap-1.5 text-[#4ade80] font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
          Live
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-3">
        <!-- Rules -->
        <section class="rounded-lg border border-landing-border-subtle overflow-hidden" aria-label="Rules">
          <div class="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-landing-border-subtle text-xs">
            <span class="font-semibold text-white">Rules</span>
            <span class="font-mono text-on-dark-muted">{{ mock.rules.length }}</span>
            <span class="ml-auto text-on-dark-muted">first match wins ↓</span>
          </div>
          <ul>
            <li
              v-for="rule in mock.rules"
              :key="rule.order"
              class="flex items-start gap-2.5 px-3 py-2 border-b border-landing-border-subtle last:border-b-0"
            >
              <span class="mt-0.5 w-7 h-4 rounded-full bg-accent-strong relative shrink-0" aria-hidden="true">
                <span class="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="font-mono text-[10px] text-on-dark-muted w-3 shrink-0">{{ rule.order }}</span>
                  <span class="px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px]" :class="methodClass(rule.method)">{{ rule.method }}</span>
                  <span class="font-mono text-xs text-white truncate">
                    <span
                      v-for="(part, i) in pathParts(rule.path)"
                      :key="i"
                      :class="part.param ? 'text-[#c084fc]' : ''"
                    >{{ part.text }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-1.5 mt-1 pl-[18px] text-[11px] text-on-dark-secondary flex-wrap">
                  <span>{{ rule.name }}</span>
                  <span v-if="rule.project" class="px-1 rounded bg-[rgba(255,255,255,0.06)] font-mono text-[10px]">{{ rule.project }}</span>
                  <span v-if="rule.delay" class="px-1 rounded bg-[rgba(255,255,255,0.06)] font-mono text-[10px]">{{ rule.delay }}</span>
                </div>
              </div>
              <div class="text-right shrink-0">
                <span class="px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px]" :class="statusClass(rule.status)">{{ rule.status }}</span>
                <div class="font-mono text-[10px] text-on-dark-muted mt-1">{{ rule.hits }} {{ rule.hits === 1 ? 'hit' : 'hits' }}</div>
              </div>
            </li>
          </ul>
        </section>

        <!-- Live requests -->
        <section class="rounded-lg border border-landing-border-subtle overflow-hidden" aria-label="Requests">
          <div class="flex items-center gap-2 px-3 py-2 bg-[rgba(255,255,255,0.02)] border-b border-landing-border-subtle text-xs">
            <span class="font-semibold text-white">Requests</span>
            <span class="font-mono text-on-dark-muted">{{ mock.requests.length }}</span>
          </div>
          <ul>
            <li
              v-for="(req, i) in mock.requests"
              :key="i"
              class="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_auto_minmax(0,1fr)_auto_minmax(0,9rem)] items-center gap-x-2 gap-y-1 px-3 py-2 border-b border-landing-border-subtle last:border-b-0 text-xs"
            >
              <span class="font-mono text-[10px] text-on-dark-muted">{{ req.time }}</span>
              <span class="px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px]" :class="methodClass(req.method)">{{ req.method }}</span>
              <span class="font-mono text-on-dark-secondary truncate">{{ req.path }}</span>
              <span class="px-1.5 rounded font-mono text-[10px] font-semibold leading-[18px]" :class="statusClass(req.status)">{{ req.status }}</span>
              <span
                class="col-span-4 sm:col-span-1 pl-[3.25rem] sm:pl-0 truncate font-mono text-[11px]"
                :class="req.rule ? 'text-on-dark-secondary' : 'text-[#fbbf24]'"
              >{{ req.rule ? `→ ${req.rule}` : 'no rule matched' }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </EventCard>
</template>
