// ClypCompiler — export packaging.
// Both exports produce a zip whose extracted index.html is a complete,
// standalone e-learning course (no LMS, no server, no network required).
// The SCORM variant adds imsmanifest.xml so any SCORM 1.2 LMS can import it.
import JSZip from 'jszip'
import type { Course, AssetItem } from '../model/course'
import { compileCourse, type CourseCompileResult } from './compileCourse'
import { buildCourseHtml } from './runtime'
import { buildScormManifest } from './scorm'
import { setArtResolver } from '../clyp/assets'
import { prepareCourseArt, artResolverFor, type PreparedArt, type ArtAsset } from '../art/artEngine'

/**
 * Renders every character/background variant the course uses (art style
 * 'rendered'), or returns null to keep Clyp's original inline SVG art.
 * Failures degrade gracefully to SVG — an export never breaks over art.
 */
async function prepareArtIfEnabled(course: Course): Promise<PreparedArt | null> {
  if ((course.artStyle ?? 'rendered') !== 'rendered') return null
  try {
    return await prepareCourseArt(course)
  } catch {
    return null
  }
}

export type ExportKind = 'scorm' | 'html5'

export interface ExportResult {
  ok: boolean
  problems?: CourseCompileResult['problems']
  blob?: Blob
  fileName?: string
}

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/avif': 'avif'
}

function assetExt(a: AssetItem): string {
  if (MIME_EXT[a.mime]) return MIME_EXT[a.mime]
  const m = a.name.match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toLowerCase() : 'bin'
}

/** Stable in-zip path for each uploaded asset. */
export function assetPathMap(course: Course): Map<string, string> {
  const map = new Map<string, string>()
  course.assets.forEach((a, i) => {
    map.set(a.id, `assets/asset-${String(i + 1).padStart(3, '0')}.${assetExt(a)}`)
  })
  return map
}

function dataUrlBytes(dataUrl: string): Uint8Array {
  const comma = dataUrl.indexOf(',')
  const meta = dataUrl.slice(0, comma)
  const payload = dataUrl.slice(comma + 1)
  if (/;base64$/i.test(meta)) {
    const bin = atob(payload)
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
    return out
  }
  return new TextEncoder().encode(decodeURIComponent(payload))
}

function slug(s: string): string {
  return (
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'course'
  )
}

/** Only assets actually referenced by an override are packaged. */
function usedAssetIds(course: Course): Set<string> {
  const used = new Set<string>()
  for (const b of Object.values(course.blocks)) {
    for (const o of b.assetOverrides) used.add(o.assetId)
  }
  return used
}

export async function exportCourseZip(course: Course, kind: ExportKind): Promise<ExportResult> {
  const paths = assetPathMap(course)
  const art = await prepareArtIfEnabled(course)
  if (art) setArtResolver(artResolverFor(art, (a: ArtAsset) => a.fileName))
  let compiled
  try {
    compiled = compileCourse(course, (a) => paths.get(a.id) ?? '')
  } finally {
    setArtResolver(null)
  }
  if (!compiled.ok) {
    return { ok: false, problems: compiled.problems }
  }
  const html = buildCourseHtml(course, compiled.lessons)

  const zip = new JSZip()
  zip.file('index.html', html)

  const used = usedAssetIds(course)
  const packagedPaths: string[] = []
  for (const asset of course.assets) {
    if (!used.has(asset.id)) continue
    const path = paths.get(asset.id)
    if (!path) continue
    zip.file(path, dataUrlBytes(asset.dataUrl))
    packagedPaths.push(path)
  }
  if (art) {
    // Only art actually referenced by the compiled HTML gets packaged.
    for (const a of art.assets.values()) {
      if (!html.includes(a.fileName)) continue
      zip.file(a.fileName, dataUrlBytes(a.dataUrl))
      packagedPaths.push(a.fileName)
    }
  }

  if (kind === 'scorm') {
    zip.file('imsmanifest.xml', buildScormManifest(course, packagedPaths))
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })
  const suffix = kind === 'scorm' ? 'scorm12' : 'html5'
  return {
    ok: true,
    blob,
    fileName: `${slug(course.meta.title)}-${suffix}.zip`
  }
}

/** Compiles the course for the in-app player preview (assets stay data: URLs). */
export async function buildPreviewHtml(course: Course): Promise<{ ok: boolean; html?: string; problems?: CourseCompileResult['problems'] }> {
  const art = await prepareArtIfEnabled(course)
  if (art) setArtResolver(artResolverFor(art, (a: ArtAsset) => a.dataUrl))
  let compiled
  try {
    compiled = compileCourse(course, (a) => a.dataUrl)
  } finally {
    setArtResolver(null)
  }
  if (!compiled.ok) return { ok: false, problems: compiled.problems }
  return { ok: true, html: buildCourseHtml(course, compiled.lessons) }
}

/** Triggers a browser download for a generated file. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export function downloadText(text: string, fileName: string, mime = 'application/json'): void {
  downloadBlob(new Blob([text], { type: mime }), fileName)
}
