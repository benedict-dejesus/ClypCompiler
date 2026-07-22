import { useEffect, useState } from 'react'
import { useStore } from '../store/store'
import { buildPreviewHtml } from '../export/zip'
import type { CourseCompileResult } from '../export/compileCourse'

type Device = 'mobile' | 'tablet' | 'desktop'
const DEVICE_WIDTHS: Record<Device, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%'
}

interface BuildState {
  status: 'building' | 'ready' | 'failed'
  html?: string
  problems?: CourseCompileResult['problems']
}

/**
 * Course Player — runs the exact same runtime the exports use (no separate
 * preview runtime), inside a sandboxed iframe, with device-width presets to
 * check mobile responsiveness.
 */
export function PlayerScreen() {
  const course = useStore((s) => s.course)
  const setView = useStore((s) => s.setView)
  const [device, setDevice] = useState<Device>('desktop')
  const [runId, setRunId] = useState(0)
  const [build, setBuild] = useState<BuildState>({ status: 'building' })

  useEffect(() => {
    let cancelled = false
    if (!course) return
    setBuild({ status: 'building' })
    void buildPreviewHtml(course).then((result) => {
      if (cancelled) return
      if (result.ok) setBuild({ status: 'ready', html: result.html })
      else setBuild({ status: 'failed', problems: result.problems })
    })
    return () => {
      cancelled = true
    }
  }, [course, runId])

  if (!course) return null

  return (
    <div className="player">
      <header className="topbar">
        <button className="btn btn-ghost" onClick={() => setView('builder')}>
          ← Back to builder
        </button>
        <div className="topbar-title">
          <h1>Course player — {course.meta.title}</h1>
          <span className="topbar-sub">This is exactly what learners will see in the exported package.</span>
        </div>
        <div className="topbar-actions">
          {(['mobile', 'tablet', 'desktop'] as Device[]).map((d) => (
            <button
              key={d}
              className={`btn ${device === d ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setDevice(d)}
            >
              {d === 'mobile' ? '📱' : d === 'tablet' ? '📱↔' : '🖥'} {d}
            </button>
          ))}
          <button className="btn btn-ghost" title="Restart with fresh progress" onClick={() => setRunId((n) => n + 1)}>
            ⟲ Restart
          </button>
        </div>
      </header>
      <div className="player-stage">
        {build.status === 'building' && (
          <div className="player-loading">
            <div className="spinner" />
            <p>Compiling course &amp; rendering art…</p>
          </div>
        )}
        {build.status === 'ready' && (
          <iframe
            key={runId}
            className="player-frame"
            style={{ width: DEVICE_WIDTHS[device] }}
            title="Course player"
            srcDoc={build.html}
            sandbox="allow-scripts"
          />
        )}
        {build.status === 'failed' && (
          <div className="panel">
            <h2>The course cannot be played yet</h2>
            <p>Compilation was blocked by validation errors. Return to the builder and check the affected blocks:</p>
            <ul className="issue-list">
              {build.problems?.map((p, i) => (
                <li key={i}>
                  <b>{p.blockTitle}</b> in {p.lessonTitle}: {p.issues[0]?.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
