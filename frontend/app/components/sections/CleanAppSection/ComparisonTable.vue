<script setup lang="ts">
const { t } = useI18n()

type Status = 'yes' | 'no' | 'warn'

interface Row {
  feature: string
  bg: { status: Status; text: string }
  tel: { status: Status; text: string }
  ray: { status: Status; text: string }
}

const rows: Row[] = [
  { feature: 'Installed in your app',    bg: { status: 'no', text: 'No' },     tel: { status: 'yes', text: 'Yes' },         ray: { status: 'yes', text: 'Yes' } },
  { feature: 'Needs composer require',   bg: { status: 'no', text: 'No' },     tel: { status: 'yes', text: 'Yes' },         ray: { status: 'yes', text: 'Yes' } },
  { feature: 'Needs migrations',         bg: { status: 'no', text: 'No' },     tel: { status: 'yes', text: 'Yes' },         ray: { status: 'no', text: 'No' } },
  { feature: 'Adds routes to your app',  bg: { status: 'no', text: 'No' },     tel: { status: 'yes', text: 'Yes' },         ray: { status: 'no', text: 'No' } },
  { feature: 'Modifies your code',       bg: { status: 'no', text: 'No' },     tel: { status: 'yes', text: 'Yes' },         ray: { status: 'yes', text: 'Yes' } },
  { feature: 'Requires cloud account',   bg: { status: 'no', text: 'No' },     tel: { status: 'no', text: 'No' },           ray: { status: 'no', text: 'No' } },
  { feature: 'Requires paid license',    bg: { status: 'no', text: 'No' },     tel: { status: 'no', text: 'No' },           ray: { status: 'warn', text: 'Paid app' } },
  { feature: 'Production risk',          bg: { status: 'no', text: 'None' },   tel: { status: 'warn', text: 'Must disable' }, ray: { status: 'warn', text: 'Remove calls' } },
  { feature: 'Works across projects',    bg: { status: 'yes', text: 'All' },   tel: { status: 'no', text: 'Per-project' },  ray: { status: 'no', text: 'Per-project' } },
  { feature: 'Email preview',            bg: { status: 'yes', text: 'Yes' },   tel: { status: 'no', text: 'No' },           ray: { status: 'no', text: 'No' } },
  { feature: 'Performance profiling',    bg: { status: 'yes', text: 'Yes' },   tel: { status: 'warn', text: 'Limited' },    ray: { status: 'no', text: 'No' } },
  { feature: 'Data stays local',         bg: { status: 'yes', text: 'Always' },tel: { status: 'yes', text: 'Yes' },         ray: { status: 'yes', text: 'Yes' } },
]

const statusColor: Record<Status, string> = {
  yes: 'text-[#16a34a]',
  no: 'text-[#94a3b8]',
  warn: 'text-[#d97706]',
}
</script>

<template>
  <div>
    <h3 class="text-xl font-bold text-on-light-primary mb-6 text-center font-sans">
      {{ t('cleanApp.table.title') }}
    </h3>

    <div class="overflow-x-auto rounded-xl border border-[#e5e7eb]">
      <table class="w-full text-sm font-sans min-w-[600px]">
        <thead>
          <tr class="bg-[#f3f4f6]">
            <th class="text-left px-5 py-3.5 font-semibold text-on-light-primary sticky left-0 bg-[#f3f4f6] z-10">
              {{ t('cleanApp.table.cols.feature') }}
            </th>
            <th class="text-center px-5 py-3.5 font-semibold text-accent bg-blue-50">
              {{ t('cleanApp.table.cols.buggregator') }}
            </th>
            <th class="text-center px-5 py-3.5 font-semibold text-on-light-primary">
              {{ t('cleanApp.table.cols.telescope') }}
            </th>
            <th class="text-center px-5 py-3.5 font-semibold text-on-light-primary">
              {{ t('cleanApp.table.cols.ray') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in rows"
            :key="i"
            class="border-t border-[#f0f0f0]"
          >
            <td class="px-5 py-3 text-on-light-secondary sticky left-0 bg-white z-10">{{ row.feature }}</td>
            <td class="px-5 py-3 bg-blue-50/40">
              <span class="inline-flex items-center justify-center gap-1.5 w-full" :class="statusColor[row.bg.status]">
                <!-- Yes: filled circle with check -->
                <svg v-if="row.bg.status === 'yes'" class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
                <!-- No: dash in circle -->
                <svg v-else-if="row.bg.status === 'no'" class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
                </svg>
                <!-- Warn: triangle -->
                <svg v-else class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">{{ row.bg.text }}</span>
              </span>
            </td>
            <td class="px-5 py-3">
              <span class="inline-flex items-center justify-center gap-1.5 w-full" :class="statusColor[row.tel.status]">
                <svg v-if="row.tel.status === 'yes'" class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="row.tel.status === 'no'" class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">{{ row.tel.text }}</span>
              </span>
            </td>
            <td class="px-5 py-3">
              <span class="inline-flex items-center justify-center gap-1.5 w-full" :class="statusColor[row.ray.status]">
                <svg v-if="row.ray.status === 'yes'" class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
                <svg v-else-if="row.ray.status === 'no'" class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">{{ row.ray.text }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-4 text-xs text-on-light-muted italic text-center max-w-2xl mx-auto font-sans">
      {{ t('cleanApp.table.disclaimer') }}
    </p>
  </div>
</template>
