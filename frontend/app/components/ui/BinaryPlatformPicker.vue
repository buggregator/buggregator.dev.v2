<script setup lang="ts">
// Platform buttons for the binary samples. The choice is page-wide
// (useBinaryPlatform): picking macOS here switches every sample.
const { t } = useI18n()
const { selected, platforms } = useBinaryPlatform()
</script>

<template>
  <div class="flex flex-wrap gap-x-1.5 gap-y-3" role="group" :aria-label="t('install.binary.platform')">
    <button
      v-for="p in platforms"
      :key="p.id"
      type="button"
      class="relative hit-area min-h-[32px] px-2.5 rounded-md font-mono text-[11px] border transition-colors duration-150"
      :class="selected === p.id
        ? 'text-white border-accent bg-[rgba(59,130,246,0.14)]'
        : 'text-[#8b949e] border-code-border hover:text-code-text hover:border-[rgba(255,255,255,0.2)]'"
      :aria-pressed="selected === p.id"
      @click="selected = p.id"
    >
      {{ p.label }}
    </button>
  </div>
</template>
