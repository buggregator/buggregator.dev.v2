// Run: npm run test:xray (node --test). The hero X-ray beetle (#6838): the
// pure math behind the lens — where the picture lies, where the lens goes.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  BUG, IMG, REST_TAIL, autoPoint, coverRect, easeFactor, keyStep, readout, readoutHidden, restPoint, ringTicks,
} from '../app/data/xray.ts'

const root = join(import.meta.dirname, '..')
const near = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`)

test('coverRect covers the stage like object-fit: cover with the given object-position', () => {
  // wider than the picture: the width decides, the extra height is cut at 47% / 53%
  const wide = coverRect(1440, 700, { x: 0.51, y: 0.47 })
  near(wide.s, 1440 / IMG.w)
  near(wide.l, 0)
  near(wide.t, (700 - IMG.h * wide.s) * 0.47)
  assert.ok(wide.t <= 0 && wide.t + wide.h >= 700)
  // taller: the height decides
  const tall = coverRect(800, 900, { x: 0.51, y: 0.47 })
  near(tall.s, 900 / IMG.h)
  near(tall.t, 0)
  near(tall.l, (800 - IMG.w * tall.s) * 0.51)
  assert.ok(tall.l <= 0 && tall.l + tall.w >= 800)
})

test('the auto scan stays on the body and passes from head to tail', () => {
  const r = coverRect(1440, 860, { x: 0.51, y: 0.47 })
  const xs: number[] = []
  for (let t = 0; t < 20; t += 0.1) {
    const p = autoPoint(t, r)
    const ix = (p.x - r.l) / r.s
    const iy = (p.y - r.t) / r.s
    assert.ok(Math.abs(ix - BUG.x) <= BUG.rx * 0.72 + 0.5, `x ${ix}`)
    assert.ok(Math.abs(iy - BUG.y) <= BUG.ry * 0.45 + 0.5, `y ${iy}`)
    xs.push(ix)
  }
  assert.ok(Math.min(...xs) < BUG.x - BUG.rx * 0.6 && Math.max(...xs) > BUG.x + BUG.rx * 0.6)
})

test('with reduced motion the lens rests right of the copy, on the body', () => {
  const r = coverRect(1440, 860, { x: 0.51, y: 0.47 })
  const p = restPoint(r, 1000, 160)
  assert.ok(p.x >= 1000 + 160 * 0.55 - 0.01, 'clear of the copy')
  assert.ok(p.x <= r.l + (BUG.x + BUG.rx * REST_TAIL) * r.s + 0.01, 'still on the tail')
  near(p.y, r.t + BUG.y * r.s)
  // a narrow copy: the lens still never leaves the body for the empty right edge
  const q = restPoint(r, 200, 160)
  assert.ok(q.x >= r.l + BUG.x * r.s - 0.01)
})

test('the readout names the picture pixel under the cross', () => {
  const r = coverRect(1672, 941, { x: 0.5, y: 0.5 })
  assert.equal(readout(857, 445, r), 'X 0857  Y 0445  ·  SCAN')
  const half = coverRect(836, 470.5, { x: 0.5, y: 0.5 })
  assert.equal(readout(428.5, 222.5, half), 'X 0857  Y 0445  ·  SCAN')
})

test('the readout hides over the copy and at the right edge', () => {
  const copy = { l: 400, t: 200, r: 1040, b: 640 }
  assert.equal(readoutHidden(40, 500, 160, 1440, copy), false, 'left of the copy')
  assert.equal(readoutHidden(300, 400, 160, 1440, copy), true, 'runs into the copy')
  assert.equal(readoutHidden(1300, 400, 160, 1440, copy), true, 'off the right edge')
})

test('easing does not depend on the frame rate; reduced motion jumps', () => {
  const at60 = 1 - (1 - easeFactor(16.67, false)) ** 2
  near(at60, easeFactor(33.34, false), 1e-6)
  assert.equal(easeFactor(16.67, true), 1)
})

test('arrow keys move the lens, Shift moves it further, other keys do nothing', () => {
  assert.deepEqual(keyStep('ArrowLeft', false), [-24, 0])
  assert.deepEqual(keyStep('ArrowDown', true), [0, 64])
  assert.equal(keyStep('Enter', false), null)
})

test('the ring has 72 ticks, every sixth long', () => {
  const ticks = ringTicks(160)
  assert.equal(ticks.length, 72)
  assert.equal(ticks.filter(t => t.long).length, 12)
})

test('every picture the hero asks for is on disk', () => {
  const vue = readFileSync(join(root, 'app/components/sections/HeroSection/HeroXray.vue'), 'utf8')
  const files = [...new Set([...vue.matchAll(/(?:closed|xray)-\d+\.(?:webp|avif)/g)].map(m => m[0]))].sort()
  assert.deepEqual(files, [
    'closed-1672.avif', 'closed-1672.webp', 'closed-960.avif', 'closed-960.webp',
    'xray-1672.avif', 'xray-1672.webp', 'xray-960.avif', 'xray-960.webp',
  ])
  for (const f of files) assert.ok(existsSync(join(root, 'public/img/xray-hero', f)), f)
})

test('the hero hint speaks en, ru and es', () => {
  for (const code of ['en', 'ru', 'es']) {
    const l = JSON.parse(readFileSync(join(root, 'i18n/locales', `${code}.json`), 'utf8'))
    for (const key of ['label', 'hintPointer', 'hintTouch', 'hintStill']) {
      assert.ok(l.hero?.xray?.[key], `${code}: hero.xray.${key}`)
    }
  }
})
