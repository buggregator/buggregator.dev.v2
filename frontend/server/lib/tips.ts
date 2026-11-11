// Tips (/tips): one Markdown file per tip, `content/tips/<slug>.md`.
// Pure functions only (no Nitro globals), so `node --test` can run them.
//
// File format (copywriter, #4758):
//   ---
//   slug, title (≤60), description (≤155), query (SEO only, not shown; may be null),
//   feature (index filter), feature_page (may be null), docs, requires (null | "v2.6.0"),
//   related (slugs), checked: { date, version }, published (optional date)
//   ---
//   Answer paragraph(s), then `## Steps` (### 1. … + fenced code),
//   then `## Why it works`.
import MarkdownIt from 'markdown-it'
import { parse as parseYaml } from 'yaml'

export const TIP_FEATURES = [
  'Mail', 'Sentry', 'Dumps', 'Logs', 'Xdebug', 'Mock server', 'HTTP', 'Profiler', 'MCP', 'SMS',
] as const

export type TipFeature = typeof TIP_FEATURES[number]

export interface TipSummary {
  slug: string
  title: string
  description: string
  feature: TipFeature
  // null: the feature has no /features page (dumps, Ray).
  featurePage: string | null
  requires: string | null
  // ISO dates (YYYY-MM-DD). published falls back to checked.date.
  published: string
  modified: string
}

export interface TipSection {
  title: string
  html: string
}

export interface Tip extends TipSummary {
  docs: string
  related: string[]
  checked: { date: string, version: string }
  answerHtml: string
  sections: TipSection[]
  wordCount: number
}

// URL-safe key for a feature: «Mock server» → «mock-server».
export function featureKey(feature: string): string {
  return feature.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Every tip screenshot has this size (public/img/tips/<slug>.webp).
export const TIP_SHOT_SIZE = { width: 1280, height: 760 } as const

const md = createRenderer()

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Same light colouring as FeatureSetup: comments, `$ ` prompts, KEY=value.
export function colourLine(line: string): string {
  if (/^\s*(#|\/\/)/.test(line)) return `<span class="tip-c-comment">${escapeHtml(line)}</span>`
  if (line.startsWith('$ ')) return `<span class="tip-c-prompt" aria-hidden="true">$ </span>${escapeHtml(line.slice(2))}`
  const kv = /^([A-Za-z_][\w.]*)=(.*)$/.exec(line)
  if (kv) return `<span class="tip-c-key">${escapeHtml(kv[1]!)}</span>=<span class="tip-c-value">${escapeHtml(kv[2]!)}</span>`
  return escapeHtml(line)
}

function createRenderer(): MarkdownIt {
  const r = new MarkdownIt({ html: false, linkify: false, typographer: false })

  r.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]!
    const lang = token.info.trim().split(/\s+/)[0] ?? ''
    const code = token.content.replace(/\n$/, '')
    const lines = code.split('\n').map(colourLine).join('\n')
    const label = lang ? `<span class="tip-code-lang">${escapeHtml(lang)}</span>` : '<span></span>'
    return `<div class="tip-code">`
      + `<div class="tip-code-head">${label}<button type="button" class="tip-copy" data-copy>Copy</button></div>`
      + `<pre><code>${lines}</code></pre></div>\n`
  }

  // Screenshots (all TIP_SHOT_SIZE): fixed box so the page does not jump,
  // lazy, and a click opens the full-size file.
  r.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]!
    const src = escapeHtml(token.attrGet('src') ?? '')
    const alt = escapeHtml(token.content)
    return `<a class="tip-shot" href="${src}" target="_blank" rel="noopener">`
      + `<img src="${src}" alt="${alt}" width="${TIP_SHOT_SIZE.width}" height="${TIP_SHOT_SIZE.height}" loading="lazy" decoding="async">`
      + '<span class="tip-shot-hint" aria-hidden="true">Tap to enlarge</span></a>'
  }

  // External links open in a new tab; site links stay in place.
  const defaultLinkOpen = r.renderer.rules.link_open
    ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
  r.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx]!.attrGet('href') ?? ''
    if (/^https?:\/\//.test(href)) {
      tokens[idx]!.attrSet('target', '_blank')
      tokens[idx]!.attrSet('rel', 'noopener')
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  return r
}

// Images in a tip's body, in order (for the content check).
export function tipImages(source: string): Array<{ src: string, alt: string }> {
  const { body } = splitFrontmatter(source)
  return md.parse(body, {})
    .flatMap(t => t.children ?? [])
    .filter(t => t.type === 'image')
    .map(t => ({ src: t.attrGet('src') ?? '', alt: t.content }))
}

export function splitFrontmatter(source: string): { data: Record<string, unknown>, body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source)
  if (!m) throw new Error('missing frontmatter (--- … ---)')
  const data = parseYaml(m[1]!) as unknown
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('frontmatter is not a map')
  return { data: data as Record<string, unknown>, body: m[2]! }
}

// Body: everything before the first `## ` is the answer; each `## ` starts a section.
export function splitBody(body: string): { answer: string, sections: Array<{ title: string, markdown: string }> } {
  const lines = body.replace(/\r\n/g, '\n').split('\n')
  const answer: string[] = []
  const sections: Array<{ title: string, markdown: string[] }> = []
  let inFence = false
  for (const line of lines) {
    if (/^(```|~~~)/.test(line)) inFence = !inFence
    const h2 = !inFence ? /^## +(.+?)\s*#*\s*$/.exec(line) : null
    if (h2) {
      sections.push({ title: h2[1]!, markdown: [] })
    } else if (sections.length) {
      sections[sections.length - 1]!.markdown.push(line)
    } else {
      answer.push(line)
    }
  }
  return {
    answer: answer.join('\n').trim(),
    sections: sections.map(s => ({ title: s.title, markdown: s.markdown.join('\n').trim() })),
  }
}

function str(data: Record<string, unknown>, key: string, errors: string[], required = true): string {
  const v = data[key]
  if (v === undefined || v === null || v === '') {
    if (required) errors.push(`${key}: required`)
    return ''
  }
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v !== 'string' && typeof v !== 'number') {
    errors.push(`${key}: must be text`)
    return ''
  }
  return String(v)
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function countWords(markdown: string): number {
  return markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(w => /\w/.test(w)).length
}

// Parses one file. Throws with every problem listed, so a broken tip
// fails the content check (and the build) instead of rendering half.
export function parseTip(fileSlug: string, source: string): Tip {
  const errors: string[] = []
  let parts: ReturnType<typeof splitFrontmatter>
  try {
    parts = splitFrontmatter(source)
  } catch (e) {
    throw new Error(`tip ${fileSlug}: frontmatter: ${(e as Error).message.split('\n')[0]}`)
  }
  const { data, body } = parts

  const slug = str(data, 'slug', errors)
  if (slug && slug !== fileSlug) errors.push(`slug: «${slug}» differs from the file name «${fileSlug}»`)
  if (slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push('slug: lowercase words joined by hyphens')

  const title = str(data, 'title', errors)
  if (title.length > 60) errors.push(`title: ${title.length} chars, max 60`)
  const description = str(data, 'description', errors)
  if (description.length > 155) errors.push(`description: ${description.length} chars, max 155`)

  const feature = str(data, 'feature', errors) as TipFeature
  if (feature && !TIP_FEATURES.includes(feature)) errors.push(`feature: «${feature}» is not one of ${TIP_FEATURES.join(', ')}`)

  const featurePage = str(data, 'feature_page', errors, false) || null
  if (featurePage && !featurePage.startsWith('/')) errors.push('feature_page: a site path like /features/sentry')
  const docs = str(data, 'docs', errors)
  const requires = str(data, 'requires', errors, false) || null
  if (requires && !/^v\d+\.\d+\.\d+$/.test(requires)) errors.push(`requires: «${requires}» is not like v2.6.0`)

  const relatedRaw = data.related ?? []
  const related = Array.isArray(relatedRaw) ? relatedRaw.map(String) : []
  if (!Array.isArray(relatedRaw)) errors.push('related: must be a list of slugs')

  const checkedRaw = (data.checked ?? {}) as Record<string, unknown>
  const checked = {
    date: str(checkedRaw, 'date', errors),
    version: str(checkedRaw, 'version', errors),
  }
  if (checked.date && !DATE_RE.test(checked.date)) errors.push('checked.date: YYYY-MM-DD')

  const published = str(data, 'published', errors, false) || checked.date
  if (published && !DATE_RE.test(published)) errors.push('published: YYYY-MM-DD')

  const { answer, sections } = splitBody(body)
  if (!answer) errors.push('body: the answer paragraph before «## Steps» is missing')
  if (!sections.length) errors.push('body: no «## » sections')
  for (const img of tipImages(source)) {
    if (!img.alt.trim()) errors.push(`image ${img.src}: alt text required`)
  }

  if (errors.length) throw new Error(`tip ${fileSlug}: ${errors.join('; ')}`)

  return {
    slug,
    title,
    description,
    feature,
    featurePage,
    docs,
    requires,
    related,
    checked,
    published,
    // Re-checking a tip is the edit that counts as a modification.
    modified: checked.date > published ? checked.date : published,
    answerHtml: md.render(answer),
    sections: sections.map(s => ({ title: s.title, html: md.render(s.markdown) })),
    wordCount: countWords(body),
  }
}

export function toSummary(tip: Tip): TipSummary {
  const { slug, title, description, feature, featurePage, requires, published, modified } = tip
  return { slug, title, description, feature, featurePage, requires, published, modified }
}

// Newest first; same day → by title, so the order is stable.
export function sortNewestFirst<T extends TipSummary>(tips: T[]): T[] {
  return [...tips].sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title))
}

// Cross-file checks: related slugs must exist and must not point at itself.
export function checkRelated(tips: Tip[]): string[] {
  const slugs = new Set(tips.map(t => t.slug))
  const errors: string[] = []
  for (const t of tips) {
    for (const r of t.related) {
      if (r === t.slug) errors.push(`tip ${t.slug}: related lists itself`)
      else if (!slugs.has(r)) errors.push(`tip ${t.slug}: related «${r}» does not exist`)
    }
  }
  return errors
}
