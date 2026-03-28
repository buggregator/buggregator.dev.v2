export default defineEventHandler(async (event) => {
  const body = await readBody<{ action: string }>(event)
  if (!body?.action) {
    throw createError({ statusCode: 400, statusMessage: 'Missing action' })
  }

  const config = useRuntimeConfig(event)
  const examplesUrl = config.examplesUrl

  const isProfiler = body.action.startsWith('profiler:')
  const endpoint = isProfiler ? '/example/call/profiler' : '/example/call'

  try {
    await $fetch(`${examplesUrl}${endpoint}`, {
      method: 'POST',
      body: { action: body.action },
      timeout: 10000,
    })
    return { ok: true }
  } catch {
    return { ok: false }
  }
})
