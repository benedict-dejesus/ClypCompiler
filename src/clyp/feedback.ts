// Clyp — Feedback Engine (141–144). A platform capability, not a block.
// Provides reusable, self-contained feedback interactions that any block can
// render. No cross-block communication, no LMS persistence — a feedback
// element is generated inline into the block's own runtime.
import type { FeedbackDisplay, FeedbackTemplate } from './types'
import { esc } from './util'

export interface FeedbackTemplateDef {
  id: FeedbackTemplate
  label: string
  defaultTitle: string
  color: string // accent / border
  bg: string // tinted background
  fg: string // text
  icon: string // inline SVG glyph
}

const check = '<path d="M5 10.5 L8.5 14 L15 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'
const bang = '<path d="M10 4 L10 11.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="10" cy="15" r="1.3" fill="currentColor"/>'
const cross = '<path d="M6 6 L14 14 M14 6 L6 14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'
const bulb = '<path d="M10 3.5 A4.5 4.5 0 0 1 12.5 12 L7.5 12 A4.5 4.5 0 0 1 10 3.5 Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 14 L12 14 M8.5 16 L11.5 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
const star = '<path d="M10 3 L12 8 L17 8 L13 11.5 L14.5 16.5 L10 13.5 L5.5 16.5 L7 11.5 L3 8 L8 8 Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
const clock = '<circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 6.5 L10 10 L12.5 11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
const person = '<circle cx="10" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.5 16 Q10 11 15.5 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
const chat = '<path d="M3.5 5.5 h13 v8 h-7 l-3 3 v-3 h-3 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'
const whistle = '<circle cx="8" cy="11" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 9 L17 7 L17 10 L12 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>'

export const FEEDBACK_TEMPLATES: FeedbackTemplateDef[] = [
  { id: 'success', label: 'Success', defaultTitle: 'Success', color: '#00916b', bg: '#e2f6ef', fg: '#08533d', icon: check },
  { id: 'warning', label: 'Warning', defaultTitle: 'Heads up', color: '#b7791f', bg: '#fbf1dd', fg: '#79510f', icon: bang },
  { id: 'error', label: 'Error', defaultTitle: 'Not quite', color: '#d64545', bg: '#fbe6e6', fg: '#8a2b2b', icon: cross },
  { id: 'hint', label: 'Hint', defaultTitle: 'Hint', color: '#015061', bg: '#e2eef1', fg: '#013d4a', icon: bulb },
  { id: 'tip', label: 'Tip', defaultTitle: 'Tip', color: '#0e7a8a', bg: '#e0f0f2', fg: '#0a4b55', icon: bulb },
  { id: 'reminder', label: 'Reminder', defaultTitle: 'Reminder', color: '#5b6bb5', bg: '#e9ebf7', fg: '#39457e', icon: clock },
  { id: 'bestPractice', label: 'Best Practice', defaultTitle: 'Best practice', color: '#00916b', bg: '#e2f6ef', fg: '#08533d', icon: star },
  { id: 'managerFeedback', label: 'Manager Feedback', defaultTitle: 'Manager', color: '#33414f', bg: '#e9edf1', fg: '#26313c', icon: person },
  { id: 'customerFeedback', label: 'Customer Feedback', defaultTitle: 'Customer', color: '#0e7a8a', bg: '#e0f0f2', fg: '#0a4b55', icon: chat },
  { id: 'coachFeedback', label: 'Coach Feedback', defaultTitle: 'Coach', color: '#b4632c', bg: '#f6e7db', fg: '#7d4319', icon: whistle }
]

export function feedbackTemplateDef(id: FeedbackTemplate | undefined): FeedbackTemplateDef {
  return FEEDBACK_TEMPLATES.find((t) => t.id === id) ?? FEEDBACK_TEMPLATES[0]
}

export const FEEDBACK_DISPLAYS: { id: FeedbackDisplay; label: string }[] = [
  { id: 'inline', label: 'Inline' },
  { id: 'banner', label: 'Banner' },
  { id: 'callout', label: 'Callout' },
  { id: 'popup', label: 'Popup' }
]

/** Renders a self-contained feedback element. `popup` variants are shown/
 *  dismissed by the block runtime (they start hidden). */
export function feedbackHtml(opts: {
  template: FeedbackTemplate | undefined
  display: FeedbackDisplay | undefined
  title?: string
  message: string
  id: string
}): string {
  const def = feedbackTemplateDef(opts.template)
  const display = opts.display ?? 'inline'
  const title = (opts.title && opts.title.trim()) || def.defaultTitle
  const dismissible = display === 'popup' || display === 'callout'
  return `<div class="clyp-fb clyp-fb--${display}" data-fb-template="${def.id}" id="${opts.id}"${display === 'popup' ? ' hidden' : ''} role="status" aria-live="polite"
  style="--fb-color:${def.color};--fb-bg:${def.bg};--fb-fg:${def.fg};">
  <span class="clyp-fb-icon" aria-hidden="true"><svg viewBox="0 0 20 20" width="20" height="20">${def.icon}</svg></span>
  <div class="clyp-fb-body">
    <p class="clyp-fb-title">${esc(title)}</p>
    <p class="clyp-fb-message">${esc(opts.message)}</p>
  </div>
  ${dismissible ? '<button type="button" class="clyp-fb-close" aria-label="Dismiss">&times;</button>' : ''}
</div>`
}

/** Shared, block-scoped feedback CSS (one copy per block that uses feedback). */
export function feedbackCss(scope: string): string {
  return `/* ---- Feedback Engine ---- */
${scope} .clyp-fb { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 10px; background: var(--fb-bg); color: var(--fb-fg); border: 1px solid color-mix(in srgb, var(--fb-color) 40%, transparent); }
/* Must beat the display rule above: an author "display" always outranks the
   browser's built-in [hidden] rule, so hidden feedback would otherwise show. */
${scope} .clyp-fb[hidden] { display: none; }
${scope} .clyp-fb-icon { color: var(--fb-color); flex: none; line-height: 0; margin-top: 1px; }
${scope} .clyp-fb-body { flex: 1; }
${scope} .clyp-fb-title { margin: 0 0 2px; font-weight: 700; color: var(--fb-color); }
${scope} .clyp-fb-message { margin: 0; }
${scope} .clyp-fb-close { flex: none; border: none; background: none; color: var(--fb-fg); font-size: 20px; line-height: 1; cursor: pointer; padding: 0 2px; opacity: 0.6; }
${scope} .clyp-fb-close:hover { opacity: 1; }
${scope} .clyp-fb--banner { border-radius: 0; border-left: 5px solid var(--fb-color); border-top: none; border-right: none; border-bottom: none; }
${scope} .clyp-fb--callout { border-left: 5px solid var(--fb-color); box-shadow: 0 4px 14px rgba(0,44,57,0.12); }
${scope} .clyp-fb--popup { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); max-width: 420px; z-index: 40; box-shadow: 0 10px 30px rgba(0,44,57,0.22); }`
}
