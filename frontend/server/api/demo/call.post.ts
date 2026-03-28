export default defineEventHandler(async (event) => {
  const body = await readBody<{ action: string }>(event)
  if (!body?.action) {
    throw createError({ statusCode: 400, statusMessage: 'Missing action' })
  }

  const config = useRuntimeConfig(event)
  const examplesUrl = config.examplesUrl

  try {
    await $fetch(`${examplesUrl}/example/call`, {
      method: 'POST',
      body: { action: body.action },
      timeout: 5000,
    })
    return { ok: true }
  } catch {
    return { ok: false }
  }
})
