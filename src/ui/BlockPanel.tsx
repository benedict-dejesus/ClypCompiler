import { useMemo, useState } from 'react'
import { useStore } from '../store/store'
import { compileBlock } from '../clyp/compile'
import { catalogEntry } from '../clyp/catalog'
import { detectAssetSlots, applyAssetOverrides } from '../export/assetSlots'

export function BlockPanel({ lessonId, blockId }: { lessonId: string; blockId: string }) {
  const course = useStore((s) => s.course)
  const mutate = useStore((s) => s.mutate)
  const removeBlock = useStore((s) => s.removeBlock)
  const moveBlockToLesson = useStore((s) => s.moveBlockToLesson)
  const setAssetOverride = useStore((s) => s.setAssetOverride)
  const [confirming, setConfirming] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const block = course?.blocks[blockId]

  const compiled = useMemo(() => (block ? compileBlock(block.clyp) : null), [block?.clyp])

  const slots = useMemo(
    () => (compiled?.output ? detectAssetSlots(compiled.output.html) : []),
    [compiled]
  )

  const previewDoc = useMemo(() => {
    if (!showPreview || !compiled?.output || !course || !block) return ''
    const html = applyAssetOverrides(
      compiled.output.html,
      block.assetOverrides,
      course.assets,
      (a) => a.dataUrl
    )
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;padding:16px;background:#fff;font-family:'Segoe UI',system-ui,sans-serif;}${compiled.output.css}</style></head><body>${html}<script>${compiled.output.js}<\/script></body></html>`
  }, [showPreview, compiled, block, course])

  if (!course || !block) return <div className="panel"><p>This block no longer exists.</p></div>
  const entry = catalogEntry(block.clyp.block.blockType)
  const gated = compiled?.output ? /class="clyp-gate\b/.test(compiled.output.html) : false
  const issues = compiled?.validation.issues ?? []

  return (
    <div className="panel">
      <h2>{block.title}</h2>
      <p className="panel-sub">
        {entry.label} · {entry.family} block · from <code>{block.sourceFileName}</code>
        {gated ? ' · has completion gate' : ' · completes on view'}
      </p>

      <section className="card">
        <h3>Block settings</h3>
        <div className="form-grid">
          <label>
            Display title (builder & XP toasts)
            <input
              value={block.title}
              onChange={(e) => mutate((c) => void (c.blocks[blockId].title = e.target.value))}
            />
          </label>
          <label>
            XP award override (blank = course default)
            <input
              type="number"
              min={0}
              value={block.xpOverride ?? ''}
              placeholder={String(
                gated ? course.gamification.xpPerGatedBlock : course.gamification.xpPerBlock
              )}
              onChange={(e) =>
                mutate(
                  (c) =>
                    void (c.blocks[blockId].xpOverride =
                      e.target.value === '' ? null : Math.max(0, Number(e.target.value) || 0))
                )
              }
            />
          </label>
          <label>
            Move to lesson
            <select
              value={lessonId}
              onChange={(e) => moveBlockToLesson(lessonId, blockId, e.target.value)}
            >
              {course.lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h3>
          Images &amp; graphics{' '}
          <span className="tree-count">{slots.length} replaceable</span>
        </h3>
        {slots.length === 0 && (
          <p className="hint">This block contains no image placeholders or SVG graphics.</p>
        )}
        {slots.length > 0 && course.assets.length === 0 && (
          <p className="hint">
            Upload images to the <b>Assets library</b> first, then assign them here to replace the
            block's built-in graphics.
          </p>
        )}
        {slots.map((slot) => {
          const override = block.assetOverrides.find((o) => o.slotIndex === slot.slotIndex)
          const overrideAsset = override ? course.assets.find((a) => a.id === override.assetId) : null
          return (
            <div key={slot.slotIndex} className="slot-row">
              <div className="slot-thumb">
                {overrideAsset ? (
                  <img src={overrideAsset.dataUrl} alt={overrideAsset.name} />
                ) : (
                  <div
                    className="slot-thumb-svg"
                    dangerouslySetInnerHTML={{ __html: slot.tag === 'svg' ? slot.preview : '' }}
                  />
                )}
              </div>
              <div className="slot-info">
                <b>Slot {slot.slotIndex + 1}</b>
                <span>{slot.label}</span>
              </div>
              <select
                value={override?.assetId ?? ''}
                onChange={(e) =>
                  setAssetOverride(
                    blockId,
                    slot.slotIndex,
                    e.target.value || null,
                    override?.fit ?? 'cover'
                  )
                }
              >
                <option value="">Original graphic</option>
                {course.assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              {override && (
                <select
                  value={override.fit}
                  onChange={(e) =>
                    setAssetOverride(blockId, slot.slotIndex, override.assetId, e.target.value as 'cover' | 'contain')
                  }
                >
                  <option value="cover">Fill (crop)</option>
                  <option value="contain">Fit (letterbox)</option>
                </select>
              )}
            </div>
          )
        })}
      </section>

      <section className="card">
        <h3>Preview</h3>
        <button className="btn btn-secondary" onClick={() => setShowPreview((v) => !v)}>
          {showPreview ? 'Hide block preview' : 'Preview this block'}
        </button>
        {showPreview && compiled?.output && (
          <iframe className="block-preview" title="Block preview" srcDoc={previewDoc} sandbox="allow-scripts" />
        )}
      </section>

      {issues.length > 0 && (
        <section className="card">
          <h3>Validation</h3>
          <ul className="issue-list">
            {issues.map((iss, i) => (
              <li key={i}>
                <b className={`sev sev-${iss.severity}`}>{iss.severity}</b> {iss.description}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card card-danger">
        <h3>Remove block</h3>
        {confirming ? (
          <div className="check-row">
            <button className="btn btn-danger" onClick={() => removeBlock(lessonId, blockId)}>
              Yes, remove from course
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn btn-danger" onClick={() => setConfirming(true)}>
            Remove block…
          </button>
        )}
      </section>
    </div>
  )
}
