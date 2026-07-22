import { useState } from 'react'
import { useStore } from '../store/store'
import { THEMES } from '../model/course'

export function LessonPanel({ lessonId }: { lessonId: string }) {
  const course = useStore((s) => s.course)
  const mutate = useStore((s) => s.mutate)
  const removeLesson = useStore((s) => s.removeLesson)
  const [confirming, setConfirming] = useState(false)
  if (!course) return null
  const idx = course.lessons.findIndex((l) => l.id === lessonId)
  const lesson = course.lessons[idx]
  if (!lesson) return <div className="panel"><p>This lesson no longer exists.</p></div>

  return (
    <div className="panel">
      <h2>Lesson {idx + 1}</h2>

      <section className="card">
        <h3>Details</h3>
        <div className="form-grid">
          <label>
            Title
            <input
              value={lesson.title}
              onChange={(e) => mutate((c) => void (c.lessons[idx].title = e.target.value))}
            />
          </label>
          <label>
            Badge icon (emoji, shown when this lesson completes)
            <input
              value={lesson.badgeIcon}
              placeholder="🏅"
              onChange={(e) => mutate((c) => void (c.lessons[idx].badgeIcon = e.target.value))}
            />
          </label>
          <label className="span-2">
            Description (shown under the lesson title in the player)
            <textarea
              rows={2}
              value={lesson.description}
              onChange={(e) => mutate((c) => void (c.lessons[idx].description = e.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h3>Lesson theme</h3>
        <p className="hint">Overrides the course theme for this lesson only.</p>
        <div className="theme-grid">
          <button
            className={`theme-chip ${lesson.themeId === null ? 'is-selected' : ''}`}
            onClick={() => mutate((c) => void (c.lessons[idx].themeId = null))}
          >
            Inherit course theme
          </button>
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-chip ${lesson.themeId === t.id ? 'is-selected' : ''}`}
              onClick={() => mutate((c) => void (c.lessons[idx].themeId = t.id))}
            >
              <span className="theme-swatches">
                <i style={{ background: t.vars.primary }} />
                <i style={{ background: t.vars.accent }} />
                <i style={{ background: t.vars.sidebarBg }} />
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card card-danger">
        <h3>Remove lesson</h3>
        <p className="hint">
          Deletes the lesson and its {lesson.blockIds.length} block{lesson.blockIds.length === 1 ? '' : 's'} from the
          course. Imported .clyp source files on disk are not affected.
        </p>
        {confirming ? (
          <div className="check-row">
            <button className="btn btn-danger" onClick={() => removeLesson(lessonId)}>
              Yes, delete this lesson
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="btn btn-danger"
            disabled={course.lessons.length <= 1}
            title={course.lessons.length <= 1 ? 'A course needs at least one lesson' : undefined}
            onClick={() => setConfirming(true)}
          >
            Delete lesson…
          </button>
        )}
      </section>
    </div>
  )
}
