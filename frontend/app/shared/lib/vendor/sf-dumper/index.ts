
import { SfdumpWrap } from './dumper.js'

let dump: ((id: string) => void) | null = null

export const callSfDump = (dumpId: string) => {
  if (typeof window === 'undefined') return
  if (!dump) {
    dump = SfdumpWrap(window.document)
  }
  dump(dumpId)
}
