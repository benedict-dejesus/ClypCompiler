// ClypCompiler — project persistence layer.
// Prefers IndexedDB (large quota, ideal for courses carrying embedded assets).
// Chrome blocks IndexedDB on file:// origins, which is exactly how the offline
// desktop build runs, so this transparently falls back to localStorage. If
// both are unavailable the app still works fully in memory — the user just
// saves and opens .clypcourse files by hand.
import { get as idbGet, set as idbSet, del as idbDel, keys as idbKeys } from 'idb-keyval'

export const STORAGE_PREFIX = 'clypcourse:'

export type StorageBackend = 'indexeddb' | 'localstorage' | 'memory'

let backend: StorageBackend | null = null
const memory = new Map<string, string>()

/** Probes IndexedDB once; result is reused for the rest of the session. */
async function detectBackend(): Promise<StorageBackend> {
  if (backend) return backend
  try {
    await idbSet('__cc_probe', '1')
    await idbDel('__cc_probe')
    backend = 'indexeddb'
    return backend
  } catch {
    /* fall through */
  }
  try {
    localStorage.setItem('__cc_probe', '1')
    localStorage.removeItem('__cc_probe')
    backend = 'localstorage'
    return backend
  } catch {
    backend = 'memory'
    return backend
  }
}

export async function storageBackend(): Promise<StorageBackend> {
  return detectBackend()
}

export async function storageSet(key: string, value: string): Promise<boolean> {
  const b = await detectBackend()
  try {
    if (b === 'indexeddb') await idbSet(key, value)
    else if (b === 'localstorage') localStorage.setItem(key, value)
    else memory.set(key, value)
    return true
  } catch {
    // Most often a quota error (localStorage caps around 5 MB, which a course
    // with embedded images can exceed). Keep the in-memory copy so nothing is
    // lost in this session; the caller warns the user to save to a file.
    memory.set(key, value)
    return false
  }
}

export async function storageGet(key: string): Promise<string | undefined> {
  const b = await detectBackend()
  try {
    if (b === 'indexeddb') return (await idbGet(key)) as string | undefined
    if (b === 'localstorage') return localStorage.getItem(key) ?? memory.get(key)
    return memory.get(key)
  } catch {
    return memory.get(key)
  }
}

export async function storageDel(key: string): Promise<void> {
  const b = await detectBackend()
  memory.delete(key)
  try {
    if (b === 'indexeddb') await idbDel(key)
    else if (b === 'localstorage') localStorage.removeItem(key)
  } catch {
    /* already gone */
  }
}

export async function storageKeys(): Promise<string[]> {
  const b = await detectBackend()
  const found = new Set<string>(memory.keys())
  try {
    if (b === 'indexeddb') {
      for (const k of (await idbKeys()) as string[]) if (typeof k === 'string') found.add(k)
    } else if (b === 'localstorage') {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k) found.add(k)
      }
    }
  } catch {
    /* use whatever memory has */
  }
  return [...found].filter((k) => k.startsWith(STORAGE_PREFIX))
}
