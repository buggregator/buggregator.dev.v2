function getBaseUrl(): string {
  return '/api/v1/app'
}

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<{ data: T; status: number }> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }

  if (opts?.body) {
    headers['Content-Type'] = 'application/json'
  }

  if (opts?.headers) {
    const extra = opts.headers as Record<string, string>
    for (const key in extra) {
      headers[key] = extra[key]
    }
  }

  const { headers: _discard, ...restOpts } = opts || {}

  const res = await fetch(`${getBaseUrl()}${path}`, {
    headers,
    ...restOpts,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API ${res.status}: ${body}`)
  }

  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  return { data, status: res.status }
}

export function useApi() {
  return {
    getBaseUrl,
    get: <T = unknown>(path: string) => apiFetch<T>(path),
    post: <T = unknown>(path: string, body?: unknown) =>
      apiFetch<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
    put: <T = unknown>(path: string, body?: unknown) =>
      apiFetch<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
    del: <T = unknown>(path: string) =>
      apiFetch<T>(path, { method: 'DELETE' }),
  }
}
