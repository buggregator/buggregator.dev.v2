<script setup lang="ts">
import DemoIframe from '~/components/sections/DemoSection/DemoIframe.vue'
import DemoButtons from '~/components/sections/DemoSection/DemoButtons.vue'
import DemoMobileMessage from '~/components/sections/DemoSection/DemoMobileMessage.vue'

const { t } = useI18n()
</script>

<template>
  <section id="demo" class="bg-section-dark">
    <!-- Desktop: iframe + buttons -->
    <div class="hidden lg:block py-20" style="min-width: 1024px;">
      <div class="w-[95%] mx-auto">
        <!-- Header -->
        <div class="text-center mb-12 px-4">
          <h2 class="text-section font-bold text-white mb-3 font-sans">
            {{ t('demo.headline') }}
          </h2>
          <p class="text-lg text-on-dark-secondary max-w-2xl mx-auto font-sans">
            {{ t('demo.subtitle') }}
          </p>
        </div>

        <!-- Two-column layout -->
        <div class="grid grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-0">
          <DemoIframe />
          <div class="bg-landing-base border border-landing-border-subtle border-l-0 rounded-r-xl px-5 overflow-y-auto" style="height: 70vh;">
            <DemoButtons />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: message -->
    <DemoMobileMessage />
  </section>
</template>
