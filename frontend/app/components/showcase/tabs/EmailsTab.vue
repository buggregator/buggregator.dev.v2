<script setup lang="ts">
import EventCard from '~/components/showcase/shared/EventCard.vue'

const showPreview = ref(false)
</script>

<template>
  <EventCard type="smtp" label="Email" time="12s ago" no-border>
    <div class="space-y-3">
      <!-- Email metadata -->
      <div class="space-y-1.5">
        <div class="flex items-start gap-2">
          <span class="font-mono text-xs text-on-dark-muted shrink-0 w-14">From:</span>
          <span class="font-mono text-xs text-on-dark-secondary">Buggregator &lt;no-reply@buggregator.dev&gt;</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono text-xs text-on-dark-muted shrink-0 w-14">To:</span>
          <span class="font-mono text-xs text-on-dark-secondary">user@example.com</span>
        </div>
        <div class="flex items-start gap-2">
          <span class="font-mono text-xs text-on-dark-muted shrink-0 w-14">Subject:</span>
          <span class="font-mono text-xs text-white font-medium">Welcome to Buggregator!</span>
        </div>
      </div>

      <!-- HTML Email Preview -->
      <div class="border border-landing-border-subtle overflow-hidden">
        <!-- Preview toolbar -->
        <div class="flex items-center justify-between px-3 py-1.5 bg-[#0a0c10] border-b border-landing-border-subtle">
          <span class="font-mono text-[10px] text-on-dark-muted uppercase tracking-wider">HTML Preview</span>
          <button
            class="font-mono text-[10px] text-accent hover:text-[#60a5fa] transition-colors"
            @click="showPreview = !showPreview"
          >
            {{ showPreview ? 'Hide source' : 'View source' }}
          </button>
        </div>

        <!-- Rendered preview (fake HTML email) -->
        <div v-if="!showPreview" class="bg-[#0f1117] p-6">
          <div class="max-w-md mx-auto">
            <!-- Email header -->
            <div class="text-center mb-6 pb-4 border-b border-[#1e2130]">
              <div class="text-2xl font-bold text-white mb-1">Buggregator</div>
              <div class="text-xs text-on-dark-muted">Debugging Server</div>
            </div>

            <!-- Email body -->
            <div class="text-sm text-on-dark-secondary leading-relaxed space-y-3">
              <p>Hi there!</p>
              <p>Welcome to <strong class="text-white">Buggregator</strong>. You're all set to start debugging your PHP applications.</p>
              <p>Open your browser at <code class="px-1 py-0.5 bg-[#1a1d2e] text-accent text-xs font-mono rounded">http://127.0.0.1:8000</code> to see your events.</p>

              <!-- CTA Button -->
              <div class="text-center py-4">
                <span class="inline-block px-6 py-2.5 bg-accent text-white text-sm font-medium rounded cursor-default">
                  Open Dashboard
                </span>
              </div>

              <p class="text-xs text-on-dark-muted mt-4 pt-4 border-t border-[#1e2130]">
                You're receiving this because you started a Buggregator instance. If this wasn't you, feel free to ignore this email.
              </p>
            </div>
          </div>
        </div>

        <!-- Source view -->
        <div v-else class="bg-code-bg p-3 font-mono text-xs text-code-text overflow-x-auto max-h-[240px]">
          <div class="text-code-keyword">&lt;html&gt;</div>
          <div class="pl-4 text-code-keyword">&lt;body <span class="text-code-string">style="font-family: Arial, sans-serif"</span>&gt;</div>
          <div class="pl-8 text-code-keyword">&lt;div <span class="text-code-string">style="max-width: 480px; margin: 0 auto"</span>&gt;</div>
          <div class="pl-12 text-code-keyword">&lt;h1&gt;<span class="text-code-text">Buggregator</span>&lt;/h1&gt;</div>
          <div class="pl-12 text-code-keyword">&lt;p&gt;<span class="text-code-text">Welcome to Buggregator.</span>&lt;/p&gt;</div>
          <div class="pl-12 text-code-keyword">&lt;p&gt;<span class="text-code-text">Open your browser at</span></div>
          <div class="pl-16 text-code-keyword">&lt;code&gt;<span class="text-code-string">http://127.0.0.1:8000</span>&lt;/code&gt;</div>
          <div class="pl-12 text-code-keyword">&lt;/p&gt;</div>
          <div class="pl-12 text-code-keyword">&lt;a <span class="text-code-string">href="http://127.0.0.1:8000"</span>&gt;</div>
          <div class="pl-16 text-code-text">Open Dashboard</div>
          <div class="pl-12 text-code-keyword">&lt;/a&gt;</div>
          <div class="pl-8 text-code-keyword">&lt;/div&gt;</div>
          <div class="pl-4 text-code-keyword">&lt;/body&gt;</div>
          <div class="text-code-keyword">&lt;/html&gt;</div>
        </div>
      </div>
    </div>
  </EventCard>
</template>
