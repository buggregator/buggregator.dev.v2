<script setup lang="ts">
const cards = [
  {
    type: 'sentry',
    color: '#f43f5e',
    label: 'Exception',
    content: 'AuthenticationException',
    time: '2s ago',
    delay: '0s',
  },
  {
    type: 'smtp',
    color: '#f59e0b',
    label: 'Email',
    content: 'Welcome email · user@example.com',
    time: '5s ago',
    delay: '0.6s',
  },
  {
    type: 'ray',
    color: '#06b6d4',
    label: 'Ray',
    content: 'ray()->table() · User model',
    time: '8s ago',
    delay: '1.2s',
  },
  {
    type: 'sms',
    color: '#a855f7',
    label: 'SMS',
    content: 'Twilio · OTP code sent to +1 555-987',
    time: '10s ago',
    delay: '1.8s',
  },
  {
    type: 'profiler',
    color: '#8b5cf6',
    label: 'Profiler',
    content: 'XHProf · 891ms wall time',
    time: '12s ago',
    delay: '2.4s',
  },
]
</script>

<template>
  <div class="relative w-full max-w-md mx-auto">
    <div class="flex flex-col gap-3">
      <div
        v-for="card in cards"
        :key="card.type"
        class="hero-card rounded-lg bg-landing-surface border border-landing-border-subtle p-3 pl-4"
        :style="{
          borderLeft: `3px solid ${card.color}`,
          animationDelay: card.delay,
        }"
      >
        <div class="flex items-center justify-between mb-1.5">
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
            :style="{ background: `${card.color}20`, color: card.color }"
          >
            <span class="w-1.5 h-1.5 rounded-full" :style="{ background: card.color }" />
            {{ card.label }}
          </span>
          <span class="font-mono text-xs text-on-dark-muted">{{ card.time }}</span>
        </div>
        <p class="font-mono text-sm text-on-dark-secondary truncate">{{ card.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-card {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUpFade 400ms ease-out both;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
