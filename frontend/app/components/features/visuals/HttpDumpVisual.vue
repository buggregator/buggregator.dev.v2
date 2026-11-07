<script setup lang="ts">
import dump from '~/data/mocks/http-dump-feature.json'

const query = new URLSearchParams(dump.query).toString()
</script>

<template>
  <div class="space-y-3 font-mono text-xs">
    <!-- Request line -->
    <div class="flex items-center gap-2 flex-wrap">
      <span class="px-2 py-0.5 rounded font-bold bg-[rgba(34,197,94,0.15)] text-[#4ade80]">{{ dump.method }}</span>
      <span class="text-sm text-on-dark-secondary [overflow-wrap:anywhere]">{{ dump.host }}{{ dump.uri }}?{{ query }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <!-- Headers and cookies -->
      <section class="rounded-lg border border-landing-border-subtle overflow-hidden min-w-0">
        <h4 class="px-3 py-2 border-b border-landing-border-subtle bg-[rgba(255,255,255,0.02)] font-sans text-xs font-semibold text-white">Headers</h4>
        <dl class="p-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <template v-for="(value, key) in dump.headers" :key="key">
            <dt class="text-on-dark-muted">{{ key }}</dt>
            <dd class="text-[var(--code-string)] [overflow-wrap:anywhere]">{{ value }}</dd>
          </template>
          <template v-for="(value, key) in dump.cookies" :key="`c-${key}`">
            <dt class="text-on-dark-muted">Cookie: {{ key }}</dt>
            <dd class="text-[var(--code-string)]">{{ value }}</dd>
          </template>
        </dl>
      </section>

      <!-- Form data and files -->
      <section class="rounded-lg border border-landing-border-subtle overflow-hidden min-w-0">
        <h4 class="px-3 py-2 border-b border-landing-border-subtle bg-[rgba(255,255,255,0.02)] font-sans text-xs font-semibold text-white">POST data</h4>
        <dl class="p-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <template v-for="(value, key) in dump.post" :key="key">
            <dt class="text-on-dark-muted">{{ key }}</dt>
            <dd class="text-[var(--code-text)]">{{ value }}</dd>
          </template>
        </dl>
        <h4 class="px-3 py-2 border-y border-landing-border-subtle bg-[rgba(255,255,255,0.02)] font-sans text-xs font-semibold text-white">Files</h4>
        <ul class="p-3 space-y-1">
          <li v-for="file in dump.files" :key="file.name" class="flex items-center gap-2">
            <span aria-hidden="true">&#x1F4CE;</span>
            <span class="text-on-dark-secondary">{{ file.name }}</span>
            <span class="text-on-dark-muted">{{ file.type }} · {{ file.size }}</span>
            <span class="ml-auto text-on-dark-muted underline">Download</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- cURL -->
    <section class="rounded-lg border border-landing-border-subtle overflow-hidden">
      <h4 class="px-3 py-2 border-b border-landing-border-subtle bg-[rgba(255,255,255,0.02)] font-sans text-xs font-semibold text-white">cURL</h4>
      <pre class="p-3 bg-[var(--code-bg)] text-[var(--code-text)] whitespace-pre-wrap [overflow-wrap:anywhere] sm:whitespace-pre sm:[overflow-wrap:normal] overflow-x-auto">{{ dump.curl }}</pre>
    </section>
  </div>
</template>
