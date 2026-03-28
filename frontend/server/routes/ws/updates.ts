export default defineWebSocketHandler({
  open(peer) {
    const config = useRuntimeConfig()
    const backendBase = (config.apiBaseUrl || 'http://app:8080').replace(/^http/, 'ws')
    const backendUrl = `${backendBase}/ws/updates`

    const backend = new WebSocket(backendUrl)

    backend.onmessage = (event) => {
      peer.send(typeof event.data === 'string' ? event.data : String(event.data))
    }

    backend.onerror = () => {
      peer.close(1011, 'backend error')
    }

    backend.onclose = () => {
      peer.close(1000, 'backend closed')
    }

    ;(peer as any)._backend = backend
  },

  message(peer, message) {
    const backend: WebSocket | undefined = (peer as any)._backend
    if (backend?.readyState === WebSocket.OPEN) {
      const text = typeof message === 'string' ? message : (message.text?.() ?? String(message))
      backend.send(text)
    }
  },

  close(peer) {
    const backend: WebSocket | undefined = (peer as any)._backend
    if (backend) {
      backend.close()
      ;(peer as any)._backend = undefined
    }
  },
})
