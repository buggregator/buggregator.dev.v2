<script setup lang="ts">
const { t } = useI18n()

type TabId = 'sentry' | 'email' | 'varDumper' | 'logs'
const activeTab = ref<TabId>('sentry')

const tabs: { id: TabId; labelKey: string }[] = [
  { id: 'sentry', labelKey: 'cleanApp.envComparison.tabs.sentry' },
  { id: 'email', labelKey: 'cleanApp.envComparison.tabs.email' },
  { id: 'varDumper', labelKey: 'cleanApp.envComparison.tabs.varDumper' },
  { id: 'logs', labelKey: 'cleanApp.envComparison.tabs.logs' },
]

const snippets: Record<TabId, { before: string; after: string; annotation?: string }> = {
  sentry: {
    before: 'SENTRY_LARAVEL_DSN=https://abc123@o123456.ingest.sentry.io/789',
    after: 'SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1',
    annotation: 'Only the host changed. Your Sentry SDK keeps working exactly the same.',
  },
  email: {
    before: `MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username   # needs account
MAIL_PASSWORD=your-password   # needs account`,
    after: `MAIL_HOST=127.0.0.1
MAIL_PORT=1025
# No username or password needed`,
  },
  varDumper: {
    before: '# dump() output goes to your browser — pollutes the UI',
    after: `VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,
  },
  logs: {
    before: `LOG_CHANNEL=stack
# logs go to storage/logs/laravel.log — grep required`,
    after: `LOG_CHANNEL=socket
LOG_SOCKET_URL=127.0.0.1:9913
# logs appear in Buggregator in real time`,
  },
}

const active = computed(() => snippets[activeTab.value])
</script>

<template>
  <div>
    <h3 class="text-xl font-bold text-on-light-primary mb-6 text-center font-sans">
      {{ t('cleanApp.envComparison.title') }}
    </h3>

    <!-- Tabs -->
    <div class="flex gap-1 bg-code-bg rounded-t-xl px-2 pt-2 border-b border-code-border">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 font-mono text-sm transition-colors duration-150 border-b-2 rounded-t-md"
        :class="activeTab === tab.id
          ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
          : 'text-[#6e7681] border-transparent hover:text-code-text'"
        @click="activeTab = tab.id"
      >
        {{ t(tab.labelKey) }}
      </button>
    </div>

    <!-- Content -->
    <div class="bg-code-bg rounded-b-xl p-5">
      <Transition name="tab-fade" mode="out-in">
        <div :key="activeTab" class="space-y-4">
          <!-- BEFORE -->
          <div>
            <span class="text-xs font-mono font-semibold text-[#fb7185] uppercase tracking-wider">
              {{ t('cleanApp.envComparison.beforeLabel') }}
            </span>
            <pre class="mt-1 font-mono text-sm text-code-text whitespace-pre-wrap"><template
              v-for="(line, i) in active.before.split('\n')"
              :key="i"
            ><template v-if="line.includes('#')"><span class="text-code-comment">{{ line }}</span>
</template><template v-else-if="line.includes('=')"><span class="text-code-keyword">{{ line.split('=')[0] }}</span><span class="text-code-text">=</span><span class="text-code-string">{{ line.split('=').slice(1).join('=').split('#')[0].trim() }}</span><template v-if="line.includes('#')"> <span class="text-code-comment"># {{ line.split('#').slice(1).join('#') }}</span></template>
</template><template v-else>{{ line }}
</template></template></pre>
          </div>

          <!-- AFTER -->
          <div>
            <span class="text-xs font-mono font-semibold text-[#4ade80] uppercase tracking-wider">
              {{ t('cleanApp.envComparison.afterLabel') }}
            </span>
            <div class="mt-1 rounded bg-[rgba(34,197,94,0.06)] px-3 py-2">
              <pre class="font-mono text-sm text-code-text whitespace-pre-wrap"><template
                v-for="(line, i) in active.after.split('\n')"
                :key="i"
              ><template v-if="line.startsWith('#')"><span class="text-code-comment">{{ line }}</span>
</template><template v-else-if="line.includes('=')"><span class="text-code-keyword">{{ line.split('=')[0] }}</span><span class="text-code-text">=</span><span class="text-[#4ade80]">{{ line.split('=').slice(1).join('=') }}</span>
</template><template v-else>{{ line }}
</template></template></pre>
            </div>
          </div>

          <!-- Annotation -->
          <p v-if="active.annotation" class="text-xs font-mono text-on-dark-muted italic">
            {{ active.annotation }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 150ms ease;
}
.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
