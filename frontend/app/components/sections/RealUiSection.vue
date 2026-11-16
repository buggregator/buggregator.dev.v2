<script setup lang="ts">
// The real UI, not a drawing: a ~30 s clip of the main flow (start, events
// arrive, open an exception, a mail, dumps, a profile) and four screenshots,
// all from Buggregator v2.10.0 with the demo data of scripts/demo (made-up
// names, example.com addresses).
const { t } = useI18n()

const video = ref<HTMLVideoElement | null>(null)
useInViewAutoplay(video)

const SHOTS = [
  { id: 'sentry', src: '/img/ui/sentry.webp' },
  { id: 'smtp', src: '/img/ui/smtp.webp' },
  { id: 'dumps', src: '/img/ui/dumps.webp' },
  { id: 'profiler', src: '/img/ui/profiler.webp' },
] as const
// Intrinsic size of every shot: the browser reserves the space (no shift).
const SHOT_W = 1920
const SHOT_H = 1200
</script>

<template>
  <section id="real-ui" class="py-16 lg:py-24 bg-section-dark border-t border-landing-border-subtle">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <h2 class="text-section font-bold text-white mb-3 font-sans">{{ t('realUi.title') }}</h2>
        <p class="text-lg text-on-dark-secondary font-sans">{{ t('realUi.subtitle') }}</p>
      </div>

      <figure class="m-0">
        <div class="rounded-xl overflow-hidden border border-landing-border-subtle shadow-showcase bg-landing-deepest">
          <video
            ref="video"
            class="block w-full h-auto"
            width="1280"
            height="800"
            poster="/video/demo-poster.webp"
            muted
            loop
            playsinline
            controls
            preload="none"
            :aria-label="t('realUi.videoLabel')"
          >
            <source src="/video/demo.webm" type="video/webm" />
            <source src="/video/demo.mp4" type="video/mp4" />
          </video>
        </div>
        <figcaption class="mt-3 text-center font-sans text-sm text-on-dark-muted">{{ t('realUi.videoCaption') }}</figcaption>
      </figure>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 list-none p-0">
        <li v-for="shot in SHOTS" :key="shot.id">
          <figure class="m-0">
            <a
              :href="shot.src"
              target="_blank"
              rel="noopener"
              class="block rounded-lg overflow-hidden border border-landing-border-subtle hover:border-accent transition-colors"
            >
              <img
                :src="shot.src"
                :alt="t(`realUi.shots.${shot.id}.alt`)"
                :width="SHOT_W"
                :height="SHOT_H"
                class="block w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </a>
            <figcaption class="mt-2 font-sans text-sm text-on-dark-secondary">{{ t(`realUi.shots.${shot.id}.caption`) }}</figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>
