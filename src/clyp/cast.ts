// Clyp — cast helpers. Characters are specified by role (dropdown), not typed
// names: display names derive from the role label, with automatic numbering
// when a role appears more than once ("Manager 1", "Manager 2"). A manually
// stored name (legacy files, or a tree rename) always wins.
import type { BlockSection, ClypObject } from './types'
import { ROLES, specFromSettings, type CharacterSpec } from './assets'

export function characterSpecOf(obj: ClypObject): CharacterSpec {
  return specFromSettings(obj.settings)
}

/** All character objects in document order: block-level cast first, then any
 *  legacy scene-level characters. */
export function allCharacters(block: BlockSection): ClypObject[] {
  const out: ClypObject[] = []
  const root = block.objects[block.rootId]
  if (!root) return out
  for (const id of root.children) {
    const o = block.objects[id]
    if (o?.type === 'character') out.push(o)
  }
  for (const id of root.children) {
    const scene = block.objects[id]
    if (scene?.type !== 'scene') continue
    for (const cid of scene.children) {
      const o = block.objects[cid]
      if (o?.type === 'character') out.push(o)
    }
  }
  return out
}

export function roleLabel(roleId: string): string {
  return ROLES.find((r) => r.id === roleId)?.label ?? 'Character'
}

/** Role label + automatic numbering among unnamed characters of the same role. */
export function characterDisplayName(block: BlockSection, id: string): string {
  const obj = block.objects[id]
  if (!obj) return 'Character'
  if (obj.name?.trim()) return obj.name.trim()
  const role = characterSpecOf(obj).role
  const label = roleLabel(role)
  const sameRole = allCharacters(block).filter((c) => !c.name?.trim() && characterSpecOf(c).role === role)
  if (sameRole.length <= 1) return label
  const index = sameRole.findIndex((c) => c.id === id)
  return `${label} ${index + 1}`
}
