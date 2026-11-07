import type { Ref } from 'vue'

/** One node of the server's flame chart (`GET /api/profiler/{uuid}/flame-chart`). */
export type FlameNode = {
  name: string
  /** Start and duration in ms. */
  start: number
  duration: number
  color: string | null
  /** wt and cpu in µs, mu and pmu in bytes, ct = calls. */
  cost: { wt: number, cpu: number, mu: number, pmu: number, ct: number }
  children: FlameNode[]
}

export type FlameFrame = {
  id: string
  node: FlameNode
  depth: number
  start: number
  end: number
  parentId: string | null
  childIds: string[]
}

/**
 * Flattens a flame chart into frames (one per call, with its depth) and
 * keeps the zoomed range. A child never draws past its parent's end.
 * Pure data: the same on server and client.
 */
export function useFlameGraph(roots: Ref<FlameNode[]> | FlameNode[]) {
  const source = isRef(roots) ? roots : ref(roots)

  const frames = computed<FlameFrame[]>(() => {
    const out: FlameFrame[] = []
    const walk = (node: FlameNode, depth: number, id: string, parentId: string | null, limit: number) => {
      const end = Math.min(node.start + node.duration, limit)
      const childIds = node.children.map((_, i) => `${id}.${i}`)
      out.push({ id, node, depth, start: node.start, end, parentId, childIds })
      node.children.forEach((child, i) => walk(child, depth + 1, childIds[i]!, id, end))
    }
    source.value.forEach((root, i) => walk(root, 0, `${i}`, null, Infinity))
    return out
  })

  const total = computed(() => {
    const ends = frames.value.filter(f => f.depth === 0).map(f => f.end)
    return { start: 0, end: ends.length ? Math.max(...ends) : 0 }
  })

  const depth = computed(() => frames.value.reduce((max, f) => Math.max(max, f.depth + 1), 0))

  const zoomedId = ref<string | null>(null)
  const range = computed(() => {
    const frame = frames.value.find(f => f.id === zoomedId.value)
    return frame ? { start: frame.start, end: frame.end } : total.value
  })

  /** Left offset and width in percent of the visible range; null when out of view. */
  function place(frame: FlameFrame) {
    const { start, end } = range.value
    const span = end - start || 1
    const left = Math.max(frame.start, start)
    const right = Math.min(frame.end, end)
    if (right <= left) return null
    return { left: ((left - start) / span) * 100, width: ((right - left) / span) * 100 }
  }

  /** Four evenly spaced ticks of the visible range, in ms. */
  const ticks = computed(() => {
    const { start, end } = range.value
    return [0, 0.25, 0.5, 0.75].map(p => ({ percent: p * 100, ms: start + (end - start) * p }))
  })

  const byId = computed(() => new Map(frames.value.map(f => [f.id, f])))
  const rootIds = computed(() => frames.value.filter(f => f.depth === 0).map(f => f.id))

  /** Keyboard neighbour of a frame: siblings left/right, parent up, first child down. */
  function neighbour(id: string, key: 'left' | 'right' | 'up' | 'down'): string | null {
    const frame = byId.value.get(id)
    if (!frame) return null
    if (key === 'up') return frame.parentId
    if (key === 'down') return frame.childIds[0] ?? null
    const siblings = frame.parentId ? byId.value.get(frame.parentId)!.childIds : rootIds.value
    const i = siblings.indexOf(id) + (key === 'left' ? -1 : 1)
    return siblings[i] ?? null
  }

  function zoom(id: string | null) {
    zoomedId.value = id
  }

  return { frames, byId, rootIds, total, depth, range, ticks, zoomedId, place, zoom, neighbour }
}

/** #111827 or #fff, whichever reads better on the bar colour (WCAG relative luminance). */
export function flameTextColor(hex: string | null): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? '')
  if (!m) return '#111827'
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1]!.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const lum = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
  // Contrast with #111827 (L≈0.0137) vs with white (L=1).
  return (lum + 0.05) / (0.0137 + 0.05) >= (1.05) / (lum + 0.05) ? '#111827' : '#ffffff'
}
