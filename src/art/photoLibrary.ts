// ClypCompiler — bring-your-own photography library.
// You generate images in whatever tool you like, name them by the convention
// in artKeys.ts, and drop the folder in. This module ingests them (downscaling
// so a course stays a manageable size), then resolves each character/scene the
// compiler asks for against the library, falling back through progressively
// less specific filenames.
import type { CharacterSpec } from '../clyp/assets'
import { characterFileCandidates, sceneFileBase, normalizeFileKey } from './artKeys'

export interface PhotoAsset {
  id: string
  /** Normalized filename key, e.g. char__manager__female__adult__light__happy */
  key: string
  /** Original filename as dropped, for display. */
  originalName: string
  kind: 'character' | 'scene' | 'unmatched'
  mime: string
  dataUrl: string
  width: number
  height: number
  /** True when the source had an alpha channel (cut-out character art). */
  hasAlpha: boolean
  addedDate: string
}

// Ingest limits. Photoreal source images are often 2–8 MP; a course carrying
// dozens of them would blow past browser storage and make exports unwieldy.
const MAX_CHARACTER_HEIGHT = 1100
const MAX_SCENE_WIDTH = 1920
const JPEG_QUALITY = 0.86

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image file.'))
    img.src = dataUrl
  })
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('Could not read that file.'))
    r.readAsDataURL(file)
  })
}

/** Samples the alpha channel to decide whether the image is a cut-out. */
function detectAlpha(img: HTMLImageElement): boolean {
  const c = document.createElement('canvas')
  const w = (c.width = Math.min(img.naturalWidth, 80))
  const h = (c.height = Math.min(img.naturalHeight, 80))
  const ctx = c.getContext('2d')!
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) return true
  }
  return false
}

export interface IngestResult {
  ok: boolean
  asset?: PhotoAsset
  fileName: string
  error?: string
}

/**
 * Ingests one dropped file: works out whether it is a character or a scene from
 * its filename, downscales it, and preserves transparency when present.
 */
export async function ingestPhoto(file: File): Promise<IngestResult> {
  const fileName = file.name
  if (!file.type.startsWith('image/')) {
    return { ok: false, fileName, error: 'Not an image file.' }
  }
  const key = normalizeFileKey(fileName)
  const kind: PhotoAsset['kind'] = key.startsWith('char__')
    ? 'character'
    : key.startsWith('scene__')
      ? 'scene'
      : 'unmatched'
  if (kind === 'unmatched') {
    return {
      ok: false,
      fileName,
      error: 'Filename must start with char__ or scene__ (see the image brief).'
    }
  }

  try {
    const raw = await readAsDataUrl(file)
    const img = await loadImage(raw)
    const hasAlpha = file.type === 'image/png' || file.type === 'image/webp' ? detectAlpha(img) : false

    // Scale to the working ceiling for its kind.
    const maxW = kind === 'scene' ? MAX_SCENE_WIDTH : Infinity
    const maxH = kind === 'character' ? MAX_CHARACTER_HEIGHT : Infinity
    const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight)
    const w = Math.round(img.naturalWidth * scale)
    const h = Math.round(img.naturalHeight * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, w, h)

    // Transparency must survive, so cut-outs stay PNG; everything else becomes
    // JPEG, which is dramatically smaller for photographic content.
    const outMime = hasAlpha ? 'image/png' : 'image/jpeg'
    const dataUrl = canvas.toDataURL(outMime, JPEG_QUALITY)

    return {
      ok: true,
      fileName,
      asset: {
        id: crypto.randomUUID(),
        key,
        originalName: fileName,
        kind,
        mime: outMime,
        dataUrl,
        width: w,
        height: h,
        hasAlpha,
        addedDate: new Date().toISOString()
      }
    }
  } catch (err) {
    return { ok: false, fileName, error: err instanceof Error ? err.message : 'Could not process image.' }
  }
}

// ---------------------------------------------------------------------------
// Resolution
// ---------------------------------------------------------------------------
export interface PhotoIndex {
  byKey: Map<string, PhotoAsset>
}

export function buildPhotoIndex(photos: PhotoAsset[]): PhotoIndex {
  const byKey = new Map<string, PhotoAsset>()
  // Later entries win, so re-dropping a file replaces the previous version.
  for (const p of photos) byKey.set(p.key, p)
  return { byKey }
}

/** Most specific match wins; returns null when nothing in the library fits. */
export function resolveCharacterPhoto(
  index: PhotoIndex,
  spec: CharacterSpec,
  expression: string,
  gesture: string
): PhotoAsset | null {
  for (const candidate of characterFileCandidates(spec, expression, gesture)) {
    const hit = index.byKey.get(candidate)
    if (hit) return hit
  }
  return null
}

export function resolveScenePhoto(index: PhotoIndex, backgroundId: string | undefined): PhotoAsset | null {
  return index.byKey.get(sceneFileBase(backgroundId ?? 'neutral')) ?? null
}

/** Rough byte size of the stored library, for the size warning in the UI. */
export function photoLibraryBytes(photos: PhotoAsset[]): number {
  return photos.reduce((n, p) => n + p.dataUrl.length * 0.75, 0)
}
