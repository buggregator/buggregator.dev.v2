<script setup lang="ts">
// Platform picker for the binary samples: the OS first, then the build
// (Linux and macOS only). The choice is page-wide (useBinaryPlatform):
// picking macOS here switches every sample.
const { t } = useI18n()
const { selected, platform, archOptions, selectOs } = useBinaryPlatform()

// Under sm the buttons are 44 px tall (touch); above, 32 px with a 44 px hit area.
const chip = 'relative hit-area min-h-11 sm:min-h-[32px] px-2.5 font-mono text-[11px] transition-colors duration-150'
const on = 'text-white bg-[rgba(59,130,246,0.18)]'
const off = 'text-[#8b949e] hover:text-code-text'
</script>

<template>
  <div class="flex flex-col items-start gap-2" role="group" :aria-label="t('install.binary.platform')">
    <div class="inline-flex rounded-md border border-code-border overflow-hidden divide-x divide-code-border">
      <button
        v-for="os in BINARY_OSES"
        :key="os.id"
        type="button"
        :class="[chip, platform.os === os.id ? on : off]"
        :aria-pressed="platform.os === os.id"
        @click="selectOs(os.id)"
      >
        {{ os.label }}
      </button>
    </div>
    <div v-if="archOptions.length" class="inline-flex rounded-md border border-code-border overflow-hidden divide-x divide-code-border">
      <button
        v-for="p in archOptions"
        :key="p.id"
        type="button"
        :class="[chip, selected === p.id ? on : off]"
        :aria-pressed="selected === p.id"
        :aria-label="p.label"
        @click="selected = p.id"
      >
        {{ p.arch }}
      </button>
    </div>
  </div>
</template>
