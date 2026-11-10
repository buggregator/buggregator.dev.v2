import type { Tip, TipFeature, TipSummary } from '../../server/lib/tips'

export type { TipFeature, TipSummary }

// A tip page's data: the tip with its related tips already resolved.
export type TipPage = Omit<Tip, 'related'> & { related: TipSummary[] }

// Index filter order and each feature's dot colour (the navbar's feature colours).
export const TIP_FEATURE_META: Record<TipFeature, { color: string }> = {
  'Mail': { color: '#f59e0b' },
  'Sentry': { color: '#f43f5e' },
  'Dumps': { color: '#ef4444' },
  'Logs': { color: '#6b7280' },
  'Xdebug': { color: '#f97316' },
  'Mock server': { color: '#0ea5e9' },
  'HTTP': { color: '#22c55e' },
  'Profiler': { color: '#8b5cf6' },
  'MCP': { color: '#14b8a6' },
  'SMS': { color: '#a855f7' },
}

export const TIP_FEATURES = Object.keys(TIP_FEATURE_META) as TipFeature[]

// «Mock server» → «mock-server», for ?feature= in the index URL.
export function tipFeatureKey(feature: string): string {
  return feature.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function tipFeatureColor(feature: string): string {
  return TIP_FEATURE_META[feature as TipFeature]?.color ?? '#3b82f6'
}

// «2026-11-10» → «10 Nov 2026», fixed locale and UTC so server and client agree.
export function formatTipDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

// Every tip's summary, newest first. Fetched once on the server, reused on the client.
export function useTipList() {
  return useFetch<TipSummary[]>('/api/tips', { key: 'tips', default: () => [] })
}

// Tips that name this page as their feature page («Tips for <feature>»), newest first.
export async function usePageTips(featurePage: string, limit = 5) {
  const { data, error } = await useTipList()
  const tips = computed(() => (data.value ?? []).filter(t => t.featurePage === featurePage).slice(0, limit))
  return { tips, error }
}

// The index filter: ?feature=<key>; unknown keys show every tip.
export function useTipFilter(tips: Ref<TipSummary[] | null | undefined>) {
  const route = useRoute()
  const active = computed<TipFeature | null>(() => {
    const key = String(route.query.feature ?? '')
    return TIP_FEATURES.find(f => tipFeatureKey(f) === key) ?? null
  })
  // Only features that have tips get a filter button.
  const features = computed(() => TIP_FEATURES.filter(f => (tips.value ?? []).some(t => t.feature === f)))
  const visible = computed(() => (tips.value ?? []).filter(t => !active.value || t.feature === active.value))
  return { active, features, visible }
}
