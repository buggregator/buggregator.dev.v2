<script setup lang="ts">
import { useGitHubStore } from '~/stores/github'

const props = defineProps<{
  steps: Array<{
    title: string
    description: string
    code?: string
    language?: string
    tabs?: Array<{ id: string; label: string; code: string }>
  }>
}>()

const github = useGitHubStore()

const imageTag = computed(() => {
  const v = github.serverVersion
  return v ? `v${v}` : 'latest'
})

// Track active tab per step
const activeTabs = ref<Record<number, string>>({})

type StepTab = { id: string; label: string; code: string }

function getActiveTab(stepIndex: number, tabs: StepTab[]): string {
  const saved = activeTabs.value[stepIndex]
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return saved !== undefined ? saved : tabs[0]!.id
}

function setActiveTab(stepIndex: number, tabId: string) {
  activeTabs.value = { ...activeTabs.value, [stepIndex]: tabId }
}

function getActiveCode(stepIndex: number, step: typeof props.steps[number]): string {
  if (step.code) return step.code
  const tabs = step.tabs
  if (!tabs || tabs.length === 0) return ''
  const activeId = getActiveTab(stepIndex, tabs)
  const found = tabs.find(t => t.id === activeId)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return found ? found.code : tabs[0]!.code
}

// Copy
const copiedStep = ref<number | null>(null)

async function copyCode(stepIndex: number, code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copiedStep.value = stepIndex
    setTimeout(() => { copiedStep.value = null }, 2000)
  } catch { /* ignore */ }
}
</script>

<template>
  <section class="py-20 lg:py-28 bg-section-dark">
    <div class="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14">
        <h2 class="text-section font-bold text-white mb-3 font-sans">Setup in 60 seconds</h2>
        <p class="text-lg text-on-dark-secondary font-sans">No registration. No config files. Just run and connect.</p>
      </div>

      <div class="space-y-0">
        <div v-for="(step, i) in steps" :key="i" class="relative flex gap-6 lg:gap-10">
          <!-- Left: number + connector -->
          <div class="flex flex-col items-center shrink-0">
            <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg font-sans shrink-0">
              {{ i + 1 }}
            </div>
            <div v-if="i < steps.length - 1" class="w-0.5 flex-1 bg-landing-border-subtle mt-3" />
          </div>

          <!-- Right: content -->
          <div class="flex-1 pb-14 lg:pb-18">
            <h3 class="font-sans text-xl font-semibold text-white mb-2">{{ step.title }}</h3>
            <p class="font-sans text-base text-on-dark-secondary leading-relaxed mb-4">{{ step.description }}</p>

            <!-- Code block -->
            <div v-if="step.code || step.tabs" class="rounded-xl border border-code-border overflow-hidden">
              <!-- Tabs (if multiple) -->
              <div v-if="step.tabs" class="flex gap-1 bg-code-bg px-2 pt-2 border-b border-code-border overflow-x-auto">
                <button
                  v-for="tab in step.tabs"
                  :key="tab.id"
                  class="px-3 py-1.5 font-mono text-xs transition-colors duration-150 border-b-2 rounded-t-md whitespace-nowrap"
                  :class="getActiveTab(i, step.tabs!) === tab.id
                    ? 'text-code-text bg-[rgba(255,255,255,0.04)] border-accent'
                    : 'text-[#6e7681] border-transparent hover:text-code-text'"
                  @click="setActiveTab(i, tab.id)"
                >
                  {{ tab.label }}
                </button>
              </div>

              <div class="bg-code-bg p-4 font-mono text-xs leading-relaxed relative overflow-x-auto">
                <pre class="text-code-text whitespace-pre"><template
                  v-for="(line, li) in getActiveCode(i, step).replace(/{imageTag}/g, imageTag).split('\n')"
                  :key="li"
                ><template v-if="line.startsWith('#')"><span class="text-code-comment">{{ line }}</span>
</template><template v-else-if="line.startsWith('$ ')"><span class="text-code-prompt select-none">$ </span><span class="text-code-text">{{ line.slice(2) }}</span>
</template><template v-else-if="line.includes('=')"><span class="text-code-keyword">{{ line.split('=')[0] }}</span><span class="text-code-text">=</span><span class="text-code-string">{{ line.split('=').slice(1).join('=') }}</span>
</template><template v-else>{{ line }}
</template></template></pre>

                <!-- Copy button -->
                <ClientOnly>
                  <button
                    class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150"
                    :class="copiedStep === i
                      ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]'
                      : 'bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-on-dark-muted hover:bg-[rgba(255,255,255,0.12)] hover:text-white'"
                    :aria-label="copiedStep === i ? 'Copied' : 'Copy'"
                    @click="copyCode(i, getActiveCode(i, step).replace(/{imageTag}/g, imageTag))"
                  >
                    <svg v-if="copiedStep !== i" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
