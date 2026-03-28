<script setup lang="ts">
import type { Sponsor, SponsorTier } from '~/data/sponsors'

defineProps<{
  sponsor: Sponsor
  tier: SponsorTier
}>()
</script>

<template>
  <!-- Gold -->
  <a
    v-if="tier === 'gold'"
    :href="sponsor.url"
    target="_blank"
    rel="noopener"
    class="flex items-center gap-4 p-5 rounded-xl no-underline transition-all duration-200 hover:-translate-y-0.5"
    style="background: rgba(255,255,255,0.04); border: 1px solid #2a2f38;"
  >
    <img :src="sponsor.avatar" :alt="sponsor.name" class="w-12 h-12 rounded-xl object-cover shrink-0" />
    <div>
      <p class="text-sm font-semibold text-white font-sans">{{ sponsor.name }}</p>
      <p v-if="sponsor.description" class="text-xs text-on-dark-muted font-sans mt-0.5">{{ sponsor.description }}</p>
      <p v-if="sponsor.since" class="text-[10px] text-on-dark-muted font-mono mt-1">Sponsor since {{ sponsor.since }}</p>
    </div>
  </a>

  <!-- Silver -->
  <a
    v-else-if="tier === 'silver'"
    :href="sponsor.url"
    target="_blank"
    rel="noopener"
    class="flex flex-col items-center gap-2 p-3 rounded-lg no-underline transition-all duration-200 hover:-translate-y-0.5"
    style="background: rgba(255,255,255,0.03);"
  >
    <img :src="sponsor.avatar" :alt="sponsor.name" class="w-10 h-10 rounded-lg object-cover" />
    <p class="text-xs text-on-dark-secondary font-sans">{{ sponsor.name }}</p>
  </a>

  <!-- Community -->
  <a
    v-else
    :href="sponsor.url"
    target="_blank"
    rel="noopener"
    class="group relative"
    :title="sponsor.name"
  >
    <img :src="sponsor.avatar" :alt="sponsor.name" class="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-accent/50 transition-all" />
  </a>
</template>
