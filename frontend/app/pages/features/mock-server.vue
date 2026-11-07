<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import MockServerTab from '~/components/showcase/tabs/MockServerTab.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'Mock Server — Fake API Responses for Local Development — Buggregator',
  description: 'Fake any API in a minute: method and path in, status, headers, body and delay out. Every call is captured, with the rule that answered. Rules in the UI, the REST API or buggregator.yaml for CI. Free and open source.',
  ogTitle: 'Mock Server — Fake API Responses — Buggregator',
  ogDescription: 'Fake the API you are waiting for. Status, headers, body and delay per rule. Every call captured.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Mock Server — Fake API Responses — Buggregator',
  twitterDescription: 'Fake the API you are waiting for. Status, headers, body and delay per rule. Every call captured.',
})

const accentColor = '#0ea5e9'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Requires Buggregator v2.6.0 or later. The mock server answers on the UI port, 8000. Nothing to turn on. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
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
    title: 'Add a rule',
    description: 'Open Mock server in the sidebar and add a rule, or define it in code. Rules are checked in order; the first enabled rule that matches answers.',
    tabs: [
      {
        id: 'yaml',
        label: 'buggregator.yaml',
        code: `mocks:
  - name: user
    method: GET
    path: /users/{id}
    status: 200
    headers: { Content-Type: application/json }
    body: '{"id": 1, "name": "Jane"}'
    delay: 150ms`,
      },
      {
        id: 'api',
        label: 'REST API',
        code: `$ curl -X POST http://127.0.0.1:8000/api/mocks \\
  -H 'Content-Type: application/json' \\
  -d '{"method": "POST", "path": "/orders", "status": 201, "body": "{\\"id\\": 7}", "delay_ms": 200}'`,
      },
    ],
  },
  {
    title: 'Point your app at /mock',
    description: 'Replace the API\'s base URL with http://127.0.0.1:8000/mock (rule paths go without the /mock prefix; in Docker Compose use the service name). Each call appears on the Mock server page: what your app sent, and what the mock answered.',
    tabs: [
      {
        id: 'curl',
        label: 'curl',
        code: `$ curl http://127.0.0.1:8000/mock/users/42
{"id": 1, "name": "Jane"}`,
      },
      {
        id: 'env',
        label: '.env',
        code: `# Before
PAYMENTS_API_URL=https://api.payments.example.com
# After
PAYMENTS_API_URL=http://127.0.0.1:8000/mock`,
      },
      {
        id: 'compose-env',
        label: 'Docker Compose',
        code: 'PAYMENTS_API_URL=http://buggregator:8000/mock',
      },
    ],
  },
]

const highlights = [
  {
    icon: '\u{1F4E6}',
    title: 'Any response',
    description: 'Status 100–599, your own headers, a body up to 1 MB. JSON, XML or plain text — whatever the real API sends.',
  },
  {
    icon: '\u{1F4A5}',
    title: 'Errors on demand',
    description: 'Answer 500 or 429 and see how your app handles a failing API.',
  },
  {
    icon: '\u{23F1}️',
    title: 'Slow responses',
    description: 'Add up to 30 seconds of delay to test timeouts, retries and loading states.',
  },
  {
    icon: '\u{1F9ED}',
    title: 'Path patterns',
    description: 'Exact paths, {id} for one segment, * for the rest: /users/me, /users/{id}, /files/*.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Why didn\'t it match?',
    description: 'An unmatched call gets 404 and is still captured, with the rules that almost matched and why: method, project or disabled. Start a rule from that request in one click — method and path prefilled.',
  },
  {
    icon: '\u{1F501}',
    title: 'Same answers in CI',
    description: 'Put rules in buggregator.yaml. Every test run and every teammate gets the same responses.',
  },
]

const worksWithItems = [
  { name: 'PHP', detail: '— Guzzle, Laravel HTTP, Symfony HttpClient' },
  { name: 'JavaScript', detail: '— fetch, axios; build the frontend before the backend is ready' },
  { name: 'Browsers', detail: '— CORS preflight answered by default' },
  { name: 'Any language', detail: '— change the API\'s base URL' },
  { name: 'CI', detail: '— rules in buggregator.yaml' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Fake the API you're waiting for"
      subtitle="Mock Server"
      description="Your app calls an API that isn't ready yet, is slow, or costs money per call. Describe the answer once — method and path in, status, headers and body out — and point your app at Buggregator. Every call is captured, so you also see exactly what your app sent."
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
          <span class="font-mono text-xs text-on-dark-muted">Rules in the UI, the API or YAML</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Built screen (example data) -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="Buggregator mock server screen: rules and incoming requests"
          caption="Rules on the left, in match order. Calls to /mock/ on the right, live. Example data."
        >
          <MockServerTab />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Answers you control, calls you can see"
      subtitle="Build and test against any API without waiting for it, paying for it, or writing a stub server."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with any HTTP client"
      description="It's plain HTTP. Anything that can call a URL can call a mock."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/mock-server.html">
      <template #related>
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/xdebug" label="Xdebug Proxy" color="#f97316" />
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
      </template>
    </FeatureCTA>
  </div>
</template>
