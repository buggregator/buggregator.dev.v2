<script setup lang="ts">
// OS picker for the binary samples: Linux / macOS or Windows. The install
// script picks the CPU, so there is no second row. The choice is page-wide
// (useBinaryPlatform): picking Windows here switches every sample.
const { t } = useI18n()
const { os } = useBinaryPlatform()

// Under sm the buttons are 44 px tall (touch); above, 32 px with a 44 px hit area.
const chip = 'relative hit-area flex-1 min-h-11 sm:min-h-[32px] px-2.5 font-mono text-[11px] whitespace-nowrap transition-colors duration-150'
const on = 'text-white bg-[rgba(59,130,246,0.18)]'
const off = 'text-[#8b949e] hover:text-code-text'
</script>

<template>
  <div
    class="inline-grid grid-cols-2 rounded-md border border-code-border overflow-hidden divide-x divide-code-border"
    role="group"
    :aria-label="t('install.binary.platform')"
  >
    <button
      v-for="o in BINARY_OSES"
      :key="o.id"
      type="button"
      :class="[chip, os === o.id ? on : off]"
      :aria-pressed="os === o.id"
      @click="os = o.id"
    >
      {{ o.label }}
    </button>
  </div>
</template>
