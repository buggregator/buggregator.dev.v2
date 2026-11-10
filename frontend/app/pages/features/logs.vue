<script setup lang="ts">
import FeatureTips from '~/components/tips/FeatureTips.vue'
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import LogRecordsVisual from '~/components/features/visuals/LogRecordsVisual.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'PHP Log Viewer for Local Development — Monolog Logs in One Place — Buggregator',
  description: 'See Monolog logs from every service and worker in one live view: channel, level, message and context as JSON. Works with Laravel, Symfony and Spiral. No Elasticsearch, no logging stack. Free and open source.',
  ogTitle: 'Monolog Logs in One Live View — Buggregator',
  ogDescription: 'Logs from every service, worker and container in one place, with structured context. No logging stack to run.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Monolog Logs in One Live View — Buggregator',
  twitterDescription: 'Logs from every service, worker and container in one place, with structured context. No logging stack to run.',
})

const accentColor = '#6b7280'

const steps = [
  {
    title: 'Start Buggregator',
    description: `Logs arrive over TCP on port 9913. The UI is on port 8000. One file, about ${BINARY_SIZE_MB} MB, installed with one command. Prefer containers? Use the Docker tab.`,
    tabs: [
      {
        id: 'binary',
        label: 'Binary',
        binary: true,
      },
      {
        id: 'docker',
        label: 'Docker',
        code: '$ docker run -p 127.0.0.1:8000:8000 -p 127.0.0.1:9913:9913 ghcr.io/buggregator/server:{imageTag}',
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:9913:9913`,
      },
    ],
  },
  {
    title: 'Add a socket handler to your logger',
    description: 'Use Monolog\'s SocketHandler with JsonFormatter — the JSON formatter is required. In Docker Compose, use the service name instead of 127.0.0.1 (e.g. buggregator:9913).',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel',
        code: `// config/logging.php
'channels' => [
    'socket' => [
        'driver' => 'monolog',
        'level' => env('LOG_LEVEL', 'debug'),
        'handler' => \\Monolog\\Handler\\SocketHandler::class,
        'formatter' => \\Monolog\\Formatter\\JsonFormatter::class,
        'handler_with' => [
            'connectionString' => env('LOG_SOCKET_URL', '127.0.0.1:9913'),
        ],
    ],
],`,
      },
      {
        id: 'symfony',
        label: 'Symfony',
        code: `// config/packages/dev/monolog.php
$monologConfig
    ->handler('socket')
        ->level('debug')
        ->formatter('monolog.formatter.json')
        ->type('socket')
        ->connectionString(env('MONOLOG_SOCKET_HOST'));`,
      },
      {
        id: 'spiral',
        label: 'Spiral',
        code: `// App\\Bootloader\\LoggingBootloader::init()
$handler = new SocketHandler($env->get('MONOLOG_SOCKET_HOST'), chunkSize: 10);
$handler->setFormatter(new JsonFormatter(JsonFormatter::BATCH_MODE_NEWLINES));
$monolog->addHandler('socket', $handler);`,
      },
      {
        id: 'any',
        label: 'Any PHP',
        code: `$log = new Logger('app');
$handler = new SocketHandler('127.0.0.1:9913');
$handler->setFormatter(new JsonFormatter());
$log->pushHandler($handler);

$log->warning('Payment retry', ['order' => 42]);`,
      },
    ],
  },
  {
    title: 'Point it at Buggregator',
    description: 'Set the address in .env and open http://127.0.0.1:8000. New records appear as they are written.',
    tabs: [
      {
        id: 'laravel-env',
        label: 'Laravel',
        code: `LOG_CHANNEL=socket
LOG_SOCKET_URL=127.0.0.1:9913`,
      },
      {
        id: 'symfony-env',
        label: 'Symfony',
        code: 'MONOLOG_SOCKET_HOST=127.0.0.1:9913',
      },
      {
        id: 'spiral-env',
        label: 'Spiral',
        code: `MONOLOG_DEFAULT_CHANNEL=socket
MONOLOG_SOCKET_HOST=127.0.0.1:9913`,
      },
    ],
  },
]

const highlights = [
  {
    icon: '\u{1F9E9}',
    title: 'Context as JSON',
    description: 'Context and extra fields from Monolog processors are shown as formatted JSON, not one long string in a terminal.',
  },
  {
    icon: '\u{1F4CD}',
    title: 'Where it was logged',
    description: 'File, line and function, when your logger puts them in the record\'s context as source.',
  },
  {
    icon: '\u{1F50E}',
    title: 'Search',
    description: 'Find records by message, channel or level — type "error" or "security".',
  },
  {
    icon: '\u{1F6A6}',
    title: 'All PSR-3 levels',
    description: 'All 8 PSR-3 levels, colour-coded by severity, so errors stand out.',
  },
  {
    icon: '\u{1F9F5}',
    title: 'Workers and daemons too',
    description: 'Queue consumers, cron jobs and daemons write logs that are easy to miss in stdout. Buggregator catches them all.',
  },
  {
    icon: '\u{1F433}',
    title: 'Every service, one place',
    description: 'Point every container at the same Buggregator and read their logs side by side — next to the exceptions and dumps from the same moment, in one feed.',
  },
]

const worksWithItems = [
  { name: 'Laravel', detail: '— a socket channel in config/logging.php' },
  { name: 'Symfony', detail: '— a socket handler in config/packages/dev/monolog.php' },
  { name: 'Spiral', detail: '— a handler in your LoggingBootloader' },
  { name: 'Any PHP', detail: '— monolog/monolog with SocketHandler' },
  { name: 'Docker', detail: '— buggregator:9913 from any container' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Stop tailing log files"
      subtitle="Logs"
      description="During development your logs end up in a file you tail -f, in container output you scroll, or in a worker's stdout you never see. Send them to Buggregator instead: logs from every service land in the same live view as your exceptions, dumps and emails — with the context readable as JSON."
      :accent-color="accentColor"
      accent-text-color="#9ca3af"
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
          <span class="font-mono text-xs text-on-dark-muted">Monolog SocketHandler · port 9913</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Built screen (example data) -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="Buggregator log records: channel, level, message and context as JSON"
          caption="Each record with its channel, level, message and context. Example data."
        >
          <LogRecordsVisual />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Logs you can actually read"
      subtitle="No Elasticsearch, no log shipper, no separate logging stack — one handler in your logger config."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with Monolog — and the frameworks built on it"
      description="Anything that logs through Monolog can send to Buggregator. One handler, no new package in your app."
      :items="worksWithItems"
    />

    <FeatureTips label="logs" />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/monolog.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
        <FeatureRelatedLink to="/features/http-dumps" label="HTTP Dumps" color="#22c55e" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
      </template>
    </FeatureCTA>
  </div>
</template>
