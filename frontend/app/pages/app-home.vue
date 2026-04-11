<script setup lang="ts">
definePageMeta({ layout: false })

import { Icon } from '@iconify/vue'
import { useSiteConfig } from '~/composables/useAppConfig'

const { appName } = useSiteConfig()

const features = [
  { icon: 'tabler:plug-connected', title: 'MCP Server', desc: 'Model Context Protocol scaffold ready for tools.' },
  { icon: 'tabler:database', title: 'Temporal Workflows', desc: 'Built-in Temporal client and worker for background tasks.' },
  { icon: 'tabler:webhook', title: 'WebSocket', desc: 'Real-time updates via WebSocket relay.' },
]

</script>

<template>
  <div class="min-h-screen bg-surface-950">
    <!-- Header -->
    <header class="border-b border-surface-800">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <span class="text-white text-sm font-bold">A</span>
          </div>
          <span class="text-sm font-semibold text-surface-100">{{ appName }}</span>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/dashboard"
            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Dashboard
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 dot-grid" />
      <div class="absolute inset-0 dot-glow dot-glow-1" />
      <div class="absolute inset-0 dot-glow dot-glow-2" />

      <div class="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div class="max-w-2xl hero-stagger" style="--i:0">
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-surface-100 leading-tight mb-6">
            Your application<br/>
            <span class="text-blue-400">starts here</span>
          </h1>
          <p class="text-surface-400 text-lg leading-relaxed mb-8 max-w-xl">
            A production-ready boilerplate with MCP server scaffold, Temporal workflows, and WebSocket support.
          </p>
          <div class="flex items-center gap-4 hero-stagger" style="--i:1">
            <NuxtLink
              to="/dashboard"
              class="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all"
            >
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-6 py-20">
      <div class="text-center mb-12 hero-stagger" style="--i:2">
        <h2 class="font-display text-2xl font-bold text-surface-100 mb-3">Everything you need</h2>
        <p class="text-surface-400 text-sm max-w-lg mx-auto">
          Built on the Wippy framework with battle-tested modules for common application needs.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(feat, idx) in features"
          :key="feat.title"
          class="rounded-xl border border-surface-800 bg-surface-900/50 p-5 hover:border-surface-700 transition-colors feature-card"
          :style="{ '--i': idx + 3 }"
        >
          <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 mb-4">
            <Icon :icon="feat.icon" class="w-5 h-5 text-blue-400" />
          </div>
          <h3 class="text-sm font-semibold text-surface-100 mb-1.5">{{ feat.title }}</h3>
          <p class="text-xs text-surface-400 leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-surface-800 py-8">
      <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-[11px] text-surface-600 font-mono">
          © {{ new Date().getFullYear() }} {{ appName }}
        </p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/legal/terms" class="text-[11px] text-surface-600 hover:text-surface-400 transition-colors">Terms</NuxtLink>
          <NuxtLink to="/legal/privacy" class="text-[11px] text-surface-600 hover:text-surface-400 transition-colors">Privacy</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero-stagger {
  opacity: 0;
  transform: translateY(12px);
  animation: hero-fade-in 0.5s ease-out forwards;
  animation-delay: calc(var(--i, 0) * 0.1s + 0.15s);
}

.feature-card {
  opacity: 0;
  transform: translateY(12px);
  animation: hero-fade-in 0.4s ease-out forwards;
  animation-delay: calc(var(--i, 0) * 0.06s + 0.2s);
}

@keyframes hero-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dot-grid {
  background-image: radial-gradient(circle, rgba(148, 163, 184, 0.18) 1px, transparent 1px);
  background-size: 28px 28px;
}

.dot-glow {
  background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 28px 28px;
  mask-size: 55vw 55vw;
  mask-repeat: no-repeat;
  mask-image: radial-gradient(circle, black 0%, transparent 60%);
  will-change: mask-position, opacity;
  pointer-events: none;
}

.dot-glow-1 {
  color: rgba(59, 130, 246, 0.14);
  animation: glow-drift-1 22s ease-in-out infinite;
}
.dot-glow-2 {
  color: rgba(139, 92, 246, 0.11);
  animation: glow-drift-2 28s ease-in-out infinite;
}

@keyframes glow-drift-1 {
  0%   { mask-position: 10% 15%;  opacity: 0.6; }
  25%  { mask-position: 45% 35%;  opacity: 1;   }
  50%  { mask-position: 65% 60%;  opacity: 0.7; }
  75%  { mask-position: 25% 75%;  opacity: 0.9; }
  100% { mask-position: 10% 15%;  opacity: 0.6; }
}
@keyframes glow-drift-2 {
  0%   { mask-position: 75% 5%;   opacity: 0.5; }
  25%  { mask-position: 50% 30%;  opacity: 0.8; }
  50%  { mask-position: 20% 55%;  opacity: 1;   }
  75%  { mask-position: 60% 80%;  opacity: 0.6; }
  100% { mask-position: 75% 5%;   opacity: 0.5; }
}
</style>
