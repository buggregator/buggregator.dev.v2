<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="lg:hidden bg-section-mid py-12 px-6">
    <div class="max-w-sm mx-auto text-center">
      <svg class="w-12 h-12 text-on-dark-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <h3 class="text-lg font-semibold text-white mb-2 font-sans">
        {{ t('demo.mobileTitle') }}
      </h3>
      <p class="text-sm text-on-dark-muted leading-relaxed font-sans">
        {{ t('demo.mobileBody') }}
      </p>
    </div>
  </div>
</template>
