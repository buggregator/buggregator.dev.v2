<script setup lang="ts">
import CopyCommand from '~/components/ui/CopyCommand.vue'

const activeFramework = ref<'laravel' | 'symfony' | 'spiral' | 'any'>('laravel')

const frameworks = [
  { id: 'laravel' as const, label: 'Laravel' },
  { id: 'symfony' as const, label: 'Symfony' },
  { id: 'spiral' as const, label: 'Spiral' },
  { id: 'any' as const, label: 'Any PHP' },
]

const snippets: Record<string, string> = {
  laravel: `SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
VAR_DUMPER_SERVER=127.0.0.1:9912
MAIL_HOST=127.0.0.1
MAIL_PORT=1025`,
  symfony: `SENTRY_DSN=http://sentry@127.0.0.1:8000/1
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,
  spiral: `SENTRY_DSN=http://sentry@127.0.0.1:8000/1
PROFILER_ENDPOINT=http://profiler@127.0.0.1:8000
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,
  any: `# Any PHP project with Sentry SDK:
SENTRY_DSN=http://sentry@127.0.0.1:8000/1

# With Symfony VarDumper:
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912`,
}

const activeSnippet = computed(() => snippets[activeFramework.value])
</script>

<template>
  <div>
    <!-- Framework tabs -->
    <div class="flex gap-1 mb-0 bg-code-bg rounded-t-lg px-2 pt-2 border border-b-0 border-code-border">
      <button
        v-for="fw in frameworks"
        :key="fw.id"
        class="px-4 py-2 font-mono text-sm transition-colors duration-150 border-b-2"
        :class="activeFramework === fw.id
          ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
          : 'text-[#6e7681] border-transparent hover:text-code-text'"
        @click="activeFramework = fw.id"
      >
        {{ fw.label }}
      </button>
    </div>

    <!-- Code block -->
    <div class="bg-code-bg border border-t-0 border-code-border rounded-b-lg p-4 font-mono text-sm overflow-x-auto">
      <pre class="text-code-text whitespace-pre"><template
        v-for="(line, i) in activeSnippet.split('\n')"
        :key="i"
      ><template v-if="line.startsWith('#')"><span class="text-code-comment">{{ line }}</span>
</template><template v-else-if="line.includes('=')"><span class="text-code-keyword">{{ line.split('=')[0] }}</span><span class="text-code-text">=</span><span class="text-code-string">{{ line.split('=').slice(1).join('=') }}</span>
</template><template v-else>{{ line }}
</template></template></pre>
    </div>
  </div>
</template>
