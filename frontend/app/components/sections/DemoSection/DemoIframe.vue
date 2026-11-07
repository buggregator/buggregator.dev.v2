<script setup lang="ts">
const { buggregatorUrl } = useRuntimeConfig().public
// The demo is a whole app: never load it on phones and tablets.
const isDesktop = useIsDesktop()
</script>

<template>
  <div class="demo-iframe-wrapper">
    <iframe
      v-if="isDesktop"
      :src="buggregatorUrl as string"
      frameborder="0"
      class="w-full h-full"
      title="Buggregator live demo"
      loading="lazy"
      allow="clipboard-write"
    />
  </div>
</template>

<style scoped>
.demo-iframe-wrapper {
  position: sticky;
  top: 64px;
  height: 70vh;
  border-radius: 12px 0 0 12px;
  overflow: hidden;
  background: #1a1d24;
  border: 1px solid #1e2128;
  border-right: none;
}
</style>
