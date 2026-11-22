<script setup lang="ts">
import AssemblyLinePicture from '~/components/ui/AssemblyLinePicture.vue'
import HeroCommand from '~/components/sections/HeroSection/HeroCommand.vue'

// The last band of the home page, before the footer (#6831): the assembly
// line under a shade, one line, the install command and «Star on GitHub».
const { t } = useI18n()
const { exact } = useServerStars()
</script>

<template>
  <section class="al-band" aria-labelledby="al-band-title">
    <AssemblyLinePicture :alt="t('assemblyLine.alt')" />
    <div class="al-band__shade" aria-hidden="true" />

    <div class="al-band__content">
      <h2 id="al-band-title" class="al-band__title">
        {{ t('assemblyLine.title') }}
      </h2>
      <p class="al-band__sub">
        {{ t('assemblyLine.sub') }}
      </p>
      <HeroCommand class="al-band__cmd" cta-location="assembly_band" />
      <a
        href="https://github.com/buggregator/server"
        target="_blank"
        rel="noopener"
        class="al-band__star"
        :aria-label="exact ? t('footer.starLabel', { count: exact }) : t('footer.star')"
      >
        <svg class="al-band__star-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
        </svg>
        {{ t('footer.star') }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.al-band {
  position: relative;
  overflow: hidden;
  padding: 120px 24px;
  background: #0c0e14;
  /* Room for the picture before it loads: no jump. */
  min-height: 520px;
}

/* Melts into the page above and the footer below; the centre stays dark enough for text. */
.al-band__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, #0c0e14 0%, rgba(12, 14, 20, 0.35) 22%, rgba(12, 14, 20, 0.35) 78%, #0c0e14 100%),
    radial-gradient(ellipse 60% 70% at 50% 50%, rgba(12, 14, 20, 0.7) 0%, rgba(12, 14, 20, 0.2) 100%);
}

.al-band__content {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.al-band__title {
  font-size: clamp(30px, 4.5vw, 48px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
}

.al-band__sub {
  margin-top: 16px;
  max-width: 560px;
  font-size: 18px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.82);
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.7);
}

.al-band__cmd {
  margin-top: 32px;
  width: 100%;
  max-width: 620px;
}

.al-band__star {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(12, 14, 20, 0.6);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 150ms ease;
}

.al-band__star:hover {
  border-color: rgba(255, 255, 255, 0.35);
}

.al-band__star:focus-visible {
  outline: 2px solid #8b5cf6;
  outline-offset: 2px;
}

.al-band__star-icon {
  width: 16px;
  height: 16px;
  color: #facc15;
}
</style>
