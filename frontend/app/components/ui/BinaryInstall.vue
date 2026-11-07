<script setup lang="ts">
import BinaryPlatformPicker from '~/components/ui/BinaryPlatformPicker.vue'

// Install-and-run commands for the standalone binary, with an OS picker.
// The OS is shared page-wide (useBinaryPlatform), so the hero, Get started
// and feature pages show the same one. The run line binds 127.0.0.1.
const props = defineProps<{
  // Where it sits, for the copy_install_command analytics event.
  ctaLocation: string
  // Inside a tab panel that already draws the code background.
  bare?: boolean
}>()

const { t } = useI18n()
const { os, commands, prompt, copyText } = useBinaryPlatform()
const { copied, copy } = useClipboardCopy()
const { trackEvent } = useGtag()

const link = 'inline-flex items-center min-h-[44px] sm:min-h-0 text-accent hover:text-accent-hover transition-colors no-underline'

async function copyCommands() {
  if (await copy(copyText.value)) {
    trackEvent('copy_install_command', {
      cta_location: props.ctaLocation,
      install_method: 'binary',
      platform: os.value,
    })
  }
}
</script>

<template>
  <div :class="bare ? '' : 'rounded-xl border border-code-border bg-code-bg p-4'">
    <!-- The copy button sits beside the picker, so it never covers a command. -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <BinaryPlatformPicker />
      <button
        type="button"
        class="hit-area relative shrink-0 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
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

    <pre class="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all"><template
      v-for="(cmd, i) in commands"
      :key="i"
    ><span class="text-code-prompt select-none">{{ prompt }} </span><span class="text-code-text">{{ cmd }}</span>
</template></pre>

    <div class="mt-3 space-y-1.5 font-sans text-xs leading-relaxed text-on-dark-secondary">
      <p>{{ t('install.scriptCpu') }}</p>
      <p v-if="os === 'windows'">{{ t('install.binary.windowsNote') }}</p>
      <p>{{ t('install.binary.note', { size: t('install.binary.size', { n: BINARY_SIZE_MB }) }) }}</p>
      <p>
        <a :href="BINARY_LOCAL_ONLY_URL" target="_blank" rel="noopener" :class="link">{{ t('install.localOnlyBound') }}</a>
      </p>
      <p>
        <a :href="BINARY_RELEASES_URL" target="_blank" rel="noopener" :class="link">{{ t('install.links.manual') }}</a>
      </p>
    </div>
  </div>
</template>
