// ClypCompiler — application store. The Course object is the single source of
// truth; every mutation stamps modifiedDate and autosaves to IndexedDB so
// work survives a refresh (important for the offline/GitHub Pages use case).
import { create } from 'zustand'
import { storageGet, storageSet, storageDel, storageKeys, STORAGE_PREFIX } from './storage'
import type { Course, Lesson, CourseBlock, AssetItem, AssetOverride } from '../model/course'
import { newCourse, newLesson, COURSE_SCHEMA_VERSION } from '../model/course'
import { parseClypFile } from '../clyp/compile'
import { parseClyppedCode } from '../clyp/parsePasted'
import { ingestPhoto, type PhotoAsset } from '../art/photoLibrary'
import { validate } from '../clyp/validator'
import type { ValidationIssue } from '../clyp/types'

const IDB_PREFIX = STORAGE_PREFIX

export interface ProjectSummary {
  uuid: string
  title: string
  modifiedDate: string
  lessonCount: number
  blockCount: number
}

export interface Notice {
  id: number
  kind: 'info' | 'success' | 'error'
  text: string
}

export interface ImportReport {
  fileName: string
  ok: boolean
  error?: string
  issues?: ValidationIssue[]
}

type View = 'start' | 'builder' | 'player'
export type SelectionKind =
  | { kind: 'course' }
  | { kind: 'assets' }
  | { kind: 'photography' }
  | { kind: 'lesson'; lessonId: string }
  | { kind: 'block'; lessonId: string; blockId: string }

interface AppState {
  view: View
  course: Course | null
  selection: SelectionKind
  projects: ProjectSummary[]
  notices: Notice[]
  dirty: boolean

  // lifecycle
  refreshProjects: () => Promise<void>
  createCourse: (title: string) => void
  openCourse: (uuid: string) => Promise<void>
  importCourseFile: (text: string) => { ok: boolean; error?: string }
  /** Loads an in-memory course (used by the template gallery). */
  loadCourse: (course: Course) => void
  closeCourse: () => void
  deleteProject: (uuid: string) => Promise<void>
  setView: (v: View) => void
  select: (s: SelectionKind) => void
  notify: (kind: Notice['kind'], text: string) => void
  dismissNotice: (id: number) => void

  // course mutations
  mutate: (fn: (c: Course) => void) => void
  addLesson: () => void
  removeLesson: (lessonId: string) => void
  moveLesson: (lessonId: string, dir: -1 | 1) => void
  importClypFiles: (files: { name: string; text: string }[], lessonId: string) => ImportReport[]
  addPastedBlock: (
    code: string,
    lessonId: string,
    title?: string
  ) => { ok: boolean; error?: string; warnings: string[]; blockId?: string }
  removeBlock: (lessonId: string, blockId: string) => void
  moveBlock: (lessonId: string, blockId: string, dir: -1 | 1) => void
  moveBlockToLesson: (fromLessonId: string, blockId: string, toLessonId: string) => void
  addAsset: (name: string, mime: string, dataUrl: string) => void
  removeAsset: (assetId: string) => void
  addPhotos: (files: FileList | File[]) => Promise<{ added: number; failed: { fileName: string; error: string }[] }>
  removePhoto: (photoId: string) => void
  clearPhotos: () => void
  setAssetOverride: (blockId: string, slotIndex: number, assetId: string | null, fit: 'cover' | 'contain') => void
}

let noticeSeq = 1

let warnedAboutPersistence = false

async function persist(course: Course, onQuotaProblem?: () => void): Promise<void> {
  const ok = await storageSet(IDB_PREFIX + course.uuid, JSON.stringify(course))
  if (!ok && !warnedAboutPersistence) {
    warnedAboutPersistence = true
    onQuotaProblem?.()
  }
}

export const useStore = create<AppState>((set, get) => ({
  view: 'start',
  course: null,
  selection: { kind: 'course' },
  projects: [],
  notices: [],
  dirty: false,

  refreshProjects: async () => {
    const out: ProjectSummary[] = []
    for (const k of await storageKeys()) {
      const raw = await storageGet(k)
      if (!raw) continue
      try {
        const c = JSON.parse(raw) as Course
        out.push({
          uuid: c.uuid,
          title: c.meta.title,
          modifiedDate: c.modifiedDate,
          lessonCount: c.lessons.length,
          blockCount: Object.keys(c.blocks).length
        })
      } catch {
        /* skip unreadable entries */
      }
    }
    out.sort((a, b) => b.modifiedDate.localeCompare(a.modifiedDate))
    set({ projects: out })
  },

  createCourse: (title) => {
    const course = newCourse(title || 'Untitled Course')
    set({ course, view: 'builder', selection: { kind: 'course' }, dirty: false })
    void persist(course)
  },

  openCourse: async (uuid) => {
    const raw = await storageGet(IDB_PREFIX + uuid)
    if (!raw) {
      get().notify('error', 'That project could not be loaded from local storage.')
      return
    }
    try {
      const course = JSON.parse(raw) as Course
      set({ course, view: 'builder', selection: { kind: 'course' }, dirty: false })
    } catch {
      get().notify('error', 'That project file is corrupted and could not be opened.')
    }
  },

  importCourseFile: (text) => {
    try {
      const course = JSON.parse(text) as Course
      if (!course || !course.uuid || !course.lessons || !course.blocks || !course.meta) {
        return { ok: false, error: 'This is not a ClypCompiler project file (.clypcourse).' }
      }
      if (!course.schemaVersion) course.schemaVersion = COURSE_SCHEMA_VERSION
      set({ course, view: 'builder', selection: { kind: 'course' }, dirty: false })
      void persist(course)
      return { ok: true }
    } catch {
      return { ok: false, error: 'The file is not valid JSON.' }
    }
  },

  loadCourse: (course) => {
    set({ course, view: 'builder', selection: { kind: 'course' }, dirty: false })
    void persist(course)
  },

  closeCourse: () => {
    set({ course: null, view: 'start', selection: { kind: 'course' } })
    void get().refreshProjects()
  },

  deleteProject: async (uuid) => {
    await storageDel(IDB_PREFIX + uuid)
    await get().refreshProjects()
  },

  setView: (v) => set({ view: v }),
  select: (s) => set({ selection: s }),

  notify: (kind, text) => {
    const id = noticeSeq++
    set((s) => ({ notices: [...s.notices, { id, kind, text }] }))
    window.setTimeout(() => get().dismissNotice(id), 5200)
  },
  dismissNotice: (id) => set((s) => ({ notices: s.notices.filter((n) => n.id !== id) })),

  mutate: (fn) => {
    const course = get().course
    if (!course) return
    const next = structuredClone(course)
    fn(next)
    next.modifiedDate = new Date().toISOString()
    set({ course: next, dirty: true })
    void persist(next, () =>
      get().notify(
        'error',
        'This course is too large to autosave in browser storage. Use "Save project" to keep a .clypcourse file — your work is safe in this session.'
      )
    )
  },

  addLesson: () => {
    const n = (get().course?.lessons.length ?? 0) + 1
    const lesson = newLesson(`Lesson ${n}`)
    get().mutate((c) => c.lessons.push(lesson))
    set({ selection: { kind: 'lesson', lessonId: lesson.id } })
  },

  removeLesson: (lessonId) => {
    get().mutate((c) => {
      const lesson = c.lessons.find((l) => l.id === lessonId)
      if (!lesson) return
      for (const bid of lesson.blockIds) delete c.blocks[bid]
      c.lessons = c.lessons.filter((l) => l.id !== lessonId)
      c.gamification.badges = c.gamification.badges.filter((b) => b.lessonId !== lessonId)
    })
    set({ selection: { kind: 'course' } })
  },

  moveLesson: (lessonId, dir) => {
    get().mutate((c) => {
      const i = c.lessons.findIndex((l) => l.id === lessonId)
      const j = i + dir
      if (i < 0 || j < 0 || j >= c.lessons.length) return
      const [l] = c.lessons.splice(i, 1)
      c.lessons.splice(j, 0, l)
    })
  },

  importClypFiles: (files, lessonId) => {
    const reports: ImportReport[] = []
    const additions: CourseBlock[] = []
    for (const f of files) {
      const parsed = parseClypFile(f.text)
      if (!parsed.ok) {
        reports.push({ fileName: f.name, ok: false, error: parsed.error })
        continue
      }
      // Compiler Logic stage 2: full validation on import so problems surface
      // in the builder, not at export time. Warnings import fine.
      const validation = validate(parsed.clyp)
      const blocking = validation.issues.filter((i) => i.severity === 'critical' || i.severity === 'error')
      if (blocking.length > 0) {
        reports.push({ fileName: f.name, ok: false, error: 'Validation failed', issues: blocking })
        continue
      }
      additions.push({
        id: crypto.randomUUID(),
        title: parsed.clyp.project.name || f.name.replace(/\.clyp$/i, ''),
        clyp: parsed.clyp,
        sourceFileName: f.name,
        assetOverrides: [],
        xpOverride: null
      })
      reports.push({ fileName: f.name, ok: true, issues: validation.issues })
    }
    if (additions.length > 0) {
      get().mutate((c) => {
        const lesson = c.lessons.find((l) => l.id === lessonId)
        if (!lesson) return
        for (const b of additions) {
          c.blocks[b.id] = b
          lesson.blockIds.push(b.id)
        }
      })
    }
    return reports
  },

  addPastedBlock: (code, lessonId, title) => {
    const parsed = parseClyppedCode(code)
    if (!parsed.ok || !parsed.block) {
      return { ok: false, error: parsed.error, warnings: parsed.warnings }
    }
    const id = crypto.randomUUID()
    const b = parsed.block
    const block: CourseBlock = {
      id,
      title: (title || '').trim() || b.projectName || b.blockLabel,
      source: 'pasted',
      pasted: b,
      sourceFileName: 'pasted clypped code',
      assetOverrides: [],
      xpOverride: null
    }
    get().mutate((c) => {
      const lesson = c.lessons.find((l) => l.id === lessonId)
      if (!lesson) return
      c.blocks[id] = block
      lesson.blockIds.push(id)
    })
    set({ selection: { kind: 'block', lessonId, blockId: id } })
    return { ok: true, warnings: parsed.warnings, blockId: id }
  },

  removeBlock: (lessonId, blockId) => {
    get().mutate((c) => {
      const lesson = c.lessons.find((l) => l.id === lessonId)
      if (lesson) lesson.blockIds = lesson.blockIds.filter((id) => id !== blockId)
      delete c.blocks[blockId]
    })
    set({ selection: { kind: 'lesson', lessonId } })
  },

  moveBlock: (lessonId, blockId, dir) => {
    get().mutate((c) => {
      const lesson = c.lessons.find((l) => l.id === lessonId)
      if (!lesson) return
      const i = lesson.blockIds.indexOf(blockId)
      const j = i + dir
      if (i < 0 || j < 0 || j >= lesson.blockIds.length) return
      lesson.blockIds.splice(i, 1)
      lesson.blockIds.splice(j, 0, blockId)
    })
  },

  moveBlockToLesson: (fromLessonId, blockId, toLessonId) => {
    get().mutate((c) => {
      const from = c.lessons.find((l) => l.id === fromLessonId)
      const to = c.lessons.find((l) => l.id === toLessonId)
      if (!from || !to || from === to) return
      from.blockIds = from.blockIds.filter((id) => id !== blockId)
      to.blockIds.push(blockId)
    })
    set({ selection: { kind: 'block', lessonId: toLessonId, blockId } })
  },

  addAsset: (name, mime, dataUrl) => {
    const asset: AssetItem = {
      id: crypto.randomUUID(),
      name,
      mime,
      dataUrl,
      addedDate: new Date().toISOString()
    }
    get().mutate((c) => c.assets.push(asset))
  },

  removeAsset: (assetId) => {
    get().mutate((c) => {
      c.assets = c.assets.filter((a) => a.id !== assetId)
      for (const b of Object.values(c.blocks)) {
        b.assetOverrides = b.assetOverrides.filter((o) => o.assetId !== assetId)
      }
    })
  },

  addPhotos: async (files) => {
    const list = Array.from(files)
    const accepted: PhotoAsset[] = []
    const failed: { fileName: string; error: string }[] = []
    for (const file of list) {
      const result = await ingestPhoto(file)
      if (result.ok && result.asset) accepted.push(result.asset)
      else failed.push({ fileName: result.fileName, error: result.error ?? 'Could not import.' })
    }
    if (accepted.length > 0) {
      get().mutate((c) => {
        if (!c.photos) c.photos = []
        for (const p of accepted) {
          // Re-dropping the same filename replaces the previous version.
          c.photos = c.photos.filter((existing) => existing.key !== p.key)
          c.photos.push(p)
        }
      })
    }
    return { added: accepted.length, failed }
  },

  removePhoto: (photoId) => {
    get().mutate((c) => {
      c.photos = (c.photos ?? []).filter((p) => p.id !== photoId)
    })
  },

  clearPhotos: () => {
    get().mutate((c) => {
      c.photos = []
    })
  },

  setAssetOverride: (blockId, slotIndex, assetId, fit) => {
    get().mutate((c) => {
      const block = c.blocks[blockId]
      if (!block) return
      block.assetOverrides = block.assetOverrides.filter((o) => o.slotIndex !== slotIndex)
      if (assetId) {
        const o: AssetOverride = { slotIndex, assetId, fit }
        block.assetOverrides.push(o)
      }
    })
  }
}))

/** Serializes the current course to pretty JSON for a .clypcourse download. */
export function courseToFileText(course: Course): string {
  return JSON.stringify(course, null, 2)
}
