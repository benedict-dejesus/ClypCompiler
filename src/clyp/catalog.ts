// Clyp — the curated block catalog (80_BLOCK_CATALOG + supplemental 150–188).
// 21 block types: 11 Content + 8 Assessment + 2 Scenario.
// No block type may exist in .clyp or the Canvas that isn't listed here.
import type { BlockType, BlockFamily, ObjectCategory, ObjectType } from './types'

export interface BlockCatalogEntry {
  blockType: BlockType
  family: BlockFamily
  label: string
  description: string
}

export const BLOCK_CATALOG: BlockCatalogEntry[] = [
  // Content family
  { blockType: 'heading', family: 'content', label: 'Heading', description: 'A section heading (H2–H4).' },
  { blockType: 'paragraph', family: 'content', label: 'Paragraph', description: 'Body text with rich formatting.' },
  { blockType: 'quote', family: 'content', label: 'Quote', description: 'A quotation with optional attribution.' },
  { blockType: 'reflection', family: 'content', label: 'Reflection', description: 'A prompt with a free-response area for the learner.' },
  { blockType: 'accordion', family: 'content', label: 'Accordion', description: 'Expandable panels of content.' },
  { blockType: 'tabs', family: 'content', label: 'Tabs', description: 'Tabbed panels of content.' },
  { blockType: 'carousel', family: 'content', label: 'Carousel', description: 'Slides the learner steps through.' },
  { blockType: 'timeline', family: 'content', label: 'Timeline', description: 'Ordered events along a timeline.' },
  { blockType: 'checklist', family: 'content', label: 'Checklist', description: 'Interactive items the learner checks off, with completion tracking.' },
  { blockType: 'comparison', family: 'content', label: 'Comparison', description: 'Side-by-side comparison — before/after, option A vs B, and more.' },
  { blockType: 'chart', family: 'content', label: 'Chart', description: 'Self-contained SVG data visualization — bar, line, pie, donut or radar.' },
  // Assessment family
  { blockType: 'knowledgeCheck', family: 'assessment', label: 'Knowledge Check', description: 'Ungraded practice — teaches, never measures.' },
  { blockType: 'singleChoice', family: 'assessment', label: 'Single Choice', description: 'One correct answer among options.' },
  { blockType: 'multipleResponse', family: 'assessment', label: 'Multiple Response', description: 'Several correct answers among options.' },
  { blockType: 'trueFalse', family: 'assessment', label: 'True / False', description: 'A true-or-false statement.' },
  { blockType: 'matching', family: 'assessment', label: 'Matching', description: 'Match items in the left column to the right.' },
  { blockType: 'sequence', family: 'assessment', label: 'Sequence', description: 'Arrange items into the correct order.' },
  { blockType: 'dragDrop', family: 'assessment', label: 'Drag & Drop', description: 'Drag items onto the correct zones.' },
  { blockType: 'selectAll', family: 'assessment', label: 'Select All That Apply', description: 'Select every correct answer.' },
  // Scenario family — the flagship
  { blockType: 'branchingScenario', family: 'scenario', label: 'Branching Scenario', description: 'Scenes, dialogue, choices and consequences — a realistic decision-making experience.' },
  { blockType: 'conversation', family: 'scenario', label: 'Conversation', description: 'A chat-styled branching conversation — corporate chat, SMS, Teams, Slack and more.' }
]

export function catalogEntry(blockType: BlockType): BlockCatalogEntry {
  const entry = BLOCK_CATALOG.find((b) => b.blockType === blockType)
  if (!entry) throw new Error(`Unknown block type: ${blockType}`)
  return entry
}

export const QUIZ_TYPES: BlockType[] = [
  'singleChoice',
  'multipleResponse',
  'trueFalse',
  'matching',
  'sequence',
  'dragDrop',
  'selectAll'
]

export function isQuizType(blockType: BlockType): boolean {
  return QUIZ_TYPES.includes(blockType)
}

/** Object category per object type (41_OBJECT_MODEL's five categories). */
export function categoryFor(type: ObjectType): ObjectCategory {
  switch (type) {
    case 'heading':
    case 'paragraph':
    case 'quote':
    case 'reflection':
    case 'panel':
    case 'slide':
    case 'event':
    case 'checkitem':
    case 'comparisonRow':
    case 'chartPoint':
    case 'chartScenario':
      return 'content'
    case 'accordion':
    case 'tabs':
    case 'carousel':
    case 'timeline':
    case 'checklist':
    case 'comparison':
    case 'chart':
    case 'comparisonColumn':
      return 'container'
    case 'knowledgeCheck':
    case 'singleChoice':
    case 'multipleResponse':
    case 'trueFalse':
    case 'matching':
    case 'sequence':
    case 'dragDrop':
    case 'selectAll':
    case 'pool':
    case 'question':
    case 'answer':
    case 'matchpair':
    case 'sequenceitem':
    case 'dragtarget':
    case 'dropzone':
      return 'assessment'
    case 'branchingScenario':
    case 'conversation':
    case 'scene':
    case 'dialogue':
    case 'choice':
    case 'character':
      return 'scenario'
    default:
      return 'system'
  }
}

// Container Governance (45_LAYOUT_MODEL): permitted children per container type.
export const PERMITTED_CHILDREN: Partial<Record<ObjectType, ObjectType[]>> = {
  accordion: ['panel'],
  tabs: ['panel'],
  carousel: ['slide'],
  timeline: ['event'],
  panel: ['heading', 'paragraph', 'quote', 'reflection'],
  slide: ['heading', 'paragraph', 'quote', 'reflection'],
  event: ['paragraph', 'quote'],
  knowledgeCheck: ['pool'],
  singleChoice: ['pool'],
  multipleResponse: ['pool'],
  trueFalse: ['pool'],
  matching: ['pool'],
  sequence: ['pool'],
  dragDrop: ['pool'],
  selectAll: ['pool'],
  pool: ['question'],
  question: ['answer', 'matchpair', 'sequenceitem', 'dragtarget', 'dropzone'],
  // Cast lives at block level: characters are introduced once and reused
  // across scenes. Scenes may still hold legacy characters from older files.
  branchingScenario: ['scene', 'character'],
  conversation: ['scene', 'character'], // reuses the scenario object model
  scene: ['character', 'dialogue', 'choice'],
  // Supplemental blocks
  checklist: ['checkitem'],
  comparison: ['comparisonColumn'],
  comparisonColumn: ['comparisonRow'],
  chart: ['chartPoint', 'chartScenario']
}

export const MAX_NESTING_DEPTH = 4
