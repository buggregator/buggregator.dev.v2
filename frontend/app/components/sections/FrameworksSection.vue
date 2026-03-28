<script setup lang="ts">
import laravelLogo from '~/assets/img/laravel.svg'
import symfonyLogo from '~/assets/img/symfony.svg'
import spiralLogo from '~/assets/img/spiral.svg'
import wordpressLogo from '~/assets/img/wordpress.svg'
import yii3Logo from '~/assets/img/yii3.svg'
import drupalLogo from '~/assets/img/drupal.svg'

const { t } = useI18n()

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
  <section class="py-20 lg:py-28 bg-section-light border-t border-[#e5e7eb]">
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-section font-bold text-on-light-primary mb-3 font-sans">
        {{ t('frameworks.title') }}
      </h2>
      <p class="text-lg text-on-light-muted mb-12 font-sans">
        {{ t('frameworks.subtitle') }}
      </p>

      <div class="flex flex-wrap justify-center items-center gap-10 mb-6">
        <img
          v-for="fw in frameworks"
          :key="fw.name"
          :src="fw.logo"
          :alt="fw.name"
          class="h-10 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
        />
      </div>

      <p class="text-sm text-on-light-muted font-sans mb-2">
        {{ t('frameworks.also') }}
      </p>

      <p class="text-sm text-on-light-muted font-sans mb-6">
        {{ t('frameworks.alsoRuntime') }}
      </p>

      <a
        href="https://docs.buggregator.dev/integrations"
        target="_blank"
        rel="noopener"
        class="text-sm text-accent hover:text-accent-hover transition-colors no-underline font-sans"
      >
        {{ t('frameworks.guides') }}
      </a>
    </div>
  </section>
</template>
