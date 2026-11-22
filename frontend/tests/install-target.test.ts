// Run: npm run test:install (node --test). Hero install box: which tab a
// browser gets, and the two lines each binary tab shows.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  detectInstallTarget, binaryOsOf, binaryOneLiners, binaryCommands,
} from '../app/composables/useServerBinary.ts'

const UA = {
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
  linux: 'Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  chromeos: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
}

test('desktop browsers get their own OS tab', () => {
  assert.equal(detectInstallTarget(UA.mac), 'macos')
  assert.equal(detectInstallTarget(UA.win), 'windows')
  assert.equal(detectInstallTarget(UA.linux), 'linux')
  assert.equal(detectInstallTarget('', 'Windows'), 'windows')
})

test('phones, tablets, ChromeOS and unknown browsers get Docker', () => {
  assert.equal(detectInstallTarget(UA.android), 'docker')
  assert.equal(detectInstallTarget(UA.iphone), 'docker')
  assert.equal(detectInstallTarget(UA.chromeos), 'docker')
  assert.equal(detectInstallTarget(UA.mac, '', 5), 'docker', 'iPad in desktop mode')
  assert.equal(detectInstallTarget('SomeBot/1.0'), 'docker')
})

test('each tab maps to the binary OS family, Docker to none', () => {
  assert.equal(binaryOsOf('macos'), 'unix')
  assert.equal(binaryOsOf('linux'), 'unix')
  assert.equal(binaryOsOf('windows'), 'windows')
  assert.equal(binaryOsOf('docker'), null)
})

test('binary tabs show install + start, start bound to 127.0.0.1 on one line', () => {
  for (const os of ['unix', 'windows'] as const) {
    const lines = binaryOneLiners(os)
    assert.equal(lines.length, 2)
    assert.equal(lines[0], binaryCommands(os)[0], 'same install command as Get started')
    assert.ok(!lines[1].includes('\n'))
    assert.match(lines[1], /HTTP_ADDR="?127\.0\.0\.1:8000/)
  }
  assert.match(binaryOneLiners('unix')[1], / ~\/\.local\/bin\/buggregator$/)
  assert.doesNotMatch(binaryOneLiners('windows')[1], /VAR_DUMPER/)
  assert.match(binaryOneLiners('windows')[1], /; & "\$env:LOCALAPPDATA\\Programs\\buggregator\\buggregator\.exe"$/)
})
