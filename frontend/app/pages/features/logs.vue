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

useSeoMeta({
  title: 'PHP Log Viewer for Local Development — Monolog Logs in One Place — Buggregator',
  description: 'Search Monolog logs from every service and worker in one live stream: filter by level, channel and time, see errors per minute, and open all lines of one request. Laravel, Symfony, Spiral. No Elasticsearch, no logging stack. Free and open source.',
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
    description: 'Set the address in .env, then open Logs in the sidebar, or http://127.0.0.1:8000/logs. New lines appear as they are written. The Logs screen needs Buggregator v2.14.0 or later.',
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
    icon: '\u{1F50E}',
    title: 'Search every word',
    description: 'Type words, and only lines that contain all of them stay. Search looks in the message, the channel and the keys and values of context and extra. Case does not matter.',
  },
  {
    icon: '\u{1F6A6}',
    title: 'Levels, channels, time',
    description: 'One chip per level with its count, for example error 12. Pick channels such as payments or db. The last hour by default, up to all time.',
  },
  {
    icon: '\u{1F4C8}',
    title: 'Lines per minute',
    description: 'A chart colored by level. A spike of red bars is a burst of errors.',
  },
  {
    icon: '\u{23F8}',
    title: 'Live, with a pause',
    description: 'New lines appear as they come. Pause to read in peace: the screen counts what came in, and Show them adds it.',
  },
  {
    icon: '\u{1F9F5}',
    title: 'All lines of one request',
    description: 'A line with a trace id links to every line of the same request, and to its trace in Sentry.',
  },
  {
    icon: '\u{1F517}',
    title: 'Views you can share',
    description: 'The address keeps the view, for example /logs?q=order+failed&level=error&channel=payments. Context and extra open as JSON.',
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
      description="During development your logs end up in a file you tail -f, in container output you scroll, or in a worker's stdout you never see. Send them to Buggregator instead: the Logs screen shows lines from every service as one live stream, like tail -f with search, filters by level and channel, and a chart of errors per minute."
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
          src="/features/logs-screen.png"
          alt="Buggregator Logs screen: a search box, level chips with counts, channel and period pickers, a chart of lines per minute colored by level, and the live stream of log lines"
          caption="The Logs screen: search, level chips with counts, a chart of lines per minute and the live stream."
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Find the line you need"
      subtitle="No Elasticsearch, no log shipper, no separate logging stack — one handler in your logger config."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Use case -->
    <section id="use-case" class="py-16 lg:py-20 bg-section-dark border-t border-landing-border-subtle">
      <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 font-sans text-center">
        <h2 class="text-section font-bold text-white mb-3">A burst of payment errors at 14:05</h2>
        <p class="text-lg text-on-dark-secondary leading-relaxed">
          The chart shows a red spike. Turn off every level but error, pick the payments channel and type
          «card declined». Click a line: its context shows the order and the code. All lines of this request shows
          every line with the same trace id: what the request did before it failed.
        </p>
      </div>
    </section>

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
