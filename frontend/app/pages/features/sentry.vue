<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import SentryTracesVisual from '~/components/features/visuals/SentryTracesVisual.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

const seoTitle = 'Local Sentry for Development: Errors, Traces, Logs, Metrics — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'Point your Sentry SDK at Buggregator and see errors, traces, logs and metrics on your own machine. No Sentry account, nothing sent to the cloud. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Errors, traces, logs and metrics from your Sentry SDK, on your own machine. Change one DSN.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Errors, traces, logs and metrics from your Sentry SDK, locally.',
})

const accentColor = '#f43f5e'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'Buggregator takes Sentry data on port 8000, next to the web UI.',
    tabs: [
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000`,
      },
      {
        id: 'binary',
        label: 'Binary',
        code: `# Download the binary for your platform
$ curl -L https://github.com/buggregator/server/releases/latest/download/buggregator-linux-amd64 -o buggregator
$ chmod +x buggregator
$ ./buggregator`,
      },
    ],
  },
  {
    title: 'Point your SDK at Buggregator',
    description: 'One line in your config. Put a project name in the DSN to keep each app\u2019s data apart.',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# .env
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/my-app`,
      },
      {
        id: 'symfony',
        label: 'Symfony',
        code: `# .env
SENTRY_DSN=http://sentry@127.0.0.1:8000/my-app`,
      },
      {
        id: 'php',
        label: 'PHP',
        code: `\\Sentry\\init([
    'dsn' => 'http://sentry@127.0.0.1:8000/my-app',
]);`,
      },
      {
        id: 'javascript',
        label: 'JavaScript',
        code: `Sentry.init({
    dsn: 'http://sentry@127.0.0.1:8000/1',
});`,
        note: 'The JavaScript SDK takes only a number here, so its data goes to the \u201cdefault\u201d project.',
      },
      {
        id: 'any',
        label: 'Any SDK',
        code: `SENTRY_DSN=http://sentry@127.0.0.1:8000/my-app`,
      },
    ],
  },
  {
    title: 'Turn on what you want to see',
    description: 'Errors arrive as soon as the DSN is set. Traces, logs and metrics are SDK features: switch them on in your app.',
    tabs: [
      {
        id: 'traces',
        label: 'Traces',
        code: `\\Sentry\\init([
    'dsn' => 'http://sentry@127.0.0.1:8000/my-app',
    'traces_sample_rate' => 1.0, // send every trace while you develop
]);`,
        note: 'Laravel: SENTRY_TRACES_SAMPLE_RATE=1.0 in .env.',
      },
      {
        id: 'logs',
        label: 'Logs',
        code: `\\Sentry\\logger()->info('Order %s paid', [42]);
\\Sentry\\logger()->flush(); // at the end of the request or job`,
        note: 'Needs sentry/sentry 4.12 or newer. Before 4.31, also set \'enable_logs\' => true in init.',
      },
      {
        id: 'metrics',
        label: 'Metrics',
        code: `\\Sentry\\traceMetrics()->count('orders.created', 1);
\\Sentry\\traceMetrics()->distribution('checkout.time', 182, unit: \\Sentry\\Unit::millisecond());`,
        note: 'Needs sentry/sentry 4.20 or newer (traceMetrics()).',
      },
    ],
  },
  {
    title: 'Trigger an error \u2014 follow it into the trace',
    description: 'Throw an exception in a request. Buggregator shows it with the stack trace and context, and a small waterfall of the request it happened in. Open the full trace to see every query and call around it.',
  },
]

const highlights = [
  {
    icon: '\u{1F4DA}',
    title: 'Errors with full context',
    description: 'Stack trace frame by frame, breadcrumbs, request, tags, device, modules. Show them one by one, or grouped by type with a count. Click a frame to open it in your IDE.',
  },
  {
    icon: '\u{1F30A}',
    title: 'Traces as a waterfall',
    description: 'Every span of a request on a timeline: database queries, cache, HTTP calls, queues \u2014 each marked by type. The bar shows how long it took; failed spans are tagged.',
  },
  {
    icon: '\u{1F5FA}\uFE0F',
    title: 'Service map',
    description: 'Which service calls which database, cache or API, with request counts and average time. Links turn amber or red when calls fail. Built from the last hour of traces.',
  },
  {
    icon: '\u{1F4DC}',
    title: 'Sentry logs',
    description: 'Structured logs from the SDK, filtered by level. Open a line to see its attributes; jump to its trace.',
  },
  {
    icon: '\u{1F4C8}',
    title: 'Sentry metrics',
    description: 'Counters, gauges and distributions as your code sends them, with unit and attributes. Filter by type or by part of the name.',
  },
  {
    icon: '\u{1F517}',
    title: 'Linked by trace',
    description: 'An error shows its trace in a small waterfall; a trace lists the errors that happened in it; logs and metrics link to their trace.',
  },
]

// «Works with», option A of the copy (#4527). Option B (eight platform
// rows) is a swap of this object only.
const worksWith = {
  title: 'Built on the Sentry SDK format',
  description: 'Buggregator reads what Sentry SDKs send: errors, traces, logs and metrics. We test it with the Sentry PHP SDK (versions 2.5, 3.22 and 4.x). Other SDKs send the same format; if one doesn\u2019t show up, tell us.',
  reportUrl: 'https://github.com/buggregator/server/issues',
  items: [
    { name: 'PHP', detail: '\u2014 sentry/sentry, Laravel, Symfony' },
    { name: 'Any Sentry SDK', detail: '\u2014 set the DSN and try it' },
  ],
}
</script>

<template>
  <div>
    <FeatureHero
      title="Everything your Sentry SDK sends, on your machine"
      subtitle="Sentry, locally"
      description="Your app already has the Sentry SDK. Change the DSN, and Buggregator shows its errors, traces, logs and metrics on your computer — each in its own tab, linked by trace. No Sentry account, no data leaving your machine."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#setup"
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent-strong hover:bg-accent-strong-hover text-white font-sans font-medium text-sm rounded-xl transition-colors duration-150 no-underline"
          >
            Set it up
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <span class="font-mono text-xs text-on-dark-muted">Tested with the Sentry PHP SDK</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Built screen (example data) -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="Buggregator Sentry page: Traces tab with a waterfall of spans for one request"
          caption="One request as a trace: database, cache and HTTP calls on a timeline, with the failing call marked. Example data."
        >
          <SentryTracesVisual />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Four kinds of data, one place"
      subtitle="Each kind has its own tab for the project and period you pick. New data shows up without a reload."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      :title="worksWith.title"
      :description="worksWith.description"
      :items="worksWith.items"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 font-sans">
        <p class="text-center">
          <a
            :href="worksWith.reportUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover transition-colors no-underline"
          >
            Your SDK doesn’t show up? Tell us on GitHub →
          </a>
        </p>

        <!-- What it leaves out -->
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">What it leaves out</h2>
          <p class="text-sm leading-relaxed text-on-dark-secondary">
            Session replays, profiles, cron check-ins, release health sessions and attachments are not kept.
            For PHP profiling, use the
            <NuxtLink to="/features/profiler" class="text-accent hover:text-accent-hover no-underline">Profiler (XHProf) page</NuxtLink>.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/sentry.html">
      <template #related>
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
      </template>
    </FeatureCTA>
  </div>
</template>
