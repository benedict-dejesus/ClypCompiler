// ClypCompiler — Compiler Logic, course stage.
// Orchestrates the ported Clyp block compiler across every block in the
// course, applies Assets Library overrides, and aggregates validation results.
// Nothing partial ever reaches an export: any Critical/Error halts packaging.
import type { Course, CourseBlock, Lesson, AssetItem } from '../model/course'
import { compileBlock, type CompiledBlock } from '../clyp/compile'
import type { ValidationIssue } from '../clyp/types'
import { applyAssetOverrides } from './assetSlots'

export interface CompiledCourseBlock {
  block: CourseBlock
  compiled: CompiledBlock
  /** True when the block carries a completion gate the player can await. */
  gated: boolean
  /** XP awarded when this block completes (gamification enabled). */
  xp: number
}

export interface CompiledLesson {
  lesson: Lesson
  blocks: CompiledCourseBlock[]
}

export interface CourseCompileIssue {
  blockTitle: string
  lessonTitle: string
  issues: ValidationIssue[]
}

export interface CourseCompileResult {
  ok: boolean
  problems: CourseCompileIssue[]
  warnings: CourseCompileIssue[]
  lessons: CompiledLesson[]
}

/**
 * Compiles every block of every lesson. `resolveSrc` maps an uploaded asset to
 * the URL used in the output (data: URL for preview, relative file path for
 * zip exports).
 */
export function compileCourse(
  course: Course,
  resolveSrc: (asset: AssetItem) => string
): CourseCompileResult {
  const problems: CourseCompileIssue[] = []
  const warnings: CourseCompileIssue[] = []
  const lessons: CompiledLesson[] = []

  for (const lesson of course.lessons) {
    const compiledBlocks: CompiledCourseBlock[] = []
    for (const blockId of lesson.blockIds) {
      const block = course.blocks[blockId]
      if (!block) continue
      const result = compileBlock(block.clyp)
      const blocking = result.validation.issues.filter(
        (i) => i.severity === 'critical' || i.severity === 'error'
      )
      const advisory = result.validation.issues.filter(
        (i) => i.severity === 'warning' || i.severity === 'recommendation'
      )
      if (advisory.length > 0) {
        warnings.push({ blockTitle: block.title, lessonTitle: lesson.title, issues: advisory })
      }
      if (!result.output || blocking.length > 0) {
        problems.push({ blockTitle: block.title, lessonTitle: lesson.title, issues: blocking })
        continue
      }
      const html = applyAssetOverrides(
        result.output.html,
        block.assetOverrides,
        course.assets,
        resolveSrc
      )
      const gated = /class="clyp-gate\b/.test(result.output.html)
      const xp =
        block.xpOverride ??
        (gated ? course.gamification.xpPerGatedBlock : course.gamification.xpPerBlock)
      compiledBlocks.push({
        block,
        compiled: { ...result.output, html },
        gated,
        xp
      })
    }
    lessons.push({ lesson, blocks: compiledBlocks })
  }

  return { ok: problems.length === 0, problems, warnings, lessons }
}
