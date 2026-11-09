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

// Copy #4740 v2 (aid 10266), prices from mailtrap.io/pricing on 9 Nov 2026.
// Re-check by 2027-01-15.
const seoTitle = 'Mailtrap Alternative for Local Development (2026)'
const seoDescription = 'Mailtrap’s free Sandbox allows 50 emails a month. Compare Mailtrap Local, Mailpit and Buggregator for local email testing: limits, features, trade-offs.'

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

const plans = {
  columns: ['Price / month', 'Test emails / month', 'Kept per sandbox', 'Users'],
  rows: [
    { label: 'Free', cells: ['$0', '50', '10', '1'] },
    { label: 'Basic', cells: ['$17', '500', '50', '3'] },
    { label: 'Team', cells: ['$42', '5,000', '200', '5'] },
    { label: 'Business', cells: ['$123', '50,000', '600', '50'] },
  ],
}

const table = {
  columns: ['Buggregator', 'Mailtrap Local', 'Mailpit', 'Mailtrap Sandbox'],
  rows: [
    { label: 'Runs', cells: ['on your machine', 'on your machine', 'on your machine', 'in Mailtrap’s cloud'] },
    { label: 'Account', cells: ['no', 'no', 'no', 'yes'] },
    { label: 'Price', cells: ['free', 'free', 'free', 'free (50/mo) to $498/mo'] },
    { label: 'Monthly limit', cells: ['none', 'none', 'none', '50 on Free'] },
    { label: 'Licence', cells: ['MIT', 'MIT', 'MIT', 'proprietary'] },
    { label: 'Windows', cells: ['yes', 'not yet', 'yes', 'any (cloud)'] },
    { label: 'HTML client check', cells: ['—', 'yes', 'yes', 'yes'] },
    { label: 'Spam / blacklist report', cells: ['—', '—', 'spam score', 'yes'] },
    { label: 'Forwarding to real inboxes', cells: ['—', '—', '—', 'paid plans (Basic+)'] },
    { label: 'Device previews', cells: ['—', '—', '—', 'on request (Business/Enterprise add-on)'] },
    { label: 'Team sharing', cells: ['—', 'no (by design)', '—', 'yes'] },
    { label: 'Wait for an email in tests', cells: ['yes, long poll', '—', '—', '—'] },
    { label: 'Pull links / one-time codes', cells: ['yes', '—', 'link check', '—'] },
    { label: 'Separate inbox per app', cells: ['yes, by SMTP username', 'no', '—', 'yes, sandboxes'] },
    { label: 'Also catches errors, dumps, logs, HTTP', cells: ['yes', '—', '—', '—'] },
  ],
}

const steps = [
  {
    title: 'Start Buggregator',
    description: `Run a single command. The SMTP server starts on port 1025 alongside the web UI on port 8000. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      { id: 'binary', label: 'Binary', binary: true },
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:1025:1025 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025`,
      },
    ],
  },
  {
    title: 'Move your local SMTP from Mailtrap to Buggregator',
    description: 'Change the mail settings of your app (Laravel .env shown).',
    code: `# before — Mailtrap Sandbox
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-sandbox-username
MAIL_PASSWORD=your-sandbox-password

# after — Buggregator
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
# optional: the username picks the project
MAIL_USERNAME=my-app
MAIL_PASSWORD=`,
    note: 'Buggregator accepts any username and password. The username, if you set one, picks the project the email goes to.',
  },
]
</script>

<template>
  <div>
    <FeatureHero
      title="A Mailtrap alternative for local development"
      subtitle="Compare"
      description="Mailtrap's hosted Sandbox is built for teams and staging. For the emails your app sends on your laptop, a local catcher has no quota and needs no account. Here is what you keep and what you lose."
      :accent-color="accentColor"
    >
      <template #cta>
        <CompareRunButton />
      </template>
    </FeatureHero>

    <CompareSection title="Mailtrap Sandbox limits" tone="mid">
      <p>
        On the free plan, Mailtrap's Email Sandbox takes 50 test emails a month, keeps the last 10, accepts one email
        every 10 seconds, and has one user. Paid plans start at $17 a month (Basic: 500 emails, 50 kept). In return you
        get things a local tool doesn't have: spam and blacklist reports, HTML checks across email clients, forwarding
        to real inboxes (paid plans), device previews (on request, larger plans), shared projects, and a sandbox anyone
        on your team can reach.
      </p>
      <CompareTable
        caption="Mailtrap Email Sandbox plans"
        :columns="plans.columns"
        :rows="plans.rows"
        :highlight-first="false"
        note="Prices as on mailtrap.io/pricing, 9 November 2026, monthly billing."
      />
    </CompareSection>

    <CompareSection title="What about Mailtrap Local?">
      <p>
        Since May 2026 Mailtrap also ships <strong>Mailtrap Local</strong>: free, MIT, one binary, no account. SMTP on
        <code>127.0.0.1:3535</code>, UI on port 3550. It has an HTML compatibility check, release to a real SMTP server
        and webhooks. Its README is clear about scope: one developer, no accounts or multi-tenancy, localhost only, not
        a replacement for the hosted Sandbox, and no Windows build yet (v0.5.0, 5 November 2026). If you like
        Mailtrap's UI, try it first.
      </p>
    </CompareSection>

    <CompareSection title="Mailtrap Sandbox, Mailtrap Local, Mailpit and Buggregator" tone="mid" wide>
      <CompareTable
        caption="Mailtrap Sandbox, Mailtrap Local, Mailpit and Buggregator"
        :columns="table.columns"
        :rows="table.rows"
        note="— means not found in the product's docs on 9 November 2026."
      />
      <p>
        Looking at Mailpit, smtp4dev or MailCatcher too? See
        <NuxtLink to="/compare/mailhog-alternatives">MailHog alternatives in 2026</NuxtLink>.
      </p>
    </CompareSection>

    <CompareSection title="Pick Buggregator if… / Keep Mailtrap if…">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h3 class="text-lg font-semibold text-white mb-3">Pick Buggregator if:</h3>
          <ul class="space-y-2 list-disc pl-5">
            <li>you test email on your own machine or in CI and don't want a quota;</li>
            <li>your tests wait for a confirmation email or a one-time code (<code>GET /api/smtp/messages/wait</code>, then <code>GET /api/smtp/message/{uuid}/codes</code> or <code>/links</code>);</li>
            <li>you run several apps and want one inbox per app (set the SMTP username to the project name);</li>
            <li>you also want Sentry errors, dumps and logs from the same app in the same window.</li>
          </ul>
        </div>
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h3 class="text-lg font-semibold text-white mb-3">Keep Mailtrap (Sandbox) if:</h3>
          <ul class="space-y-2 list-disc pl-5">
            <li>you check spam scores, blacklists or how the email looks in real clients;</li>
            <li>testers or clients need to see the emails from anywhere;</li>
            <li>you need forwarding, SSO or audit logs.</li>
          </ul>
        </div>
      </div>
    </CompareSection>

    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <FeatureCTA docs-url="https://docs.buggregator.dev/config/smtp.html">
      <template #related>
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/compare/mailhog-alternatives" label="MailHog alternatives" color="#f59e0b" />
        <FeatureRelatedLink to="/compare/sentry-for-local-development" label="Sentry for local development" color="#f43f5e" />
      </template>
    </FeatureCTA>

    <CompareChecked />
  </div>
</template>
