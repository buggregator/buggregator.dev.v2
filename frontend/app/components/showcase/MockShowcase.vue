<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const { t } = useI18n()

const ExceptionsTab = defineAsyncComponent(() => import('~/components/showcase/tabs/ExceptionsTab.vue'))
const ProfilerTab = defineAsyncComponent(() => import('~/components/showcase/tabs/ProfilerTab.vue'))
const VarDumpTab = defineAsyncComponent(() => import('~/components/showcase/tabs/VarDumpTab.vue'))
const RayTab = defineAsyncComponent(() => import('~/components/showcase/tabs/RayTab.vue'))
const EmailsTab = defineAsyncComponent(() => import('~/components/showcase/tabs/EmailsTab.vue'))
const LogsTab = defineAsyncComponent(() => import('~/components/showcase/tabs/LogsTab.vue'))
const HttpTab = defineAsyncComponent(() => import('~/components/showcase/tabs/HttpTab.vue'))
const InspectorTab = defineAsyncComponent(() => import('~/components/showcase/tabs/InspectorTab.vue'))
const SmsTab = defineAsyncComponent(() => import('~/components/showcase/tabs/SmsTab.vue'))

const tabs = [
  { id: 'exceptions', color: '#f43f5e', component: ExceptionsTab },
  { id: 'emails', color: '#f59e0b', component: EmailsTab },
  { id: 'profiler', color: '#8b5cf6', component: ProfilerTab },
  { id: 'vardump', color: '#ef4444', component: VarDumpTab },
  { id: 'ray', color: '#06b6d4', component: RayTab },
  { id: 'logs', color: '#6b7280', component: LogsTab },
  { id: 'http', color: '#22c55e', component: HttpTab },
  { id: 'inspector', color: '#eab308', component: InspectorTab },
  { id: 'sms', color: '#a855f7', component: SmsTab },
] as const

type TabId = (typeof tabs)[number]['id']

const activeTab = ref<TabId>('exceptions')

const activeComponent = computed(() =>
  tabs.find((tab) => tab.id === activeTab.value)?.component,
)

const activeDescription = computed(() =>
  t(`showcase.descriptions.${activeTab.value}`),
)
</script>

<template>
  <section id="showcase" class="py-20 lg:py-28 bg-section-dark">
    <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div class="text-center mb-12">
        <h2 class="text-section font-bold text-white mb-3">
          {{ t('showcase.title') }}
        </h2>
        <p class="text-lg text-on-dark-secondary">
          {{ t('showcase.subtitle') }}
        </p>
      </div>

      <!-- Showcase container -->
      <div class="mx-auto bg-landing-base border border-landing-border-subtle rounded-2xl overflow-hidden shadow-showcase">
        <!-- Tab bar -->
        <div
          class="flex overflow-x-auto bg-landing-surface px-3 py-2.5 border-b border-landing-border-subtle gap-1"
          role="tablist"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            class="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0"
            :class="activeTab === tab.id
              ? 'bg-landing-elevated text-white shadow-sm'
              : 'text-on-dark-muted hover:text-on-dark-secondary hover:bg-white/5'"
            @click="activeTab = tab.id"
          >
            <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: tab.color }" />
            {{ t(`showcase.tabs.${tab.id}`) }}
          </button>
        </div>

        <!-- Tab description -->
        <div class="px-5 py-3 bg-landing-surface border-b border-landing-border-subtle">
          <p class="text-sm text-on-dark-muted">{{ activeDescription }}</p>
        </div>

        <!-- Tab panel -->
        <div
          :id="`panel-${activeTab}`"
          role="tabpanel"
          :aria-labelledby="activeTab"
          class="bg-landing-deepest p-5 min-h-[400px] lg:min-h-[580px]"
        >
          <Transition name="tab-fade" mode="out-in">
            <component :is="activeComponent" :key="activeTab" />
          </Transition>
        </div>
      </div>

      <!-- Sentry SDK compatibility note -->
      <p class="text-center mt-6 font-mono text-sm text-on-dark-muted">
        Sentry SDK compatible — PHP, JavaScript, Python, Ruby
      </p>
    </div>
  </section>
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
