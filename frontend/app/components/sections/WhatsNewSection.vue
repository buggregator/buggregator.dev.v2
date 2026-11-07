<script setup lang="ts">
const { t } = useI18n()

const docs = 'https://docs.buggregator.dev'

const cards = [
  {
    key: 'mock',
    href: `${docs}/config/mock-server.html`,
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l-3 3 3 3m8-6l3 3-3 3M13 7l-2 10" /></svg>`,
    links: [],
  },
  {
    key: 'ai',
    href: `${docs}/config/mcp.html`,
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
    links: [{ key: 'xdebug', href: `${docs}/config/xdebug.html` }],
  },
]

const alsoLinks = [
  { key: 'pwa', href: `${docs}/config/pwa.html` },
  { key: 'sentry', href: `${docs}/config/sentry.html#projects` },
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
              target="_blank"
              rel="noopener"
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
        <a :href="alsoLinks[0].href" target="_blank" rel="noopener" class="text-accent hover:underline">{{ t('whatsNew.also.pwa') }}</a>{{ t('whatsNew.also.and') }}
        <a :href="alsoLinks[1].href" target="_blank" rel="noopener" class="text-accent hover:underline">{{ t('whatsNew.also.sentry') }}</a>.
      </p>
    </div>
  </section>
</template>
