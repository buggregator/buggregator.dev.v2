<script setup lang="ts">
const { t } = useI18n()

// An `href` starting with http opens in a new tab; others are pages of this site.
const cards = [
  {
    key: 'timeline',
    href: '/features/request-timeline',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h6M17 15l3 3-3 3" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'queues',
    href: '/features/queue-jobs',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h10M18 15v4m0 0l-2-2m2 2l2-2" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'logs',
    href: '/features/logs',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'filters',
    href: '/features/feed-filters',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
]

const notesHref = 'https://github.com/buggregator/server/releases/tag/v2.14.0'

const isExternal = (href: string) => href.startsWith('http')
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
              :target="isExternal(card.href) ? '_blank' : undefined"
              :rel="isExternal(card.href) ? 'noopener' : undefined"
              class="text-sm font-medium text-accent hover:underline font-sans"
            >
              {{ t(`whatsNew.cards.${card.key}.cta`) }}
            </a>
            <a
              v-for="link in card.links"
              :key="link.key"
              :href="link.href"
              :target="isExternal(link.href) ? '_blank' : undefined"
              :rel="isExternal(link.href) ? 'noopener' : undefined"
              class="text-sm font-medium text-accent hover:underline font-sans"
            >
              {{ t(`whatsNew.cards.${card.key}.links.${link.key}`) }}
            </a>
          </div>
        </article>
      </div>

      <p class="mt-8 text-center text-sm text-on-dark-secondary font-sans leading-relaxed">
        <a :href="notesHref" target="_blank" rel="noopener" class="text-accent hover:underline">{{ t('whatsNew.notes') }}</a>.
      </p>
    </div>
  </section>
</template>
