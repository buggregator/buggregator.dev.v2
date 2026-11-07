<script setup lang="ts">
import FeatureHero from '~/components/features/FeatureHero.vue'
import FeatureSetup from '~/components/features/FeatureSetup.vue'
import FeatureScreenshot from '~/components/features/FeatureScreenshot.vue'
import FeatureHighlights from '~/components/features/FeatureHighlights.vue'
import FeatureWorksWithSection from '~/components/features/FeatureWorksWithSection.vue'
import FeatureCTA from '~/components/features/FeatureCTA.vue'
import FeatureRelatedLink from '~/components/features/FeatureRelatedLink.vue'
import McpChatVisual from '~/components/features/visuals/McpChatVisual.vue'

definePageMeta({ layout: 'landing' })
// English only: no /ru or /es copies of this page (they would be duplicates).
defineI18nRoute(false)

useSeoMeta({
  title: 'MCP Server and REST API — Your Debug Data for AI Assistants and Scripts — Buggregator',
  description: 'Let Claude Code, Cursor or any MCP client read your errors, dumps, profiles and paused Xdebug sessions. Use the REST API to wait for test emails, pull links and codes, and manage mock rules from scripts. MCP is off by default. Free and open source.',
  ogTitle: 'MCP Server and REST API — Buggregator',
  ogDescription: 'Your AI assistant reads the errors, dumps and profiles Buggregator caught. Your tests read the emails.',
  ogImage: 'https://buggregator.dev/buggregator.png',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: 'MCP Server and REST API — Buggregator',
  twitterDescription: 'Your AI assistant reads the errors, dumps and profiles Buggregator caught. Your tests read the emails.',
})

const accentColor = '#14b8a6'

const steps = [
  {
    title: 'Turn MCP on',
    description: 'Requires Buggregator v2.6.0 or later. MCP is off by default. Turn it on with one setting. Locally it listens on a Unix socket; in Docker, use HTTP on port 8001.',
    note: 'MCP has its own access rules, separate from SSO. Over HTTP it has no token unless you set MCP_AUTH_TOKEN — keep the port on 127.0.0.1, as above.',
    tabs: [
      {
        id: 'env',
        label: 'Environment',
        code: 'MCP_ENABLED=true',
      },
      {
        id: 'yaml',
        label: 'buggregator.yaml',
        code: `mcp:
  enabled: true`,
      },
      {
        id: 'compose',
        label: 'Docker Compose',
        code: `services:
  buggregator:
    image: ghcr.io/buggregator/server:{imageTag}
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:8001:8001    # MCP over HTTP
    environment:
      MCP_ENABLED: "true"
      MCP_TRANSPORT: http
      MCP_ADDR: ":8001"
      MCP_AUTH_TOKEN: change-me # optional; clients send Authorization: Bearer`,
      },
    ],
  },
  {
    title: 'Connect your assistant',
    description: 'On the same machine, Claude Code starts buggregator mcp, which connects to the running server. With Docker, connect over HTTP at http://localhost:8001/mcp.',
    tabs: [
      {
        id: 'claude-local',
        label: 'Claude Code (local)',
        code: '$ claude mcp add buggregator -- buggregator mcp',
      },
      {
        id: 'claude-http',
        label: 'Claude Code (Docker / HTTP)',
        code: `$ claude mcp add --transport http buggregator http://localhost:8001/mcp \\
  --header "Authorization: Bearer <MCP_AUTH_TOKEN>"
# No token set? Drop the --header line.`,
      },
      {
        id: 'mcp-json',
        label: '.mcp.json (local)',
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
        id: 'mcp-json-http',
        label: '.mcp.json (HTTP)',
        code: `{
  "mcpServers": {
    "buggregator": {
      "type": "http",
      "url": "http://localhost:8001/mcp",
      "headers": { "Authorization": "Bearer <MCP_AUTH_TOKEN>" }
    }
  }
}`,
      },
      {
        id: 'codex',
        label: 'Codex (example)',
        code: `# ~/.codex/config.toml
[mcp_servers.buggregator]
url = "http://localhost:8001/mcp"
bearer_token_env_var = "BUGGREGATOR_MCP_TOKEN"   # optional`,
      },
      {
        id: 'cursor',
        label: 'Cursor',
        code: `Command: buggregator mcp
or URL:  http://localhost:8001/mcp`,
      },
    ],
  },
  {
    title: 'Ask, or call the API',
    description: 'Ask in plain words — the assistant picks the tools. Or call the REST API from a test or a script. With SSO on, the API needs the token from your browser sign-in.',
    tabs: [
      {
        id: 'ask',
        label: 'Ask your assistant',
        code: `"Why did checkout fail?"
  → events_list (type: sentry) → sentry_event

"I profiled this endpoint. Why is it slow?"
  → events_list (type: profiler) → profiler_summary → profiler_top (metric: excl_wt) → profiler_call_graph

"Why is $total zero here?"   (stopped at a breakpoint)
  → xdebug_location → xdebug_variables → xdebug_property ($cart->items)`,
      },
      {
        id: 'email',
        label: 'Wait for an email',
        code: `# Waits up to 30s for the confirmation email, then prints it
$ curl 'http://127.0.0.1:8000/api/smtp/messages/wait?to=jane@example.com&subject_contains=Confirm&since=2026-11-07T10:00:00Z&timeout=30s'

# Links and one-time codes from that email
$ curl http://127.0.0.1:8000/api/smtp/message/<uuid>/links
$ curl http://127.0.0.1:8000/api/smtp/message/<uuid>/codes`,
      },
      {
        id: 'mock',
        label: 'Add a mock rule',
        code: `$ curl -X POST http://127.0.0.1:8000/api/mocks \\
  -H 'Content-Type: application/json' \\
  -d '{"method": "POST", "path": "/orders", "status": 201, "body": "{\\"id\\": 7}"}'`,
      },
    ],
  },
]

const highlights = [
  {
    icon: '\u{1F41E}',
    title: 'Read the error, not a guess',
    description: 'Your assistant lists recent events and opens a Sentry error in a compact form: message, exception chain, stack frames with file and line, environment and tags.',
  },
  {
    icon: '\u{1F525}',
    title: 'Find what’s slow',
    description: 'From an XHProf profile it gets the summary, the top functions by time or memory, and the call graph — and names the hot function and its callers.',
  },
  {
    icon: '\u{1F4E6}',
    title: 'Dumps as plain text',
    description: 'Variable dumps come back as plain text, without HTML, so the assistant reads values, not markup.',
  },
  {
    icon: '\u{1F3AF}',
    title: 'At your breakpoint',
    description: 'With the Xdebug proxy on, the assistant reads the paused session — line, stack, variables — while you keep stepping in your IDE. Each read it makes on the paused session shows up live in Buggregator.',
  },
  {
    icon: '\u{2709}️',
    title: 'Emails in your tests',
    description: 'REST API: wait until an email arrives, search by recipient or subject, and pull out its links or one-time codes. Built for E2E sign-up and password-reset flows.',
  },
  {
    icon: '\u{1F9EA}',
    title: 'Mock rules from scripts',
    description: 'REST API: create, edit and reorder mock rules, and list the calls your app made to /mock/ \u2014 with the rule that almost matched and why.',
  },
]

const worksWithItems = [
  { name: 'Claude Code', detail: '— local via buggregator mcp, or HTTP' },
  { name: 'Codex', detail: '— HTTP config in ~/.codex/config.toml' },
  { name: 'Cursor', detail: '— the same command, or the HTTP URL' },
  { name: 'Any MCP client', detail: '— Unix socket via buggregator mcp, or HTTP on port 8001' },
  { name: 'E2E tests', detail: '— any framework that can call HTTP: wait for an email, read its code' },
  { name: 'Scripts and CI', detail: '— curl or any HTTP client against /api/' },
]
</script>

<template>
  <div>
    <FeatureHero
      title="Your debug data, for your AI assistant and your scripts"
      subtitle="MCP & API"
      description="Buggregator already holds what your app did: the exception, the dump, the profile, the email. The built-in MCP server lets your AI assistant read it, so it can explain a failure instead of guessing. The REST API lets your tests and scripts use the same data — wait for an email, read a code from it, set up mock answers."
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
          <span class="font-mono text-xs text-on-dark-muted">MCP is off by default · one switch turns it on</span>
        </div>
      </template>
    </FeatureHero>

    <!-- Visual -->
    <section class="pb-16 lg:pb-20 bg-section-dark">
      <div class="px-4 sm:px-6 lg:px-8">
        <FeatureScreenshot
          alt="An AI assistant answering &quot;Why did checkout fail?&quot; by reading a Sentry error from Buggregator over MCP"
          caption="The assistant lists recent errors, opens one, and reads the stack trace — the same data you see in the UI. Example data."
        >
          <McpChatVisual />
        </FeatureScreenshot>
      </div>
    </section>

    <!-- Highlights -->
    <FeatureHighlights
      title="What your assistant and your scripts can do"
      subtitle="8 MCP tools, 14 with the Xdebug proxy — all but event_delete and xdebug_eval only read. The REST API covers the rest."
      :items="highlights"
      :accent-color="accentColor"
    />

    <!-- Setup -->
    <section id="setup">
      <FeatureSetup :steps="steps" />
    </section>

    <!-- Works with -->
    <FeatureWorksWithSection
      title="Works with your AI tools and your test stack"
      description="MCP for assistants, plain HTTP for everything else."
      :items="worksWithItems"
    />

    <!-- CTA -->
    <FeatureCTA docs-url="https://docs.buggregator.dev/config/mcp.html">
      <template #related>
        <FeatureRelatedLink to="/features/xdebug" label="Xdebug Proxy" color="#f97316" />
        <FeatureRelatedLink to="/features/mock-server" label="Mock Server" color="#0ea5e9" />
        <FeatureRelatedLink to="/features/email-testing" label="Email Testing" color="#f59e0b" />
      </template>
    </FeatureCTA>
  </div>
</template>
