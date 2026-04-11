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
  title: 'PHP Performance Profiler with Flame Graphs — Buggregator',
  description: 'Profile your PHP application with XHProf. See flame graphs, call graphs, and the slowest functions. Compare profiles to track regressions. Free, open-source, no Blackfire subscription needed.',
  ogTitle: 'PHP Performance Profiler with Flame Graphs — Buggregator',
  ogDescription: 'Flame graphs, call graphs, top functions. Profile PHP apps with XHProf. Free alternative to Blackfire.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'PHP Performance Profiler with Flame Graphs — Buggregator',
  twitterDescription: 'Profile your PHP app with XHProf. Flame graphs, call graphs, function-level timing.',
})

const accentColor = '#8b5cf6'

const steps = [
  {
    title: 'Start Buggregator',
    description: 'The profiler endpoint runs on the same port 8000 as everything else.',
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
    title: 'Install the XHProf extension and profiler package',
    description: 'Install the XHProf PHP extension, then add the profiler package for your framework.',
    tabs: [
      {
        id: 'laravel',
        label: 'Laravel',
        code: `# Install XHProf extension
$ pecl install xhprof

# Install the Laravel profiler package
$ composer require --dev maantje/xhprof-buggregator-laravel

# .env
PROFILER_ENDPOINT=http://profiler@127.0.0.1:8000`,
      },
      {
        id: 'symfony',
        label: 'Symfony',
        code: `# Install XHProf extension
$ pecl install xhprof

# Install the Symfony profiler bundle
$ composer require --dev velpl/buggregator-profiler-bundle:^0.2

# .env
PROFILER_ENDPOINT=http://profiler@127.0.0.1:8000`,
      },
      {
        id: 'spiral',
        label: 'Spiral',
        code: `# Install XHProf extension
$ pecl install xhprof

# Install the Spiral profiler package
$ composer require --dev spiral/profiler:^3.0

# .env
PROFILER_ENDPOINT=http://profiler@127.0.0.1:8000`,
      },
      {
        id: 'any',
        label: 'Any PHP',
        code: `# Install XHProf extension
$ pecl install xhprof

# In your code:
$profiler = new Profiler(
    new WebStorage('http://profiler@127.0.0.1:8000')
);
$profiler->start();

# ... your code ...

$profiler->end();`,
      },
    ],
  },
  {
    title: 'Load a page \u2014 see the profile',
    description: 'Make a request to your application. The profile data is automatically sent to Buggregator where you can explore it as a flame graph, call graph, or sorted function table.',
  },
]

const highlights = [
  {
    icon: '\u{1F525}',
    title: 'Flame graphs',
    description: 'Interactive flame graph visualization. Zoom into call stacks, identify hot paths at a glance.',
  },
  {
    icon: '\u{1F333}',
    title: 'Call graphs',
    description: 'Tree visualization of function calls with color-coded execution time. See which branches are slow.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Top functions',
    description: 'Sortable table of all functions by wall time, CPU time, memory, and call count.',
  },
  {
    icon: '\u{1F50D}',
    title: 'Profile comparison',
    description: 'Compare two profiles side by side to spot regressions. See exactly what got slower and by how much.',
  },
  {
    icon: '\u{23F1}\uFE0F',
    title: 'Wall time & CPU time',
    description: 'Distinguish between time waiting (I/O, DB) and time computing. Find the real bottleneck.',
  },
  {
    icon: '\u{1F9E0}',
    title: 'Memory tracking',
    description: 'See memory allocation per function. Find memory-hungry code before it causes problems.',
  },
]

const worksWithItems = [
  { name: 'Laravel', detail: '\u2014 via maantje/xhprof-buggregator-laravel' },
  { name: 'Symfony', detail: '\u2014 via buggregator-profiler-bundle' },
  { name: 'Spiral', detail: '\u2014 via spiral/profiler' },
  { name: 'Any PHP project', detail: '\u2014 via raw XHProf API + WebStorage' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Find what makes your PHP app slow"
      subtitle="Performance Profiler"
      description="You know something is slow, but not what. Buggregator collects XHProf profiling data and shows it as flame graphs, call graphs, and function tables. See exactly where time is spent \u2014 wall time, CPU time, memory \u2014 in every request."
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
          <span class="font-mono text-xs text-on-dark-muted">Free Blackfire alternative</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Screenshot -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          src="/features/profiler.png"
          alt="Screenshot: Buggregator flame graph showing PHP function execution times"
          caption="Interactive flame graph with function-level wall time, CPU time, and memory usage"
        />
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Understand your application's performance"
      subtitle="Multiple ways to visualize profiling data. Find the bottleneck that matters."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with PHP frameworks"
      description="XHProf is a PHP extension. Buggregator provides profiler packages for popular frameworks."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/xhprof.html">
      <template #related>
        <FeatureRelatedLink to="/features/sentry" label="Exception Tracking" color="#f43f5e" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
        <FeatureRelatedLink to="/features/http-proxy" label="HTTP Proxy" color="#10b981" />
        <FeatureRelatedLink to="/features/sms" label="SMS Testing" color="#a855f7" />
      </template>
    </FeatureCTA>
  </div>
</template>
