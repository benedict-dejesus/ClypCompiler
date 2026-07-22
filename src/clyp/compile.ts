// ClypCompiler — block compile wrapper, ported from the Clyp Master Compiler
// pipeline (60/61_COMPILER_PIPELINE). Identical stage order, minus the
// clipboard stage: ClypCompiler consumes the assembled output itself when
// assembling lessons/courses.
import type { ClypFile, ValidationResult } from './types'
import { validate } from './validator'
import { makeRuntimeIdentity, type RuntimeIdentity } from './identity'
import { generateContent, type GeneratedParts } from './contentGen'
import { generateAssessment } from './assessmentGen'
import { generateScenario } from './scenarioGen'
import { generateConversation } from './conversationGen'
import { generateChart, generateChecklist, generateComparison } from './supplementalGen'
import { catalogEntry } from './catalog'
import { indent } from './util'

export interface CompiledBlock {
  /** Absent for pre-compiled blocks pasted from Clyp. */
  identity?: RuntimeIdentity
  /** Block HTML fragment (scoped root wrapper included), no style/script. */
  html: string
  /** Block-scoped CSS rules (no <style> wrapper). */
  css: string
  /** Namespaced IIFE runtime (no <script> wrapper). */
  js: string
  logicNotes: string[]
  blockLabel: string
}

export interface BlockCompileResult {
  validation: ValidationResult
  output?: CompiledBlock
}

/** Stages 3–6 for a single block. Deterministic aside from RuntimeIdentity. */
export function compileBlock(clyp: ClypFile): BlockCompileResult {
  const validation = validate(clyp)
  if (!validation.passed) return { validation }

  const identity = makeRuntimeIdentity(clyp.project.uuid)
  const entry = catalogEntry(clyp.block.blockType)

  let parts: GeneratedParts
  const bt = clyp.block.blockType
  if (bt === 'chart') parts = generateChart(clyp.block, identity)
  else if (bt === 'checklist') parts = generateChecklist(clyp.block, identity)
  else if (bt === 'comparison') parts = generateComparison(clyp.block, identity)
  else if (bt === 'conversation') parts = generateConversation(clyp.block, identity)
  else if (entry.family === 'assessment') parts = generateAssessment(clyp.block, identity)
  else if (entry.family === 'scenario') parts = generateScenario(clyp.block, identity)
  else parts = generateContent(clyp.block, identity)

  const html = `<div class="${identity.cssScopeClass}" id="${identity.elementIdPrefix}root">
${indent(parts.html, 2)}
</div>`

  // Single Runtime Namespace + graceful-failure boundary
  // (65_RUNTIME_NAMESPACE, 75_RUNTIME_FAILURE_STANDARD).
  const js = `(function () {
  'use strict';
  /* All of this block's behavior lives inside one namespace so several
   * Clyp blocks can safely share the same page. */
  var ns = '${identity.namespaceKey}';
  var root = document.getElementById('${identity.elementIdPrefix}root');
  if (!root) { return; }

  /* Graceful degradation: if anything unexpected happens, the learner sees a
   * friendly message instead of a broken activity. */
  function showFallback() {
    try {
      root.innerHTML = '<p style="padding:16px;border:1px solid #e3b8b8;border-radius:8px;background:#fdf2f2;color:#7f1d1d;font-family:sans-serif;">' +
        'This activity could not continue. Please contact your learning administrator.</p>';
    } catch (ignore) { /* never rethrow */ }
  }
  function guard(fn) {
    return function () {
      try { return fn.apply(this, arguments); } catch (err) { showFallback(); }
    };
  }
  function byId(id) { return document.getElementById(id); }

  window[ns] = { root: root };

  try {
${indent(parts.js, 4)}
  } catch (err) {
    showFallback();
  }
})();`

  return {
    validation,
    output: {
      identity,
      html,
      css: parts.css,
      js,
      logicNotes: parts.logicNotes,
      blockLabel: entry.label
    }
  }
}

/** Parses .clyp file text into the typed structure, with basic shape checks. */
export function parseClypFile(text: string): { ok: true; clyp: ClypFile } | { ok: false; error: string } {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'The file is not valid JSON. Only .clyp files exported from Clyp are supported.' }
  }
  const clyp = data as ClypFile
  if (!clyp || typeof clyp !== 'object' || !clyp.project || !clyp.block || !clyp.block.objects || !clyp.block.rootId) {
    return { ok: false, error: 'The file is missing the required .clyp sections (project / block).' }
  }
  if (!clyp.block.objects[clyp.block.rootId]) {
    return { ok: false, error: `The root object "${clyp.block.rootId}" does not exist in the block.` }
  }
  return { ok: true, clyp }
}
