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

const seoTitle = 'Debug Laravel Reverb and Pusher Broadcasts Locally — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'See every event your backend broadcasts through Laravel Reverb, Pusher or soketi: channel, event name, payload, what changed since the last one, signature check. Pass events on to your real server so the browser keeps working. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Every broadcast your backend sends, with its channel and payload. Optionally passed on to your real Reverb or Pusher server.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Every broadcast your backend sends, with its channel and payload. Laravel Reverb, Pusher, soketi.',
})

const accentColor = '#ec4899'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Requires Buggregator v2.13.0 or later. Broadcasts arrive on port 8000, the same port as the UI. Nothing to turn on. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
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
    title: 'Send your broadcasts to Buggregator',
    description: 'Only the server side changes: your backend sends broadcasts to Buggregator. The browser keeps connecting to the real Reverb or Pusher.',
    tabs: [
      {
        id: 'reverb',
        label: 'Laravel Reverb',
        code: `BROADCAST_CONNECTION=reverb
REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...

# Laravel sends broadcasts to Buggregator
REVERB_HOST=127.0.0.1        # host.docker.internal when Laravel runs in Docker and Buggregator on the host
REVERB_PORT=8000             # Buggregator's HTTP port
REVERB_SCHEME=http

# Echo in the browser connects to Reverb directly
VITE_REVERB_APP_KEY="\${REVERB_APP_KEY}"
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080        # Reverb's port
VITE_REVERB_SCHEME=http`,
        note: 'php artisan install:broadcasting writes VITE_REVERB_HOST="${REVERB_HOST}". Once REVERB_HOST points at Buggregator, the browser would go there too, and Buggregator does not speak WebSocket. Keep VITE_REVERB_HOST and VITE_REVERB_PORT on Reverb itself, as above. Older Laravel apps use BROADCAST_DRIVER instead of BROADCAST_CONNECTION.',
      },
      {
        id: 'pusher-laravel',
        label: 'Laravel + Pusher',
        code: `BROADCAST_CONNECTION=pusher
PUSHER_HOST=127.0.0.1
PUSHER_PORT=8000
PUSHER_SCHEME=http`,
      },
      {
        id: 'pusher-sdk',
        label: 'Pusher SDK',
        code: `const Pusher = require('pusher')

const pusher = new Pusher({
  appId: '1001', key: 'app-key', secret: 'app-secret',
  host: '127.0.0.1', port: '8000', useTLS: false,
})

await pusher.trigger('orders', 'OrderShipped', { id: 42 })`,
        note: 'Node.js shown; with any Pusher server SDK, set the host to Buggregator, port 8000, no TLS. Without an upstream, any app id, key and secret work.',
      },
    ],
  },
  {
    title: 'Keep live updates working: pass events on',
    description: 'Without this, Buggregator only captures: your app gets «ok», and browsers get nothing. Set upstream to your real server, and each event is stored and then sent on. Keep your real app id, key and secret in the app: Buggregator sends the same path, query and body, so the real server accepts the signature.',
    tabs: [
      {
        id: 'env',
        label: 'Environment',
        code: '$ BROADCAST_UPSTREAM=http://localhost:8080 ./buggregator',
      },
      {
        id: 'yaml',
        label: 'buggregator.yaml',
        code: `broadcast:
  upstream: http://127.0.0.1:8080   # your real Reverb or Pusher server`,
      },
    ],
  },
  {
    title: 'Optional: check signatures',
    description: 'List your apps, and Buggregator checks each event’s signature with the secret. The event then says valid, or invalid with a warning. Keys not in the list say not_checked.',
    tabs: [
      {
        id: 'yaml',
        label: 'buggregator.yaml',
        code: `broadcast:
  apps:
    - key: app-key
      secret: app-secret`,
      },
      {
        id: 'env',
        label: 'Environment',
        code: 'BROADCAST_APPS=app-key:app-secret,other-key:other-secret',
      },
    ],
  },
  {
    title: 'Broadcast an event — open Broadcast in the menu',
    description: 'Trigger the event in your app. It shows up under its channel, with its name and payload. In Buggregator the event name is the full class name, for example App\\Events\\OrderShipped; Echo’s .listen(\'OrderShipped\') keeps working.',
  },
]

const highlights = [
  {
    icon: '\u{1F4E1}',
    title: 'Every broadcast, as sent',
    description: 'Event name, channels (public, private, presence, encrypted or user), data and socket id. A batch gives one event per item, marked with the same batch.',
  },
  {
    icon: '\u{1F5C2}️',
    title: 'A console per channel',
    description: 'Channels on the left, with their kind and number of events; type to filter them. Their events on the right, newest or oldest first: time, name, size, payload.',
  },
  {
    icon: '\u{1F50D}',
    title: 'What changed',
    description: 'Open an event to see what changed since the previous event of the same name on that channel, who sent it and to whom.',
  },
  {
    icon: '\u{1F501}',
    title: 'Live updates keep working',
    description: 'With upstream set, each event goes on to your real Reverb or Pusher server and your app gets its answer. Real server down? Your app gets 502 with the reason, and the event is still stored.',
  },
  {
    icon: '\u{1F510}',
    title: 'Signature check',
    description: 'List your app keys and secrets, and each event says valid or invalid. The secret is never stored; a user name and password in the upstream address are not shown.',
  },
  {
    icon: '\u{26A0}️',
    title: 'Warnings and cURL',
    description: 'Warnings for data over 10 KB, more than 100 channels, no channel, data that is not JSON and a wrong signature. Copy as cURL gives the request to send it again.',
  },
]

const worksWithItems = [
  { name: 'Laravel Reverb', detail: '— checked with Laravel 12, laravel/reverb 1.14 and Laravel Echo 2.1' },
  { name: 'Laravel + Pusher', detail: '— the pusher broadcast connection' },
  { name: 'Pusher server SDKs', detail: '— host Buggregator, port 8000, no TLS' },
  { name: 'soketi', detail: '— apps that broadcast through its HTTP API' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See every event your app broadcasts"
      subtitle="Broadcast Events"
      description="Your app pushes live updates through Laravel Reverb, Pusher or soketi: «order shipped», «new message». When the browser shows the wrong thing, you want to see what the server actually sent. Point your backend at Buggregator, and every broadcast shows up with its channel and data. It can pass each event on to your real server, so the browser keeps getting live updates."
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
          <span class="font-mono text-xs text-on-dark-muted">Laravel Reverb, Pusher, soketi</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/broadcast-events.png"
          alt="Buggregator Broadcast page: channels on the left, the live events of one channel on the right"
          caption="Channels on the left, their events on the right. Open an event for its payload, what changed and the signature check."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="What your backend really sent"
      subtitle="Each broadcast is one event in Buggregator, grouped by channel, updated live."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">The order page didn’t update. Was the event sent?</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          Open the orders channel in Buggregator. If App\Events\OrderShipped is there, the backend did its part: look at
          the payload and at what changed since the previous one. If it is not there, it never reached Buggregator:
          look at the backend first. With upstream set, the event also shows the real server’s answer.
        </p>
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with the Pusher HTTP API"
      description="Your backend sends each broadcast as an HTTP request to the broadcast server. Buggregator answers those requests in its place."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">What it does not do</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>It does not speak WebSocket. Browsers still connect to the real Reverb or Pusher.</li>
            <li>Without upstream, live updates stop while your app points at Buggregator.</li>
            <li>Channel queries (GET /apps/&lt;id&gt;/channels) are not supported: send them to the real server.</li>
            <li>Data on encrypted channels is stored as sent; Buggregator cannot decrypt it.</li>
            <li>Only signed POST requests count as broadcasts. A POST without a signature is stored as an HTTP dump.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="broadcast events" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/broadcast.html">
      <template #related>
        <FeatureRelatedLink to="/features/http-dumps" label="HTTP Dumps" color="#22c55e" />
        <FeatureRelatedLink to="/features/mock-server" label="Mock Server" color="#0ea5e9" />
        <FeatureRelatedLink to="/features/cron-monitoring" label="Cron Monitoring" color="#84cc16" />
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
      </template>
    </FeatureCTA>
  </div>
</template>
