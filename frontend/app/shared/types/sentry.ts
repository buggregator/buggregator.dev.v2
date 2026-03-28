// Inlined from @sentry/types — only what sentry-exception components need

export interface SentryFrame {
  filename?: string
  function?: string
  module?: string
  lineno?: number
  colno?: number
  abs_path?: string
  context_line?: string
  pre_context?: string[]
  post_context?: string[]
  in_app?: boolean
  vars?: Record<string, unknown>
}

export interface SentryException {
  type?: string
  value?: string
  mechanism?: {
    type?: string
    handled?: boolean
    data?: Record<string, string | boolean | number>
  }
  stacktrace?: {
    frames: SentryFrame[]
  }
}
