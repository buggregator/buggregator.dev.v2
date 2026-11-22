<script setup lang="ts">
// A titled list of footer links. `collapsible`: on phones the title is a
// button and the list starts closed (an accordion, like the phone menu); on
// wider screens the list is always open. Both layouts are in the server HTML
// and CSS picks one, so server and client render the same.
const props = defineProps<{
  id: string
  title: string
  count?: number
  collapsible?: boolean
}>()

const open = ref(false)
const listId = computed(() => `ft-${props.id}`)
</script>

<template>
  <div class="ft-group" :class="{ 'ft-group--collapsible': collapsible, 'ft-group--open': open }">
    <h2 class="ft-group__title">
      <span class="ft-group__label">{{ title }}</span>
      <button
        v-if="collapsible"
        type="button"
        class="ft-group__toggle"
        :aria-expanded="open"
        :aria-controls="listId"
        @click="open = !open"
      >
        {{ title }}
        <span v-if="count" class="ft-group__count">{{ count }}</span>
        <svg class="ft-group__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h2>
    <ul :id="listId" class="ft-group__list">
      <slot />
    </ul>
  </div>
</template>

<style scoped>
.ft-group__title {
  margin: 0 0 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: theme('colors.on-dark.secondary');
}

.ft-group__toggle {
  display: none;
}

.ft-group__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 639px) {
  .ft-group--collapsible {
    border-top: 1px solid theme('colors.landing-border-subtle');
  }

  .ft-group--collapsible .ft-group__title {
    margin: 0;
    font-size: 15px;
    line-height: 1.4;
    letter-spacing: normal;
    text-transform: none;
  }

  .ft-group--collapsible .ft-group__label {
    display: none;
  }

  .ft-group--collapsible .ft-group__toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 48px;
    font: inherit;
    font-weight: 600;
    color: theme('colors.on-dark.primary');
    text-align: left;
  }

  .ft-group__toggle:focus-visible {
    outline: 2px solid theme('colors.accent.DEFAULT');
    outline-offset: -2px;
  }

  .ft-group__count {
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    font-weight: 400;
    color: theme('colors.on-dark.muted');
  }

  .ft-group__chevron {
    margin-left: auto;
    color: theme('colors.on-dark.muted');
    transition: transform 150ms ease;
  }

  .ft-group__toggle[aria-expanded="true"] .ft-group__chevron {
    transform: rotate(180deg);
  }

  .ft-group--collapsible:not(.ft-group--open) .ft-group__list {
    display: none;
  }

  .ft-group--collapsible .ft-group__list {
    padding-bottom: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ft-group__chevron {
    transition: none;
  }
}
</style>
