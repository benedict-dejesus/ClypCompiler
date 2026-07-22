// Clyp — Runtime Namespace & Runtime ID (65_RUNTIME_NAMESPACE).
// One RuntimeIdentity per export: derived from project.uuid + compile-time
// salt so two exports of the same project never collide on one host page.
// Runtime IDs are compiler-owned and never surface in the UI.
export interface RuntimeIdentity {
  runtimeId: string
  namespaceKey: string
  cssScopeSelector: string
  cssScopeClass: string
  elementIdPrefix: string
}

function hash(input: string): string {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0
  }
  return h.toString(36)
}

export function makeRuntimeIdentity(projectUuid: string): RuntimeIdentity {
  const salt = `${Date.now()}-${Math.random()}`
  const runtimeId = hash(`${projectUuid}|${salt}`)
  return {
    runtimeId,
    namespaceKey: `ClypRuntime_${runtimeId}`,
    cssScopeClass: `clyp-block-${runtimeId}`,
    cssScopeSelector: `.clyp-block-${runtimeId}`,
    elementIdPrefix: `clyp-${runtimeId}-`
  }
}
