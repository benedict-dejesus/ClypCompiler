// Clyp — compiler utilities: escaping, rich-text sanitizing, style building.
import type { ClypObject, SettingsModel } from './types'

export function esc(text: string | undefined | null): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Sanitizes rich text to a small allowlist of inline formatting tags
 *  (82_BLOCK_PARAGRAPH: disallowed tags are a security boundary). */
export function sanitizeRichText(input: string | undefined): string {
  if (!input) return ''
  // Escape everything, then re-allow the safe inline subset.
  let out = esc(input)
  for (const tag of ['b', 'i', 'u', 'strong', 'em']) {
    out = out
      .replace(new RegExp(`&lt;${tag}&gt;`, 'gi'), `<${tag}>`)
      .replace(new RegExp(`&lt;/${tag}&gt;`, 'gi'), `</${tag}>`)
  }
  out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>')
  return out.replace(/\n/g, '<br>')
}

/** Builds an intrinsic-typography CSS declaration list from Settings (44). */
export function settingsToCss(settings: SettingsModel): string {
  const decls: string[] = []
  if (settings.backgroundColor) decls.push(`background-color: ${settings.backgroundColor};`)
  if (settings.textColor) decls.push(`color: ${settings.textColor};`)
  if (settings.fontFamily) decls.push(`font-family: ${cssEscapeFont(settings.fontFamily)};`)
  if (settings.fontSize) decls.push(`font-size: ${settings.fontSize}px;`)
  if (settings.fontWeight) decls.push(`font-weight: ${settings.fontWeight};`)
  if (settings.textAlignment) decls.push(`text-align: ${settings.textAlignment};`)
  if (settings.lineSpacing) decls.push(`line-height: ${settings.lineSpacing};`)
  return decls.join(' ')
}

function cssEscapeFont(font: string): string {
  const cleaned = font.replace(/["';{}<>]/g, '')
  return /\s/.test(cleaned) ? `"${cleaned}", sans-serif` : `${cleaned}, sans-serif`
}

export function accentOf(obj: ClypObject, fallback = '#015061'): string {
  return obj.settings.accentColor || fallback
}

/** Serializes a JS value for safe embedding inside a <script> block. */
export function embedJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

export function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((l) => (l.trim() ? pad + l : l))
    .join('\n')
}
