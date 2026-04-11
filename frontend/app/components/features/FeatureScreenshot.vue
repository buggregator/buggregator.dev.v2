<script setup lang="ts">
defineProps<{
  caption?: string
  alt: string
  src?: string
}>()
</script>

<template>
  <div class="max-w-[1000px] mx-auto">
    <!-- Browser chrome -->
    <div class="rounded-xl overflow-hidden border border-landing-border-subtle shadow-showcase">
      <div class="flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-code-border">
        <span class="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span class="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span class="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span class="ml-4 font-mono text-xs text-on-dark-muted">127.0.0.1:8000</span>
      </div>

      <!-- Screenshot or placeholder -->
      <div class="bg-landing-surface">
        <img
          v-if="src"
          :src="src"
          :alt="alt"
          class="w-full block"
          loading="lazy"
        />
        <div v-else class="flex items-center justify-center py-32 lg:py-48">
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-3 text-on-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="font-mono text-xs text-on-dark-muted">{{ alt }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Caption -->
    <p v-if="caption" class="text-center font-sans text-sm text-on-dark-muted mt-4">
      {{ caption }}
    </p>
  </div>
</template>
