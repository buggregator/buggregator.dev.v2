import type { FeatureIconName } from '~/data/feature-icons'

// The feature pages of the site. They are English only
// (defineI18nRoute(false)): the path has no locale prefix in any locale.
export type FeatureId =
  | 'sentry' | 'csp' | 'profiler' | 'xdebug'
  | 'httpDumps' | 'proxy' | 'mock'
  | 'email' | 'sms' | 'broadcast'
  | 'dumps' | 'logs' | 'cron'
  | 'requestTimeline' | 'queues' | 'feedFilters'
  | 'mcp' | 'htmlPages'

export type FeaturePage = {
  label: string
  to: string
  icon: FeatureIconName
  // New in the latest release: a NEW mark in the menu.
  isNew?: boolean
}

export const FEATURE_PAGES: Record<FeatureId, FeaturePage> = {
  sentry: { label: 'Sentry', to: '/features/sentry', icon: 'sentry' },
  csp: { label: 'CSP reports', to: '/features/csp-reports', icon: 'shield' },
  requestTimeline: { label: 'Request timeline', to: '/features/request-timeline', icon: 'trace' },
  profiler: { label: 'Profiler', to: '/features/profiler', icon: 'profiler' },
  xdebug: { label: 'Xdebug', to: '/features/xdebug', icon: 'trace' },
  httpDumps: { label: 'HTTP dumps', to: '/features/http-dumps', icon: 'http-dump' },
  proxy: { label: 'HTTP proxy', to: '/features/http-proxy', icon: 'host' },
  mock: { label: 'Mock server', to: '/features/mock-server', icon: 'mock-server', isNew: true },
  email: { label: 'Email testing', to: '/features/email-testing', icon: 'smtp' },
  sms: { label: 'SMS testing', to: '/features/sms', icon: 'sms' },
  broadcast: { label: 'Broadcast events', to: '/features/broadcast-events', icon: 'broadcast' },
  dumps: { label: 'Dumps (Ray, VarDumper)', to: '/features/dumps', icon: 'var-dump' },
  htmlPages: { label: 'HTML pages', to: '/features/html-pages', icon: 'http-dump' },
  logs: { label: 'Logs', to: '/features/logs', icon: 'monolog' },
  queues: { label: 'Queue jobs', to: '/features/queue-jobs', icon: 'sentry' },
  cron: { label: 'Cron monitoring', to: '/features/cron-monitoring', icon: 'heartBeat' },
  feedFilters: { label: 'Feed filters', to: '/features/feed-filters', icon: 'events' },
  mcp: { label: 'MCP & API', to: '/features/mcp-api', icon: 'bolt' },
}

export type FeatureGroup = { id: string, features: FeatureId[] }

// «Features» menu: grouped by the visitor's task, two groups a column.
// Group titles: nav.menu.groups.<id>.
export const FEATURE_MENU_COLUMNS: FeatureGroup[][] = [
  [
    { id: 'errors', features: ['sentry', 'requestTimeline', 'csp'] },
    { id: 'perf', features: ['profiler', 'xdebug'] },
  ],
  [
    { id: 'http', features: ['httpDumps', 'proxy', 'mock'] },
    { id: 'mail', features: ['email', 'sms', 'broadcast'] },
  ],
  [
    { id: 'logs', features: ['dumps', 'htmlPages', 'logs', 'queues', 'cron'] },
    { id: 'agents', features: ['feedFilters', 'mcp'] },
  ],
]

// The release the NEW marks and the «What's new» link speak about.
export const FEATURE_RELEASE = {
  version: '2.16',
  tag: '2.16.0',
  url: 'https://github.com/buggregator/server/releases/tag/v2.16.0',
}
