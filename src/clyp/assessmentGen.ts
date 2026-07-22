// Clyp — Assessment Engine compiler plugin (90_ASSESSMENT_ENGINE, 91–98).
// One engine, multiple assessment types: Pool → Question → Answer → Feedback.
// Knowledge Checks teach (gate on correctness, no scoring); Quiz types measure
// (answer-level scoring, passing score, attempts, mandatory result screen).
import type { BlockSection, ClypObject } from './types'
import type { RuntimeIdentity } from './identity'
import { esc, embedJson } from './util'
import { feedbackCss } from './feedback'
import { gateConfig, gateCss, gateHtml, gateJs } from './gate'
import type { GeneratedParts } from './contentGen'

interface RtAnswer { id: string; text: string; isCorrect: boolean; score: number; feedback?: string }
interface RtPair { id: string; left: string; right: string; score: number }
interface RtItem { id: string; text: string; score: number }
interface RtZone { id: string; label: string; score: number }
interface RtTarget { id: string; label: string; correctZoneId: string }
interface RtQuestion {
  id: string
  type: string
  prompt: string
  feedback?: string
  shuffleAnswers: boolean
  scoringMode?: string
  answers: RtAnswer[]
  pairs: RtPair[]
  items: RtItem[]
  zones: RtZone[]
  targets: RtTarget[]
}
interface RtModel {
  isKnowledgeCheck: boolean
  passingScore: number | null
  attemptsAllowed: number | null // null = unlimited
  resultTitle: string
  pools: { id: string; randomization: string; questions: RtQuestion[] }[]
}

function buildModel(block: BlockSection): RtModel {
  const root = block.objects[block.rootId]
  const isKC = block.blockType === 'knowledgeCheck'
  const pools = root.children
    .map((id) => block.objects[id])
    .filter((o) => o?.type === 'pool')
    .map((pool) => ({
      id: pool.id,
      randomization: pool.settings.randomization ?? 'none',
      questions: pool.children
        .map((id) => block.objects[id])
        .filter((o) => o?.type === 'question')
        .map((q) => {
          const kids = q.children.map((id) => block.objects[id]).filter(Boolean) as ClypObject[]
          return {
            id: q.id,
            type: q.settings.questionType ?? 'singleChoice',
            prompt: q.content.prompt ?? '',
            feedback: q.content.feedbackText || undefined,
            shuffleAnswers: !!q.settings.shuffleAnswers,
            scoringMode: q.settings.scoringMode,
            answers: kids
              .filter((k) => k.type === 'answer')
              .map((a) => ({
                id: a.id,
                text: a.content.text ?? '',
                isCorrect: !!a.logic.isCorrect,
                score: a.logic.score ?? 0,
                feedback: a.content.feedbackText || undefined
              })),
            pairs: kids
              .filter((k) => k.type === 'matchpair')
              .map((p) => ({ id: p.id, left: p.content.leftText ?? '', right: p.content.rightText ?? '', score: p.logic.score ?? 0 })),
            items: kids
              .filter((k) => k.type === 'sequenceitem')
              .map((it) => ({ id: it.id, text: it.content.text ?? '', score: it.logic.score ?? 0 })),
            zones: kids
              .filter((k) => k.type === 'dropzone')
              .map((z) => ({ id: z.id, label: z.content.label ?? '', score: z.logic.score ?? 0 })),
            targets: kids
              .filter((k) => k.type === 'dragtarget')
              .map((t) => ({ id: t.id, label: t.content.label ?? '', correctZoneId: t.logic.correctZoneId ?? '' }))
          }
        })
    }))
  return {
    isKnowledgeCheck: isKC,
    passingScore: isKC ? null : root.logic.passingScore ?? null,
    attemptsAllowed: root.logic.attemptsAllowed === 'unlimited' || root.logic.attemptsAllowed === undefined ? null : root.logic.attemptsAllowed,
    resultTitle: root.name ? root.name : 'Assessment Results',
    pools
  }
}

export function generateAssessment(block: BlockSection, identity: RuntimeIdentity): GeneratedParts {
  const model = buildModel(block)
  const rootEl = `${identity.elementIdPrefix}assessment`
  const isKC = model.isKnowledgeCheck

  const html = `<div class="clyp-assessment" id="${rootEl}">
  <div class="clyp-as-stage" data-role="stage" aria-live="polite">
    <noscript><p>This activity requires JavaScript to run.</p></noscript>
  </div>
  <div class="clyp-as-announcer clyp-visually-hidden" data-role="announcer" aria-live="assertive"></div>
</div>`

  const logicNotes = isKC
    ? [
        'This is a Knowledge Check: it teaches rather than measures.',
        'There is no score, no passing score and no grade — the learner must find the correct answer before continuing, with immediate corrective feedback.'
      ]
    : [
        `Answers own their scores; the block passes at ${model.passingScore ?? 0}% of the maximum possible score.`,
        model.attemptsAllowed === null ? 'The learner may attempt this assessment an unlimited number of times.' : `The learner has ${model.attemptsAllowed} attempt(s).`,
        'A result screen (score, status, retry) is always shown at the end.'
      ]

  let js = `
  /* ============================================================
   * ASSESSMENT ENGINE
   * One shared engine drives every Clyp assessment type.
   * Structure: Pools -> Questions -> Answers -> Feedback.
   * ${isKC ? 'Mode: KNOWLEDGE CHECK — practice only, no scores are kept.' : 'Mode: QUIZ — answers carry scores; a passing score decides the result.'}
   * ============================================================ */
  var model = ${embedJson(model)};
  var stage = root.querySelector('[data-role="stage"]');
  var announcer = root.querySelector('[data-role="announcer"]');
  var attemptNumber = 0;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function announce(text) { announcer.textContent = text; }

  /* Builds this attempt's question list from the pools.
   * Randomization belongs to Pool logic: "random" shuffles the pool,
   * "rotate" starts at a different question each attempt. */
  function drawQuestions() {
    var questions = [];
    model.pools.forEach(function (pool) {
      var qs = pool.questions.slice();
      if (pool.randomization === 'random') qs = shuffle(qs);
      if (pool.randomization === 'rotate' && qs.length > 1) {
        /* First attempt starts at the first question; each retry rotates. */
        var offset = (attemptNumber - 1) % qs.length;
        qs = qs.slice(offset).concat(qs.slice(0, offset));
      }
      questions = questions.concat(qs);
    });
    return questions;
  }

  function maxScoreOf(q) {
    if (q.type === 'matching') return q.pairs.reduce(function (s, p) { return s + Math.max(p.score, 0); }, 0);
    if (q.type === 'sequence') return q.items.reduce(function (s, it) { return s + Math.max(it.score, 0); }, 0);
    if (q.type === 'dragDrop') return q.targets.reduce(function (s, t) {
      var zone = q.zones.filter(function (z) { return z.id === t.correctZoneId; })[0];
      return s + (zone ? Math.max(zone.score, 0) : 0);
    }, 0);
    if (q.type === 'selectAll' && q.scoringMode === 'allOrNothing') {
      return q.answers.filter(function (a) { return a.isCorrect; }).reduce(function (s, a) { return s + Math.max(a.score, 0); }, 0);
    }
    if (q.type === 'multipleResponse' || q.type === 'selectAll') {
      return q.answers.filter(function (a) { return a.isCorrect; }).reduce(function (s, a) { return s + Math.max(a.score, 0); }, 0);
    }
    return q.answers.reduce(function (s, a) { return Math.max(s, a.score); }, 0);
  }

  /* ---- Per-question rendering & response capture ---- */
  function renderQuestion(q, index, total, state) {
    var wrap = document.createElement('div');
    wrap.className = 'clyp-as-question';
    var head = document.createElement('p');
    head.className = 'clyp-as-progress';
    head.textContent = 'Question ' + (index + 1) + ' of ' + total;
    wrap.appendChild(head);
    var prompt = document.createElement('h3');
    prompt.className = 'clyp-as-prompt';
    prompt.textContent = q.prompt;
    wrap.appendChild(prompt);
    var body = document.createElement('div');
    body.className = 'clyp-as-body';
    wrap.appendChild(body);

    if (q.type === 'singleChoice' || q.type === 'trueFalse' || q.type === 'knowledgeCheck') {
      var answers = q.shuffleAnswers ? shuffle(q.answers) : q.answers;
      var group = document.createElement('div');
      group.setAttribute('role', 'radiogroup');
      group.setAttribute('aria-label', 'Answer options');
      answers.forEach(function (a) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'clyp-as-option';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.textContent = a.text;
        btn.addEventListener('click', guard(function () {
          group.querySelectorAll('.clyp-as-option').forEach(function (b) {
            b.classList.remove('is-selected');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('is-selected');
          btn.setAttribute('aria-checked', 'true');
          state.selection = [a.id];
        }));
        group.appendChild(btn);
      });
      body.appendChild(group);
    }

    if (q.type === 'multipleResponse' || q.type === 'selectAll') {
      var answers2 = q.shuffleAnswers ? shuffle(q.answers) : q.answers;
      state.selection = [];
      answers2.forEach(function (a) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'clyp-as-option';
        btn.setAttribute('role', 'checkbox');
        btn.setAttribute('aria-checked', 'false');
        btn.textContent = a.text;
        btn.addEventListener('click', guard(function () {
          var on = btn.classList.toggle('is-selected');
          btn.setAttribute('aria-checked', on ? 'true' : 'false');
          if (on) { state.selection.push(a.id); }
          else { state.selection = state.selection.filter(function (id) { return id !== a.id; }); }
        }));
        body.appendChild(btn);
      });
    }

    if (q.type === 'matching') {
      state.matches = {};
      var rights = shuffle(q.pairs.map(function (p) { return { id: p.id, text: p.right }; }));
      q.pairs.forEach(function (p, i) {
        var row = document.createElement('div');
        row.className = 'clyp-as-matchrow';
        var label = document.createElement('label');
        label.textContent = p.left;
        label.setAttribute('for', ns + '-match-' + index + '-' + i);
        var select = document.createElement('select');
        select.className = 'clyp-as-select';
        select.id = ns + '-match-' + index + '-' + i;
        var empty = document.createElement('option');
        empty.value = '';
        empty.textContent = 'Choose a match...';
        select.appendChild(empty);
        rights.forEach(function (r) {
          var opt = document.createElement('option');
          opt.value = r.id;
          opt.textContent = r.text;
          select.appendChild(opt);
        });
        select.addEventListener('change', guard(function () { state.matches[p.id] = select.value; }));
        row.appendChild(label);
        row.appendChild(select);
        body.appendChild(row);
      });
    }

    if (q.type === 'sequence') {
      var order = shuffle(q.items.map(function (it) { return it.id; }));
      /* Ensure the starting order is never already correct. */
      if (order.join() === q.items.map(function (it) { return it.id; }).join() && order.length > 1) {
        order.reverse();
      }
      state.order = order;
      var list = document.createElement('ol');
      list.className = 'clyp-as-seqlist';
      list.setAttribute('aria-label', 'Arrange these items in order');
      function redraw() {
        list.innerHTML = '';
        state.order.forEach(function (id, pos) {
          var item = q.items.filter(function (it) { return it.id === id; })[0];
          var li = document.createElement('li');
          li.className = 'clyp-as-seqitem';
          var text = document.createElement('span');
          text.textContent = item.text;
          var controls = document.createElement('span');
          controls.className = 'clyp-as-seqcontrols';
          var up = document.createElement('button');
          up.type = 'button';
          up.className = 'clyp-btn clyp-as-seqbtn';
          up.textContent = '\\u2191';
          up.setAttribute('aria-label', 'Move "' + item.text + '" up');
          up.disabled = pos === 0;
          up.addEventListener('click', guard(function () {
            state.order.splice(pos, 1);
            state.order.splice(pos - 1, 0, id);
            redraw();
            announce('"' + item.text + '" moved to position ' + pos + '.');
          }));
          var down = document.createElement('button');
          down.type = 'button';
          down.className = 'clyp-btn clyp-as-seqbtn';
          down.textContent = '\\u2193';
          down.setAttribute('aria-label', 'Move "' + item.text + '" down');
          down.disabled = pos === state.order.length - 1;
          down.addEventListener('click', guard(function () {
            state.order.splice(pos, 1);
            state.order.splice(pos + 1, 0, id);
            redraw();
            announce('"' + item.text + '" moved to position ' + (pos + 2) + '.');
          }));
          controls.appendChild(up);
          controls.appendChild(down);
          li.appendChild(text);
          li.appendChild(controls);
          list.appendChild(li);
        });
      }
      redraw();
      body.appendChild(list);
    }

    if (q.type === 'dragDrop') {
      state.placements = {};
      var pending = null;
      var bank = document.createElement('div');
      bank.className = 'clyp-as-bank';
      bank.setAttribute('aria-label', 'Items to place');
      var zonesWrap = document.createElement('div');
      zonesWrap.className = 'clyp-as-zones';
      var hint = document.createElement('p');
      hint.className = 'clyp-as-hint';
      hint.textContent = 'Drag each item onto a zone — or tap an item, then tap a zone to place it.';
      body.appendChild(hint);

      function refreshChips() {
        root.querySelectorAll('.clyp-as-chip').forEach(function (chip) {
          chip.classList.toggle('is-pending', chip.getAttribute('data-target') === pending);
        });
      }
      function place(targetId, zoneId) {
        state.placements[targetId] = zoneId;
        pending = null;
        var chip = root.querySelector('.clyp-as-chip[data-target="' + targetId + '"]');
        var zone = root.querySelector('.clyp-as-zone[data-zone="' + zoneId + '"] .clyp-as-zoneitems');
        if (chip && zone) zone.appendChild(chip);
        refreshChips();
        var t = q.targets.filter(function (x) { return x.id === targetId; })[0];
        var z = q.zones.filter(function (x) { return x.id === zoneId; })[0];
        announce('"' + (t && t.label) + '" placed on "' + (z && z.label) + '".');
      }

      shuffle(q.targets).forEach(function (t) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'clyp-as-chip';
        chip.textContent = t.label;
        chip.setAttribute('data-target', t.id);
        chip.setAttribute('draggable', 'true');
        chip.addEventListener('dragstart', guard(function (e) { e.dataTransfer.setData('text/plain', t.id); }));
        chip.addEventListener('click', guard(function () {
          pending = pending === t.id ? null : t.id;
          refreshChips();
          announce(pending ? '"' + t.label + '" selected. Now choose a zone.' : 'Selection cleared.');
        }));
        bank.appendChild(chip);
      });
      q.zones.forEach(function (z) {
        var zone = document.createElement('div');
        zone.className = 'clyp-as-zone';
        zone.setAttribute('data-zone', z.id);
        var title = document.createElement('button');
        title.type = 'button';
        title.className = 'clyp-as-zonetitle';
        title.textContent = z.label;
        title.addEventListener('click', guard(function () { if (pending) place(pending, z.id); }));
        var items = document.createElement('div');
        items.className = 'clyp-as-zoneitems';
        zone.addEventListener('dragover', function (e) { e.preventDefault(); });
        zone.addEventListener('drop', guard(function (e) {
          e.preventDefault();
          var id = e.dataTransfer.getData('text/plain');
          if (id) place(id, z.id);
        }));
        zone.appendChild(title);
        zone.appendChild(items);
        zonesWrap.appendChild(zone);
      });
      body.appendChild(bank);
      body.appendChild(zonesWrap);
    }

    return wrap;
  }

  /* ---- Scoring: Answer -> Question -> Pool -> Assessment -> Result ---- */
  function scoreQuestion(q, state) {
    var earned = 0;
    var correct = false;
    if (q.type === 'singleChoice' || q.type === 'trueFalse' || q.type === 'knowledgeCheck') {
      var sel = q.answers.filter(function (a) { return (state.selection || []).indexOf(a.id) !== -1; })[0];
      earned = sel ? sel.score : 0;
      correct = !!(sel && sel.isCorrect);
    } else if (q.type === 'multipleResponse' || q.type === 'selectAll') {
      var selIds = state.selection || [];
      var correctIds = q.answers.filter(function (a) { return a.isCorrect; }).map(function (a) { return a.id; });
      var exact = selIds.length === correctIds.length && correctIds.every(function (id) { return selIds.indexOf(id) !== -1; });
      if (q.type === 'selectAll' && q.scoringMode === 'allOrNothing') {
        earned = exact ? maxScoreOf(q) : 0;
      } else {
        q.answers.forEach(function (a) {
          if (selIds.indexOf(a.id) !== -1) earned += a.isCorrect ? a.score : Math.min(a.score, 0);
        });
      }
      correct = exact;
    } else if (q.type === 'matching') {
      correct = true;
      q.pairs.forEach(function (p) {
        if ((state.matches || {})[p.id] === p.id) { earned += p.score; } else { correct = false; }
      });
    } else if (q.type === 'sequence') {
      correct = true;
      q.items.forEach(function (it, pos) {
        if ((state.order || [])[pos] === it.id) { earned += it.score; } else { correct = false; }
      });
    } else if (q.type === 'dragDrop') {
      correct = true;
      q.targets.forEach(function (t) {
        var placed = (state.placements || {})[t.id];
        if (placed === t.correctZoneId) {
          var zone = q.zones.filter(function (z) { return z.id === t.correctZoneId; })[0];
          earned += zone ? zone.score : 0;
        } else { correct = false; }
      });
    }
    return { earned: earned, correct: correct };
  }

  function answerFeedback(q, state) {
    if (q.type === 'singleChoice' || q.type === 'trueFalse' || q.type === 'knowledgeCheck') {
      var sel = q.answers.filter(function (a) { return (state.selection || []).indexOf(a.id) !== -1; })[0];
      return (sel && sel.feedback) || q.feedback || '';
    }
    return q.feedback || '';
  }

  /* ---- Attempt flow ---- */
  function runAttempt() {
    attemptNumber++;
    var questions = drawQuestions();
    var results = [];
    var index = 0;

    function showQuestion() {
      var q = questions[index];
      var state = {};
      stage.innerHTML = '';
      var view = renderQuestion(q, index, questions.length, state);
      var feedbackBox = document.createElement('div');
      feedbackBox.className = 'clyp-as-feedback';
      feedbackBox.setAttribute('aria-live', 'polite');
      view.appendChild(feedbackBox);
      var actions = document.createElement('div');
      actions.className = 'clyp-as-actions';
      var submit = document.createElement('button');
      submit.type = 'button';
      submit.className = 'clyp-btn clyp-btn--primary';
      submit.textContent = ${isKC ? "'Check Answer'" : "'Submit Answer'"};
      actions.appendChild(submit);
      view.appendChild(actions);
      stage.appendChild(view);
      view.querySelector('.clyp-as-prompt').setAttribute('tabindex', '-1');
      view.querySelector('.clyp-as-prompt').focus();

      function hasResponse(state) {
        if (q.type === 'matching') return q.pairs.every(function (p) { return (state.matches || {})[p.id]; });
        if (q.type === 'sequence') return true;
        if (q.type === 'dragDrop') return q.targets.every(function (t) { return (state.placements || {})[t.id]; });
        return (state.selection || []).length > 0;
      }

      function goNext() {
        index++;
        if (index < questions.length) { showQuestion(); } else { showResult(); }
      }

      var readyToContinue = false;
      submit.addEventListener('click', guard(function () {
        if (readyToContinue) { goNext(); return; }
        if (!hasResponse(state)) {
          feedbackBox.className = 'clyp-as-feedback is-hint';
          feedbackBox.textContent = 'Please respond before continuing.';
          return;
        }
        var result = scoreQuestion(q, state);
        var fb = answerFeedback(q, state);
        ${isKC ? `
        /* Knowledge Check gatekeeping: a correct answer is required before
         * continuing. Feedback is immediate, corrective and instructional. */
        if (result.correct) {
          feedbackBox.className = 'clyp-as-feedback is-correct';
          feedbackBox.textContent = fb || 'Correct! Well done.';
          submit.textContent = index < questions.length - 1 ? 'Continue' : 'Finish';
          readyToContinue = true;
        } else {
          feedbackBox.className = 'clyp-as-feedback is-incorrect';
          feedbackBox.textContent = fb || 'Not quite — take another look and try again.';
        }` : `
        results.push({ question: q, earned: result.earned, correct: result.correct });
        goNext();`}
      }));
    }

    function showResult() {
      stage.innerHTML = '';
      var screen = document.createElement('div');
      screen.className = 'clyp-as-result';
      ${isKC ? `
      /* Knowledge Checks complete without any score or grade. */
      screen.innerHTML =
        '<h3 class="clyp-as-result-title">Nice work!</h3>' +
        '<p class="clyp-as-result-status">You worked through every question. This practice was not scored \\u2014 it exists to help the ideas stick.</p>';
      var again = document.createElement('button');
      again.type = 'button';
      again.className = 'clyp-btn';
      again.textContent = 'Practice Again';
      again.addEventListener('click', guard(function () { runAttempt(); }));
      screen.appendChild(again);
      /* A Knowledge Check is satisfied by working through every question. */
      gateSatisfy();` : `
      /* Result Screen (mandatory for quiz types): title, score, status,
       * feedback, retry option, completion message. */
      var earned = results.reduce(function (s, r) { return s + r.earned; }, 0);
      var max = questions.reduce(function (s, q) { return s + maxScoreOf(q); }, 0);
      var pct = max > 0 ? Math.round((Math.max(earned, 0) / max) * 100) : 0;
      var passed = pct >= (model.passingScore || 0);
      var attemptsLeft = model.attemptsAllowed === null ? null : model.attemptsAllowed - attemptNumber;
      screen.innerHTML =
        '<h3 class="clyp-as-result-title">' + model.resultTitle.replace(/[<>&]/g, '') + '</h3>' +
        '<p class="clyp-as-result-score">Your score: <strong>' + pct + '%</strong> (' + Math.max(earned, 0) + ' of ' + max + ' points)</p>' +
        '<p class="clyp-as-result-status ' + (passed ? 'is-pass' : 'is-fail') + '">' +
          (passed ? 'Passed \\u2014 you met the passing score of ' + model.passingScore + '%.' : 'Not passed \\u2014 the passing score is ' + model.passingScore + '%.') +
        '</p>' +
        '<ul class="clyp-as-result-detail">' +
          results.map(function (r, i) {
            return '<li class="' + (r.correct ? 'is-correct' : 'is-incorrect') + '">Question ' + (i + 1) + ': ' + (r.correct ? 'correct' : 'incorrect') + '</li>';
          }).join('') +
        '</ul>';
      announce(passed ? 'Assessment passed with ' + pct + ' percent.' : 'Assessment not passed. Score ' + pct + ' percent.');
      /* The gate clears only once the learner actually meets the passing score. */
      if (passed) { gateSatisfy(); }
      if (!passed && (attemptsLeft === null || attemptsLeft > 0)) {
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'clyp-btn clyp-btn--primary';
        retry.textContent = 'Try Again' + (attemptsLeft !== null ? ' (' + attemptsLeft + ' attempt' + (attemptsLeft === 1 ? '' : 's') + ' left)' : '');
        retry.addEventListener('click', guard(function () { runAttempt(); }));
        screen.appendChild(retry);
      } else if (!passed) {
        var done = document.createElement('p');
        done.className = 'clyp-as-result-note';
        done.textContent = 'You have used all available attempts.';
        screen.appendChild(done);
      } else {
        var complete = document.createElement('p');
        complete.className = 'clyp-as-result-note';
        complete.textContent = 'You have completed this activity. You can continue with the lesson.';
        screen.appendChild(complete);
      }`}
      stage.appendChild(screen);
      var title = screen.querySelector('.clyp-as-result-title');
      if (title) { title.setAttribute('tabindex', '-1'); title.focus(); }
    }

    showQuestion();
  }

  runAttempt();`

  let css = assessmentCss(identity)
  let finalHtml = html

  // Completion gate (190) — a condition, not an exploration count: the learner
  // must pass (or, for a Knowledge Check, work through every question).
  const root = block.objects[block.rootId]
  const gate = gateConfig(root, 1, 'requirements', {
    mode: 'condition',
    defaultReminder: isKC
      ? 'Work through every question to complete this block.'
      : `Reach the passing score of ${model.passingScore ?? 0}% to complete this block.`
  })
  js = gateJs(rootEl, gate) + js
  if (gate.enabled) {
    finalHtml += gateHtml(rootEl, gate)
    css += '\n' + gateCss(identity.cssScopeSelector) + '\n' + feedbackCss(identity.cssScopeSelector)
    logicNotes.push(
      isKC
        ? 'The learner must work through every question before this block is marked complete.'
        : `The learner must reach the passing score of ${model.passingScore ?? 0}% before this block is marked complete.`
    )
  }

  return { html: finalHtml, css, js, logicNotes }
}

function assessmentCss(identity: RuntimeIdentity): string {
  const s = identity.cssScopeSelector
  return `/* ---- Assessment engine styles (mobile first) ---- */
${s} { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #002c39; line-height: 1.6; }
${s} .clyp-visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
${s} .clyp-assessment { border: 1px solid #c7d8db; border-radius: 12px; padding: 20px; background: #fff; }
${s} .clyp-as-progress { color: #5e7d86; font-size: 0.85em; margin: 0 0 4px; }
${s} .clyp-as-prompt { margin: 0 0 16px; line-height: 1.35; outline: none; }
${s} .clyp-btn { font: inherit; padding: 10px 18px; border: 1px solid #b9cfd4; border-radius: 8px; background: #fff; cursor: pointer; }
${s} .clyp-btn:hover { background: #f2f7f6; }
${s} .clyp-btn--primary { background: #015061; border-color: #015061; color: #fff; font-weight: 600; }
${s} .clyp-btn--primary:hover { background: #013d4a; }
${s} .clyp-btn:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-as-option { display: block; width: 100%; box-sizing: border-box; text-align: left; font: inherit; padding: 12px 16px; margin-bottom: 8px; border: 2px solid #c7d8db; border-radius: 10px; background: #fff; cursor: pointer; }
${s} .clyp-as-option:hover { border-color: #6fa1ab; }
${s} .clyp-as-option:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-as-option.is-selected { border-color: #015061; background: #e3f2ee; }
${s} .clyp-as-feedback { min-height: 1.4em; margin: 10px 0; padding: 0; font-weight: 600; }
${s} .clyp-as-feedback.is-correct { color: #00916b; }
${s} .clyp-as-feedback.is-incorrect { color: #d64545; }
${s} .clyp-as-feedback.is-hint { color: #b7791f; }
${s} .clyp-as-actions { margin-top: 12px; }
${s} .clyp-as-matchrow { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
${s} .clyp-as-matchrow label { font-weight: 600; }
${s} .clyp-as-select { font: inherit; padding: 8px 10px; border: 2px solid #c7d8db; border-radius: 8px; background: #fff; }
${s} .clyp-as-seqlist { list-style: none; margin: 0; padding: 0; counter-reset: seq; }
${s} .clyp-as-seqitem { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 10px 14px; margin-bottom: 8px; border: 2px solid #c7d8db; border-radius: 10px; counter-increment: seq; }
${s} .clyp-as-seqitem::before { content: counter(seq) "."; font-weight: 700; color: #00b482; margin-right: 4px; }
${s} .clyp-as-seqcontrols { display: flex; gap: 4px; }
${s} .clyp-as-seqbtn { padding: 4px 10px; }
${s} .clyp-as-hint { color: #5e7d86; font-size: 0.9em; }
${s} .clyp-as-bank { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; border: 2px dashed #b9cfd4; border-radius: 10px; margin-bottom: 12px; min-height: 44px; }
${s} .clyp-as-chip { font: inherit; padding: 8px 14px; border: 2px solid #015061; color: #015061; border-radius: 999px; background: #e3f2ee; cursor: grab; }
${s} .clyp-as-chip.is-pending { background: #015061; color: #fff; }
${s} .clyp-as-chip:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-as-zones { display: grid; grid-template-columns: 1fr; gap: 10px; }
${s} .clyp-as-zone { border: 2px solid #c7d8db; border-radius: 10px; padding: 10px; }
${s} .clyp-as-zonetitle { font: inherit; font-weight: 700; background: none; border: none; cursor: pointer; padding: 4px; width: 100%; text-align: left; }
${s} .clyp-as-zonetitle:focus-visible { outline: 3px solid #015061; outline-offset: 2px; }
${s} .clyp-as-zoneitems { display: flex; flex-wrap: wrap; gap: 6px; min-height: 34px; padding-top: 6px; }
${s} .clyp-as-result { text-align: center; padding: 12px 4px; }
${s} .clyp-as-result-title { margin: 0 0 8px; outline: none; }
${s} .clyp-as-result-score { font-size: 1.1em; }
${s} .clyp-as-result-status.is-pass { color: #00916b; font-weight: 700; }
${s} .clyp-as-result-status.is-fail { color: #d64545; font-weight: 700; }
${s} .clyp-as-result-detail { list-style: none; padding: 0; margin: 12px auto; max-width: 320px; text-align: left; }
${s} .clyp-as-result-detail li.is-correct::before { content: "\\2713 "; color: #00916b; font-weight: 700; }
${s} .clyp-as-result-detail li.is-incorrect::before { content: "\\2717 "; color: #d64545; font-weight: 700; }
${s} .clyp-as-result-note { color: #5e7d86; }

/* ---- Tablet & desktop (111_BREAKPOINT_STANDARD) ---- */
@media (min-width: 768px) {
  ${s} .clyp-assessment { padding: 28px; }
  ${s} .clyp-as-matchrow { flex-direction: row; align-items: center; justify-content: space-between; }
  ${s} .clyp-as-matchrow label { flex: 1; }
  ${s} .clyp-as-matchrow .clyp-as-select { flex: 1; }
  ${s} .clyp-as-zones { grid-template-columns: repeat(2, 1fr); }
}`
}
