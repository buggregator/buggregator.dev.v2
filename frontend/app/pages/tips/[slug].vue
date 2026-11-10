<script setup lang="ts">
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import TipCard from '~/components/tips/TipCard.vue'
import TipProse from '~/components/tips/TipProse.vue'
import { formatTipDate, tipFeatureColor, tipFeatureKey, type TipPage } from '~/composables/useTips'

definePageMeta({ layout: 'landing' })
// English only, like the feature pages.
defineI18nRoute(false)

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data: tip, error } = await useFetch<TipPage>(() => `/api/tips/${slug.value}`, { key: `tip-${slug.value}` })

// A missing tip is a real 404 (status and the site's error page), not an empty page.
if (error.value || !tip.value) {
  throw createError({ statusCode: error.value?.statusCode ?? 404, statusMessage: 'Tip not found', fatal: true })
}

const { siteUrl } = useRuntimeConfig().public
const pageTitle = computed(() => `${tip.value!.title} — Buggregator Tips`)
// TODO(#4759): per-tip code card image; the site image until then.
const ogImage = 'https://buggregator.dev/buggregator.png'

useSeoMeta({
  title: pageTitle,
  description: () => tip.value!.description,
  ogTitle: pageTitle,
  ogDescription: () => tip.value!.description,
  ogImage,
  ogType: 'article',
  articlePublishedTime: () => tip.value!.published,
  articleModifiedTime: () => tip.value!.modified,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: () => tip.value!.description,
  twitterImage: ogImage,
})

// TechArticle, not HowTo: Google no longer shows HowTo rich results (proposal #4748 §1).
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: () => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: tip.value!.title,
      description: tip.value!.description,
      datePublished: tip.value!.published,
      dateModified: tip.value!.modified,
      wordCount: tip.value!.wordCount,
      inLanguage: 'en',
      image: ogImage,
      url: `${siteUrl}/tips/${tip.value!.slug}`,
      mainEntityOfPage: `${siteUrl}/tips/${tip.value!.slug}`,
      author: { '@type': 'Organization', name: 'Buggregator', url: `${siteUrl}/` },
      publisher: { '@type': 'Organization', name: 'Buggregator', url: `${siteUrl}/` },
      about: { '@type': 'SoftwareApplication', name: 'Buggregator', applicationCategory: 'DeveloperApplication' },
    }),
  }],
})

const installSteps = [
  {
    title: 'Start Buggregator',
    description: 'One file, installed with one command. The web UI opens on port 8000. Prefer containers? Use the Docker tab.',
    tabs: [
      { id: 'binary', label: 'Binary', binary: true },
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:1025:1025 -p 127.0.0.1:9912:9912 -p 127.0.0.1:9913:9913 ghcr.io/buggregator/server:{imageTag}',
      },
    ],
  },
]
</script>

<template>
  <div v-if="tip" class="bg-section-dark">
    <article class="pt-24 lg:pt-32 pb-16 lg:pb-20">
      <div class="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <nav aria-label="Breadcrumb" class="mb-6">
          <ol class="flex flex-wrap items-center gap-2 list-none p-0 m-0 font-mono text-xs text-on-dark-muted">
            <li><NuxtLink to="/tips" class="text-on-dark-muted hover:text-on-dark-secondary no-underline">Tips</NuxtLink></li>
            <li aria-hidden="true">/</li>
            <li>
              <NuxtLink
                :to="{ path: '/tips', query: { feature: tipFeatureKey(tip.feature) } }"
                class="inline-flex items-center gap-2 text-on-dark-muted hover:text-on-dark-secondary no-underline"
              >
                <span class="w-1.5 h-1.5 rounded-full" :style="{ background: tipFeatureColor(tip.feature) }" />
                {{ tip.feature }}
              </NuxtLink>
            </li>
          </ol>
        </nav>

        <h1 class="text-[2rem] lg:text-[2.5rem] leading-tight font-bold text-white tracking-tight mb-6">{{ tip.title }}</h1>

        <TipProse :html="tip.answerHtml" lead />

        <section v-for="section in tip.sections" :key="section.title" class="mt-12">
          <h2 class="text-2xl font-bold text-white tracking-tight mb-5">{{ section.title }}</h2>
          <TipProse :html="section.html" />
        </section>

        <div class="mt-10 pt-6 border-t border-landing-border-subtle flex flex-col gap-2 text-sm text-on-dark-secondary">
          <p>
            Docs:
            <a :href="tip.docs" target="_blank" rel="noopener" class="text-accent no-underline hover:underline break-all">{{ tip.docs.replace(/^https?:\/\//, '') }}</a>
          </p>
          <p v-if="tip.requires">Requires Buggregator {{ tip.requires }}+</p>
          <p v-if="tip.featurePage">
            <NuxtLink :to="tip.featurePage" class="text-accent no-underline hover:underline">More about {{ tip.feature }} in Buggregator</NuxtLink>
          </p>
        </div>

        <section v-if="tip.related.length" class="mt-12" aria-labelledby="related-tips">
          <h2 id="related-tips" class="text-xl font-bold text-white mb-4">Related tips</h2>
          <ul class="grid gap-4 sm:grid-cols-2 list-none p-0 m-0">
            <li v-for="r in tip.related" :key="r.slug">
              <TipCard :tip="r" heading-level="h3" />
            </li>
          </ul>
        </section>

        <p class="mt-10 font-mono text-xs text-on-dark-muted">
          Checked on <time :datetime="tip.checked.date">{{ formatTipDate(tip.checked.date) }}</time> with Buggregator {{ tip.checked.version }}
        </p>
      </div>
    </article>

    <FeatureSetup :steps="installSteps" />
  </div>
</template>
