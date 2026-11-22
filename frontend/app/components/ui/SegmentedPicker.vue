<script setup lang="ts" generic="T extends string">
// A row of joined toggle buttons on a code background: one is on.
// Used by the binary OS picker and the hero install box.
const props = defineProps<{
  options: ReadonlyArray<{ id: T; label: string }>
  modelValue: T
  // Accessible name of the group.
  label: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: T] }>()

// Under sm the buttons are 44 px tall (touch); above, 32 px with a 44 px hit area.
// Under 400 px less side padding, so "Windows" fits a quarter of a 360 px row.
const chip = 'relative hit-area flex-1 min-h-11 sm:min-h-[32px] px-1.5 min-[400px]:px-2.5 font-mono text-[11px] whitespace-nowrap transition-colors duration-150'
const on = 'text-white bg-[rgba(59,130,246,0.18)]'
const off = 'text-[#8b949e] hover:text-code-text'
</script>

<template>
  <div
    class="inline-grid rounded-md border border-code-border overflow-hidden divide-x divide-code-border"
    :style="{ gridTemplateColumns: `repeat(${props.options.length}, minmax(0, 1fr))` }"
    role="group"
    :aria-label="label"
  >
    <button
      v-for="o in options"
      :key="o.id"
      type="button"
      :class="[chip, modelValue === o.id ? on : off]"
      :aria-pressed="modelValue === o.id"
      @click="emit('update:modelValue', o.id)"
    >
      {{ o.label }}
    </button>
  </div>
</template>
