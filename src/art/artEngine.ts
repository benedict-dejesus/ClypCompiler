// ClypCompiler — Built-in Art Engine.
// Takes the vector characters and scene backgrounds from the ported Clyp SVG
// asset library and produces high-end raster renditions: a cinematic color
// grade, soft shadows, atmosphere and film grain, rasterized at high
// resolution through an offscreen canvas. Characters keep their transparency
// (PNG) so they composite onto scene backgrounds; backgrounds bake to JPEG.
//
// Because rendering happens at compile time, ClypCompiler covers EVERY
// combination a course actually uses (role × gender × age × skin tone ×
// expression × gesture) — nothing is pre-baked, nothing is missing.
import {
  characterSvg,
  backgroundSvg,
  setArtResolver,
  ROLES,
  BACKGROUND_LIBRARY,
  DEFAULT_SPEC,
  specKey,
  type CharacterSpec
} from '../clyp/assets'
import type { Course } from '../model/course'
import { compileCourse } from '../export/compileCourse'
import type { ArtVariant, CharacterNeed, SceneNeed } from './artKeys'
import { buildPhotoIndex, resolveCharacterPhoto, resolveScenePhoto } from './photoLibrary'

export type { ArtVariant } from './artKeys'

export interface ArtAsset {
  /** Unique art key, e.g. `char|manager~male~adult~light|happy|pointing|figure`. */
  key: string
  kind: 'character' | 'background'
  label: string
  mime: 'image/png' | 'image/jpeg'
  dataUrl: string
  /** Relative file path used inside exported zips. */
  fileName: string
  /** Photographic art is framed differently from transparent vector art. */
  source?: 'photo' | 'rendered'
}

// ---------------------------------------------------------------------------
// Rasterization
// ---------------------------------------------------------------------------
function svgToImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('SVG rasterization failed'))
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
  })
}

async function rasterize(
  svg: string,
  width: number,
  height: number,
  mime: 'image/png' | 'image/jpeg',
  quality = 0.88,
  draw?: (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => void
): Promise<string> {
  const img = await svgToImage(svg)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  if (draw) draw(ctx, img)
  else ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL(mime, quality)
}

// ---------------------------------------------------------------------------
// High-end treatment wrappers
// ---------------------------------------------------------------------------
/**
 * Character treatment: a warm rim light traced around the silhouette, then the
 * figure itself with a cinematic grade and a soft contact shadow on the floor.
 * The rim pass draws the same artwork behind the graded pass, so the glow only
 * survives where it extends past the figure's edge.
 */
function enhancedCharacterSvg(inner: string): string {
  return `<svg viewBox="0 0 200 216" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cc-char-grade" x="-20%" y="-20%" width="140%" height="140%">
      <feColorMatrix type="saturate" values="1.12"/>
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude="1" exponent="0.92" offset="0"/>
        <feFuncG type="gamma" amplitude="1" exponent="0.94" offset="0"/>
        <feFuncB type="gamma" amplitude="1" exponent="0.99" offset="0"/>
      </feComponentTransfer>
      <feDropShadow dx="0" dy="3" stdDeviation="3.6" flood-color="#04222e" flood-opacity="0.34"/>
    </filter>
    <filter id="cc-char-rim" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology operator="dilate" radius="1.4" in="SourceAlpha" result="d"/>
      <feOffset in="d" dx="-1.6" dy="-1.8" result="o"/>
      <feComposite in="o" in2="SourceAlpha" operator="out" result="ring"/>
      <feGaussianBlur in="ring" stdDeviation="1.1" result="soft"/>
      <feFlood flood-color="#fff3d6" flood-opacity="0.85" result="c"/>
      <feComposite in="c" in2="soft" operator="in"/>
    </filter>
    <radialGradient id="cc-char-floor" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#04222e" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#04222e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="208" rx="70" ry="10" fill="url(#cc-char-floor)"/>
  <g filter="url(#cc-char-rim)">${inner}</g>
  <g filter="url(#cc-char-grade)">${inner}</g>
</svg>`
}

/**
 * Scene treatment: volumetric light shafts through the windows, a warm-to-cool
 * split tone, a deep vignette and a whisper of film grain.
 */
function enhancedBackgroundSvg(inner: string): string {
  const sized = inner.replace('<svg ', '<svg width="800" height="450" ')
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cc-bg-grade" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#ffd9a0" stop-opacity="0.20"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#0a3550" stop-opacity="0.22"/>
    </linearGradient>
    <radialGradient id="cc-bg-vig" cx="0.5" cy="0.44" r="0.82">
      <stop offset="0.5" stop-color="#04161f" stop-opacity="0"/>
      <stop offset="1" stop-color="#04161f" stop-opacity="0.38"/>
    </radialGradient>
    <linearGradient id="cc-bg-ray" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff6e0" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#fff6e0" stop-opacity="0"/>
    </linearGradient>
    <filter id="cc-bg-shaft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="cc-bg-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/>
    </filter>
  </defs>
  ${sized}
  <g filter="url(#cc-bg-shaft)" opacity="0.55">
    <path d="M150 -60 L300 -60 L215 340 L20 340 Z" fill="url(#cc-bg-ray)"/>
    <path d="M545 -60 L650 -60 L745 320 L590 320 Z" fill="url(#cc-bg-ray)" opacity="0.75"/>
  </g>
  <rect width="800" height="450" fill="url(#cc-bg-grade)"/>
  <rect width="800" height="450" fill="url(#cc-bg-vig)"/>
  <rect width="800" height="450" filter="url(#cc-bg-grain)" opacity="0.055"/>
</svg>`
}

// ---------------------------------------------------------------------------
// Renderers (cached)
// ---------------------------------------------------------------------------
const renderCache = new Map<string, Promise<string>>()

function cached(key: string, make: () => Promise<string>): Promise<string> {
  let hit = renderCache.get(key)
  if (!hit) {
    hit = make()
    renderCache.set(key, hit)
  }
  return hit
}

export function characterArtKey(spec: CharacterSpec, expression: string, gesture: string, variant: ArtVariant): string {
  return `char|${specKey(spec)}|${expression}|${gesture}|${variant}`
}
export function backgroundArtKey(backgroundId: string | undefined): string {
  return `bg|${backgroundId ?? 'neutral'}`
}

/**
 * Full character bust — transparent PNG at 460×497. Blocks display characters
 * at up to 136 CSS px, so this stays sharp past 3× device pixel ratio while
 * keeping packages small enough for an LMS upload.
 */
export function renderCharacterFigure(spec: CharacterSpec, expression: string, gesture: string): Promise<string> {
  return cached(characterArtKey(spec, expression, gesture, 'figure'), () =>
    rasterize(enhancedCharacterSvg(characterSvg(spec, expression, gesture)), 460, 497, 'image/png')
  )
}

/** Head-and-shoulders crop for chat avatars — transparent PNG 256×256. */
export function renderCharacterAvatar(spec: CharacterSpec, expression: string, gesture: string): Promise<string> {
  return cached(characterArtKey(spec, expression, gesture, 'avatar'), () =>
    rasterize(
      enhancedCharacterSvg(characterSvg(spec, expression, gesture)),
      256, 256, 'image/png', 0.92,
      (ctx, img) => {
        // Source viewBox is 200×216; the face sits in roughly x 44–156,
        // y 30–142. Scale so that 112 source units fill the 256px square.
        const scale = 256 / 112
        ctx.drawImage(img, -44 * scale, -30 * scale, 200 * scale, 216 * scale)
      }
    )
  )
}

/** Scene background — graded JPEG at 2× (1600×900). */
export function renderBackground(backgroundId: string | undefined): Promise<string> {
  return cached(backgroundArtKey(backgroundId), () =>
    rasterize(enhancedBackgroundSvg(backgroundSvg(backgroundId)), 1600, 900, 'image/jpeg', 0.86)
  )
}

// ---------------------------------------------------------------------------
// Course art preparation — the automated replacement pipeline
// ---------------------------------------------------------------------------
export interface PreparedArt {
  /** art key → asset (dataUrl + zip file name). */
  assets: Map<string, ArtAsset>
}

/**
 * Enumerates every character variant and scene the course actually uses, by
 * compiling it with a collecting resolver. This drives both the art renderer
 * and the "images you still need to generate" checklist.
 */
export function discoverCourseArt(course: Course): {
  characters: CharacterNeed[]
  scenes: SceneNeed[]
} {
  const chars = new Map<string, CharacterNeed>()
  const scenes = new Set<string>()

  setArtResolver({
    character: (spec, expression, gesture, variant) => {
      const k = `${specKey(spec)}|${expression}|${gesture}`
      const existing = chars.get(k)
      if (existing) existing.variants.add(variant)
      else chars.set(k, { kind: 'character', spec, expression, gesture, variants: new Set([variant]) })
      return null
    },
    background: (backgroundId) => {
      scenes.add(backgroundId ?? 'neutral')
      return null
    }
  })
  try {
    compileCourse(course, (a) => a.dataUrl)
  } finally {
    setArtResolver(null)
  }

  return {
    characters: [...chars.values()],
    scenes: [...scenes].map((backgroundId) => ({ kind: 'scene' as const, backgroundId }))
  }
}

function slugForKey(key: string): string {
  return key.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 70)
}

/**
 * Pass 1: compile the course with a collecting resolver to discover every
 * character/background variant it actually uses. Pass 2 (the real compile in
 * zip.ts) then swaps each one for its rendered image.
 */
/**
 * Prepares art for the 'photo' style: any character/scene covered by the
 * photography library uses that image; anything not yet supplied falls back to
 * the rendered art engine, so a half-finished library still exports cleanly.
 */
export async function prepareCoursePhotoArt(course: Course): Promise<PreparedArt> {
  const index = buildPhotoIndex(course.photos ?? [])
  const rendered = await prepareCourseArt(course)
  const assets = new Map(rendered.assets)

  let n = assets.size
  const { characters, scenes } = discoverCourseArt(course)

  for (const need of characters) {
    const photo = resolveCharacterPhoto(index, need.spec, need.expression, need.gesture)
    if (!photo) continue
    const ext = photo.mime === 'image/png' ? 'png' : 'jpg'
    for (const variant of need.variants) {
      const key = characterArtKey(need.spec, need.expression, need.gesture, variant)
      assets.set(key, {
        key,
        kind: 'character',
        label: `${photo.originalName} (${variant})`,
        mime: photo.mime as ArtAsset['mime'],
        source: 'photo',
        dataUrl: photo.dataUrl,
        fileName: `assets/art/${String(++n).padStart(3, '0')}-${photo.key}-${variant}.${ext}`
      })
    }
  }

  for (const scene of scenes) {
    const photo = resolveScenePhoto(index, scene.backgroundId)
    if (!photo) continue
    const ext = photo.mime === 'image/png' ? 'png' : 'jpg'
    const key = backgroundArtKey(scene.backgroundId)
    assets.set(key, {
      key,
      kind: 'background',
      label: photo.originalName,
      mime: photo.mime as ArtAsset['mime'],
      source: 'photo',
      dataUrl: photo.dataUrl,
      fileName: `assets/art/${String(++n).padStart(3, '0')}-${photo.key}.${ext}`
    })
  }

  return { assets }
}

/** Coverage summary for the photography UI. */
export function photoCoverage(course: Course): {
  characters: { need: CharacterNeed; photo: ReturnType<typeof resolveCharacterPhoto> }[]
  scenes: { need: SceneNeed; photo: ReturnType<typeof resolveScenePhoto> }[]
  filled: number
  total: number
} {
  const index = buildPhotoIndex(course.photos ?? [])
  const { characters, scenes } = discoverCourseArt(course)
  const c = characters.map((need) => ({
    need,
    photo: resolveCharacterPhoto(index, need.spec, need.expression, need.gesture)
  }))
  const s = scenes.map((need) => ({ need, photo: resolveScenePhoto(index, need.backgroundId) }))
  const filled = c.filter((x) => x.photo).length + s.filter((x) => x.photo).length
  return { characters: c, scenes: s, filled, total: c.length + s.length }
}

export async function prepareCourseArt(course: Course): Promise<PreparedArt> {
  const charKeys = new Map<string, { spec: CharacterSpec; expression: string; gesture: string; variant: ArtVariant }>()
  const bgKeys = new Set<string>()

  setArtResolver({
    character: (spec, expression, gesture, variant) => {
      charKeys.set(characterArtKey(spec, expression, gesture, variant), { spec, expression, gesture, variant })
      return null // keep SVG during the discovery pass
    },
    background: (backgroundId) => {
      bgKeys.add(backgroundId ?? 'neutral')
      return null
    }
  })
  try {
    compileCourse(course, (a) => a.dataUrl)
  } finally {
    setArtResolver(null)
  }

  const assets = new Map<string, ArtAsset>()
  let n = 0
  for (const [key, req] of charKeys) {
    n++
    const dataUrl =
      req.variant === 'avatar'
        ? await renderCharacterAvatar(req.spec, req.expression, req.gesture)
        : await renderCharacterFigure(req.spec, req.expression, req.gesture)
    assets.set(key, {
      key,
      kind: 'character',
      label: `${req.spec.role} (${req.expression}/${req.gesture})`,
      mime: 'image/png',
      dataUrl,
      fileName: `assets/art/${String(n).padStart(3, '0')}-${slugForKey(key)}.png`
    })
  }
  for (const id of bgKeys) {
    n++
    const dataUrl = await renderBackground(id)
    assets.set(backgroundArtKey(id), {
      key: backgroundArtKey(id),
      kind: 'background',
      label: `Background: ${id}`,
      mime: 'image/jpeg',
      dataUrl,
      fileName: `assets/art/${String(n).padStart(3, '0')}-${slugForKey(backgroundArtKey(id))}.jpg`
    })
  }
  return { assets }
}

/** Builds the resolver used during the real compile. */
export function artResolverFor(
  prepared: PreparedArt,
  urlFor: (asset: ArtAsset) => string
): Parameters<typeof setArtResolver>[0] {
  return {
    character: (spec, expression, gesture, variant) => {
      const asset = prepared.assets.get(characterArtKey(spec, expression, gesture, variant))
      // A photo with real transparency is a cut-out, so it needs no framing.
      return asset
        ? { src: urlFor(asset), photo: asset.source === 'photo' && asset.mime !== 'image/png' }
        : null
    },
    background: (backgroundId) => {
      const asset = prepared.assets.get(backgroundArtKey(backgroundId))
      return asset ? { src: urlFor(asset), photo: asset.source === 'photo' } : null
    }
  }
}

// ---------------------------------------------------------------------------
// Built-in library gallery (Assets panel)
// ---------------------------------------------------------------------------
export interface GalleryEntry {
  id: string
  label: string
  kind: 'character' | 'background'
  make: () => Promise<string>
  mime: 'image/png' | 'image/jpeg'
}

export function builtinGallery(): GalleryEntry[] {
  const chars: GalleryEntry[] = []
  for (const role of ROLES) {
    for (const gender of ['female', 'male'] as const) {
      const spec: CharacterSpec = { ...DEFAULT_SPEC, role: role.id, gender }
      chars.push({
        id: `char-${role.id}-${gender}`,
        label: `${role.label} (${gender})`,
        kind: 'character',
        mime: 'image/png',
        make: () => renderCharacterFigure(spec, 'confident', 'explaining')
      })
    }
  }
  const bgs: GalleryEntry[] = BACKGROUND_LIBRARY.map((b) => ({
    id: `bg-${b.id}`,
    label: b.label,
    kind: 'background' as const,
    mime: 'image/jpeg' as const,
    make: () => renderBackground(b.id)
  }))
  return [...chars, ...bgs]
}
