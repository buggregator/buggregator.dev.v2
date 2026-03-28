export type FeedEvent = {
  id: string
  type: 'sentry' | 'smtp' | 'profiler' | 'monolog' | 'var-dump' | 'http-dump'
  label: string
  sublabel?: string
  delay: number
}

export const heroFeedEvents: FeedEvent[] = [
  { id: 'e1', type: 'sentry', label: 'AuthenticationException', sublabel: 'Unhandled', delay: 0 },
  { id: 'e2', type: 'smtp', label: 'Welcome email', sublabel: 'user@example.com', delay: 2800 },
  { id: 'e3', type: 'profiler', label: 'XHProf · 891ms', sublabel: 'profiler report', delay: 3200 },
  { id: 'e4', type: 'monolog', label: '[ERROR] DB connection', sublabel: 'attempt 3/3', delay: 2500 },
  { id: 'e5', type: 'sentry', label: 'QueryException', sublabel: 'SQLSTATE[42S02]', delay: 3000 },
  { id: 'e6', type: 'smtp', label: 'Order shipped', sublabel: 'customer@shop.com', delay: 2700 },
  { id: 'e7', type: 'monolog', label: '[INFO] Cache warmed', sublabel: '1,240 keys loaded', delay: 2000 },
  { id: 'e8', type: 'profiler', label: 'XHProf · 234ms', sublabel: 'Model::fill × 5000', delay: 3500 },
  { id: 'e9', type: 'sentry', label: 'TypeError', sublabel: 'Unhandled · routes/api.php', delay: 2900 },
  { id: 'e10', type: 'smtp', label: 'Password reset', sublabel: 'reset@example.com', delay: 3100 },
  { id: 'e11', type: 'monolog', label: '[WARNING] Slow query', sublabel: '1.4s · users table', delay: 2600 },
  { id: 'e12', type: 'var-dump', label: 'array(14)', sublabel: 'App/Http/Controllers · :42', delay: 1800 },
  { id: 'e13', type: 'http-dump', label: 'POST /api/orders', sublabel: 'HTTP dump · 200 OK', delay: 2400 },
  { id: 'e14', type: 'sentry', label: 'NotFoundHttpException', sublabel: 'Handled · /api/users/99', delay: 3300 },
  { id: 'e15', type: 'smtp', label: 'Invoice #4821', sublabel: 'billing@example.com', delay: 2900 },
  { id: 'e16', type: 'monolog', label: '[DEBUG] User logged in', sublabel: 'user_id=42', delay: 2000 },
  { id: 'e17', type: 'profiler', label: 'XHProf · 1.2s', sublabel: 'N+1 detected · Eloquent', delay: 3600 },
  { id: 'e18', type: 'sentry', label: 'ValidationException', sublabel: 'Handled · field: email', delay: 2700 },
  { id: 'e19', type: 'var-dump', label: 'App\\Models\\User {#42}', sublabel: 'App/Services/Auth · :89', delay: 2200 },
  { id: 'e20', type: 'smtp', label: '2FA verification code', sublabel: 'security@example.com', delay: 3100 },
]
