<script setup lang="ts">
// The Docker command in one line with Copy, as in the hero's Docker tab.
// The line scrolls sideways inside its box: it is copied, not read.
const props = defineProps<{
  // For the copy_install_command analytics event.
  ctaLocation: string
}>()

const { t } = useI18n()
const { trackEvent } = useGtag()
const { copied, copy } = useClipboardCopy()
const command = computed(() => t('hero.command'))

async function onCopy() {
  if (await copy(command.value)) {
    trackEvent('copy_install_command', { cta_location: props.ctaLocation, install_method: 'docker' })
  }
}
</script>

<template>
  <div class="ft-install">
    <code class="ft-install__cmd" tabindex="0" :aria-label="t('footer.install')"><span class="ft-install__prompt" aria-hidden="true">$</span>{{ command }}</code>
    <button
      type="button"
      class="ft-install__copy"
      :class="{ 'ft-install__copy--done': copied }"
      :aria-label="copied ? t('hero.cta.copied') : t('footer.copyLabel')"
      @click="onCopy"
    >
      {{ copied ? t('hero.cta.copied') : t('footer.copy') }}
    </button>
  </div>
</template>

<style scoped>
.ft-install {
  display: flex;
  align-items: stretch;
  height: 40px;
  max-width: 340px;
  overflow: hidden;
  border: 1px solid theme('colors.landing-border');
  border-radius: 8px;
  background: theme('colors.code.bg');
}

.ft-install__cmd {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  padding: 0 12px;
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
  font-family: "JetBrains Mono", monospace;
  font-size: 12.5px;
  font-variant-ligatures: none;
  color: theme('colors.code.text');
  mask-image: linear-gradient(90deg, #000 85%, transparent);
}

.ft-install__cmd:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -2px;
  mask-image: none;
}

.ft-install__prompt {
  margin-right: 0.6em;
  color: theme('colors.on-dark.muted');
}

.ft-install__copy {
  flex: none;
  padding: 0 12px;
  border-left: 1px solid theme('colors.landing-border');
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: theme('colors.on-dark.secondary');
  transition: color 150ms ease, background-color 150ms ease;
}

.ft-install__copy:hover {
  color: theme('colors.on-dark.primary');
  background: theme('colors.landing-elevated');
}

.ft-install__copy:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: -2px;
}

.ft-install__copy--done {
  color: #22c55e;
}

@media (max-width: 639px) {
  .ft-install {
    max-width: none;
    height: 44px;
  }
}
</style>
