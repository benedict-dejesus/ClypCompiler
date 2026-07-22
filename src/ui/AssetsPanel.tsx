import { useRef, useState } from 'react'
import { useStore } from '../store/store'

const MAX_ASSET_BYTES = 4 * 1024 * 1024 // keep single-file projects manageable

export function AssetsPanel() {
  const course = useStore((s) => s.course)
  const addAsset = useStore((s) => s.addAsset)
  const removeAsset = useStore((s) => s.removeAsset)
  const notify = useStore((s) => s.notify)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
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
        className="card dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
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
