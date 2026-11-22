// Run: npm run test:picture (node --test). The assembly-line picture (#6831):
// the 404 page, the home band before the footer and the home og:image.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const locale = (code: string) => JSON.parse(readFileSync(join(root, 'i18n/locales', `${code}.json`), 'utf8'))

test('the 404 page and the band speak en, ru and es', () => {
  for (const code of ['en', 'ru', 'es']) {
    const l = locale(code)
    for (const key of ['title', 'line', 'home', 'docs', 'errorTitle', 'errorLine', 'alt']) {
      assert.ok(l.notFound?.[key], `${code}: notFound.${key}`)
    }
    for (const key of ['title', 'sub', 'alt']) {
      assert.ok(l.assemblyLine?.[key], `${code}: assemblyLine.${key}`)
    }
  }
  assert.equal(locale('en').notFound.title, 'Bug not found')
})

test('every size the picture asks for is on disk', () => {
  const vue = readFileSync(join(root, 'app/components/ui/AssemblyLinePicture.vue'), 'utf8')
  const files = [...vue.matchAll(/line-\d+\.(?:webp|jpg)/g)].map(m => m[0])
  assert.deepEqual([...new Set(files)].sort(), ['line-1280.jpg', 'line-1280.webp', 'line-1672.webp', 'line-960.webp'])
  for (const f of files) assert.ok(existsSync(join(root, 'public/img/assembly-line', f)), f)
})

// The size from the JPEG frame header (SOF0..SOF2).
function jpegSize(buf: Buffer): [number, number] {
  let i = 2
  while (i < buf.length) {
    const marker = buf[i + 1]!
    const len = buf.readUInt16BE(i + 2)
    if (marker >= 0xc0 && marker <= 0xc2) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]
    i += 2 + len
  }
  throw new Error('no frame header')
}

test('the home og:image is a 1200×630 JPEG and the page points at it', () => {
  assert.deepEqual(jpegSize(readFileSync(join(root, 'public/og/home.jpg'))), [1200, 630])
  const page = readFileSync(join(root, 'app/pages/index.vue'), 'utf8')
  assert.match(page, /ogImage: `\$\{siteUrl\}\/og\/home\.jpg`/)
  assert.match(page, /twitterImage: `\$\{siteUrl\}\/og\/home\.jpg`/)
})
