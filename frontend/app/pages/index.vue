<script setup lang="ts">
import HeroSection from '~/components/sections/HeroSection.vue'
import ReplacesSection from '~/components/sections/ReplacesSection.vue'
import StepsSection from '~/components/sections/StepsSection.vue'
import FrameworksSection from '~/components/sections/FrameworksSection.vue'
import DemoSection from '~/components/sections/DemoSection.vue'
import WhatsNewSection from '~/components/sections/WhatsNewSection.vue'
import AdvancedFeaturesSection from '~/components/sections/AdvancedFeaturesSection.vue'
import EcosystemSection from '~/components/sections/EcosystemSection.vue'
import CommunitySection from '~/components/sections/CommunitySection.vue'
import HarnsySection from '~/components/sections/HarnsySection.vue'
import AssemblyLineSection from '~/components/sections/AssemblyLineSection.vue'

definePageMeta({ layout: 'landing' })

const { t } = useI18n()
const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  ogTitle: () => t('seo.home.ogTitle'),
  ogDescription: () => t('seo.home.ogDescription'),
  // public/og/home.jpg: drawn by scripts/home-og-image.ts (#6831).
  ogImage: `${siteUrl}/og/home.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => t('assemblyLine.alt'),
  ogType: 'website',
  ogSiteName: 'Buggregator',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.home.title'),
  twitterDescription: () => t('seo.home.twitterDescription'),
  twitterImage: `${siteUrl}/og/home.jpg`,
  twitterImageAlt: () => t('assemblyLine.alt'),
})

// What the page shows, for search engines: no ratings or reviews (there are none).
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify([
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Buggregator', url: `${siteUrl}/` },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Buggregator',
        url: `${siteUrl}/`,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, macOS, Windows, Docker',
        description: t('hero.subheadline'),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        softwareHelp: { '@type': 'CreativeWork', url: 'https://docs.buggregator.dev/' },
        sameAs: ['https://github.com/buggregator/server'],
      },
    ]),
  }],
})
// The demo stand is down: the section shows only when DEMO_ENABLED=true.
const { demoEnabled } = useRuntimeConfig().public
</script>

<template>
  <!-- Nine blocks, each said once: what it is and the command with the real
       UI under it (one tab per feature), what it replaces, how it works, your stack, what's new, for teams,
       ecosystem, open source (with sponsors), the AI team, then the assembly line band by the footer. -->
  <div>
    <HeroSection />
    <DemoSection v-if="demoEnabled" />
    <ReplacesSection />
    <StepsSection />
    <FrameworksSection />
    <WhatsNewSection />
    <AdvancedFeaturesSection />
    <EcosystemSection />
    <CommunitySection />
    <HarnsySection />
    <AssemblyLineSection />
  </div>
</template>
