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
  <div class="rounded-xl border border-code-border overflow-hidden">
    <!-- Framework tabs -->
    <div class="flex gap-1 bg-code-bg px-2 pt-2 border-b border-code-border overflow-x-auto">
      <button
        v-for="fw in frameworks"
        :key="fw.id"
        class="px-3 py-1.5 font-mono text-xs transition-colors duration-150 border-b-2 rounded-t-md whitespace-nowrap"
        :class="activeFramework === fw.id
          ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
          : 'text-[#6e7681] border-transparent hover:text-code-text'"
        @click="activeFramework = fw.id"
      >
        {{ fw.label }}
      </button>
    </div>

    <!-- Code block -->
    <div class="bg-code-bg p-4 font-mono text-xs overflow-x-auto">
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
