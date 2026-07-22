// Clyp — Scenario Engine compiler plugin (100–108).
// Universal Structure: Scenario → Scenes → Dialogue → Choices → Outcomes.
// Characters, expressions, gestures and backgrounds are embedded inline SVG
// (74_RISE_COMPATIBILITY: no external assets). Variables persist across scene
// transitions; conditions gate choice availability.
import type { BlockSection, ClypObject, Variable } from './types'
import type { RuntimeIdentity } from './identity'
import { embedJson } from './util'
import { backgroundSvg, characterSvg, specKey, type CharacterSpec } from './assets'
import { characterDisplayName, characterSpecOf } from './cast'
import type { GeneratedParts } from './contentGen'

interface RtDialogue { speakerId: string | null; text: string; expression: string; gesture: string }
interface RtChoiceCondition { variableId: string; operator: string; value: unknown }
interface RtChoice {
  id: string
  label: string
  targetSceneId: string
  feedback?: string
  assignments: { variableId: string; operation: string; value: unknown }[]
  conditions: RtChoiceCondition[]
  combinator: 'AND' | 'OR'
}
interface RtScene {
  id: string
  name: string
  type: 'start' | 'standard' | 'ending'
  backgroundKey: string
  characters: { id: string; name: string; base: string }[]
  dialogue: RtDialogue[]
  conditions: RtChoiceCondition[]
  combinator: 'AND' | 'OR'
  choices: RtChoice[]
  ending?: { title: string; description: string; feedback?: string; summary?: string; allowRestart: boolean }
}
interface RtScenarioModel {
  startSceneId: string
  variables: Variable[]
  scenes: Record<string, RtScene>
  backgrounds: Record<string, string>
  characterArt: Record<string, string> // "base|expression|gesture" -> svg
}

function buildModel(block: BlockSection): RtScenarioModel {
  const root = block.objects[block.rootId]
  const sceneObjs = root.children.map((id) => block.objects[id]).filter((o) => o?.type === 'scene')
  const scenes: Record<string, RtScene> = {}
  const backgrounds: Record<string, string> = {}
  const characterArt: Record<string, string> = {}

  const specs = new Map<string, CharacterSpec>()
  const artKey = (spec: CharacterSpec, expression: string, gesture: string): string => {
    const key = `${specKey(spec)}|${expression}|${gesture}`
    if (!characterArt[key]) characterArt[key] = characterSvg(spec, expression, gesture)
    return key
  }

  // The cast is declared once at block level and shared by all scenes.
  // Legacy scene-level characters (older .clyp files) remain valid speakers.
  const castById = new Map<string, { id: string; name: string; base: string }>()
  const registerCharacter = (c: ClypObject): void => {
    const spec = characterSpecOf(c)
    specs.set(c.id, spec)
    artKey(spec, 'neutral', 'neutral')
    castById.set(c.id, { id: c.id, name: characterDisplayName(block, c.id), base: specKey(spec) })
  }
  root.children
    .map((id) => block.objects[id])
    .filter((o) => o?.type === 'character')
    .forEach(registerCharacter)
  for (const scene of sceneObjs) {
    scene.children
      .map((id) => block.objects[id])
      .filter((o) => o?.type === 'character')
      .forEach(registerCharacter)
  }

  let startSceneId = ''
  for (const scene of sceneObjs) {
    if (scene.settings.sceneType === 'start') startSceneId = scene.id
    const kids = scene.children.map((id) => block.objects[id]).filter(Boolean) as ClypObject[]
    const dialogue = kids
      .filter((k) => k.type === 'dialogue')
      .map((d) => {
        const speaker = d.logic.speakerCharacterId ? castById.get(d.logic.speakerCharacterId) : undefined
        const expression = d.settings.expression ?? 'neutral'
        const gesture = d.settings.gesture ?? 'neutral'
        if (speaker) artKey(specs.get(speaker.id)!, expression, gesture)
        return { speakerId: speaker?.id ?? null, text: d.content.dialogueText ?? '', expression, gesture }
      })
    // A character appears in a scene when they speak in it — no per-scene
    // bookkeeping required from the author.
    const characters: { id: string; name: string; base: string }[] = []
    for (const d of dialogue) {
      if (d.speakerId && !characters.some((c) => c.id === d.speakerId)) {
        characters.push(castById.get(d.speakerId)!)
      }
    }
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
    const bgKey = scene.settings.backgroundId ?? 'neutral'
    backgrounds[bgKey] = backgroundSvg(bgKey)
    scenes[scene.id] = {
      id: scene.id,
      name: scene.name ?? 'Scene',
      type: scene.settings.sceneType ?? 'standard',
      backgroundKey: bgKey,
      characters,
      dialogue,
      conditions: (scene.logic.conditionGroup?.conditions ?? []).map((x) => ({ variableId: x.variableId, operator: x.operator, value: x.value })),
      combinator: scene.logic.conditionGroup?.combinator ?? 'AND',
      choices,
      ending:
        scene.settings.sceneType === 'ending'
          ? {
              title: scene.content.outcomeTitle ?? 'The End',
              description: scene.content.outcomeDescription ?? '',
              feedback: scene.content.outcomeFeedback || undefined,
              summary: scene.content.outcomeSummary || undefined,
              allowRestart: scene.settings.allowRestart !== false
            }
          : undefined
    }
  }
  return { startSceneId, variables: root.logic.variables ?? [], scenes, backgrounds, characterArt }
}

export function generateScenario(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const model = buildModel(block)
  const rootEl = `${identity.elementIdPrefix}scenario`
  const sceneCount = Object.keys(model.scenes).length
  const endingCount = Object.values(model.scenes).filter((s) => s.type === 'ending').length

  const html = `<div class="clyp-scenario" id="${rootEl}" role="group" aria-label="Branching scenario">
  <div class="clyp-sc-stage" data-role="stage">
    <noscript><p>This scenario requires JavaScript to run.</p></noscript>
  </div>
  <div class="clyp-sc-announcer clyp-visually-hidden" data-role="announcer" aria-live="polite"></div>
</div>`

  const logicNotes = [
    `This scenario has ${sceneCount} scene(s) and ${endingCount} possible ending(s).`,
    model.variables.length > 0
      ? `Variables tracked across scenes: ${model.variables.map((v) => v.name).join(', ')}.`
      : 'No variables are used — every branch depends only on the choices clicked.',
    'Choices navigate directly between scenes; conditions can hide choices until the scenario state satisfies them.'
  ]

  const js = `
  /* ============================================================
   * SCENARIO ENGINE
   * Universal structure: Scenario -> Scenes -> Dialogue -> Choices -> Outcomes.
   * Variables persist across scene transitions for the whole playthrough.
   * All artwork is embedded SVG — nothing external is loaded.
   * ============================================================ */
  var model = ${embedJson(model)};
  var stage = root.querySelector('[data-role="stage"]');
  var announcer = root.querySelector('[data-role="announcer"]');
  var variables = {};

  function resetVariables() {
    variables = {};
    model.variables.forEach(function (v) { variables[v.id] = v.initialValue; });
  }

  /* Applies a choice's variable assignments (set / increment / decrement / append). */
  function applyAssignments(assignments) {
    assignments.forEach(function (a) {
      var current = variables[a.variableId];
      if (a.operation === 'set') variables[a.variableId] = a.value;
      if (a.operation === 'increment') variables[a.variableId] = Number(current || 0) + Number(a.value || 1);
      if (a.operation === 'decrement') variables[a.variableId] = Number(current || 0) - Number(a.value || 1);
      if (a.operation === 'append') variables[a.variableId] = String(current || '') + String(a.value || '');
    });
  }

  /* Evaluates a condition group against the current variable state. */
  function evaluateConditions(conditions, combinator) {
    if (!conditions || conditions.length === 0) return true;
    var checks = conditions.map(function (c) {
      var v = variables[c.variableId];
      switch (c.operator) {
        case 'equals': return v == c.value; /* loose: authors compare across types */
        case 'notEquals': return v != c.value;
        case 'greaterThan': return Number(v) > Number(c.value);
        case 'greaterThanOrEqual': return Number(v) >= Number(c.value);
        case 'lessThan': return Number(v) < Number(c.value);
        case 'lessThanOrEqual': return Number(v) <= Number(c.value);
        case 'contains': return String(v).indexOf(String(c.value)) !== -1;
        default: return true;
      }
    });
    return combinator === 'OR'
      ? checks.some(function (x) { return x; })
      : checks.every(function (x) { return x; });
  }

  function artFor(base, expression, gesture) {
    return model.characterArt[base + '|' + expression + '|' + gesture]
      || model.characterArt[base + '|neutral|neutral']
      || '';
  }

  function renderScene(sceneId) {
    var scene = model.scenes[sceneId];
    if (!scene) { throw new Error('Missing scene: ' + sceneId); }
    stage.innerHTML = '';
    announce('Scene: ' + scene.name);

    var view = document.createElement('div');
    view.className = 'clyp-sc-scene';

    /* Background layer (embedded SVG) */
    var bg = document.createElement('div');
    bg.className = 'clyp-sc-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = model.backgrounds[scene.backgroundKey] || '';
    view.appendChild(bg);

    if (scene.type === 'ending') {
      renderEnding(view, scene);
      stage.appendChild(view);
      return;
    }

    /* Character layer */
    var cast = document.createElement('div');
    cast.className = 'clyp-sc-cast';
    scene.characters.forEach(function (c) {
      var fig = document.createElement('figure');
      fig.className = 'clyp-sc-character';
      fig.setAttribute('data-character', c.id);
      fig.innerHTML = artFor(c.base, 'neutral', 'neutral') + '<figcaption>' + c.name.replace(/[<>&]/g, '') + '</figcaption>';
      cast.appendChild(fig);
    });
    view.appendChild(cast);

    /* Dialogue layer — lines advance one at a time; the active speaker's
     * expression and gesture update with each line (102_DIALOGUE_MODEL). */
    var panel = document.createElement('div');
    panel.className = 'clyp-sc-panel';
    var speakerName = document.createElement('p');
    speakerName.className = 'clyp-sc-speaker';
    var line = document.createElement('p');
    line.className = 'clyp-sc-line';
    var controls = document.createElement('div');
    controls.className = 'clyp-sc-controls';
    panel.appendChild(speakerName);
    panel.appendChild(line);
    panel.appendChild(controls);
    view.appendChild(panel);
    stage.appendChild(view);

    var lineIndex = -1;
    function showChoices() {
      speakerName.textContent = '';
      line.textContent = scene.choices.length ? 'What do you do?' : '';
      controls.innerHTML = '';
      var available = scene.choices.filter(function (c) {
        var target = model.scenes[c.targetSceneId];
        var choiceOk = evaluateConditions(c.conditions, c.combinator);
        var sceneOk = !target || evaluateConditions(target.conditions, target.combinator);
        return choiceOk && sceneOk;
      });
      if (available.length === 0) {
        line.textContent = 'This conversation has reached a stopping point.';
        return;
      }
      available.forEach(function (c) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'clyp-btn clyp-sc-choice';
        btn.textContent = c.label;
        btn.addEventListener('click', guard(function () {
          applyAssignments(c.assignments);
          /* A choice that targets its own scene is a "retry": the learner
           * cannot move forward and is returned here to rethink. We re-present
           * the choices rather than replaying the whole scene. */
          var isSelf = c.targetSceneId === scene.id;
          var msg = c.feedback || (isSelf ? '\\u201cThat isn\\u2019t the right move. Reconsider and try again.\\u201d' : '');
          if (msg) {
            controls.innerHTML = '';
            speakerName.textContent = '';
            line.textContent = msg;
            var next = document.createElement('button');
            next.type = 'button';
            next.className = 'clyp-btn clyp-btn--primary';
            next.textContent = isSelf ? 'Try again' : 'Continue';
            next.addEventListener('click', guard(function () { if (isSelf) { showChoices(); } else { renderScene(c.targetSceneId); } }));
            controls.appendChild(next);
            next.focus();
          } else if (isSelf) {
            showChoices();
          } else {
            renderScene(c.targetSceneId);
          }
        }));
        controls.appendChild(btn);
      });
      var first = controls.querySelector('button');
      if (first) first.focus();
    }

    function advance() {
      lineIndex++;
      if (lineIndex >= scene.dialogue.length) { showChoices(); return; }
      var d = scene.dialogue[lineIndex];
      var speaker = null;
      scene.characters.forEach(function (c) { if (c.id === d.speakerId) speaker = c; });
      /* Selecting a speaker activates that character's expression + gesture. */
      cast.querySelectorAll('.clyp-sc-character').forEach(function (fig) {
        var isSpeaker = speaker && fig.getAttribute('data-character') === speaker.id;
        fig.classList.toggle('is-speaking', !!isSpeaker);
        if (isSpeaker) {
          var caption = fig.querySelector('figcaption');
          fig.innerHTML = artFor(speaker.base, d.expression, d.gesture);
          fig.appendChild(caption);
        }
      });
      speakerName.textContent = speaker ? speaker.name : '';
      line.textContent = d.text;
      controls.innerHTML = '';
      var next = document.createElement('button');
      next.type = 'button';
      next.className = 'clyp-btn clyp-btn--primary';
      next.textContent = lineIndex < scene.dialogue.length - 1 ? 'Continue' : (scene.choices.length ? 'Respond' : 'Continue');
      next.addEventListener('click', guard(advance));
      controls.appendChild(next);
      next.focus();
      announce((speaker ? speaker.name + ' says: ' : '') + d.text);
    }

    if (scene.dialogue.length > 0) { advance(); } else { showChoices(); }
  }

  /* Ending scenes present the outcome: title, description, feedback, summary,
   * and an optional restart (101_SCENE_MODEL Ending fields). */
  function renderEnding(view, scene) {
    var e = scene.ending || { title: 'The End', description: '', allowRestart: true };
    var panel = document.createElement('div');
    panel.className = 'clyp-sc-ending';
    var title = document.createElement('h3');
    title.className = 'clyp-sc-ending-title';
    title.textContent = e.title;
    title.setAttribute('tabindex', '-1');
    panel.appendChild(title);
    var desc = document.createElement('p');
    desc.textContent = e.description;
    panel.appendChild(desc);
    if (e.feedback) {
      var fb = document.createElement('p');
      fb.className = 'clyp-sc-ending-feedback';
      fb.textContent = e.feedback;
      panel.appendChild(fb);
    }
    if (e.summary) {
      var sum = document.createElement('p');
      sum.className = 'clyp-sc-ending-summary';
      sum.textContent = e.summary;
      panel.appendChild(sum);
    }
    if (e.allowRestart) {
      var restart = document.createElement('button');
      restart.type = 'button';
      restart.className = 'clyp-btn clyp-btn--primary';
      restart.textContent = 'Start Over';
      restart.addEventListener('click', guard(function () {
        resetVariables();
        renderScene(model.startSceneId);
      }));
      panel.appendChild(restart);
    }
    view.appendChild(panel);
    announce('Ending reached: ' + e.title + '. ' + e.description);
    setTimeout(function () { title.focus(); }, 0);
  }

  function announce(text) { announcer.textContent = text; }

  resetVariables();
  renderScene(model.startSceneId);`

  const css = scenarioCss(identity)
  return { html, css, js, logicNotes }
}

function scenarioCss(identity: RuntimeIdentity): string {
  const s = identity.cssScopeSelector
  return `/* ---- Scenario engine styles (mobile first) ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; line-height: 1.6; }
${s} .clyp-visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
${s} .clyp-scenario { border: 1px solid #c7d8db; border-radius: 12px; overflow: hidden; background: #fff; }
${s} .clyp-sc-scene { position: relative; }
${s} .clyp-sc-bg { line-height: 0; }
${s} .clyp-sc-bg svg { width: 100%; height: 160px; display: block; }
${s} .clyp-sc-bg img.clyp-art { width: 100%; height: 160px; display: block; object-fit: cover; }
${s} .clyp-sc-character img.clyp-art { width: 100%; height: auto; display: block; }
${s} .clyp-sc-cast { display: flex; justify-content: center; gap: 16px; margin-top: -74px; position: relative; }
${s} .clyp-sc-character { margin: 0; width: 96px; text-align: center; opacity: 0.65; transition: opacity 0.2s, transform 0.2s; }
${s} .clyp-sc-character svg { width: 100%; height: auto; }
${s} .clyp-sc-character.is-speaking { opacity: 1; transform: scale(1.06); }
${s} .clyp-sc-character figcaption { font-size: 0.8em; font-weight: 600; color: #23444d; background: rgba(255,255,255,0.85); border-radius: 6px; padding: 1px 6px; display: inline-block; }
${s} .clyp-sc-panel { padding: 16px; }
${s} .clyp-sc-speaker { margin: 0; font-weight: 700; color: #015061; min-height: 1.2em; }
${s} .clyp-sc-line { margin: 4px 0 14px; min-height: 2.6em; font-size: 1.05em; }
${s} .clyp-btn { font: inherit; padding: 10px 18px; border: 1px solid #b9cfd4; border-radius: 8px; background: #fff; cursor: pointer; }
${s} .clyp-btn:hover { background: #f2f7f6; }
${s} .clyp-btn--primary { background: #015061; border-color: #015061; color: #fff; font-weight: 600; }
${s} .clyp-btn--primary:hover { background: #013d4a; }
${s} .clyp-btn:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-sc-controls { display: flex; flex-direction: column; gap: 8px; }
${s} .clyp-sc-choice { text-align: left; border: 2px solid #c7d8db; border-radius: 10px; }
${s} .clyp-sc-choice:hover { border-color: #015061; background: #e3f2ee; }
${s} .clyp-sc-ending { position: relative; text-align: center; padding: 24px 20px 28px; }
${s} .clyp-sc-ending-title { margin: 0 0 8px; outline: none; }
${s} .clyp-sc-ending-feedback { color: #015061; font-weight: 600; }
${s} .clyp-sc-ending-summary { color: #3d5f6a; }

/* ---- Tablet & desktop (111_BREAKPOINT_STANDARD) ---- */
@media (min-width: 768px) {
  ${s} .clyp-sc-bg svg, ${s} .clyp-sc-bg img.clyp-art { height: 220px; }
  ${s} .clyp-sc-cast { gap: 32px; margin-top: -96px; }
  ${s} .clyp-sc-character { width: 120px; }
  ${s} .clyp-sc-panel { padding: 20px 28px 24px; }
  ${s} .clyp-sc-controls { flex-direction: column; }
}
@media (min-width: 1024px) {
  ${s} .clyp-sc-bg svg, ${s} .clyp-sc-bg img.clyp-art { height: 260px; }
  ${s} .clyp-sc-character { width: 136px; }
}`
}
