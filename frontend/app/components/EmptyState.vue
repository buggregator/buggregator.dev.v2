<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Button from 'primevue/button'

defineProps<{
  icon: string
  message: string
  actionLabel?: string
}>()

defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="text-center">
      <Icon :icon="icon" class="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
      <p class="text-sm text-surface-400 mb-3">{{ message }}</p>
      <Button v-if="actionLabel" :label="actionLabel" size="small" @click="$emit('action')" />
    </div>
  </div>
</template>
