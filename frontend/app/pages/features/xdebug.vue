<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import XdebugTab from '~/components/showcase/tabs/XdebugTab.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'Debug PHP with Xdebug in Your Browser, IDE or AI Agent — Buggregator',
  description: 'Pause a PHP script at a breakpoint and step through it in the browser, from your IDE, or let your AI agent drive over MCP. Breakpoints saved, local, free and open source.',
  ogTitle: 'Debug PHP with Xdebug in Your Browser, IDE or AI Agent — Buggregator',
  ogDescription: 'Pause a PHP script at a breakpoint and step through it in the browser, from your IDE, or let your AI agent drive over MCP. Breakpoints saved, local, free and open source.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Debug PHP with Xdebug in Your Browser, IDE or AI Agent — Buggregator',
  twitterDescription: 'Pause a PHP script at a breakpoint and step through it in the browser, from your IDE, or let your AI agent drive over MCP. Breakpoints saved, local, free and open source.',
})

const accentColor = '#f97316'

const steps = [
  {
    title: 'Turn the proxy on',
    description: 'Stepping in the browser needs Buggregator v2.7.0 or later. Pick your path: no IDE, or your IDE as before.',
    tabs: [
      {
        id: 'no-ide',
        label: 'No IDE',
        code: `xdebug:
  enabled: true
  addr: 127.0.0.1:9003
mcp:
  enabled: true`,
        note: 'Turn the proxy on, and MCP if your AI should drive. Nothing else to set: the default mode, auto, steps in when no IDE answers.',
      },
      {
        id: 'with-ide',
        label: 'With an IDE',
        code: `xdebug:
  enabled: true
  addr: 127.0.0.1:9003        # where Xdebug connects
  ide_addr: 127.0.0.1:9004    # where your IDE listens
mcp:
  enabled: true`,
        note: 'The proxy and your IDE can\'t both listen on 9003: set your IDE\'s Xdebug debug port to 9004 (PhpStorm: Settings → PHP → Debug → Xdebug → Debug port).',
      },
      {
        id: 'env',
        label: 'Environment',
        code: `XDEBUG_PROXY_ENABLED=true
MCP_ENABLED=true`,
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `# PHP in a container too: in the PHP container,
# set xdebug.client_host to the service name (buggregator).
services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
    environment:
      XDEBUG_PROXY_ENABLED: "true"
      XDEBUG_PROXY_ADDR: 0.0.0.0:9003
      XDEBUG_PROXY_IDE_ADDR: host.docker.internal:9004
      MCP_ENABLED: "true"
    extra_hosts:
      - host.docker.internal:host-gateway   # needed on Linux`,
      },
      {
        id: 'keep-9003',
        label: 'Keep IDE on 9003',
        code: `# buggregator.yaml
xdebug:
  enabled: true
  addr: 127.0.0.1:9010
  ide_addr: 127.0.0.1:9003

# php.ini
xdebug.client_port=9010`,
      },
    ],
    note: 'Want the old behaviour, where a script without an IDE just runs on? Set xdebug.mode: proxy.',
  },
  {
    title: 'Point Xdebug at Buggregator',
    description: 'A typical php.ini — Xdebug keeps port 9003. Then put xdebug_break() where you want to stop, or open the Xdebug page and turn on Pause on the first line.',
    code: `xdebug.mode=debug
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
xdebug.start_with_request=trigger`,
    language: 'ini',
  },
  {
    title: 'Connect your AI assistant',
    description: 'Add Buggregator as an MCP server, then ask: "Where did the script stop?", "Step over and show me $total." or "Set a breakpoint on OrderService.php:58 and continue."',
    tabs: [
      {
        id: 'claude',
        label: 'Claude Code (.mcp.json)',
        code: `{
  "mcpServers": {
    "buggregator": {
      "type": "stdio",
      "command": "buggregator",
      "args": ["mcp"]
    }
  }
}`,
      },
      {
        id: 'docker-http',
        label: 'Docker (HTTP)',
        code: `// Needs MCP_ENABLED: "true", MCP_TRANSPORT: http and port 8001 published
{
  "mcpServers": {
    "buggregator": {
      "type": "http",
      "url": "http://localhost:8001/mcp"
    }
  }
}`,
      },
    ],
  },
]

const highlights = [
  {
    icon: '\u23EF\uFE0F',
    title: 'Step in the browser',
    description: 'No IDE listening? Buggregator drives the session: continue, step over, into and out, release the script or stop the request — from the Xdebug page.',
  },
  {
    icon: '\u{1F4CD}',
    title: 'Breakpoints that stay',
    description: 'Click a line number, or type path:line or an exception class like Throwable. Breakpoints are saved and sent to every session Buggregator drives, after a restart too.',
  },
  {
    icon: '\u{1F916}',
    title: 'Your AI can step too',
    description: 'MCP tools let Claude Code, Cursor and other MCP clients read variables and the stack — and, when no IDE is attached, step, continue, stop and set breakpoints. The page shows which agent made the last step.',
  },
  {
    icon: '\u{1F9D1}\u200D\u{1F4BB}',
    title: 'Your IDE still works',
    description: 'Keep debugging in PhpStorm or VS Code. While an IDE is attached it drives, and Buggregator only reads the session.',
  },
  {
    icon: '\u23F1\uFE0F',
    title: 'A paused script doesn\'t wait forever',
    description: 'A session nobody touches is released after 10 minutes (xdebug.idle_timeout), so a forgotten pause doesn\'t hold a PHP worker or a transaction.',
  },
  {
    icon: '\u{1F510}',
    title: 'You decide what the AI may do',
    description: 'Agents can step by default; xdebug.allow_control: false keeps them read-only. Evaluating PHP — watches, conditions, xdebug_eval — stays off until you set allow_eval: true.',
  },
]

const worksWithItems = [
  { name: 'PhpStorm', detail: '— optional; move its Xdebug port to 9004' },
  { name: 'VS Code', detail: '— any Xdebug client' },
  { name: 'Claude Code', detail: '— MCP over stdio or HTTP' },
  { name: 'Cursor', detail: '— ./buggregator mcp or the HTTP URL' },
  { name: 'Any MCP client', detail: '— xdebug_location, xdebug_stack, xdebug_variables, xdebug_property' },
  { name: 'Docker', detail: '— PHP, Buggregator and the IDE on different hosts' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Step through PHP in your browser — or let your AI do it"
      subtitle="Xdebug, with or without an IDE"
      description="Put xdebug_break() in your code or click a line number, run the request, and the script stops in Buggregator. Step over, into and out, continue or stop — from the Xdebug page, or by your AI agent over MCP. Use PhpStorm or VS Code? They keep working as before."
      :accent-color="accentColor"
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
          <span class="font-mono text-xs text-on-dark-muted">Off by default · works with or without an IDE</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Built screen (example data) -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="Buggregator Xdebug screen: paused session with step buttons, variables, call stack and source"
          caption="A paused request driven from the browser: step buttons, a breakpoint on line 36, variables and the call stack. Example data."
        >
          <XdebugTab />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="Debug from wherever you are"
      subtitle="With an IDE, Buggregator stays out of its way. Without one, it runs the session itself."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>
    <div class="bg-section-dark px-4 sm:px-6 lg:px-8 pb-12">
      <p class="max-w-[720px] mx-auto rounded-xl border border-landing-border-subtle bg-landing-surface px-4 py-3 font-sans text-sm text-on-dark-secondary">
        <span aria-hidden="true">&#x1F512; </span>The proxy has no login of its own: anyone who can reach its port can start a session. Keep it on 127.0.0.1 or inside your Docker network. A paused script holds a PHP worker and any open transaction; Stop ends the request where it is.
      </p>
    </div>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with the IDE and AI tools you use"
      description="Buggregator speaks Xdebug's own protocol (DBGp), so an IDE works as before — and you don't need one."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/xdebug.html">
      <template #related>
        <FeatureRelatedLink to="/features/mock-server" label="Mock Server" color="#0ea5e9" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/sentry" label="Sentry" color="#f43f5e" />
      </template>
    </FeatureCTA>
  </div>
</template>
