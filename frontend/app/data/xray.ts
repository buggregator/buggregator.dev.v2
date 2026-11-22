// The hero X-ray beetle (#6838): the pure math behind the lens. No DOM here,
// so node --test covers it (tests/xray.test.ts). Coordinates are stage px
// unless named «image px».

// The owner's originals (both layers aligned to this size).
export const IMG = { w: 1672, h: 941 } as const
// The beetle's body in image px: centre and half-axes, head tip to tail.
export const BUG = { x: 857, y: 445, rx: 650, ry: 250 } as const

// Where the picture lies on the stage: left, top, width, height, scale.
export type Rect = { l: number, t: number, w: number, h: number, s: number }
export type Point = { x: number, y: number }
export type Box = { l: number, t: number, r: number, b: number }

// The same placement as CSS `object-fit: cover; object-position: x% y%`
// (pos as fractions), so the lens image lines up with the CSS-placed base.
export function coverRect(sw: number, sh: number, pos: Point): Rect {
  const s = Math.max(sw / IMG.w, sh / IMG.h)
  const w = IMG.w * s
  const h = IMG.h * s
  return { l: (sw - w) * pos.x, t: (sh - h) * pos.y, w, h, s }
}

// Idle (no pointer, or 2 s without input): a slow pass along the body, head
// to tail and back, with a gentle sway across it. t in seconds.
export function autoPoint(t: number, r: Rect): Point {
  return {
    x: r.l + (BUG.x + Math.sin(t * 0.32) * BUG.rx * 0.72) * r.s,
    y: r.t + (BUG.y + Math.sin(t * 0.64) * BUG.ry * 0.45) * r.s,
  }
}

// Reduced motion: the lens rests on the wing cases right of the copy (as far
// from the text as the body allows: never past the tail end, never left of
// the body's centre).
export const REST_TAIL = 0.85
export function restPoint(r: Rect, copyRight: number, lensR: number): Point {
  const centre = r.l + BUG.x * r.s
  const tail = r.l + (BUG.x + BUG.rx * REST_TAIL) * r.s
  return { x: Math.min(tail, Math.max(centre, copyRight + lensR * 0.55)), y: r.t + BUG.y * r.s }
}

// The HUD line next to the ring: the image pixel under the cross.
export function readout(x: number, y: number, r: Rect): string {
  const pad = (n: number) => String(Math.round(n)).padStart(4, '0')
  return `X ${pad((x - r.l) / r.s)}  Y ${pad((y - r.t) / r.s)}  ·  SCAN`
}

// The readout sits up-right of the ring; it hides while it would cross the
// copy or run off the stage's right edge.
const RD_W = 190
export function readoutHidden(x: number, y: number, lensR: number, stageW: number, copy: Box | null): boolean {
  const rx = x + lensR * 0.72 + 4
  const ry = y - lensR * 0.72 - 18
  if (rx + RD_W + 10 > stageW) return true
  return !!copy && rx < copy.r + 8 && rx + RD_W > copy.l - 8 && ry < copy.b && ry + 14 > copy.t
}

// How far the lens closes on its target this frame: the same speed at any
// frame rate. Reduced motion jumps at once.
export function easeFactor(dtMs: number, reduced: boolean): number {
  return reduced ? 1 : 1 - Math.pow(1 - 0.16, dtMs / 16.67)
}

// Arrow keys on the focused hero: [dx, dy] in px, or null for other keys.
export function keyStep(key: string, shift: boolean): [number, number] | null {
  const d = shift ? 64 : 24
  const steps: Record<string, [number, number]> = {
    ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, -d], ArrowDown: [0, d],
  }
  return steps[key] ?? null
}

// The ring's scale: 72 ticks around the lens, every sixth long. Coordinates
// in a (r + 14) * 2 square SVG.
export type Tick = { x1: number, y1: number, x2: number, y2: number, long: boolean }
export function ringTicks(r: number): Tick[] {
  const c = r + 14
  const round = (n: number) => Math.round(n * 100) / 100
  return Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2
    const long = i % 6 === 0
    const r1 = r + 3
    const r2 = r + (long ? 13 : 7)
    return {
      x1: round(c + Math.cos(a) * r1), y1: round(c + Math.sin(a) * r1),
      x2: round(c + Math.cos(a) * r2), y2: round(c + Math.sin(a) * r2),
      long,
    }
  })
}
