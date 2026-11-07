/**
 * The standalone server binary: install commands per OS, OS detection.
 * One home for every «Binary» sample on the site (hero, Get started, feature
 * pages), so a changed command or size is edited here only.
 *
 * Install goes through the server's scripts (scripts/install.sh, install.ps1,
 * from v2.6.0): they pick the file for the OS and CPU and check it against the
 * release's checksums.txt. So the picker offers the OS family only.
 *
 * The run line binds every listener to 127.0.0.1, like the Docker samples
 * publish on 127.0.0.1 only: the binary listens on all interfaces by default.
 */

export type BinaryOs = 'unix' | 'windows'

/** Size of the largest release file (macOS Intel, 40.1 MB in v2.6.0), in MB. */
export const BINARY_SIZE_MB = 40

/** Picker buttons, in order. */
export const BINARY_OSES: ReadonlyArray<{ id: BinaryOs; label: string }> = [
  { id: 'unix', label: 'Linux / macOS' },
  { id: 'windows', label: 'Windows' },
]

export const DEFAULT_BINARY_OS: BinaryOs = 'unix'

const SCRIPTS_BASE = 'https://raw.githubusercontent.com/buggregator/server/master/scripts/'

/** All release files, for people who do not pipe scripts into a shell. */
export const BINARY_RELEASES_URL = 'https://github.com/buggregator/server/releases/latest'

/** Docs section on the bind address (#only-on-this-computer). */
export const BINARY_LOCAL_ONLY_URL = 'https://docs.buggregator.dev/getting-started.html#only-on-this-computer'

/** Where install.ps1 puts the binary; it does not add the folder to PATH. */
const WINDOWS_EXE = '"$env:LOCALAPPDATA\\Programs\\buggregator\\buggregator.exe"'

/** Listeners bound to 127.0.0.1 in every run line. VarDumper is not in the Windows build. */
const LOCAL_BINDS: ReadonlyArray<{ env: string; port: number; windows: boolean }> = [
  { env: 'HTTP_ADDR', port: 8000, windows: true },
  { env: 'SMTP_ADDR', port: 1025, windows: true },
  { env: 'VAR_DUMPER_ADDR', port: 9912, windows: false },
  { env: 'MONOLOG_ADDR', port: 9913, windows: true },
  { env: 'PROXY_ADDR', port: 8080, windows: true },
]

/** The one command that installs the binary (the hero shows only this). */
export function binaryInstallCommand(os: BinaryOs): string {
  return os === 'windows'
    ? `irm ${SCRIPTS_BASE}install.ps1 | iex`
    : `curl -fsSL ${SCRIPTS_BASE}install.sh | sh`
}

/**
 * Install, then start it on 127.0.0.1: one entry per command as it is shown
 * (no prompt). A shell line continued with «\» stays one entry with newlines
 * inside. Copy joins the entries with newlines.
 */
export function binaryCommands(os: BinaryOs): string[] {
  if (os === 'windows') {
    return [
      binaryInstallCommand(os),
      ...LOCAL_BINDS.filter(b => b.windows).map(b => `$env:${b.env} = "127.0.0.1:${b.port}"`),
      `& ${WINDOWS_EXE}`,
    ]
  }
  const binds = LOCAL_BINDS.map(b => `${b.env}=127.0.0.1:${b.port}`)
  return [binaryInstallCommand(os), [...binds, 'buggregator'].join(' \\\n  ')]
}

/** Prompt shown before each command: PowerShell on Windows, sh elsewhere. */
export function binaryPrompt(os: BinaryOs): string {
  return os === 'windows' ? 'PS>' : '$'
}

/** Best guess of the visitor's OS family from the browser. */
export function detectBinaryOs(userAgent: string, platformHint = ''): BinaryOs {
  const ua = `${platformHint} ${userAgent}`.toLowerCase()
  return ua.includes('windows') || ua.includes('win32') || ua.includes('win64') ? 'windows' : 'unix'
}

/**
 * The selected OS, shared by every binary sample on the page. The server
 * renders the default; the visitor's OS is applied after mount, so server
 * and client HTML match on hydration.
 */
export function useBinaryPlatform() {
  const os = useState<BinaryOs>('binary-os', () => DEFAULT_BINARY_OS)
  const detected = useState<boolean>('binary-os-detected', () => false)

  onMounted(() => {
    if (detected.value) return
    detected.value = true
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
    os.value = detectBinaryOs(nav.userAgent, nav.userAgentData?.platform ?? '')
  })

  const commands = computed(() => binaryCommands(os.value))
  const installCommand = computed(() => binaryInstallCommand(os.value))
  const prompt = computed(() => binaryPrompt(os.value))
  const copyText = computed(() => commands.value.join('\n'))

  return { os, commands, installCommand, prompt, copyText }
}
