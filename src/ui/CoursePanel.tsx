import { useStore } from '../store/store'
import { THEMES, type BadgeSpec } from '../model/course'

export function CoursePanel() {
  const course = useStore((s) => s.course)
  const mutate = useStore((s) => s.mutate)
  if (!course) return null

  const g = course.gamification
  const gate = course.gatekeeping

  const addBadge = () => {
    const badge: BadgeSpec = {
      id: crypto.randomUUID(),
      label: 'New badge',
      icon: '⭐',
      kind: 'xp',
      xpThreshold: 100
    }
    mutate((c) => c.gamification.badges.push(badge))
  }

  return (
    <div className="panel">
      <h2>Course settings</h2>

      <section className="card">
        <h3>Details</h3>
        <div className="form-grid">
          <label>
            Title
            <input
              value={course.meta.title}
              onChange={(e) => mutate((c) => void (c.meta.title = e.target.value))}
            />
          </label>
          <label>
            Version
            <input
              value={course.meta.version}
              onChange={(e) => mutate((c) => void (c.meta.version = e.target.value))}
            />
          </label>
          <label className="span-2">
            Description
            <textarea
              rows={2}
              value={course.meta.description}
              onChange={(e) => mutate((c) => void (c.meta.description = e.target.value))}
            />
          </label>
          <label>
            Author
            <input
              value={course.meta.author}
              onChange={(e) => mutate((c) => void (c.meta.author = e.target.value))}
            />
          </label>
          <label>
            Organization
            <input
              value={course.meta.organization}
              onChange={(e) => mutate((c) => void (c.meta.organization = e.target.value))}
            />
          </label>
          <label>
            Language code
            <input
              value={course.meta.language}
              onChange={(e) => mutate((c) => void (c.meta.language = e.target.value))}
            />
          </label>
        </div>
      </section>

      <section className="card">
        <h3>Course theme</h3>
        <p className="hint">Applied to the whole course player. Individual lessons can override it.</p>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-chip ${course.themeId === t.id ? 'is-selected' : ''}`}
              onClick={() => mutate((c) => void (c.themeId = t.id))}
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

      <section className="card">
        <h3>Character &amp; scene art</h3>
        <p className="hint">
          Blocks with characters and scene backgrounds (branching scenarios, conversations) can use the
          built-in art engine: every character variant and background your course uses is automatically
          rendered as a high-resolution image at compile time.
        </p>
        <div className="art-style-grid">
          <button
            className={`art-style-chip ${(course.artStyle ?? 'rendered') === 'rendered' ? 'is-selected' : ''}`}
            onClick={() => mutate((c) => void (c.artStyle = 'rendered'))}
          >
            <b>✨ Rendered</b>
            <span>High-end raster art — cinematic grade, soft shadows, film grain (PNG/JPG)</span>
          </button>
          <button
            className={`art-style-chip ${course.artStyle === 'illustrated' ? 'is-selected' : ''}`}
            onClick={() => mutate((c) => void (c.artStyle = 'illustrated'))}
          >
            <b>✏️ Illustrated</b>
            <span>Clyp's original vector art — smallest file size, infinitely sharp</span>
          </button>
        </div>
      </section>

      <section className="card">
        <h3>Gamification</h3>
        <label className="check">
          <input
            type="checkbox"
            checked={g.enabled}
            onChange={(e) => mutate((c) => void (c.gamification.enabled = e.target.checked))}
          />
          Enable XP, levels and badges
        </label>
        {g.enabled && (
          <>
            <div className="form-grid">
              <label>
                XP per content block
                <input
                  type="number" min={0}
                  value={g.xpPerBlock}
                  onChange={(e) => mutate((c) => void (c.gamification.xpPerBlock = Math.max(0, Number(e.target.value) || 0)))}
                />
              </label>
              <label>
                XP per interactive (gated) block
                <input
                  type="number" min={0}
                  value={g.xpPerGatedBlock}
                  onChange={(e) => mutate((c) => void (c.gamification.xpPerGatedBlock = Math.max(0, Number(e.target.value) || 0)))}
                />
              </label>
              <label>
                Lesson completion bonus
                <input
                  type="number" min={0}
                  value={g.xpLessonBonus}
                  onChange={(e) => mutate((c) => void (c.gamification.xpLessonBonus = Math.max(0, Number(e.target.value) || 0)))}
                />
              </label>
              <label>
                XP per level
                <input
                  type="number" min={1}
                  value={g.xpPerLevel}
                  onChange={(e) => mutate((c) => void (c.gamification.xpPerLevel = Math.max(1, Number(e.target.value) || 1)))}
                />
              </label>
            </div>
            <div className="check-row">
              <label className="check">
                <input type="checkbox" checked={g.showXpBar}
                  onChange={(e) => mutate((c) => void (c.gamification.showXpBar = e.target.checked))} />
                Show XP bar
              </label>
              <label className="check">
                <input type="checkbox" checked={g.showLevel}
                  onChange={(e) => mutate((c) => void (c.gamification.showLevel = e.target.checked))} />
                Show level
              </label>
              <label className="check">
                <input type="checkbox" checked={g.showBadges}
                  onChange={(e) => mutate((c) => void (c.gamification.showBadges = e.target.checked))} />
                Award badges (per lesson + course champion)
              </label>
            </div>

            <h4>Custom badges</h4>
            <p className="hint">Extra badges on top of the automatic lesson and course badges.</p>
            {g.badges.map((b, i) => (
              <div key={b.id} className="badge-row">
                <input
                  className="badge-icon-input"
                  value={b.icon}
                  title="Badge icon (emoji)"
                  onChange={(e) => mutate((c) => void (c.gamification.badges[i].icon = e.target.value))}
                />
                <input
                  value={b.label}
                  placeholder="Badge name"
                  onChange={(e) => mutate((c) => void (c.gamification.badges[i].label = e.target.value))}
                />
                <select
                  value={b.kind}
                  onChange={(e) =>
                    mutate((c) => void (c.gamification.badges[i].kind = e.target.value as BadgeSpec['kind']))
                  }
                >
                  <option value="xp">At XP threshold</option>
                  <option value="lesson">On lesson complete</option>
                  <option value="course">On course complete</option>
                </select>
                {b.kind === 'xp' && (
                  <input
                    type="number" min={0}
                    value={b.xpThreshold ?? 0}
                    onChange={(e) =>
                      mutate((c) => void (c.gamification.badges[i].xpThreshold = Math.max(0, Number(e.target.value) || 0)))
                    }
                  />
                )}
                {b.kind === 'lesson' && (
                  <select
                    value={b.lessonId ?? ''}
                    onChange={(e) => mutate((c) => void (c.gamification.badges[i].lessonId = e.target.value))}
                  >
                    <option value="">Choose lesson…</option>
                    {course.lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => mutate((c) => void c.gamification.badges.splice(i, 1))}
                >
                  ✕
                </button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addBadge}>
              + Add custom badge
            </button>
          </>
        )}
      </section>

      <section className="card">
        <h3>Gatekeeping</h3>
        <div className="form-grid">
          <label>
            Lesson navigation
            <select
              value={gate.navigation}
              onChange={(e) => mutate((c) => void (c.gatekeeping.navigation = e.target.value as 'free' | 'linear'))}
            >
              <option value="linear">Linear — lessons unlock in order</option>
              <option value="free">Free — learners may jump anywhere</option>
            </select>
          </label>
          <label>
            A block counts as complete when…
            <select
              value={gate.lessonCompletion}
              onChange={(e) =>
                mutate((c) => void (c.gatekeeping.lessonCompletion = e.target.value as 'viewed' | 'gates'))
              }
            >
              <option value="gates">Interactive blocks: gate satisfied · others: viewed</option>
              <option value="viewed">Every block: simply viewed</option>
            </select>
          </label>
        </div>
        <div className="check-row">
          <label className="check">
            <input type="checkbox" checked={gate.showLocks}
              onChange={(e) => mutate((c) => void (c.gatekeeping.showLocks = e.target.checked))} />
            Show locks on unavailable lessons
          </label>
          <label className="check">
            <input type="checkbox" checked={gate.completionScreen}
              onChange={(e) => mutate((c) => void (c.gatekeeping.completionScreen = e.target.checked))} />
            Show completion screen at the end
          </label>
        </div>
      </section>
    </div>
  )
}
