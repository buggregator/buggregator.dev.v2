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
  title: 'Xdebug Proxy — Share a Paused Debug Session with Your AI Assistant — Buggregator',
  description: 'Keep debugging in PhpStorm or VS Code. Buggregator sits between Xdebug and your IDE and shows the paused session in the browser — source, stack, variables — and to AI assistants over MCP. Off by default. Free and open source.',
  ogTitle: 'Xdebug Proxy — Let Your AI Assistant See Your Breakpoint — Buggregator',
  ogDescription: 'Your IDE keeps stepping and breakpoints. The browser and your AI assistant see the same paused session.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Xdebug Proxy — Let Your AI Assistant See Your Breakpoint — Buggregator',
  twitterDescription: 'Your IDE keeps stepping and breakpoints. The browser and your AI assistant see the same paused session.',
})

const accentColor = '#f97316'

const steps = [
  {
    title: 'Turn the proxy on',
    description: 'Requires Buggregator v2.6.0 or later. The Xdebug proxy is off by default; turn on MCP too, so your AI assistant can see the session. The proxy and your IDE can\'t both listen on 9003: set your IDE\'s Xdebug debug port to 9004 (PhpStorm: Settings → PHP → Debug → Xdebug → Debug port).',
    tabs: [
      {
        id: 'yaml',
        label: 'buggregator.yaml',
        code: `xdebug:
  enabled: true
  addr: 127.0.0.1:9003        # where Xdebug connects
  ide_addr: 127.0.0.1:9004    # where your IDE listens
mcp:
  enabled: true`,
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
  },
  {
    title: 'Point Xdebug at Buggregator',
    description: 'A typical php.ini — Xdebug keeps port 9003. Start a debug session in your IDE as usual and stop at a breakpoint.',
    code: `xdebug.mode=debug
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
xdebug.start_with_request=trigger`,
    language: 'ini',
  },
  {
    title: 'Connect your AI assistant',
    description: 'Add Buggregator as an MCP server, then ask: "Where did the script stop?" or "What is in $user?"',
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
    icon: '\u{1F916}',
    title: 'Your AI sees the runtime',
    description: 'MCP tools let Claude Code, Cursor and other MCP clients read the current line, the call stack and any variable — like $user->address or $items[0].',
  },
  {
    icon: '\u{1F9D1}‍\u{1F4BB}',
    title: 'Your IDE stays in charge',
    description: 'Stepping, continuing and breakpoints stay in PhpStorm or VS Code. The IDE gets the session unchanged.',
  },
  {
    icon: '\u{1F5A5}️',
    title: 'The session in your browser',
    description: 'Source around the paused line with the IDE\'s breakpoints, locals, superglobals and constants, and the call stack with vendor frames folded.',
  },
  {
    icon: '\u{1F4DC}',
    title: 'See what the AI asked',
    description: 'Agent activity lists the assistant’s MCP calls in the session, refused ones included.',
  },
  {
    icon: '\u{1F6DF}',
    title: 'No IDE? No hang',
    description: 'If no IDE is listening, or it goes away, Buggregator detaches and the script runs on as if there were no debugger.',
  },
  {
    icon: '\u{1F510}',
    title: 'Eval only when you allow it',
    description: 'Watches and xdebug_eval run PHP expressions in the paused request, and an expression can change state. They stay off until you set allow_eval: true.',
  },
]

const worksWithItems = [
  { name: 'PhpStorm', detail: '— move the Xdebug debug port to 9004' },
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
      title="Let your AI assistant see your breakpoint"
      subtitle="Xdebug Proxy"
      description="You debug PHP in your IDE as usual. Buggregator sits between Xdebug and the IDE and lets others look at the same paused session: the Xdebug page in the browser, and your AI assistant over MCP. Stepping, continuing and breakpoints stay in your IDE."
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
          <span class="font-mono text-xs text-on-dark-muted">Off by default · your IDE stays in charge</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Built screen (example data) -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="Buggregator Xdebug screen: paused session with variables, call stack and source"
          caption="A paused request: the source around the line, variables and the call stack. Example data."
        >
          <XdebugTab />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="One breakpoint, seen by you, your AI and your team"
      subtitle="The IDE gets the session unchanged. Buggregator reads where the script stopped."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>
    <div class="bg-section-dark px-4 sm:px-6 lg:px-8 pb-12">
      <p class="max-w-[720px] mx-auto rounded-xl border border-landing-border-subtle bg-landing-surface px-4 py-3 font-sans text-sm text-on-dark-secondary">
        <span aria-hidden="true">&#x1F512; </span>The proxy has no login of its own: anyone who can reach its port can start a session. Keep it on 127.0.0.1 or inside your Docker network.
      </p>
    </div>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with the IDE and AI tools you use"
      description="Buggregator speaks Xdebug's own protocol (DBGp) on both sides, so your IDE works as before."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/xdebug.html">
      <template #related>
        <FeatureRelatedLink to="/features/mock-server" label="Mock Server" color="#0ea5e9" />
        <FeatureRelatedLink to="/features/profiler" label="Performance Profiler" color="#8b5cf6" />
        <FeatureRelatedLink to="/features/sentry" label="Exception Tracking" color="#f43f5e" />
      </template>
    </FeatureCTA>
  </div>
</template>
