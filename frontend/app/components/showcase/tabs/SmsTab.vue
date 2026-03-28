<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'

const messages = [
  {
    provider: 'Twilio',
    from: '+1 (555) 123-4567',
    to: '+1 (555) 987-6543',
    body: 'Your verification code is: 847291. It expires in 5 minutes.',
    time: '2s ago',
  },
  {
    provider: 'Vonage',
    from: 'MyApp',
    to: '+44 7700 900123',
    body: 'Your order #4821 has been shipped. Track: https://track.example.com/4821',
    time: '15s ago',
  },
  {
    provider: 'Symfony Notifier',
    from: 'AppNotifier',
    to: '+49 170 1234567',
    body: 'Alert: Server CPU usage exceeded 90% for the last 5 minutes.',
    time: '1m ago',
  },
]
</script>

<template>
  <div class="space-y-3">
    <EventCard
      v-for="(msg, i) in messages"
      :key="i"
      type="sms"
      :label="msg.provider"
      :time="msg.time"
    >
      <div class="space-y-2">
        <div class="flex items-start gap-2">
          <span class="font-mono text-xs text-on-dark-muted shrink-0 w-10">From:</span>
          <span class="font-mono text-xs text-on-dark-secondary">{{ msg.from }}</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono text-xs text-on-dark-muted shrink-0 w-10">To:</span>
          <span class="font-mono text-xs text-on-dark-secondary">{{ msg.to }}</span>
        </div>
        <div class="mt-1 rounded bg-[rgba(0,0,0,0.2)] border border-landing-border-subtle p-3">
          <p class="text-sm text-on-dark-secondary leading-relaxed font-sans">{{ msg.body }}</p>
        </div>
      </div>
    </EventCard>
  </div>
</template>
