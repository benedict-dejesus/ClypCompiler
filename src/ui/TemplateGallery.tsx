import { useMemo, useState } from 'react'
import { useStore } from '../store/store'
import { templateSummaries, templateById, industries } from '../templates/registry'
import { buildCourseFromTemplate } from '../templates/buildCourse'
import { themeById } from '../model/course'
import type { TemplateSummary } from '../templates/types'

/**
 * Start-from-a-template browser. Templates are complete, authored courses —
 * expanding one produces an ordinary editable course backed by real .clyp
 * blocks, identical to importing the files by hand.
 */
export function TemplateGallery({ onClose }: { onClose: () => void }) {
  const loadCourse = useStore((s) => s.loadCourse)
  const notify = useStore((s) => s.notify)
  const [industry, setIndustry] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<TemplateSummary | null>(null)
  const [busy, setBusy] = useState(false)

  const all = useMemo(() => templateSummaries(), [])
  const inds = useMemo(() => industries(), [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((t) => {
      if (industry !== 'all' && t.industry !== industry) return false
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.gap.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    })
  }, [all, industry, query])

  const use = (id: string) => {
    const tpl = templateById(id)
    if (!tpl) return
    setBusy(true)
    // Let the button paint its busy state before the synchronous expansion.
    window.setTimeout(() => {
      try {
        loadCourse(buildCourseFromTemplate(tpl))
        notify('success', `"${tpl.title}" loaded — ${tpl.lessons.length} lessons ready to edit.`)
        onClose()
      } catch (err) {
        notify('error', 'Could not build that template: ' + (err instanceof Error ? err.message : String(err)))
      } finally {
        setBusy(false)
      }
    }, 20)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-gallery" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-head">
          <div>
            <h2 className="modal-title">Start from a template</h2>
            <p className="hint" style={{ margin: 0 }}>
              Complete, ready-to-run courses built on real workplace knowledge gaps. Load one and edit
              anything — every block is a normal .clyp block.
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="gallery-filters">
          <input
            type="text"
            placeholder="Search by topic, company or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="seg gallery-seg">
            <button className={industry === 'all' ? 'is-on' : ''} onClick={() => setIndustry('all')}>
              All ({all.length})
            </button>
            {inds.map((i) => (
              <button key={i} className={industry === i ? 'is-on' : ''} onClick={() => setIndustry(i)}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && <p className="hint">No templates match that search.</p>}

        <div className="gallery-grid">
          {visible.map((t) => {
            const theme = themeById(t.themeId)
            const open = selected?.id === t.id
            return (
              <article key={t.id} className={`tpl-card ${open ? 'is-open' : ''}`}>
                <div
                  className="tpl-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${theme.vars.primary}, ${theme.vars.sidebarBg})`
                  }}
                >
                  <span className="tpl-industry">{t.industry}</span>
                  <span className="tpl-mins">{t.minutes} min</span>
                </div>
                <div className="tpl-body">
                  <h3>{t.title}</h3>
                  <p className="tpl-company">{t.company}</p>
                  <p className="tpl-summary">{t.summary}</p>
                  <div className="tpl-meta">
                    <span>{t.lessonCount} lessons</span>
                    <span>{t.blockCount} blocks</span>
                  </div>
                  <div className="tpl-tags">
                    {t.tags.map((tag) => (
                      <span key={tag} className="tpl-tag">{tag}</span>
                    ))}
                  </div>

                  {open && (
                    <div className="tpl-detail">
                      <h4>The gap it closes</h4>
                      <p>{t.gap}</p>
                      <h4>Who it is for</h4>
                      <p>{t.audience}</p>
                      <h4>Lessons</h4>
                      <ol className="tpl-lessons">
                        {t.lessonTitles.map((l) => (
                          <li key={l}>{l}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="tpl-actions">
                    <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => use(t.id)}>
                      {busy ? 'Building…' : 'Use this template'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelected(open ? null : t)}
                    >
                      {open ? 'Hide details' : 'Details'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
