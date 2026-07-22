import { useMemo, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { photoCoverage } from '../art/artEngine'
import { characterPrompt, scenePrompt, buildBrief, type PromptSpec } from '../art/prompts'
import { characterNeedLabel, sceneLabel } from '../art/artKeys'
import { photoLibraryBytes } from '../art/photoLibrary'
import { downloadText } from '../export/zip'

interface Row {
  id: string
  label: string
  prompt: PromptSpec
  filled: boolean
  thumb?: string
  sourceName?: string
}

export function PhotographyPanel() {
  const course = useStore((s) => s.course)
  const addPhotos = useStore((s) => s.addPhotos)
  const removePhoto = useStore((s) => s.removePhoto)
  const notify = useStore((s) => s.notify)
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'missing'>('all')

  const coverage = useMemo(() => (course ? photoCoverage(course) : null), [course])

  const rows: Row[] = useMemo(() => {
    if (!coverage) return []
    const chars: Row[] = coverage.characters.map(({ need, photo }) => ({
      id: `c-${need.spec.role}-${need.spec.gender}-${need.spec.age}-${need.spec.tone}-${need.expression}-${need.gesture}`,
      label: characterNeedLabel(need),
      prompt: characterPrompt(need.spec, need.expression, need.gesture),
      filled: !!photo,
      thumb: photo?.dataUrl,
      sourceName: photo?.originalName
    }))
    const scenes: Row[] = coverage.scenes.map(({ need, photo }) => ({
      id: `s-${need.backgroundId}`,
      label: `Scene — ${sceneLabel(need.backgroundId)}`,
      prompt: scenePrompt(need.backgroundId),
      filled: !!photo,
      thumb: photo?.dataUrl,
      sourceName: photo?.originalName
    }))
    return [...chars, ...scenes]
  }, [coverage])

  if (!course || !coverage) return null

  const visible = filter === 'missing' ? rows.filter((r) => !r.filled) : rows
  const photos = course.photos ?? []
  const libBytes = photoLibraryBytes(photos)
  const pct = coverage.total === 0 ? 0 : Math.round((coverage.filled / coverage.total) * 100)

  const onFiles = async (files: FileList | File[]) => {
    setBusy(true)
    try {
      const { added, failed } = await addPhotos(files)
      if (added > 0) notify('success', `${added} image${added === 1 ? '' : 's'} matched and added.`)
      for (const f of failed.slice(0, 4)) notify('error', `${f.fileName}: ${f.error}`)
      if (failed.length > 4) notify('error', `…and ${failed.length - 4} more could not be imported.`)
    } finally {
      setBusy(false)
    }
  }

  const copyPrompt = async (row: Row) => {
    try {
      await navigator.clipboard.writeText(row.prompt.prompt)
      setCopied(row.id)
      window.setTimeout(() => setCopied((c) => (c === row.id ? null : c)), 1600)
    } catch {
      notify('error', 'Clipboard unavailable — use "Download image brief" instead.')
    }
  }

  const downloadBrief = (onlyMissing: boolean) => {
    const subset = onlyMissing ? rows.filter((r) => !r.filled) : rows
    if (subset.length === 0) {
      notify('info', 'Nothing to brief — every image is already supplied.')
      return
    }
    downloadText(
      buildBrief(subset.map((r) => r.prompt), course.meta.title),
      `${course.meta.title.replace(/[^\w\- ]+/g, '').trim() || 'course'}-image-brief.txt`,
      'text/plain'
    )
    notify('success', `Image brief downloaded (${subset.length} prompts).`)
  }

  return (
    <div className="panel">
      <h2>Scenario photography</h2>
      <p className="panel-sub">
        Generate photoreal images in any AI tool, name them as shown, and drop them here. ClypCompiler
        matches each one to the characters and scenes your course actually uses. Anything you haven't
        supplied falls back to the built-in art, so a partial set still exports cleanly.
      </p>

      <section className="card">
        <h3>
          Coverage <span className="tree-count">{coverage.filled} / {coverage.total}</span>
        </h3>
        {coverage.total === 0 ? (
          <p className="hint">
            No scenario or conversation blocks in this course yet — those are the blocks that use
            character and scene art. Import one to see what images it needs.
          </p>
        ) : (
          <>
            <div className="coverage-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
              <div className="coverage-fill" style={{ width: `${pct}%` }} />
            </div>
            <p className="hint" style={{ marginTop: 10 }}>
              {pct}% of this course's character and scene art is your own photography.
              {photos.length > 0 && ` Library: ${photos.length} image${photos.length === 1 ? '' : 's'}, ${(libBytes / 1048576).toFixed(1)} MB.`}
            </p>
            <div className="check-row">
              <button className="btn btn-primary" onClick={() => downloadBrief(true)}>
                ⬇ Download brief for missing images
              </button>
              <button className="btn btn-ghost" onClick={() => downloadBrief(false)}>
                Download full brief
              </button>
            </div>
          </>
        )}
      </section>

      <section
        className={`card dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          if (!dragging) setDragging(true)
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) void onFiles(e.dataTransfer.files)
        }}
      >
        <p>{busy ? 'Importing…' : 'Drop your generated images here, or'}</p>
        <button className="btn btn-primary" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? <span className="spinner spinner-sm" /> : 'Choose images…'}
        </button>
        <p className="hint">
          Filenames must start with <code>char__</code> or <code>scene__</code> — exactly as listed below.
          Images are downscaled on import to keep the course portable.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) void onFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </section>

      {coverage.total > 0 && (
        <section className="card">
          <h3>
            Images this course needs
            <span className="spacer" />
            <span className="seg">
              <button className={filter === 'all' ? 'is-on' : ''} onClick={() => setFilter('all')}>
                All ({rows.length})
              </button>
              <button className={filter === 'missing' ? 'is-on' : ''} onClick={() => setFilter('missing')}>
                Missing ({rows.filter((r) => !r.filled).length})
              </button>
            </span>
          </h3>
          <p className="hint">
            Each character's physical description is fixed, so reusing the prompt gives you the same
            person across every expression. Shorter filenames cover more variants — see the brief.
          </p>

          {visible.length === 0 && <p className="hint">Nothing here — every image is supplied. 🎉</p>}

          <div className="need-list">
            {visible.map((row) => (
              <div key={row.id} className={`need-row ${row.filled ? 'is-filled' : ''}`}>
                <div className="need-thumb">
                  {row.thumb ? <img src={row.thumb} alt="" /> : <span className="need-empty">?</span>}
                </div>
                <div className="need-info">
                  <b>{row.label}</b>
                  <code className="need-file">{row.prompt.fileName}.jpg</code>
                  <span className="need-meta">
                    {row.filled ? `✓ ${row.sourceName}` : `Aspect ${row.prompt.aspect} · not supplied`}
                  </span>
                </div>
                <div className="need-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => void copyPrompt(row)}>
                    {copied === row.id ? '✓ Copied' : 'Copy prompt'}
                  </button>
                  {row.filled && (
                    <button
                      className="btn btn-ghost btn-sm"
                      title="Remove this image"
                      onClick={() => {
                        const p = (course.photos ?? []).find((x) => x.originalName === row.sourceName)
                        if (p) removePhoto(p.id)
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {photos.length > 0 && (
        <section className="card">
          <h3>Imported images <span className="tree-count">{photos.length}</span></h3>
          <div className="asset-grid">
            {photos.map((p) => {
              const used = rows.some((r) => r.sourceName === p.originalName)
              return (
                <figure key={p.id} className="asset-card">
                  <img src={p.dataUrl} alt={p.originalName} loading="lazy" />
                  <figcaption>
                    <span className="asset-name" title={p.originalName}>{p.originalName}</span>
                    <span className="asset-meta">
                      {p.width}×{p.height} · {used ? 'in use' : 'no matching variant'}
                    </span>
                  </figcaption>
                  <button className="asset-delete" title="Remove" onClick={() => removePhoto(p.id)}>
                    ✕
                  </button>
                </figure>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
