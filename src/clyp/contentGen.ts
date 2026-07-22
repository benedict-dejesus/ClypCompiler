// Clyp — Content block family compiler plugin (81–88).
// Generates semantic HTML (Stage 4), block-scoped CSS (Stage 5) and
// namespaced runtime JS (Stage 6) for the 8 content block types.
import type { BlockSection, ClypObject } from './types'
import type { RuntimeIdentity } from './identity'
import { esc, sanitizeRichText, settingsToCss } from './util'
import { feedbackCss } from './feedback'
import { gateConfig, gateCss, gateHtml, gateJs, type GateConfig } from './gate'

export interface GeneratedParts {
  html: string
  css: string
  js: string
  logicNotes: string[]
}

function el(identity: RuntimeIdentity, objectId: string): string {
  return `${identity.elementIdPrefix}${objectId.replace(/_/g, '-')}`
}

function styleAttr(obj: ClypObject): string {
  const css = settingsToCss(obj.settings)
  return css ? ` style="${esc(css)}"` : ''
}

/** Renders a nested content object (paragraph/heading/quote/reflection) inside a container. */
function renderContentChild(block: BlockSection, obj: ClypObject, identity: RuntimeIdentity): string {
  switch (obj.type) {
    case 'heading': {
      const tag = obj.settings.headingLevel ?? 'h3'
      return `<${tag} class="clyp-heading"${styleAttr(obj)}>${esc(obj.content.text)}</${tag}>`
    }
    case 'paragraph':
      return `<p class="clyp-paragraph"${styleAttr(obj)}>${sanitizeRichText(obj.content.richText)}</p>`
    case 'quote':
      return renderQuote(obj)
    case 'reflection':
      return renderReflection(obj, identity)
    default:
      return ''
  }
}

function renderChildren(block: BlockSection, parent: ClypObject, identity: RuntimeIdentity): string {
  return parent.children
    .map((id) => block.objects[id])
    .filter(Boolean)
    .map((child) => renderContentChild(block, child, identity))
    .join('\n')
}

function renderQuote(obj: ClypObject): string {
  const pull = obj.settings.quoteStyle === 'pullQuote'
  return `<figure class="clyp-quote${pull ? ' clyp-quote--pull' : ''}"${styleAttr(obj)}>
  <blockquote>${esc(obj.content.quoteText)}</blockquote>
  ${obj.content.attribution ? `<figcaption>— ${esc(obj.content.attribution)}</figcaption>` : ''}
</figure>`
}

function renderReflection(obj: ClypObject, identity: RuntimeIdentity): string {
  const id = el(identity, obj.id)
  const rows = obj.settings.responseAreaSize === 'small' ? 3 : obj.settings.responseAreaSize === 'large' ? 10 : 6
  return `<section class="clyp-reflection"${styleAttr(obj)} aria-labelledby="${id}-prompt">
  <p class="clyp-reflection-prompt" id="${id}-prompt">${esc(obj.content.prompt)}</p>
  <label class="clyp-visually-hidden" for="${id}-input">Your reflection</label>
  <textarea class="clyp-reflection-input" id="${id}-input" rows="${rows}" placeholder="Type your thoughts here..."></textarea>
  <p class="clyp-reflection-note">Your response stays on this page — it is a private space to think.</p>
</section>`
}

export function generateContent(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const root = block.objects[block.rootId]
  const rootEl = el(identity, root.id)
  const logicNotes: string[] = []
  let html = ''
  let css = ''
  let js = ''
  // Completion gate — set by the block types that have discrete items.
  let gate: GateConfig | null = null

  switch (root.type) {
    case 'heading': {
      const tag = root.settings.headingLevel ?? 'h2'
      html = `<${tag} class="clyp-heading"${styleAttr(root)}>${esc(root.content.text)}</${tag}>`
      logicNotes.push('This heading is static content with no interactive behavior.')
      break
    }
    case 'paragraph': {
      html = `<p class="clyp-paragraph"${styleAttr(root)}>${sanitizeRichText(root.content.richText)}</p>`
      logicNotes.push('This paragraph is static content with no interactive behavior.')
      break
    }
    case 'quote': {
      html = renderQuote(root)
      logicNotes.push('This quote is static content with no interactive behavior.')
      break
    }
    case 'reflection': {
      html = renderReflection(root, identity)
      js = `
  /* Reflection: typing a response satisfies the completion gate (if enabled).
     The text itself is never read, stored or transmitted. */
  var reflInput = byId('${el(identity, root.id)}-input');
  if (reflInput) {
    reflInput.addEventListener('input', guard(function () {
      if (reflInput.value.trim().length > 0) { gateMark('written'); }
    }));
  }`
      gate = gateConfig(root, 1, 'response')
      logicNotes.push('The reflection response is intentionally not stored anywhere — it exists purely as a thinking space for the learner.')
      break
    }
    case 'accordion': {
      const single = root.settings.expandBehavior !== 'multiOpen'
      const panels = root.children.map((id) => block.objects[id]).filter((p) => p?.type === 'panel')
      html = `<div class="clyp-accordion" id="${rootEl}"${styleAttr(root)}>
${panels
  .map((p, i) => {
    const pid = el(identity, p.id)
    return `  <div class="clyp-acc-item">
    <h3 class="clyp-acc-heading">
      <button type="button" class="clyp-acc-trigger" id="${pid}-btn" aria-expanded="false" aria-controls="${pid}-panel" data-index="${i}">
        <span>${esc(p.content.title)}</span>
        <span class="clyp-acc-icon" aria-hidden="true">+</span>
      </button>
    </h3>
    <div class="clyp-acc-panel" id="${pid}-panel" role="region" aria-labelledby="${pid}-btn" hidden>
      <div class="clyp-acc-panel-inner">
${renderChildren(block, p, identity)}
      </div>
    </div>
  </div>`
  })
  .join('\n')}
</div>`
      js = `
  /* Accordion behavior: ${single ? 'one panel open at a time' : 'panels open independently'}. */
  var acc = byId('${rootEl}');
  var triggers = acc.querySelectorAll('.clyp-acc-trigger');
  function setOpen(btn, open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.clyp-acc-icon').textContent = open ? '\\u2212' : '+';
    var panel = byId(btn.getAttribute('aria-controls'));
    if (open) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', ''); }
  }
  triggers.forEach(function (btn) {
    btn.addEventListener('click', guard(function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      ${single ? "triggers.forEach(function (b) { setOpen(b, false); });" : ''}
      setOpen(btn, !isOpen);
      if (!isOpen) { gateMark(btn.getAttribute('data-index')); }
    }));
  });`
      gate = gateConfig(root, panels.length, 'sections')
      logicNotes.push(`Expand behavior is set to "${single ? 'single open' : 'multiple open'}".`)
      break
    }
    case 'tabs': {
      const panels = root.children.map((id) => block.objects[id]).filter((p) => p?.type === 'panel')
      const active = Math.min(root.settings.defaultActiveTab ?? 0, Math.max(panels.length - 1, 0))
      html = `<div class="clyp-tabs" id="${rootEl}"${styleAttr(root)}>
  <div class="clyp-tablist" role="tablist" aria-label="Content tabs">
${panels
  .map((p, i) => {
    const pid = el(identity, p.id)
    return `    <button type="button" class="clyp-tab" id="${pid}-tab" role="tab" aria-selected="${i === active}" aria-controls="${pid}-panel" tabindex="${i === active ? 0 : -1}">${esc(p.content.tabLabel)}</button>`
  })
  .join('\n')}
  </div>
${panels
  .map((p, i) => {
    const pid = el(identity, p.id)
    return `  <div class="clyp-tabpanel" id="${pid}-panel" role="tabpanel" aria-labelledby="${pid}-tab" tabindex="0"${i === active ? '' : ' hidden'}>
${renderChildren(block, p, identity)}
  </div>`
  })
  .join('\n')}
</div>`
      js = `
  /* Tabs behavior: click or arrow keys switch panels (WAI-ARIA tabs pattern). */
  var tabsRootEl = byId('${rootEl}');
  var tabs = Array.prototype.slice.call(tabsRootEl.querySelectorAll('[role="tab"]'));
  function activateTab(tab) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', selected ? 'true' : 'false');
      t.tabIndex = selected ? 0 : -1;
      var panel = byId(t.getAttribute('aria-controls'));
      if (selected) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', ''); }
    });
    tab.focus();
  }
  /* The tab visible on load counts as explored. */
  gateMark(${active});
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', guard(function () { activateTab(tab); gateMark(i); }));
    tab.addEventListener('keydown', guard(function (e) {
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activateTab(next); gateMark(tabs.indexOf(next)); }
    }));
  });`
      gate = gateConfig(root, panels.length, 'tabs')
      logicNotes.push(`Tab ${active + 1} is shown first by default.`)
      break
    }
    case 'carousel': {
      const slides = root.children.map((id) => block.objects[id]).filter((s) => s?.type === 'slide')
      const auto = !!root.settings.autoAdvance
      const interval = Math.max(1, root.settings.autoAdvanceInterval ?? 5)
      html = `<div class="clyp-carousel" id="${rootEl}"${styleAttr(root)} role="group" aria-roledescription="carousel" aria-label="Content carousel">
  <div class="clyp-car-viewport">
${slides
  .map((s, i) => {
    const sid = el(identity, s.id)
    return `    <div class="clyp-car-slide" id="${sid}" role="group" aria-roledescription="slide" aria-label="Slide ${i + 1} of ${slides.length}"${i === 0 ? '' : ' hidden'}>
${renderChildren(block, s, identity)}
      ${s.content.caption ? `<p class="clyp-car-caption">${esc(s.content.caption)}</p>` : ''}
    </div>`
  })
  .join('\n')}
  </div>
  <div class="clyp-car-controls">
    <button type="button" class="clyp-btn clyp-car-prev" aria-label="Previous slide">&#8592; Previous</button>
    <span class="clyp-car-status" aria-live="polite">Slide 1 of ${slides.length}</span>
    <button type="button" class="clyp-btn clyp-car-next" aria-label="Next slide">Next &#8594;</button>
    ${auto ? '<button type="button" class="clyp-btn clyp-car-pause" aria-pressed="false">Pause</button>' : ''}
  </div>
</div>`
      js = `
  /* Carousel behavior: previous/next controls${auto ? `, auto-advance every ${interval}s with a learner-controlled pause button` : ''}. */
  var car = byId('${rootEl}');
  var slides = Array.prototype.slice.call(car.querySelectorAll('.clyp-car-slide'));
  var status = car.querySelector('.clyp-car-status');
  var current = 0;
  function showSlide(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) {
      if (idx === current) { s.removeAttribute('hidden'); } else { s.setAttribute('hidden', ''); }
    });
    status.textContent = 'Slide ' + (current + 1) + ' of ' + slides.length;
    gateMark(current);
  }
  /* The slide visible on load counts as explored. */
  gateMark(0);
  car.querySelector('.clyp-car-prev').addEventListener('click', guard(function () { showSlide(current - 1); }));
  car.querySelector('.clyp-car-next').addEventListener('click', guard(function () { showSlide(current + 1); }));
  ${auto ? `
  var paused = false;
  var timer = setInterval(function () { if (!paused) showSlide(current + 1); }, ${interval * 1000});
  var pauseBtn = car.querySelector('.clyp-car-pause');
  pauseBtn.addEventListener('click', guard(function () {
    paused = !paused;
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  }));` : ''}`
      gate = gateConfig(root, slides.length, 'slides')
      logicNotes.push(auto ? `Auto-advance is on (every ${interval} seconds) and can be paused by the learner.` : 'Slides advance only when the learner clicks Previous/Next.')
      break
    }
    case 'timeline': {
      const events = root.children.map((id) => block.objects[id]).filter((e) => e?.type === 'event')
      const preset = root.settings.visualPreset ?? 'vertical'
      html = `<div class="clyp-timeline clyp-timeline--${preset}" id="${rootEl}"${styleAttr(root)}>
  <ol class="clyp-tl-list">
${events
  .map((ev, i) => {
    const eid = el(identity, ev.id)
    return `    <li class="clyp-tl-event">
      <button type="button" class="clyp-tl-marker" id="${eid}-btn" aria-expanded="${i === 0}" aria-controls="${eid}-detail">
        <span class="clyp-tl-dot" aria-hidden="true"></span>
        <span class="clyp-tl-label">${esc(ev.content.label)}</span>
        ${ev.content.date ? `<span class="clyp-tl-date">${esc(ev.content.date)}</span>` : ''}
      </button>
      <div class="clyp-tl-detail" id="${eid}-detail"${i === 0 ? '' : ' hidden'}>
${renderChildren(block, ev, identity)}
      </div>
    </li>`
  })
  .join('\n')}
  </ol>
</div>`
      js = `
  /* Timeline behavior: clicking an event reveals its detail. */
  var tl = byId('${rootEl}');
  tl.querySelectorAll('.clyp-tl-marker').forEach(function (btn, i) {
    btn.addEventListener('click', guard(function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      var detail = byId(btn.getAttribute('aria-controls'));
      if (open) { detail.setAttribute('hidden', ''); } else { detail.removeAttribute('hidden'); gateMark(i); }
    }));
  });
  /* The event expanded on load counts as explored. */
  gateMark(0);`
      gate = gateConfig(root, events.length, 'events')
      logicNotes.push(`Timeline is displayed with the "${preset}" visual preset; the first event starts expanded.`)
      break
    }
  }

  css = contentCss(identity)

  // Completion gate is layered on last so it wraps whatever the block produced.
  // gateJs is always prepended for gate-capable blocks — when the gate is off it
  // compiles to a no-op, so the block's own gateMark() calls stay valid.
  if (gate) {
    js = gateJs(rootEl, gate) + js
    if (gate.enabled) {
      html += gateHtml(rootEl, gate)
      css += '\n' + gateCss(identity.cssScopeSelector) + '\n' + feedbackCss(identity.cssScopeSelector)
      logicNotes.push(
        `The learner must explore all ${gate.total} ${gate.noun} before this block is marked complete; progress is shown as they go.`
      )
    }
  }
  return { html, css, js, logicNotes }
}

/** Shared, block-scoped CSS for the content family. Mobile-first (73/111):
 *  base styles target small screens; media queries enhance upward. */
function contentCss(identity: RuntimeIdentity): string {
  const s = identity.cssScopeSelector
  return `/* ---- Base typography & layout (mobile first) ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; line-height: 1.6; }
${s} .clyp-heading { margin: 0 0 0.5em; line-height: 1.25; }
${s} .clyp-paragraph { margin: 0 0 1em; }
${s} .clyp-visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
${s} .clyp-btn { font: inherit; padding: 8px 16px; border: 1px solid #b9cfd4; border-radius: 6px; background: #fff; cursor: pointer; }
${s} .clyp-btn:hover { background: #f2f7f6; }
${s} .clyp-btn:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }

/* ---- Quote ---- */
${s} .clyp-quote { margin: 0 0 1em; padding: 12px 20px; border-left: 4px solid #00c18e; background: #f2f7f6; border-radius: 0 8px 8px 0; }
${s} .clyp-quote blockquote { margin: 0; font-size: 1.1em; font-style: italic; }
${s} .clyp-quote figcaption { margin-top: 8px; color: #3d5f6a; }
${s} .clyp-quote--pull { border-left: none; text-align: center; background: none; padding: 20px 8px; }
${s} .clyp-quote--pull blockquote { font-size: 1.4em; }

/* ---- Reflection ---- */
${s} .clyp-reflection { padding: 16px; border: 1px solid #c7d8db; border-radius: 10px; background: #fbfdfd; }
${s} .clyp-reflection-prompt { font-weight: 600; margin: 0 0 10px; }
${s} .clyp-reflection-input { width: 100%; box-sizing: border-box; font: inherit; padding: 10px; border: 1px solid #b9cfd4; border-radius: 8px; resize: vertical; }
${s} .clyp-reflection-input:focus-visible { outline: 3px solid #015061; outline-offset: 1px; }
${s} .clyp-reflection-note { font-size: 0.85em; color: #5e7d86; margin: 8px 0 0; }

/* ---- Accordion ---- */
${s} .clyp-accordion { border: 1px solid #c7d8db; border-radius: 10px; overflow: hidden; }
${s} .clyp-acc-item + .clyp-acc-item { border-top: 1px solid #c7d8db; }
${s} .clyp-acc-heading { margin: 0; }
${s} .clyp-acc-trigger { display: flex; justify-content: space-between; align-items: center; gap: 12px; width: 100%; padding: 14px 16px; font: inherit; font-weight: 600; text-align: left; background: #fff; border: none; cursor: pointer; }
${s} .clyp-acc-trigger:hover { background: #f2f7f6; }
${s} .clyp-acc-trigger:focus-visible { outline: 3px solid #015061; outline-offset: -3px; }
${s} .clyp-acc-icon { font-size: 1.2em; color: #00b482; }
${s} .clyp-acc-panel-inner { padding: 4px 16px 16px; }

/* ---- Tabs ---- */
${s} .clyp-tablist { display: flex; flex-wrap: wrap; gap: 4px; border-bottom: 2px solid #c7d8db; }
${s} .clyp-tab { font: inherit; font-weight: 600; padding: 10px 16px; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -2px; color: #3d5f6a; }
${s} .clyp-tab[aria-selected="true"] { color: #015061; border-bottom-color: #015061; }
${s} .clyp-tab:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-tabpanel { padding: 16px 4px; }

/* ---- Carousel ---- */
${s} .clyp-carousel { border: 1px solid #c7d8db; border-radius: 10px; padding: 16px; }
${s} .clyp-car-caption { color: #3d5f6a; font-size: 0.9em; }
${s} .clyp-car-controls { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
${s} .clyp-car-status { color: #3d5f6a; font-size: 0.9em; min-width: 90px; text-align: center; }

/* ---- Timeline ---- */
${s} .clyp-tl-list { list-style: none; margin: 0; padding: 0; position: relative; }
${s} .clyp-timeline--vertical .clyp-tl-list, ${s} .clyp-timeline--alternating .clyp-tl-list { border-left: 3px solid #c7d8db; padding-left: 20px; margin-left: 8px; }
${s} .clyp-tl-event { margin-bottom: 12px; position: relative; }
${s} .clyp-tl-marker { display: flex; align-items: baseline; gap: 10px; width: 100%; text-align: left; font: inherit; background: none; border: none; cursor: pointer; padding: 6px 4px; border-radius: 6px; }
${s} .clyp-tl-marker:hover { background: #f2f7f6; }
${s} .clyp-tl-marker:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-tl-dot { width: 12px; height: 12px; border-radius: 50%; background: #00c18e; box-shadow: 0 0 0 3px rgba(0,193,142,0.22); flex: none; }
${s} .clyp-timeline--vertical .clyp-tl-dot, ${s} .clyp-timeline--alternating .clyp-tl-dot { position: absolute; left: -27px; top: 12px; }
${s} .clyp-tl-label { font-weight: 600; }
${s} .clyp-tl-date { color: #5e7d86; font-size: 0.85em; }
${s} .clyp-tl-detail { padding: 4px 8px 8px 26px; }

/* ---- Tablet & desktop enhancements (768px+ / 1024px+, 111_BREAKPOINT_STANDARD) ---- */
@media (min-width: 768px) {
  ${s} .clyp-timeline--horizontal .clyp-tl-list { display: flex; gap: 8px; border-left: none; border-top: 3px solid #c7d8db; padding: 16px 0 0; }
  ${s} .clyp-timeline--horizontal .clyp-tl-event { flex: 1; }
}
@media (min-width: 1024px) {
  ${s} .clyp-tabpanel { padding: 20px 8px; }
}`
}
