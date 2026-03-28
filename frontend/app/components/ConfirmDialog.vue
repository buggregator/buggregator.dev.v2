<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

defineProps<{
  visible: boolean
  title: string
  entityName: string
  message: string
}>()

defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="title"
    :style="{ width: '420px' }"
    modal
  >
    <div class="flex items-start gap-3">
      <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 shrink-0">
        <Icon icon="tabler:alert-triangle" class="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <div>
        <p class="text-sm text-surface-900 dark:text-surface-0 font-medium mb-1">
          Delete "{{ entityName }}"?
        </p>
        <p class="text-xs text-surface-400">{{ message }}</p>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" text @click="$emit('update:visible', false)" />
        <Button label="Delete" severity="danger" @click="$emit('confirm')" />
      </div>
    </template>
  </Dialog>
</template>
