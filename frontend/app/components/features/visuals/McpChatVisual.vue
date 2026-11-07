<script setup lang="ts">
import data from '~/data/mocks/mcp-chat-feature.json'
</script>

<template>
  <div class="space-y-3 font-sans text-sm">
    <!-- The person's question -->
    <div class="flex justify-end">
      <p class="max-w-[85%] rounded-2xl rounded-br-md bg-landing-elevated border border-landing-border px-4 py-2.5 text-white">
        {{ data.question }}
      </p>
    </div>

    <!-- Tool calls the assistant made over MCP -->
    <ol class="space-y-2">
      <li
        v-for="(call, i) in data.calls"
        :key="i"
        class="min-w-0 rounded-lg border border-landing-border-subtle overflow-hidden"
      >
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2 border-b border-landing-border-subtle bg-[rgba(255,255,255,0.02)] font-mono text-xs">
          <span class="px-1.5 rounded text-[10px] font-semibold leading-[18px] bg-[rgba(20,184,166,0.15)] text-[#5eead4]">MCP</span>
          <span class="text-white font-semibold">{{ call.tool }}</span>
          <span class="min-w-0 text-on-dark-secondary [overflow-wrap:anywhere]">{{ call.args }}</span>
        </div>
        <pre class="px-3 py-2 font-mono text-xs text-[var(--code-text)] whitespace-pre-wrap [overflow-wrap:anywhere]">{{ call.result }}</pre>
      </li>
    </ol>

    <!-- The assistant's answer -->
    <div class="flex">
      <p class="max-w-[85%] rounded-2xl rounded-bl-md border border-landing-border-subtle px-4 py-2.5 text-on-dark-secondary">
        {{ data.answer }}
      </p>
    </div>
  </div>
</template>
