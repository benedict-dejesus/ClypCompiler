// Clyp — Conversation Engine (150–154). A chat-styled branching conversation.
// Reuses the scenario object model (scenes → dialogue → choices → outcomes,
// block-level cast, variables, conditions) but presents a messaging interface
// whose chrome faithfully assimilates the chosen platform: SMS, Messenger,
// Teams, Slack, Support Ticket, Email Thread, Generic (speech balloons) or a
// clean Corporate Chat. Fully self-contained: inline avatars, no external
// media, no file uploads. The thread auto-scrolls as it lengthens.
//
// This is deliberately distinct from the Branching Scenario block: no stage,
// no backgrounds, no character gestures — a Conversation is text/UI-first.
import type { BlockSection, ClypObject, Variable } from './types'
import type { RuntimeIdentity } from './identity'
import { embedJson } from './util'
import { characterSvg } from './assets'
import { characterDisplayName, characterSpecOf } from './cast'
import type { GeneratedParts } from './contentGen'

interface RtMessage { speakerId: string | null; text: string }
interface RtCondition { variableId: string; operator: string; value: unknown }
interface RtChoice {
  id: string
  label: string
  targetSceneId: string
  feedback?: string
  assignments: { variableId: string; operation: string; value: unknown }[]
  conditions: RtCondition[]
  combinator: 'AND' | 'OR'
}
interface RtNode {
  id: string
  name: string
  type: 'start' | 'standard' | 'ending'
  messages: RtMessage[]
  choices: RtChoice[]
  conditions: RtCondition[]
  combinator: 'AND' | 'OR'
  ending?: { title: string; description: string; feedback?: string; allowRestart: boolean }
}
interface RtCast { name: string; avatar: string; initial: string; address: string }
interface RtModel {
  startSceneId: string
  template: string
  variables: Variable[]
  nodes: Record<string, RtNode>
  cast: Record<string, RtCast>
  primaryName: string
  ticketNo: string
  subject: string
}

function emailFor(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') || 'contact'
  return `${slug}@company.com`
}

function buildModel(block: BlockSection, identity: RuntimeIdentity): RtModel {
  const root = block.objects[block.rootId]
  const cast: Record<string, RtCast> = {}
  const registerCast = (c: ClypObject): void => {
    const name = characterDisplayName(block, c.id)
    cast[c.id] = { name, avatar: characterSvg(characterSpecOf(c), 'neutral', 'neutral', 'avatar'), initial: name.charAt(0).toUpperCase(), address: emailFor(name) }
  }
  root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'character').forEach(registerCast)

  const sceneObjs = root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'scene')
  for (const scene of sceneObjs) {
    scene.children.map((id) => block.objects[id]).filter((o) => o?.type === 'character').forEach((c) => {
      if (!cast[c.id]) registerCast(c)
    })
  }

  const nodes: Record<string, RtNode> = {}
  let startSceneId = ''
  for (const scene of sceneObjs) {
    if (scene.settings.sceneType === 'start') startSceneId = scene.id
    const kids = scene.children.map((id) => block.objects[id]).filter(Boolean) as ClypObject[]
    const messages: RtMessage[] = kids
      .filter((k) => k.type === 'dialogue')
      .map((d) => ({ speakerId: d.logic.speakerCharacterId && cast[d.logic.speakerCharacterId] ? d.logic.speakerCharacterId : null, text: d.content.dialogueText ?? '' }))
    const choices: RtChoice[] = kids
      .filter((k) => k.type === 'choice')
      .map((c) => ({
        id: c.id,
        label: c.content.label ?? '',
        targetSceneId: c.logic.targetSceneId ?? '',
        feedback: c.content.feedbackText || undefined,
        assignments: (c.logic.variableAssignments ?? []).map((a) => ({ variableId: a.variableId, operation: a.operation, value: a.value })),
        conditions: (c.logic.conditionGroup?.conditions ?? []).map((x) => ({ variableId: x.variableId, operator: x.operator, value: x.value })),
        combinator: c.logic.conditionGroup?.combinator ?? 'AND'
      }))
    nodes[scene.id] = {
      id: scene.id,
      name: scene.name ?? 'Message',
      type: scene.settings.sceneType ?? 'standard',
      messages,
      choices,
      conditions: (scene.logic.conditionGroup?.conditions ?? []).map((x) => ({ variableId: x.variableId, operator: x.operator, value: x.value })),
      combinator: scene.logic.conditionGroup?.combinator ?? 'AND',
      ending:
        scene.settings.sceneType === 'ending'
          ? {
              title: scene.content.outcomeTitle ?? 'Conversation complete',
              description: scene.content.outcomeDescription ?? '',
              feedback: scene.content.outcomeFeedback || undefined,
              allowRestart: scene.settings.allowRestart !== false
            }
          : undefined
    }
  }
  const firstCast = Object.values(cast)[0]
  const primaryName = firstCast ? firstCast.name : 'Contact'
  const ticketNo = String(1000 + (parseInt(identity.runtimeId, 36) % 8999))
  const startNode = nodes[startSceneId]
  const subject = startNode ? startNode.name : 'Customer enquiry'
  return {
    startSceneId,
    template: root.settings.conversationTemplate ?? 'corporateChat',
    variables: root.logic.variables ?? [],
    nodes,
    cast,
    primaryName,
    ticketNo,
    subject
  }
}

export function generateConversation(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const model = buildModel(block, identity)
  const rootEl = `${identity.elementIdPrefix}conversation`

  const html = `<div class="clyp-cv clyp-cv--${model.template}" id="${rootEl}" role="group" aria-label="Conversation">
  <div class="clyp-cv-frame">
    <div class="clyp-cv-topbar" data-role="topbar"></div>
    <div class="clyp-cv-thread" data-role="thread" tabindex="0" aria-label="Message thread"></div>
    <div class="clyp-cv-compose" data-role="compose"></div>
  </div>
  <div class="clyp-cv-announcer clyp-visually-hidden" data-role="announcer" aria-live="polite"></div>
</div>`

  const js = `
  /* ============================================================
   * CONVERSATION ENGINE  (distinct from Branching Scenario:
   * a messaging UI, not a staged scene). Faithful platform chrome,
   * branching replies, auto-scrolling thread, self-contained.
   * ============================================================ */
  var model = ${embedJson(model)};
  var conv = byId('${rootEl}');
  var topbar = conv.querySelector('[data-role="topbar"]');
  var thread = conv.querySelector('[data-role="thread"]');
  var compose = conv.querySelector('[data-role="compose"]');
  var announcer = conv.querySelector('[data-role="announcer"]');
  var variables = {};
  var clockMin = 613; /* ~10:13 */

  function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function stamp() {
    var m = clockMin; clockMin += 1 + Math.floor(Math.random() * 2);
    var h = Math.floor(m / 60) % 24, mm = m % 60, ap = h < 12 ? 'AM' : 'PM', h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (mm < 10 ? '0' + mm : mm) + ' ' + ap;
  }
  function resetVariables() { variables = {}; model.variables.forEach(function (v) { variables[v.id] = v.initialValue; }); }
  function applyAssignments(list) {
    list.forEach(function (a) {
      var cur = variables[a.variableId];
      if (a.operation === 'set') variables[a.variableId] = a.value;
      else if (a.operation === 'increment') variables[a.variableId] = Number(cur || 0) + Number(a.value || 1);
      else if (a.operation === 'decrement') variables[a.variableId] = Number(cur || 0) - Number(a.value || 1);
      else if (a.operation === 'append') variables[a.variableId] = String(cur || '') + String(a.value || '');
    });
  }
  function evalConditions(list, comb) {
    if (!list || !list.length) return true;
    var checks = list.map(function (c) {
      var v = variables[c.variableId];
      switch (c.operator) {
        case 'equals': return v == c.value;
        case 'notEquals': return v != c.value;
        case 'greaterThan': return Number(v) > Number(c.value);
        case 'greaterThanOrEqual': return Number(v) >= Number(c.value);
        case 'lessThan': return Number(v) < Number(c.value);
        case 'lessThanOrEqual': return Number(v) <= Number(c.value);
        case 'contains': return String(v).indexOf(String(c.value)) !== -1;
        default: return true;
      }
    });
    return comb === 'OR' ? checks.some(function (x){return x;}) : checks.every(function (x){return x;});
  }
  function announce(t) { announcer.textContent = t; }
  function autoscroll() { thread.scrollTop = thread.scrollHeight; }

  /* --- Platform header/top bar --- */
  function buildTopbar() {
    var t = model.template, name = esc(model.primaryName);
    var html = '';
    if (t === 'sms') {
      html = '<button type="button" class="clyp-cv-back" aria-hidden="true">&#8249;</button>'
        + '<div class="clyp-cv-tb-center"><span class="clyp-cv-tb-avatar" data-role="tbav"></span><span class="clyp-cv-tb-name">' + name + '</span></div>'
        + '<span class="clyp-cv-tb-info" aria-hidden="true">&#9432;</span>';
    } else if (t === 'messenger') {
      html = '<button type="button" class="clyp-cv-back" aria-hidden="true">&#8249;</button>'
        + '<span class="clyp-cv-tb-avatar" data-role="tbav"></span>'
        + '<div class="clyp-cv-tb-col"><span class="clyp-cv-tb-name">' + name + '</span><span class="clyp-cv-tb-sub">Active now</span></div>'
        + '<span class="clyp-cv-tb-icons" aria-hidden="true">&#9742; &#9974;</span>';
    } else if (t === 'teams') {
      html = '<span class="clyp-cv-tb-avatar" data-role="tbav"></span>'
        + '<div class="clyp-cv-tb-col"><span class="clyp-cv-tb-name">' + name + '</span><span class="clyp-cv-tb-sub">Chat</span></div>'
        + '<span class="clyp-cv-tb-icons" aria-hidden="true">&#9742; &#9974; &#43;</span>';
    } else if (t === 'slack') {
      html = '<span class="clyp-cv-tb-hash">#</span><span class="clyp-cv-tb-name">' + name.toLowerCase().replace(/\\s+/g,'-') + '</span>'
        + '<span class="clyp-cv-tb-sub">&#9733; | direct message</span>';
    } else if (t === 'supportTicket') {
      html = '<div class="clyp-cv-tb-col"><span class="clyp-cv-tb-name">Ticket #' + esc(model.ticketNo) + '</span><span class="clyp-cv-tb-subject">' + esc(model.subject) + '</span></div>'
        + '<span class="clyp-cv-badge clyp-cv-badge--open">Open</span>'
        + '<span class="clyp-cv-badge clyp-cv-badge--prio">Priority: Normal</span>';
    } else if (t === 'emailThread') {
      html = '<div class="clyp-cv-tb-col"><span class="clyp-cv-tb-subject">' + esc(model.subject) + '</span><span class="clyp-cv-tb-sub">' + name + ' &lt;' + esc((model.cast[Object.keys(model.cast)[0]]||{}).address||'contact@company.com') + '&gt;</span></div>';
    } else if (t === 'generic') {
      html = '';
    } else { /* corporateChat */
      html = '<span class="clyp-cv-tb-avatar" data-role="tbav"></span><div class="clyp-cv-tb-col"><span class="clyp-cv-tb-name">' + name + '</span><span class="clyp-cv-tb-sub">Chat</span></div>';
    }
    topbar.innerHTML = html;
    if (!html) { topbar.style.display = 'none'; }
    var tbav = topbar.querySelector('[data-role="tbav"]');
    if (tbav) {
      var firstId = Object.keys(model.cast)[0];
      if (firstId && model.cast[firstId].avatar) { tbav.innerHTML = model.cast[firstId].avatar; }
      else { tbav.textContent = (model.primaryName || '?').charAt(0); }
    }
  }

  /* --- One transcript entry, structured uniformly; CSS gives each
   *     template its authentic look. --- */
  function clearStatuses() {
    thread.querySelectorAll('.clyp-cv-status').forEach(function (s) { s.textContent = ''; });
  }
  function pushEntry(dir, speakerId, text) {
    var who = dir === 'in' && speakerId ? model.cast[speakerId] : null;
    var name = dir === 'out' ? 'You' : (who ? who.name : 'System');
    var addr = dir === 'out' ? 'you@company.com' : (who ? who.address : 'system@company.com');
    var entry = document.createElement('div');
    entry.className = 'clyp-cv-entry clyp-cv-entry--' + dir;
    if (dir === 'out') entry.setAttribute('data-you', 'true');

    var avatar = document.createElement('span');
    avatar.className = 'clyp-cv-avatar';
    if (dir === 'in' && who && who.avatar) { avatar.innerHTML = who.avatar; }
    else { avatar.textContent = dir === 'out' ? 'Y' : (who ? who.initial : '?'); avatar.classList.add('clyp-cv-avatar--initial'); }

    var col = document.createElement('div'); col.className = 'clyp-cv-col';
    var meta = document.createElement('div'); meta.className = 'clyp-cv-meta';
    var nm = document.createElement('span'); nm.className = 'clyp-cv-name'; nm.textContent = name;
    var ad = document.createElement('span'); ad.className = 'clyp-cv-addr'; ad.textContent = '<' + addr + '>';
    var tm = document.createElement('span'); tm.className = 'clyp-cv-time'; tm.textContent = stamp();
    meta.appendChild(nm); meta.appendChild(ad); meta.appendChild(tm);
    var bubble = document.createElement('div'); bubble.className = 'clyp-cv-bubble';
    var txt = document.createElement('span'); txt.className = 'clyp-cv-text'; txt.textContent = text;
    bubble.appendChild(txt);
    var status = document.createElement('div'); status.className = 'clyp-cv-status';
    col.appendChild(meta); col.appendChild(bubble); col.appendChild(status);
    entry.appendChild(avatar); entry.appendChild(col);
    thread.appendChild(entry);
    if (dir === 'out') { clearStatuses(); status.textContent = model.template === 'messenger' ? 'Seen' : 'Delivered'; }
    autoscroll();
    announce((dir === 'out' ? 'You: ' : name + ': ') + text);
    return entry;
  }

  function renderNode(nodeId, skipMessages) {
    var node = model.nodes[nodeId];
    if (!node) throw new Error('missing node');
    /* On a retry (a reply that loops back to the same step) we do not re-push
     * the incoming messages, so the thread does not duplicate them. */
    if (!skipMessages) node.messages.forEach(function (m) { pushEntry('in', m.speakerId, m.text); });
    compose.innerHTML = '';
    if (node.type === 'ending') {
      var card = document.createElement('div');
      card.className = 'clyp-cv-ending';
      var h = document.createElement('h3'); h.className = 'clyp-cv-ending-title'; h.textContent = node.ending.title; h.setAttribute('tabindex','-1');
      var p = document.createElement('p'); p.textContent = node.ending.description;
      card.appendChild(h); card.appendChild(p);
      if (node.ending.feedback) { var f = document.createElement('p'); f.className = 'clyp-cv-ending-fb'; f.textContent = node.ending.feedback; card.appendChild(f); }
      if (node.ending.allowRestart) {
        var again = document.createElement('button'); again.type = 'button'; again.className = 'clyp-cv-restart'; again.textContent = 'Start over';
        again.addEventListener('click', guard(function () { thread.innerHTML=''; clockMin = 613; resetVariables(); renderNode(model.startSceneId); }));
        card.appendChild(again);
      }
      compose.appendChild(card);
      announce('Conversation ended: ' + node.ending.title);
      setTimeout(function(){ h.focus(); }, 0);
      return;
    }
    var available = node.choices.filter(function (c) {
      var target = model.nodes[c.targetSceneId];
      return evalConditions(c.conditions, c.combinator) && (!target || evalConditions(target.conditions, target.combinator));
    });
    if (!available.length) {
      var none = document.createElement('p'); none.className = 'clyp-cv-hint'; none.textContent = 'This conversation has reached a pause.';
      compose.appendChild(none);
      return;
    }
    var box = document.createElement('div');
    box.className = 'clyp-cv-replybox';
    var lead = document.createElement('span');
    lead.className = 'clyp-cv-replylead';
    lead.textContent = model.template === 'emailThread' ? 'Reply with:' : model.template === 'supportTicket' ? 'Post a reply:' : 'Your reply:';
    box.appendChild(lead);
    available.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'clyp-cv-reply';
      btn.textContent = c.label;
      btn.addEventListener('click', guard(function () {
        pushEntry('out', null, c.label);
        applyAssignments(c.assignments);
        compose.innerHTML = '';
        /* Self-targeting reply = incorrect: the learner stays on this step to
         * rethink; replies are re-presented without repeating the messages. */
        var isSelf = c.targetSceneId === node.id;
        var fbText = c.feedback || (isSelf ? '\\u201cThat isn\\u2019t quite right \\u2014 have another look and try again.\\u201d' : '');
        if (fbText) {
          var fb = document.createElement('div'); fb.className = 'clyp-cv-inlinefb'; fb.textContent = fbText;
          compose.appendChild(fb);
          var next = document.createElement('button'); next.type = 'button'; next.className = 'clyp-cv-reply clyp-cv-continue'; next.textContent = isSelf ? 'Try again' : 'Continue';
          next.addEventListener('click', guard(function () { compose.innerHTML=''; renderNode(c.targetSceneId, isSelf); }));
          compose.appendChild(next);
          next.focus();
        } else if (isSelf) {
          renderNode(c.targetSceneId, true);
        } else {
          renderNode(c.targetSceneId);
        }
      }));
      box.appendChild(btn);
    });
    compose.appendChild(box);
    var first = box.querySelector('.clyp-cv-reply'); if (first) first.focus();
  }

  buildTopbar();
  resetVariables();
  renderNode(model.startSceneId);`

  const css = conversationCss(identity.cssScopeSelector)
  return {
    html,
    css,
    js,
    logicNotes: [
      `A Conversation block using the "${model.template}" template — a messaging interface, not a staged scenario.`,
      `${Object.keys(model.nodes).length} message step(s); the thread auto-scrolls as it grows. Incoming messages come from the cast; the learner replies by choosing an option.`,
      'Variables and conditions carry across the whole conversation for branching.'
    ]
  }
}

function conversationCss(s: string): string {
  return `/* ---- Conversation Engine ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; }
${s} .clyp-visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
${s} .clyp-cv { max-width: 560px; }
${s} .clyp-cv-frame { border: 1px solid #c7d8db; border-radius: 16px; overflow: hidden; background: #fff; display: flex; flex-direction: column; }
${s} .clyp-cv-topbar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #015061; color: #fff; }
${s} .clyp-cv-tb-avatar { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; background: #dceae8; display: inline-flex; align-items: flex-end; justify-content: center; flex: none; color: #013d4a; font-weight: 700; }
${s} .clyp-cv-tb-avatar svg { width: 34px; height: 38px; }
${s} .clyp-cv-tb-avatar img.clyp-art, ${s} .clyp-cv-avatar img.clyp-art { width: 100%; height: 100%; object-fit: cover; display: block; }
/* Photographic avatars fill the circular frame, cropped to the face. */
${s} .clyp-cv-tb-avatar img.clyp-art-photo, ${s} .clyp-cv-avatar img.clyp-art-photo { object-position: 50% 22%; }
${s} .clyp-cv-tb-col { display: flex; flex-direction: column; line-height: 1.25; }
${s} .clyp-cv-tb-name { font-weight: 700; }
${s} .clyp-cv-tb-sub, ${s} .clyp-cv-tb-subject { font-size: 0.78em; opacity: 0.85; }
${s} .clyp-cv-tb-center { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; }
${s} .clyp-cv-back, ${s} .clyp-cv-tb-info, ${s} .clyp-cv-tb-icons { background: none; border: none; color: inherit; font-size: 1.2em; opacity: 0.85; }
${s} .clyp-cv-badge { font-size: 0.72em; font-weight: 700; padding: 2px 8px; border-radius: 999px; margin-left: auto; }
${s} .clyp-cv-badge--open { background: #d5f2e4; color: #08533d; }
${s} .clyp-cv-badge--prio { background: rgba(255,255,255,0.2); }
${s} .clyp-cv-thread { padding: 14px; display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; background: #f4f7f8; scroll-behavior: smooth; }
${s} .clyp-cv-thread:focus-visible { outline: 2px solid #015061; outline-offset: -2px; }
${s} .clyp-cv-entry { display: flex; align-items: flex-end; gap: 8px; max-width: 82%; }
${s} .clyp-cv-entry--in { align-self: flex-start; }
${s} .clyp-cv-entry--out { align-self: flex-end; flex-direction: row-reverse; }
${s} .clyp-cv-avatar { flex: none; width: 30px; height: 30px; border-radius: 50%; overflow: hidden; background: #cfe0e2; display: inline-flex; align-items: flex-end; justify-content: center; font-size: 0.8em; font-weight: 700; color: #013d4a; }
${s} .clyp-cv-avatar svg { width: 30px; height: 34px; }
${s} .clyp-cv-avatar--initial { align-items: center; }
${s} .clyp-cv-col { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
${s} .clyp-cv-entry--out .clyp-cv-col { align-items: flex-end; }
${s} .clyp-cv-meta { display: flex; align-items: baseline; gap: 6px; font-size: 0.72em; color: #5e7d86; }
${s} .clyp-cv-name { font-weight: 700; }
${s} .clyp-cv-addr { display: none; opacity: 0.7; }
${s} .clyp-cv-bubble { padding: 8px 13px; border-radius: 16px; background: #fff; border: 1px solid #e0e9ea; box-shadow: 0 1px 1px rgba(0,44,57,0.05); }
${s} .clyp-cv-entry--out .clyp-cv-bubble { background: #015061; color: #fff; border-color: #015061; }
${s} .clyp-cv-text { white-space: pre-wrap; word-break: break-word; }
${s} .clyp-cv-status { font-size: 0.68em; color: #8aa2aa; min-height: 0; }
${s} .clyp-cv-compose { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-top: 1px solid #dbe6e8; background: #fff; }
${s} .clyp-cv-replybox { display: flex; flex-direction: column; gap: 8px; }
${s} .clyp-cv-replylead { font-size: 0.75em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #8aa2aa; }
${s} .clyp-cv-reply { font: inherit; text-align: left; padding: 11px 15px; border: 1.5px solid #015061; color: #013d4a; background: #eef5f5; border-radius: 20px; cursor: pointer; }
${s} .clyp-cv-reply:hover { background: #015061; color: #fff; }
${s} .clyp-cv-reply:focus-visible { outline: 3px solid #00c18e; outline-offset: 2px; }
${s} .clyp-cv-continue { background: #015061; color: #fff; text-align: center; }
${s} .clyp-cv-inlinefb { background: #e2f6ef; border-left: 4px solid #00916b; color: #08533d; padding: 8px 12px; border-radius: 8px; font-style: italic; }
${s} .clyp-cv-hint { color: #5e7d86; margin: 0; }
${s} .clyp-cv-ending { text-align: center; padding: 6px 4px; }
${s} .clyp-cv-ending-title { margin: 0 0 6px; outline: none; }
${s} .clyp-cv-ending-fb { color: #0e7a8a; font-weight: 600; }
${s} .clyp-cv-restart { font: inherit; margin-top: 8px; padding: 9px 20px; border: none; border-radius: 20px; background: #015061; color: #fff; font-weight: 600; cursor: pointer; }

/* ===================== SMS / iMessage ===================== */
${s} .clyp-cv--sms .clyp-cv-topbar { background: #f7f7f8; color: #111; border-bottom: 1px solid #d9d9de; }
${s} .clyp-cv--sms .clyp-cv-back { color: #007aff; }
${s} .clyp-cv--sms .clyp-cv-tb-avatar { width: 42px; height: 42px; }
${s} .clyp-cv--sms .clyp-cv-tb-center .clyp-cv-tb-name { font-size: 0.82em; }
${s} .clyp-cv--sms .clyp-cv-thread { background: #fff; }
${s} .clyp-cv--sms .clyp-cv-avatar { display: none; }
${s} .clyp-cv--sms .clyp-cv-meta { display: none; }
${s} .clyp-cv--sms .clyp-cv-bubble { position: relative; border: none; border-radius: 18px; background: #e9e9eb; color: #000; box-shadow: none; }
${s} .clyp-cv--sms .clyp-cv-entry--in .clyp-cv-bubble::after { content: ""; position: absolute; left: -6px; bottom: 0; width: 14px; height: 18px; background: #e9e9eb; border-bottom-right-radius: 14px; clip-path: path("M14 18 Q0 18 0 4 Q3 14 14 12 Z"); }
${s} .clyp-cv--sms .clyp-cv-entry--out .clyp-cv-bubble { background: #007aff; color: #fff; }
${s} .clyp-cv--sms .clyp-cv-entry--out .clyp-cv-bubble::after { content: ""; position: absolute; right: -6px; bottom: 0; width: 14px; height: 18px; background: #007aff; border-bottom-left-radius: 14px; clip-path: path("M0 18 Q14 18 14 4 Q11 14 0 12 Z"); }
${s} .clyp-cv--sms .clyp-cv-status { text-align: right; }
${s} .clyp-cv--sms .clyp-cv-reply { border-radius: 18px; border-color: #007aff; color: #007aff; background: #eaf3ff; }
${s} .clyp-cv--sms .clyp-cv-reply:hover, ${s} .clyp-cv--sms .clyp-cv-continue, ${s} .clyp-cv--sms .clyp-cv-restart { background: #007aff; color: #fff; }

/* ===================== Messenger ===================== */
${s} .clyp-cv--messenger .clyp-cv-topbar { background: #fff; color: #111; border-bottom: 1px solid #e4e6eb; }
${s} .clyp-cv--messenger .clyp-cv-back, ${s} .clyp-cv--messenger .clyp-cv-tb-icons { color: #0084ff; }
${s} .clyp-cv--messenger .clyp-cv-tb-sub { color: #65676b; }
${s} .clyp-cv--messenger .clyp-cv-thread { background: #fff; }
${s} .clyp-cv--messenger .clyp-cv-meta { display: none; }
${s} .clyp-cv--messenger .clyp-cv-bubble { border: none; border-radius: 18px; box-shadow: none; background: #f0f0f0; color: #050505; }
${s} .clyp-cv--messenger .clyp-cv-entry--out .clyp-cv-bubble { background: #0084ff; color: #fff; }
${s} .clyp-cv--messenger .clyp-cv-status { text-align: right; color: #0084ff; font-weight: 600; }
${s} .clyp-cv--messenger .clyp-cv-reply { border-radius: 18px; border-color: #0084ff; color: #0064c8; background: #eaf4ff; }
${s} .clyp-cv--messenger .clyp-cv-reply:hover, ${s} .clyp-cv--messenger .clyp-cv-continue, ${s} .clyp-cv--messenger .clyp-cv-restart { background: #0084ff; color: #fff; }

/* ===================== Teams ===================== */
${s} .clyp-cv--teams .clyp-cv-topbar { background: #f5f5fb; color: #252424; border-bottom: 2px solid #5b5fc7; }
${s} .clyp-cv--teams .clyp-cv-tb-icons { color: #5b5fc7; }
${s} .clyp-cv--teams .clyp-cv-thread { background: #fff; gap: 12px; }
${s} .clyp-cv--teams .clyp-cv-entry { max-width: 90%; }
${s} .clyp-cv--teams .clyp-cv-avatar { border-radius: 50%; background: #5b5fc7; color: #fff; }
${s} .clyp-cv--teams .clyp-cv-meta { display: flex; }
${s} .clyp-cv--teams .clyp-cv-name { color: #252424; }
${s} .clyp-cv--teams .clyp-cv-bubble { border-radius: 8px; background: #f5f5f9; border: 1px solid #ebebf3; color: #252424; box-shadow: none; }
${s} .clyp-cv--teams .clyp-cv-entry--out .clyp-cv-bubble { background: #e8ebfa; border-color: #d5d9f5; color: #252424; }
${s} .clyp-cv--teams .clyp-cv-reply { border-radius: 6px; border-color: #5b5fc7; color: #444791; background: #f0f1fb; }
${s} .clyp-cv--teams .clyp-cv-reply:hover, ${s} .clyp-cv--teams .clyp-cv-continue, ${s} .clyp-cv--teams .clyp-cv-restart { background: #5b5fc7; color: #fff; }

/* ===================== Slack (flat list, no bubbles) ===================== */
${s} .clyp-cv--slack .clyp-cv-topbar { background: #fff; color: #1d1c1d; border-bottom: 1px solid #e2e2e2; }
${s} .clyp-cv--slack .clyp-cv-tb-hash { font-size: 1.2em; color: #616061; }
${s} .clyp-cv--slack .clyp-cv-thread { background: #fff; gap: 2px; padding: 8px 0; }
${s} .clyp-cv--slack .clyp-cv-entry, ${s} .clyp-cv--slack .clyp-cv-entry--out { align-self: stretch; max-width: 100%; flex-direction: row; align-items: flex-start; padding: 6px 16px; }
${s} .clyp-cv--slack .clyp-cv-entry:hover { background: #f8f8f8; }
${s} .clyp-cv--slack .clyp-cv-avatar { width: 36px; height: 36px; border-radius: 8px; align-items: center; background: #4a154b; color: #fff; }
${s} .clyp-cv--slack .clyp-cv-avatar svg { width: 36px; height: 40px; border-radius: 8px; }
${s} .clyp-cv--slack .clyp-cv-col { align-items: flex-start !important; }
${s} .clyp-cv--slack .clyp-cv-meta { display: flex; font-size: 0.82em; }
${s} .clyp-cv--slack .clyp-cv-name { color: #1d1c1d; font-weight: 800; }
${s} .clyp-cv--slack .clyp-cv-entry--out .clyp-cv-name { color: #007a5a; }
${s} .clyp-cv--slack .clyp-cv-time { color: #616061; }
${s} .clyp-cv--slack .clyp-cv-bubble { background: none; border: none; padding: 1px 0; color: #1d1c1d; box-shadow: none; border-radius: 0; }
${s} .clyp-cv--slack .clyp-cv-entry--out .clyp-cv-bubble { background: none; color: #1d1c1d; }
${s} .clyp-cv--slack .clyp-cv-status { display: none; }
${s} .clyp-cv--slack .clyp-cv-compose .clyp-cv-replybox { border: 1px solid #b7b7b9; border-radius: 8px; padding: 10px; }
${s} .clyp-cv--slack .clyp-cv-reply { border-radius: 6px; border-color: #007a5a; color: #007a5a; background: #f0f8f5; }
${s} .clyp-cv--slack .clyp-cv-reply:hover, ${s} .clyp-cv--slack .clyp-cv-continue, ${s} .clyp-cv--slack .clyp-cv-restart { background: #007a5a; color: #fff; }

/* ===================== Support Ticket ===================== */
${s} .clyp-cv--supportTicket { max-width: 640px; }
${s} .clyp-cv--supportTicket .clyp-cv-topbar { background: #263849; color: #fff; flex-wrap: wrap; gap: 8px; }
${s} .clyp-cv--supportTicket .clyp-cv-thread { background: #eef2f4; gap: 12px; }
${s} .clyp-cv--supportTicket .clyp-cv-entry, ${s} .clyp-cv--supportTicket .clyp-cv-entry--out { align-self: stretch; max-width: 100%; flex-direction: row; align-items: flex-start; }
${s} .clyp-cv--supportTicket .clyp-cv-avatar { border-radius: 6px; }
${s} .clyp-cv--supportTicket .clyp-cv-col { align-items: stretch !important; flex: 1; }
${s} .clyp-cv--supportTicket .clyp-cv-meta { display: flex; }
${s} .clyp-cv--supportTicket .clyp-cv-name::after { content: ""; }
${s} .clyp-cv--supportTicket .clyp-cv-entry--in .clyp-cv-name::before { content: "Customer · "; color: #0e7a8a; font-weight: 700; }
${s} .clyp-cv--supportTicket .clyp-cv-entry--out .clyp-cv-name::before { content: "Agent (You) · "; color: #b4632c; font-weight: 700; }
${s} .clyp-cv--supportTicket .clyp-cv-bubble { border-radius: 8px; background: #fff; border: 1px solid #d5e0e3; color: #002c39; width: 100%; box-shadow: 0 1px 2px rgba(0,44,57,0.06); }
${s} .clyp-cv--supportTicket .clyp-cv-entry--out .clyp-cv-bubble { background: #fbf5ee; border-color: #ecdcc9; color: #002c39; }
${s} .clyp-cv--supportTicket .clyp-cv-compose .clyp-cv-replybox { border: 1px solid #cdd8db; border-radius: 8px; padding: 10px; background: #f8fafb; }
${s} .clyp-cv--supportTicket .clyp-cv-reply { border-radius: 6px; }

/* ===================== Email Thread ===================== */
${s} .clyp-cv--emailThread { max-width: 660px; }
${s} .clyp-cv--emailThread .clyp-cv-topbar { background: #fff; color: #202124; border-bottom: 1px solid #e0e0e0; }
${s} .clyp-cv--emailThread .clyp-cv-tb-subject { font-size: 1.15em; font-weight: 700; }
${s} .clyp-cv--emailThread .clyp-cv-thread { background: #fff; gap: 0; padding: 0; }
${s} .clyp-cv--emailThread .clyp-cv-entry, ${s} .clyp-cv--emailThread .clyp-cv-entry--out { align-self: stretch; max-width: 100%; flex-direction: row; align-items: flex-start; padding: 14px 16px; border-bottom: 1px solid #eee; }
${s} .clyp-cv--emailThread .clyp-cv-col { align-items: stretch !important; flex: 1; }
${s} .clyp-cv--emailThread .clyp-cv-meta { display: flex; flex-wrap: wrap; font-size: 0.82em; margin-bottom: 4px; }
${s} .clyp-cv--emailThread .clyp-cv-name { color: #202124; }
${s} .clyp-cv--emailThread .clyp-cv-addr { display: inline; }
${s} .clyp-cv--emailThread .clyp-cv-time { margin-left: auto; }
${s} .clyp-cv--emailThread .clyp-cv-bubble { background: none; border: none; padding: 0; color: #202124; box-shadow: none; border-radius: 0; }
${s} .clyp-cv--emailThread .clyp-cv-status { display: none; }
${s} .clyp-cv--emailThread .clyp-cv-avatar { border-radius: 50%; }
${s} .clyp-cv--emailThread .clyp-cv-reply { border-radius: 4px; }

/* ===================== Generic (speech balloons) ===================== */
${s} .clyp-cv--generic .clyp-cv-frame { border: none; background: none; }
${s} .clyp-cv--generic .clyp-cv-topbar { display: none; }
${s} .clyp-cv--generic .clyp-cv-thread { background: #f4f7f8; border-radius: 12px; }
${s} .clyp-cv--generic .clyp-cv-meta { display: flex; }
${s} .clyp-cv--generic .clyp-cv-addr, ${s} .clyp-cv--generic .clyp-cv-time { display: none; }
${s} .clyp-cv--generic .clyp-cv-bubble { position: relative; border: 2px solid #015061; border-radius: 18px; background: #fff; color: #002c39; box-shadow: none; }
${s} .clyp-cv--generic .clyp-cv-entry--in .clyp-cv-bubble::before { content: ""; position: absolute; left: -13px; bottom: 8px; width: 0; height: 0; border: 8px solid transparent; border-right-color: #015061; }
${s} .clyp-cv--generic .clyp-cv-entry--in .clyp-cv-bubble::after { content: ""; position: absolute; left: -9px; bottom: 10px; width: 0; height: 0; border: 6px solid transparent; border-right-color: #fff; }
${s} .clyp-cv--generic .clyp-cv-entry--out .clyp-cv-bubble { background: #eaf3f4; border-color: #0e7a8a; }
${s} .clyp-cv--generic .clyp-cv-entry--out .clyp-cv-bubble::before { content: ""; position: absolute; right: -13px; bottom: 8px; width: 0; height: 0; border: 8px solid transparent; border-left-color: #0e7a8a; }
${s} .clyp-cv--generic .clyp-cv-entry--out .clyp-cv-bubble::after { content: ""; position: absolute; right: -9px; bottom: 10px; width: 0; height: 0; border: 6px solid transparent; border-left-color: #eaf3f4; }
${s} .clyp-cv--generic .clyp-cv-status { display: none; }
${s} .clyp-cv--generic .clyp-cv-compose { border-top: none; background: none; }

@media (min-width: 640px) { ${s} .clyp-cv-thread { max-height: 460px; } }`
}
