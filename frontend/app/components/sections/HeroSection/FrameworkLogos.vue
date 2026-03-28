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
  <div class="mt-10">
    <p class="text-sm font-medium text-on-dark-muted mb-4">{{ t('hero.frameworks') }}</p>
    <div class="flex flex-wrap items-center gap-6">
      <img
        v-for="fw in frameworks"
        :key="fw.name"
        :src="fw.logo"
        :alt="fw.name"
        class="h-7 sm:h-7 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-200"
      />
    </div>
  </div>
</template>
