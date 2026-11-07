/**
 * The standalone server binary: platforms, download commands, OS detection.
 * One home for every «Binary» sample on the site (hero, Get started, feature
 * pages), so a new asset or a changed command is edited here only.
 *
 * Samples bind every listener to 127.0.0.1, like the Docker samples publish
 * on 127.0.0.1 only: the binary listens on all interfaces by default.
 */

export type BinaryPlatformId =
  | 'linux-amd64'
  | 'linux-arm64'
  | 'darwin-arm64'
  | 'darwin-amd64'
  | 'windows-amd64'
  | 'windows-arm64'

export type BinaryOs = 'linux' | 'macos' | 'windows'

export interface BinaryPlatform {
  id: BinaryPlatformId
  os: BinaryOs
  /** Full label, e.g. analytics and screen readers. */
  label: string
  /** Second-row label in the picker. */
  arch: string
  /** Release asset name under releases/latest/download/. */
  asset: string
  /** Asset size in MiB (as GitHub shows it), measured on release v2.6.0; null hides it. */
  sizeMb: number | null
}

export const BINARY_PLATFORMS: readonly BinaryPlatform[] = [
  { id: 'linux-amd64', os: 'linux', label: 'Linux x86-64', arch: 'x86-64', asset: 'buggregator-linux-amd64', sizeMb: 35 },
  { id: 'linux-arm64', os: 'linux', label: 'Linux ARM', arch: 'ARM', asset: 'buggregator-linux-arm64', sizeMb: 35 },
  { id: 'darwin-arm64', os: 'macos', label: 'macOS Apple Silicon', arch: 'Apple Silicon', asset: 'buggregator-darwin-arm64', sizeMb: 37 },
  { id: 'darwin-amd64', os: 'macos', label: 'macOS Intel', arch: 'Intel', asset: 'buggregator-darwin-amd64', sizeMb: 38 },
  { id: 'windows-amd64', os: 'windows', label: 'Windows x86-64', arch: 'x86-64', asset: 'buggregator-windows-amd64.exe', sizeMb: 24 },
  { id: 'windows-arm64', os: 'windows', label: 'Windows ARM', arch: 'ARM', asset: 'buggregator-windows-arm64.exe', sizeMb: 22 },
]

/** First row of the picker, in order; the first build of an OS is its default. */
export const BINARY_OSES: ReadonlyArray<{ id: BinaryOs; label: string }> = [
  { id: 'linux', label: 'Linux' },
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
]

export function defaultPlatformFor(os: BinaryOs): BinaryPlatformId {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return BINARY_PLATFORMS.find(p => p.os === os)!.id
}

export const DEFAULT_BINARY_PLATFORM: BinaryPlatformId = 'linux-amd64'

const DOWNLOAD_BASE = 'https://github.com/buggregator/server/releases/latest/download/'

/** Listeners bound to 127.0.0.1 in every sample. VarDumper is not in the Windows build. */
const LOCAL_BINDS: ReadonlyArray<{ env: string; port: number; windows: boolean }> = [
  { env: 'HTTP_ADDR', port: 8000, windows: true },
  { env: 'SMTP_ADDR', port: 1025, windows: true },
  { env: 'VAR_DUMPER_ADDR', port: 9912, windows: false },
  { env: 'MONOLOG_ADDR', port: 9913, windows: true },
  { env: 'PROXY_ADDR', port: 8080, windows: true },
]

export function findBinaryPlatform(id: BinaryPlatformId): BinaryPlatform {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return BINARY_PLATFORMS.find(p => p.id === id) ?? BINARY_PLATFORMS[0]!
}

export function binaryDownloadUrl(platform: BinaryPlatform): string {
  return DOWNLOAD_BASE + platform.asset
}

/**
 * The commands to download and start the binary, one entry per command as it
 * is shown (no prompt). A shell line continued with «\» stays one entry with
 * newlines inside. Copy joins the entries with newlines.
 */
export function binaryCommands(platform: BinaryPlatform): string[] {
  const url = binaryDownloadUrl(platform)
  if (platform.os === 'windows') {
    return [
      // Windows PowerShell 5.1 draws a progress bar that slows the download to minutes.
      "$ProgressPreference = 'SilentlyContinue'",
      `Invoke-WebRequest ${url} -OutFile buggregator.exe`,
      ...LOCAL_BINDS.filter(b => b.windows).map(b => `$env:${b.env} = "127.0.0.1:${b.port}"`),
      '.\\buggregator.exe',
    ]
  }
  const binds = LOCAL_BINDS.map(b => `${b.env}=127.0.0.1:${b.port}`)
  return [
    `curl -fsSL -o buggregator ${url}`,
    'chmod +x buggregator',
    [...binds, './buggregator'].join(' \\\n  '),
  ]
}

/** Prompt shown before each command: PowerShell on Windows, sh elsewhere. */
export function binaryPrompt(platform: BinaryPlatform): string {
  return platform.os === 'windows' ? 'PS>' : '$'
}

/**
 * Best guess of the visitor's platform from the browser. macOS defaults to
 * Apple Silicon: a browser on an Intel Mac reports the same user agent, and
 * Apple stopped selling Intel Macs in 2023. Windows defaults to x86-64: a
 * browser on Windows ARM reports x64 too, and x64 builds run there emulated.
 */
export function detectBinaryPlatform(userAgent: string, platformHint = ''): BinaryPlatformId {
  const ua = `${platformHint} ${userAgent}`.toLowerCase()
  if (ua.includes('windows') || ua.includes('win32') || ua.includes('win64')) return 'windows-amd64'
  if (ua.includes('mac') && !ua.includes('iphone') && !ua.includes('ipad')) return 'darwin-arm64'
  if (ua.includes('linux') && !ua.includes('android')) {
    return ua.includes('aarch64') || ua.includes('arm64') ? 'linux-arm64' : 'linux-amd64'
  }
  return DEFAULT_BINARY_PLATFORM
}

/**
 * The selected platform, shared by every binary sample on the page. The
 * server renders the default; the visitor's OS is applied after mount, so
 * server and client HTML match on hydration.
 */
export function useBinaryPlatform() {
  const selected = useState<BinaryPlatformId>('binary-platform', () => DEFAULT_BINARY_PLATFORM)
  const detected = useState<boolean>('binary-platform-detected', () => false)

  onMounted(() => {
    if (detected.value) return
    detected.value = true
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
    selected.value = detectBinaryPlatform(nav.userAgent, nav.userAgentData?.platform ?? '')
  })

  const platform = computed(() => findBinaryPlatform(selected.value))
  const commands = computed(() => binaryCommands(platform.value))
  const prompt = computed(() => binaryPrompt(platform.value))
  const copyText = computed(() => commands.value.join('\n'))

  // Builds of the selected OS: the second row of the picker.
  const archOptions = computed(() => BINARY_PLATFORMS.filter(p => p.os === platform.value.os))
  const selectOs = (os: BinaryOs) => {
    if (platform.value.os !== os) selected.value = defaultPlatformFor(os)
  }

  return { selected, platform, commands, prompt, copyText, archOptions, selectOs }
}
