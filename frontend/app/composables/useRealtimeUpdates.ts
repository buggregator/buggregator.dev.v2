type MessageHandler = (data: any) => void

export function useRealtimeUpdates() {
  if (!import.meta.client) {
    return {
      status: ref<'disconnected'>('disconnected'),
      connect: () => {},
      disconnect: () => {},
      onMessage: (_topic: string, _handler: MessageHandler) => {},
    }
  }

  const status = ref<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const handlers = new Map<string, Set<MessageHandler>>()
  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let backoff = 1000

  function connect() {
    if (ws) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const url = `${protocol}//${window.location.host}/ws/updates`

    status.value = 'connecting'
    ws = new WebSocket(url)

    ws.onopen = () => {
      status.value = 'connected'
      backoff = 1000
    }

    ws.onmessage = (event) => {
      try {
        const outer = JSON.parse(event.data)

        // The wsrelay wraps messages as {data: {type: "text", data: "..."}}
        // Extract the inner text content and parse it
        let msg: any
        if (outer.data?.type === 'text' && typeof outer.data.data === 'string') {
          msg = JSON.parse(outer.data.data)
        } else if (outer.topic || outer.type) {
          msg = outer
        } else if (outer.data?.topic || outer.data?.type) {
          msg = outer.data
        } else {
          return
        }

        const topic = msg.topic || msg.type
        const data = msg.data || msg.payload

        if (topic) {
          const topicHandlers = handlers.get(topic)
          if (topicHandlers) {
            topicHandlers.forEach(h => h(data))
          }
        }
      } catch {
        // Ignore malformed messages
      }
    }

    ws.onclose = () => {
      status.value = 'disconnected'
      ws = null
      scheduleReconnect()
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  function disconnect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (ws) {
      ws.onclose = null
      ws.close()
      ws = null
    }
    status.value = 'disconnected'
    backoff = 1000
  }

  function scheduleReconnect() {
    if (reconnectTimer) return
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
      backoff = Math.min(backoff * 2, 30000)
    }, backoff)
  }

  function onMessage(topic: string, handler: MessageHandler) {
    if (!handlers.has(topic)) {
      handlers.set(topic, new Set())
    }
    handlers.get(topic)!.add(handler)
  }

  onScopeDispose(() => {
    disconnect()
  })

  return { status, connect, disconnect, onMessage }
}
