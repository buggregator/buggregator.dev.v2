<script setup lang="ts">
import ArchDiagram from '~/components/sections/CleanAppSection/ArchDiagram.vue'
import DevEnvBlock from '~/components/sections/CleanAppSection/DevEnvBlock.vue'
import EnvComparison from '~/components/sections/CleanAppSection/EnvComparison.vue'
import ComparisonTable from '~/components/sections/CleanAppSection/ComparisonTable.vue'

const { t } = useI18n()

const pillars = [
  {
    key: 'noDeps',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>`,
  },
  {
    key: 'oneEnvVar',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" /></svg>`,
  },
  {
    key: 'crossProject',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
  },
]
</script>

<template>
  <section id="why-buggregator" class="py-20 lg:py-28 bg-section-light">
    <div class="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-on-light-primary mb-3 tracking-tight font-sans">
          {{ t('cleanApp.headline') }}
        </h2>
        <p class="text-xl font-semibold text-accent mb-4 font-sans">
          {{ t('cleanApp.subheadline') }}
        </p>
        <p class="text-lg text-on-light-muted max-w-2xl mx-auto leading-relaxed font-sans">
          {{ t('cleanApp.body') }}
        </p>
      </div>

      <!-- Three pillars -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          v-for="p in pillars"
          :key="p.key"
          class="bg-white border border-[#e5e7eb] rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
        >
          <div class="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center mb-4" v-html="p.icon" />
          <h3 class="font-semibold text-on-light-primary mb-2 font-sans">
            {{ t(`cleanApp.pillars.${p.key}.title`) }}
          </h3>
          <p class="text-sm text-on-light-muted leading-relaxed font-sans">
            {{ t(`cleanApp.pillars.${p.key}.body`) }}
          </p>
        </div>
      </div>

      <!-- Architecture diagram -->
      <ArchDiagram class="mb-16" />

      <!-- Divider -->
      <div class="my-16" />

      <!-- Dev environment block -->
      <DevEnvBlock class="mb-16" />

      <!-- Env before/after comparison -->
      <EnvComparison class="mb-16" />

      <!-- Comparison table -->
      <div class="pt-8">
        <h3 class="text-2xl font-bold text-on-light-primary mb-6 text-center font-sans">
          {{ t('cleanApp.table.title') }}
        </h3>
        <ComparisonTable />
      </div>

      <!-- Jump to install CTA -->
      <div class="text-center mt-10">
        <a
          href="#how-it-works"
          class="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors no-underline font-sans"
        >
          Ready to try it? Jump to install →
        </a>
      </div>
    </div>
  </section>
</template>
