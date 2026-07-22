// ClypCompiler — the course template library.
// Templates are authored in the compact format (see types.ts) and expanded to
// real .clyp-backed courses on demand, so the whole library ships inside the
// bundle and works offline.
import type { CourseTemplate, TemplateSummary } from './types'
import { summarize } from './buildCourse'

// --- Meridian Health Systems (Healthcare) ---
import { meridianHandHygiene } from './data/meridian-health'
import { meridianDeterioratingPatient } from './data/meridian-deteriorating-patient'
import { meridianMedicationRounds } from './data/meridian-medication-rounds'
import { meridianDocumentation } from './data/meridian-documentation'
import { meridianBreakingBadNews } from './data/meridian-breaking-bad-news'
import { meridianConsent } from './data/meridian-consent'
import { meridianSepsis } from './data/meridian-sepsis'
import { meridianHandover } from './data/meridian-handover'
import { meridianAggression } from './data/meridian-aggression'
import { meridianInterpreters } from './data/meridian-interpreters'
// --- Kestrel Precision Manufacturing (Manufacturing) ---
import { kestrelLockoutTagout } from './data/kestrel-manufacturing'
// --- Northwind Financial Technologies (Financial Services) ---
import { northwindAppFraud } from './data/northwind-fintech'

export const TEMPLATES: CourseTemplate[] = [
  meridianHandHygiene,
  meridianDeterioratingPatient,
  meridianMedicationRounds,
  meridianDocumentation,
  meridianBreakingBadNews,
  meridianConsent,
  meridianSepsis,
  meridianHandover,
  meridianAggression,
  meridianInterpreters,
  kestrelLockoutTagout,
  northwindAppFraud
]

export function templateSummaries(): TemplateSummary[] {
  return TEMPLATES.map(summarize)
}

export function templateById(id: string): CourseTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

/** Distinct industries present in the library, for gallery filtering. */
export function industries(): string[] {
  return [...new Set(TEMPLATES.map((t) => t.industry))].sort()
}

export function companies(): string[] {
  return [...new Set(TEMPLATES.map((t) => t.company))].sort()
}
