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
import SponsorsSection from '~/components/sections/SponsorsSection.vue'

definePageMeta({ layout: 'landing' })
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
    <SponsorsSection />
  </div>
</template>
