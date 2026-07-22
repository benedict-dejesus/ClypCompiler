// Clyp — Completion Gate Engine (gatekeeping + gamification).
// A platform capability, not a block: any interactive block can state what the
// learner still has to do, track it, and confirm completion. Two modes:
//   explore   — visit every item (tabs, slides, sections, events, scenarios)
//   condition — satisfy a single requirement (pass the assessment, answer right)
// The gate always shows a REMINDER first, which transitions into the completion
// message once satisfied. Entirely self-contained inside the block's own
// runtime — no LMS calls, no cross-block communication (Self-Contained Export).
import type { ClypObject, FeedbackTemplate } from './types'
import { feedbackHtml } from './feedback'
import { esc } from './util'

export type GateMode = 'explore' | 'condition'

export interface GateConfig {
  enabled: boolean
  mode: GateMode
  total: number
  /** Plural noun for the tracked items, e.g. "tabs", "panels", "slides". */
  noun: string
  reminder: string
  reminderTemplate: FeedbackTemplate
  message: string
  template: FeedbackTemplate
  showProgress: boolean
}

export const DEFAULT_GATE_MESSAGE = 'Nicely done — you completed everything in this block.'

/** Reads gate settings off a block root and pairs them with the requirement. */
export function gateConfig(
  root: ClypObject,
  total: number,
  noun: string,
  opts?: { mode?: GateMode; defaultReminder?: string }
): GateConfig {
  const mode = opts?.mode ?? 'explore'
  const fallbackReminder =
    opts?.defaultReminder ??
    (mode === 'explore'
      ? `Explore all ${total} ${noun} to complete this block.`
      : 'Complete this block to continue.')
  return {
    enabled: !!root.settings.gateEnabled && total > 0,
    mode,
    total,
    noun,
    reminder: (root.settings.gateReminder || '').trim() || fallbackReminder,
    reminderTemplate: root.settings.gateReminderTemplate ?? 'reminder',
    message: (root.settings.gateMessage || '').trim() || DEFAULT_GATE_MESSAGE,
    template: root.settings.gateTemplate ?? 'success',
    showProgress: root.settings.gateShowProgress !== false
  }
}

/** Progress meter + live status + reminder (visible) + completion (hidden). */
export function gateHtml(rootEl: string, cfg: GateConfig): string {
  if (!cfg.enabled) return ''
  const showMeter = cfg.mode === 'explore' && cfg.showProgress
  const meter = showMeter
    ? `  <div class="clyp-gate-track" role="progressbar" aria-valuemin="0" aria-valuemax="${cfg.total}" aria-valuenow="0" aria-label="Progress">
    <div class="clyp-gate-fill" id="${rootEl}-gatefill"></div>
  </div>`
    : ''
  const status =
    cfg.mode === 'explore'
      ? `  <p class="clyp-gate-status" id="${rootEl}-gatestatus" aria-live="polite">0 of ${cfg.total} ${esc(cfg.noun)} explored</p>`
      : ''
  // The reminder starts visible; the completion message starts hidden. Both are
  // Feedback Engine elements so they inherit the block's visual language.
  const reminder = feedbackHtml({
    template: cfg.reminderTemplate,
    display: 'inline',
    title: 'Before you finish',
    message: cfg.reminder,
    id: `${rootEl}-gatereminder`
  })
  const done = feedbackHtml({
    template: cfg.template,
    display: 'inline',
    title: 'Block complete',
    message: cfg.message,
    id: `${rootEl}-gatedone`
  }).replace('<div class="clyp-fb', '<div hidden class="clyp-fb')
  return `
<div class="clyp-gate" id="${rootEl}-gate" data-total="${cfg.total}">
${meter}
${status}
  ${reminder}
  ${done}
</div>`
}

/** Tracking runtime. Defines gateMark(key) for the block's own handlers. */
export function gateJs(rootEl: string, cfg: GateConfig): string {
  if (!cfg.enabled) {
    // Always define no-ops so block code can call these unconditionally.
    // Both are required: assessment blocks call gateSatisfy() the moment the
    // learner passes, so omitting it throws a ReferenceError on success and
    // drops the learner into the graceful-failure message.
    return `
  function gateMark() { /* completion gate disabled for this block */ }
  function gateSatisfy() { /* completion gate disabled for this block */ }`
  }
  return `
  /* Completion gate: a reminder states what is still required, then becomes the
     completion message once the learner satisfies it. */
  var gateSeen = {};
  var gateCount = 0;
  var gateTotal = ${cfg.total};
  var gateComplete = false;
  var gateFill = byId('${rootEl}-gatefill');
  var gateStatus = byId('${rootEl}-gatestatus');
  var gateReminder = byId('${rootEl}-gatereminder');
  var gateDone = byId('${rootEl}-gatedone');
  var gateTrack = gateFill ? gateFill.parentNode : null;
  function gateFinish() {
    if (gateComplete) { return; }
    gateComplete = true;
    if (gateStatus) { gateStatus.textContent = 'All ${cfg.noun} explored'; }
    if (gateReminder) { gateReminder.setAttribute('hidden', ''); }
    if (gateDone) { gateDone.removeAttribute('hidden'); }
    var gateRoot = byId('${rootEl}-gate');
    if (gateRoot) { gateRoot.className += ' is-complete'; }
    /* ClypCompiler: notify a hosting course player (if any) that this block's
       completion requirement is satisfied. Safe no-op when standalone. */
    try {
      document.dispatchEvent(new CustomEvent('clyp:block-complete', { detail: { gateId: '${rootEl}-gate' } }));
    } catch (ignore) { /* older browsers: course tracking degrades gracefully */ }
  }
  function gateMark(key) {
    if (gateComplete || key === undefined || key === null) { return; }
    var k = String(key);
    if (gateSeen[k]) { return; }
    gateSeen[k] = true;
    gateCount++;
    if (gateFill) { gateFill.style.width = Math.round((gateCount / gateTotal) * 100) + '%'; }
    if (gateTrack && gateTrack.setAttribute) { gateTrack.setAttribute('aria-valuenow', String(gateCount)); }
    if (gateStatus) { gateStatus.textContent = gateCount + ' of ' + gateTotal + ' ${cfg.noun} explored'; }
    if (gateCount >= gateTotal) { gateFinish(); }
  }
  /* Lets a block clear the gate outright (e.g. the learner passed the quiz). */
  function gateSatisfy() { gateFinish(); }`
}

/** Block-scoped gate CSS (one copy per block that uses gating). */
export function gateCss(scope: string): string {
  return `/* ---- Completion Gate ---- */
${scope} .clyp-gate { margin-top: 16px; padding-top: 14px; border-top: 1px solid #e4edee; display: flex; flex-direction: column; gap: 8px; }
${scope} .clyp-gate-track { height: 8px; border-radius: 999px; background: #e4edee; overflow: hidden; }
${scope} .clyp-gate-fill { height: 100%; width: 0%; border-radius: 999px; background: linear-gradient(90deg, #015061, #00c18e); transition: width 260ms ease; }
${scope} .clyp-gate-status { margin: 0; font-size: 0.86em; color: #3d5f6a; font-weight: 600; }
${scope} .clyp-gate.is-complete .clyp-gate-status { color: #00916b; }
${scope} .clyp-gate .clyp-fb { animation: clyp-gate-fade 300ms ease; }
@keyframes clyp-gate-fade { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }`
}
