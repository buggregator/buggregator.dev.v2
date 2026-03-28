<script lang="ts" setup>
import isString from 'lodash.isstring'
import { computed, onMounted } from 'vue'
import { callSfDump } from '~/shared/lib/vendor/sf-dumper'
import CodeSnippet from '~/shared/ui/code-snippet/code-snippet.vue'

type Props = {
  value: string | number | boolean
  type?: string
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  language: 'plaintext'
})

const isValueString = computed(() => isString(props.value) && props.type === 'string')
const isValueCode = computed(() => isString(props.value) && props.type === 'code')

const dumpId = String(props.value).match(/(sf-dump-[0-9]+)/i)?.[0] || null
const dumpBody = computed(() => {
  if (props.type === 'boolean') {
    return props.value === '1' ? 'true' : 'false'
  }

  if (isValueString.value) {
    return `"${props.value}"`
  }

  return props.value
})

const baseSanitizedHtml = computed(() => {
  return String(props.value)
    .replace(/<script.*<\/script>/g, '')
    .replace(/<style.*<\/style>/g, '')
})

onMounted(() => {
  if (dumpId) {
    callSfDump(dumpId)
  }
})
</script>

<template>
  <div class="value-dump">
    <CodeSnippet
      v-if="isValueString || isValueCode"
      :language="language"
      :code="String(dumpBody)"
    />
    <div
      v-if="!isValueString && !isValueCode"
      class="value-dump__html"
      v-html="baseSanitizedHtml"
    />
  </div>
</template>

<style lang="scss" scoped>
.value-dump {
  display: block;
}

.value-dump__html {
  @apply font-mono break-all text-xs;
  @apply bg-gray-50 dark:bg-gray-900;
  @apply rounded overflow-auto;
  @apply p-3;
}
</style>
