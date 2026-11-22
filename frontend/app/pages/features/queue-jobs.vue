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

const seoTitle = 'Laravel Queue Jobs, Failed Attempts and Retries, Locally — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'See the jobs your Laravel queue worker ran: which failed, how many attempts they took, the exception of each attempt, how long they waited and which request queued them. From Sentry traces, on your machine. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Which jobs failed, every attempt with its exception and the pause before it, and the request that queued the job.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Every attempt of a queue job with its exception, and the request that queued it. Locally.',
})

const accentColor = '#a855f7'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Requires Buggregator v2.14.0 or later. The UI and the Sentry endpoint are both on port 8000. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
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
    ],
  },
  {
    title: 'Turn on queue job tracing',
    description: 'The Queues tab is built from Sentry traces: sentry-laravel sends one transaction per job attempt. Tested with sentry-laravel 4.31.',
    tabs: [
      {
        id: 'env',
        label: '.env',
        code: `SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
SENTRY_TRACES_SAMPLE_RATE=1
SENTRY_TRACE_QUEUE_ENABLED=true`,
      },
      {
        id: 'config',
        label: 'config/sentry.php',
        code: `'tracing' => [
    'queue_job_transactions' => env('SENTRY_TRACE_QUEUE_ENABLED', true),
    // ...
],`,
        note: 'Only if your app has a published config/sentry.php: check that it reads the variable. A published config may have false as the default there.',
      },
    ],
  },
  {
    title: 'Restart the worker and open Sentry → Queues',
    description: 'Run php artisan queue:restart, so the worker reads the new settings. A job shows up when its attempt ends. Before the first job, the page at /sentry/queues shows the same setup steps.',
  },
]

const highlights = [
  {
    icon: '\u{274C}',
    title: 'Failed, retried or done',
    description: 'Each job’s status is the status of its last attempt: Done, Retried (worked after more than one attempt) or Failed.',
  },
  {
    icon: '\u{1F55C}',
    title: 'Every attempt on one time line',
    description: 'Attempts as bars with the pauses between them, for example 11 s before a retry. Each with its duration, wait time and exception.',
  },
  {
    icon: '\u{1F517}',
    title: 'Dispatched from',
    description: 'A link to the trace of the request that queued the job, for example /reports/send.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Tiles and filters',
    description: 'Jobs, failed, retried and average duration for the period. Filter by queue, or show failed jobs only.',
  },
  {
    icon: '\u{23F1}',
    title: 'Waited and ran',
    description: 'How long the job waited in the queue before it started, and how long its last attempt ran.',
  },
  {
    icon: '\u{1F916}',
    title: 'API and MCP',
    description: 'The same data at /api/sentry/queues/jobs and /summary, and through the MCP tool queue_jobs for AI agents.',
  },
]

const worksWithItems = [
  { name: 'Laravel', detail: '— sentry-laravel with SENTRY_TRACE_QUEUE_ENABLED=true' },
  { name: 'Any queue driver with a worker', detail: '— database, redis and others; not sync' },
  { name: 'Request timeline', detail: '— jobs a request queued are in its Jobs lane' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See why a queue job failed, attempt by attempt"
      subtitle="Queue Jobs"
      description="A SendReport job sends no mail at first. Open it and see three attempts on one time line, about 11 seconds apart: two failed with SMTP connection refused, the third worked. A link leads to /reports/send, the request that queued it. All on your machine, from your Sentry traces."
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
          <span class="font-mono text-xs text-on-dark-muted">Sentry → Queues · sentry-laravel</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/queue-jobs.png"
          alt="Buggregator job page: ChargeCustomer failed after 3 attempts, dispatched from POST /checkout, three attempts on a time scale with the pauses between them and the exception of each"
          caption="A job page: three failed attempts with the pauses between them, the exception of each, and the request that queued the job."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Every job your worker ran"
      subtitle="Attempts of the same job are put together by the job’s UUID, so a retried job is one row, not three."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Second screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/queue-jobs-list.png"
          alt="Buggregator Queues tab: tiles for jobs, failed, retried and average duration, queue and status filters, and a table of jobs"
          caption="Sentry → Queues: every job with its status, queue, attempts, duration and when it finished."
        />
      </div>
    </section>

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">The customer says the report never came</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          Open Sentry → Queues and pick Failed only. SendReport failed after 3 attempts, each with
          RuntimeException: SMTP connection refused, about 11 seconds apart. Dispatched from leads to the request
          that queued it. Now you know the job ran, why it failed, and that the retries did not help.
        </p>
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with Laravel queues through sentry-laravel"
      description="No new package: the Sentry SDK you already use sends the attempts."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">What it does not do</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>No running jobs: Sentry sends an attempt when it ends.</li>
            <li>Failed means the last attempt failed. Sentry does not say whether the worker will try again.</li>
            <li>No job payload: Sentry sends only the job’s class, queue and UUID.</li>
            <li>Buggregator does not retry jobs. Your worker does; Buggregator shows the attempts.</li>
            <li>Jobs on the sync driver run inside the request: they are in the request’s timeline, not on this page.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="queue jobs" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/queues.html">
      <template #related>
        <FeatureRelatedLink to="/features/request-timeline" label="Request Timeline" color="#f43f5e" />
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/cron-monitoring" label="Cron Monitoring" color="#84cc16" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
      </template>
    </FeatureCTA>
  </div>
</template>
