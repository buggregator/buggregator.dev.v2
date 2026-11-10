// Run: npm run test:tips (node --test, no test framework needed).
// Covers the tip parser and checks every real file in content/tips.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  parseTip, splitBody, sortNewestFirst, checkRelated, featureKey, countWords,
} from '../server/lib/tips.ts'

const here = import.meta.dirname
const fixture = readFileSync(join(here, 'fixtures/tips/laravel-mail-to-local-inbox.md'), 'utf8')

test('parses frontmatter into the tip fields', () => {
  const tip = parseTip('laravel-mail-to-local-inbox', fixture)
  assert.equal(tip.title, 'Laravel mail to a local inbox, three .env lines')
  assert.equal(tip.feature, 'Mail')
  assert.equal(tip.featurePage, '/features/email-testing')
  assert.equal(tip.requires, null)
  assert.deepEqual(tip.related, ['symfony-mailer-to-local-inbox'])
  assert.deepEqual(tip.checked, { date: '2026-11-10', version: 'v2.8.0' })
  // No `published`: the checked date stands in.
  assert.equal(tip.published, '2026-11-10')
  assert.equal(tip.modified, '2026-11-10')
})

test('the answer is the text before the first ## heading; sections follow in order', () => {
  const tip = parseTip('laravel-mail-to-local-inbox', fixture)
  assert.match(tip.answerHtml, /^<p>Set three lines in <code>.env<\/code>/)
  assert.deepEqual(tip.sections.map(s => s.title), ['Steps', 'Why it works'])
  assert.match(tip.sections[0]!.html, /<h3>1\. Point the mailer at Buggregator<\/h3>/)
})

test('a ## line inside a code fence does not start a section', () => {
  const { sections } = splitBody('Answer.\n\n## Steps\n\n```md\n## not a heading\n```\n')
  assert.equal(sections.length, 1)
  assert.match(sections[0]!.markdown, /## not a heading/)
})

test('code blocks get a language label, a copy button and line colours', () => {
  const html = parseTip('laravel-mail-to-local-inbox', fixture).sections[0]!.html
  assert.match(html, /<span class="tip-code-lang">dotenv<\/span>/)
  assert.match(html, /<button type="button" class="tip-copy" data-copy>Copy<\/button>/)
  assert.match(html, /<span class="tip-c-comment"># .env<\/span>/)
  assert.match(html, /<span class="tip-c-key">MAIL_PORT<\/span>=<span class="tip-c-value">1025<\/span>/)
})

test('external links open in a new tab, raw HTML is escaped', () => {
  const src = fixture.replace('Buggregator listens', '<script>x</script> Buggregator listens')
  const tip = parseTip('laravel-mail-to-local-inbox', src)
  assert.match(tip.sections[0]!.html, /<a href="http:\/\/127.0.0.1:8000" target="_blank" rel="noopener">UI<\/a>/)
  assert.doesNotMatch(tip.sections[1]!.html, /<script>/)
})

test('lists every frontmatter problem at once', () => {
  const bad = fixture
    .replace('slug: laravel-mail-to-local-inbox', 'slug: other-slug')
    .replace('feature: Mail', 'feature: Email')
    .replace('requires: null', 'requires: 2.6')
  assert.throws(() => parseTip('laravel-mail-to-local-inbox', bad), (e: Error) => {
    assert.match(e.message, /differs from the file name/)
    assert.match(e.message, /feature: «Email»/)
    assert.match(e.message, /requires: «2.6»/)
    return true
  })
})

test('feature_page and query may be null', () => {
  const src = fixture.replace('feature_page: /features/email-testing', 'feature_page: null').replace('query: laravel mailpit', 'query: null')
  assert.equal(parseTip('laravel-mail-to-local-inbox', src).featurePage, null)
})

test('a title over 60 chars is refused', () => {
  const bad = fixture.replace(/^title: .*$/m, `title: ${'x'.repeat(61)}`)
  assert.throws(() => parseTip('laravel-mail-to-local-inbox', bad), /title: 61 chars, max 60/)
})

test('newest first, same day by title', () => {
  const t = (slug: string, title: string, published: string) =>
    ({ slug, title, published, description: '', feature: 'Mail' as const, featurePage: '', requires: null, modified: published })
  const sorted = sortNewestFirst([t('a', 'B', '2026-11-01'), t('b', 'A', '2026-11-01'), t('c', 'C', '2026-11-05')])
  assert.deepEqual(sorted.map(s => s.slug), ['c', 'b', 'a'])
})

test('related slugs must exist', () => {
  const tip = parseTip('laravel-mail-to-local-inbox', fixture)
  assert.deepEqual(checkRelated([tip]), ['tip laravel-mail-to-local-inbox: related «symfony-mailer-to-local-inbox» does not exist'])
})

test('feature keys are URL-safe', () => {
  assert.equal(featureKey('Mock server'), 'mock-server')
  assert.equal(featureKey('MCP'), 'mcp')
})

test('word count skips code', () => {
  assert.equal(countWords('One two.\n\n```\nA B C D\n```\nthree'), 3)
})

// Content guard: every published tip must parse and link only to real tips.
const contentDir = join(here, '../content/tips')
const files = existsSync(contentDir) ? readdirSync(contentDir).filter(f => f.endsWith('.md')) : []

test(`content/tips: ${files.length} file(s) parse and link correctly`, () => {
  const errors: string[] = []
  const tips = files.flatMap((f) => {
    try {
      return [parseTip(f.replace(/\.md$/, ''), readFileSync(join(contentDir, f), 'utf8'))]
    } catch (e) {
      errors.push((e as Error).message)
      return []
    }
  })
  errors.push(...checkRelated(tips))
  assert.deepEqual(errors, [])
})

test('every tip has its og:image card (npm run tips:og)', () => {
  const missing = files.map(f => f.replace(/\.md$/, '')).filter(s => !existsSync(join(here, `../public/og/tips/${s}.png`)))
  assert.deepEqual(missing, [])
})

test('public/ has no tips/ folder: it would turn /tips into a redirect to /tips/', () => {
  assert.equal(existsSync(join(here, '../public/tips')), false)
})
