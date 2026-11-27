<script setup lang="ts">
const { t } = useI18n()

// An `href` starting with http opens in a new tab; others are pages of this site.
const cards = [
  {
    key: 'conditions',
    href: '/features/mock-server#conditions',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'missed',
    href: '/features/mock-server',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'recursion',
    href: '/features/profiler',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'traces',
    href: 'https://github.com/buggregator/frontend/releases/tag/1.44.0',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
]

const notesHref = 'https://github.com/buggregator/server/releases/tag/v2.16.0'

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
