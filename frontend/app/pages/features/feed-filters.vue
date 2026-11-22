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

const seoTitle = 'Shared Dev Server Feed Filters: by Machine, Environment, User, Channel — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'One Buggregator for the whole team? Filter the event feed by machine, environment, user, Monolog channel, level, release or Sentry tag. Filters go into the link you share. Same filters in the API and MCP. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Show only your machine’s events on a shared Buggregator, or one environment, one user, one channel or one tag.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Your machine, one environment, one user, one Monolog channel or one tag: filter a shared Buggregator feed.',
})

const accentColor = '#38bdf8'

const steps = [
  {
    title: 'Point everyone at one Buggregator',
    description: 'Requires Buggregator v2.14.0 or later. Most SDKs already send the fields you filter by: Sentry sends the machine, environment, user, release and tags. Events stored before the upgrade are indexed in the background and join the filters as they go.',
    tabs: [
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 8000:8000 -p 1025:1025 -p 9912:9912 -p 9913:9913 ghcr.io/buggregator/server:{imageTag}',
        note: 'Here the ports are open to your network, so the team can reach them. Turn on sign-in (SSO) for the web UI on a server others can reach.',
      },
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
    ],
  },
  {
    title: 'Give Monolog logs a machine name (optional)',
    description: 'Monolog sends no machine name by default. Add HostnameProcessor, and your logs get a host you can filter by.',
    tabs: [
      {
        id: 'monolog',
        label: 'Monolog',
        code: `use Monolog\\Processor\\HostnameProcessor;

$logger->pushProcessor(new HostnameProcessor());`,
      },
    ],
  },
  {
    title: 'Filter the feed',
    description: 'Click + Add filter above the feed, pick a field, then a value. Enter keeps the matching events, Shift+Enter hides them.',
    tabs: [
      {
        id: 'api',
        label: 'API',
        code: `# events from one machine
curl 'http://127.0.0.1:8000/api/events?host=web-1'

# web-1 or web-2, only in staging
curl 'http://127.0.0.1:8000/api/events?host=web-1&host=web-2&env=staging'

# everything except the CI runner
curl 'http://127.0.0.1:8000/api/events?not.host=ci-runner-3'

# a Sentry tag, written as name:value
curl 'http://127.0.0.1:8000/api/events?tag=feature:checkout'`,
        note: 'The same parameter twice means either value; different parameters mean both. not. before a parameter hides the matching events.',
      },
    ],
  },
]

const highlights = [
  {
    icon: '\u{1F4BB}',
    title: 'Your machine only',
    description: 'Five developers and a CI runner send to one server. Pick host = anna-mbp, and the feed shows only Anna’s events.',
  },
  {
    icon: '\u{1F3F7}',
    title: 'Six fields and tags',
    description: 'Host, Environment, User, Monolog channel, Level, Release and Sentry or profiler tags. Each value shows how many events have it.',
  },
  {
    icon: '\u{1F6AB}',
    title: 'Keep or hide',
    description: 'Enter keeps the matching events, Shift+Enter hides them. The chip shows = or ≠.',
  },
  {
    icon: '\u{1F517}',
    title: 'Filters in the link',
    description: 'The filters go into the page address, for example ?host=ci-runner-3. Send it to a colleague, and they see the same feed.',
  },
  {
    icon: '\u{1F515}',
    title: 'New events counted, not mixed in',
    description: 'New events that do not match stay out of the feed. The bar counts them: «N new events arrived and are hidden by this filter».',
  },
  {
    icon: '\u{1F916}',
    title: 'API and MCP',
    description: 'The same filters on /api/events, values with counts at /api/events/facets, and in the MCP tools events_list and events_facets.',
  },
]

const worksWithItems = [
  { name: 'Sentry', detail: '— server_name, environment, user, release, level, logger, tags' },
  { name: 'Monolog', detail: '— channel and level; host with HostnameProcessor' },
  { name: 'Ray, Inspector, profiler', detail: '— hostname; Inspector user; profiler tags' },
  { name: 'VarDumper and HTTP dumps', detail: '— the host of the request' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="One Buggregator for the team, and a feed with only your events"
      subtitle="Feed Filters"
      description="A shared dev server gets busy fast. Filter the feed by machine, environment, user, Monolog channel, level, release or tag, and see only the events you care about. The filters go into the link, so a colleague opens the same view."
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
          <span class="font-mono text-xs text-on-dark-muted">+ Add filter · ?host=web-1</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/feed-filters.png"
          alt="Buggregator feed filtered by Environment = production, with the Add filter menu open: Host, Environment, User, Monolog channel, Level, Release and a tag, each with the SDKs that send it and the number of values"
          caption="+ Add filter lists the fields, which SDKs send each one, and how many values it has."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="See only the events you care about"
      subtitle="No new setup for most fields: the SDKs already send them."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">The CI runner floods the shared server</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          Every test run sends hundreds of errors and logs, and yours get lost between them. Add the filter
          Host ≠ ci-runner-3, or keep only your machine. Then narrow to Environment = staging and the payments channel.
          Copy the link and send it to the colleague who asked: they open the same feed.
        </p>
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Uses what your SDKs already send"
      description="A filter finds only events that carry the field."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">Good to know</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>Emails, SMS, CSP reports and broadcast events have no filter fields, except the trace id of an email.</li>
            <li>Dumps from the command line have no host.</li>
            <li>A hiding filter keeps events that do not have that field at all: not.host=ci-runner-3 keeps logs without a host.</li>
            <li>A tag whose name contains : cannot be filtered. A : in the value is fine.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="feed filters" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/feed-filters.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
        <FeatureRelatedLink to="/features/mcp-api" label="MCP & API" color="#eab308" />
      </template>
    </FeatureCTA>
  </div>
</template>
