<script setup lang="ts">
const { t } = useI18n()

const cloudSteps = [
  'Create an account',
  'Verify your email',
  'Create an organization',
  'Create a project',
  'Choose your platform / SDK',
  'Copy DSN or credentials',
  'Paste into your .env',
  'Wait for first event to arrive',
]

const bgSteps = [
  'Add to docker-compose.yml',
  'Change your .env',
]
</script>

<template>
  <div class="rounded-2xl bg-[#f3f4f6] p-8 lg:p-12">
    <!-- Header -->
    <div class="text-center mb-10">
      <h3 class="text-2xl font-bold text-on-light-primary mb-2 font-sans">
        {{ t('cleanApp.devEnv.headline') }}
      </h3>
      <p class="text-base text-on-light-muted font-sans">
        {{ t('cleanApp.devEnv.subheadline') }}
      </p>
    </div>

    <p class="text-sm text-on-light-secondary leading-relaxed max-w-2xl mx-auto text-center mb-10 font-sans">
      {{ t('cleanApp.devEnv.body') }}
    </p>

    <!-- Two-column setup comparison -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <!-- Cloud setup (long) -->
      <div class="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <p class="text-[10px] font-mono text-[#fb7185] uppercase tracking-wider font-semibold mb-4">
          {{ t('cleanApp.devEnv.cloudSetup.label') }}
        </p>
        <ol class="space-y-2">
          <li
            v-for="(step, i) in cloudSteps"
            :key="i"
            class="flex items-start gap-3 text-sm font-sans"
          >
            <span class="text-on-light-muted font-mono text-xs mt-0.5 w-5 shrink-0">{{ i + 1 }}.</span>
            <span class="text-on-light-secondary">{{ step }}</span>
          </li>
        </ol>
        <p class="mt-4 text-sm font-semibold text-[#fb7185] font-sans">
          {{ t('cleanApp.devEnv.cloudSetup.footer') }}
        </p>
      </div>

      <!-- Buggregator setup (short) -->
      <div class="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <p class="text-[10px] font-mono text-[#4ade80] uppercase tracking-wider font-semibold mb-4">
          {{ t('cleanApp.devEnv.buggregatorSetup.label') }}
        </p>
        <ol class="space-y-2">
          <li
            v-for="(step, i) in bgSteps"
            :key="i"
            class="flex items-start gap-3 text-sm font-sans"
          >
            <span class="text-on-light-muted font-mono text-xs mt-0.5 w-5 shrink-0">{{ i + 1 }}.</span>
            <span class="text-on-light-secondary">{{ step }}</span>
          </li>
        </ol>
        <p class="mt-4 text-sm font-semibold text-[#4ade80] font-sans">
          {{ t('cleanApp.devEnv.buggregatorSetup.footer') }}
        </p>
      </div>
    </div>

    <!-- Privacy pill -->
    <div class="flex justify-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#16a34a] font-sans"
           style="background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        {{ t('cleanApp.devEnv.privacy') }}
      </div>
    </div>
  </div>
</template>
