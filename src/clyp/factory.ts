// Clyp — object & project factories.
// Object IDs use the permanent "type_###" format with per-type monotonic
// counters persisted in metadata.compilerMetadata.idCounters (41_OBJECT_MODEL
// Debug Note): deleted IDs are retired forever and never reissued.
import type {
  BlockSection,
  BlockType,
  ClypFile,
  ClypObject,
  MetadataSection,
  ObjectType,
  QuestionType
} from './types'
import { APPLICATION_VERSION, SCHEMA_VERSION } from './types'
import { categoryFor, catalogEntry } from './catalog'

/** Reads and increments the per-type counter; returns the new permanent ID. */
export function nextId(metadata: MetadataSection, type: ObjectType | 'variable' | 'condition'): string {
  const counters = metadata.compilerMetadata.idCounters
  const next = (counters[type] ?? 0) + 1
  counters[type] = next
  return `${type}_${String(next).padStart(3, '0')}`
}

export function makeObject(
  metadata: MetadataSection,
  type: ObjectType,
  parentId: string | null,
  init?: Partial<ClypObject>
): ClypObject {
  return {
    id: nextId(metadata, type),
    type,
    category: categoryFor(type),
    parentId,
    children: [],
    content: {},
    logic: {}, // always present, possibly empty (43_LOGIC_MODEL)
    settings: {},
    layout: {},
    ...init
  }
}

function uuid(): string {
  return crypto.randomUUID()
}

function emptyMetadata(): MetadataSection {
  return {
    projectMetadata: {},
    compilerMetadata: { idCounters: {}, assetNameCounters: {} },
    compatibilityMetadata: { minSupportedSchemaVersion: '1.0.0', migrationsApplied: [] },
    runtimeMetadata: {},
    adapterMetadata: {}
  }
}

function add(block: BlockSection, obj: ClypObject): ClypObject {
  block.objects[obj.id] = obj
  if (obj.parentId) {
    const parent = block.objects[obj.parentId]
    if (parent && !parent.children.includes(obj.id)) parent.children.push(obj.id)
  }
  return obj
}

// ---------------------------------------------------------------------------
// Default structures per block type. Every new project starts valid enough to
// author immediately (Build first, validate later — 50_VALIDATION_ARCHITECTURE).
// ---------------------------------------------------------------------------
function buildDefaultBlock(metadata: MetadataSection, blockType: BlockType): BlockSection {
  const block: BlockSection = { blockType, rootId: '', objects: {} }
  const root = makeObject(metadata, blockType, null)
  block.rootId = root.id
  add(block, root)

  const questionTypeFor: Partial<Record<BlockType, QuestionType>> = {
    knowledgeCheck: 'knowledgeCheck',
    singleChoice: 'singleChoice',
    multipleResponse: 'multipleResponse',
    trueFalse: 'trueFalse',
    matching: 'matching',
    sequence: 'sequence',
    dragDrop: 'dragDrop',
    selectAll: 'selectAll'
  }

  switch (blockType) {
    case 'heading':
      root.content.text = 'New Heading'
      root.settings.headingLevel = 'h2'
      break
    case 'paragraph':
      root.content.richText = 'Write your paragraph here.'
      break
    case 'quote':
      root.content.quoteText = 'The beautiful thing about learning is that no one can take it away from you.'
      root.content.attribution = 'B.B. King'
      root.settings.quoteStyle = 'standard'
      break
    case 'reflection':
      root.content.prompt = 'Take a moment to reflect: what stood out to you?'
      root.settings.responseAreaSize = 'medium'
      break
    case 'accordion': {
      root.settings.expandBehavior = 'singleOpen'
      for (let i = 1; i <= 2; i++) {
        const panel = add(block, makeObject(metadata, 'panel', root.id))
        panel.content.title = `Panel ${i}`
        const para = add(block, makeObject(metadata, 'paragraph', panel.id))
        para.content.richText = `Content for panel ${i}.`
      }
      break
    }
    case 'tabs': {
      root.settings.defaultActiveTab = 0
      for (let i = 1; i <= 2; i++) {
        const panel = add(block, makeObject(metadata, 'panel', root.id))
        panel.content.tabLabel = `Tab ${i}`
        const para = add(block, makeObject(metadata, 'paragraph', panel.id))
        para.content.richText = `Content for tab ${i}.`
      }
      break
    }
    case 'carousel': {
      root.settings.autoAdvance = false
      for (let i = 1; i <= 2; i++) {
        const slide = add(block, makeObject(metadata, 'slide', root.id))
        slide.content.caption = `Slide ${i}`
        const para = add(block, makeObject(metadata, 'paragraph', slide.id))
        para.content.richText = `Content for slide ${i}.`
      }
      break
    }
    case 'timeline': {
      root.settings.visualPreset = 'vertical'
      for (let i = 1; i <= 3; i++) {
        const event = add(block, makeObject(metadata, 'event', root.id))
        event.content.label = `Event ${i}`
        event.content.date = ''
        const para = add(block, makeObject(metadata, 'paragraph', event.id))
        para.content.richText = `What happened at event ${i}.`
      }
      break
    }
    // --- Assessment family: mandatory Pool → Question → Answer structure (90)
    case 'knowledgeCheck':
    case 'singleChoice':
    case 'multipleResponse':
    case 'trueFalse':
    case 'sequence':
    case 'matching':
    case 'dragDrop':
    case 'selectAll': {
      const isKC = blockType === 'knowledgeCheck'
      root.logic.attemptsAllowed = 'unlimited'
      root.logic.completionRule = isKC ? 'anyCompletion' : 'passingScore'
      if (!isKC) root.logic.passingScore = 80
      const pool = add(block, makeObject(metadata, 'pool', root.id))
      pool.content.title = 'Pool 1'
      pool.settings.randomization = 'none'
      const q = add(block, makeObject(metadata, 'question', pool.id))
      q.settings.questionType = questionTypeFor[blockType]
      q.settings.shuffleAnswers = false

      if (blockType === 'trueFalse') {
        q.content.prompt = 'The sky is blue.'
        const t = add(block, makeObject(metadata, 'answer', q.id))
        t.content.text = 'True'
        t.logic.isCorrect = true
        t.logic.score = 10
        const f = add(block, makeObject(metadata, 'answer', q.id))
        f.content.text = 'False'
        f.logic.isCorrect = false
        f.logic.score = 0
      } else if (blockType === 'matching') {
        q.content.prompt = 'Match each item to its pair.'
        for (let i = 1; i <= 3; i++) {
          const pair = add(block, makeObject(metadata, 'matchpair', q.id))
          pair.content.leftText = `Item ${i}`
          pair.content.rightText = `Match ${i}`
          pair.logic.score = 5
        }
      } else if (blockType === 'sequence') {
        q.content.prompt = 'Arrange the steps in the correct order.'
        for (let i = 1; i <= 3; i++) {
          const item = add(block, makeObject(metadata, 'sequenceitem', q.id))
          item.content.text = `Step ${i}`
          item.logic.score = 5
        }
      } else if (blockType === 'dragDrop') {
        q.content.prompt = 'Drag each item onto the correct zone.'
        const zoneIds: string[] = []
        for (let i = 1; i <= 2; i++) {
          const zone = add(block, makeObject(metadata, 'dropzone', q.id))
          zone.content.label = `Zone ${i}`
          zone.logic.score = 5
          zoneIds.push(zone.id)
        }
        for (let i = 1; i <= 2; i++) {
          const target = add(block, makeObject(metadata, 'dragtarget', q.id))
          target.content.label = `Item ${i}`
          target.logic.correctZoneId = zoneIds[i - 1]
        }
      } else {
        // singleChoice / multipleResponse / selectAll / knowledgeCheck
        q.content.prompt = isKC ? 'Check your understanding: which statement is true?' : 'Which option is correct?'
        if (blockType === 'selectAll') {
          q.settings.scoringMode = 'allOrNothing'
          q.content.prompt = 'Select all that apply.'
        }
        const wantMultipleCorrect = blockType === 'multipleResponse' || blockType === 'selectAll'
        const answerCount = wantMultipleCorrect ? 4 : 3
        for (let i = 1; i <= answerCount; i++) {
          const a = add(block, makeObject(metadata, 'answer', q.id))
          a.content.text = `Answer ${i}`
          a.logic.isCorrect = wantMultipleCorrect ? i <= 2 : i === 1
          a.logic.score = a.logic.isCorrect ? 10 : 0
        }
      }
      break
    }
    // --- Checklist (160): items + completion logic + optional feedback
    case 'checklist': {
      root.settings.completionMode = 'allRequired'
      root.settings.minRequired = 1
      root.content.title = 'Before you finish, confirm each step:'
      root.settings.feedbackTemplate = 'success'
      root.settings.feedbackDisplay = 'inline'
      root.content.feedbackText = 'Great — you have completed every step.'
      for (let i = 1; i <= 3; i++) {
        const item = add(block, makeObject(metadata, 'checkitem', root.id))
        item.content.text = `Checklist item ${i}`
        item.settings.required = true
      }
      break
    }
    // --- Comparison (170): two columns of points
    case 'comparison': {
      root.settings.comparisonPreset = 'beforeAfter'
      root.settings.comparisonLayout = 'horizontal'
      const headings = ['Before', 'After']
      for (let c = 0; c < 2; c++) {
        const col = add(block, makeObject(metadata, 'comparisonColumn', root.id))
        col.content.title = headings[c]
        for (let i = 1; i <= 3; i++) {
          const row = add(block, makeObject(metadata, 'comparisonRow', col.id))
          row.content.text = `${headings[c]} point ${i}`
        }
      }
      break
    }
    // --- Chart (180): SVG visualization, data points in .clyp
    case 'chart': {
      root.settings.chartType = 'bar'
      root.settings.showLegend = true
      root.settings.showValues = true
      root.content.title = 'Quarterly Results'
      const palette = ['#015061', '#00c18e', '#3a9bd6', '#e0a33e', '#d64545']
      const labels = ['Q1', 'Q2', 'Q3', 'Q4']
      const values = [42, 58, 35, 71]
      for (let i = 0; i < labels.length; i++) {
        const p = add(block, makeObject(metadata, 'chartPoint', root.id))
        p.content.label = labels[i]
        p.logic.value = values[i]
        p.settings.accentColor = palette[i % palette.length]
      }
      break
    }
    // --- Scenario family: Scenario → Scenes → Dialogue → Choices → Outcomes (100)
    case 'conversation':
    case 'branchingScenario': {
      const isChat = blockType === 'conversation'
      root.logic.variables = []
      root.logic.gatekeeping = false
      if (isChat) root.settings.conversationTemplate = 'corporateChat'

      // Cast is declared once at block level and reused by every scene.
      // No typed name: display names derive from the role (auto-numbered).
      const char = add(block, makeObject(metadata, 'character', root.id))
      char.settings.characterRole = isChat ? 'customer' : 'colleague'
      char.settings.characterGender = isChat ? 'female' : 'male'
      char.settings.characterAge = 'adult'
      char.settings.characterSkinTone = isChat ? 'medium' : 'light'

      const start = add(block, makeObject(metadata, 'scene', root.id))
      start.name = isChat ? 'Opening Message' : 'Opening Scene'
      start.settings.sceneType = 'start'
      start.settings.backgroundId = 'office'
      const d1 = add(block, makeObject(metadata, 'dialogue', start.id))
      d1.content.dialogueText = isChat
        ? 'Hi there! I have a question about my recent order — can you help?'
        : 'Hi! Thanks for meeting with me — can we talk through the situation?'
      d1.logic.speakerCharacterId = char.id
      d1.settings.expression = 'neutral'
      d1.settings.gesture = isChat ? 'neutral' : 'greeting'

      const ending = add(block, makeObject(metadata, 'scene', root.id))
      ending.name = 'Resolution'
      ending.settings.sceneType = 'ending'
      ending.settings.backgroundId = 'office'
      ending.settings.allowRestart = true
      ending.content.outcomeTitle = isChat ? 'Conversation Resolved' : 'Conversation Complete'
      ending.content.outcomeDescription = isChat
        ? 'The customer’s question was resolved.'
        : 'You reached the end of this scenario.'

      const c1 = add(block, makeObject(metadata, 'choice', start.id))
      c1.content.label = isChat ? 'Of course — what’s your order number?' : 'Of course — tell me what happened.'
      c1.logic.targetSceneId = ending.id
      break
    }
  }
  return block
}

export function createProject(name: string, blockType: BlockType): ClypFile {
  const now = new Date().toISOString()
  const metadata = emptyMetadata()
  const block = buildDefaultBlock(metadata, blockType)
  return {
    project: {
      name,
      uuid: uuid(),
      createdDate: now,
      modifiedDate: now,
      applicationVersion: APPLICATION_VERSION,
      schemaVersion: SCHEMA_VERSION
    },
    metadata,
    block,
    state: {
      uiState: { selection: block.rootId, expandedNodes: [block.rootId], activeView: 'canvas' },
      previewState: { activeDevice: 'desktop' },
      undoState: { snapshots: [], currentIndex: -1 }
    }
  }
}

/** A project containing only the root block object (no default children) —
 *  the starting point the Template Kit populates with real content. */
export function createEmptyProject(name: string, blockType: BlockType): ClypFile {
  const now = new Date().toISOString()
  const metadata = emptyMetadata()
  const block: BlockSection = { blockType, rootId: '', objects: {} }
  const root = makeObject(metadata, blockType, null)
  block.rootId = root.id
  block.objects[root.id] = root
  return {
    project: {
      name,
      uuid: uuid(),
      createdDate: now,
      modifiedDate: now,
      applicationVersion: APPLICATION_VERSION,
      schemaVersion: SCHEMA_VERSION
    },
    metadata,
    block,
    state: {
      uiState: { selection: block.rootId, expandedNodes: [block.rootId], activeView: 'canvas' },
      previewState: { activeDevice: 'desktop' },
      undoState: { snapshots: [], currentIndex: -1 }
    }
  }
}

/** Freshly-scoped copy of a template project for a new, independent project.
 *  The template file itself is never mutated (35_SAVE_OPEN_WORKFLOW). */
export function cloneProject(source: ClypFile, name: string): ClypFile {
  const now = new Date().toISOString()
  const next = JSON.parse(JSON.stringify(source)) as ClypFile
  next.project.name = name
  next.project.uuid = uuid()
  next.project.createdDate = now
  next.project.modifiedDate = now
  next.project.applicationVersion = APPLICATION_VERSION
  next.state = {
    uiState: { selection: next.block.rootId, expandedNodes: Object.keys(next.block.objects), activeView: 'canvas' },
    previewState: { activeDevice: 'desktop' },
    undoState: { snapshots: [], currentIndex: -1 }
  }
  return next
}

export function blockLabel(blockType: BlockType): string {
  return catalogEntry(blockType).label
}

/** Filename-safe check for project names (32_PROJECT_METADATA). */
export function isFilenameSafe(name: string): boolean {
  return name.length > 0 && !/[<>:"/\\|?*\x00-\x1f]/.test(name) && name.trim() === name
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
}
