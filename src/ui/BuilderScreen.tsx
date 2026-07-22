import { useRef, useState } from 'react'
import { useStore, courseToFileText } from '../store/store'
import { exportCourseZip, downloadBlob, downloadText, type ExportKind } from '../export/zip'
import type { CourseCompileResult } from '../export/compileCourse'
import { StructureTree } from './StructureTree'
import { CoursePanel } from './CoursePanel'
import { LessonPanel } from './LessonPanel'
import { BlockPanel } from './BlockPanel'
import { AssetsPanel } from './AssetsPanel'

export function BuilderScreen() {
  const course = useStore((s) => s.course)
  const selection = useStore((s) => s.selection)
  const setView = useStore((s) => s.setView)
  const closeCourse = useStore((s) => s.closeCourse)
  const notify = useStore((s) => s.notify)
  const [exporting, setExporting] = useState<ExportKind | null>(null)
  const [problems, setProblems] = useState<CourseCompileResult['problems'] | null>(null)
  const exportMenuRef = useRef<HTMLDetailsElement>(null)

  if (!course) return null

  const blockCount = Object.keys(course.blocks).length

  const runExport = async (kind: ExportKind) => {
    exportMenuRef.current?.removeAttribute('open')
    if (blockCount === 0) {
      notify('error', 'Add at least one block before exporting.')
      return
    }
    setExporting(kind)
    try {
      // Let the spinner paint before the (synchronous) compile starts.
      await new Promise((r) => setTimeout(r, 30))
      const result = await exportCourseZip(course, kind)
      if (!result.ok) {
        setProblems(result.problems ?? [])
        return
      }
      downloadBlob(result.blob!, result.fileName!)
      notify(
        'success',
        kind === 'scorm'
          ? 'SCORM 1.2 package exported. Upload the zip to your LMS — or unzip it and open index.html directly.'
          : 'HTML5 package exported. Unzip it anywhere and open index.html.'
      )
    } catch (err) {
      notify('error', 'Export failed: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setExporting(null)
    }
  }

  const saveProjectFile = () => {
    const name = course.meta.title.replace(/[^\w\- ]+/g, '').trim() || 'course'
    downloadText(courseToFileText(course), `${name}.clypcourse`)
    notify('success', 'Project saved as a .clypcourse file.')
  }

  return (
    <div className="builder">
      <header className="topbar">
        <button className="btn btn-ghost" onClick={closeCourse} title="Back to projects">
          ← Projects
        </button>
        <div className="topbar-title">
          <h1>{course.meta.title}</h1>
          <span className="topbar-sub">
            {course.lessons.length} lesson{course.lessons.length === 1 ? '' : 's'} · {blockCount} block
            {blockCount === 1 ? '' : 's'} · autosaved
          </span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={saveProjectFile}>
            Save project
          </button>
          <button className="btn btn-secondary" onClick={() => setView('player')} disabled={blockCount === 0}>
            ▶ Preview course
          </button>
          <details className="export-menu" ref={exportMenuRef}>
            <summary className="btn btn-primary">{exporting ? 'Exporting…' : 'Export ▾'}</summary>
            <div className="export-menu-list">
              <button disabled={exporting !== null} onClick={() => void runExport('scorm')}>
                <b>SCORM 1.2 package (.zip)</b>
                <span>For any SCORM-compliant LMS. Also runs standalone.</span>
              </button>
              <button disabled={exporting !== null} onClick={() => void runExport('html5')}>
                <b>HTML5 package (.zip)</b>
                <span>Unzip and open index.html — no LMS needed.</span>
              </button>
            </div>
          </details>
        </div>
      </header>

      <div className="builder-body">
        <StructureTree />
        <main className="detail">
          {selection.kind === 'course' && <CoursePanel />}
          {selection.kind === 'assets' && <AssetsPanel />}
          {selection.kind === 'lesson' && <LessonPanel lessonId={selection.lessonId} />}
          {selection.kind === 'block' && <BlockPanel lessonId={selection.lessonId} blockId={selection.blockId} />}
        </main>
      </div>

      {problems && (
        <div className="modal-backdrop" onClick={() => setProblems(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Export blocked by validation</h2>
            <p>
              The Clyp compiler found blocking issues. Nothing partial is ever exported — fix these in Clyp and
              re-import the affected blocks.
            </p>
            <div className="problem-list">
              {problems.map((p, i) => (
                <div key={i} className="problem">
                  <h3>
                    {p.blockTitle} <span>in {p.lessonTitle}</span>
                  </h3>
                  <ul>
                    {p.issues.map((iss, j) => (
                      <li key={j}>
                        <b className={`sev sev-${iss.severity}`}>{iss.severity}</b> {iss.description}
                        <em> — {iss.suggestedResolution}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setProblems(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
