<script setup lang="ts">
import RenderGraph from '~/components/showcase/profiler/render-graph.vue'
import graphData from '~/data/mocks/profiler-callgraph.json'
import type { ProfilerCallGraph } from '~/shared/types/profiler'

const { t } = useI18n()
const data = graphData as unknown as ProfilerCallGraph
const graphRef = ref<InstanceType<typeof RenderGraph> | null>(null)

function showHottestPath() {
  graphRef.value?.highlightHottestPath()
}

function resetPath() {
  graphRef.value?.clearSelection()
}

const hasSelection = ref(false)

function onPathSelected() {
  hasSelection.value = true
}

function onPathCleared() {
  hasSelection.value = false
}
</script>

<template>
  <div class="relative min-h-[400px] lg:min-h-[580px] bg-[#0a0c10] overflow-hidden -m-5">
    <!-- Caption overlay -->
    <div
      class="absolute top-3 left-3 z-10 px-3 py-2 rounded-lg font-mono text-xs text-on-dark-muted pointer-events-none"
      style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border: 1px solid var(--border-default);"
    >
      {{ t('showcase.profilerCaption') }}
    </div>

    <!-- Controls -->
    <div class="absolute top-3 right-3 z-10 flex items-center gap-2">
      <button
        v-if="hasSelection"
        class="px-3 py-1.5 rounded-lg font-mono text-xs text-on-dark-muted hover:text-on-dark-secondary transition-colors"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border: 1px solid var(--border-default);"
        @click="resetPath"
      >
        Reset
      </button>
      <button
        class="px-3 py-1.5 rounded-lg font-mono text-xs transition-colors"
        :class="hasSelection
          ? 'text-on-dark-muted hover:text-on-dark-secondary'
          : 'text-[#f59e0b] hover:text-[#fbbf24]'"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); border: 1px solid var(--border-default);"
        @click="showHottestPath"
      >
        Hottest path
      </button>
    </div>

    <RenderGraph
      ref="graphRef"
      :server-data="data"
      :height="580"
      class="w-full"
      style="min-height: 580px;"
      @path-selected="onPathSelected"
      @path-cleared="onPathCleared"
    />
  </div>
</template>
