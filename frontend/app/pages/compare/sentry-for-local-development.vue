<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import CompareSection from '~/components/compare/CompareSection.vue'
import CompareTable from '~/components/compare/CompareTable.vue'
import CompareChecked from '~/components/compare/CompareChecked.vue'
import CompareRunButton from '~/components/compare/CompareRunButton.vue'

definePageMeta({ layout: 'landing' })
// English only, like the feature pages.
defineI18nRoute(false)

// Copy #4740 v2 (aid 10266), facts observed 9 Nov 2026.
// «Python, Node and Go are next» holds while server#4739 is open.
const seoTitle = 'Sentry for Local Development: Spotlight, Buggregator & More'
const seoDescription = 'See Sentry SDK errors, traces and logs on your own machine. Compare Sentry Spotlight, Buggregator, GlitchTip, Bugsink and self-hosted Sentry, and which are for production.'

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
})

const accentColor = '#f43f5e'

const table = {
  columns: ['Buggregator', 'Sentry Spotlight', 'GlitchTip', 'Bugsink', 'Sentry self-hosted'],
  rows: [
    { label: 'Made for', cells: ['local development', 'local development', 'production (self-host or SaaS)', 'production (self-host or managed)', 'production'] },
    { label: 'Licence', cells: ['MIT', 'Apache-2.0', 'MIT', 'PolyForm Shield (source-available)', 'FSL-1.1-Apache-2.0'] },
    { label: 'Price', cells: ['free', 'free', 'free self-hosted; SaaS from $0 (1,000 events/mo)', 'free self-hosted; managed from €0 (15K events/mo)', 'free self-hosted'] },
    { label: 'What you run', cells: ['one binary (~40 MB) or one container', '`npx`, desktop app or container', 'app + PostgreSQL 14+', 'one container (SQLite, MySQL or PostgreSQL)', 'Docker Compose stack; min. 4 CPU, 16 GB RAM + 16 GB swap'] },
    { label: 'How the SDK connects', cells: ['DSN', 'SDK `spotlight` option or `SENTRY_SPOTLIGHT`', 'DSN', 'DSN', 'DSN'] },
    { label: 'Errors', cells: ['yes', 'yes', 'yes', 'yes', 'yes'] },
    { label: 'Traces / transactions', cells: ['yes, waterfall', 'yes', 'yes (aggregates)', 'no (SDK told to stop sending)', 'yes'] },
    { label: 'Logs', cells: ['yes', 'yes', 'yes', 'no', 'yes'] },
    { label: 'Metrics', cells: ['yes', '—', '—', 'no', 'yes'] },
    { label: 'Profiles, replays, crons, user feedback', cells: ['no', '—', '—', 'no', 'yes'] },
    { label: 'Alerts and issue workflow', cells: ['no (webhooks only)', '—', 'yes', 'yes', 'yes'] },
    { label: 'Storage', cells: ['memory by default; SQLite file with `-db`', 'memory', 'PostgreSQL', 'SQLite / MySQL / PostgreSQL', 'its own databases'] },
    { label: 'Also catches mail, dumps, logs, profiles, HTTP', cells: ['yes', '—', '—', '—', '—'] },
    { label: 'Several projects in one UI', cells: ['yes', '—', 'yes', 'yes', 'yes'] },
    { label: 'MCP server for AI agents', cells: ['yes', 'yes', 'yes', '—', 'yes (Sentry MCP with `SENTRY_HOST`)'] },
  ],
}

const steps = [
  {
    title: 'Start Buggregator',
    description: `Buggregator takes Sentry data on port 8000, next to the web UI. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      { id: 'binary', label: 'Binary', binary: true },
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
    title: 'Try it: change one line',
    description: 'Errors arrive as soon as the DSN is set. Traces, logs and metrics are SDK features: switch them on in your app.',
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
    ],
  },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Sentry for local development"
      subtitle="Compare"
      description="Your Sentry SDK can send errors to a tool on your laptop instead of the cloud. Here is what each option does — and which ones are made for production."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col items-center gap-6">
          <CompareRunButton />
          <aside
            class="max-w-[640px] w-full text-left rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 font-sans text-sm leading-relaxed text-on-dark-secondary"
            aria-labelledby="production-callout"
          >
            <p>
              <strong id="production-callout" class="text-white">Looking for production error tracking?</strong>
              Buggregator is not it: no alerts, no issue workflow, events in memory by default. For production, use
              Sentry (cloud or self-hosted), GlitchTip or Bugsink — they are compared below too.
            </p>
          </aside>
        </div>
      </template>
    </FeatureHero>

    <CompareSection title="Which one fits?" tone="mid">
      <ul class="space-y-3 list-disc pl-5">
        <li><strong>Only want Sentry events in a local UI, and your SDK has a <code>spotlight</code> option?</strong> <strong>Sentry Spotlight</strong> is free, Apache-2.0, made by Sentry, with a desktop app and an MCP server.</li>
        <li><strong>Want Sentry errors next to your mail, dumps, logs and profiles, for several apps at once?</strong> <strong>Buggregator</strong>. Change the DSN; nothing else in your app changes.</li>
        <li><strong>Need production: alerts, issue workflow, retention, a team?</strong> <strong>GlitchTip</strong> (MIT, PostgreSQL, from 256 MB RAM) or <strong>Bugsink</strong> (one container, errors only) — or <strong>self-hosted Sentry</strong> if you want the full product and have the hardware.</li>
      </ul>
    </CompareSection>

    <CompareSection title="Local and self-hosted Sentry options compared" wide>
      <CompareTable
        caption="Local and self-hosted Sentry options compared"
        :columns="table.columns"
        :rows="table.rows"
        note="— means not found in the product's docs on 9 November 2026. &quot;No&quot; means the product's docs or code say it is not supported."
      />
    </CompareSection>

    <CompareSection title="Honest notes per tool" tone="mid">
      <div class="space-y-6">
        <p><strong>Sentry Spotlight</strong> — «Sentry for Development», by Sentry. Run <code>npx @spotlightjs/spotlight</code> and open <code>localhost:8969</code>, or use the desktop app (macOS, Linux, Windows) or the container. No Sentry account needed. It shows errors, traces and logs, and has an MCP server for coding agents. Your SDK turns it on with a <code>spotlight</code> option (documented for JavaScript, Python, Java, React Native), so your production DSN can stay set. Events stay in memory. <em>Choose it if:</em> Sentry is all you want to see and your SDK supports Spotlight. <em>Where Buggregator differs:</em> it takes the plain DSN (no SDK option needed), can keep events in a SQLite file, stores Sentry metrics (Spotlight's docs don't mention them), and shows mail, dumps, logs and profiles in the same window.</p>
        <p><strong>Buggregator</strong> — A local debugging server that speaks the Sentry protocol. Point the DSN at <code>http://sentry@127.0.0.1:8000/1</code> and see exceptions with stack traces and breadcrumbs, traces as a waterfall, logs and metrics — linked by trace. Put a project name in the DSN to keep apps apart. We test it with the Sentry PHP SDK (2.5, 3.22, 4.x), and the browser JavaScript SDK was checked on 9 November 2026 with the default settings. Other SDKs send the same format; Python, Node and Go are next on our test list. It does not keep session replays, profiles, cron check-ins, user feedback or attachments, and it has no alerts. <em>Choose it if:</em> you develop locally and also want your mail, dumps and logs in one place. More on the <NuxtLink to="/features/sentry">Sentry feature page</NuxtLink>.</p>
        <p><strong>GlitchTip</strong> — Open-source (MIT) error tracker that works with Sentry SDKs, self-hosted or as a service. Needs PostgreSQL; light (256 MB minimum, 512 MB recommended). Errors, performance aggregates, logs, uptime checks, alerts, MCP server. <em>Choose it for:</em> production on a small budget.</p>
        <p><strong>Bugsink</strong> — Self-hosted error tracker, one container, compatible with Sentry SDKs. Errors only: its ingest tells SDKs to stop sending transactions. Source-available (PolyForm Shield), free to self-host. <em>Choose it for:</em> simple production error tracking.</p>
        <p><strong>Sentry self-hosted</strong> — The full Sentry: alerts, issues, releases, replays, profiles, crons. Free to self-host under FSL. Needs at least 4 CPU cores, 16 GB RAM plus 16 GB swap and 20 GB disk. <em>Choose it for:</em> production when you want everything Sentry has and can run it. Too heavy for a laptop.</p>
      </div>
    </CompareSection>

    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <FeatureCTA docs-url="https://docs.buggregator.dev/config/sentry.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/compare/mailhog-alternatives" label="MailHog alternatives" color="#f59e0b" />
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
      </template>
    </FeatureCTA>

    <CompareChecked />
  </div>
</template>
