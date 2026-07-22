// Clyp — supplemental content blocks: Chart (SVG viz 180), Checklist (160),
// Comparison (170). All self-contained: inline SVG, no external assets, all
// data lives in .clyp.
import type { BlockSection, ClypObject } from './types'
import type { RuntimeIdentity } from './identity'
import { esc, sanitizeRichText } from './util'
import { feedbackCss, feedbackHtml } from './feedback'
import { gateConfig, gateCss, gateHtml, gateJs } from './gate'
import type { GeneratedParts } from './contentGen'

const CHART_PALETTE = ['#015061', '#00c18e', '#3a9bd6', '#e0a33e', '#d64545', '#7b5bb5', '#0e7a8a', '#b4632c']

interface Pt { label: string; value: number; color: string }

function chartPoints(block: BlockSection): Pt[] {
  const root = block.objects[block.rootId]
  return root.children
    .map((id) => block.objects[id])
    .filter((o) => o?.type === 'chartPoint')
    .map((p, i) => ({
      label: p.content.label ?? `Point ${i + 1}`,
      value: Number(p.logic.value ?? 0),
      color: p.settings.accentColor || CHART_PALETTE[i % CHART_PALETTE.length]
    }))
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

function legend(pts: Pt[]): string {
  return `<ul class="clyp-chart-legend">
${pts.map((p) => `    <li><span class="clyp-chart-swatch" style="background:${p.color}"></span>${esc(p.label)}</li>`).join('\n')}
  </ul>`
}

function barChart(pts: Pt[], showValues: boolean): string {
  const W = 420, H = 240, padL = 34, padB = 34, padT = 16
  const max = Math.max(...pts.map((p) => p.value), 1)
  const plotW = W - padL - 12, plotH = H - padB - padT
  const step = plotW / pts.length
  const bw = Math.min(step * 0.62, 56)
  const gridlines = [0, 0.25, 0.5, 0.75, 1]
    .map((g) => {
      const y = padT + plotH * (1 - g)
      return `<line x1="${padL}" y1="${y}" x2="${W - 12}" y2="${y}" stroke="#dbe6e8" stroke-width="1"/><text x="${padL - 6}" y="${y + 3.5}" text-anchor="end" class="clyp-chart-tick">${fmt(max * g)}</text>`
    })
    .join('')
  const bars = pts
    .map((p, i) => {
      const h = (p.value / max) * plotH
      const x = padL + step * i + (step - bw) / 2
      const y = padT + plotH - h
      return `<g>
      <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, 0).toFixed(1)}" rx="4" fill="${p.color}"/>
      ${showValues ? `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" class="clyp-chart-val">${fmt(p.value)}</text>` : ''}
      <text x="${(x + bw / 2).toFixed(1)}" y="${H - padB + 16}" text-anchor="middle" class="clyp-chart-lbl">${esc(p.label)}</text>
    </g>`
    })
    .join('\n')
  return `<svg viewBox="0 0 ${W} ${H}" class="clyp-chart-svg" role="img">
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#b9cfd4" stroke-width="1.5"/>
    <line x1="${padL}" y1="${padT + plotH}" x2="${W - 12}" y2="${padT + plotH}" stroke="#b9cfd4" stroke-width="1.5"/>
    ${gridlines}
    ${bars}
  </svg>`
}

function lineChart(pts: Pt[], showValues: boolean): string {
  const W = 420, H = 240, padL = 34, padB = 34, padT = 16
  const max = Math.max(...pts.map((p) => p.value), 1)
  const plotW = W - padL - 12, plotH = H - padB - padT
  const step = pts.length > 1 ? plotW / (pts.length - 1) : plotW
  const xy = pts.map((p, i) => {
    const x = padL + step * i
    const y = padT + plotH * (1 - p.value / max)
    return [x, y] as [number, number]
  })
  const line = xy.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L ${xy[xy.length - 1][0].toFixed(1)} ${padT + plotH} L ${xy[0][0].toFixed(1)} ${padT + plotH} Z`
  const accent = pts[0]?.color ?? '#015061'
  const dots = xy
    .map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fff" stroke="${pts[i].color}" stroke-width="2.5"/>
      ${showValues ? `<text x="${x.toFixed(1)}" y="${(y - 9).toFixed(1)}" text-anchor="middle" class="clyp-chart-val">${fmt(pts[i].value)}</text>` : ''}
      <text x="${x.toFixed(1)}" y="${H - padB + 16}" text-anchor="middle" class="clyp-chart-lbl">${esc(pts[i].label)}</text>`)
    .join('\n')
  const gridlines = [0, 0.5, 1]
    .map((g) => {
      const y = padT + plotH * (1 - g)
      return `<line x1="${padL}" y1="${y}" x2="${W - 12}" y2="${y}" stroke="#dbe6e8" stroke-width="1"/><text x="${padL - 6}" y="${y + 3.5}" text-anchor="end" class="clyp-chart-tick">${fmt(max * g)}</text>`
    })
    .join('')
  return `<svg viewBox="0 0 ${W} ${H}" class="clyp-chart-svg" role="img">
    ${gridlines}
    <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#b9cfd4" stroke-width="1.5"/>
    <path d="${area}" fill="${accent}" opacity="0.10"/>
    <path d="${line}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`
}

function pieChart(pts: Pt[], donut: boolean, showValues: boolean): string {
  const W = 300, H = 240, cx = 120, cy = 120, r = 100
  const total = pts.reduce((s, p) => s + Math.max(p.value, 0), 0) || 1
  let angle = 0
  const slices = pts
    .map((p) => {
      const frac = Math.max(p.value, 0) / total
      const start = angle
      const end = angle + frac * 360
      angle = end
      const [x1, y1] = polar(cx, cy, r, start)
      const [x2, y2] = polar(cx, cy, r, end)
      const large = end - start <= 180 ? 0 : 1
      const path = `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`
      let label = ''
      if (showValues && frac > 0.04) {
        const [lx, ly] = polar(cx, cy, r * (donut ? 0.82 : 0.6), (start + end) / 2)
        label = `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" class="clyp-chart-slicelbl">${Math.round(frac * 100)}%</text>`
      }
      return `<path d="${path}" fill="${p.color}"/>${label}`
    })
    .join('\n')
  return `<svg viewBox="0 0 ${W} ${H}" class="clyp-chart-svg" role="img">
    ${slices}
    ${donut ? `<circle cx="${cx}" cy="${cy}" r="${r * 0.55}" fill="#ffffff"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" class="clyp-chart-total">${fmt(total)}</text>` : ''}
  </svg>`
}

function radarChart(pts: Pt[], showValues: boolean): string {
  const W = 300, H = 260, cx = 150, cy = 135, r = 100
  const n = Math.max(pts.length, 3)
  const max = Math.max(...pts.map((p) => p.value), 1)
  const rings = [0.33, 0.66, 1]
    .map((g) => {
      const poly = Array.from({ length: n }, (_, i) => polar(cx, cy, r * g, (360 / n) * i))
        .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
        .join(' ')
      return `<polygon points="${poly}" fill="none" stroke="#dbe6e8" stroke-width="1"/>`
    })
    .join('')
  const axes = pts
    .map((p, i) => {
      const [x, y] = polar(cx, cy, r, (360 / n) * i)
      const [lx, ly] = polar(cx, cy, r + 18, (360 / n) * i)
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e3edee" stroke-width="1"/><text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" class="clyp-chart-lbl">${esc(p.label)}</text>`
    })
    .join('')
  const dataPts = pts.map((p, i) => polar(cx, cy, r * (Math.max(p.value, 0) / max), (360 / n) * i))
  const poly = dataPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const accent = pts[0]?.color ?? '#015061'
  const dots = dataPts
    .map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${accent}"/>${showValues ? `<text x="${x.toFixed(1)}" y="${(y - 7).toFixed(1)}" text-anchor="middle" class="clyp-chart-val">${fmt(pts[i].value)}</text>` : ''}`)
    .join('')
  return `<svg viewBox="0 0 ${W} ${H}" class="clyp-chart-svg" role="img">
    ${rings}${axes}
    <polygon points="${poly}" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2"/>
    ${dots}
  </svg>`
}

/** Renders any dataset with the block's chart type. */
function renderChartSvg(type: string, pts: Pt[], showValues: boolean): string {
  if (pts.length === 0) return ''
  if (type === 'bar') return barChart(pts, showValues)
  if (type === 'line') return lineChart(pts, showValues)
  if (type === 'pie') return pieChart(pts, false, showValues)
  if (type === 'donut') return pieChart(pts, true, showValues)
  return radarChart(pts, showValues)
}

/** Chart what-if scenarios (187): learner-pressed buttons that swap the data
 *  so the effect of a named intervention is immediately visible. */
interface Scenario { label: string; description: string; pts: Pt[] }

function chartScenarios(block: BlockSection, base: Pt[]): Scenario[] {
  const root = block.objects[block.rootId]
  return root.children
    .map((id) => block.objects[id])
    .filter((o) => o?.type === 'chartScenario')
    .map((s, i) => {
      const vals = s.logic.values ?? []
      return {
        label: s.content.label?.trim() || `Scenario ${i + 1}`,
        description: s.content.description?.trim() ?? '',
        // One value per base point; missing entries fall back to the baseline.
        pts: base.map((p, idx) => ({ ...p, value: Number(vals[idx] ?? p.value) }))
      }
    })
}

/** The chart SVG only (no wrapper/legend) — also used by the Canvas for a
 *  WYSIWYG author preview. Pass a scenario id to preview that dataset instead
 *  of the baseline. */
export function chartSvgOnly(block: BlockSection, scenarioId?: string): string {
  const root = block.objects[block.rootId]
  const base = chartPoints(block)
  let pts = base
  if (scenarioId) {
    const s = block.objects[scenarioId]
    if (s?.type === 'chartScenario') {
      const vals = s.logic.values ?? []
      pts = base.map((p, i) => ({ ...p, value: Number(vals[i] ?? p.value) }))
    }
  }
  return renderChartSvg(root.settings.chartType ?? 'bar', pts, root.settings.showValues !== false)
}

export function generateChart(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const root = block.objects[block.rootId]
  const rootEl = `${identity.elementIdPrefix}${root.id.replace(/_/g, '-')}`
  const type = root.settings.chartType ?? 'bar'
  const showValues = root.settings.showValues !== false
  const showLegend = root.settings.showLegend !== false
  const pts = chartPoints(block)
  const scenarios = chartScenarios(block, pts)
  const needLegend = showLegend && (type === 'pie' || type === 'donut')
  const baseLabel = root.content.label?.trim() || 'Baseline'
  const logicNotes = [
    `This is a ${type} chart drawn entirely as inline SVG — no images or external libraries.`,
    `The ${pts.length} data point(s) are stored in the block and rendered directly into the exported code.`
  ]

  // Every dataset is pre-rendered at compile time and swapped on click, so the
  // learner sees identical, fully self-contained charts with no runtime maths.
  const frames = [{ label: baseLabel, description: root.content.description?.trim() ?? '', pts }, ...scenarios]
  const framesHtml = frames
    .map(
      (f, i) =>
        `    <div class="clyp-chart-frame${i === 0 ? ' is-active' : ''}" id="${rootEl}-frame-${i}" data-frame="${i}"${i === 0 ? '' : ' hidden'}>${renderChartSvg(type, f.pts, showValues)}</div>`
    )
    .join('\n')

  const controls =
    scenarios.length > 0
      ? `  <div class="clyp-chart-controls" role="group" aria-label="Chart scenarios">
${frames
  .map(
    (f, i) =>
      `    <button type="button" class="clyp-chart-btn${i === 0 ? ' is-active' : ''}" data-frame="${i}" aria-pressed="${i === 0}">${esc(f.label)}</button>`
  )
  .join('\n')}
  </div>`
      : ''

  const insight = scenarios.some((s) => s.description) || frames[0].description
    ? `  <p class="clyp-chart-insight" id="${rootEl}-insight" aria-live="polite">${esc(frames[0].description)}</p>`
    : ''

  const html = `<figure class="clyp-chart clyp-chart--${type}" id="${rootEl}">
  ${root.content.title ? `<figcaption class="clyp-chart-title">${esc(root.content.title)}</figcaption>` : ''}
${controls}
  <div class="clyp-chart-plot">
${framesHtml}
  </div>
  ${needLegend ? legend(pts) : ''}
${insight}
</figure>`

  const gate = gateConfig(root, scenarios.length, 'scenarios')
  let js = ''
  if (scenarios.length > 0) {
    const descs = JSON.stringify(frames.map((f) => f.description))
    js = `
  /* Chart scenarios: each button swaps in a pre-rendered dataset so the learner
     can see the effect of that intervention immediately. */
  var chartRoot = byId('${rootEl}');
  var chartDescs = ${descs};
  var chartInsight = byId('${rootEl}-insight');
  var chartBtns = Array.prototype.slice.call(chartRoot.querySelectorAll('.clyp-chart-btn'));
  var chartFrames = Array.prototype.slice.call(chartRoot.querySelectorAll('.clyp-chart-frame'));
  function showFrame(n) {
    chartFrames.forEach(function (f, i) {
      if (i === n) { f.removeAttribute('hidden'); f.className = 'clyp-chart-frame is-active'; }
      else { f.setAttribute('hidden', ''); f.className = 'clyp-chart-frame'; }
    });
    chartBtns.forEach(function (b, i) {
      b.setAttribute('aria-pressed', i === n ? 'true' : 'false');
      b.className = 'clyp-chart-btn' + (i === n ? ' is-active' : '');
    });
    if (chartInsight) { chartInsight.textContent = chartDescs[n] || ''; }
    /* Index 0 is the baseline; scenarios are what the gate tracks. */
    if (n > 0) { gateMark(n); }
  }
  chartBtns.forEach(function (btn, i) {
    btn.addEventListener('click', guard(function () { showFrame(i); }));
  });`
    logicNotes.push(
      `The learner can switch between ${frames.length} datasets (${frames.map((f) => f.label).join(', ')}) using the buttons; each is pre-rendered so the comparison is instant.`
    )
  }

  let css = chartCss(identity.cssScopeSelector)
  let finalHtml = html
  if (scenarios.length > 0) {
    css += '\n' + chartScenarioCss(identity.cssScopeSelector)
    js = gateJs(rootEl, gate) + js
    if (gate.enabled) {
      finalHtml += gateHtml(rootEl, gate)
      css += '\n' + gateCss(identity.cssScopeSelector) + '\n' + feedbackCss(identity.cssScopeSelector)
      logicNotes.push(`The learner must try all ${gate.total} scenarios before this block is marked complete.`)
    }
  }

  return { html: finalHtml, css, js, logicNotes }
}

function chartScenarioCss(s: string): string {
  return `/* ---- Chart scenarios (what-if buttons) ---- */
${s} .clyp-chart-controls { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 12px; }
${s} .clyp-chart-btn { font: inherit; font-size: 0.9em; font-weight: 600; padding: 7px 15px; border-radius: 999px; border: 1.5px solid #cbdbde; background: #ffffff; color: #015061; cursor: pointer; transition: background 160ms ease, border-color 160ms ease, color 160ms ease; }
${s} .clyp-chart-btn:hover { border-color: #00c18e; }
${s} .clyp-chart-btn.is-active { background: #015061; border-color: #015061; color: #ffffff; }
${s} .clyp-chart-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(0,193,142,0.35); }
${s} .clyp-chart-frame.is-active { animation: clyp-chart-fade 320ms ease; }
@keyframes clyp-chart-fade { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: none; } }
${s} .clyp-chart-insight { margin: 12px 0 0; text-align: center; font-size: 0.93em; color: #3d5f6a; line-height: 1.5; min-height: 1.4em; }`
}

function chartCss(s: string): string {
  return `/* ---- Chart (SVG visualization) ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; }
${s} .clyp-chart { margin: 0; }
${s} .clyp-chart-title { font-weight: 700; font-size: 1.1em; margin-bottom: 10px; text-align: center; }
${s} .clyp-chart-plot { display: flex; justify-content: center; }
${s} .clyp-chart-svg { width: 100%; max-width: 460px; height: auto; }
${s} .clyp-chart-tick, ${s} .clyp-chart-lbl { font-size: 11px; fill: #5e7d86; }
${s} .clyp-chart-val { font-size: 11px; font-weight: 700; fill: #013d4a; }
${s} .clyp-chart-slicelbl { font-size: 12px; font-weight: 700; fill: #ffffff; }
${s} .clyp-chart-total { font-size: 18px; font-weight: 800; fill: #013d4a; }
${s} .clyp-chart-legend { list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 16px; padding: 12px 0 0; margin: 0; font-size: 13px; }
${s} .clyp-chart-legend li { display: flex; align-items: center; gap: 7px; }
${s} .clyp-chart-swatch { width: 13px; height: 13px; border-radius: 3px; display: inline-block; }`
}

// -----------------------------------------------------------------------------
// Checklist (160) — interactive completion tracking, with feedback (141)
// -----------------------------------------------------------------------------
export function generateChecklist(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const root = block.objects[block.rootId]
  const rootEl = `${identity.elementIdPrefix}checklist`
  const items = root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'checkitem')
  const mode = root.settings.completionMode ?? 'allRequired'
  const requiredCount = items.filter((i) => i.settings.required !== false).length
  const minRequired = mode === 'minimumRequired' ? Math.max(1, Math.min(root.settings.minRequired ?? 1, items.length)) : requiredCount
  const hasFeedback = !!root.content.feedbackText?.trim()
  const fbId = `${rootEl}-fb`

  const html = `<div class="clyp-checklist" id="${rootEl}" data-mode="${mode}" data-min="${minRequired}">
  ${root.content.title ? `<p class="clyp-cl-title">${esc(root.content.title)}</p>` : ''}
  <ul class="clyp-cl-list">
${items
  .map((it) => {
    const iid = `${identity.elementIdPrefix}${it.id.replace(/_/g, '-')}`
    const required = it.settings.required !== false && mode === 'allRequired'
    return `    <li class="clyp-cl-item">
      <button type="button" class="clyp-cl-toggle" id="${iid}" role="checkbox" aria-checked="false" data-required="${it.settings.required !== false}">
        <span class="clyp-cl-box" aria-hidden="true"></span>
        <span class="clyp-cl-label">${esc(it.content.text)}${required ? ' <span class="clyp-cl-req" title="Required">*</span>' : ''}</span>
      </button>
    </li>`
  })
  .join('\n')}
  </ul>
  <p class="clyp-cl-progress" data-role="progress" aria-live="polite"></p>
  ${hasFeedback ? feedbackHtml({ template: root.settings.feedbackTemplate, display: root.settings.feedbackDisplay, title: root.content.title, message: root.content.feedbackText!, id: fbId }) : ''}
</div>`

  const js = `
  /* Checklist behavior: toggles, live progress, and completion feedback.
   * Completion mode: ${mode}${mode === 'minimumRequired' ? ` (at least ${minRequired})` : ''}. */
  var cl = byId('${rootEl}');
  var toggles = Array.prototype.slice.call(cl.querySelectorAll('.clyp-cl-toggle'));
  var progress = cl.querySelector('[data-role="progress"]');
  var fb = ${hasFeedback ? `byId('${fbId}')` : 'null'};
  var mode = '${mode}';
  var minRequired = ${minRequired};
  var total = toggles.length;
  var requiredTotal = toggles.filter(function (t) { return t.getAttribute('data-required') === 'true'; }).length;

  function checkedCount() { return toggles.filter(function (t) { return t.getAttribute('aria-checked') === 'true'; }).length; }
  function requiredChecked() {
    return toggles.filter(function (t) { return t.getAttribute('data-required') === 'true' && t.getAttribute('aria-checked') === 'true'; }).length;
  }
  function isComplete() {
    if (mode === 'allRequired') return requiredChecked() >= requiredTotal && requiredTotal > 0;
    if (mode === 'minimumRequired') return checkedCount() >= minRequired;
    return checkedCount() > 0; /* optional */
  }
  function showFeedback(on) {
    if (!fb) return;
    if (fb.classList.contains('clyp-fb--popup')) { if (on) { fb.removeAttribute('hidden'); } else { fb.setAttribute('hidden', ''); } }
    else { fb.style.display = on ? '' : 'none'; }
  }
  function render() {
    var done = checkedCount();
    var target = mode === 'allRequired' ? requiredTotal : (mode === 'minimumRequired' ? minRequired : total);
    progress.textContent = done + ' of ' + target + (mode === 'optional' ? ' selected' : ' complete');
    var complete = isComplete();
    cl.classList.toggle('is-complete', complete);
    showFeedback(complete);
  }
  showFeedback(false);
  toggles.forEach(function (t) {
    t.addEventListener('click', guard(function () {
      var on = t.getAttribute('aria-checked') === 'true';
      t.setAttribute('aria-checked', on ? 'false' : 'true');
      t.classList.toggle('is-checked', !on);
      render();
    }));
    t.addEventListener('keydown', guard(function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t.click(); }
    }));
  });
  if (fb) {
    var close = fb.querySelector('.clyp-fb-close');
    if (close) close.addEventListener('click', guard(function () { showFeedback(false); }));
  }
  render();`

  const css = checklistCss(identity.cssScopeSelector) + '\n' + feedbackCss(identity.cssScopeSelector)
  return {
    html,
    css,
    js,
    logicNotes: [
      mode === 'allRequired'
        ? 'The checklist is complete when every required item is checked.'
        : mode === 'minimumRequired'
          ? `The checklist is complete when at least ${minRequired} item(s) are checked.`
          : 'Every item is optional — the checklist tracks selections without requiring any.',
      hasFeedback ? 'A feedback message appears once the completion rule is met.' : 'No completion feedback is configured.'
    ]
  }
}

function checklistCss(s: string): string {
  return `/* ---- Checklist ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; line-height: 1.6; }
${s} .clyp-checklist { border: 1px solid #c7d8db; border-radius: 12px; padding: 16px 18px; background: #fff; }
${s} .clyp-cl-title { font-weight: 700; margin: 0 0 10px; }
${s} .clyp-cl-list { list-style: none; margin: 0 0 10px; padding: 0; }
${s} .clyp-cl-item { margin-bottom: 6px; }
${s} .clyp-cl-toggle { display: flex; align-items: flex-start; gap: 11px; width: 100%; text-align: left; font: inherit; background: none; border: 1px solid transparent; border-radius: 8px; padding: 8px 10px; cursor: pointer; }
${s} .clyp-cl-toggle:hover { background: #f2f7f6; }
${s} .clyp-cl-toggle:focus-visible { outline: 3px solid #015061; outline-offset: 1px; }
${s} .clyp-cl-box { flex: none; width: 22px; height: 22px; border: 2px solid #b9cfd4; border-radius: 6px; margin-top: 1px; position: relative; transition: background 0.12s, border-color 0.12s; }
${s} .clyp-cl-toggle.is-checked .clyp-cl-box { background: #00916b; border-color: #00916b; }
${s} .clyp-cl-toggle.is-checked .clyp-cl-box::after { content: ""; position: absolute; left: 6px; top: 2px; width: 6px; height: 11px; border: solid #fff; border-width: 0 2.6px 2.6px 0; transform: rotate(45deg); }
${s} .clyp-cl-toggle.is-checked .clyp-cl-label { color: #5e7d86; text-decoration: line-through; }
${s} .clyp-cl-req { color: #d64545; font-weight: 700; }
${s} .clyp-cl-progress { font-size: 0.9em; font-weight: 600; color: #5e7d86; margin: 0 0 10px; }
${s} .clyp-checklist.is-complete .clyp-cl-progress { color: #00916b; }`
}

// -----------------------------------------------------------------------------
// Comparison (170) — side-by-side columns of points
// -----------------------------------------------------------------------------
export function generateComparison(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const root = block.objects[block.rootId]
  const layout = root.settings.comparisonLayout ?? 'horizontal'
  const cols = root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'comparisonColumn')
  const accents = ['#015061', '#00c18e', '#3a9bd6']

  const html = `<div class="clyp-cmp clyp-cmp--${layout}">
  ${root.content.title ? `<p class="clyp-cmp-title">${esc(root.content.title)}</p>` : ''}
  <div class="clyp-cmp-grid" style="--cols:${cols.length}">
${cols
  .map((col, ci) => {
    const rows = col.children.map((id) => block.objects[id]).filter((o) => o?.type === 'comparisonRow')
    const accent = col.settings.accentColor || accents[ci % accents.length]
    return `    <section class="clyp-cmp-col" style="--accent:${accent}">
      <h3 class="clyp-cmp-head">${esc(col.content.title)}</h3>
      <ul class="clyp-cmp-points">
${rows.map((r) => `        <li>${sanitizeRichText(r.content.text)}</li>`).join('\n')}
      </ul>
    </section>`
  })
  .join('\n')}
  </div>
</div>`

  return {
    html,
    css: comparisonCss(identity.cssScopeSelector),
    js: '',
    logicNotes: [
      `A ${layout} comparison with ${cols.length} column(s). Static content — no interaction required.`
    ]
  }
}

function comparisonCss(s: string): string {
  return `/* ---- Comparison ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; line-height: 1.6; }
${s} .clyp-cmp-title { font-weight: 700; font-size: 1.1em; text-align: center; margin: 0 0 12px; }
${s} .clyp-cmp-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
${s} .clyp-cmp-col { border: 1px solid #c7d8db; border-top: 4px solid var(--accent); border-radius: 10px; padding: 12px 16px 4px; background: #fff; }
${s} .clyp-cmp-head { margin: 0 0 8px; color: var(--accent); font-size: 1.05em; }
${s} .clyp-cmp-points { margin: 0 0 10px; padding-left: 4px; list-style: none; }
${s} .clyp-cmp-points li { position: relative; padding: 5px 0 5px 22px; border-bottom: 1px solid #eef3f2; }
${s} .clyp-cmp-points li:last-child { border-bottom: none; }
${s} .clyp-cmp-points li::before { content: ""; position: absolute; left: 2px; top: 12px; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
${s} .clyp-cmp--card .clyp-cmp-col { box-shadow: 0 3px 12px rgba(0,44,57,0.08); }
/* Tablet+ : horizontal / vertical / card lay columns side by side */
@media (min-width: 640px) {
  ${s} .clyp-cmp--horizontal .clyp-cmp-grid, ${s} .clyp-cmp--card .clyp-cmp-grid { grid-template-columns: repeat(var(--cols), 1fr); }
}
${s} .clyp-cmp--stacked .clyp-cmp-grid { grid-template-columns: 1fr; }`
}
