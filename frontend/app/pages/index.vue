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
import CommunitySection from '~/components/sections/CommunitySection.vue'
import StatsSection from '~/components/sections/StatsSection.vue'
import SponsorsSection from '~/components/sections/SponsorsSection.vue'

definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'Buggregator — Free Debugging Server for PHP',
  description: 'Debug everything in your PHP app. Exceptions, dumps, emails, profiling, logs — all in one UI. One docker run. Works with Sentry, VarDumper, Monolog, XHProf. Free & open source.',
  ogTitle: 'Buggregator — Debug Everything in Your PHP App',
  ogDescription: 'Exceptions, dumps, emails, profiling, logs — all in one real-time UI. One docker run. No cloud account. Free forever.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogUrl: 'https://buggregator.dev',
  ogType: 'website',
  ogSiteName: 'Buggregator',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Buggregator — Free Debugging Server for PHP',
  twitterDescription: 'Exceptions, dumps, emails, profiling, logs — all in one real-time UI. One docker run. Free forever.',
  twitterImage: 'https://buggregator.dev/buggregator.png',
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
    <DemoSection />
    <EcosystemSection />
    <CommunitySection />
    <StatsSection />
    <SponsorsSection />
  </div>
</template>
