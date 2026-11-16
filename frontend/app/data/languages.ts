// The «Not PHP?» block on the home page: one tab per language, in this order.
// Snippets are code, the same in every locale; the «what works» line of each
// tab lives in i18n under `languages.tabs.<id>`. Copy: #5768 (copywriter).

export type LanguageTab = {
  id: 'node' | 'browser' | 'python' | 'go' | 'java'
  label: string
  /** Shown as the code box's caption and read by screen readers. */
  file: string
  code: string
  docs: string
}

const SENTRY_DOCS = 'https://docs.buggregator.dev/config/sentry.html'

export const LANGUAGE_TABS: LanguageTab[] = [
  {
    id: 'node',
    label: 'Node.js',
    file: 'app.js',
    code: `Sentry.init({ dsn: "http://sentry@127.0.0.1:8000/1", tracesSampleRate: 1.0, enableLogs: true });

nodemailer.createTransport({ host: "127.0.0.1", port: 1025, secure: false });`,
    docs: SENTRY_DOCS,
  },
  {
    id: 'browser',
    label: 'Browser JS',
    file: 'main.js',
    code: `Sentry.init({
  dsn: "http://sentry@127.0.0.1:8000/1",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});`,
    docs: SENTRY_DOCS,
  },
  {
    id: 'python',
    label: 'Python',
    file: 'app.py',
    code: `sentry_sdk.init(dsn="http://sentry@127.0.0.1:8000/1", traces_sample_rate=1.0, enable_logs=True)

smtplib.SMTP("127.0.0.1", 1025)  # emails land in Buggregator`,
    docs: SENTRY_DOCS,
  },
  {
    id: 'go',
    label: 'Go',
    file: 'main.go',
    code: `sentry.Init(sentry.ClientOptions{
    Dsn: "http://sentry@127.0.0.1:8000/1", EnableTracing: true, TracesSampleRate: 1.0,
})
defer sentry.Flush(2 * time.Second)`,
    docs: SENTRY_DOCS,
  },
  {
    id: 'java',
    label: 'Java',
    file: 'application.properties',
    code: `spring.mail.host=127.0.0.1
spring.mail.port=1025
sentry.dsn=http://sentry@127.0.0.1:8000/1
sentry.traces-sample-rate=1.0
sentry.logs.enabled=true`,
    docs: SENTRY_DOCS,
  },
]
