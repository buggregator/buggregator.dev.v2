// Draws the og:image code card of every tip: public/og/tips/<slug>.png, 1200×630.
// Run after adding or changing a tip, and commit the images:
//   CHROME_PATH=/path/to/chrome npm run tips:og            (all tips)
//   CHROME_PATH=/path/to/chrome npm run tips:og -- <slug>  (one tip)
// npm run test:tips fails while a tip has no card.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import { colourLine, splitFrontmatter } from '../server/lib/tips.ts'

const root = join(import.meta.dirname, '..')
const tipsDir = join(root, 'content/tips')
const outDir = join(root, 'public/og/tips')
const font = (f: string) => `data:font/woff2;base64,${readFileSync(join(root, 'public/fonts', f)).toString('base64')}`

const COLORS: Record<string, string> = {
  'Mail': '#f59e0b', 'Sentry': '#f43f5e', 'Dumps': '#ef4444', 'Logs': '#6b7280', 'Xdebug': '#f97316',
  'Mock server': '#0ea5e9', 'HTTP': '#22c55e', 'Profiler': '#8b5cf6', 'MCP': '#14b8a6', 'SMS': '#a855f7',
}
const MAX_LINES = 9
const MAX_COLS = 62

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// The first code block of the tip, cut to fit the card.
function cardCode(body: string): string[] {
  const m = /^```[^\n]*\n([\s\S]*?)^```/m.exec(body)
  if (!m) return []
  let lines = m[1]!.replace(/\n$/, '').split('\n')
  if (lines.length > MAX_LINES) lines = [...lines.slice(0, MAX_LINES - 1), '…']
  return lines.map(l => (l.length > MAX_COLS ? `${l.slice(0, MAX_COLS - 1)}…` : l))
}

function cardHtml(title: string, feature: string, slug: string, code: string[]): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'DM Sans'; font-weight: 700; src: url(${font('DMSans-Bold.woff2')}); }
@font-face { font-family: 'DM Sans'; font-weight: 500; src: url(${font('DMSans-Medium.woff2')}); }
@font-face { font-family: 'JetBrains Mono'; font-weight: 400; src: url(${font('JetBrainsMono-Regular.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0c0e14; color: #fff; font-family: 'DM Sans'; padding: 56px 64px;
  display: flex; flex-direction: column; gap: 28px;
  background-image: radial-gradient(ellipse 70% 60% at 85% 0%, ${COLORS[feature] ?? '#3b82f6'}22 0%, transparent 70%); }
.top { display: flex; align-items: center; gap: 14px; font: 500 24px 'JetBrains Mono'; color: #8b919a; }
.dot { width: 14px; height: 14px; border-radius: 50%; background: ${COLORS[feature] ?? '#3b82f6'}; }
h1 { font-weight: 700; font-size: ${title.length > 44 ? 52 : 60}px; line-height: 1.12; letter-spacing: -0.02em; }
.code { flex: 1; min-height: 0; overflow: hidden; background: #0d1117; border: 1px solid #21262d; border-radius: 16px; padding: 24px 28px;
  font: 400 22px/1.5 'JetBrains Mono'; color: #c9d1d9; white-space: pre; }
.tip-c-comment { color: #6e7681; } .tip-c-prompt { color: #22c55e; } .tip-c-key { color: #ff7b72; } .tip-c-value { color: #a5d6ff; }
.foot { display: flex; justify-content: space-between; font: 500 22px 'JetBrains Mono'; color: #8b919a; }
.foot b { color: #fff; font-family: 'DM Sans'; font-weight: 700; font-size: 26px; }
</style></head><body>
<div class="top"><span class="dot"></span>${esc(feature)} · Buggregator Tips</div>
<h1>${esc(title)}</h1>
${code.length ? `<div class="code">${code.map(colourLine).join('\n')}</div>` : '<div style="flex:1"></div>'}
<div class="foot"><b>buggregator</b><span>buggregator.dev/tips/${esc(slug)}</span></div>
</body></html>`
}

const only = process.argv[2]
const files = readdirSync(tipsDir).filter(f => f.endsWith('.md') && (!only || f === `${only}.md`))
if (!files.length) throw new Error(only ? `no tip ${only}` : 'no tips')

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const f of files) {
  const { data, body } = splitFrontmatter(readFileSync(join(tipsDir, f), 'utf8'))
  const slug = f.replace(/\.md$/, '')
  await page.setContent(cardHtml(String(data.title), String(data.feature), slug, cardCode(body)), { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(outDir, `${slug}.png`) })
  console.log(`public/og/tips/${slug}.png`)
}
await browser.close()
