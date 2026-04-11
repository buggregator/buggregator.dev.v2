<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'

definePageMeta({ layout: 'landing' })

useSeoMeta({
  title: 'HTTP Proxy \u2014 Inspect Outgoing API Requests — Buggregator',
  description: 'See every HTTP request your app makes to external APIs. Full request and response details, timing, headers, and body. Supports HTTPS via MITM. Works with PHP, JavaScript, Python, Go, curl. Free and open-source.',
  ogTitle: 'HTTP Proxy \u2014 Inspect Outgoing API Requests — Buggregator',
  ogDescription: 'See every HTTP request your app makes. Full request/response pairs with timing. Works with any language.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'HTTP Proxy \u2014 Inspect Outgoing API Requests — Buggregator',
  twitterDescription: 'See every HTTP request your app makes to external APIs. Full request and response details.',
})

const accentColor = '#10b981'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'The HTTP proxy listens on port 8080. The web UI is on port 8000.',
    tabs: [
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:8080:8080 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:8080:8080`,
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
    title: 'Route your HTTP traffic through the proxy',
    description: 'Set the proxy address in your HTTP client. All outgoing requests will pass through Buggregator, which captures the full request and response.',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# In your code or a service provider:
Http::withOptions([
    'proxy' => 'http://127.0.0.1:8080',
    'verify' => false,
])->get('https://api.example.com/data');`,
      },
      {
        id: 'guzzle',
        label: 'Guzzle (PHP)',
        code: `$client = new GuzzleHttp\\Client([
    'proxy' => 'http://127.0.0.1:8080',
    'verify' => false,
]);
$response = $client->get('https://api.example.com/data');`,
      },
      {
        id: 'python',
        label: 'Python',
        code: `import requests
response = requests.get(
    'https://api.example.com/data',
    proxies={'https': 'http://127.0.0.1:8080'},
    verify=False,
)`,
      },
      {
        id: 'javascript',
        label: 'Node.js',
        code: `import { ProxyAgent } from 'undici';
const response = await fetch('https://api.example.com/data', {
    dispatcher: new ProxyAgent('http://127.0.0.1:8080'),
});`,
      },
      {
        id: 'go',
        label: 'Go',
        code: `proxyURL, _ := url.Parse("http://127.0.0.1:8080")
client := &http.Client{
    Transport: &http.Transport{
        Proxy: http.ProxyURL(proxyURL),
        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
    },
}
resp, _ := client.Get("https://api.example.com/data")`,
      },
      {
        id: 'curl',
        label: 'curl',
        code: '$ curl -x http://127.0.0.1:8080 -k https://api.example.com/data',
      },
      {
        id: 'env',
        label: 'Environment',
        code: `# Works with most HTTP clients automatically:
HTTP_PROXY=http://127.0.0.1:8080
HTTPS_PROXY=http://127.0.0.1:8080`,
      },
    ],
  },
  {
    title: 'See every request and response',
    description: 'Each outgoing request appears in the Buggregator UI with the full request, response, headers, body, status code, and timing.',
  },
]

const highlights = [
  {
    icon: '\u{1F504}',
    title: 'Request + Response pairs',
    description: 'See the full round trip. Request headers, body, and the complete response with status code.',
  },
  {
    icon: '\u{23F1}\uFE0F',
    title: 'Timing',
    description: 'How long each request took. Spot slow API calls without guessing.',
  },
  {
    icon: '\u{1F512}',
    title: 'HTTPS support',
    description: 'Intercepts HTTPS traffic via an in-memory CA certificate. No files written to disk.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Headers & body',
    description: 'Full visibility into every header and the request/response body. JSON is formatted automatically.',
  },
  {
    icon: '\u{1F30D}',
    title: 'Any destination',
    description: 'Works with any external API. Stripe, Twilio, AWS, your own microservices \u2014 everything passes through.',
  },
  {
    icon: '\u{26A1}',
    title: 'Real-time',
    description: 'Requests appear in the UI as they happen via WebSocket. No page refresh.',
  },
]

const worksWithItems = [
  { name: 'PHP', detail: '\u2014 Guzzle, Laravel HTTP, Symfony HttpClient' },
  { name: 'Python', detail: '\u2014 requests, httpx, urllib3' },
  { name: 'JavaScript', detail: '\u2014 fetch + undici, axios, node-fetch' },
  { name: 'Go', detail: '\u2014 net/http with proxy transport' },
  { name: 'Ruby', detail: '\u2014 Net::HTTP, Faraday, HTTParty' },
  { name: 'curl', detail: '\u2014 -x flag or HTTP_PROXY env var' },
  { name: 'Any language', detail: '\u2014 set HTTP_PROXY environment variable' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See every API call your app makes"
      subtitle="HTTP Proxy"
      description="When your app talks to external APIs, you want to see exactly what's being sent and what comes back. Buggregator runs a local HTTP proxy that captures the full request and response for every outgoing call."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#setup"
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-sans font-medium text-sm rounded-xl transition-colors duration-150 no-underline"
          >
            Get started
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <span class="font-mono text-xs text-on-dark-muted">Inspect HTTP &amp; HTTPS traffic</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/http-proxy.png"
          alt="Screenshot: Buggregator HTTP proxy showing request and response with headers and body"
          caption="Full request and response details with headers, body, status code, and timing"
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Full visibility into outgoing traffic"
      subtitle="Debug API integrations without adding logging code or reading through raw logs."
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
      description="Standard HTTP proxy protocol. Set the proxy address and every request flows through Buggregator."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/http-proxy.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Exception Tracking" color="#f43f5e" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/sms" label="SMS Testing" color="#a855f7" />
      </template>
    </FeatureCTA>
  </div>
</template>
