// ClypCompiler — Assets Library support.
// A "slot" is a replaceable visual inside a compiled block: any <img>, or any
// outermost <svg> (the SVG graphics Clyp generates as placeholders, character
// art, scene backgrounds and charts). Slots are indexed in document order so an
// AssetOverride can target them stably for a given .clyp source.
import type { AssetItem, AssetOverride } from '../model/course'

export interface AssetSlot {
  slotIndex: number
  tag: 'svg' | 'img'
  /** Short human description, e.g. `svg .clyp-sc-bg (background)` */
  label: string
  /** Serialized markup preview (truncated) for identification in the UI. */
  preview: string
}

function outermostVisuals(root: ParentNode): Element[] {
  const all = Array.from(root.querySelectorAll('svg, img'))
  return all.filter((el) => {
    const parent = el.parentElement
    return !(parent && parent.closest('svg'))
  })
}

function describe(el: Element, index: number): AssetSlot {
  const tag = el.tagName.toLowerCase() === 'img' ? 'img' : 'svg'
  const cls = (el.getAttribute('class') || '').split(/\s+/).filter(Boolean)[0]
  const aria = el.getAttribute('aria-label') || el.getAttribute('alt') || ''
  const hint = aria ? ` — ${aria}` : ''
  return {
    slotIndex: index,
    tag,
    label: `${tag}${cls ? ' .' + cls : ''}${hint}`,
    preview: el.outerHTML.slice(0, 400)
  }
}

/** Lists the replaceable slots in a compiled block's HTML fragment. */
export function detectAssetSlots(blockHtml: string): AssetSlot[] {
  const doc = new DOMParser().parseFromString(blockHtml, 'text/html')
  return outermostVisuals(doc.body).map((el, i) => describe(el, i))
}

/**
 * Applies asset overrides to a compiled block's HTML: the targeted slot
 * element is replaced by an <img> pointing at the uploaded asset. The original
 * element's id/class/dimensions are preserved so scoped CSS (and most runtime
 * lookups) keep working.
 */
export function applyAssetOverrides(
  blockHtml: string,
  overrides: AssetOverride[],
  assets: AssetItem[],
  resolveSrc: (asset: AssetItem) => string
): string {
  if (overrides.length === 0) return blockHtml
  const doc = new DOMParser().parseFromString(blockHtml, 'text/html')
  const slots = outermostVisuals(doc.body)
  for (const o of overrides) {
    const el = slots[o.slotIndex]
    const asset = assets.find((a) => a.id === o.assetId)
    if (!el || !asset) continue
    const img = doc.createElement('img')
    const id = el.getAttribute('id')
    const cls = el.getAttribute('class')
    if (id) img.setAttribute('id', id)
    if (cls) img.setAttribute('class', cls + ' clyp-asset-replaced')
    else img.setAttribute('class', 'clyp-asset-replaced')
    img.setAttribute('src', resolveSrc(asset))
    img.setAttribute('alt', asset.name.replace(/\.[a-z0-9]+$/i, ''))
    const w = el.getAttribute('width')
    const h = el.getAttribute('height')
    if (w) img.setAttribute('width', w)
    if (h) img.setAttribute('height', h)
    img.setAttribute(
      'style',
      `object-fit:${o.fit};max-width:100%;` + (w || h ? '' : 'width:100%;height:100%;')
    )
    el.replaceWith(img)
  }
  return doc.body.innerHTML
}
