<script setup lang="ts">
const props = defineProps<{
  caption?: string
  alt: string
  src?: string
  width?: number
  height?: number
}>()

// Intrinsic sizes of the shots in public/features/: the browser reserves the
// space before the image loads (no layout shift). Pages pass only `src`.
const KNOWN_SIZES: Record<string, [number, number]> = {
  '/features/email-testing.png': [1317, 931],
  '/features/http-proxy.png': [1317, 989],
  '/features/profiler.png': [1317, 931],
  '/features/sentry.png': [1317, 931],
  '/features/sms.png': [1317, 931],
}

const size = computed(() => {
  const known = props.src ? KNOWN_SIZES[props.src] : undefined
  return { width: props.width ?? known?.[0], height: props.height ?? known?.[1] }
})

// Every PNG shot has a WebP twin next to it.
const webpSrc = computed(() => (props.src?.endsWith('.png') ? props.src.replace(/\.png$/, '.webp') : undefined))
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
        <picture v-if="src">
          <source v-if="webpSrc" type="image/webp" :srcset="webpSrc" />
          <img
            :src="src"
            :alt="alt"
            :width="size.width"
            :height="size.height"
            class="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />
        </picture>
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
