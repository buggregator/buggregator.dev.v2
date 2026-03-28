<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const open = ref(false)

const allLocales = computed(() =>
  locales.value as Array<{ code: string; name: string }>,
)

function select(code: string) {
  setLocale(code)
  open.value = false
}

function onClickOutside() {
  open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="relative" @click.stop>
    <button
      class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-mono text-on-dark-secondary hover:text-on-dark-primary transition-colors duration-150"
      :aria-label="`Language: ${locale.toUpperCase()}`"
      @click="open = !open"
    >
      <svg class="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9z" />
      </svg>
      {{ locale.toUpperCase() }}
      <svg class="w-3 h-3 opacity-40 transition-transform" :class="{ 'rotate-180': open }" viewBox="0 0 12 12" fill="currentColor">
        <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-1.5 min-w-[140px] rounded-lg border border-landing-border-subtle bg-landing-elevated shadow-lg overflow-hidden z-50"
      >
        <button
          v-for="loc in allLocales"
          :key="loc.code"
          class="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left text-sm font-sans transition-colors duration-100"
          :class="loc.code === locale
            ? 'text-white bg-white/5'
            : 'text-on-dark-muted hover:text-on-dark-primary hover:bg-white/5'"
          @click="select(loc.code)"
        >
          <span class="font-mono text-xs w-5 text-center opacity-50">{{ loc.code.toUpperCase() }}</span>
          <span>{{ loc.name }}</span>
          <svg v-if="loc.code === locale" class="w-3.5 h-3.5 ml-auto text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
