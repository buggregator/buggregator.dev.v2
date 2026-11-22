<script setup lang="ts">
import type { NuxtError } from '#app'
import AssemblyLinePicture from '~/components/ui/AssemblyLinePicture.vue'

// The site's error page (#6831): 404 says «Bug not found — but we will catch
// it» over the assembly line; any other error gets the same look, its own words.
const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()
const docsUrl = 'https://docs.buggregator.dev'

const notFound = computed(() => props.error.statusCode === 404)
const title = computed(() => (notFound.value ? t('notFound.title') : t('notFound.errorTitle')))
const line = computed(() => (notFound.value ? t('notFound.line') : t('notFound.errorLine')))

useHead({ title, meta: [{ name: 'robots', content: 'noindex' }] })

const goHome = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <NuxtLayout name="landing">
    <section class="nf">
      <AssemblyLinePicture :alt="t('notFound.alt')" eager />
      <div class="nf__shade" aria-hidden="true" />

      <div class="nf__content">
        <p class="nf__code">
          {{ error.statusCode || 500 }}
        </p>
        <h1 class="nf__title">
          {{ title }}
        </h1>
        <p class="nf__line">
          {{ line }}
        </p>
        <div class="nf__actions">
          <button type="button" class="nf__btn nf__btn--primary" @click="goHome">
            {{ t('notFound.home') }}
          </button>
          <a :href="docsUrl" target="_blank" rel="noopener" class="nf__btn">
            {{ t('notFound.docs') }}
          </a>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.nf {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  min-height: min(100svh, 820px);
  padding: 120px 24px 72px;
  background: #0c0e14;
}

/* Text reads on the left and bottom; the picture melts into the page below. */
.nf__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, #0c0e14 0%, rgba(12, 14, 20, 0.85) 30%, rgba(12, 14, 20, 0.2) 65%, rgba(12, 14, 20, 0.6) 100%),
    linear-gradient(90deg, rgba(12, 14, 20, 0.75) 0%, transparent 60%);
}

.nf__content {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.nf__code {
  font-family: "JetBrains Mono", monospace;
  font-size: 14px;
  letter-spacing: 0.2em;
  color: #c4b5fd;
}

.nf__title {
  margin-top: 12px;
  font-size: clamp(40px, 7vw, 72px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
}

.nf__line {
  margin-top: 16px;
  max-width: 520px;
  font-size: 18px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.nf__actions {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.nf__btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(12, 14, 20, 0.6);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.nf__btn:hover {
  border-color: rgba(255, 255, 255, 0.35);
}

.nf__btn:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

.nf__btn--primary {
  border-color: transparent;
  background: #7c3aed;
}

.nf__btn--primary:hover {
  background: #6d28d9;
}
</style>
