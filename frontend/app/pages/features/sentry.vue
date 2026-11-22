<script setup lang="ts">
import FeatureTips from '~/components/tips/FeatureTips.vue'
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

const seoTitle = 'Local Sentry and OpenTelemetry for Development: Errors, Traces, Logs — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'Point your Sentry SDK or OpenTelemetry at Buggregator and see Sentry errors, traces, logs and metrics and OpenTelemetry traces and logs on your own machine. Flame graph, call graph, service map. No account, nothing sent to the cloud. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Errors, traces, logs and metrics from your Sentry SDK, traces and logs from OpenTelemetry, on your own machine. Change one address.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Errors, traces, logs and metrics from your Sentry SDK, traces and logs from OpenTelemetry, locally.',
})

const accentColor = '#f43f5e'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Buggregator takes Sentry data on port 8000, next to the web UI. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
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
    title: 'Point your SDK at Buggregator',
    description: 'One line in your config. Put a project name in the DSN to keep each app\u2019s data apart. Using OpenTelemetry? Point its exporter at the same port.',
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
      {
        id: 'otel-sdk',
        label: 'OTel SDK',
        code: `OTEL_SERVICE_NAME=checkout
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`,
        note: 'Any language. The protocol must be http/protobuf or http/json: some SDKs default to gRPC, which Buggregator does not accept. OTEL_SERVICE_NAME is what the Service column shows.',
      },
      {
        id: 'otel-collector',
        label: 'OTel Collector',
        code: `exporters:
  otlphttp:
    endpoint: http://buggregator:8000

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlphttp]
    logs:
      receivers: [otlp]
      exporters: [otlphttp]`,
        note: 'Works with any Collector version; newer ones also call this exporter otlp_http. Add it to the pipelines you already have.',
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
    icon: '\u{1F525}',
    title: 'Trace graphs',
    description: 'Next to the waterfall, each trace has a flame graph, a call graph and a sequence diagram. Click a span to see its attributes, events, links and exception.',
  },
  {
    icon: '\u{1F5FA}\uFE0F',
    title: 'Service map',
    description: 'Which service calls which database, cache or API, with traffic over the period you pick. Click a service to see what it uses and what uses it, or a line to see its numbers and the traces through it.',
  },
  {
    icon: '\u{1F52D}',
    title: 'OpenTelemetry too',
    description: 'Traces and logs from any OTel SDK or the Collector land in the same tabs, labelled OTel or Sentry SDK. Filter traces by source and by service.',
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
  {
    icon: '\u{1F4AC}',
    title: 'User feedback with its error',
    description: 'Feedback from the Sentry feedback widget, captureFeedback or captureUserFeedback shows on the error it is about: name, email, message, page. The Feedback tab lists it all, also feedback sent without an error.',
  },
  {
    icon: '\u{1F514}',
    title: 'Desktop notifications',
    description: 'Working in another window? Turn them on in Settings, and each new error brings a notice; click it to open the error. Several errors within 10 seconds come as one. The tab must stay open; needs https or localhost.',
  },
  {
    icon: '\u{23F0}',
    title: 'Cron monitors',
    description: 'Sentry Crons check-ins land in a Crons tab: which scheduled runs went fine, failed, never started or never finished.',
    link: { href: '/features/cron-monitoring', label: 'Cron monitoring' },
  },
]

// «Works with», option A of the copy. Option B (eight platform
// rows) is a swap of this object only.
const worksWith = {
  title: 'Built on the Sentry SDK format',
  description: 'Buggregator reads what Sentry SDKs send: errors, traces, logs and metrics. We test it with the Sentry PHP SDK (versions 2.5, 3.22 and 4.x). Other SDKs send the same format; if one doesn\u2019t show up, tell us.',
  reportUrl: 'https://github.com/buggregator/server/issues',
  items: [
    { name: 'PHP', detail: '\u2014 sentry/sentry, Laravel, Symfony' },
    { name: 'Any Sentry SDK', detail: '\u2014 set the DSN and try it' },
    { name: 'OpenTelemetry', detail: '\u2014 any OTel SDK or the Collector, traces and logs over OTLP/HTTP' },
  ],
}
</script>

<template>
  <div>
    <FeatureHero
      title="Everything your Sentry SDK sends, on your machine"
      subtitle="Sentry, locally"
      description="Your app already has the Sentry SDK or OpenTelemetry. Change one address, and Buggregator shows errors, traces, logs and metrics from your Sentry SDK, traces and logs from OpenTelemetry — on your computer, each in its own tab, linked by trace. No account, no data leaving your machine."
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

    <!-- User feedback next to the error -->
    <section id="user-feedback" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="text-center mb-10">
          <h2 class="text-section font-bold text-white mb-3">«The pay button did nothing»: read it next to the error</h2>
          <p class="text-lg text-on-dark-secondary leading-relaxed">
            When a user sends feedback through your Sentry SDK, it shows on the error it is about, above the tabs: name,
            email, message, page and time. Nothing to set up beyond the usual DSN.
          </p>
        </div>
      </div>
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/sentry-user-feedback.png"
          alt="Buggregator Sentry error page with the user's feedback above the tabs: name, email, message and page"
          caption="Feedback tied to an error shows on that error's page. The Feedback tab lists all feedback for the project."
        />
      </div>
    </section>

    <!-- Use case: several services, one trace -->
    <section id="services" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="text-center mb-10">
          <h2 class="text-section font-bold text-white mb-3">Several services on your laptop? See one request go through all of them</h2>
          <p class="text-lg text-on-dark-secondary leading-relaxed">
            Your PHP app calls a Go service, which hands work to a worker. Point each one at the same Buggregator, with its
            Sentry SDK or with OpenTelemetry. A trace that crosses services shows every service it went through, and the
            service map shows who calls whom, with the failed calls in red.
          </p>
        </div>
      </div>
      <div class="px-4 sm:px-6 lg:px-8 space-y-10">
        <FeatureScreenshot
          src="/features/sentry-service-map.png"
          alt="Buggregator service map: shop-web calls checkout-api, which calls payments-worker; failed calls in red; a panel shows what checkout-api uses and what uses it"
          caption="Service map: which service calls which, with traffic over the period you pick. Click a service to see what it uses and what uses it."
        />
        <FeatureScreenshot
          src="/features/sentry-call-graph.png"
          alt="Call graph of one checkout request across three services: shop-web sends with the Sentry SDK, checkout-api and payments-worker with OpenTelemetry"
          caption="One request across three services as a call graph. shop-web sends with the Sentry SDK, the other two with OpenTelemetry."
        />
      </div>
      <p class="mt-8 text-center font-sans">
        <a
          href="https://docs.buggregator.dev/config/opentelemetry.html"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center min-h-[44px] text-sm text-accent hover:text-accent-hover transition-colors no-underline"
        >Set up OpenTelemetry</a>
      </p>
    </section>

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
            Your SDK doesn’t show up? Tell us on GitHub
          </a>
        </p>

        <!-- What it leaves out -->
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">What it leaves out</h2>
          <p class="text-sm leading-relaxed text-on-dark-secondary">
            Session replays, profiles, release health sessions, attachments and screenshots sent with user feedback are not kept.
            From OpenTelemetry: metrics and OTLP over gRPC (port 4317) are not accepted.
            For PHP profiling, use the
            <NuxtLink to="/features/profiler" class="text-accent hover:text-accent-hover no-underline">Profiler (XHProf) page</NuxtLink>.
          </p>
        </div>
      </div>
    </section>

    <FeatureTips label="Sentry" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/sentry.html">
      <template #related>
        <FeatureRelatedLink to="/features/cron-monitoring" label="Cron Monitoring" color="#84cc16" />
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
      </template>
    </FeatureCTA>
  </div>
</template>
