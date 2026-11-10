import { toSummary } from '../../lib/tips'

// GET /api/tips/<slug> → the tip with its related tips' summaries.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const tips = await loadTips()
  const tip = tips.find(t => t.slug === slug)
  if (!tip) throw createError({ statusCode: 404, statusMessage: 'Tip not found' })
  const related = tip.related
    .map(r => tips.find(t => t.slug === r))
    .filter(t => t !== undefined)
    .map(toSummary)
  return { ...tip, related }
})
