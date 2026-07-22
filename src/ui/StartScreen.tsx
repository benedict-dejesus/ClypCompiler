import { useRef, useState } from 'react'
import { useStore } from '../store/store'
import { TemplateGallery } from './TemplateGallery'

export function StartScreen() {
  const projects = useStore((s) => s.projects)
  const createCourse = useStore((s) => s.createCourse)
  const openCourse = useStore((s) => s.openCourse)
  const deleteProject = useStore((s) => s.deleteProject)
  const importCourseFile = useStore((s) => s.importCourseFile)
  const notify = useStore((s) => s.notify)
  const [title, setTitle] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showGallery, setShowGallery] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const onOpenFile = async (file: File) => {
    const text = await file.text()
    const result = importCourseFile(text)
    if (!result.ok) notify('error', result.error ?? 'Could not open that project file.')
  }

  return (
    <div className="start">
      <div className="start-card">
        <div className="start-brand">
          <span className="start-logo">▣</span>
          <div>
            <h1>ClypCompiler</h1>
            <p>Assemble clypped blocks into complete e-learning courses. Export as SCORM or HTML5 — works offline, no LMS required.</p>
          </div>
        </div>

        <div className="start-new">
          <input
            type="text"
            placeholder="New course title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') createCourse(title.trim())
            }}
          />
          <button className="btn btn-primary" onClick={() => createCourse(title.trim())}>
            Create course
          </button>
          <button className="btn btn-secondary" onClick={() => setShowGallery(true)}>
            ✨ Start from a template
          </button>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            Open .clypcourse file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".clypcourse,application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onOpenFile(f)
              e.target.value = ''
            }}
          />
        </div>

        <h2 className="start-heading">Recent projects on this device</h2>
        {projects.length === 0 && <p className="start-empty">No saved projects yet. Create your first course above.</p>}
        <ul className="start-projects">
          {projects.map((p) => (
            <li key={p.uuid}>
              <button className="start-project" onClick={() => void openCourse(p.uuid)}>
                <span className="start-project-title">{p.title}</span>
                <span className="start-project-meta">
                  {p.lessonCount} lesson{p.lessonCount === 1 ? '' : 's'} · {p.blockCount} block{p.blockCount === 1 ? '' : 's'} ·{' '}
                  {new Date(p.modifiedDate).toLocaleString()}
                </span>
              </button>
              {confirmDelete === p.uuid ? (
                <span className="start-confirm">
                  Delete?
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      void deleteProject(p.uuid)
                      setConfirmDelete(null)
                    }}
                  >
                    Yes
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>
                    No
                  </button>
                </span>
              ) : (
                <button className="btn btn-ghost btn-sm" title="Delete project" onClick={() => setConfirmDelete(p.uuid)}>
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <p className="start-foot">Created by Benedict de Jesus · Blocks are authored in Clyp and imported here as .clyp files.</p>
      </div>

      {showGallery && <TemplateGallery onClose={() => setShowGallery(false)} />}
    </div>
  )
}
