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
  title: 'Local Sentry Alternative for Development — Buggregator',
  description: 'See exceptions with full stack traces, breadcrumbs, and context without deploying Sentry or sending data to the cloud. Works with any Sentry SDK: PHP, JavaScript, Python, Go, Ruby. Free and open-source.',
  ogTitle: 'Local Sentry Alternative for Development — Buggregator',
  ogDescription: 'Full stack traces, breadcrumbs, and context. No Sentry deployment needed. Works with any Sentry SDK.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Local Sentry Alternative for Development — Buggregator',
  twitterDescription: 'See exceptions with full context. No Sentry deployment needed.',
})

const accentColor = '#f43f5e'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'The Sentry-compatible endpoint runs on port 8000 alongside the web UI.',
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
    title: 'Set the Sentry DSN',
    description: 'Point your existing Sentry SDK to Buggregator. One environment variable, no code changes.',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# .env
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1`,
      },
      {
        id: 'symfony',
        label: 'Symfony',
        code: `# .env
SENTRY_DSN=http://sentry@127.0.0.1:8000/1`,
      },
      {
        id: 'javascript',
        label: 'JavaScript',
        code: `Sentry.init({
    dsn: 'http://sentry@127.0.0.1:8000/1',
});`,
      },
      {
        id: 'python',
        label: 'Python',
        code: `import sentry_sdk
sentry_sdk.init(dsn="http://sentry@127.0.0.1:8000/1")`,
      },
      {
        id: 'go',
        label: 'Go',
        code: `sentry.Init(sentry.ClientOptions{
    Dsn: "http://sentry@127.0.0.1:8000/1",
})`,
      },
      {
        id: 'ruby',
        label: 'Ruby',
        code: `Sentry.init do |config|
    config.dsn = 'http://sentry@127.0.0.1:8000/1'
end`,
      },
      {
        id: 'any',
        label: 'Any SDK',
        code: `# Any Sentry SDK \u2014 just set the DSN:
SENTRY_DSN=http://sentry@127.0.0.1:8000/1`,
      },
    ],
  },
  {
    title: 'Trigger an exception \u2014 see it with full context',
    description: 'Throw an exception in your app. Buggregator shows the stack trace, breadcrumbs, tags, user context, and request data \u2014 just like Sentry would.',
  },
]

const highlights = [
  {
    icon: '\u{1F4DA}',
    title: 'Full stack traces',
    description: 'Every frame with file path, line number, and code context. Click to open in your IDE.',
  },
  {
    icon: '\u{1F9ED}',
    title: 'Breadcrumbs',
    description: 'See the sequence of events leading up to the exception. Queries, logs, HTTP calls.',
  },
  {
    icon: '\u{1F3F7}\uFE0F',
    title: 'Tags & context',
    description: 'Environment, release, user info, custom tags \u2014 all displayed just like in Sentry.',
  },
  {
    icon: '\u{1F310}',
    title: 'Request data',
    description: 'Headers, cookies, query params, POST body \u2014 the full HTTP request that triggered the error.',
  },
  {
    icon: '\u{1F512}',
    title: 'Data stays local',
    description: 'Nothing leaves your machine. No API keys, no cloud accounts, no data sharing.',
  },
  {
    icon: '\u{1F504}',
    title: 'Zero code changes',
    description: 'Same Sentry SDK, same API. Just change the DSN. Switch back to Sentry anytime.',
  },
]

const worksWithItems = [
  { name: 'PHP', detail: '\u2014 Laravel, Symfony, WordPress, Magento, Spiral' },
  { name: 'JavaScript', detail: '\u2014 Browser, Node.js, React, Vue, Next.js' },
  { name: 'Python', detail: '\u2014 Django, Flask, FastAPI, Celery' },
  { name: 'Go', detail: '\u2014 sentry-go SDK' },
  { name: 'Ruby', detail: '\u2014 Rails, Sinatra, sentry-ruby' },
  { name: 'Java', detail: '\u2014 Spring Boot, sentry-java' },
  { name: '.NET', detail: '\u2014 ASP.NET, sentry-dotnet' },
  { name: 'Any Sentry SDK', detail: '\u2014 just change the DSN' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="See your exceptions locally, with full context"
      subtitle="Exception Tracking"
      description="When something breaks in development, you want to see the full picture \u2014 stack trace, breadcrumbs, request data. Buggregator gives you a Sentry-compatible endpoint that runs on your machine. Same SDK, same data, no deployment."
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
          <span class="font-mono text-xs text-on-dark-muted">Works with any Sentry SDK</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/sentry.png"
          alt="Screenshot: Buggregator exception view with stack trace, breadcrumbs, and context"
          caption="Full exception details with stack trace, breadcrumbs, tags, and request data"
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Everything Sentry shows you, running locally"
      subtitle="All the context you need to understand what went wrong and why."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with every Sentry SDK"
      description="Buggregator implements the Sentry ingestion API. Any official or community Sentry SDK works out of the box."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/sentry.html">
      <template #related>
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/sms" label="SMS Testing" color="#a855f7" />
      </template>
    </FeatureCTA>
  </div>
</template>
