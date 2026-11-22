<script setup lang="ts">
const { t } = useI18n()

// An `href` starting with http opens in a new tab; others are pages of this site.
const cards = [
  {
    key: 'broadcast',
    href: '/features/broadcast-events',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'crons',
    href: '/features/cron-monitoring',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'inbox',
    href: '/features/email-testing#send-to-inbox',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`,
    links: [] as { key: string, href: string }[],
  },
  {
    key: 'small',
    href: '/features/sentry#user-feedback',
    icon: `<svg class="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>`,
    links: [
      { key: 'csp', href: '/features/csp-reports' },
    ],
  },
]

const notesHref = 'https://github.com/buggregator/server/releases/tag/v2.13.0'

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
              {{ t(`whatsNew.cards.${card.key}.cta`) }} →
            </a>
            <a
              v-for="link in card.links"
              :key="link.key"
              :href="link.href"
              :target="isExternal(link.href) ? '_blank' : undefined"
              :rel="isExternal(link.href) ? 'noopener' : undefined"
              class="text-sm font-medium text-accent hover:underline font-sans"
            >
              {{ t(`whatsNew.cards.${card.key}.links.${link.key}`) }} →
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
