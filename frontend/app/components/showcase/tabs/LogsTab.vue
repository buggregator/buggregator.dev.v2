<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'
import logEvents from '~/data/mocks/monolog-events.json'
</script>

<template>
  <div class="space-y-2">
    <EventCard
      v-for="(log, i) in logEvents"
      :key="i"
      type="monolog"
      :label="log.level"
      :time="log.time"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-mono text-sm text-on-dark-secondary">{{ log.message }}</span>
        <span class="font-mono text-xs text-on-dark-muted">· {{ log.context }}</span>
      </div>
    </EventCard>
  </div>
</template>
