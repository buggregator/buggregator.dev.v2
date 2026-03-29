<script setup lang="ts">
const { heroVideoUrl, heroPosterUrl } = useRuntimeConfig().public

const videoSupported = ref(true)
const prefersReducedMotion = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)

// Autonomous drift state
let driftFrame = 0
let mouseActive = false
let mouseTimer: ReturnType<typeof setTimeout> | null = null

function onMouseMove(e: MouseEvent) {
  if (prefersReducedMotion.value) return
  const x = (e.clientX / window.innerWidth - 0.5) * 2
  const y = (e.clientY / window.innerHeight - 0.5) * 2
  offsetX.value = x * -15
  offsetY.value = y * -10
  mouseActive = true

  // Resume drift after mouse stops for 2s
  if (mouseTimer) clearTimeout(mouseTimer)
  mouseTimer = setTimeout(() => { mouseActive = false }, 2000)
}

function startDrift() {
  function tick(time: number) {
    if (!mouseActive) {
      // Slow organic drift — different speeds/phases per axis
      const dx = Math.sin(time * 0.0003) * 18 + Math.sin(time * 0.00017) * 15
      const dy = Math.cos(time * 0.00025) * 16 + Math.cos(time * 0.00013) * 14
      offsetX.value = dx
      offsetY.value = dy
    }
    driftFrame = requestAnimationFrame(tick)
  }
  driftFrame = requestAnimaFix tionFrame(tick)
}

const parallaxStyle = computed(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(1.1)`,
}))

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion.value) {
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    startDrift()
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (driftFrame) cancelAnimationFrame(driftFrame)
  if (mouseTimer) clearTimeout(mouseTimer)
})
</script>

<template>
  <div class="video-bg" aria-hidden="true">
    <div class="video-bg__inner" :style="parallaxStyle">
      <video
        v-if="!prefersReducedMotion && videoSupported"
        autoplay
        loop
        muted
        playsinline
        :poster="heroPosterUrl as string"
        class="video-bg__video"
        @error="videoSupported = false"
      >
        <source :src="heroVideoUrl as string" type="video/webm" />
      </video>

      <img
        v-if="prefersReducedMotion || !videoSupported"
        :src="heroPosterUrl as string"
        alt=""
        class="video-bg__video"
      />
    </div>

    <div class="video-bg__overlay" />
  </div>
</template>

<style scoped>
.video-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.video-bg__inner {
  position: absolute;
  inset: -20px;
  transition: transform 800ms cubic-bezier(0.03, 0.5, 0.3, 1);
  will-change: transform;
}

.video-bg__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  filter: blur(2px);
}

.video-bg__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.5) 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .video-bg__inner {
    transition: none;
    transform: none !important;
  }
}
</style>
