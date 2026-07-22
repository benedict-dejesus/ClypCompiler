// ClypCompiler — canonical art identities.
// One place defines how a character variant or scene is named, so the prompt
// generator, the drop-in photo matcher and the compiler all agree.
import { ROLES, SKIN_TONES, AGES, BACKGROUND_LIBRARY, type CharacterSpec } from '../clyp/assets'

export type ArtVariant = 'figure' | 'avatar'

export interface CharacterNeed {
  kind: 'character'
  spec: CharacterSpec
  expression: string
  gesture: string
  /** Every variant that requested this character/expression pairing. */
  variants: Set<ArtVariant>
}

export interface SceneNeed {
  kind: 'scene'
  backgroundId: string
}

export type ArtNeed = CharacterNeed | SceneNeed

// ---------------------------------------------------------------------------
// Filenames — the contract between "what you generate" and "what gets used"
// ---------------------------------------------------------------------------
const SEP = '__'

// Every generated key is lower-cased. Clyp's background ids are camelCase
// (callCenter, meetingRoom, …) but dropped filenames are normalized to
// lower case, so both sides must agree or scenes silently never match.
function k(...parts: string[]): string {
  return parts.join(SEP).toLowerCase()
}

/**
 * The most specific filename for a character variant. The matcher also accepts
 * progressively shorter forms, so one photo can cover many variants:
 *
 *   char__manager__female__senior__deep__angry__pointing   (exact)
 *   char__manager__female__senior__deep__angry             (any gesture)
 *   char__manager__female__senior__deep                    (any expression)
 */
export function characterFileBase(spec: CharacterSpec, expression: string, gesture: string): string {
  return k('char', spec.role, spec.gender, spec.age, spec.tone, expression, gesture)
}

/** The fallback chain, most specific first. */
export function characterFileCandidates(
  spec: CharacterSpec,
  expression: string,
  gesture: string
): string[] {
  const stem = ['char', spec.role, spec.gender, spec.age, spec.tone]
  return [k(...stem, expression, gesture), k(...stem, expression), k(...stem)]
}

export function sceneFileBase(backgroundId: string): string {
  return k('scene', backgroundId)
}

/** Strips directory, extension and case so dropped files match regardless. */
export function normalizeFileKey(fileName: string): string {
  return fileName
    .replace(/^.*[\\/]/, '')
    .replace(/\.[a-z0-9]+$/i, '')
    .trim()
    .toLowerCase()
}

// ---------------------------------------------------------------------------
// Human-readable labels
// ---------------------------------------------------------------------------
export function roleLabel(id: string): string {
  return ROLES.find((r) => r.id === id)?.label ?? id
}
export function ageLabel(id: string): string {
  return AGES.find((a) => a.id === id)?.label ?? id
}
export function toneLabel(id: string): string {
  return SKIN_TONES.find((t) => t.id === id)?.label ?? id
}
export function sceneLabel(id: string): string {
  return BACKGROUND_LIBRARY.find((b) => b.id === id)?.label ?? id
}

export function characterNeedLabel(need: CharacterNeed): string {
  const { spec, expression, gesture } = need
  return `${roleLabel(spec.role)} · ${spec.gender} · ${ageLabel(spec.age).toLowerCase()} · ${toneLabel(
    spec.tone
  ).toLowerCase()} skin · ${expression} / ${gesture}`
}
