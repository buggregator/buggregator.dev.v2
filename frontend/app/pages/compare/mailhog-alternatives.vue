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

// Copy #4740 v2 (aid 10266), facts observed 9 Nov 2026. Re-check by 2027-01-15.
const seoTitle = 'MailHog Alternatives in 2026: Mailpit, smtp4dev, Buggregator'
const seoDescription = 'MailHog has had no release since 2020. Compare Mailpit, smtp4dev, Mailtrap Local, Buggregator and others: features, image size, test APIs, and how to switch in one line.'

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

const accentColor = '#f59e0b'

const table = {
  columns: ['Buggregator', 'Mailpit', 'smtp4dev', 'Mailtrap Local', 'MailHog'],
  rows: [
    { label: 'Last release', cells: ['v2.8.0, 8 Nov 2026', 'v1.33.1, 7 Nov 2026', '3.16.1, 6 Nov 2026', 'v0.5.0, 5 Nov 2026', 'v1.0.1, 11 Aug 2020'] },
    { label: 'Licence', cells: ['MIT', 'MIT', 'BSD-3-Clause', 'MIT', 'MIT'] },
    { label: 'Written in', cells: ['Go, one binary', 'Go, one binary', '.NET', 'Go, one binary', 'Go, one binary'] },
    { label: 'Docker image (amd64, compressed)', cells: ['26.2 MB', '15.0 MB', '176.9 MB', '—', '145.5 MB, no ARM'] },
    { label: 'Windows binary', cells: ['yes', 'yes', 'yes', 'not yet', 'yes'] },
    { label: 'HTML compatibility check', cells: ['—', 'yes', 'yes', 'yes', '—'] },
    { label: 'Spam check', cells: ['—', 'yes (SpamAssassin, Rspamd)', '—', '—', '—'] },
    { label: 'POP3 / IMAP', cells: ['—', 'POP3', 'POP3 and IMAP', '—', '—'] },
    { label: 'SMTP TLS', cells: ['—', 'yes', 'yes', '—', '—'] },
    { label: 'Release to a real SMTP server', cells: ['—', 'yes', 'yes', 'yes', 'yes'] },
    { label: 'Wait for a message (API)', cells: ['yes, long poll', '—', '—', '—', '—'] },
    { label: 'Pull links / codes from a message (API)', cells: ['yes', 'link check (tests links); no code extraction', '—', '—', '—'] },
    { label: 'Separate inboxes in one UI', cells: ['yes, by SMTP username', '— (one tenant per instance; tags, incl. plus-addressing)', 'yes, mailboxes with rules', '—', '—'] },
    { label: 'Also catches errors, dumps, logs, profiles, HTTP', cells: ['yes', '—', '—', '—', '—'] },
    { label: 'MCP server for AI agents', cells: ['yes', '—', '—', '—', '—'] },
  ],
}

const steps = [
  {
    title: 'Switch from MailHog to Buggregator',
    description: 'Both listen for SMTP on port 1025, so your app’s mail settings stay the same. Only the image and the UI port change.',
    language: 'yaml',
    code: `# before
mailhog:
  image: mailhog/mailhog
  ports:
    - "8025:8025"
    - "1025:1025"

# after
buggregator:
  image: ghcr.io/buggregator/server:latest
  ports:
    - "127.0.0.1:8000:8000"
    - "127.0.0.1:1025:1025"`,
    note: 'If your app reaches MailHog by service name (MAIL_HOST=mailhog), change it to buggregator. The UI moves from port 8025 to 8000.',
  },
  {
    title: 'Or run it without Docker',
    description: `One file, about ${BINARY_SIZE_MB} MB, installed with one command. SMTP on port 1025, the web UI on port 8000.`,
    tabs: [
      { id: 'binary', label: 'Binary', binary: true },
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:1025:1025 ghcr.io/buggregator/server:{imageTag}',
      },
    ],
  },
]
</script>

<template>
  <div>
    <FeatureHero
      title="MailHog alternatives in 2026"
      subtitle="Compare"
      description="MailHog's last release was in August 2020, and its Docker image has no ARM build. Here are the tools people move to, what each does better, and how to switch."
      :accent-color="accentColor"
    >
      <template #cta>
        <div class="flex flex-col items-center gap-4">
          <CompareRunButton />
          <p class="font-mono text-xs text-on-dark-muted">
            MailHog v1.0.1 — 11 Aug 2020 · last commit 2 Aug 2022 · image amd64 only
          </p>
        </div>
      </template>
    </FeatureHero>

    <CompareSection title="Is MailHog still maintained?" tone="mid">
      <p>
        Not actively. The last release, v1.0.1, came out on 11 August 2020. In April 2023 its author wrote that he no
        longer has time to maintain it and pointed to Mailpit as «an actively maintained project which does basically
        the same thing»
        (<a href="https://github.com/mailhog/MailHog/issues/442#issuecomment-1493415258" target="_blank" rel="noopener">issue #442</a>).
        The <code>mailhog/mailhog</code> image is built for amd64 only, so on Apple Silicon and ARM servers it runs
        under emulation or not at all.
      </p>
      <p>
        It still works for basic mail catching. If it does the job for you, there is no emergency. Move when you need
        ARM, security fixes, or more than a list of messages.
      </p>
    </CompareSection>

    <CompareSection title="Which one should you pick?">
      <ul class="space-y-3 list-disc pl-5">
        <li><strong>Only need to catch mail?</strong> Pick <strong>Mailpit</strong>. It is the closest successor: one small Go binary, active, and deeper in mail than anything else here (HTML check, spam check, link check, POP3, relay).</li>
        <li><strong>Need mail plus errors, dumps and logs from the same app?</strong> Pick <strong>Buggregator</strong>. One binary catches mail and also Sentry errors, Symfony VarDumper and Ray dumps, Monolog logs, XHProf profiles and HTTP requests — in one UI.</li>
        <li><strong>Writing E2E tests that wait for a confirmation email or a one-time code?</strong> <strong>Buggregator</strong> has <code>wait</code>, <code>links</code> and <code>codes</code> endpoints for that; among the free tools on this page, we did not find an equivalent.</li>
        <li><strong>On Windows or .NET, or need IMAP?</strong> Look at <strong>smtp4dev</strong>.</li>
        <li><strong>Already use Mailtrap and want the same UI locally?</strong> Try <strong>Mailtrap Local</strong> (macOS and Linux for now). More in <NuxtLink to="/compare/mailtrap-alternative">Mailtrap alternative for local development</NuxtLink>.</li>
      </ul>
    </CompareSection>

    <CompareSection title="MailHog alternatives compared" tone="mid" wide>
      <CompareTable
        caption="MailHog alternatives compared"
        :columns="table.columns"
        :rows="table.rows"
        note="— means we did not find it in the product's README or docs on 9 November 2026, not that it can't be done. Image sizes from Docker Hub / GHCR on the same day."
      />
    </CompareSection>

    <CompareSection title="The tools, one by one">
      <div class="space-y-6">
        <p><strong>Mailpit</strong> — The default successor to MailHog. Web UI with search and tags, HTML and link checks, spam scoring, POP3, SMTP relay, chaos testing, webhooks. Smallest image of the active tools (15 MB). <em>Choose it if:</em> mail is the only thing you need to see. <em>Where Buggregator differs:</em> Buggregator has wait/codes endpoints for tests and catches non-mail data too; Mailpit has the deeper mail checks.</p>
        <p><strong>smtp4dev</strong> — Fake SMTP server with a web UI and a terminal UI, from the .NET world. IMAP and POP3, TLS, several mailboxes with routing rules, relay, compose and reply, error simulation. <em>Choose it if:</em> you are on Windows/.NET or need IMAP. <em>Trade-off:</em> the image is about 177 MB.</p>
        <p><strong>Mailtrap Local</strong> — New since May 2026: Mailtrap's free local catcher, MIT, Go + SQLite in one binary. HTML compatibility check, release to production SMTP, webhooks. Its README says it is for one developer: no accounts, no multi-tenancy, localhost only; no Windows build yet. <em>Choose it if:</em> your team already uses Mailtrap and you want the same look locally.</p>
        <p><strong>Buggregator</strong> — A local debugging server, not only a mail catcher. SMTP on port 1025 like MailHog, web UI on 8000. For tests: <code>GET /api/smtp/messages/wait</code> holds the request until the expected email arrives; <code>GET /api/smtp/message/{uuid}/links</code> and <code>/codes</code> pull the confirmation link or one-time code out of it. Each app can get its own inbox by its SMTP username. The same binary catches Sentry errors, dumps, logs, profiles and HTTP requests. <em>Choose it if:</em> you run MailHog next to a dump viewer, a log tail or a Sentry DSN pointed nowhere. <em>Not for you if:</em> you need spam scores, HTML client checks, TLS or POP3 — use Mailpit.</p>
        <p><strong>Also around:</strong> MailCatcher (Ruby gem, still updated: 0.11.0, Sep 2026), MailCrab (Rust, 8.6 MB image, in-memory only), Inbucket (Go, per-address mailboxes, POP3, TLS — good for a shared QA server).</p>
      </div>
    </CompareSection>

    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <FeatureCTA docs-url="https://docs.buggregator.dev/config/smtp.html">
      <template #related>
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/compare/mailtrap-alternative" label="Mailtrap alternative" color="#f59e0b" />
        <FeatureRelatedLink to="/compare/sentry-for-local-development" label="Sentry for local development" color="#f43f5e" />
      </template>
    </FeatureCTA>

    <CompareChecked />
  </div>
</template>
