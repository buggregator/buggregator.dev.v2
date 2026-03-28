<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'

const dumps = [
  {
    label: 'ray()->table()',
    time: '1s ago',
    content: {
      type: 'table',
      headers: ['Key', 'Value'],
      rows: [
        ['name', 'John Doe'],
        ['email', 'john@example.com'],
        ['role', 'admin'],
      ],
    },
  },
  {
    label: 'ray()->measure()',
    time: '3s ago',
    content: {
      type: 'measure',
      name: 'api.users.index',
      duration: '142ms',
      memory: '4.2 MB',
    },
  },
  {
    label: 'ray()->query()',
    time: '5s ago',
    content: {
      type: 'query',
      sql: 'SELECT * FROM users WHERE role = ? LIMIT 10',
      bindings: ['admin'],
      duration: '2.4ms',
    },
  },
]
</script>

<template>
  <div class="space-y-3">
    <!-- Table dump -->
    <EventCard type="ray" :label="dumps[0].label" :time="dumps[0].time">
      <div class="overflow-x-auto">
        <table class="w-full font-mono text-xs">
          <thead>
            <tr class="border-b border-landing-border-subtle">
              <th
                v-for="h in dumps[0].content.headers"
                :key="h"
                class="text-left py-1.5 px-3 text-on-dark-muted font-medium"
              >{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, i) in dumps[0].content.rows"
              :key="i"
              class="border-b border-landing-border-subtle last:border-0"
            >
              <td class="py-1.5 px-3 text-ray font-medium">{{ row[0] }}</td>
              <td class="py-1.5 px-3 text-on-dark-secondary">{{ row[1] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </EventCard>

    <!-- Measure dump -->
    <EventCard type="ray" :label="dumps[1].label" :time="dumps[1].time">
      <div class="flex items-center gap-4 font-mono text-sm">
        <span class="text-on-dark-secondary">{{ dumps[1].content.name }}</span>
        <span class="px-2 py-0.5 rounded bg-[rgba(6,182,212,0.15)] text-ray text-xs font-semibold">{{ dumps[1].content.duration }}</span>
        <span class="text-on-dark-muted text-xs">{{ dumps[1].content.memory }}</span>
      </div>
    </EventCard>

    <!-- Query dump -->
    <EventCard type="ray" :label="dumps[2].label" :time="dumps[2].time">
      <div class="bg-code-bg rounded p-3 font-mono text-xs overflow-x-auto">
        <div class="text-code-text">{{ dumps[2].content.sql }}</div>
        <div class="mt-1 text-on-dark-muted">
          Bindings: <span class="text-code-string">{{ dumps[2].content.bindings.join(', ') }}</span>
          · <span class="text-ray">{{ dumps[2].content.duration }}</span>
        </div>
      </div>
    </EventCard>
  </div>
</template>
