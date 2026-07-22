import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { parseClyppedCode } from '../clyp/parsePasted'

/**
 * Paste the code Clyp copied to the clipboard and add it to a lesson as a
 * pre-compiled block. A live preview renders the pasted snippet exactly as it
 * will appear in the course, so mistakes are obvious before committing.
 */
export function PasteBlockDialog({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const addPastedBlock = useStore((s) => s.addPastedBlock)
  const notify = useStore((s) => s.notify)
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    areaRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const parsed = useMemo(() => (code.trim() ? parseClyppedCode(code) : null), [code])

  const previewDoc = useMemo(() => {
    if (!showPreview || !parsed?.ok || !parsed.block) return ''
    const b = parsed.block
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:16px;background:#fff;font-family:'Segoe UI',system-ui,sans-serif;}${b.css}</style></head><body>${b.html}<script>${b.js}<\/script></body></html>`
  }, [showPreview, parsed])

  const readClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) setCode(text)
      else notify('info', 'Your clipboard is empty.')
    } catch {
      notify('error', 'Clipboard access was blocked — paste into the box with Ctrl+V instead.')
    }
  }

  const submit = () => {
    const result = addPastedBlock(code, lessonId, title)
    if (!result.ok) {
      notify('error', result.error ?? 'Could not read that clypped code.')
      return
    }
    for (const w of result.warnings) notify('info', w)
    notify('success', 'Block added to the lesson.')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Paste clypped code</h2>
        <p className="hint">
          In Clyp, press <b>Clyp</b> to copy a block, then paste it here. ClypCompiler embeds it
          exactly as generated — it keeps its own styling and behaviour, and still takes part in
          lesson flow, completion gating and XP.
        </p>

        <div className="check-row" style={{ marginTop: 0 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => void readClipboard()}>
            📋 Paste from clipboard
          </button>
          {code && (
            <button className="btn btn-ghost btn-sm" onClick={() => setCode('')}>
              Clear
            </button>
          )}
          <label className="check" style={{ marginLeft: 'auto' }}>
            <input type="checkbox" checked={showPreview} onChange={(e) => setShowPreview(e.target.checked)} />
            Live preview
          </label>
        </div>

        <textarea
          ref={areaRef}
          className="paste-area"
          rows={9}
          spellCheck={false}
          placeholder="Paste the HTML + <style> + <script> snippet Clyp copied…"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {parsed && !parsed.ok && <p className="paste-error">⚠ {parsed.error}</p>}

        {parsed?.ok && parsed.block && (
          <>
            <div className="paste-summary">
              <span className="paste-pill">{parsed.block.blockLabel}</span>
              <span>{(parsed.block.html.length / 1024).toFixed(1)} KB HTML</span>
              <span>{(parsed.block.css.length / 1024).toFixed(1)} KB CSS</span>
              <span>{(parsed.block.js.length / 1024).toFixed(1)} KB JS</span>
              {/class="clyp-gate\b/.test(parsed.block.html) && <span className="paste-pill is-gate">completion gate</span>}
            </div>
            {parsed.warnings.map((w, i) => (
              <p key={i} className="paste-warning">⚠ {w}</p>
            ))}
            <label style={{ marginTop: 12 }}>
              Block title
              <input
                value={title}
                placeholder={parsed.block.projectName || parsed.block.blockLabel}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            {showPreview && (
              <iframe
                className="block-preview"
                title="Pasted block preview"
                srcDoc={previewDoc}
                sandbox="allow-scripts"
              />
            )}
          </>
        )}

        <div className="check-row">
          <button className="btn btn-primary" disabled={!parsed?.ok} onClick={submit}>
            Add block to lesson
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
