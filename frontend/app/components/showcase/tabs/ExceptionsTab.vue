<script setup lang="ts">
import SentryExceptionComponent from '~/components/showcase/sentry/sentry-exception.vue'
import mockData from '~/data/mocks/sentry-exception.json'
import type { SentryException } from '~/shared/types/sentry'

const exception = mockData as unknown as SentryException
</script>

<template>
  <div>
    <SentryExceptionComponent :exception="exception" :max-frames="3" />
  </div>
</template>
