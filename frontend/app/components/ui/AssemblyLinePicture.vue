<script setup lang="ts">
// The owner's «beetles on an assembly line» (#6831): a dark, busy picture, so
// it sits under a shade and with tuned contrast wherever it is used. It fills
// its positioned parent (object-fit: cover).
withDefaults(defineProps<{
  alt: string
  // Above the fold (404) loads at once; the home band waits until near.
  eager?: boolean
}>(), { eager: false })

const base = '/img/assembly-line'
const srcset = `${base}/line-960.webp 960w, ${base}/line-1280.webp 1280w, ${base}/line-1672.webp 1672w`
</script>

<template>
  <picture class="al-picture">
    <source type="image/webp" :srcset="srcset" sizes="100vw">
    <img
      class="al-picture__img"
      :src="`${base}/line-1280.jpg`"
      :alt="alt"
      width="1672"
      height="941"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'low'"
      decoding="async"
    >
  </picture>
</template>

<style scoped>
.al-picture {
  position: absolute;
  inset: 0;
}

.al-picture__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 40% 45%;
  /* The purple glows, the grey machinery steps back. */
  filter: saturate(1.25) contrast(1.1) brightness(0.62);
}
</style>
