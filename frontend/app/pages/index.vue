<script setup lang="ts">
import HeroSection from '~/components/sections/HeroSection.vue'
import ReplacesSection from '~/components/sections/ReplacesSection.vue'
import CleanAppSection from '~/components/sections/CleanAppSection.vue'
import MockShowcase from '~/components/showcase/MockShowcase.vue'
import StepsSection from '~/components/sections/StepsSection.vue'
import DemoSection from '~/components/sections/DemoSection.vue'
import FrameworksSection from '~/components/sections/FrameworksSection.vue'
import EcosystemSection from '~/components/sections/EcosystemSection.vue'
import AdvancedFeaturesSection from '~/components/sections/AdvancedFeaturesSection.vue'
import WhatsNewSection from '~/components/sections/WhatsNewSection.vue'
import CommunitySection from '~/components/sections/CommunitySection.vue'
import StatsSection from '~/components/sections/StatsSection.vue'
import SponsorsSection from '~/components/sections/SponsorsSection.vue'

definePageMeta({ layout: 'landing' })

const { t } = useI18n()
const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  ogTitle: () => t('seo.home.ogTitle'),
  ogDescription: () => t('seo.home.ogDescription'),
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'website',
  ogSiteName: 'Buggregator',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.home.title'),
  twitterDescription: () => t('seo.home.twitterDescription'),
  twitterImage: 'https://buggregator.dev/buggregator.png',
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
</script>

<template>
  <div>
    <HeroSection />
    <MockShowcase />
    <ReplacesSection />
    <CleanAppSection />
    <StepsSection />
    <FrameworksSection />
    <AdvancedFeaturesSection />
    <WhatsNewSection />
    <DemoSection />
    <EcosystemSection />
    <CommunitySection />
    <StatsSection />
    <SponsorsSection />
  </div>
</template>
