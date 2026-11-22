<script setup lang="ts">
import logoSvg from '~/assets/img/logo.svg'
import FooterInstall from '~/components/layout/AppFooter/FooterInstall.vue'
import FooterStars from '~/components/layout/AppFooter/FooterStars.vue'
import FooterBugToast from '~/components/layout/AppFooter/FooterBugToast.vue'

// Brand column: the logo («catch the bug» easter egg), one line about the
// product, the install command and GitHub stars.
const { t } = useI18n()
const { toast, catchOne, close } = useBugCatch()

// Restart the wiggle on every click.
const wiggle = ref(false)
function onLogo() {
  catchOne()
  wiggle.value = false
  requestAnimationFrame(() => { wiggle.value = true })
}
</script>

<template>
  <div class="ft-brand">
    <button
      type="button"
      class="ft-brand__logo"
      :class="{ 'ft-brand__logo--wiggle': wiggle }"
      :aria-label="t('footer.logo')"
      @click="onLogo"
      @animationend="wiggle = false"
    >
      <img :src="logoSvg" alt="" width="127" height="24">
    </button>
    <p class="ft-brand__tagline">{{ t('footer.tagline') }}</p>
    <FooterInstall cta-location="footer" class="ft-brand__install" />
    <FooterStars class="ft-brand__stars" />
    <FooterBugToast :toast="toast" @close="close" />
  </div>
</template>

<style scoped>
.ft-brand__logo {
  display: inline-flex;
  border-radius: 6px;
  cursor: pointer;
  transform-origin: 16% 50%;
}

.ft-brand__logo img {
  display: block;
  width: auto;
  height: 24px;
}

.ft-brand__logo:hover {
  animation: ft-wiggle 320ms ease-in-out;
}

.ft-brand__logo--wiggle {
  animation: ft-wiggle-click 320ms ease-in-out;
}

.ft-brand__logo:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 4px;
}

@keyframes ft-wiggle {
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* Same motion under another name, so a click restarts it during hover. */
@keyframes ft-wiggle-click {
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.ft-brand__tagline {
  max-width: 300px;
  margin: 12px 0 0;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  color: theme('colors.on-dark.secondary');
}

.ft-brand__install {
  margin-top: 18px;
}

.ft-brand__stars {
  margin-top: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .ft-brand__logo:hover,
  .ft-brand__logo--wiggle {
    animation: none;
  }
}
</style>
