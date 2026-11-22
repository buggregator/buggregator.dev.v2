// Run: npm run test:footer (node --test). Footer «catch the bug» easter egg:
// what the notice says after each click on the logo.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bugCatchToast, BUG_CATCH_FINAL, FOOTER_RESOURCES, footerCommunity } from '../app/data/footer.ts'

test('no notice before the first catch', () => {
  assert.equal(bugCatchToast(0), null)
})

test('the first catches report one event each, on the next line', () => {
  assert.deepEqual(bugCatchToast(1), { kind: 'caught', count: 1, line: 41 })
  assert.deepEqual(bugCatchToast(2), { kind: 'caught', count: 2, line: 42 })
})

test('the third catch ends the joke and stays there', () => {
  assert.equal(BUG_CATCH_FINAL, 3)
  assert.deepEqual(bugCatchToast(3), { kind: 'final', count: 3, line: 42 })
  assert.deepEqual(bugCatchToast(7), { kind: 'final', count: 3, line: 42 })
})

test('Tips and Releases sit in Resources; Sponsors is a page of this site in every language', () => {
  const labels = FOOTER_RESOURCES.map(l => l.label)
  assert.ok(labels.includes('footer.links.tips'))
  assert.ok(labels.includes('footer.links.releases'))
  const sponsors = footerCommunity('https://discord.gg/x').find(l => l.label === 'footer.links.sponsors')
  assert.deepEqual(sponsors, { label: 'footer.links.sponsors', to: '/sponsors', localized: true })
})
