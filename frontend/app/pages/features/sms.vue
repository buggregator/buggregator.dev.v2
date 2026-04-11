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
  title: 'Local SMS Gateway for Testing \u2014 Buggregator',
  description: 'Intercept SMS messages during development. No real messages sent, no API costs. Auto-detects 40+ providers including Twilio, Vonage, Plivo, Sinch. Validates provider-specific payloads. Free and open-source.',
  ogTitle: 'Local SMS Gateway for Testing \u2014 Buggregator',
  ogDescription: 'Intercept SMS messages during development. Auto-detects 40+ providers. No API costs.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Local SMS Gateway for Testing \u2014 Buggregator',
  twitterDescription: 'Intercept SMS messages during development. No real messages sent, no API costs.',
})

const accentColor = '#a855f7'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'The SMS endpoint runs on port 8000 alongside the web UI.',
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
    title: 'Point your SMS provider to Buggregator',
    description: 'Replace your provider\'s API endpoint with Buggregator\'s /sms endpoint. The provider format is auto-detected from the request payload.',
    tabs: [
      {
        id: 'symfony',
        label: 'Symfony Notifier',
        code: `# .env \u2014 Replace provider host with Buggregator
# Twilio:
TWILIO_DSN=twilio://SID:TOKEN@127.0.0.1:8000/sms?from=+1234567890

# Vonage:
VONAGE_DSN=vonage://KEY:SECRET@127.0.0.1:8000/sms?from=+1234567890`,
      },
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# Send SMS to Buggregator via HTTP POST:
Http::post('http://127.0.0.1:8000/sms', [
    'From' => '+1234567890',
    'To' => '+0987654321',
    'Body' => 'Your verification code is 123456',
]);`,
      },
      {
        id: 'curl',
        label: 'curl',
        code: `# Send a test SMS \u2014 provider is auto-detected:
$ curl -X POST http://127.0.0.1:8000/sms \\
  -d '{"From":"+1234567890","To":"+0987654321","Body":"Hello!"}'

# Or specify the provider explicitly:
$ curl -X POST http://127.0.0.1:8000/sms/twilio \\
  -d '{"From":"+1234567890","To":"+0987654321","Body":"Hello!"}'`,
      },
      {
        id: 'any',
        label: 'Any HTTP client',
        code: `# POST to the /sms endpoint with your provider's payload format.
# Buggregator auto-detects the provider from the request body.
#
# Supported providers include:
# Twilio, Vonage, Plivo, Sinch, Infobip,
# MessageBird, Telnyx, Bandwidth, and 30+ more.
#
# POST http://127.0.0.1:8000/sms
# POST http://127.0.0.1:8000/sms/{provider}`,
      },
    ],
  },
  {
    title: 'Send an SMS \u2014 see it in the UI',
    description: 'Every SMS your app sends is captured and displayed with sender, recipient, message body, and detected provider.',
  },
]

const highlights = [
  {
    icon: '\u{1F4F1}',
    title: '40+ providers',
    description: 'Auto-detects Twilio, Vonage, Plivo, Sinch, Infobip, MessageBird, Telnyx, Bandwidth, and many more.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Payload validation',
    description: 'Specify the provider explicitly to validate your request matches the expected format.',
  },
  {
    icon: '\u{1F4B0}',
    title: 'No API costs',
    description: 'No real SMS sent, no credits used. Test freely without worrying about per-message charges.',
  },
  {
    icon: '\u{1F4E8}',
    title: 'Full message details',
    description: 'See sender, recipient, message body, and which provider format was detected.',
  },
  {
    icon: '\u{1F504}',
    title: 'Provider migration',
    description: 'Switching from Twilio to Vonage? Test both without changing API credentials.',
  },
  {
    icon: '\u{26A1}',
    title: 'Real-time',
    description: 'Messages appear in the UI as they arrive. No page refresh needed.',
  },
]

const worksWithItems = [
  { name: 'Symfony Notifier', detail: '\u2014 Twilio, Vonage, Plivo, Sinch DSN' },
  { name: 'Laravel', detail: '\u2014 via HTTP POST to /sms endpoint' },
  { name: 'Any HTTP client', detail: '\u2014 POST provider payload to /sms' },
  { name: 'curl', detail: '\u2014 quick testing from the terminal' },
  { name: 'Twilio SDK', detail: '\u2014 redirect API calls to Buggregator' },
  { name: 'Vonage SDK', detail: '\u2014 redirect API calls to Buggregator' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Test SMS without sending real messages"
      subtitle="SMS Gateway"
      description="When your app sends SMS \u2014 verification codes, notifications, alerts \u2014 you need to verify they work without actually sending them. Buggregator intercepts SMS API calls and shows you what would have been sent. Supports 40+ providers out of the box."
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
          <span class="font-mono text-xs text-on-dark-muted">Replaces Twilio sandbox, real SMS in dev</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/sms.png"
          alt="Screenshot: Buggregator SMS view showing captured messages with sender, recipient, and body"
          caption="Captured SMS messages with sender, recipient, body, and detected provider"
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="SMS testing made simple"
      subtitle="No API keys, no credits, no risk of sending to real phone numbers."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with any SMS provider"
      description="Send your provider's native payload format. Buggregator auto-detects the provider and displays the message."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/sms.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Exception Tracking" color="#f43f5e" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
      </template>
    </FeatureCTA>
  </div>
</template>
