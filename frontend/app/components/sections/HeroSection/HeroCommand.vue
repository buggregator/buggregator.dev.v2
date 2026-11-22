<script setup lang="ts">
import SegmentedPicker from '~/components/ui/SegmentedPicker.vue'

// The one action of the first screen: run Buggregator on this computer.
// Tabs macOS / Linux / Windows / Docker; the visitor's OS is picked after
// mount (useInstallTarget), Docker on the server and for phones. A binary tab
// shows install + start (bound to 127.0.0.1), Docker one `docker run`.
// The lines scroll inside the box; they are copied, not read.
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
      cta_location: 'hero',
      install_method: binaryOs.value ? 'binary' : 'docker',
      platform: target.value,
    })
  }
}
</script>

<template>
  <div class="hero-cmd">
    <SegmentedPicker
      class="hero-cmd__tabs"
      :model-value="target"
      :options="INSTALL_TARGETS"
      :label="t('hero.install.os')"
      @update:model-value="select"
    />
    <div class="hero-cmd__row">
      <pre class="hero-cmd__text" tabindex="0" :aria-label="t('hero.install.label')"><span
        v-for="(line, i) in lines"
        :key="`${target}-${i}`"
        class="hero-cmd__line"
      ><span class="hero-cmd__prompt" aria-hidden="true">{{ prompt }} </span>{{ line }}</span></pre>
      <button
        type="button"
        class="hero-cmd__copy"
        :class="{ 'hero-cmd__copy--done': copied }"
        @click="onCopy"
      >
        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="m5 12 5 5 9-10" />
        </svg>
        <span aria-live="polite">{{ copied ? t('hero.cta.copied') : t('hero.cta.copy') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hero-cmd {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border: 1px solid theme('colors.landing-border');
  border-radius: 10px;
  background: theme('colors.code.bg');
  text-align: left;
}

.hero-cmd__row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

/* Two lines tall for every tab, so the box keeps its height when the
   visitor's OS replaces the server-rendered Docker tab after mount. */
.hero-cmd__text {
  flex: 1;
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

.hero-cmd__copy {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  border-radius: 8px;
  background: theme('colors.accent.strong');
  color: #fff;
  font-family: "DM Sans", sans-serif;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 150ms ease;
}

.hero-cmd__copy:hover {
  background: theme('colors.accent.strong-hover');
}

.hero-cmd__copy:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}

/* «Copied»: white on #15803d, 5.02:1. */
.hero-cmd__copy--done,
.hero-cmd__copy--done:hover {
  background: #15803d;
}

.hero-cmd__copy svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 639px) {
  .hero-cmd__tabs {
    width: 100%;
  }

  .hero-cmd__row {
    flex-wrap: wrap;
  }

  .hero-cmd__text {
    flex-basis: 100%;
    font-size: 13px;
  }

  .hero-cmd__copy {
    width: 100%;
  }
}
</style>
