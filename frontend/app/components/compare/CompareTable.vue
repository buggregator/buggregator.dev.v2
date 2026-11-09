<script setup lang="ts">
// A comparison table. The first column is Buggregator and is marked. On a
// narrow screen only the table scrolls sideways (the page does not); the row
// names stay in place while it scrolls.
withDefaults(defineProps<{
  caption: string
  columns: string[]
  rows: Array<{ label: string, cells: string[] }>
  note?: string
  highlightFirst?: boolean // the first column is Buggregator
}>(), { note: undefined, highlightFirst: true })

// `text` in a cell shows as code.
const parts = (cell: string) => cell.split('`').map((text, i) => ({ text, code: i % 2 === 1 }))
</script>

<template>
  <div>
    <div
      class="compare-table-wrap overflow-x-auto rounded-xl border border-landing-border-subtle bg-section-dark"
      role="region"
      :aria-label="`${caption} (scrolls sideways)`"
      tabindex="0"
    >
      <table class="w-full min-w-[720px] border-collapse text-left font-sans text-sm">
        <caption class="sr-only">{{ caption }}</caption>
        <thead>
          <tr class="bg-landing-surface">
            <td class="sticky left-0 z-10 bg-landing-surface p-3 w-[11rem]" />
            <th
              v-for="(col, i) in columns"
              :key="col"
              scope="col"
              class="p-3 font-semibold align-bottom"
              :class="highlightFirst && i === 0 ? 'text-white bg-accent/10' : 'text-on-dark-secondary'"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.label"
            class="border-t border-landing-border-subtle"
          >
            <th
              scope="row"
              class="sticky left-0 z-10 bg-section-dark p-3 font-medium text-on-dark-secondary align-top w-[11rem]"
            >
              {{ row.label }}
            </th>
            <td
              v-for="(cell, i) in row.cells"
              :key="i"
              class="p-3 align-top"
              :class="highlightFirst && i === 0 ? 'text-white bg-accent/5' : 'text-on-dark-secondary'"
            >
              <span v-if="cell === '—'" aria-label="not found in its docs">—</span>
              <template v-else>
                <template v-for="(part, pi) in parts(cell)" :key="pi">
                  <code v-if="part.code" class="font-mono text-[0.85em] px-1 rounded bg-landing-surface">{{ part.text }}</code>
                  <template v-else>{{ part.text }}</template>
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="note" class="mt-3 text-xs leading-relaxed text-on-dark-muted font-sans">
      {{ note }}
    </p>
  </div>
</template>

<style scoped>
.compare-table-wrap:focus-visible {
  outline: 2px solid theme('colors.accent.DEFAULT');
  outline-offset: 2px;
}
</style>
