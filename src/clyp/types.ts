// ---------------------------------------------------------------------------
// Clyp — shared type definitions mirroring the .clyp schema.
// .clyp is the single source of truth (31_CLYP_FILE_FORMAT): four top-level
// sections — project / metadata / block / state. Every application feature
// must be representable here before it may exist in the UI.
// ---------------------------------------------------------------------------

export const SCHEMA_VERSION = '1.0.0'
export const APPLICATION_VERSION = '1.0.0'

// --- Object model (41_OBJECT_MODEL) ----------------------------------------

export type ObjectCategory = 'content' | 'container' | 'assessment' | 'scenario' | 'system'

/** The 17 curated root block types (80_BLOCK_CATALOG). */
export type BlockType =
  // Content family
  | 'heading'
  | 'paragraph'
  | 'quote'
  | 'reflection'
  | 'accordion'
  | 'tabs'
  | 'carousel'
  | 'timeline'
  | 'checklist' // supplemental: interactive completion tracking (160)
  | 'comparison' // supplemental: visual comparison (170)
  | 'chart' // supplemental: SVG visualization engine (180)
  // Assessment family
  | 'knowledgeCheck'
  | 'singleChoice'
  | 'multipleResponse'
  | 'trueFalse'
  | 'matching'
  | 'sequence'
  | 'dragDrop'
  | 'selectAll'
  // Scenario family
  | 'branchingScenario'
  | 'conversation' // supplemental: conversation engine (150)

export type BlockFamily = 'content' | 'assessment' | 'scenario'

/** Non-root object types that appear inside block structures. */
export type ChildObjectType =
  | 'panel' // accordion / tabs
  | 'slide' // carousel
  | 'event' // timeline
  | 'pool'
  | 'question'
  | 'answer'
  | 'matchpair'
  | 'sequenceitem'
  | 'dragtarget'
  | 'dropzone'
  | 'scene'
  | 'dialogue'
  | 'choice'
  | 'character'
  // supplemental block children
  | 'checkitem' // checklist (160)
  | 'comparisonColumn' // comparison (170)
  | 'comparisonRow' // comparison point (170)
  | 'chartPoint' // svg visualization (186)
  | 'chartScenario' // chart what-if scenario button (187)
  // nested content inside containers
  | 'heading'
  | 'paragraph'
  | 'quote'
  | 'reflection'

export type ObjectType = BlockType | ChildObjectType

// --- Content model (42_CONTENT_MODEL) — learner-facing text only ------------
export interface ContentModel {
  text?: string
  richText?: string
  label?: string
  prompt?: string
  instructions?: string
  description?: string
  feedbackText?: string
  dialogueText?: string
  title?: string
  quoteText?: string
  attribution?: string
  tabLabel?: string
  caption?: string
  date?: string
  leftText?: string
  rightText?: string
  // Ending-scene outcome fields (101_SCENE_MODEL)
  outcomeTitle?: string
  outcomeDescription?: string
  outcomeFeedback?: string
  outcomeSummary?: string
}

// --- Variables & conditions (104/105) ---------------------------------------
export type VariableType = 'score' | 'boolean' | 'numeric' | 'text' | 'completion'

export interface Variable {
  id: string // "variable_###"
  name: string
  variableType: VariableType
  initialValue: number | boolean | string
}

export type VariableOperation = 'set' | 'increment' | 'decrement' | 'append'

export interface VariableAssignment {
  variableId: string
  operation: VariableOperation
  value: number | boolean | string
}

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'contains'

export interface Condition {
  id: string // "condition_###"
  variableId: string
  operator: ConditionOperator
  value: number | boolean | string
}

export interface ConditionGroup {
  combinator: 'AND' | 'OR'
  conditions: Condition[]
}

// --- Logic model (43_LOGIC_MODEL) -------------------------------------------
// Block Logic lives only on the Root; Object Logic only on non-root objects.
export interface LogicModel {
  // Block Logic (root only)
  passingScore?: number
  attemptsAllowed?: 'unlimited' | number
  completionRule?: 'passingScore' | 'anyCompletion'
  gatekeeping?: boolean
  variables?: Variable[] // scenario: declared at Block Logic level (104)
  // Object Logic (non-root only)
  targetSceneId?: string // choice navigation (103)
  variableAssignments?: VariableAssignment[]
  conditionGroup?: ConditionGroup // gates scene entry / choice availability (105)
  score?: number // answer-level scoring (90)
  isCorrect?: boolean
  correctZoneId?: string // drag & drop target (97)
  speakerCharacterId?: string // dialogue (102)
  value?: number // chart data point value (186)
  // Chart scenario (187): one value per base data point, in the same order.
  // Lets a learner-pressed button show the effect of an intervention.
  values?: number[]
}

// --- Feedback Engine (141–144) — a platform capability, not a block.
// Any object may carry a feedback config; blocks render it via the shared
// feedback runtime. Kept self-contained: no cross-block or LMS communication.
export type FeedbackTemplate =
  | 'success'
  | 'warning'
  | 'error'
  | 'hint'
  | 'tip'
  | 'reminder'
  | 'bestPractice'
  | 'managerFeedback'
  | 'customerFeedback'
  | 'coachFeedback'

export type FeedbackDisplay = 'inline' | 'popup' | 'banner' | 'callout'

// --- Settings model (44_SETTINGS_MODEL) — intrinsic visual configuration ----
export interface SettingsModel {
  backgroundColor?: string
  textColor?: string
  accentColor?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  textAlignment?: 'left' | 'center' | 'right' | 'justify'
  lineSpacing?: number
  animation?: 'none' | 'fade' | 'slide'
  // Block-type-specific configuration
  headingLevel?: 'h2' | 'h3' | 'h4'
  quoteStyle?: 'standard' | 'pullQuote'
  responseAreaSize?: 'small' | 'medium' | 'large'
  expandBehavior?: 'singleOpen' | 'multiOpen'
  defaultActiveTab?: number
  autoAdvance?: boolean
  autoAdvanceInterval?: number
  visualPreset?: 'horizontal' | 'vertical' | 'alternating'
  randomization?: 'none' | 'random' | 'rotate'
  questionType?: QuestionType
  scoringMode?: 'allOrNothing' | 'perAnswer'
  shuffleAnswers?: boolean
  // Scenario (101/106/107)
  sceneType?: 'start' | 'standard' | 'ending'
  backgroundId?: string
  allowRestart?: boolean
  baseCharacter?: string // legacy (pre-role-system files)
  characterRole?: string
  characterGender?: 'female' | 'male'
  characterAge?: 'young' | 'adult' | 'senior'
  characterSkinTone?: 'light' | 'medium' | 'deep'
  expression?: string
  gesture?: string
  // Supplemental blocks
  completionMode?: 'allRequired' | 'minimumRequired' | 'optional' // checklist (160)
  minRequired?: number // checklist minimumRequired
  required?: boolean // checkitem
  comparisonPreset?:
    | 'beforeAfter'
    | 'currentFuture'
    | 'correctIncorrect'
    | 'optionAB'
    | 'productAB'
    | 'processAB'
    | 'custom'
  comparisonLayout?: 'vertical' | 'horizontal' | 'stacked' | 'card'
  chartType?: 'bar' | 'line' | 'pie' | 'donut' | 'radar' // svg viz (180)
  showLegend?: boolean
  showValues?: boolean
  // Completion Gate (gatekeeping + gamification) — any interactive block can
  // require the learner to explore every item before it counts as complete.
  gateEnabled?: boolean
  gateReminder?: string // shown while the requirement is unmet
  gateReminderTemplate?: FeedbackTemplate
  gateMessage?: string // shown once satisfied (replaces the reminder)
  gateTemplate?: FeedbackTemplate
  gateShowProgress?: boolean
  conversationTemplate?:
    | 'corporateChat'
    | 'sms'
    | 'messenger'
    | 'teams'
    | 'slack'
    | 'supportTicket'
    | 'emailThread'
    | 'generic'
  // Feedback config (141) — carried on any object that emits feedback
  feedbackTemplate?: FeedbackTemplate
  feedbackDisplay?: FeedbackDisplay
}

export type QuestionType =
  | 'singleChoice'
  | 'multipleResponse'
  | 'trueFalse'
  | 'matching'
  | 'sequence'
  | 'dragDrop'
  | 'selectAll'
  | 'knowledgeCheck'

// --- Layout model (45_LAYOUT_MODEL) — inter-object arrangement --------------
export interface LayoutModel {
  spacing?: number
  alignment?: 'start' | 'center' | 'end' | 'stretch'
  order?: number
  size?: { width: number | 'auto'; height: number | 'auto' }
}

// --- The generic object (41_OBJECT_MODEL) ------------------------------------
export interface ClypObject {
  id: string // "type_###" — permanent, never reused
  type: ObjectType
  category: ObjectCategory
  name?: string // author-facing display name (scene tree rename)
  parentId: string | null // null only for the Root
  children: string[]
  content: ContentModel
  logic: LogicModel // always present, possibly empty (43)
  settings: SettingsModel
  layout: LayoutModel
}

// --- Top-level .clyp sections -------------------------------------------------
export interface ProjectSection {
  name: string
  uuid: string
  createdDate: string
  modifiedDate: string
  applicationVersion: string
  schemaVersion: string
}

export interface MetadataSection {
  projectMetadata: Record<string, unknown>
  compilerMetadata: {
    idCounters: Record<string, number> // per-type monotonic counters (41 Debug Note)
    assetNameCounters: Record<string, number>
    [key: string]: unknown
  }
  compatibilityMetadata: {
    minSupportedSchemaVersion: string
    migrationsApplied: string[]
    [key: string]: unknown
  }
  runtimeMetadata: Record<string, unknown>
  adapterMetadata: Record<string, unknown>
}

export interface BlockSection {
  blockType: BlockType
  rootId: string
  objects: Record<string, ClypObject>
}

export interface UndoSnapshot {
  timestamp: string
  block: BlockSection
  selection: string | null
}

export interface StateSection {
  uiState: {
    selection: string | null
    expandedNodes: string[]
    activeView: 'canvas' | 'preview'
  }
  previewState: {
    activeDevice: 'mobile' | 'tablet' | 'desktop'
  }
  undoState: {
    snapshots: UndoSnapshot[]
    currentIndex: number
  }
}

/** The complete .clyp file — the authoritative representation of a project. */
export interface ClypFile {
  project: ProjectSection
  metadata: MetadataSection
  block: BlockSection
  state: StateSection
}

// --- Validation (50_VALIDATION_ARCHITECTURE) ----------------------------------
export type Severity = 'critical' | 'error' | 'warning' | 'recommendation'
export type ValidationCategory =
  | 'project'
  | 'block'
  | 'logic'
  | 'assessment'
  | 'scenario'
  | 'compiler'
  | 'export'

export interface ValidationIssue {
  severity: Severity
  category: ValidationCategory
  location: string
  object?: string
  description: string
  suggestedResolution: string
}

export interface ValidationResult {
  passed: boolean
  issues: ValidationIssue[]
}

// --- Breakpoints (111_BREAKPOINT_STANDARD) -------------------------------------
export const BREAKPOINTS = {
  mobile: { min: 0, max: 767, previewWidth: 375 },
  tablet: { min: 768, max: 1023, previewWidth: 768 },
  desktop: { min: 1024, max: null as number | null, previewWidth: 1280 }
}

// --- Preload API ---------------------------------------------------------------
export interface ClypAPI {
  openDialog: () => Promise<string | null>
  saveDialog: (suggestedName: string) => Promise<string | null>
  readFile: (filePath: string) => Promise<{ ok: boolean; text?: string; error?: string }>
  writeFile: (filePath: string, text: string) => Promise<{ ok: boolean; error?: string }>
  writeClipboard: (text: string) => Promise<{ ok: boolean; error?: string }>
  // Present only under the Electron preload; the dev shim omits it.
  rendererReady?: () => void
}

declare global {
  interface Window {
    clypAPI: ClypAPI
  }
}
