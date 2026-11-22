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

const seoTitle = 'Request Timeline and N+1 Query Detection for Laravel, Locally — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'See everything one request did on one time scale: SQL queries, cache, logs, mails, outgoing calls, jobs and errors. Buggregator spots N+1 queries and, when the SDK sends it, the file and line. From Sentry traces, on your machine. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Queries, cache, logs, mails, outgoing calls, jobs and errors of one request on one time scale, with an N+1 hint.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Everything one request did on one time scale, with an N+1 hint that names the repeated query.',
})

const accentColor = '#f43f5e'

const mailHeaders = `use Illuminate\\Mail\\Mailables\\Headers;
use Sentry\\SentrySdk;

public function headers(): Headers
{
    $traceId = SentrySdk::getCurrentHub()->getSpan()?->getTraceId();

    return new Headers(text: $traceId ? ['X-Trace-Id' => (string) $traceId] : []);
}`

const logProcessor = `use Monolog\\LogRecord;
use Sentry\\SentrySdk;

$logger->pushProcessor(function (LogRecord $record): LogRecord {
    $span = SentrySdk::getCurrentHub()->getSpan();
    if ($span !== null) {
        $record->extra['trace_id'] = (string) $span->getTraceId();
    }

    return $record;
});`

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
    title: 'Send traces to Buggregator',
    description: 'The page is built from Sentry traces, so your app needs the Sentry SDK with tracing on. That is enough for queries, cache, outgoing calls and jobs.',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel .env',
        code: `SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
SENTRY_TRACES_SAMPLE_RATE=1.0
# the file and line of every query, not only of slow ones
SENTRY_TRACE_SQL_ORIGIN_THRESHOLD_MS=0`,
        note: 'sentry-laravel sends the file and line only for queries slower than this threshold, 100 ms by default. Set it to 0 on your dev machine.',
      },
    ],
  },
  {
    title: 'Put logs and mails on the same scale (optional)',
    description: 'Monolog logs, mails and HTTP dumps join the timeline when they carry the request’s trace id. Laravel’s Http:: client adds it to outgoing calls by itself. Logs and mails need a few lines in your app.',
    tabs: [
      {
        id: 'logs',
        label: 'Logs',
        code: logProcessor,
        note: 'A Monolog processor that writes the trace id into extra.trace_id.',
      },
      {
        id: 'mail',
        label: 'Mail',
        code: mailHeaders,
        note: 'In a Laravel Mailable: adds an X-Trace-Id header. Mailers send no trace id on their own.',
      },
    ],
  },
  {
    title: 'Open a trace',
    description: 'Open Sentry → Traces and click a trace. The Request tab opens first. Waterfall, Flame graph, Call graph and Sequence are still there.',
  },
]

const highlights = [
  {
    icon: '\u{1F5C2}',
    title: 'One lane per kind',
    description: 'Request, Queries, Cache, Logs, Dumps, Errors, HTTP out, Mail, Jobs, Views. Each item sits at the moment it happened.',
  },
  {
    icon: '\u{1F501}',
    title: 'N+1 hint',
    description: 'When one request runs the same SQL query five times or more, a hint names the query, the count, the time it took and, when the SDK sends it, the file and line.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Summary on top',
    description: 'For example 23 queries · 41 ms, 2 logs · 1 error, 1 mail. Parts with errors are red.',
  },
  {
    icon: '\u{1F9F1}',
    title: 'Repeats in one block',
    description: 'Five or more identical items in a lane, under the same parent, are drawn as one block marked ×N.',
  },
  {
    icon: '\u{1F517}',
    title: 'Logs, mails and HTTP dumps',
    description: 'They join the timeline by trace id. A log, mail or HTTP dump in the list links to its own page.',
  },
  {
    icon: '\u{1F4E1}',
    title: 'Also in the API',
    description: 'The trace API returns the N+1 findings as n_plus_one. The events of the same request: /api/events?trace=<id>.',
  },
]

const worksWithItems = [
  { name: 'Sentry SDK with tracing', detail: '— any SDK that sends transactions, e.g. sentry-laravel' },
  { name: 'Monolog', detail: '— with the trace id in extra.trace_id or context.trace_id' },
  { name: 'Email', detail: '— with an X-Trace-Id, sentry-trace or traceparent header' },
  { name: 'HTTP dumps', detail: '— with a sentry-trace or traceparent header; Laravel Http:: adds it' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See everything one request did, in order"
      subtitle="Request Timeline"
      description="GET /posts is slow. Open its trace and see 23 queries, 20 of them the same select from users, next to the log lines and the mail this request sent. Buggregator draws them on one time scale and points to the N+1 query. On your machine, from your Sentry traces."
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
          <span class="font-mono text-xs text-on-dark-muted">Sentry traces · N+1 hint</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/request-timeline.png"
          alt="Buggregator Request tab of a trace: an N+1 hint for 20 identical user queries, lanes for queries, cache and views, and the list of items by time"
          caption="The Request tab of GET /posts: 23 queries in 10 ms, 20 of them the same, with the line in PostController that runs them."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="One request, one screen"
      subtitle="No more jumping between the query log, the log file and the mail catcher to piece one request together."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">Why is the posts page slow?</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          The page lists 20 posts with their authors. The hint above the timeline says: 20 identical queries
          select * from users where id = ?, from PostController.php line 31. Each post loads its author on its own.
          Add with('user') to the query, reload the page, and the 20 author queries become one.
        </p>
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Built on the Sentry traces you already send"
      description="No new package. Logs, mails and HTTP dumps join when they carry the trace id."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">Good to know</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>Needs Sentry tracing on, for example SENTRY_TRACES_SAMPLE_RATE=1.0.</li>
            <li>Queries count as the same when only their numbers, strings and IN (…) lists differ.</li>
            <li>The file and line show only when the SDK sends them. Queries from lazy-loaded relations such as $post->user often come without them.</li>
            <li>Only Monolog logs, mails and HTTP dumps are linked by trace id. Ray and VarDumper events are not.</li>
            <li>Mails and HTTP dumps stored before the upgrade are not linked.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="request timeline" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/request-timeline.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/queue-jobs" label="Queue Jobs" color="#a855f7" />
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
      </template>
    </FeatureCTA>
  </div>
</template>
