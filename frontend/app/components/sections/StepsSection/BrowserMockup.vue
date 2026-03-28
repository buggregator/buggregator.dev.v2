<template>
  <div class="rounded-xl overflow-hidden border border-[#e5e7eb] shadow-card">
    <!-- Browser chrome -->
    <div class="flex items-center gap-2 px-4 py-2.5 bg-[#f3f4f6] border-b border-[#e5e7eb]">
      <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
      <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
      <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
      <div class="ml-4 flex-1 bg-white rounded-md px-3 py-1 border border-[#e5e7eb]">
        <span class="font-mono text-xs text-[#6b7280]">127.0.0.1:8000</span>
      </div>
    </div>

    <!-- Content: simplified Buggregator UI -->
    <div class="bg-landing-deepest flex min-h-[160px]">
      <!-- Sidebar -->
      <div class="w-12 border-r border-landing-border-subtle flex flex-col items-center pt-3 gap-2.5">
        <div class="w-6 h-6 rounded bg-sentry/20 flex items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-sentry" />
        </div>
        <div class="w-6 h-6 rounded bg-profiler/20 flex items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-profiler" />
        </div>
        <div class="w-6 h-6 rounded bg-smtp/20 flex items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-smtp" />
        </div>
        <div class="w-6 h-6 rounded bg-monolog/20 flex items-center justify-center">
          <span class="w-2 h-2 rounded-full bg-monolog" />
        </div>
      </div>

      <!-- Main area -->
      <div class="flex-1 flex items-center justify-center p-4">
        <p class="font-mono text-xs text-on-dark-muted">Waiting for events...</p>
      </div>
    </div>
  </div>
</template>
