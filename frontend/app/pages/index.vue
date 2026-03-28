<script setup lang="ts">
import HeroSection from '~/components/sections/HeroSection.vue'
import ReplacesSection from '~/components/sections/ReplacesSection.vue'
import MockShowcase from '~/components/showcase/MockShowcase.vue'
import StepsSection from '~/components/sections/StepsSection.vue'
import InstallSection from '~/components/sections/InstallSection.vue'
import FrameworksSection from '~/components/sections/FrameworksSection.vue'
import EcosystemSection from '~/components/sections/EcosystemSection.vue'
import AdvancedFeaturesSection from '~/components/sections/AdvancedFeaturesSection.vue'
import CommunitySection from '~/components/sections/CommunitySection.vue'

definePageMeta({ layout: 'landing' })
</script>

<template>
  <div>
    <HeroSection />
    <ReplacesSection />
    <MockShowcase />
    <StepsSection />
    <InstallSection />
    <FrameworksSection />
    <EcosystemSection />
    <AdvancedFeaturesSection />
    <CommunitySection />
  </div>
</template>
