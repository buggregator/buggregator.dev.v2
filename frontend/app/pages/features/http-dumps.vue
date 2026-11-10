<script setup lang="ts">
import FeatureTips from '~/components/tips/FeatureTips.vue'
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import HttpDumpVisual from '~/components/features/visuals/HttpDumpVisual.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'Inspect HTTP Requests and Webhooks Locally — Buggregator',
  description: 'Capture any HTTP request: method, URL, headers, cookies, form data and uploaded files, and a cURL command to send it again. A local webhook.site for development. Free and open source.',
  ogTitle: 'HTTP Dumps — See Every Request That Arrives — Buggregator',
  ogDescription: 'Headers, body, cookies, files and a cURL command for every captured request. No account.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'HTTP Dumps — See Every Request That Arrives — Buggregator',
  twitterDescription: 'Headers, body, cookies, files and a cURL command for every captured request. No account.',
})

const accentColor = '#22c55e'

const steps = [
  {
    title: 'Start Buggregator',
    description: `HTTP dumps arrive on port 8000, the same port as the UI. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
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
    title: 'Mark the request as a dump',
    description: 'Send any HTTP request to Buggregator and mark it in one of two ways: the user name http-dump in the URL, or the X-Buggregator-Event header. A third-party service on the internet can only reach Buggregator at a public address.',
    tabs: [
      {
        id: 'userinfo',
        label: 'URL user name',
        code: '$ curl \'http://http-dump@127.0.0.1:8000/any/path?foo=bar\'',
      },
      {
        id: 'header',
        label: 'Header',
        code: `$ curl 'http://127.0.0.1:8000/any/path?foo=bar' \\
  --header 'X-Buggregator-Event: http-dump'`,
      },
      {
        id: 'webhook',
        label: 'Webhook URL',
        code: `# Your app sends webhooks or callbacks to this URL during development
WEBHOOK_URL=http://http-dump@127.0.0.1:8000/webhooks/orders`,
      },
    ],
  },
  {
    title: 'See the request',
    description: 'Open http://127.0.0.1:8000. The request appears with its headers, body, files and a cURL command. In Docker Compose, use the service name instead of 127.0.0.1.',
  },
]

const highlights = [
  {
    icon: '\u{1F4E8}',
    title: 'The whole request',
    description: 'Method, path, host, query parameters, headers and cookies.',
  },
  {
    icon: '\u{1F4DD}',
    title: 'Form data and files',
    description: 'Submitted fields and uploaded files — download any file from the UI.',
  },
  {
    icon: '\u{1F501}',
    title: 'Replay with cURL',
    description: 'Every request as a ready cURL command: URL, headers and body. Paste it in a terminal and the same request arrives again. Uploaded files are named, not attached.',
  },
  {
    icon: '\u{1FA9D}',
    title: 'Webhook development',
    description: 'Point the sender at Buggregator and see exactly what it sends, before you write the handler.',
  },
  {
    icon: '\u{1F50E}',
    title: 'Search',
    description: 'Find requests by host, method or URL.',
  },
  {
    icon: '\u{1F9ED}',
    title: 'Need the response too?',
    description: 'HTTP Proxy records request and response for outgoing calls; Mock Server answers with a response you define — and each call shows up here.',
  },
]

const worksWithItems = [
  { name: 'curl', detail: '— http://http-dump@127.0.0.1:8000/...' },
  { name: 'PHP', detail: '— Guzzle, Laravel HTTP, Symfony HttpClient' },
  { name: 'JavaScript', detail: '— fetch, axios (X-Buggregator-Event header)' },
  { name: 'Webhook senders', detail: '— set the webhook URL to Buggregator' },
  { name: 'Any language', detail: '— any HTTP client that can set a URL or a header' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See exactly what the request contained"
      subtitle="HTTP Dumps"
      description="You're building a webhook, a callback or an API client, and you need to see what actually goes over the wire. Send the request to Buggregator: you get the method, URL, headers, cookies, form data and uploaded files — and a cURL command to send it again. No separate service like webhook.site."
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
          <span class="font-mono text-xs text-on-dark-muted">Any HTTP client · port 8000</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Built screen (example data) -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="Buggregator HTTP dump: method, path, headers, query, form data and files"
          caption="A captured request with its headers, query, form data and files. Example data."
        >
          <HttpDumpVisual />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Everything that came over the wire"
      subtitle="Build and debug webhooks and API calls without logging code or a third-party inbox."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with anything that speaks HTTP"
      description="No SDK. Change the URL, add a user name or a header."
      :items="worksWithItems"
    />

    <FeatureTips label="HTTP dumps" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/http-dumps.html">
      <template #related>
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/mock-server" label="Mock Server" color="#0ea5e9" />
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
      </template>
    </FeatureCTA>
  </div>
</template>
