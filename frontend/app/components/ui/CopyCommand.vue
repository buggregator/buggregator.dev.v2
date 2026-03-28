<script setup lang="ts">
const props = defineProps<{
  command: string
  noBg?: boolean
}>()

const { t } = useI18n()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea')
    el.value = props.command
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div
    class="relative overflow-x-auto"
    :class="noBg ? 'px-0 py-0' : 'max-w-[620px] bg-code-bg border border-code-border rounded-xl px-5 py-4'"
  >
    <code class="flex items-start gap-2 font-mono text-sm whitespace-pre">
      <span class="text-code-prompt select-none">$</span>
      <span class="text-code-text">{{ command }}</span>
    </code>

    <button
      class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
      :class="copied
        ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
        : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted hover:bg-[rgba(255,255,255,0.12)] hover:text-white'"
      :aria-label="copied ? t('hero.cta.copied') : t('hero.cta.copy')"
      @click="copy"
    >
      <!-- Copy icon -->
      <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <!-- Check icon -->
      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </button>
  </div>
</template>
