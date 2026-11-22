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

const seoTitle = 'Local Cron Monitoring for Scheduled Jobs: Sentry Crons and Ping URLs — Buggregator'

useSeoMeta({
  title: seoTitle,
  description: 'See which scheduled jobs ran, failed, never started or never finished. Jobs report through Sentry Crons check-ins or a plain ping URL with curl. Missed and hung runs marked for you. Locally, without a Sentry account. Free and open source.',
  ogTitle: seoTitle,
  ogDescription: 'Which runs went fine, which failed, which never started and which never finished. Sentry Crons or a ping URL.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: 'Which scheduled runs went fine, failed, never started or never finished. Sentry Crons or a ping URL.',
})

const accentColor = '#84cc16'

const pingScript = `B=http://127.0.0.1:8000
curl -fsS "$B/ping/backup/start?schedule=0+2+*+*+*&tz=Europe/Berlin"
if ./backup.sh > out.log 2>&1; then
  curl -fsS -X POST --data-binary @out.log "$B/ping/backup"
else
  curl -fsS -X POST --data-binary @out.log "$B/ping/backup/fail"
fi`

const steps = [
  {
    title: 'Start Buggregator with a database file',
    description: `Requires Buggregator v2.13.0 or later. The default database lives in memory, so jobs and their runs are gone after a restart: start it with -db buggregator.db or DATABASE_DSN. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
      {
        id: 'docker',
        label: 'Docker',
        code: `$ docker run -p 127.0.0.1:8000:8000 \\
    -e DATABASE_DSN=/data/buggregator.db \\
    -v ./data:/data \\
    ghcr.io/buggregator/server:{imageTag}`,
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
    environment:
      DATABASE_DSN: /data/buggregator.db
    volumes:
      - buggregator-data:/data

volumes:
  buggregator-data:`,
      },
    ],
  },
  {
    title: 'Let the job report its runs',
    description: 'The first report creates the job. No setup in Buggregator. Already using a Sentry SDK? Point it at Buggregator as usual and use its cron monitoring. No SDK? Call a ping URL with curl when the job starts and when it ends.',
    tabs: [
      {
        id: 'ping',
        label: 'Ping URL',
        code: pingScript,
        note: '/ping/<job>/start: the run started. /ping/<job>: it finished fine. /ping/<job>/fail: it failed. GET or POST, no login. A POST body is kept as the run’s output (the last 10 KB). In the schedule, a + is a space.',
      },
      {
        id: 'laravel',
        label: 'Laravel',
        code: `$schedule->command('report:nightly')->dailyAt('03:00')->sentryMonitor();`,
        note: 'Uses the Sentry SDK. Point its DSN at Buggregator, as on the Sentry page.',
      },
      {
        id: 'python',
        label: 'Python',
        code: `from sentry_sdk.crons import monitor

@monitor(monitor_slug='nightly-report', monitor_config={
    'schedule': {'type': 'crontab', 'value': '0 3 * * *'},
    'timezone': 'Europe/Berlin',
    'checkin_margin': 5,
    'max_runtime': 30,
})
def nightly_report():
    ...`,
        note: 'The schedule and limits the SDK sends update the job on every run.',
      },
      {
        id: 'sentry-http',
        label: 'Sentry cron URL',
        code: `curl "http://127.0.0.1:8000/api/1/cron/nightly-report/sentry/?status=in_progress"
# {"id":"faa0e9526330486cba530a9cdcc4b28e"}
curl "http://127.0.0.1:8000/api/1/cron/nightly-report/sentry/?status=ok&check_in_id=faa0e9526330486cba530a9cdcc4b28e&duration=2.5"`,
        note: 'Sentry’s cron HTTP endpoint, for scripts without an SDK.',
      },
    ],
  },
  {
    title: 'Open Sentry → Crons',
    description: 'Every job with its status, schedule, last and next run, and its last 20 runs. Open a job for its run history and output. With no jobs yet, the tab shows how to set one up.',
  },
]

const highlights = [
  {
    icon: '\u{1F4E8}',
    title: 'Two ways to report',
    description: 'Sentry Crons check-ins to the usual DSN, or a ping URL any script can call with curl. The first report creates the job.',
  },
  {
    icon: '\u{1F6AB}',
    title: 'Missed runs show up',
    description: 'The run was due and nothing came? Buggregator marks it missed. Several missed runs in a row make one entry. A job without a schedule is never marked missed.',
  },
  {
    icon: '\u{231B}',
    title: 'Hung runs too',
    description: 'A run that started and did not finish within max_runtime (30 minutes by default) is marked timeout.',
  },
  {
    icon: '\u{1F4A4}',
    title: 'Runs while Buggregator was off',
    description: 'A run that was due while Buggregator itself was not running is marked unknown. Needs a database file.',
  },
  {
    icon: '\u{1F6A8}',
    title: 'Needs attention first',
    description: 'Jobs that failed, hung, missed a run or are running late come first. One button shows only those; type to filter jobs. Times are in each job’s time zone.',
  },
  {
    icon: '\u{1F4C4}',
    title: 'Output and an API',
    description: 'Each run keeps the output the job sent. The same data through the API: list jobs and runs, change a schedule, delete a job.',
  },
]

const worksWithItems = [
  { name: 'Sentry SDK', detail: '— Crons check-ins, e.g. Laravel sentryMonitor() or Python @monitor' },
  { name: 'Sentry cron HTTP endpoint', detail: '— /api/<project>/cron/<job>/<key>/' },
  { name: 'Any script', detail: '— curl to /ping/<job>, /start and /fail' },
  { name: 'Schedules', detail: '— crontab with 5 fields or @daily and the like; intervals from the Sentry SDK' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Know which scheduled jobs ran, failed or never started"
      subtitle="Cron Monitoring"
      description="Did last night’s backup run? Is the queue cleanup stuck? Your scheduled jobs report each run to Buggregator, and it shows which runs went fine, which failed, which never started and which never finished. Locally, without a Sentry account."
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
          <span class="font-mono text-xs text-on-dark-muted">Sentry Crons or a plain ping URL</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/cron-monitoring.png"
          alt="Buggregator Sentry Crons tab: scheduled jobs with status, schedule, last and next run and a strip of recent runs"
          caption="Sentry → Crons: every job with its status, schedule, last and next run and its last 20 runs."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Every run, and the runs that didn’t happen"
      subtitle="Your jobs report in_progress, ok and error. Buggregator checks every 30 seconds and adds missed, timeout and unknown on its own."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">Did my backup run last night?</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          Wrap the backup script in three curl calls: one at the start, one when it ends fine, one when it fails. In the
          morning, open Sentry → Crons. A run marked ok finished fine. A failed run comes with the output the script sent.
          If the 2 a.m. run never called in, it is marked missed.
        </p>
      </div>
    </section>

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with Sentry Crons and with curl"
      description="Use the Sentry SDK you already have, or any script that can call a URL."
      :items="worksWithItems"
    />
    <section class="-mt-10 lg:-mt-12 pb-16 lg:pb-20 bg-section-dark">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div class="rounded-xl border border-landing-border-subtle p-5">
          <h2 class="text-lg font-semibold text-white mb-2">What it does not do</h2>
          <ul class="text-sm leading-relaxed text-on-dark-secondary list-disc pl-5 space-y-1">
            <li>No alerts: a missed run shows up in Buggregator, nobody is notified.</li>
            <li>Runs make no cards in the event feed; they are under Sentry → Crons.</li>
            <li>At most 500 jobs per project.</li>
            <li>A ping sets only a crontab schedule; intervals come from the Sentry SDK. @every and TZ= inside the crontab are not supported.</li>
            <li>Margin and max runtime are whole minutes. A status may appear up to 30 seconds late.</li>
          </ul>
        </div>
      </div>
    </section>

    <FeatureTips label="cron monitoring" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/crons.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/logs" label="Logs" color="#6b7280" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/broadcast-events" label="Broadcast Events" color="#ec4899" />
      </template>
    </FeatureCTA>
  </div>
</template>
