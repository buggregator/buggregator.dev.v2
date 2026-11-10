import { toSummary } from '../../lib/tips'

// GET /api/tips → every tip's summary, newest first. The index filters
// by feature on the page, so one response serves every filter.
export default defineEventHandler(async () => {
  const tips = await loadTips()
  return tips.map(toSummary)
})
