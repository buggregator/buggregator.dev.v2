<script setup lang="ts">
const props = defineProps<{
  type: 'sentry' | 'profiler' | 'smtp' | 'monolog' | 'http-dump' | 'ray' | 'inspector' | 'sms' | 'var-dump'
  label: string
  time: string
  noBorder?: boolean
}>()

const colorMap: Record<string, string> = {
  sentry: '#f43f5e',
  profiler: '#8b5cf6',
  smtp: '#f59e0b',
  monolog: '#6b7280',
  'http-dump': '#22c55e',
  ray: '#06b6d4',
  inspector: '#eab308',
  sms: '#a855f7',
  'var-dump': '#ef4444',
}
</script>

<template>
  <div
    class="overflow-hidden bg-[#0f1117]"
    :class="!props.noBorder && 'border-l-[3px]'"
    :style="!props.noBorder ? { borderLeftColor: colorMap[type] } : {}"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-[#0a0c10] border-b border-landing-border-subtle">
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
          :style="{ background: `${colorMap[type]}20`, color: colorMap[type] }"
        >
          <span class="w-1.5 h-1.5 rounded-full" :style="{ background: colorMap[type] }" />
          {{ label }}
        </span>
      </div>
      <span class="font-mono text-xs text-on-dark-muted">{{ time }}</span>
    </div>

    <!-- Content -->
    <div class="px-4 py-3">
      <slot />
    </div>
  </div>
</template>
