<script setup lang="ts">
import BinaryPlatformPicker from '~/components/ui/BinaryPlatformPicker.vue'

// Download-and-run commands for the standalone binary, with a platform
// picker. The platform is shared page-wide (useBinaryPlatform), so the hero,
// Get started and feature pages show the same OS.
const props = defineProps<{
  // Where it sits, for the copy_install_command analytics event.
  ctaLocation: string
  // Inside a tab panel that already draws the code background.
  bare?: boolean
}>()

const { t } = useI18n()
const { platform, commands, prompt, copyText } = useBinaryPlatform()
const { copied, copy } = useClipboardCopy()
const { trackEvent } = useGtag()

async function copyCommands() {
  if (await copy(copyText.value)) {
    trackEvent('copy_install_command', {
      cta_location: props.ctaLocation,
      install_method: 'binary',
      platform: platform.value.id,
    })
  }
}
</script>

<template>
  <div :class="bare ? '' : 'rounded-xl border border-code-border bg-code-bg p-4'">
    <BinaryPlatformPicker class="mb-3" />

    <div class="relative font-mono text-xs leading-relaxed">
      <pre class="whitespace-pre overflow-x-auto pr-10"><template
        v-for="(cmd, i) in commands"
        :key="i"
      ><span class="text-code-prompt select-none">{{ prompt }} </span><span class="text-code-text">{{ cmd }}</span>
</template></pre>

      <button
        type="button"
        class="hit-area absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
        :class="copied
          ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
          : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted hover:bg-[rgba(255,255,255,0.12)] hover:text-white'"
        :aria-label="copied ? t('hero.cta.copied') : t('hero.cta.copy')"
        @click="copyCommands"
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>

    <p v-if="platform.os === 'windows'" class="mt-3 font-sans text-xs text-on-dark-secondary">
      {{ t('install.binary.windowsNote') }}
    </p>
    <p class="mt-3 font-sans text-xs text-on-dark-secondary">
      {{ platform.sizeMb ? t('install.binary.noteSize', { size: `${platform.sizeMb} MB` }) : t('install.binary.note') }}
    </p>
  </div>
</template>
