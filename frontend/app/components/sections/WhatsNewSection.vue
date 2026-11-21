<script setup lang="ts">
const { t } = useI18n()

const docs = 'https://docs.buggregator.dev'

const cards = [
  {
    key: 'otel',
    href: `${docs}/config/opentelemetry.html`,
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'graphs',
    href: '/features/sentry',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
]

const alsoLinks = [
  { key: 'filters', href: `${docs}/config/opentelemetry.html#where-you-see-it` },
  { key: 'notes', href: 'https://github.com/buggregator/server/releases/tag/v2.12.0' },
]
</script>

<template>
  <section
    id="whats-new"
    class="py-20 lg:py-28 bg-section-dark border-t border-landing-border-subtle"
    aria-labelledby="whats-new-title"
  >
    <div class="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <p class="text-sm font-mono text-accent mb-3">
          {{ t('whatsNew.eyebrow') }}
        </p>
        <h2 id="whats-new-title" class="text-section font-bold text-white mb-3 font-sans">
          {{ t('whatsNew.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article
          v-for="card in cards"
          :key="card.key"
          class="rounded-xl bg-black/40 border border-white/[0.08] p-6 flex flex-col"
        >
          <div class="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center mb-4" v-html="card.icon" />
          <h3 class="text-lg font-semibold text-white mb-2 font-sans">
            {{ t(`whatsNew.cards.${card.key}.title`) }}
          </h3>
          <p class="text-sm text-on-dark-secondary font-sans leading-relaxed mb-5 flex-1">
            {{ t(`whatsNew.cards.${card.key}.desc`) }}
          </p>
          <div class="flex flex-wrap gap-x-5 gap-y-2">
            <a
              :href="card.href"
              :target="card.href.startsWith('http') ? '_blank' : undefined"
              :rel="card.href.startsWith('http') ? 'noopener' : undefined"
              class="text-sm font-medium text-accent hover:underline font-sans"
            >
              {{ t(`whatsNew.cards.${card.key}.cta`) }} →
            </a>
            <a
              v-for="link in card.links"
              :key="link.key"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="text-sm font-medium text-accent hover:underline font-sans"
            >
              {{ t(`whatsNew.cards.${card.key}.links.${link.key}`) }} →
            </a>
          </div>
        </article>
      </div>

      <p class="mt-8 text-center text-sm text-on-dark-secondary font-sans leading-relaxed">
        {{ t('whatsNew.also.lead') }}
        <a :href="alsoLinks[0].href" target="_blank" rel="noopener" class="text-accent hover:underline">{{ t('whatsNew.also.filters') }}</a>{{ t('whatsNew.also.and') }}
        <a :href="alsoLinks[1].href" target="_blank" rel="noopener" class="text-accent hover:underline">{{ t('whatsNew.also.notes') }}</a>.
      </p>
    </div>
  </section>
</template>
