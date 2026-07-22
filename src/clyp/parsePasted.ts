// ClypCompiler — parser for "clypped code": the assembled HTML/CSS/JS snippet
// that Clyp's Clyp button copies to the clipboard.
//
// This is the already-compiled form of a block, so unlike a .clyp import there
// is no object model to re-compile. ClypCompiler embeds it as-is, which means
// it still participates in lesson flow, completion gating and XP — but it
// cannot be re-validated or re-rendered with different character art.
export interface PastedBlock {
  /** The block's HTML fragment (scoped root div). */
  html: string
  /** Block-scoped CSS, without the <style> wrapper. */
  css: string
  /** Namespaced runtime JS, without the <script> wrapper. */
  js: string
  /** Block label recovered from Clyp's annotation header, e.g. "Accordion". */
  blockLabel: string
  /** Project name recovered from the annotation header, if present. */
  projectName?: string
}

export interface ParsePastedResult {
  ok: boolean
  block?: PastedBlock
  error?: string
  /** Non-fatal observations shown to the author after a successful parse. */
  warnings: string[]
}

/** Pulls the contents of every <tag>…</tag>, returning them and the remainder. */
function extractAll(source: string, tag: 'style' | 'script'): { contents: string[]; rest: string } {
  const contents: string[] = []
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi')
  const rest = source.replace(re, (_m, inner: string) => {
    contents.push(inner)
    return ''
  })
  return { contents, rest }
}

export function parseClyppedCode(input: string): ParsePastedResult {
  const warnings: string[] = []
  const raw = input.trim()
  if (!raw) return { ok: false, error: 'Nothing pasted.', warnings }

  // Clyp's header comment carries the block label and project name.
  //   "  ACCORDION — created with Clyp"
  //   'from the project "FAQ Explorer"'
  let blockLabel = ''
  let projectName: string | undefined
  const labelMatch = raw.match(/^\s*([A-Z][A-Z0-9 &/-]{1,40})\s*[—–-]\s*created with Clyp/m)
  if (labelMatch) {
    blockLabel = labelMatch[1]
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  const projectMatch = raw.match(/project\s*\n?\s*[""]([^""\n]{1,80})[""]/)
  if (projectMatch) projectName = projectMatch[1].trim()

  const { contents: styles, rest: afterStyle } = extractAll(raw, 'style')
  const { contents: scripts, rest: afterScript } = extractAll(afterStyle, 'script')

  // Whatever is left, minus HTML comments, is the block markup.
  const html = afterScript.replace(/<!--[\s\S]*?-->/g, '').trim()

  if (!html) {
    return {
      ok: false,
      error: 'No block markup found. Paste the whole snippet Clyp copied, including the HTML.',
      warnings
    }
  }
  // Guard against a stray clipboard paste becoming a block: real output always
  // contains markup, so plain prose is rejected rather than silently embedded.
  if (!/<[a-z][\w-]*[\s>/]/i.test(html)) {
    return {
      ok: false,
      error: 'That does not contain any HTML. Copy the block again with the Clyp button in Clyp.',
      warnings
    }
  }

  // Sanity-check that this looks like Clyp output rather than arbitrary HTML.
  const looksLikeClyp = /class="[^"]*\bclyp-/.test(html) || /clyp/i.test(raw)
  if (!looksLikeClyp) {
    warnings.push(
      'This does not look like Clyp output (no clyp- scoped class found). It will still be embedded as-is.'
    )
  }
  if (styles.length === 0) {
    warnings.push('No <style> section found — this block will inherit the course theme styling only.')
  }
  if (scripts.length === 0) {
    warnings.push('No <script> section found — this block will have no interactive behaviour.')
  }
  if (!blockLabel) blockLabel = 'Pasted block'

  return {
    ok: true,
    warnings,
    block: {
      html,
      css: styles.join('\n\n').trim(),
      js: scripts.join('\n\n').trim(),
      blockLabel,
      projectName
    }
  }
}
