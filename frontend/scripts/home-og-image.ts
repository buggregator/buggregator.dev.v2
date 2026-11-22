// Draws the home page og:image / twitter:image: public/og/home.jpg, 1200×630.
// The beetles' assembly line under a shade, the title on the left (#6831).
// Run after changing the picture or the words, and commit the image:
//   CHROME_PATH=/path/to/chrome node scripts/home-og-image.ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright-core'

const root = join(import.meta.dirname, '..')
const out = join(root, 'public/og/home.jpg')
const data = (f: string, type: string) => `data:${type};base64,${readFileSync(join(root, 'public', f)).toString('base64')}`
const font = (f: string) => data(`fonts/${f}`, 'font/woff2')
const logo = `data:image/svg+xml;base64,${readFileSync(join(root, 'app/assets/img/logo.svg')).toString('base64')}`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'DM Sans'; font-weight: 700; src: url(${font('DMSans-Bold.woff2')}); }
@font-face { font-family: 'DM Sans'; font-weight: 500; src: url(${font('DMSans-Medium.woff2')}); }
@font-face { font-family: 'JetBrains Mono'; font-weight: 400; src: url(${font('JetBrainsMono-Regular.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0c0e14; color: #fff; font-family: 'DM Sans'; position: relative; overflow: hidden; }
.pic { position: absolute; top: 0; bottom: 0; right: 0; width: 780px;
  background: url(${data('img/assembly-line/line-1280.jpg', 'image/jpeg')}) 0% 50% / cover no-repeat;
  filter: saturate(1.25) contrast(1.1) brightness(0.7); }
.shade { position: absolute; inset: 0;
  background: linear-gradient(90deg, #0c0e14 0%, #0c0e14 35%, rgba(12, 14, 20, 0.55) 52%, transparent 75%); }
.text { position: absolute; left: 64px; top: 0; bottom: 0; width: 600px; display: flex; flex-direction: column; justify-content: center; gap: 28px; }
.mark { height: 40px; width: auto; align-self: flex-start; }
h1 { font-weight: 700; font-size: 64px; line-height: 1.08; letter-spacing: -0.03em; }
h1 span { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%); -webkit-background-clip: text; color: transparent; }
p { font-weight: 500; font-size: 26px; line-height: 1.4; color: #b4bac4; }
.foot { position: absolute; left: 64px; bottom: 48px; font: 400 22px 'JetBrains Mono'; color: #8b919a; }
</style></head><body>
<div class="pic"></div>
<div class="shade"></div>
<div class="text">
  <img class="mark" src="${logo}" alt="">
  <h1>Debug everything<br>in your <span>PHP app</span></h1>
  <p>Exceptions, dumps, emails, profiling and logs in one real-time UI. Free &amp; open source.</p>
</div>
<div class="foot">buggregator.dev</div>
</body></html>`

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: out, type: 'jpeg', quality: 82 })
await browser.close()
console.log(`wrote ${out}`)
