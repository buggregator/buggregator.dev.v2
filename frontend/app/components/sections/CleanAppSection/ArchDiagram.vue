<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- LEFT: With Telescope -->
    <div class="rounded-xl bg-code-bg border border-code-border p-5 font-mono text-xs leading-relaxed">
      <p class="text-on-dark-muted mb-3 text-[10px] uppercase tracking-wider font-semibold">With Telescope or Ray</p>
      <div class="text-code-text">
        <div>your-laravel-app/</div>
        <div class="pl-4">├── app/</div>
        <div class="pl-4"><span class="text-[#fb7185]">├── telescope/</span> <span class="text-on-dark-muted">← added to your app</span></div>
        <div class="pl-4">├── Providers/</div>
        <div class="pl-8"><span class="text-[#fb7185]">└── TelescopeServiceProvider</span></div>
        <div class="pl-4">└── database/migrations/</div>
        <div class="pl-8"><span class="text-[#fb7185]">└── 2024_..._telescope</span> <span class="text-on-dark-muted">← migration</span></div>
      </div>
    </div>

    <!-- RIGHT: With Buggregator -->
    <div class="rounded-xl bg-code-bg border border-code-border p-5 font-mono text-xs leading-relaxed">
      <p class="text-on-dark-muted mb-3 text-[10px] uppercase tracking-wider font-semibold">With Buggregator</p>
      <div class="text-code-text">
        <div class="flex items-center gap-3">
          <div class="border border-code-border rounded px-3 py-2">
            <div class="text-[#4ade80]">your-app/</div>
            <div class="text-on-dark-muted text-[10px]">(unchanged)</div>
          </div>
          <span class="text-accent text-lg">→</span>
          <div class="border border-accent/30 rounded px-3 py-2 bg-accent/5">
            <div class="text-accent">buggregator</div>
            <div class="text-on-dark-muted text-[10px]">:8000</div>
          </div>
        </div>
        <div class="mt-3 text-[#4ade80] text-[10px]">↑ Zero changes in your code. Only .env.</div>
      </div>
    </div>
  </div>
</template>
