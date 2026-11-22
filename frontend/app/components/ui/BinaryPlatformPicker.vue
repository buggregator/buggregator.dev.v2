<script setup lang="ts">
import SegmentedPicker from '~/components/ui/SegmentedPicker.vue'

// OS picker for the binary samples: Linux / macOS or Windows. The install
// script picks the CPU, so there is no second row. The choice is page-wide
// (useBinaryPlatform): picking Windows here switches every sample.
const { t } = useI18n()
const { os } = useBinaryPlatform()
</script>

<template>
  <SegmentedPicker v-model="os" :options="BINARY_OSES" :label="t('install.binary.platform')" />
</template>
