import { parseTip, checkRelated, sortNewestFirst, type Tip } from '../lib/tips'

// Tip files are bundled as Nitro server assets (nuxt.config: nitro.serverAssets,
// base «tips»). Parsed once per process; in dev on every call, so edits show.
let cache: Promise<Tip[]> | null = null

async function load(): Promise<Tip[]> {
  const storage = useStorage('assets:tips')
  const keys = (await storage.getKeys()).filter(k => k.endsWith('.md'))
  const tips = await Promise.all(keys.map(async (key) => {
    const source = await storage.getItem<string>(key)
    return parseTip(key.replace(/\.md$/, ''), String(source ?? ''))
  }))
  const errors = checkRelated(tips)
  if (errors.length) throw new Error(errors.join('; '))
  return sortNewestFirst(tips)
}

// All tips, newest first.
export function loadTips(): Promise<Tip[]> {
  if (import.meta.dev || !cache) {
    cache = load()
    cache.catch(() => { cache = null })
  }
  return cache
}
