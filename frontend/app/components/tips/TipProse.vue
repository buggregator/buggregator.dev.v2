<script setup lang="ts">
// Server-rendered Markdown of a tip (answer or a section). The HTML is built
// from our own content files by server/lib/tips.ts (raw HTML disabled).
// Clicks are handled here: «Copy» on code blocks, site links via the router
// (links with a target, like screenshots opening full size, stay native).
const props = defineProps<{
  html: string
  lead?: boolean
}>()

const router = useRouter()
const { trackEvent } = useGtag()

async function onClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  const copy = target?.closest<HTMLButtonElement>('button[data-copy]')
  if (copy) {
    // The «$ » prompt is shown but not copied.
    const code = (copy.closest('.tip-code')?.querySelector('pre')?.textContent ?? '').replace(/^\$ /gm, '')
    try {
      await navigator.clipboard.writeText(code)
      trackEvent('copy_tip_code', { tip: router.currentRoute.value.path })
      copy.textContent = 'Copied'
      setTimeout(() => { copy.textContent = 'Copy' }, 2000)
    } catch { /* clipboard blocked: the code stays selectable */ }
    return
  }
  const link = target?.closest<HTMLAnchorElement>('a[href^="/"]:not([target])')
  if (link && !e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
    e.preventDefault()
    await router.push(link.getAttribute('href')!)
  }
}
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="tip-prose" :class="{ 'tip-prose-lead': props.lead }" @click="onClick" v-html="html" />
</template>

<style scoped>
.tip-prose {
  font-family: theme('fontFamily.sans');
  font-size: 1rem;
  line-height: 1.7;
  color: theme('colors.on-dark.secondary');
  /* Long URLs and identifiers in the text wrap instead of widening a phone screen. */
  overflow-wrap: anywhere;
}
.tip-prose :deep(pre) {
  overflow-wrap: normal;
}
.tip-prose-lead {
  font-size: 1.125rem;
  color: #e5e7eb;
}
.tip-prose :deep(> * + *) {
  margin-top: 1rem;
}
.tip-prose :deep(h3) {
  margin-top: 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
}
.tip-prose :deep(h3:first-child) {
  margin-top: 0;
}
.tip-prose :deep(a) {
  color: theme('colors.accent.DEFAULT');
  text-decoration: none;
}
.tip-prose :deep(a:hover) {
  text-decoration: underline;
}
.tip-prose :deep(strong) {
  color: #fff;
  font-weight: 600;
}
.tip-prose :deep(ul),
.tip-prose :deep(ol) {
  padding-left: 1.25rem;
}
.tip-prose :deep(ul) { list-style: disc; }
.tip-prose :deep(ol) { list-style: decimal; }
.tip-prose :deep(li + li) { margin-top: 0.25rem; }
.tip-prose :deep(:not(pre) > code) {
  font-family: theme('fontFamily.mono');
  font-size: 0.875em;
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
  background: theme('colors.landing-surface');
  color: #e5e7eb;
}
.tip-prose :deep(.tip-code) {
  border: 1px solid var(--code-border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--code-bg);
}
.tip-prose :deep(.tip-code-head) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.25rem 0.25rem 1rem;
  border-bottom: 1px solid var(--code-border);
  font-family: theme('fontFamily.mono');
  font-size: 0.75rem;
  color: theme('colors.on-dark.muted');
}
.tip-prose :deep(.tip-copy) {
  min-height: 36px;
  min-width: 44px;
  padding: 0 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: theme('colors.on-dark.secondary');
  font-family: theme('fontFamily.mono');
  font-size: 0.75rem;
  cursor: pointer;
}
.tip-prose :deep(.tip-copy:hover) {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}
.tip-prose :deep(.tip-copy:focus-visible) {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}
.tip-prose :deep(pre) {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
  font-family: theme('fontFamily.mono');
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--code-text);
  white-space: pre;
}
.tip-prose :deep(.tip-shot) {
  display: block;
  border: 1px solid theme('colors.landing-border');
  border-radius: 0.75rem;
  overflow: hidden;
  background: theme('colors.landing-surface');
}
.tip-prose :deep(.tip-shot img) {
  display: block;
  width: 100%;
  height: auto;
}
.tip-prose :deep(.tip-shot:hover) {
  border-color: theme('colors.accent.DEFAULT');
}
.tip-prose :deep(.tip-shot:focus-visible) {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}
.tip-prose :deep(.tip-c-comment) { color: var(--code-comment); }
.tip-prose :deep(.tip-c-prompt) { color: var(--code-prompt); user-select: none; }
.tip-prose :deep(.tip-c-key) { color: var(--code-keyword); }
.tip-prose :deep(.tip-c-value) { color: var(--code-string); }
</style>
