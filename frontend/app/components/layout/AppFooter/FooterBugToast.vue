<script setup lang="ts">
import FooterInstall from '~/components/layout/AppFooter/FooterInstall.vue'
import type { BugCatchToast } from '~/data/footer'

// The «catch the bug» notice, styled like an event in the app. The status
// region is always in the page, so screen readers announce each catch.
const props = defineProps<{ toast: BugCatchToast | null }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.toast) emit('close')
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div role="status" class="ft-toast-region">
    <div v-if="toast" :key="toast.count" class="ft-toast">
      <div class="ft-toast__head">
        <span class="ft-toast__type">{{ t('footer.egg.type') }}</span>
        <span v-if="toast.kind === 'caught'">
          {{ t(toast.count === 1 ? 'footer.egg.caughtOne' : 'footer.egg.caughtMany', { n: toast.count }) }}
        </span>
        <span v-else>{{ t('footer.egg.final', { n: toast.count }) }}</span>
        <button type="button" class="ft-toast__close" :aria-label="t('footer.egg.close')" @click="emit('close')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div class="ft-toast__loc">
        footer.vue:{{ toast.line }}<template v-if="toast.kind === 'final'"> · {{ t('footer.egg.justNow') }}</template>
      </div>
      <template v-if="toast.kind === 'final'">
        <p class="ft-toast__text">{{ t('footer.egg.cta') }}</p>
        <FooterInstall cta-location="footer_egg" class="ft-toast__install" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.ft-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  width: 340px;
  padding: 12px 14px;
  border: 1px solid theme('colors.landing-border-hover');
  border-radius: 10px;
  background: theme('colors.landing-surface');
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  color: theme('colors.on-dark.secondary');
  animation: ft-toast-in 200ms ease-out;
}

.ft-toast__head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: theme('colors.on-dark.primary');
}

.ft-toast__type {
  padding: 0 5px;
  border: 1px solid theme('colors.landing-border-hover');
  border-radius: 3px;
  font-family: "JetBrains Mono", monospace;
  font-size: 10px;
  line-height: 16px;
  color: theme('colors.on-dark.secondary');
}

.ft-toast__close {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  margin-left: auto;
  border-radius: 4px;
  color: theme('colors.on-dark.muted');
}

.ft-toast__close:hover {
  color: theme('colors.on-dark.primary');
}

.ft-toast__close:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
}

.ft-toast__loc {
  margin-top: 2px;
  font-family: "JetBrains Mono", monospace;
  font-size: 11px;
  color: theme('colors.on-dark.muted');
}

.ft-toast__text {
  margin: 8px 0 0;
}

.ft-toast__install {
  max-width: none;
  margin-top: 10px;
}

@keyframes ft-toast-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}

@media (max-width: 639px) {
  .ft-toast {
    right: 12px;
    bottom: 12px;
    left: 12px;
    width: auto;
  }

  .ft-toast__close {
    width: 44px;
    height: 44px;
    margin: -10px -10px -10px auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ft-toast {
    animation: none;
  }
}
</style>
