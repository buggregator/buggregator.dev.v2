<script setup lang="ts">
import SegmentedPicker from '~/components/ui/SegmentedPicker.vue'

// The one action of the first screen: run Buggregator on this computer.
// Tabs macOS / Linux / Windows / Docker; the visitor's OS is picked after
// mount (useInstallTarget), Docker on the server and for phones. A binary tab
// shows install + start (bound to 127.0.0.1), Docker one `docker run`.
// Top row: the tabs, Copy on the right at the tabs' size; the command
// takes the whole width below. The lines scroll sideways; they are copied, not read.
// The same box closes the home page (the assembly line band): ctaLocation
// tells the two apart in analytics.
const props = withDefaults(defineProps<{ ctaLocation?: string }>(), { ctaLocation: 'hero' })

const { t } = useI18n()
const { trackEvent } = useGtag()
const { copied, copy } = useClipboardCopy()
const { target, select } = useInstallTarget()

const binaryOs = computed(() => binaryOsOf(target.value))
const lines = computed(() => binaryOs.value ? binaryOneLiners(binaryOs.value) : [t('hero.command')])
const prompt = computed(() => binaryOs.value ? binaryPrompt(binaryOs.value) : '$')

async function onCopy() {
  if (await copy(lines.value.join('\n'))) {
    trackEvent('copy_install_command', {
      cta_location: props.ctaLocation,
      install_method: binaryOs.value ? 'binary' : 'docker',
      platform: target.value,
    })
  }
}
</script>

<template>
  <div class="hero-cmd">
    <div class="hero-cmd__bar">
      <SegmentedPicker
        class="hero-cmd__tabs"
        :model-value="target"
        :options="INSTALL_TARGETS"
        :label="t('hero.install.os')"
        @update:model-value="select"
      />
      <button
        type="button"
        class="hero-cmd__copy"
        :class="{ 'hero-cmd__copy--done': copied }"
        :aria-label="copied ? t('hero.cta.copied') : t('hero.cta.copy')"
        @click="onCopy"
      >
        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="m5 12 5 5 9-10" />
        </svg>
        <span class="hero-cmd__copy-label" aria-hidden="true">{{ copied ? t('hero.cta.copied') : t('hero.cta.copy') }}</span>
      </button>
    </div>
    <pre class="hero-cmd__text" tabindex="0" :aria-label="t('hero.install.label')"><span
      v-for="(line, i) in lines"
      :key="`${target}-${i}`"
      class="hero-cmd__line"
    ><span class="hero-cmd__prompt" aria-hidden="true">{{ prompt }} </span>{{ line }}</span></pre>
    <span class="sr-only" aria-live="polite">{{ copied ? t('hero.cta.copied') : '' }}</span>
  </div>
</template>

<style scoped>
.hero-cmd {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px solid theme('colors.landing-border');
  border-radius: 10px;
  background: theme('colors.code.bg');
  text-align: left;
}

.hero-cmd__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

/* Two lines tall for every tab, so the box keeps its height when the
   visitor's OS replaces the server-rendered Docker tab after mount. */
.hero-cmd__text {
  min-width: 0;
  min-height: 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin: 0;
  overflow-x: auto;
  white-space: nowrap;
  font-family: "JetBrains Mono", monospace;
  font-variant-ligatures: none;
  font-size: 14px;
  line-height: 28px;
  color: theme('colors.code.text');
  scrollbar-width: thin;
}

.hero-cmd__text:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
  border-radius: 4px;
}

.hero-cmd__line {
  display: block;
}

.hero-cmd__prompt {
  color: theme('colors.code.prompt');
  user-select: none;
}

/* Same size and look as the tabs (SegmentedPicker): 32 px, mono 11 px. */
.hero-cmd__copy {
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid theme('colors.code.border');
  border-radius: 6px;
  color: #8b949e;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  white-space: nowrap;
  transition: color 150ms ease, background-color 150ms ease;
}

.hero-cmd__copy:hover {
  color: theme('colors.code.text');
}

.hero-cmd__copy:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}

.hero-cmd__copy--done,
.hero-cmd__copy--done:hover {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.12);
}

.hero-cmd__copy svg {
  width: 13px;
  height: 13px;
}

/* Phone: 44 px touch targets like the tabs; Copy keeps only its icon. */
@media (max-width: 639px) {
  .hero-cmd__tabs {
    flex: 1;
    min-width: 0;
  }

  .hero-cmd__copy {
    min-height: 44px;
    min-width: 44px;
    justify-content: center;
    padding: 0;
  }

  .hero-cmd__copy-label {
    display: none;
  }

  .hero-cmd__text {
    font-size: 13px;
  }
}
</style>
