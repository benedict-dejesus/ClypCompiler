// ClypCompiler — course/lesson data model.
// A course is an ordered set of lessons; a lesson is an ordered set of blocks.
// Each block is an imported .clyp file (kept verbatim so it can be re-compiled
// at any time) plus course-level metadata layered on top of it.
import type { ClypFile } from '../clyp/types'
import type { PastedBlock } from '../clyp/parsePasted'
import type { PhotoAsset } from '../art/photoLibrary'

export const COURSE_SCHEMA_VERSION = '1.0.0'
export const COMPILER_VERSION = '1.0.0'

// --- Themes -----------------------------------------------------------------
export interface ThemeSpec {
  id: string
  label: string
  /** CSS custom property values applied to the player shell. */
  vars: {
    primary: string
    primaryDark: string
    accent: string
    bg: string
    surface: string
    text: string
    muted: string
    sidebarBg: string
    sidebarText: string
  }
  fontFamily: string
}

export const THEMES: ThemeSpec[] = [
  {
    id: 'clyp',
    label: 'Clyp Teal',
    vars: {
      primary: '#015061', primaryDark: '#013844', accent: '#00c18e',
      bg: '#f2f7f8', surface: '#ffffff', text: '#12292e', muted: '#3d5f6a',
      sidebarBg: '#013844', sidebarText: '#d7f0ea'
    },
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  {
    id: 'midnight',
    label: 'Midnight',
    vars: {
      primary: '#4f6df5', primaryDark: '#2b3a8f', accent: '#8b9dff',
      bg: '#12141c', surface: '#1c1f2b', text: '#e8eaf2', muted: '#9aa1b5',
      sidebarBg: '#0c0e14', sidebarText: '#c3c9dd'
    },
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    vars: {
      primary: '#d9480f', primaryDark: '#a33208', accent: '#f7b733',
      bg: '#fdf6ef', surface: '#ffffff', text: '#3b2417', muted: '#8a6a55',
      sidebarBg: '#41220f', sidebarText: '#f5dfc8'
    },
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  {
    id: 'forest',
    label: 'Forest',
    vars: {
      primary: '#2b7a3f', primaryDark: '#1d5730', accent: '#8bc34a',
      bg: '#f3f8f2', surface: '#ffffff', text: '#1c2b1e', muted: '#557a5c',
      sidebarBg: '#173d22', sidebarText: '#d3ecd8'
    },
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  {
    id: 'corporate',
    label: 'Corporate Slate',
    vars: {
      primary: '#1f4e79', primaryDark: '#14344f', accent: '#5b9bd5',
      bg: '#f4f6f8', surface: '#ffffff', text: '#20262c', muted: '#5c6771',
      sidebarBg: '#1a2733', sidebarText: '#cfd9e2'
    },
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  },
  {
    id: 'plum',
    label: 'Plum',
    vars: {
      primary: '#7b2d8b', primaryDark: '#571f63', accent: '#c86dd7',
      bg: '#faf4fb', surface: '#ffffff', text: '#2e1a33', muted: '#7a5a84',
      sidebarBg: '#3c1444', sidebarText: '#ecd6f1'
    },
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  }
]

export function themeById(id: string | undefined): ThemeSpec {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

// --- Gamification -----------------------------------------------------------
export interface BadgeSpec {
  id: string
  label: string
  /** Emoji used as the badge glyph in the player. */
  icon: string
  /** 'lesson' badges unlock when the named lesson completes; 'course' on full completion; 'xp' at a threshold. */
  kind: 'lesson' | 'course' | 'xp'
  lessonId?: string
  xpThreshold?: number
}

export interface GamificationSettings {
  enabled: boolean
  xpPerBlock: number
  xpPerGatedBlock: number
  xpLessonBonus: number
  showXpBar: boolean
  showBadges: boolean
  showLevel: boolean
  /** XP needed per level (level = floor(xp / xpPerLevel) + 1). */
  xpPerLevel: number
  badges: BadgeSpec[]
}

export const DEFAULT_GAMIFICATION: GamificationSettings = {
  enabled: true,
  xpPerBlock: 10,
  xpPerGatedBlock: 25,
  xpLessonBonus: 50,
  showXpBar: true,
  showBadges: true,
  showLevel: true,
  xpPerLevel: 100,
  badges: []
}

// --- Gatekeeping ------------------------------------------------------------
export interface GatekeepingSettings {
  /** 'free' — learner can open any lesson; 'linear' — lessons unlock in order. */
  navigation: 'free' | 'linear'
  /**
   * What marks a lesson complete:
   *  'viewed'      — every block scrolled into view
   *  'gates'       — every gated (interactive) block satisfied; others on view
   */
  lessonCompletion: 'viewed' | 'gates'
  /** Show a lock icon + explanation on locked lessons. */
  showLocks: boolean
  /** Require full course completion before the completion certificate screen. */
  completionScreen: boolean
}

export const DEFAULT_GATEKEEPING: GatekeepingSettings = {
  navigation: 'linear',
  lessonCompletion: 'gates',
  showLocks: true,
  completionScreen: true
}

// --- Assets -----------------------------------------------------------------
export interface AssetItem {
  id: string
  name: string
  /** MIME type, e.g. image/png, image/svg+xml. */
  mime: string
  /** data: URL — kept inline so projects are one self-contained JSON file. */
  dataUrl: string
  addedDate: string
}

/**
 * One replaceable visual slot inside a compiled block: the Nth outermost
 * <svg> or <img> element in the block's HTML, in document order.
 */
export interface AssetOverride {
  /** Index of the slot within the block's HTML (document order). */
  slotIndex: number
  assetId: string
  /** How the replacement image fills the original element's box. */
  fit: 'cover' | 'contain'
}

// --- Blocks & lessons -------------------------------------------------------
export interface CourseBlock {
  id: string
  /** Display title in the builder (defaults to the .clyp project name). */
  title: string
  /**
   * How this block entered the course:
   *  'clyp'   — a .clyp source file, recompiled by ClypCompiler on every export
   *             (can be re-validated and re-rendered with photoreal art)
   *  'pasted' — clypped code pasted from Clyp, already compiled, embedded as-is
   * Absent on projects created before pasted blocks existed; treat as 'clyp'.
   */
  source?: 'clyp' | 'pasted'
  /** The imported .clyp file, verbatim. Present when source is 'clyp'. */
  clyp?: ClypFile
  /** Pre-compiled block. Present when source is 'pasted'. */
  pasted?: PastedBlock
  /** Original file name of the import, for reference. */
  sourceFileName: string
  /** Asset replacements applied to this block's compiled HTML. */
  assetOverrides: AssetOverride[]
  /** Per-block XP override; null uses the course default. */
  xpOverride: number | null
}

/** True when the block is pre-compiled clypped code rather than .clyp source. */
export function isPastedBlock(
  block: CourseBlock
): block is CourseBlock & { pasted: PastedBlock } {
  return block.source === 'pasted' && !!block.pasted
}

/** True when the block carries recompilable .clyp source. */
export function isClypBlock(block: CourseBlock): block is CourseBlock & { clyp: ClypFile } {
  return !!block.clyp
}

export interface Lesson {
  id: string
  title: string
  description: string
  blockIds: string[]
  /** Per-lesson theme override; null inherits the course theme. */
  themeId: string | null
  /** Optional badge icon shown when this lesson completes (empty = default). */
  badgeIcon: string
}

export interface CourseMeta {
  title: string
  description: string
  author: string
  organization: string
  language: string
  version: string
}

/**
 * How scenario/conversation character and scene art is produced:
 *  'photo'       — use your own photoreal images from the photography library,
 *                  falling back to rendered art for anything not yet supplied
 *  'rendered'    — raster renditions of Clyp's vector art from the art engine
 *  'illustrated' — keep Clyp's original inline SVG art
 */
export type ArtStyle = 'photo' | 'rendered' | 'illustrated'

export interface Course {
  uuid: string
  schemaVersion: string
  createdDate: string
  modifiedDate: string
  meta: CourseMeta
  themeId: string
  artStyle?: ArtStyle
  lessons: Lesson[]
  blocks: Record<string, CourseBlock>
  assets: AssetItem[]
  gamification: GamificationSettings
  gatekeeping: GatekeepingSettings
  /** Bring-your-own photoreal art, matched to characters/scenes by filename. */
  photos?: PhotoAsset[]
}

export function newCourse(title: string): Course {
  const now = new Date().toISOString()
  return {
    uuid: crypto.randomUUID(),
    schemaVersion: COURSE_SCHEMA_VERSION,
    createdDate: now,
    modifiedDate: now,
    meta: {
      title,
      description: '',
      author: '',
      organization: '',
      language: 'en',
      version: '1.0'
    },
    themeId: 'clyp',
    artStyle: 'photo',
    photos: [],
    lessons: [newLesson('Lesson 1')],
    blocks: {},
    assets: [],
    gamification: { ...DEFAULT_GAMIFICATION, badges: [] },
    gatekeeping: { ...DEFAULT_GATEKEEPING }
  }
}

export function newLesson(title: string): Lesson {
  return {
    id: crypto.randomUUID(),
    title,
    description: '',
    blockIds: [],
    themeId: null,
    badgeIcon: ''
  }
}
