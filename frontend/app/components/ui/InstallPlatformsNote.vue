<script setup lang="ts">
// «Runs on Windows, macOS and Linux» plus the link to the AI-agent setup
// page. Shown under every install block.
const { t } = useI18n()
const { trackEvent } = useGtag()

// Docs page that walks an AI assistant through the setup.
const AGENT_SETUP_URL = 'https://docs.buggregator.dev/agent-setup.html'
</script>

<template>
  <div class="font-sans text-sm leading-relaxed text-on-dark-secondary">
    <p>{{ t('install.platforms') }}</p>
    <p>
      <a
        :href="AGENT_SETUP_URL"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center min-h-[44px] text-accent hover:text-accent-hover transition-colors no-underline"
        @click="trackEvent('cta_click', { cta_location: 'install_note', cta_text: 'agent_setup' })"
      >
        {{ t('install.agent') }}
      </a>
    </p>
  </div>
</template>
