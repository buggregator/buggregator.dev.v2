<script setup lang="ts">
import { useGitHubStore } from '~/stores/github'

const github = useGitHubStore()
const imageTag = computed(() => {
  const v = github.serverVersion
  return v ? `v${v}` : 'latest'
})
</script>

<template>
  <div class="rounded-xl overflow-hidden border border-code-border shadow-code-block">
    <!-- Title bar -->
    <div class="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-code-border">
      <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
      <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
      <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
      <span class="ml-4 font-mono text-xs text-on-dark-muted">Terminal</span>
    </div>

    <!-- Content -->
    <div class="bg-code-bg p-4 font-mono text-xs leading-relaxed">
      <div class="text-on-dark-muted">
        <span class="text-code-prompt">$</span>
        <span class="text-code-text"> docker run ghcr.io/buggregator/server:{{ imageTag }}</span>
      </div>
      <div class="mt-2 text-code-prompt">✓ <span class="text-on-dark-muted">Pulling image...</span></div>
      <div class="text-code-prompt">✓ <span class="text-on-dark-muted">Starting server on :8000</span></div>
      <div class="text-code-prompt">✓ <span class="text-on-dark-muted">SMTP server on :1025</span></div>
      <div class="text-code-prompt">✓ <span class="text-on-dark-muted">VarDumper on :9912</span></div>
      <div class="mt-2 text-on-dark-muted">Listening for events...</div>
    </div>
  </div>
</template>
