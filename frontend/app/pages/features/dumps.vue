<script setup lang="ts">
import FeatureTips from '~/components/tips/FeatureTips.vue'
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'ray(), dump() and dd() in One Local Window — Buggregator',
  description: 'Send ray(), dump() and dd() output to Buggregator instead of your HTML or JSON response. See each dump with the file and line it came from, next to your errors and logs. Free, open source, runs locally.',
  ogTitle: 'ray(), dump() and dd() in One Local Window — Buggregator',
  ogDescription: 'Your dumps in a browser tab, with the file and line they came from. Works for Laravel, Symfony and any PHP app.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'ray(), dump() and dd() in One Local Window — Buggregator',
  twitterDescription: 'Your dumps in a browser tab, with the file and line they came from.',
})

const accentColor = '#eab308'

const steps = [
  {
    title: 'Start Buggregator',
    description: `ray() goes to port 8000, the same port as the UI. dump() goes to port 9912. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:9912:9912 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:9912:9912`,
      },
    ],
  },
  {
    title: 'Point your app to Buggregator',
    description: 'Two lines in your .env. In Docker Compose, use the service name instead of 127.0.0.1: ray@buggregator and buggregator:9912.',
    tabs: [
      {
        id: 'ray',
        label: 'Laravel + Ray',
        code: `# php artisan ray:publish-config, then in .env:
RAY_HOST=ray@127.0.0.1
RAY_PORT=8000`,
      },
      {
        id: 'vardumper',
        label: 'dump() / dd()',
        code: `# composer require --dev symfony/var-dumper
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,
      },
      {
        id: 'php',
        label: 'PHP without .env',
        code: `$_SERVER['VAR_DUMPER_FORMAT'] = 'server';
$_SERVER['VAR_DUMPER_SERVER'] = '127.0.0.1:9912';`,
      },
      {
        id: 'rayphp',
        label: 'Ray, any PHP',
        code: `<?php
// ray.php in your project root
return [
    'enable' => true,
    'host' => 'ray@127.0.0.1',
    'port' => 8000,
];`,
      },
    ],
  },
  {
    title: 'Call dump() or ray() as usual',
    description: 'Each dump shows up in Buggregator right away, with the file and line it came from. Your page and your JSON response stay as they were.',
  },
]

const highlights = [
  {
    icon: '\u{1F9F9}',
    title: 'Your response stays clean',
    description: 'dump() no longer lands in your HTML or breaks a JSON response. The output goes to Buggregator instead.',
  },
  {
    icon: '\u{2699}️',
    title: 'Works in workers',
    description: 'Queue workers, RoadRunner and Swoole have no browser to print to. Their dumps still show up.',
  },
  {
    icon: '\u{1F4CC}',
    title: 'ray() without the Ray app',
    description: 'Keep your ray() calls. Point RAY_HOST at Buggregator and they land in a browser tab.',
  },
  {
    icon: '\u{1F5C2}️',
    title: 'Laravel-aware',
    description: 'Ray payloads for SQL queries, Eloquent models, jobs, mailables and events, each shown in its own way.',
  },
  {
    icon: '\u{1F517}',
    title: 'Open in your editor',
    description: 'Every dump shows the file and line it came from. Click it to open that line in your editor.',
  },
  {
    icon: '\u{1F4E6}',
    title: 'Next to everything else',
    description: 'Dumps sit in the same window as your exceptions, logs and emails. No second app to keep open.',
  },
]

const worksWithItems = [
  { name: 'Laravel', detail: '— ray(), dump(), dd()' },
  { name: 'Symfony', detail: '— dump(), dd() through VarDumper' },
  { name: 'Any PHP app', detail: '— symfony/var-dumper or spatie/ray' },
  { name: 'RoadRunner, Swoole', detail: '— and queue workers' },
  { name: 'Buggregator Trap', detail: '— trap(), tr(), td() helpers' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See every dump without breaking the page"
      subtitle="Dumps: Ray and VarDumper"
      description="dump() output lands in your HTML, breaks a JSON response or gets lost in a queue worker. Buggregator catches ray(), dump() and dd() and shows them in a browser tab, with the file and line they came from."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#setup"
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent-strong hover:bg-accent-strong-hover text-white font-sans font-medium text-sm rounded-xl transition-colors duration-150 no-underline"
          >
            Get started
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <span class="font-mono text-xs text-on-dark-muted">Works with ray(), dump() and dd()</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/img/tips/ray-calls-to-free-viewer.webp"
          :width="1280"
          :height="760"
          alt="Screenshot: ray() calls from a Laravel app in Buggregator, each with the file and line it came from"
          caption="ray() calls from a Laravel app: each one with its type and the line it came from."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Dumps where you can read them"
      subtitle="The same dump() and ray() calls you already write, in one window."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section class="py-16 lg:py-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <h2 class="text-2xl lg:text-[1.75rem] font-bold text-white tracking-tight mb-4">
          A dump() in a queue job
        </h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed mb-8">
          A job fails only in the worker. You add dump($payload), but the worker has no browser, and the output scrolls
          past in a terminal you are not watching. With Buggregator, the dump shows up in your browser tab with the
          file and line it came from.
        </p>
        <FeatureScreenshot
          src="/img/tips/dump-without-breaking-the-page.webp"
          :width="1280"
          :height="760"
          alt="Screenshot: a dump() of an order array in Buggregator, with the file and line it was called from"
          caption="A dump() of an order array, with the file and line it was called from."
        />
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with your PHP stack"
      description="Dumps come in through Symfony VarDumper or Spatie Ray. Laravel and Symfony use VarDumper for dump() and dd() already."
      :items="worksWithItems"
    />

    <FeatureTips label="dumps" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/var-dumper.html">
      <template #related>
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/xdebug" label="Xdebug" color="#f97316" />
      </template>
    </FeatureCTA>
  </div>
</template>
