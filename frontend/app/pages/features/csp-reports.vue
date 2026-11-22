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

const seoTitle = 'Catch CSP Violation Reports Locally: report-uri and report-to — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'See what your Content Security Policy blocks while you write it. Buggregator catches report-uri and Reporting API (report-to) reports from the browser: the page, the rule, what was blocked and where. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'What your Content Security Policy blocks, while you write it: the page, the rule, what was blocked and where.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'What your Content Security Policy blocks, while you write it. report-uri and report-to.',
})

const accentColor = '#d946ef'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Requires Buggregator v2.13.0 or later. Reports arrive on port 8000, the same port as the UI. Nothing to turn on. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
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
    title: 'Point the browser’s reports at Buggregator',
    description: 'The address is http://localhost:8000/csp/<project>; leave out /<project> for the default project. Start with Report-Only: the browser reports but blocks nothing.',
    tabs: [
      {
        id: 'report-uri',
        label: 'report-uri',
        code: 'Content-Security-Policy-Report-Only: default-src \'self\'; report-uri http://localhost:8000/csp/shop',
        note: 'Works everywhere, also over plain http.',
      },
      {
        id: 'report-to',
        label: 'report-to',
        code: `Reporting-Endpoints: buggregator="http://localhost:8000/csp/shop", default="http://localhost:8000/csp/shop"
Content-Security-Policy: default-src 'self'; report-to buggregator`,
        note: 'The endpoint named default also gets deprecation and intervention reports; browsers send those only there. report-to works only when both your app and the Buggregator address are https or localhost. Over plain http, for example http://buggregator:8000 from Docker, the browser drops the reports without an error: use report-uri there. You can set both.',
      },
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# .env
CSP_REPORT_URI=http://localhost:8000/csp/shop`,
        note: 'With spatie/laravel-csp.',
      },
      {
        id: 'curl',
        label: 'Try with curl',
        code: `curl -X POST http://localhost:8000/csp/shop \\
  -H 'Content-Type: application/csp-report' \\
  -d '{"csp-report":{"document-uri":"https://shop.test/checkout","effective-directive":"script-src-elem","blocked-uri":"https://cdn.example.com/x.js","disposition":"enforce"}}'
# {"status":true}`,
      },
    ],
  },
  {
    title: 'Open your page — see what the policy blocks',
    description: 'Each report request becomes one card in the feed. CSP reports in the menu lists only these events.',
  },
]

const highlights = [
  {
    icon: '\u{1F6E1}️',
    title: 'One line per blocked thing',
    description: 'The feed card shows the page, then one line per report, for example «script-src-elem blocked https://cdn.example.com/x.js». Report-only violations get a badge.',
  },
  {
    icon: '\u{1F4CD}',
    title: 'Where it happened',
    description: 'The event page shows the directive, the blocked resource, the file with line and column, the code sample and the message.',
  },
  {
    icon: '\u{1F4DC}',
    title: 'The full policy and raw report',
    description: 'Below each report: the policy the browser applied and the report exactly as it came.',
  },
  {
    icon: '\u{1F500}',
    title: 'report-uri and report-to',
    description: 'Both formats: the classic application/csp-report and the Reporting API list. A Reporting API request with several reports becomes one event.',
  },
  {
    icon: '\u{1F570}️',
    title: 'Deprecation warnings too',
    description: 'The Reporting API also tells you when your page uses a deprecated feature. Name the endpoint default to get those reports.',
  },
  {
    icon: '\u{1F4C1}',
    title: 'A project per app',
    description: 'Put the project in the path, /csp/shop: browsers send no headers of your own. A new name creates the project with its first report.',
  },
]

const worksWithItems = [
  { name: 'report-uri', detail: '— Content-Type application/csp-report' },
  { name: 'report-to', detail: '— the Reporting API, application/reports+json' },
  { name: 'Laravel', detail: '— spatie/laravel-csp, CSP_REPORT_URI' },
  { name: 'curl, scripts, proxies', detail: '— also the X-Buggregator-Project header' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See what your Content Security Policy blocks, before your users do"
      subtitle="CSP Reports"
      description="A Content Security Policy tells the browser which scripts, styles and images a page may load. When the browser blocks something, it can send a report. Point those reports at Buggregator, and you see what your policy blocks while you write it."
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
          <span class="font-mono text-xs text-on-dark-muted">One line in your policy: report-uri, or report-to with Reporting-Endpoints</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/csp-reports.png"
          alt="Buggregator CSP report: the page, the directive, the blocked resource and the file with line and column"
          caption="One report: the rule, what was blocked and where, with the full policy below."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="What was blocked, by which rule, where"
      subtitle="Every report the browser sends, readable, next to your other events."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">Tighten your policy without breaking checkout</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          Add the policy as Content-Security-Policy-Report-Only and click through your app. Nothing is blocked yet, but
          what the policy would block shows up in Buggregator, with the rule and the page. Allow
          what you need, and switch to the enforcing header once the reports stop.
        </p>
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with browser reports"
      description="One or two headers in your app. Buggregator takes both report formats browsers send."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">Good to know</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>report-to needs https or localhost on both sides. Over plain http, use report-uri.</li>
            <li>A report body may be at most 1 MB. An empty list or JSON that is not a report gets 400.</li>
            <li>Browsers may first send a CORS check (OPTIONS); Buggregator answers it.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="CSP reports" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/csp.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/http-dumps" label="HTTP Dumps" color="#22c55e" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/broadcast-events" label="Broadcast Events" color="#ec4899" />
      </template>
    </FeatureCTA>
  </div>
</template>
