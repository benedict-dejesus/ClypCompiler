import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { builtinGallery, type GalleryEntry } from '../art/artEngine'

const MAX_ASSET_BYTES = 4 * 1024 * 1024 // keep single-file projects manageable

/** One tile of the built-in art gallery — renders its image lazily. */
function GalleryTile({ entry }: { entry: GalleryEntry }) {
  const addAsset = useStore((s) => s.addAsset)
  const notify = useStore((s) => s.notify)
  const [url, setUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    entry
      .make()
      .then((u) => {
        if (!cancelled) setUrl(u)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [entry])

  const ext = entry.mime === 'image/png' ? 'png' : 'jpg'
  return (
    <figure className={`asset-card builtin-card ${entry.kind === 'character' ? 'is-character' : ''}`}>
      {url ? (
        <img src={url} alt={entry.label} loading="lazy" />
      ) : (
        <div className="asset-loading">{failed ? '⚠' : <span className="spinner spinner-sm" />}</div>
      )}
      <figcaption>
        <span className="asset-name" title={entry.label}>{entry.label}</span>
        <span className="asset-meta">{entry.kind === 'character' ? 'character · png' : 'scene · jpg'}</span>
      </figcaption>
      {url && (
        <button
          className="asset-add"
          title="Add a copy to this course's assets (for manual slot replacement)"
          onClick={() => {
            addAsset(`${entry.label}.${ext}`, entry.mime, url)
            notify('success', `${entry.label} added to course assets.`)
          }}
        >
          +
        </button>
      )}
    </figure>
  )
}

export function AssetsPanel() {
  const course = useStore((s) => s.course)
  const addAsset = useStore((s) => s.addAsset)
  const removeAsset = useStore((s) => s.removeAsset)
  const notify = useStore((s) => s.notify)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [galleryTab, setGalleryTab] = useState<'characters' | 'scenes' | null>(null)
  const [dragging, setDragging] = useState(false)
  const gallery = builtinGallery()
  if (!course) return null

  const usedBy = (assetId: string): number =>
    Object.values(course.blocks).filter((b) => b.assetOverrides.some((o) => o.assetId === assetId)).length

  const onFiles = (list: FileList) => {
    for (const file of Array.from(list)) {
      if (!file.type.startsWith('image/')) {
        notify('error', `${file.name}: only image files can be used as block graphics.`)
        continue
      }
      if (file.size > MAX_ASSET_BYTES) {
        notify('error', `${file.name} is larger than 4 MB. Please compress it first.`)
        continue
      }
      const reader = new FileReader()
      reader.onload = () => {
        addAsset(file.name, file.type, String(reader.result))
        notify('success', `${file.name} added to the assets library.`)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="panel">
      <h2>Assets library</h2>
      <p className="panel-sub">
        Upload images here, then open any block and assign them in place of its image placeholders or
        SVG graphics. Only assets actually used by a block are included in exports.
      </p>

      <section
        className={`card dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          if (!dragging) setDragging(true)
        }}
        onDragLeave={(e) => {
          // Only clear when the pointer actually leaves the dropzone, not when
          // it crosses onto a child element.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files)
        }}
      >
        <p>Drag &amp; drop images here, or</p>
        <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
          Choose images…
        </button>
        <p className="hint">PNG, JPG, GIF, WebP or SVG · up to 4 MB each</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files?.length) onFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </section>

      <section className="card">
        <h3>Built-in art library</h3>
        <p className="hint">
          High-end renditions of Clyp's characters and scene backgrounds. Courses using the{' '}
          <b>Rendered</b> art style get these applied automatically — including every expression,
          gesture, age and skin-tone variant your scenarios use. Browse the library here, or add a
          copy to the course assets to place one manually in any block.
        </p>
        <div className="check-row">
          <button
            className={`btn ${galleryTab === 'characters' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setGalleryTab(galleryTab === 'characters' ? null : 'characters')}
          >
            👤 Characters ({gallery.filter((g) => g.kind === 'character').length})
          </button>
          <button
            className={`btn ${galleryTab === 'scenes' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setGalleryTab(galleryTab === 'scenes' ? null : 'scenes')}
          >
            🏙 Scenes ({gallery.filter((g) => g.kind === 'background').length})
          </button>
        </div>
        {galleryTab && (
          <div className="asset-grid builtin-grid">
            {gallery
              .filter((g) => (galleryTab === 'characters' ? g.kind === 'character' : g.kind === 'background'))
              .map((g) => (
                <GalleryTile key={g.id} entry={g} />
              ))}
          </div>
        )}
      </section>

      {course.assets.length > 0 && (
        <section className="card">
          <h3>{course.assets.length} asset{course.assets.length === 1 ? '' : 's'}</h3>
          <div className="asset-grid">
            {course.assets.map((a) => {
              const uses = usedBy(a.id)
              return (
                <figure key={a.id} className="asset-card">
                  <img src={a.dataUrl} alt={a.name} />
                  <figcaption>
                    <span className="asset-name" title={a.name}>{a.name}</span>
                    <span className="asset-meta">
                      {uses > 0 ? `used by ${uses} block${uses === 1 ? '' : 's'}` : 'unused'}
                    </span>
                  </figcaption>
                  {confirmDelete === a.id ? (
                    <span className="asset-confirm">
                      <button className="btn btn-danger btn-sm" onClick={() => { removeAsset(a.id); setConfirmDelete(null) }}>
                        Delete
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                        Keep
                      </button>
                    </span>
                  ) : (
                    <button className="asset-delete" title="Delete asset" onClick={() => setConfirmDelete(a.id)}>
                      ✕
                    </button>
                  )}
                </figure>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
