import { useRef, useState } from 'react'
import { useStore } from '../store/store'
import { catalogEntry } from '../clyp/catalog'
import { PasteBlockDialog } from './PasteBlockDialog'

const FAMILY_ICONS: Record<string, string> = {
  content: '📄',
  assessment: '🎯',
  scenario: '💬'
}

export function StructureTree() {
  const course = useStore((s) => s.course)
  const selection = useStore((s) => s.selection)
  const select = useStore((s) => s.select)
  const addLesson = useStore((s) => s.addLesson)
  const moveLesson = useStore((s) => s.moveLesson)
  const importClypFiles = useStore((s) => s.importClypFiles)
  const moveBlock = useStore((s) => s.moveBlock)
  const notify = useStore((s) => s.notify)
  const fileRef = useRef<HTMLInputElement>(null)
  const [importTarget, setImportTarget] = useState<string | null>(null)
  const [pasteTarget, setPasteTarget] = useState<string | null>(null)

  if (!course) return null

  const startImport = (lessonId: string) => {
    setImportTarget(lessonId)
    fileRef.current?.click()
  }

  const onFiles = async (list: FileList) => {
    if (!importTarget) return
    const files = await Promise.all(
      Array.from(list).map(async (f) => ({ name: f.name, text: await f.text() }))
    )
    const reports = importClypFiles(files, importTarget)
    const ok = reports.filter((r) => r.ok).length
    const failed = reports.filter((r) => !r.ok)
    if (ok > 0) notify('success', `${ok} block${ok === 1 ? '' : 's'} imported.`)
    for (const f of failed) {
      const detail = f.issues?.length ? ` (${f.issues[0].description})` : ''
      notify('error', `${f.fileName}: ${f.error}${detail}`)
    }
  }

  return (
    <aside className="tree">
      <div className="tree-fixed">
        <button
          className={`tree-item tree-course ${selection.kind === 'course' ? 'is-selected' : ''}`}
          onClick={() => select({ kind: 'course' })}
        >
          ⚙ Course settings
        </button>
        <button
          className={`tree-item tree-course ${selection.kind === 'photography' ? 'is-selected' : ''}`}
          onClick={() => select({ kind: 'photography' })}
        >
          📸 Scenario photography
          <span className="tree-count">{(course.photos ?? []).length}</span>
        </button>
        <button
          className={`tree-item tree-course ${selection.kind === 'assets' ? 'is-selected' : ''}`}
          onClick={() => select({ kind: 'assets' })}
        >
          🖼 Assets library <span className="tree-count">{course.assets.length}</span>
        </button>
      </div>

      <div className="tree-scroll">
        {course.lessons.map((lesson, li) => (
          <div key={lesson.id} className="tree-lesson">
            <div
              className={`tree-item tree-lesson-head ${
                selection.kind === 'lesson' && selection.lessonId === lesson.id ? 'is-selected' : ''
              }`}
              onClick={() => select({ kind: 'lesson', lessonId: lesson.id })}
            >
              <span className="tree-lesson-num">{li + 1}</span>
              <span className="tree-label">{lesson.title}</span>
              <span className="tree-mini-actions">
                <button title="Move up" disabled={li === 0} onClick={(e) => { e.stopPropagation(); moveLesson(lesson.id, -1) }}>↑</button>
                <button title="Move down" disabled={li === course.lessons.length - 1} onClick={(e) => { e.stopPropagation(); moveLesson(lesson.id, 1) }}>↓</button>
              </span>
            </div>
            <ul className="tree-blocks">
              {lesson.blockIds.map((bid, bi) => {
                const block = course.blocks[bid]
                if (!block) return null
                const entry = block.clyp ? catalogEntry(block.clyp.block.blockType) : null
                const icon = entry ? (FAMILY_ICONS[entry.family] ?? '📄') : '📋'
                const kindLabel = entry
                  ? entry.label
                  : `${block.pasted?.blockLabel ?? 'Pasted block'} · pasted`
                const selected =
                  selection.kind === 'block' && selection.blockId === bid
                return (
                  <li key={bid}>
                    <div
                      className={`tree-item tree-block ${selected ? 'is-selected' : ''}`}
                      onClick={() => select({ kind: 'block', lessonId: lesson.id, blockId: bid })}
                    >
                      <span className="tree-block-icon">{icon}</span>
                      <span className="tree-label">
                        {block.title}
                        <small>{kindLabel}</small>
                      </span>
                      <span className="tree-mini-actions">
                        <button title="Move up" disabled={bi === 0} onClick={(e) => { e.stopPropagation(); moveBlock(lesson.id, bid, -1) }}>↑</button>
                        <button title="Move down" disabled={bi === lesson.blockIds.length - 1} onClick={(e) => { e.stopPropagation(); moveBlock(lesson.id, bid, 1) }}>↓</button>
                      </span>
                    </div>
                  </li>
                )
              })}
              <li className="tree-add-row">
                <button className="tree-import" onClick={() => startImport(lesson.id)}>
                  + Import .clyp
                </button>
                <button
                  className="tree-import"
                  title="Paste clypped code copied from Clyp"
                  onClick={() => setPasteTarget(lesson.id)}
                >
                  📋 Paste code
                </button>
              </li>
            </ul>
          </div>
        ))}
        <button className="btn btn-ghost tree-add-lesson" onClick={addLesson}>
          + Add lesson
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".clyp,application/json"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void onFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {pasteTarget && (
        <PasteBlockDialog lessonId={pasteTarget} onClose={() => setPasteTarget(null)} />
      )}
    </aside>
  )
}
