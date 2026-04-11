<script setup lang="ts">
import RevealWords from '~/components/ui/RevealWords.vue'
import laravelLogo from '~/assets/img/laravel.svg'
import symfonyLogo from '~/assets/img/symfony.svg'
import spiralLogo from '~/assets/img/spiral.svg'
import wordpressLogo from '~/assets/img/wordpress.svg'
import yii3Logo from '~/assets/img/yii3.svg'
import drupalLogo from '~/assets/img/drupal.svg'

const { t } = useI18n()

const revealRef = ref<InstanceType<typeof RevealWords>>()

const frameworks = [
  { name: 'Laravel', logo: laravelLogo },
  { name: 'Symfony', logo: symfonyLogo },
  { name: 'Spiral', logo: spiralLogo },
  { name: 'WordPress', logo: wordpressLogo },
  { name: 'Yii3', logo: yii3Logo },
  { name: 'Drupal', logo: drupalLogo },
]
</script>

<template>
  <section
    class="py-20 lg:py-28 bg-section-mid border-t border-landing-border-subtle relative"
    @mousemove="revealRef?.handleMouse($event)"
    @mouseleave="revealRef?.handleLeave()"
  >
    <ClientOnly>
      <RevealWords
        ref="revealRef"
        :words="['Spiral', 'CycleORM', 'RoadRunner', 'Wippy', 'Spiral', 'RoadRunner', 'CycleORM', 'Wippy', 'Spiral', 'RoadRunner', 'Spiral', 'Wippy', 'CycleORM', 'RoadRunner', 'Spiral', 'Wippy', 'RoadRunner', 'CycleORM', 'Spiral', 'Wippy', 'RoadRunner', 'Spiral', 'CycleORM', 'Wippy', 'RoadRunner', 'Spiral', 'Wippy', 'CycleORM', 'RoadRunner', 'Spiral', 'Wippy', 'RoadRunner', 'CycleORM', 'Spiral', 'Wippy']"
        color="#8b5cf6"
        :radius="220"
        :density="35"
      />
    </ClientOnly>
    <div class="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-section font-bold text-white mb-3 font-sans">
        {{ t('frameworks.title') }}
      </h2>
      <p class="text-lg text-on-dark-secondary mb-12 font-sans">
        {{ t('frameworks.subtitle') }}
      </p>

      <div class="flex flex-wrap justify-center items-center gap-10 mb-6">
        <img
          v-for="fw in frameworks"
          :key="fw.name"
          :src="fw.logo"
          :alt="fw.name"
          class="h-10 opacity-40 grayscale invert hover:opacity-90 hover:grayscale-0 hover:invert-0 transition-all duration-200"
        />
      </div>

      <p class="text-sm text-on-dark-muted font-sans mb-2">
        {{ t('frameworks.also') }}
      </p>

      <p class="text-sm text-on-dark-muted font-sans mb-6">
        {{ t('frameworks.alsoRuntime') }}
      </p>

      <a
        href="https://docs.buggregator.dev/integrations.html"
        target="_blank"
        rel="noopener"
        class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
      >
        {{ t('frameworks.guides') }}
      </a>
    </div>
  </section>
</template>
