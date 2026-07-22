// Clyp — Validation (Pipeline Stage 2).
// Runs ONLY when the user presses Clyp (50_VALIDATION_ARCHITECTURE) — never
// continuously during authoring. Critical/Error issues block export;
// Warning/Recommendation do not. Every issue carries a concrete suggested
// resolution (54_VALIDATION_ERROR_CATALOG).
import type { ClypFile, ClypObject, Severity, ValidationCategory, ValidationIssue, ValidationResult } from './types'
import { PERMITTED_CHILDREN, isQuizType } from './catalog'
import { isFilenameSafe } from './factory'

function issue(
  severity: Severity,
  category: ValidationCategory,
  location: string,
  description: string,
  suggestedResolution: string,
  objectName?: string
): ValidationIssue {
  return { severity, category, location, description, suggestedResolution, object: objectName }
}

export function validate(clyp: ClypFile): ValidationResult {
  const issues: ValidationIssue[] = []
  const { block, project } = clyp
  const objects = block.objects
  const root = objects[block.rootId]

  // --- Project Validation (51) ---------------------------------------------
  if (!project.uuid) {
    issues.push(issue('critical', 'project', 'project', 'This project has no internal identifier.', 'This is an internal defect — recreate the project or report it.'))
  }
  if (!project.name || !isFilenameSafe(project.name)) {
    issues.push(issue('error', 'project', 'project', "The project name contains characters that can't be used in a filename.", 'Remove special characters from the project name.'))
  }

  // --- Block Validation (51) --------------------------------------------------
  if (!root) {
    issues.push(issue('critical', 'block', block.rootId, 'This project has no learning content.', 'Add at least one object to the canvas.'))
    return { passed: false, issues }
  }

  // parent references + cycles
  const seen = new Set<string>()
  const walk = (id: string, depth: number): void => {
    if (seen.has(id)) return
    seen.add(id)
    const obj = objects[id]
    if (!obj) return
    for (const childId of obj.children) {
      const child = objects[childId]
      if (!child) {
        issues.push(issue('critical', 'block', id, `An object references a child ("${childId}") that no longer exists.`, 'Delete and re-add the affected object.', obj.name ?? obj.type))
        continue
      }
      if (child.parentId !== id) {
        issues.push(issue('critical', 'block', childId, 'An object has an inconsistent parent reference.', 'This is an internal defect — undo the last change or report it.'))
      }
      const permitted = PERMITTED_CHILDREN[obj.type]
      if (permitted && !permitted.includes(child.type)) {
        issues.push(issue('error', 'block', childId, `A "${child.type}" object is not allowed inside a "${obj.type}".`, 'Move or delete the misplaced object.', child.name ?? child.type))
      }
      walk(childId, depth + 1)
    }
  }
  walk(block.rootId, 0)
  for (const id of Object.keys(objects)) {
    if (!seen.has(id)) {
      issues.push(issue('error', 'block', id, 'An object is orphaned — nothing in the project references it.', 'Delete the orphaned object.', objects[id].name ?? objects[id].type))
    }
  }

  // --- Logic Validation (51/43): Block Logic root-only, Object Logic non-root
  for (const obj of Object.values(objects)) {
    const isRoot = obj.id === block.rootId
    if (!isRoot && (obj.logic.passingScore !== undefined || obj.logic.attemptsAllowed !== undefined)) {
      issues.push(issue('critical', 'logic', obj.id, 'Block-level logic (passing score / attempts) appears on a non-root object.', 'Remove the block-level logic from this object.', obj.name ?? obj.type))
    }
    if (isRoot && obj.logic.targetSceneId !== undefined) {
      issues.push(issue('critical', 'logic', obj.id, 'Object-level navigation logic appears on the root block.', 'Remove the navigation logic from the block root.'))
    }
  }

  // --- Family-specific ----------------------------------------------------------
  const family = root.category
  if (family === 'assessment') validateAssessment(clyp, issues)
  if (family === 'scenario') validateScenario(clyp, issues)
  validateContent(clyp, issues)

  const passed = !issues.some((i) => i.severity === 'critical' || i.severity === 'error')
  return { passed, issues }
}

// -----------------------------------------------------------------------------
// Content-family rules (81–88)
// -----------------------------------------------------------------------------
function validateContent(clyp: ClypFile, issues: ValidationIssue[]): void {
  const { block } = clyp
  for (const obj of Object.values(block.objects)) {
    const loc = obj.id
    const name = obj.name ?? obj.type

    // Completion Gate (190): switching the gate on without anything for the
    // learner to explore means the block can never be completed — and the gate
    // would silently render nothing at all. Tell the author exactly what to do.
    if (obj.id === block.rootId && obj.settings.gateEnabled) {
      const countOf = (t: string): number => obj.children.map((id) => block.objects[id]).filter((o) => o?.type === t).length
      const need: Partial<Record<string, { n: number; plural: string; singular: string }>> = {
        accordion: { n: countOf('panel'), plural: 'sections', singular: 'section' },
        tabs: { n: countOf('panel'), plural: 'tabs', singular: 'tab' },
        carousel: { n: countOf('slide'), plural: 'slides', singular: 'slide' },
        timeline: { n: countOf('event'), plural: 'events', singular: 'event' },
        chart: { n: countOf('chartScenario'), plural: 'scenarios', singular: 'scenario' }
      }
      const req = need[obj.type]
      if (req && req.n === 0) {
        issues.push(
          issue(
            'error',
            'block',
            loc,
            `The completion gate is on, but this block has no ${req.plural} for the learner to explore.`,
            `Add at least one ${req.singular}, or turn the completion gate off.`,
            name
          )
        )
      }
    }

    switch (obj.type) {
      case 'heading':
        if (!obj.content.text?.trim()) issues.push(issue('error', 'block', loc, 'This heading has no text.', 'Enter the heading text.', name))
        break
      case 'paragraph':
        if (!obj.content.richText?.trim()) issues.push(issue('error', 'block', loc, 'This paragraph has no text.', 'Enter the paragraph text.', name))
        break
      case 'quote':
        if (!obj.content.quoteText?.trim()) issues.push(issue('error', 'block', loc, 'This quote has no text.', 'Enter the quotation text.', name))
        break
      case 'reflection':
        if (!obj.content.prompt?.trim()) issues.push(issue('error', 'block', loc, 'This reflection has no prompt.', 'Enter the reflection prompt.', name))
        break
      case 'accordion':
        if (obj.children.length < 1) issues.push(issue('critical', 'block', loc, 'This accordion has no panels.', 'Add at least one panel.', name))
        break
      case 'tabs':
        if (obj.children.length < 2) issues.push(issue('critical', 'block', loc, 'This tabs block has fewer than two tabs.', 'Add at least two tabs.', name))
        if (obj.settings.defaultActiveTab !== undefined && (obj.settings.defaultActiveTab < 0 || obj.settings.defaultActiveTab >= obj.children.length)) {
          issues.push(issue('critical', 'block', loc, 'The default active tab points to a tab that does not exist.', `Set the default tab to a number between 1 and ${obj.children.length}.`, name))
        }
        break
      case 'carousel':
        if (obj.children.length < 2) issues.push(issue('critical', 'block', loc, 'This carousel has fewer than two slides.', 'Add at least two slides.', name))
        if (obj.settings.autoAdvance && !(obj.settings.autoAdvanceInterval && obj.settings.autoAdvanceInterval > 0)) {
          issues.push(issue('error', 'block', loc, 'Auto-advance is on but no interval is set.', 'Set a positive auto-advance interval, or turn auto-advance off.', name))
        }
        break
      case 'timeline':
        if (obj.children.length < 1) issues.push(issue('critical', 'block', loc, 'This timeline has no events.', 'Add at least one event.', name))
        break
      case 'panel':
        if (block.objects[obj.parentId ?? '']?.type === 'accordion' && !obj.content.title?.trim()) {
          issues.push(issue('error', 'block', loc, 'This panel has no title.', 'Enter a panel title.', name))
        }
        if (block.objects[obj.parentId ?? '']?.type === 'tabs' && !obj.content.tabLabel?.trim()) {
          issues.push(issue('error', 'block', loc, 'This tab has no label.', 'Enter a tab label.', name))
        }
        break
      case 'event':
        if (!obj.content.label?.trim()) issues.push(issue('error', 'block', loc, 'This timeline event has no label.', 'Enter an event label.', name))
        break
      // --- Supplemental content blocks ---
      case 'checklist': {
        const items = obj.children.map((id) => block.objects[id]).filter((o) => o?.type === 'checkitem')
        if (items.length < 1) issues.push(issue('critical', 'block', loc, 'This checklist has no items.', 'Add at least one checklist item.', name))
        if (obj.settings.completionMode === 'minimumRequired') {
          const min = obj.settings.minRequired ?? 0
          if (min < 1 || min > items.length) {
            issues.push(issue('error', 'block', loc, 'The minimum required count is outside the number of items.', `Set the minimum between 1 and ${items.length}.`, name))
          }
        }
        break
      }
      case 'checkitem':
        if (!obj.content.text?.trim()) issues.push(issue('error', 'block', loc, 'A checklist item has no text.', 'Enter text for every checklist item.', name))
        break
      case 'comparison': {
        const cols = obj.children.map((id) => block.objects[id]).filter((o) => o?.type === 'comparisonColumn')
        if (cols.length < 2) issues.push(issue('critical', 'block', loc, 'A comparison needs at least two columns.', 'Add a second comparison column.', name))
        break
      }
      case 'comparisonColumn':
        if (!obj.content.title?.trim()) issues.push(issue('error', 'block', loc, 'A comparison column has no heading.', 'Enter a heading for every column.', name))
        if (obj.children.filter((id) => block.objects[id]?.type === 'comparisonRow').length < 1) {
          issues.push(issue('error', 'block', loc, 'A comparison column has no points.', 'Add at least one point to every column.', name))
        }
        break
      case 'comparisonRow':
        if (!obj.content.text?.trim()) issues.push(issue('error', 'block', loc, 'A comparison point is empty.', 'Enter text for every comparison point.', name))
        break
      case 'chart': {
        const points = obj.children.map((id) => block.objects[id]).filter((o) => o?.type === 'chartPoint')
        if (points.length < 1) issues.push(issue('critical', 'block', loc, 'This chart has no data points.', 'Add at least one data point.', name))
        if ((obj.settings.chartType === 'radar') && points.length > 0 && points.length < 3) {
          issues.push(issue('error', 'block', loc, 'A radar chart needs at least three data points.', 'Add more data points, or choose a different chart type.', name))
        }
        break
      }
      case 'chartPoint':
        if (!obj.content.label?.trim()) issues.push(issue('error', 'block', loc, 'A chart data point has no label.', 'Enter a label for every data point.', name))
        if (typeof obj.logic.value !== 'number' || Number.isNaN(obj.logic.value)) {
          issues.push(issue('error', 'block', loc, 'A chart data point has no numeric value.', 'Enter a number for every data point.', name))
        }
        break
      case 'chartScenario': {
        if (!obj.content.label?.trim()) {
          issues.push(issue('error', 'block', loc, 'A chart scenario has no button label.', 'Enter the text the learner will see on the button.', name))
        }
        const parent = obj.parentId ? block.objects[obj.parentId] : null
        const basePoints = (parent?.children ?? []).map((id) => block.objects[id]).filter((o) => o?.type === 'chartPoint')
        const vals = obj.logic.values ?? []
        if (vals.length < basePoints.length) {
          issues.push(
            issue(
              'error',
              'block',
              loc,
              'A chart scenario is missing a value for one or more data points.',
              'Enter a value for every data point in this scenario.',
              name
            )
          )
        }
        if (vals.some((v) => typeof v !== 'number' || Number.isNaN(v))) {
          issues.push(issue('error', 'block', loc, 'A chart scenario has a non-numeric value.', 'Enter a number for every data point.', name))
        }
        break
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Assessment rules (53 + 90–98)
// -----------------------------------------------------------------------------
function validateAssessment(clyp: ClypFile, issues: ValidationIssue[]): void {
  const { block } = clyp
  const root = block.objects[block.rootId]
  const isKC = block.blockType === 'knowledgeCheck'
  const pools = root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'pool')

  if (pools.length === 0) {
    issues.push(issue('critical', 'assessment', root.id, 'This assessment has no question pool.', 'Add at least one pool with at least one question.'))
  }

  // Knowledge Check vs Quiz mutual exclusivity (53/90)
  if (isKC && root.logic.passingScore !== undefined) {
    issues.push(issue('error', 'assessment', root.id, "This Knowledge Check has a passing score set, which Knowledge Checks don't use.", 'Remove the passing score, or create a Quiz-type block instead.'))
  }
  if (!isKC && isQuizType(block.blockType) && root.logic.passingScore === undefined) {
    issues.push(issue('error', 'assessment', root.id, 'This quiz has no passing score.', 'Set a passing score (e.g. 80%) in the block logic.'))
  }
  if (root.logic.attemptsAllowed !== 'unlimited' && typeof root.logic.attemptsAllowed === 'number' && (!Number.isInteger(root.logic.attemptsAllowed) || root.logic.attemptsAllowed < 1)) {
    issues.push(issue('error', 'assessment', root.id, 'Attempts allowed must be "unlimited" or a positive whole number.', 'Set attempts to unlimited or a number of 1 or more.'))
  }

  for (const pool of pools) {
    const questions = pool.children.map((id) => block.objects[id]).filter((o) => o?.type === 'question')
    if (questions.length === 0) {
      issues.push(issue('critical', 'assessment', pool.id, 'This pool has no questions.', 'Add at least one question to the pool.', pool.content.title))
    }
    for (const q of questions) {
      const qName = q.content.prompt?.slice(0, 40) || 'Question'
      if (!q.content.prompt?.trim()) {
        issues.push(issue('error', 'assessment', q.id, 'This question has no prompt.', 'Enter the question text.', qName))
      }
      const qt = q.settings.questionType
      const answers = q.children.map((id) => block.objects[id]).filter(Boolean) as ClypObject[]
      const plainAnswers = answers.filter((a) => a.type === 'answer')
      const correct = plainAnswers.filter((a) => a.logic.isCorrect)

      switch (qt) {
        case 'singleChoice':
        case 'knowledgeCheck':
          if (plainAnswers.length < 2) issues.push(issue('error', 'assessment', q.id, 'This question has fewer than two answers.', 'Add at least two answers.', qName))
          if (correct.length !== 1) issues.push(issue('critical', 'assessment', q.id, 'This question must have exactly one correct answer.', 'Mark exactly one answer as correct.', qName))
          break
        case 'trueFalse':
          if (plainAnswers.length !== 2) issues.push(issue('critical', 'assessment', q.id, 'A True/False question must have exactly two answers.', 'Restore the True and False answers.', qName))
          if (correct.length !== 1) issues.push(issue('critical', 'assessment', q.id, 'Exactly one of True/False must be marked correct.', 'Mark exactly one answer as correct.', qName))
          break
        case 'multipleResponse':
          if (plainAnswers.length < 2) issues.push(issue('error', 'assessment', q.id, 'This question has fewer than two answers.', 'Add at least two answers.', qName))
          if (correct.length < 1) issues.push(issue('critical', 'assessment', q.id, 'This question has no correct answer.', 'Mark at least one answer as correct.', qName))
          break
        case 'selectAll':
          if (correct.length < 2) issues.push(issue('critical', 'assessment', q.id, 'A Select All That Apply question needs at least two correct answers.', 'Mark at least two answers as correct.', qName))
          break
        case 'matching': {
          const pairs = answers.filter((a) => a.type === 'matchpair')
          if (pairs.length < 2) issues.push(issue('error', 'assessment', q.id, 'A matching question needs at least two pairs.', 'Add at least two matching pairs.', qName))
          for (const p of pairs) {
            if (!p.content.leftText?.trim() || !p.content.rightText?.trim()) {
              issues.push(issue('critical', 'assessment', p.id, 'A matching pair is missing its left or right text.', 'Fill in both sides of every pair.', qName))
            }
          }
          break
        }
        case 'sequence': {
          const items = answers.filter((a) => a.type === 'sequenceitem')
          if (items.length < 3) issues.push(issue('error', 'assessment', q.id, 'A sequence question needs at least three items.', 'Add at least three items to order.', qName))
          for (const it of items) {
            if (!it.content.text?.trim()) issues.push(issue('error', 'assessment', it.id, 'A sequence item has no text.', 'Enter text for every sequence item.', qName))
          }
          break
        }
        case 'dragDrop': {
          const zones = answers.filter((a) => a.type === 'dropzone')
          const targets = answers.filter((a) => a.type === 'dragtarget')
          if (zones.length < 1 || targets.length < 1) {
            issues.push(issue('critical', 'assessment', q.id, 'A drag & drop question needs at least one zone and one draggable item.', 'Add zones and draggable items.', qName))
          }
          for (const t of targets) {
            if (!t.logic.correctZoneId || !zones.some((z) => z.id === t.logic.correctZoneId)) {
              issues.push(issue('critical', 'assessment', t.id, 'A draggable item has no valid destination zone.', 'Assign a destination zone to every draggable item.', qName))
            }
          }
          for (const z of zones) {
            if (!targets.some((t) => t.logic.correctZoneId === z.id)) {
              issues.push(issue('error', 'assessment', z.id, 'A drop zone is not the correct destination for any item.', 'Assign at least one item to this zone, or delete the zone.', qName))
            }
          }
          break
        }
      }
      // every answer has explicit scoring for quiz types
      if (!isKC) {
        for (const a of plainAnswers) {
          if (typeof a.logic.score !== 'number') {
            issues.push(issue('error', 'assessment', a.id, 'An answer has no score value.', 'Give every answer an explicit score (0 is allowed).', qName))
          }
        }
      }
      // Knowledge Check answers must have explicit isCorrect
      if (isKC) {
        for (const a of plainAnswers) {
          if (typeof a.logic.isCorrect !== 'boolean') {
            issues.push(issue('error', 'assessment', a.id, 'An answer is not marked correct or incorrect.', 'Mark every answer explicitly as correct or incorrect.', qName))
          }
        }
      }
    }
  }
}

// -----------------------------------------------------------------------------
// Scenario rules (52 + 101–105)
// -----------------------------------------------------------------------------
function validateScenario(clyp: ClypFile, issues: ValidationIssue[]): void {
  const { block } = clyp
  const root = block.objects[block.rootId]
  const scenes = root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'scene')
  const sceneIds = new Set(scenes.map((s) => s.id))
  const variables = root.logic.variables ?? []
  const variableIds = new Set(variables.map((v) => v.id))

  // Cast is declared at block level (characters introduced once, reused
  // across scenes). Legacy scene-level characters remain valid speakers.
  const blockCastIds = new Set(
    root.children.filter((id) => block.objects[id]?.type === 'character').map((id) => id)
  )

  const startScenes = scenes.filter((s) => s.settings.sceneType === 'start')
  if (startScenes.length === 0) {
    issues.push(issue('critical', 'scenario', root.id, 'This scenario has no starting scene.', 'Mark one scene as the Start Scene.'))
  }
  if (startScenes.length > 1) {
    issues.push(issue('critical', 'scenario', root.id, 'This scenario has more than one starting scene.', 'Keep exactly one scene marked as the Start Scene.'))
  }

  // Reachability first: dead-end rules only apply to scenes the learner can
  // actually visit. Unreachable scenes are drafts and surface only as
  // warnings (52: unreachable content is a Warning, never a blocker).
  const adjacency = new Map<string, string[]>()
  for (const scene of scenes) {
    adjacency.set(
      scene.id,
      scene.children
        .map((id) => block.objects[id])
        .filter((o) => o?.type === 'choice' && o.logic.targetSceneId && sceneIds.has(o.logic.targetSceneId))
        .map((c) => c.logic.targetSceneId!)
    )
  }
  const reachable = new Set<string>()
  if (startScenes.length >= 1) {
    const queue = [startScenes[0].id]
    while (queue.length) {
      const id = queue.shift()!
      if (reachable.has(id)) continue
      reachable.add(id)
      for (const next of adjacency.get(id) ?? []) queue.push(next)
    }
  }

  for (const scene of scenes) {
    const sceneName = scene.name ?? 'Scene'
    const sceneCharacterIds = new Set(
      scene.children.filter((id) => block.objects[id]?.type === 'character').map((id) => id)
    )
    const dialogue = scene.children.map((id) => block.objects[id]).filter((o) => o?.type === 'dialogue')
    const choices = scene.children.map((id) => block.objects[id]).filter((o) => o?.type === 'choice')

    if (scene.settings.sceneType === 'ending') {
      if (!scene.content.outcomeTitle?.trim() || !scene.content.outcomeDescription?.trim()) {
        issues.push(issue('error', 'scenario', scene.id, 'An ending scene is missing its outcome title or description.', 'Fill in the outcome title and description for every ending scene.', sceneName))
      }
    } else if (choices.length === 0 && reachable.has(scene.id)) {
      // Only a *reachable* scene without choices traps the learner.
      issues.push(issue('critical', 'scenario', scene.id, 'The learner can reach this scene but would be stuck — it has no choices.', 'Add at least one choice, or mark this scene as an Ending Scene.', sceneName))
    }

    for (const d of dialogue) {
      if (!d.content.dialogueText?.trim()) {
        issues.push(issue('error', 'scenario', d.id, 'A dialogue line has no text.', 'Enter text for every dialogue line.', sceneName))
      }
      if (d.logic.speakerCharacterId && !blockCastIds.has(d.logic.speakerCharacterId) && !sceneCharacterIds.has(d.logic.speakerCharacterId)) {
        issues.push(issue('critical', 'scenario', d.id, 'A dialogue line is spoken by a character who no longer exists.', 'Choose a speaker from the scenario cast, or add the character to the cast.', sceneName))
      }
    }

    for (const c of choices) {
      if (!c.content.label?.trim()) {
        issues.push(issue('error', 'scenario', c.id, 'A choice has no label text.', 'Enter the text the learner will click.', sceneName))
      }
      if (!c.logic.targetSceneId) {
        issues.push(issue('critical', 'scenario', c.id, 'This choice has no destination scene.', 'Assign a destination scene to this choice.', sceneName))
      } else if (!sceneIds.has(c.logic.targetSceneId)) {
        issues.push(issue('critical', 'scenario', c.id, 'This choice points to a scene that no longer exists.', 'Assign a valid destination scene to this choice.', sceneName))
      }
      for (const va of c.logic.variableAssignments ?? []) {
        if (!variableIds.has(va.variableId)) {
          issues.push(issue('critical', 'scenario', c.id, 'A choice updates a variable that is not declared.', 'Declare the variable at the scenario level, or remove the assignment.', sceneName))
        } else {
          const v = variables.find((x) => x.id === va.variableId)!
          if ((va.operation === 'increment' || va.operation === 'decrement') && !(v.variableType === 'numeric' || v.variableType === 'score')) {
            issues.push(issue('critical', 'scenario', c.id, `The "${v.name}" variable cannot be incremented — it is not numeric.`, 'Use "set" for non-numeric variables.', sceneName))
          }
          if (va.operation === 'append' && v.variableType !== 'text') {
            issues.push(issue('critical', 'scenario', c.id, `The "${v.name}" variable cannot be appended to — it is not text.`, 'Use "set" or choose a text variable.', sceneName))
          }
        }
      }
      for (const cond of c.logic.conditionGroup?.conditions ?? []) {
        if (!variableIds.has(cond.variableId)) {
          issues.push(issue('critical', 'scenario', c.id, 'A choice condition references a variable that is not declared.', 'Declare the variable, or remove the condition.', sceneName))
        }
      }
    }
    for (const cond of scene.logic.conditionGroup?.conditions ?? []) {
      if (!variableIds.has(cond.variableId)) {
        issues.push(issue('critical', 'scenario', scene.id, 'A scene condition references a variable that is not declared.', 'Declare the variable, or remove the condition.', sceneName))
      }
    }
  }

  // Unreachable scenes are informational only — authors may keep drafts and
  // alternate branches unlinked while building (Warning, never a blocker).
  if (startScenes.length === 1) {
    for (const scene of scenes) {
      if (!reachable.has(scene.id)) {
        issues.push(issue('warning', 'scenario', scene.id, `The scene "${scene.name ?? scene.id}" cannot be reached from the start scene yet.`, 'Link a choice to this scene when it is ready, or delete it.', scene.name))
      }
    }
    // No ending reachable at all = circular runtime error (Critical)
    const endingReachable = scenes.some((s) => s.settings.sceneType === 'ending' && reachable.has(s.id))
    const hasEnding = scenes.some((s) => s.settings.sceneType === 'ending')
    if (!hasEnding) {
      issues.push(issue('critical', 'scenario', root.id, 'This scenario has no ending scene, so the learner could never finish.', 'Add at least one Ending Scene.'))
    } else if (!endingReachable) {
      issues.push(issue('critical', 'scenario', root.id, 'No ending scene is reachable from the start — the scenario would loop forever.', 'Link a path of choices from the start scene to an ending scene.'))
    }
  }
}
