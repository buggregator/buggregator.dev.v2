<script setup lang="ts">
import { sponsors } from '~/data/sponsors'
import SponsorCard from '~/components/sections/SponsorsSection/SponsorCard.vue'
import PatreonIcon from '~/components/icons/PatreonIcon.vue'

definePageMeta({ layout: 'landing' })

const { t } = useI18n()
const { trackEvent } = useGtag()
const { patreonUrl, sponsorEmail } = useRuntimeConfig().public

const mascotRef = ref<HTMLElement | null>(null)
const mascotTransform = ref('translate(-50%, -50%)')

function onMouseMove(e: MouseEvent) {
  if (!mascotRef.value) return
  const rect = mascotRef.value.closest('section')?.getBoundingClientRect()
  if (!rect) return

  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5

  const rotateY = x * 8
  const rotateX = -y * 6
  const translateX = x * 15
  const translateY = y * 10

  mascotTransform.value = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
}

function onMouseLeave() {
  mascotTransform.value = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg) scale(1)'
}

useSeoMeta({
  title: 'Sponsor Buggregator — Support Free Open Source PHP Debugging',
  description: 'Buggregator is a free, open-source debugging server for PHP developers. Support its development via Patreon or company sponsorship.',
  ogTitle: 'Sponsor Buggregator',
  ogDescription: 'Keep Buggregator free forever. Support via Patreon or become a company sponsor.',
})

const hasSponsors = computed(() => sponsors.length > 0)

const individualPerks = [
  'Your name in the FUNDING.yml',
  'Your avatar in the Sponsors section',
  'Our eternal gratitude',
]

const companyPerks = [
  'Your logo on buggregator.dev homepage',
  'Your logo in the GitHub README',
  'Your logo in the docs header',
  'A thank-you post on our socials',
]
</script>

<template>
  <div class="pt-16 pb-16">
    <!-- Hero -->
    <section
      class="relative text-center bg-section-dark overflow-hidden flex items-center justify-center"
      style="min-height: 65vh; padding: 80px 0; perspective: 800px;"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <!-- Mascot background with parallax -->
      <div
        ref="mascotRef"
        class="sponsors-mascot"
        aria-hidden="true"
        :style="{ transform: mascotTransform }"
      >
        <img
          src="/sponsors.png"
          alt=""
          class="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div class="relative z-10 max-w-2xl mx-auto px-4">
        <h1 class="text-3xl lg:text-4xl font-bold text-white mb-4 font-sans">
          {{ t('sponsors.page.title') }}
        </h1>
        <p class="text-base text-white/70 leading-relaxed mb-8 font-sans">
          {{ t('sponsors.page.subheadline') }}
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <a
            :href="patreonUrl as string"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white no-underline"
            style="background: #FF424D;"
            @click="trackEvent('cta_click', { cta_location: 'sponsors_hero', cta_text: 'patreon' })"
          >
            <PatreonIcon />
            {{ t('sponsors.page.ctaPatreon') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Why sponsor -->
    <section class="py-16 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4">
        <h2 class="text-xl font-bold text-white mb-8 text-center font-sans">
          {{ t('sponsors.page.why.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="key in ['free', 'recognition', 'oss']"
            :key="key"
            class="rounded-xl p-6"
            style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);"
          >
            <h3 class="text-sm font-semibold text-white mb-2 font-sans">
              {{ t(`sponsors.page.why.${key}.title`) }}
            </h3>
            <p class="text-xs text-white/60 leading-relaxed font-sans">
              {{ t(`sponsors.page.why.${key}.body`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Current sponsors -->
    <section class="py-16 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 text-center">
        <h2 class="text-xl font-bold text-white mb-8 font-sans">
          {{ hasSponsors ? t('sponsors.page.currentSponsors') : t('sponsors.page.noSponsors') }}
        </h2>
        <div v-if="hasSponsors" class="flex flex-wrap justify-center gap-4">
          <SponsorCard v-for="s in sponsors" :key="s.id" :sponsor="s" :tier="s.tier" />
        </div>
      </div>
    </section>

    <!-- Tiers -->
    <section class="py-16 bg-section-dark">
      <div class="max-w-[800px] mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Individual -->
          <div class="rounded-xl p-6" style="background: rgba(255,69,77,0.08); border: 1px solid rgba(255,69,77,0.2);">
            <p class="text-sm font-semibold text-white font-sans">{{ t('sponsors.page.tiers.individual.label') }}</p>
            <p class="text-xs text-white/40 font-sans mb-3">{{ t('sponsors.page.tiers.individual.via') }}</p>
            <p class="text-xs text-white/60 font-sans mb-4">{{ t('sponsors.page.tiers.individual.from') }}</p>
            <ul class="space-y-2 mb-6">
              <li v-for="perk in individualPerks" :key="perk" class="flex items-start gap-2 text-xs text-white/60 font-sans">
                <svg class="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ perk }}
              </li>
            </ul>
            <a
              :href="patreonUrl as string"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 text-sm font-medium text-[#FF424D] no-underline hover:underline font-sans"
            >
              <PatreonIcon />
              {{ t('sponsors.page.tiers.individual.cta') }}
            </a>
          </div>

          <!-- Company -->
          <div class="rounded-xl p-6" style="background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);">
            <p class="text-sm font-semibold text-white font-sans">{{ t('sponsors.page.tiers.company.label') }}</p>
            <p class="text-xs text-white/40 font-sans mb-3">{{ t('sponsors.page.tiers.company.via') }}</p>
            <p class="text-xs text-white/60 font-sans mb-4">{{ t('sponsors.page.tiers.company.from') }}</p>
            <ul class="space-y-2 mb-6">
              <li v-for="perk in companyPerks" :key="perk" class="flex items-start gap-2 text-xs text-white/60 font-sans">
                <svg class="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ perk }}
              </li>
            </ul>
            <a
              :href="`mailto:${sponsorEmail}`"
              class="inline-flex items-center gap-2 text-sm font-medium text-accent no-underline hover:underline font-sans"
            >
              {{ t('sponsors.page.tiers.company.cta') }} {{ sponsorEmail }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-16 bg-section-dark">
      <div class="max-w-lg mx-auto px-4 text-center">
        <h3 class="text-lg font-semibold text-white mb-3 font-sans">
          {{ t('sponsors.page.contact.title') }}
        </h3>
        <p class="text-sm text-white/60 mb-6 font-sans">
          {{ t('sponsors.page.contact.body') }}
        </p>
        <a
          :href="`mailto:${sponsorEmail}`"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white/80 no-underline font-mono hover:text-white transition-colors"
          style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);"
        >
          {{ sponsorEmail }}
        </a>
        <p class="text-xs text-white/40 mt-6 font-sans">
          {{ t('sponsors.page.contact.or') }}
        </p>
        <a
          :href="patreonUrl as string"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 mt-3 text-sm text-[#FF424D] no-underline hover:underline font-mono"
        >
          <PatreonIcon />
          patreon.com/butschster
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sponsors-mascot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 300ms ease-out;
  will-change: transform;
  width: 1400px;
  height: 1400px;
  opacity: 0.1;
  pointer-events: none;
  mix-blend-mode: lighten;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 15%, transparent 65%);
  -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 15%, transparent 65%);
}

@media (min-width: 1024px) {
  .sponsors-mascot {
    width: 2000px;
    height: 2000px;
  }
}
</style>
