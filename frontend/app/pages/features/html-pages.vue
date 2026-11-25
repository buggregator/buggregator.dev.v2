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

const seoTitle = 'Send Your Own HTML Page as a Debug Event: Reports, Previews — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'Send a test report, a nightly job summary or a markup preview to Buggregator with one POST. It shows the page as it is, with its own CSS and JavaScript, in a sandbox, next to your errors and logs. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'One POST with your HTML, and Buggregator shows the page with its own CSS and JavaScript, next to your other events.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'A test report, a job summary, a markup preview: send the HTML, see the page as it is, scripts and styles included.',
})

const accentColor = '#14b8a6'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'Requires Buggregator v2.15.0 or later. HTML pages are on by default.',
    tabs: [
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
    ],
  },
  {
    title: 'Send a page',
    description: 'One POST with the markup. The page’s <title> becomes the title of the event. Add a project key to the address to put it in a project: http://html:shop@127.0.0.1:8000.',
    tabs: [
      {
        id: 'curl',
        label: 'curl',
        code: `curl -X POST http://html@127.0.0.1:8000 \\
  -H 'Content-Type: text/html' \\
  --data '<title>Nightly report</title><h1>All green</h1>'`,
      },
      {
        id: 'php',
        label: 'PHP',
        code: `$html = '<title>Import finished</title><p>1 204 rows, 3 skipped</p>';

file_get_contents('http://127.0.0.1:8000/html', false, stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: text/html; charset=utf-8',
        'content' => $html,
    ],
]));`,
      },
      {
        id: 'json',
        label: 'JSON',
        code: `curl -X POST http://127.0.0.1:8000/html/shop \\
  -H 'Content-Type: application/json' \\
  --data '{"title": "Checkout experiment", "html": "<p>Variant B</p>"}'`,
        note: 'JSON sets the title yourself. It needs Content-Type: application/json; without it, the JSON text itself is stored as the page.',
      },
    ],
  },
  {
    title: 'Open it',
    description: 'The page shows in the feed as a card with a small picture of it. Open the event to see the page at full height with its scripts running, or switch to Source for the markup.',
  },
]

const highlights = [
  {
    icon: '\u{1F3A8}',
    title: 'Your CSS and JavaScript run',
    description: 'The page works as in a browser tab: styles apply and scripts run, so a report can draw its own chart.',
  },
  {
    icon: '\u{1F6E1}️',
    title: 'In a sandbox',
    description: 'The page cannot read Buggregator’s cookies, storage or sign-in, and cannot change the page around it. Its calls to the Buggregator API get 403.',
  },
  {
    icon: '\u{1F5BC}️',
    title: 'A picture in the feed',
    description: 'The feed card shows your page with its CSS and no scripts, so a busy feed stays fast. Open the event to run the scripts.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Found by search',
    description: 'Search finds a page by its title and visible text, next to your errors, logs and dumps.',
  },
  {
    icon: '\u{1F4C4}',
    title: 'Preview and Source',
    description: 'The event page has two tabs: the page as it is, at full height, and its markup.',
  },
  {
    icon: '\u{1F916}',
    title: 'Readable by your AI agent',
    description: 'GET /api/events?type=html and the MCP tool event_get return the title and the markup, so Claude Code or Cursor can read the page too.',
  },
]

const worksWithItems = [
  { name: 'Any language', detail: '— one HTTP POST with the markup' },
  { name: 'Test runners and CI jobs', detail: '— a run summary with links to the full results' },
  { name: 'Cron jobs and imports', detail: '— what the job did, as a short page' },
  { name: 'Ray', detail: '— ray()->html() shows as a page with its CSS' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Send your own HTML page. See it as it is."
      subtitle="HTML Pages"
      description="A test report, a nightly job summary, a preview of some markup: anything Buggregator has no special screen for. Send the HTML in one POST, and Buggregator shows the page with its own CSS and JavaScript, in a sandbox, next to your errors and logs."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#setup"
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent-strong hover:bg-accent-strong-hover text-white font-sans font-medium text-sm rounded-xl transition-colors duration-150 no-underline"
          >
            Send your first page
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <span class="font-mono text-xs text-on-dark-muted">POST http://html@127.0.0.1:8000</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/html-pages.png"
          alt="Buggregator showing a nightly test report sent as an HTML page: tiles with passed and failed tests, a bar chart drawn by the page's own script, and the failed tests"
          caption="A nightly test report, sent as HTML. Its bar chart is drawn by the page’s own script."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Your page, as you made it"
      subtitle="No template to fit into: send the HTML you already have."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">The nightly run, waiting for you in the morning</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          Your test suite runs at night. At the end, it sends a short HTML page: how many tests passed, which three
          failed and where, how long the run took. In the morning it is in Buggregator, next to the errors those tests
          threw, and a click opens the full report with its chart.
        </p>
      </div>
      <div class="mt-10 px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/html-pages-feed.png"
          alt="The Buggregator feed with two HTML pages as cards: a checkout experiment with a Pay now button and a nightly test report, each with Open the page"
          caption="In the feed, each page is a card with a picture of it. Open the page to run its scripts."
        />
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Anything that can send an HTTP request"
      description="If it can POST some HTML, it can show a page in Buggregator."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">Good to know</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>Up to 1 MB per page. A page over 32 KB shows its text in the feed instead of a picture.</li>
            <li>Do not send pages whose script sends a new HTML event each time it opens: that fills the feed in a loop.</li>
            <li>Turn it off with modules.html: false, or leave html out of CLIENT_SUPPORTED_EVENTS.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="HTML pages" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/html.html">
      <template #related>
        <FeatureRelatedLink to="/features/dumps" label="Dumps (Ray, VarDumper)" color="#a855f7" />
        <FeatureRelatedLink to="/features/http-dumps" label="HTTP dumps" color="#10b981" />
        <FeatureRelatedLink to="/features/mcp-api" label="MCP & API" color="#eab308" />
      </template>
    </FeatureCTA>
  </div>
</template>
