import { proxyRequest } from 'h3'

const PROXY_PATHS = ['/api/', '/mcp/']

export default defineEventHandler(async (event) => {
  // Skip WebSocket upgrades — handled by defineWebSocketHandler routes
  if (event.node.req.headers.upgrade === 'websocket') return

  const url = getRequestURL(event)
  const path = url.pathname

  if (!PROXY_PATHS.some(p => path.startsWith(p))) return

  const config = useRuntimeConfig()
  const target = config.apiBaseUrl

  const headers: Record<string, string> = {}

  // Forward original host info
  const originalHost = getRequestHeader(event, 'host')
  if (originalHost) {
    headers['X-Forwarded-Host'] = originalHost
  }
  const proto = getRequestHeader(event, 'x-forwarded-proto') || 'http'
  headers['X-Forwarded-Proto'] = proto

  const ip = getRequestIP(event)
  if (ip) {
    headers['X-Forwarded-For'] = ip
  }

  return proxyRequest(event, `${target}${url.pathname}${url.search}`, {
    headers,
  })
})
