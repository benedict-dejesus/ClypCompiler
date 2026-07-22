// ClypCompiler — course template authoring format.
//
// Templates are stored in this compact form rather than as expanded .clyp
// files: the prose is the irreducible part, while the .clyp object model is
// mechanical scaffolding. Storing the compact form keeps 100 courses to about
// a megabyte instead of several, so the whole library ships inside the bundle
// and works offline with no fetches. `buildCourse.ts` expands a template into
// real .clyp blocks on demand.

export type Level = 'h2' | 'h3' | 'h4'

/** A character in a scenario or conversation. */
export interface TplCast {
  /** Author-facing key used by dialogue lines, e.g. 'nurse'. */
  key: string
  name: string
  role: string
  gender: 'female' | 'male'
  age: 'young' | 'adult' | 'senior'
  tone: 'light' | 'medium' | 'deep'
}

export interface TplDialogue {
  /** Cast key of the speaker. */
  who: string
  text: string
  expression?: string
  gesture?: string
}

export interface TplChoice {
  label: string
  /** Scene key this choice leads to. */
  to: string
  feedback?: string
}

export interface TplScene {
  /** Author-facing key, referenced by choices. */
  key: string
  name: string
  type?: 'start' | 'standard' | 'ending'
  background?: string
  dialogue: TplDialogue[]
  choices?: TplChoice[]
  /** Ending scenes only. */
  outcomeTitle?: string
  outcomeDescription?: string
}

export interface TplAnswer {
  text: string
  correct?: boolean
  feedback?: string
  score?: number
}

export interface TplQuestion {
  prompt: string
  feedback?: string
  answers: TplAnswer[]
}

/** Every authorable block. `t` is the discriminator. */
export type TplBlock =
  | { t: 'heading'; text: string; level?: Level }
  | { t: 'para'; html: string }
  | { t: 'quote'; text: string; by?: string; pull?: boolean }
  | { t: 'reflect'; prompt: string; size?: 'small' | 'medium' | 'large' }
  | {
      t: 'accordion'
      panels: { title: string; body: string }[]
      multi?: boolean
      gate?: boolean
      gateMessage?: string
    }
  | { t: 'tabs'; panels: { title: string; body: string }[]; gate?: boolean; gateMessage?: string }
  | {
      t: 'carousel'
      slides: { caption?: string; heading?: string; body: string }[]
      gate?: boolean
      gateMessage?: string
    }
  | {
      t: 'timeline'
      preset?: 'horizontal' | 'vertical' | 'alternating'
      events: { label: string; date?: string; body: string }[]
    }
  | {
      t: 'checklist'
      title: string
      done?: string
      mode?: 'allRequired' | 'minimumRequired' | 'optional'
      min?: number
      items: { text: string; required?: boolean }[]
    }
  | {
      t: 'comparison'
      title: string
      preset?: 'beforeAfter' | 'currentFuture' | 'correctIncorrect' | 'optionAB' | 'productAB' | 'processAB' | 'custom'
      layout?: 'vertical' | 'horizontal' | 'stacked' | 'card'
      columns: { title: string; accent?: string; rows: string[] }[]
    }
  | {
      t: 'chart'
      title: string
      chartType?: 'bar' | 'line' | 'pie' | 'donut' | 'radar'
      showValues?: boolean
      showLegend?: boolean
      points: { label: string; value: number; accent?: string }[]
    }
  | {
      t: 'quiz'
      kind: 'singleChoice' | 'multipleResponse' | 'selectAll' | 'trueFalse' | 'knowledgeCheck'
      poolTitle?: string
      pass?: number
      attempts?: number | 'unlimited'
      shuffle?: boolean
      scoring?: 'allOrNothing' | 'perAnswer'
      gate?: boolean
      questions: TplQuestion[]
    }
  | {
      t: 'sequence'
      poolTitle?: string
      prompt: string
      pass?: number
      attempts?: number | 'unlimited'
      gate?: boolean
      /** In the correct order; the runtime shuffles them for the learner. */
      items: string[]
    }
  | { t: 'scenario'; cast: TplCast[]; scenes: TplScene[]; gate?: boolean }
  | {
      t: 'conversation'
      template?: 'corporateChat' | 'sms' | 'messenger' | 'teams' | 'slack' | 'supportTicket' | 'emailThread' | 'generic'
      cast: TplCast[]
      scenes: TplScene[]
      gate?: boolean
    }

export interface TplLesson {
  title: string
  description: string
  /** Optional per-lesson theme override for visual variety. */
  themeId?: string | null
  badgeIcon?: string
  blocks: TplBlock[]
}

export interface TplBadge {
  label: string
  icon: string
  kind: 'lesson' | 'course' | 'xp'
  /** 1-based lesson number when kind is 'lesson'. */
  lesson?: number
  xp?: number
}

export interface CourseTemplate {
  /** Stable slug, e.g. 'meridian-health-hand-hygiene'. */
  id: string
  title: string
  /** Fictional company, industry included in the name for identification. */
  company: string
  industry: string
  /** The knowledge or skill gap this course closes. */
  gap: string
  /** Who the course is for. */
  audience: string
  /** Short marketing-style summary shown in the gallery. */
  summary: string
  /** Measurable outcomes. */
  objectives: string[]
  /** Rough completion time, minutes. */
  minutes: number
  themeId: string
  tags: string[]
  gamification?: {
    xpPerBlock?: number
    xpPerGatedBlock?: number
    xpLessonBonus?: number
    xpPerLevel?: number
    badges?: TplBadge[]
  }
  gatekeeping?: {
    navigation?: 'free' | 'linear'
    lessonCompletion?: 'viewed' | 'gates'
    completionScreen?: boolean
  }
  lessons: TplLesson[]
}

/** Metadata shown in the gallery without expanding the whole course. */
export interface TemplateSummary {
  id: string
  title: string
  company: string
  industry: string
  gap: string
  audience: string
  summary: string
  minutes: number
  themeId: string
  tags: string[]
  lessonCount: number
  blockCount: number
  lessonTitles: string[]
}
