// ClypCompiler — Course Player runtime generator.
// Produces one fully self-contained, mobile-responsive index.html: shell UI,
// lesson navigation, gamification (XP / levels / badges), gatekeeping, and
// progress persistence (localStorage always; SCORM 1.2 when an LMS is
// present). The file must work when opened straight from disk — no fetches,
// no external dependencies.
import type { Course, AssetItem } from '../model/course'
import { themeById, type ThemeSpec } from '../model/course'
import type { CompiledLesson } from './compileCourse'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function themeVarsCss(t: ThemeSpec): string {
  const v = t.vars
  return [
    `--cc-primary:${v.primary}`,
    `--cc-primary-dark:${v.primaryDark}`,
    `--cc-accent:${v.accent}`,
    `--cc-bg:${v.bg}`,
    `--cc-surface:${v.surface}`,
    `--cc-text:${v.text}`,
    `--cc-muted:${v.muted}`,
    `--cc-sidebar-bg:${v.sidebarBg}`,
    `--cc-sidebar-text:${v.sidebarText}`,
    `--cc-font:${t.fontFamily}`
  ].join(';')
}

export interface RuntimeBlockMeta {
  /** Global block index — the persistence key. */
  index: number
  lessonIndex: number
  gated: boolean
  xp: number
  title: string
}

/** Builds the complete course player HTML document. */
export function buildCourseHtml(course: Course, lessons: CompiledLesson[]): string {
  const theme = themeById(course.themeId)
  const gam = course.gamification
  const gate = course.gatekeeping

  // ---- flatten blocks with global indexes ---------------------------------
  const blockMeta: RuntimeBlockMeta[] = []
  let blockIndex = 0
  const lessonSections: string[] = []
  const allCss: string[] = []
  const allJs: string[] = []

  lessons.forEach((cl, li) => {
    const lessonTheme = cl.lesson.themeId ? themeById(cl.lesson.themeId) : null
    const sectionStyle = lessonTheme ? ` style="${esc(themeVarsCss(lessonTheme))}"` : ''
    const blocksHtml = cl.blocks
      .map((cb) => {
        const idx = blockIndex++
        blockMeta.push({
          index: idx,
          lessonIndex: li,
          gated: cb.gated,
          xp: cb.xp,
          title: cb.block.title
        })
        allCss.push(
          `/* ---- Block: ${cb.block.title.replace(/\*\//g, '')} ---- */\n${cb.compiled.css}`
        )
        allJs.push(cb.compiled.js)
        return `<div class="cc-blockwrap" data-cc-block="${idx}"${cb.gated ? ' data-cc-gated="1"' : ''}>
${cb.compiled.html}
</div>`
      })
      .join('\n')

    lessonSections.push(`<section class="cc-lesson" data-cc-lesson="${li}" hidden${sectionStyle}>
  <header class="cc-lesson-head">
    <p class="cc-lesson-kicker">Lesson ${li + 1} of ${lessons.length}</p>
    <h1>${esc(cl.lesson.title)}</h1>
    ${cl.lesson.description ? `<p class="cc-lesson-desc">${esc(cl.lesson.description)}</p>` : ''}
  </header>
  ${blocksHtml || '<p class="cc-empty-lesson">This lesson has no blocks yet.</p>'}
  <footer class="cc-lesson-foot">
    <button type="button" class="cc-btn cc-btn-ghost" data-cc-prev${li === 0 ? ' disabled' : ''}>&#8592; Previous</button>
    <button type="button" class="cc-btn cc-btn-primary" data-cc-next>${li === lessons.length - 1 ? 'Finish course' : 'Next lesson &#8594;'}</button>
  </footer>
</section>`)
  })

  const navItems = lessons
    .map(
      (cl, li) => `<li>
  <button type="button" class="cc-nav-item" data-cc-nav="${li}">
    <span class="cc-nav-status" data-cc-navstatus="${li}"></span>
    <span class="cc-nav-label">${esc(cl.lesson.title)}</span>
  </button>
</li>`
    )
    .join('\n')

  // ---- runtime configuration ----------------------------------------------
  const config = {
    uuid: course.uuid,
    title: course.meta.title,
    version: course.meta.version,
    lessons: lessons.map((cl) => ({
      title: cl.lesson.title,
      badgeIcon: cl.lesson.badgeIcon || '\u{1F3C5}'
    })),
    blocks: blockMeta,
    gamification: {
      enabled: gam.enabled,
      lessonBonus: gam.xpLessonBonus,
      showXpBar: gam.showXpBar,
      showBadges: gam.showBadges,
      showLevel: gam.showLevel,
      xpPerLevel: Math.max(1, gam.xpPerLevel),
      customBadges: gam.badges.map((b) => ({
        id: b.id,
        label: b.label,
        icon: b.icon || '⭐',
        kind: b.kind,
        lessonIndex:
          b.kind === 'lesson' ? course.lessons.findIndex((l) => l.id === b.lessonId) : -1,
        xpThreshold: b.xpThreshold ?? 0
      }))
    },
    gatekeeping: {
      linear: gate.navigation === 'linear',
      lessonCompletion: gate.lessonCompletion,
      showLocks: gate.showLocks,
      completionScreen: gate.completionScreen
    }
  }

  const html = `<!DOCTYPE html>
<html lang="${esc(course.meta.language || 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(course.meta.title)}</title>
<meta name="description" content="${esc(course.meta.description)}">
<meta name="generator" content="ClypCompiler">
<style>
/* ==========================================================================
   COURSE PLAYER SHELL — generated by ClypCompiler.
   Mobile-first; the sidebar collapses to an off-canvas drawer under 900px.
   ========================================================================== */
:root { ${themeVarsCss(theme)}; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: var(--cc-font); background: var(--cc-bg); color: var(--cc-text); min-height: 100vh; }
button { font-family: inherit; }

.cc-app { display: flex; flex-direction: column; min-height: 100vh; }

/* ---- Header ---- */
.cc-header { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 12px; padding: 10px 16px; background: var(--cc-primary); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
.cc-menu-btn { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 0; border-radius: 8px; background: rgba(255,255,255,0.14); color: #fff; font-size: 20px; cursor: pointer; }
.cc-header-title { flex: 1 1 auto; min-width: 0; }
.cc-header-title h2 { margin: 0; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-header-title p { margin: 0; font-size: 0.72rem; opacity: 0.85; }
.cc-hud { display: flex; align-items: center; gap: 10px; }
.cc-level { font-size: 0.78rem; font-weight: 700; background: rgba(255,255,255,0.16); border-radius: 999px; padding: 4px 10px; white-space: nowrap; }
.cc-xpwrap { display: none; flex-direction: column; gap: 3px; width: 160px; }
.cc-xpbar { height: 8px; border-radius: 999px; background: rgba(255,255,255,0.22); overflow: hidden; }
.cc-xpfill { height: 100%; width: 0%; background: var(--cc-accent); border-radius: 999px; transition: width 400ms ease; }
.cc-xptext { font-size: 0.68rem; opacity: 0.9; text-align: right; }
@media (min-width: 560px) { .cc-xpwrap { display: flex; } }
.cc-progresschip { font-size: 0.78rem; font-weight: 700; background: rgba(255,255,255,0.16); border-radius: 999px; padding: 4px 10px; white-space: nowrap; }

/* ---- Layout ---- */
.cc-body { display: flex; flex: 1 1 auto; min-height: 0; }
.cc-sidebar { position: fixed; inset: 0 auto 0 0; z-index: 60; width: 280px; max-width: 85vw; transform: translateX(-102%); transition: transform 240ms ease; background: var(--cc-sidebar-bg); color: var(--cc-sidebar-text); display: flex; flex-direction: column; padding: 18px 14px; overflow-y: auto; }
.cc-sidebar.is-open { transform: none; box-shadow: 0 0 40px rgba(0,0,0,0.4); }
.cc-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.45); opacity: 0; pointer-events: none; transition: opacity 200ms ease; }
.cc-overlay.is-open { opacity: 1; pointer-events: auto; }
.cc-sidebar h3 { margin: 4px 6px 14px; font-size: 0.95rem; letter-spacing: 0.02em; }
.cc-sidebar ol { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.cc-nav-item { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; border: 0; background: transparent; color: inherit; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 0.88rem; }
.cc-nav-item:hover { background: rgba(255,255,255,0.08); }
.cc-nav-item.is-active { background: rgba(255,255,255,0.16); font-weight: 700; }
.cc-nav-item.is-locked { opacity: 0.55; cursor: not-allowed; }
.cc-nav-status { flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.35); display: inline-flex; align-items: center; justify-content: center; font-size: 12px; }
.cc-nav-status.is-done { background: var(--cc-accent); border-color: var(--cc-accent); color: #08331f; }
.cc-nav-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.cc-sidebar-foot { margin-top: auto; padding: 14px 6px 4px; font-size: 0.68rem; opacity: 0.65; }
@media (min-width: 900px) {
  .cc-sidebar { position: sticky; top: 0; height: 100vh; transform: none; flex: 0 0 280px; }
  .cc-overlay { display: none; }
  .cc-menu-btn { display: none; }
}

/* ---- Main / lessons ---- */
.cc-main { flex: 1 1 auto; min-width: 0; display: flex; justify-content: center; padding: 20px 14px 60px; }
.cc-lesson, .cc-completion { width: 100%; max-width: 860px; }
.cc-lesson { animation: cc-lesson-in 420ms cubic-bezier(0.16,1,0.3,1) both; }
@keyframes cc-lesson-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
.cc-lesson-head { margin-bottom: 18px; }
.cc-lesson-kicker { margin: 0 0 2px; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.7rem; font-weight: 700; color: var(--cc-muted); }
.cc-lesson-head h1 { margin: 0 0 6px; font-size: 1.6rem; color: var(--cc-text); }
.cc-lesson-desc { margin: 0; color: var(--cc-muted); }
.cc-blockwrap {
  background: var(--cc-surface); border-radius: 16px;
  box-shadow: 0 1px 2px rgba(15,40,50,0.05), 0 4px 14px rgba(15,40,50,0.07);
  padding: 20px; margin-bottom: 20px;
  border: 1px solid rgba(15,40,50,0.05);
  transition: box-shadow 320ms cubic-bezier(0.22,0.61,0.36,1), transform 320ms cubic-bezier(0.22,0.61,0.36,1),
              opacity 320ms cubic-bezier(0.22,0.61,0.36,1);
}
/* Blocks fade up as they scroll in. This is scoped to .cc-js — a class the
   runtime sets the moment it parses — so if scripting is unavailable or the
   runtime fails, every block simply renders visible. */
.cc-js .cc-blockwrap { opacity: 0; transform: translateY(14px); }
.cc-js .cc-blockwrap.is-revealed { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .cc-js .cc-blockwrap { opacity: 1; transform: none; }
}
.cc-blockwrap:hover { box-shadow: 0 2px 4px rgba(15,40,50,0.06), 0 10px 26px rgba(15,40,50,0.10); }
/* A completed block gets a subtle mint edge so progress is visible at a glance. */
.cc-blockwrap.is-done { border-color: color-mix(in srgb, var(--cc-accent) 45%, transparent); }
.cc-blockwrap img.clyp-asset-replaced { border-radius: 10px; }
.cc-blockwrap img.clyp-art { border-radius: 10px; }
.cc-empty-lesson { color: var(--cc-muted); font-style: italic; }
.cc-lesson-foot { display: flex; justify-content: space-between; gap: 12px; margin-top: 26px; }
.cc-btn {
  border: 0; border-radius: 11px; padding: 12px 22px;
  font-size: 0.92rem; font-weight: 700; cursor: pointer;
  transition: transform 140ms cubic-bezier(0.22,0.61,0.36,1), box-shadow 220ms, background-color 220ms, opacity 220ms;
}
.cc-btn:not(:disabled):hover { transform: translateY(-2px); }
.cc-btn:not(:disabled):active { transform: translateY(0) scale(0.985); }
.cc-btn:disabled { opacity: 0.42; cursor: not-allowed; }
.cc-btn-primary { background: var(--cc-primary); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.16); }
.cc-btn-primary:not(:disabled):hover { background: var(--cc-primary-dark); box-shadow: 0 6px 18px rgba(0,0,0,0.22); }
/* When the lesson is finished, the next button invites the click. */
.cc-btn-primary.is-ready { animation: cc-ready 2s ease-in-out infinite; }
@keyframes cc-ready { 0%,100% { box-shadow: 0 2px 8px rgba(0,0,0,0.16); } 50% { box-shadow: 0 2px 8px rgba(0,0,0,0.16), 0 0 0 8px color-mix(in srgb, var(--cc-accent) 22%, transparent); } }
.cc-btn-ghost { background: transparent; color: var(--cc-primary); border: 2px solid var(--cc-primary); }

/* ---- Gate hint on locked "next" ---- */
.cc-gatehint { margin: 10px 0 0; font-size: 0.8rem; color: var(--cc-muted); text-align: right; }

/* ---- Completion screen ---- */
.cc-completion { text-align: center; padding-top: 30px; position: relative; }
.cc-completion .cc-trophy { font-size: 64px; display: inline-block; animation: cc-trophy-in 900ms cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes cc-trophy-in { 0% { opacity: 0; transform: scale(0.3) rotate(-18deg); } 60% { opacity: 1; transform: scale(1.14) rotate(6deg); } 100% { transform: scale(1) rotate(0); } }
.cc-confetti { position: fixed; inset: 0; pointer-events: none; z-index: 80; overflow: hidden; }
.cc-confetti i {
  position: absolute; top: -14px; width: 9px; height: 15px; border-radius: 2px;
  animation: cc-fall linear forwards;
}
@keyframes cc-fall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(105vh) rotate(720deg); opacity: 0.9; }
}
.cc-stat { animation: cc-stat-in 460ms cubic-bezier(0.16,1,0.3,1) both; }
.cc-stat:nth-child(2) { animation-delay: 90ms; }
.cc-stat:nth-child(3) { animation-delay: 180ms; }
@keyframes cc-stat-in { from { opacity: 0; transform: translateY(14px) scale(0.96); } to { opacity: 1; transform: none; } }
.cc-badge { animation: cc-badge-in 520ms cubic-bezier(0.34,1.56,0.64,1) both; }
.cc-badge:nth-child(2) { animation-delay: 110ms; }
.cc-badge:nth-child(3) { animation-delay: 220ms; }
.cc-badge:nth-child(n+4) { animation-delay: 320ms; }
@keyframes cc-badge-in { from { opacity: 0; transform: scale(0.5) translateY(10px); } to { opacity: 1; transform: none; } }
.cc-completion h1 { font-size: 1.8rem; margin: 10px 0 6px; }
.cc-completion p { color: var(--cc-muted); }
.cc-stats { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin: 26px 0; }
.cc-stat { background: var(--cc-surface); border-radius: 14px; padding: 16px 22px; min-width: 120px; box-shadow: 0 1px 4px rgba(15,40,50,0.08); }
.cc-stat b { display: block; font-size: 1.5rem; color: var(--cc-primary); }
.cc-stat span { font-size: 0.75rem; color: var(--cc-muted); text-transform: uppercase; letter-spacing: 0.06em; }
.cc-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin: 8px 0 26px; }
.cc-badge { background: var(--cc-surface); border-radius: 12px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(15,40,50,0.08); display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 92px; }
.cc-badge .cc-badge-icon { font-size: 30px; }
.cc-badge .cc-badge-label { font-size: 0.72rem; font-weight: 700; color: var(--cc-muted); }

/* ---- Toasts ---- */
.cc-toasts { position: fixed; right: 14px; bottom: 14px; z-index: 90; display: flex; flex-direction: column; gap: 8px; max-width: min(320px, 90vw); }
.cc-toast { background: var(--cc-primary-dark); color: #fff; border-radius: 10px; padding: 12px 16px; font-size: 0.85rem; box-shadow: 0 6px 20px rgba(0,0,0,0.25); animation: cc-toast-in 260ms ease; display: flex; align-items: center; gap: 10px; }
.cc-toast .cc-toast-icon { font-size: 20px; }
@keyframes cc-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* ==========================================================================
   BLOCK STYLES — each rule set is scoped to its own block instance.
   ========================================================================== */
${allCss.join('\n\n')}
</style>
</head>
<body>
<script>
/* Marks the document as script-enabled before first paint, so progressive
   enhancements (block reveal animation) never hide content when they can't run. */
document.documentElement.className += ' cc-js';
/* Failsafe: if the course runtime does not report a successful boot, drop the
   reveal animation entirely so the learner always sees the content. */
window.__ccBooted = false;
setTimeout(function () {
  if (window.__ccBooted) { return; }
  document.documentElement.className = document.documentElement.className.replace(' cc-js', '');
}, 3000);
</script>
<div class="cc-app">
  <header class="cc-header">
    <button type="button" class="cc-menu-btn" id="cc-menu" aria-label="Open lesson menu">&#9776;</button>
    <div class="cc-header-title">
      <h2>${esc(course.meta.title)}</h2>
      ${course.meta.organization ? `<p>${esc(course.meta.organization)}</p>` : ''}
    </div>
    <div class="cc-hud">
      <span class="cc-level" id="cc-level" hidden></span>
      <div class="cc-xpwrap" id="cc-xpwrap" hidden>
        <div class="cc-xpbar"><div class="cc-xpfill" id="cc-xpfill"></div></div>
        <div class="cc-xptext" id="cc-xptext"></div>
      </div>
      <span class="cc-progresschip" id="cc-progress">0%</span>
    </div>
  </header>
  <div class="cc-body">
    <nav class="cc-sidebar" id="cc-sidebar" aria-label="Lessons">
      <h3>Lessons</h3>
      <ol>
${navItems}
      </ol>
      <div class="cc-sidebar-foot">Built with ClypCompiler &middot; Clyp blocks by Benedict de Jesus</div>
    </nav>
    <div class="cc-overlay" id="cc-overlay"></div>
    <main class="cc-main" id="cc-main">
${lessonSections.join('\n')}
      <section class="cc-completion" data-cc-completion hidden>
        <div class="cc-trophy">&#127942;</div>
        <h1>Course complete!</h1>
        <p>You finished <b>${esc(course.meta.title)}</b>. Well done.</p>
        <div class="cc-stats" id="cc-final-stats"></div>
        <div class="cc-badges" id="cc-final-badges"></div>
        <button type="button" class="cc-btn cc-btn-ghost" id="cc-review">Review the course</button>
      </section>
    </main>
  </div>
</div>
<div class="cc-toasts" id="cc-toasts" aria-live="polite"></div>

<script>
/* ==========================================================================
   COURSE PLAYER RUNTIME — generated by ClypCompiler.
   Tracks block completion, computes XP/levels/badges, enforces gatekeeping,
   and persists progress to localStorage and (when hosted in an LMS) SCORM 1.2.
   Runs fully standalone when no LMS is present.
   ========================================================================== */
window.__CC_CONFIG = ${JSON.stringify(config)};
(function () {
  'use strict';
  var cfg = window.__CC_CONFIG;
  var totalBlocks = cfg.blocks.length;
  var totalLessons = cfg.lessons.length;

  /* ---------------- SCORM 1.2 adapter (optional) ---------------- */
  var scorm = { api: null, active: false };
  function findAPI(win) {
    var tries = 0;
    while (win && tries < 12) {
      if (win.API) { return win.API; }
      if (win.parent && win.parent !== win) { win = win.parent; tries++; continue; }
      break;
    }
    try { if (window.opener && window.opener.API) { return window.opener.API; } } catch (e) {}
    return null;
  }
  function scormInit() {
    try {
      scorm.api = findAPI(window);
      if (!scorm.api) { return; }
      scorm.api.LMSInitialize('');
      scorm.active = true;
      var status = scorm.api.LMSGetValue('cmi.core.lesson_status');
      if (status === 'not attempted' || status === '') {
        scorm.api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
      }
    } catch (e) { scorm.active = false; }
  }
  function scormGet(key) {
    if (!scorm.active) { return ''; }
    try { return String(scorm.api.LMSGetValue(key) || ''); } catch (e) { return ''; }
  }
  function scormSet(key, value) {
    if (!scorm.active) { return; }
    try { scorm.api.LMSSetValue(key, String(value)); } catch (e) {}
  }
  function scormCommit() {
    if (!scorm.active) { return; }
    try { scorm.api.LMSCommit(''); } catch (e) {}
  }
  function scormFinish() {
    if (!scorm.active) { return; }
    try { scorm.api.LMSFinish(''); scorm.active = false; } catch (e) {}
  }

  /* ---------------- state ---------------- */
  var completed = {};          /* block index -> true */
  var lessonDone = {};         /* lesson index -> true */
  var earnedBadges = [];       /* badge descriptors, in earn order */
  var earnedBadgeIds = {};
  var xp = 0;
  var current = 0;             /* current lesson index */
  var courseComplete = false;
  var storageKey = 'cc-progress-' + cfg.uuid;

  function lessonBlockIdxs(li) {
    var out = [];
    for (var i = 0; i < cfg.blocks.length; i++) {
      if (cfg.blocks[i].lessonIndex === li) { out.push(i); }
    }
    return out;
  }
  function isLessonComplete(li) {
    var idxs = lessonBlockIdxs(li);
    for (var i = 0; i < idxs.length; i++) {
      if (!completed[idxs[i]]) { return false; }
    }
    return true;
  }
  function isCourseComplete() {
    for (var li = 0; li < totalLessons; li++) {
      if (!isLessonComplete(li)) { return false; }
    }
    return true;
  }
  function completedCount() {
    var n = 0;
    for (var i = 0; i < totalBlocks; i++) { if (completed[i]) { n++; } }
    return n;
  }
  function lessonUnlocked(li) {
    if (!cfg.gatekeeping.linear || li === 0) { return true; }
    return isLessonComplete(li - 1);
  }

  /* ---------------- persistence ---------------- */
  function saveState() {
    var cb = [];
    for (var i = 0; i < totalBlocks; i++) { if (completed[i]) { cb.push(i); } }
    var data = JSON.stringify({ v: 1, cb: cb, cur: current });
    try { localStorage.setItem(storageKey, data); } catch (e) {}
    if (scorm.active) {
      scormSet('cmi.suspend_data', data);
      scormSet('cmi.core.lesson_location', String(current));
      var pct = totalBlocks ? Math.round((cb.length / totalBlocks) * 100) : 0;
      scormSet('cmi.core.score.min', '0');
      scormSet('cmi.core.score.max', '100');
      scormSet('cmi.core.score.raw', String(pct));
      scormSet('cmi.core.lesson_status', courseComplete ? 'completed' : 'incomplete');
      scormCommit();
    }
  }
  function loadState() {
    var raw = '';
    if (scorm.active) { raw = scormGet('cmi.suspend_data'); }
    if (!raw) {
      try { raw = localStorage.getItem(storageKey) || ''; } catch (e) {}
    }
    if (!raw) { return; }
    try {
      var data = JSON.parse(raw);
      if (data && data.cb) {
        for (var i = 0; i < data.cb.length; i++) { completed[data.cb[i]] = true; }
      }
      if (data && typeof data.cur === 'number' && data.cur >= 0 && data.cur < totalLessons) {
        current = data.cur;
      }
    } catch (e) {}
  }

  /* ---------------- gamification ---------------- */
  function recomputeProgress(announce) {
    /* XP is always derived from completion state, so it can never drift. */
    var newXp = 0;
    for (var i = 0; i < totalBlocks; i++) {
      if (completed[i]) { newXp += cfg.blocks[i].xp; }
    }
    var doneLessons = 0;
    for (var li = 0; li < totalLessons; li++) {
      if (isLessonComplete(li) && lessonBlockIdxs(li).length > 0) {
        newXp += cfg.gamification.lessonBonus;
        doneLessons++;
        if (!lessonDone[li]) {
          lessonDone[li] = true;
          if (announce) {
            toast('\\u2705', 'Lesson complete: ' + cfg.lessons[li].title +
              (cfg.gamification.enabled ? '  (+' + cfg.gamification.lessonBonus + ' XP)' : ''));
          }
          if (cfg.gamification.enabled && cfg.gamification.showBadges) {
            earnBadge('lesson-' + li, cfg.lessons[li].badgeIcon, cfg.lessons[li].title, announce);
          }
        }
      }
    }
    var wasComplete = courseComplete;
    courseComplete = isCourseComplete() && totalBlocks > 0;
    if (courseComplete && !wasComplete) {
      if (cfg.gamification.enabled && cfg.gamification.showBadges) {
        earnBadge('course', '\\u{1F3C6}', 'Course champion', announce);
      }
      if (announce) { toast('\\u{1F389}', 'Course complete!'); }
    }
    if (cfg.gamification.enabled) {
      var prevLevel = Math.floor((xp > 0 ? xp - 1 : 0) / cfg.gamification.xpPerLevel);
      xp = newXp;
      /* custom badges */
      for (var b = 0; b < cfg.gamification.customBadges.length; b++) {
        var cb = cfg.gamification.customBadges[b];
        var earned = false;
        if (cb.kind === 'course') { earned = courseComplete; }
        else if (cb.kind === 'lesson') { earned = cb.lessonIndex >= 0 && isLessonComplete(cb.lessonIndex); }
        else if (cb.kind === 'xp') { earned = xp >= cb.xpThreshold; }
        if (earned) { earnBadge(cb.id, cb.icon, cb.label, announce); }
      }
    }
    renderHud();
    renderNav();
    renderFooters();
    paintBlockStates();
    saveState();
  }

  function earnBadge(id, icon, label, announce) {
    if (earnedBadgeIds[id]) { return; }
    earnedBadgeIds[id] = true;
    earnedBadges.push({ id: id, icon: icon, label: label });
    if (announce && cfg.gamification.enabled && cfg.gamification.showBadges) {
      toast(icon, 'Badge earned: ' + label);
    }
  }

  function markBlockComplete(idx, announce) {
    if (idx < 0 || idx >= totalBlocks || completed[idx]) { return; }
    completed[idx] = true;
    if (announce && cfg.gamification.enabled) {
      toast('\\u2728', '+' + cfg.blocks[idx].xp + ' XP \\u00B7 ' + cfg.blocks[idx].title);
    }
    recomputeProgress(announce);
  }

  /* ---------------- UI rendering ---------------- */
  function byId(id) { return document.getElementById(id); }
  function toast(icon, text) {
    var host = byId('cc-toasts');
    if (!host) { return; }
    var el = document.createElement('div');
    el.className = 'cc-toast';
    var i = document.createElement('span');
    i.className = 'cc-toast-icon';
    i.textContent = icon;
    var t = document.createElement('span');
    t.textContent = text;
    el.appendChild(i); el.appendChild(t);
    host.appendChild(el);
    window.setTimeout(function () {
      if (el.parentNode) { el.parentNode.removeChild(el); }
    }, 4200);
  }

  function renderHud() {
    var pct = totalBlocks ? Math.round((completedCount() / totalBlocks) * 100) : 0;
    var chip = byId('cc-progress');
    if (chip) { chip.textContent = pct + '%'; }
    var g = cfg.gamification;
    var levelEl = byId('cc-level');
    var xpwrap = byId('cc-xpwrap');
    if (!g.enabled) { return; }
    if (g.showLevel && levelEl) {
      var level = Math.floor(xp / g.xpPerLevel) + 1;
      levelEl.hidden = false;
      levelEl.textContent = 'Lv ' + level;
    }
    if (g.showXpBar && xpwrap) {
      xpwrap.hidden = false;
      var into = xp % g.xpPerLevel;
      byId('cc-xpfill').style.width = Math.round((into / g.xpPerLevel) * 100) + '%';
      byId('cc-xptext').textContent = xp + ' XP';
    }
  }

  function renderNav() {
    for (var li = 0; li < totalLessons; li++) {
      var item = document.querySelector('[data-cc-nav="' + li + '"]');
      var status = document.querySelector('[data-cc-navstatus="' + li + '"]');
      if (!item || !status) { continue; }
      var unlocked = lessonUnlocked(li);
      var done = isLessonComplete(li) && lessonBlockIdxs(li).length > 0;
      item.classList.toggle('is-active', li === current && !courseCompleteShown);
      item.classList.toggle('is-locked', !unlocked);
      status.classList.toggle('is-done', done);
      status.textContent = done ? '\\u2713' : (!unlocked && cfg.gatekeeping.showLocks ? '\\u{1F512}' : String(li + 1));
    }
  }

  function renderFooters() {
    var sections = document.querySelectorAll('.cc-lesson');
    for (var li = 0; li < sections.length; li++) {
      var next = sections[li].querySelector('[data-cc-next]');
      if (!next) { continue; }
      var last = li === totalLessons - 1;
      var gatedOk = !cfg.gatekeeping.linear || isLessonComplete(li);
      if (last) {
        next.disabled = cfg.gatekeeping.completionScreen ? !isCourseComplete() : true;
        if (!cfg.gatekeeping.completionScreen) { next.style.display = 'none'; }
      } else {
        next.disabled = !gatedOk;
      }
      /* Pulse the button once the lesson requirement is met. */
      var ready = !next.disabled && isLessonComplete(li);
      var hasReady = next.className.indexOf('is-ready') !== -1;
      if (ready && !hasReady) { next.className += ' is-ready'; }
      else if (!ready && hasReady) { next.className = next.className.replace(' is-ready', ''); }
      var hint = sections[li].querySelector('.cc-gatehint');
      if (!gatedOk && !hint) {
        hint = document.createElement('p');
        hint.className = 'cc-gatehint';
        hint.textContent = 'Complete every activity above to continue.';
        sections[li].appendChild(hint);
      } else if (gatedOk && hint) {
        hint.parentNode.removeChild(hint);
      }
    }
  }

  var courseCompleteShown = false;
  function showLesson(li) {
    if (li < 0 || li >= totalLessons) { return; }
    if (!lessonUnlocked(li)) {
      toast('\\u{1F512}', 'Finish the previous lesson to unlock this one.');
      return;
    }
    courseCompleteShown = false;
    current = li;
    var sections = document.querySelectorAll('.cc-lesson');
    for (var i = 0; i < sections.length; i++) { sections[i].hidden = i !== li; }
    var comp = document.querySelector('[data-cc-completion]');
    if (comp) { comp.hidden = true; }
    window.scrollTo(0, 0);
    closeSidebar();
    renderNav();
    renderFooters();
    observeVisibleBlocks();
    saveState();
  }

  function showCompletion() {
    if (!cfg.gatekeeping.completionScreen) { return; }
    courseCompleteShown = true;
    var sections = document.querySelectorAll('.cc-lesson');
    for (var i = 0; i < sections.length; i++) { sections[i].hidden = true; }
    var comp = document.querySelector('[data-cc-completion]');
    if (!comp) { return; }
    comp.hidden = false;
    var stats = byId('cc-final-stats');
    stats.innerHTML = '';
    function stat(value, label) {
      var d = document.createElement('div');
      d.className = 'cc-stat';
      var b = document.createElement('b'); b.textContent = value;
      var s = document.createElement('span'); s.textContent = label;
      d.appendChild(b); d.appendChild(s); stats.appendChild(d);
    }
    stat(String(completedCount()), 'blocks completed');
    stat(String(totalLessons), 'lessons');
    if (cfg.gamification.enabled) { stat(xp + ' XP', 'experience'); }
    var shelf = byId('cc-final-badges');
    shelf.innerHTML = '';
    if (cfg.gamification.enabled && cfg.gamification.showBadges) {
      for (var i = 0; i < earnedBadges.length; i++) {
        var badge = document.createElement('div');
        badge.className = 'cc-badge';
        var icon = document.createElement('span'); icon.className = 'cc-badge-icon'; icon.textContent = earnedBadges[i].icon;
        var label = document.createElement('span'); label.className = 'cc-badge-label'; label.textContent = earnedBadges[i].label;
        badge.appendChild(icon); badge.appendChild(label);
        shelf.appendChild(badge);
      }
    }
    window.scrollTo(0, 0);
    confetti();
    if (scorm.active) {
      scormSet('cmi.core.lesson_status', 'completed');
      scormCommit();
    }
    renderNav();
  }

  /* ---------------- sidebar ---------------- */
  function closeSidebar() {
    byId('cc-sidebar').classList.remove('is-open');
    byId('cc-overlay').classList.remove('is-open');
  }
  byId('cc-menu').addEventListener('click', function () {
    byId('cc-sidebar').classList.toggle('is-open');
    byId('cc-overlay').classList.toggle('is-open');
  });
  byId('cc-overlay').addEventListener('click', closeSidebar);

  /* ---------------- completion detection ---------------- */
  /* Gated blocks announce themselves via the gate engine's DOM event. */
  document.addEventListener('clyp:block-complete', function (e) {
    try {
      var gateEl = document.getElementById(e.detail.gateId);
      if (!gateEl) { return; }
      var wrap = gateEl.closest('[data-cc-block]');
      if (!wrap) { return; }
      markBlockComplete(parseInt(wrap.getAttribute('data-cc-block'), 10), true);
    } catch (err) {}
  });

  /* Non-gated (static/reading) blocks complete once mostly scrolled into view.
     In "viewed" completion mode, gated blocks also complete on view.
     Visibility is measured directly from bounding rects on scroll — it needs
     no IntersectionObserver, so it behaves identically in every browser,
     LMS iframe and embedded webview. */
  function blockNeedsViewTracking(wrap) {
    var idx = parseInt(wrap.getAttribute('data-cc-block'), 10);
    if (completed[idx]) { return false; }
    var gated = wrap.getAttribute('data-cc-gated') === '1';
    return !gated || cfg.gatekeeping.lessonCompletion === 'viewed';
  }
  function checkViewedBlocks() {
    var viewport = window.innerHeight || document.documentElement.clientHeight || 800;
    var wraps = document.querySelectorAll('.cc-lesson:not([hidden]) [data-cc-block]');
    for (var i = 0; i < wraps.length; i++) {
      var wrap = wraps[i];
      var r = wrap.getBoundingClientRect();
      if (r.height === 0) { continue; }
      /* Reveal animation: any block with its top edge inside the viewport. */
      if (r.top < viewport * 0.94 && r.bottom > 0) {
        if (wrap.className.indexOf('is-revealed') === -1) { wrap.className += ' is-revealed'; }
      }
      if (!blockNeedsViewTracking(wrap)) { continue; }
      var visibleH = Math.min(r.bottom, viewport) - Math.max(r.top, 0);
      /* Viewed = most of the block is on screen, or (for blocks taller than
         the viewport) the block fills most of the screen. */
      if (visibleH >= r.height * 0.6 || visibleH >= viewport * 0.55) {
        markBlockComplete(parseInt(wrap.getAttribute('data-cc-block'), 10), true);
      }
    }
  }

  /** Marks completed blocks with an accent edge. */
  function paintBlockStates() {
    var wraps = document.querySelectorAll('[data-cc-block]');
    for (var i = 0; i < wraps.length; i++) {
      var idx = parseInt(wraps[i].getAttribute('data-cc-block'), 10);
      var has = wraps[i].className.indexOf('is-done') !== -1;
      if (completed[idx] && !has) { wraps[i].className += ' is-done'; }
    }
  }

  /** Celebratory confetti burst — decorative, skipped when motion is reduced. */
  function confetti() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
      var host = document.createElement('div');
      host.className = 'cc-confetti';
      var colors = ['#00c18e', '#ffd166', '#4f6df5', '#ef6f6c', '#7ce8c8', '#ffffff'];
      for (var i = 0; i < 70; i++) {
        var p = document.createElement('i');
        p.style.left = Math.random() * 100 + 'vw';
        p.style.background = colors[i % colors.length];
        p.style.animationDuration = (2.4 + Math.random() * 1.9) + 's';
        p.style.animationDelay = (Math.random() * 0.5) + 's';
        p.style.opacity = String(0.7 + Math.random() * 0.3);
        host.appendChild(p);
      }
      document.body.appendChild(host);
      window.setTimeout(function () {
        if (host.parentNode) { host.parentNode.removeChild(host); }
      }, 5200);
    } catch (e) { /* never let decoration break the course */ }
  }
  var viewCheckQueued = false;
  function queueViewCheck() {
    /* Check right away (cheap: a handful of rects), and once more shortly
       after, so both the start and the end of a scroll are covered. */
    checkViewedBlocks();
    if (viewCheckQueued) { return; }
    viewCheckQueued = true;
    window.setTimeout(function () {
      viewCheckQueued = false;
      checkViewedBlocks();
    }, 250);
  }
  window.addEventListener('scroll', queueViewCheck, { passive: true });
  window.addEventListener('resize', queueViewCheck);
  /* Safety net: also poll gently, so short lessons that fit fully on screen
     (no scrolling at all) still register as read. */
  window.setInterval(checkViewedBlocks, 1200);
  function observeVisibleBlocks() {
    /* Reveal the blocks already on screen straight away, then let the scroll
       handler take over for the rest. */
    window.setTimeout(checkViewedBlocks, 60);
    window.setTimeout(checkViewedBlocks, 400);
  }

  /* ---------------- navigation buttons ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!(t instanceof Element)) { return; }
    var nav = t.closest('[data-cc-nav]');
    if (nav) { showLesson(parseInt(nav.getAttribute('data-cc-nav'), 10)); return; }
    if (t.closest('[data-cc-prev]')) { showLesson(current - 1); return; }
    if (t.closest('[data-cc-next]')) {
      if (current === totalLessons - 1) { showCompletion(); }
      else { showLesson(current + 1); }
      return;
    }
    if (t.id === 'cc-review') { showLesson(0); return; }
  });

  /* ---------------- boot ---------------- */
  scormInit();
  loadState();
  recomputeProgress(false);
  showLesson(current);
  window.__ccBooted = true;
  window.addEventListener('beforeunload', function () {
    saveState();
    scormFinish();
  });
})();
</script>

<script>
/* ==========================================================================
   BLOCK RUNTIMES — one namespaced IIFE per block (Clyp Single Runtime
   Namespace standard); an error in one block can never break another.
   ========================================================================== */
${allJs.join('\n\n')}
</script>
</body>
</html>`

  return html
}
