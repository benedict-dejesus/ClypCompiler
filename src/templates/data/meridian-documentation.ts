// Meridian Health Systems — course 3 of 10.
// Driven by three inquests in 24 months where clinical records were criticised:
// retrospective entries, absent rationale, and copy-forward errors propagated
// across days of notes.
import type { CourseTemplate } from '../types'

export const meridianDocumentation: CourseTemplate = {
  id: 'meridian-health-documentation',
  title: 'Notes That Survive a Coroner',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Three inquests in 24 months criticised our clinical records. Common findings: entries written ' +
    'hours after the event without being marked retrospective, decisions recorded without the ' +
    'reasoning behind them, and copy-forward errors that propagated an inaccuracy across six days of ' +
    'notes. One inquest produced a Regulation 28 report to prevent future deaths.',
  audience: 'All registered clinical staff — nursing, medical, allied health — and clinical students',
  summary:
    'Your notes will one day be read by someone who was not there, months later, looking for what ' +
    'you thought and why. This course covers timing, rationale and copy-forward — the three failures ' +
    'named in our own inquests.',
  objectives: [
    'Write contemporaneously, and mark a late entry correctly when you cannot',
    'Record clinical reasoning, including what you considered and excluded',
    'Avoid copy-forward errors and correct one safely when you find it',
    'Amend a record properly, without ever obscuring the original'
  ],
  minutes: 28,
  themeId: 'corporate',
  tags: ['record keeping', 'medico-legal', 'clinical governance', 'patient safety'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Writes It Now', icon: '🕐', kind: 'lesson', lesson: 2 },
      { label: 'Shows the Thinking', icon: '🧠', kind: 'lesson', lesson: 3 },
      { label: 'Record Keeper', icon: '📋', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'Three Inquests',
      description: 'What the coroner asked, and why the notes could not answer.',
      badgeIcon: '⚖️',
      blocks: [
        { t: 'heading', text: 'A coroner does not ask whether you cared' },
        {
          t: 'para',
          html:
            'In each of our three inquests, no one suggested the clinicians involved were uncaring or ' +
            'incompetent. The criticism was narrower and harder to answer: <b>the record could not show ' +
            'what was decided, when, or why.</b>'
        },
        {
          t: 'para',
          html:
            'A coroner reconstructs events from documents, often 14 to 20 months after the fact. Memory ' +
            'is not evidence. What you wrote is the evidence — and where the notes are silent, the ' +
            'inquest fills the silence with the family’s account, not yours.'
        },
        {
          t: 'timeline',
          preset: 'vertical',
          events: [
            {
              label: 'Inquest 1 — the four-hour gap',
              date: '2023',
              body:
                'A patient deteriorated over an evening. Observations were charted, but no entry described the clinical picture between 18:00 and 22:15. The nurse gave clear oral evidence about three assessments she had made. The coroner accepted her honesty and recorded that the assessments could not be verified. Finding: record keeping fell below expected standards.'
            },
            {
              label: 'Inquest 2 — the decision with no reason',
              date: '2024',
              body:
                'A registrar decided not to escalate to critical care at 02:00. The entry read: “Reviewed. Plan: continue current management. For senior review a.m.” The reasoning — that the patient had improved after fluids and had a documented ceiling of care discussion — existed only in the doctor’s memory. Regulation 28 report issued.'
            },
            {
              label: 'Inquest 3 — the error that travelled',
              date: '2024',
              body:
                'A ward round entry copied forward “no known drug allergies” from a previous admission. The patient had a documented penicillin allergy recorded in the allergy field. The phrase was copied for six consecutive days by four different clinicians. The patient received co-amoxiclav and suffered anaphylaxis.'
            }
          ]
        },
        {
          t: 'chart',
          title: 'Findings against our records across the three inquests',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Entry not contemporaneous', value: 3, accent: '#b3543f' },
            { label: 'Rationale absent', value: 3, accent: '#b3543f' },
            { label: 'Copy-forward inaccuracy', value: 2, accent: '#b7791f' },
            { label: 'Illegible or ambiguous', value: 1, accent: '#4a6fa5' },
            { label: 'Amendment obscured original', value: 1, accent: '#4a6fa5' }
          ]
        },
        {
          t: 'quote',
          text:
            'I have no doubt the witness did assess this patient. I simply have no contemporaneous record of it, and I cannot make a finding on the basis of recollection alone at this distance.',
          by: 'HM Coroner — Inquest 1, transcript extract',
          pull: true
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'What the record is for',
          gate: true,
          questions: [
            {
              prompt:
                'The nurse in Inquest 1 gave honest, detailed oral evidence about assessments she had genuinely performed. Why did that not resolve the criticism?',
              feedback:
                'The record exists precisely so that care can be demonstrated without depending on recollection years later.',
              answers: [
                {
                  text: 'Recollection at 18 months cannot be verified; only a contemporaneous record can',
                  correct: true,
                  feedback:
                    'Exactly. The coroner did not doubt her — he simply could not treat unverifiable memory as evidence.'
                },
                {
                  text: 'The coroner believed she was being untruthful',
                  feedback: 'The finding explicitly accepted her honesty. That was never the issue.'
                },
                {
                  text: 'Nursing assessments do not need documenting if observations are charted',
                  feedback:
                    'Observations record numbers. They do not record your assessment of what those numbers meant.'
                },
                {
                  text: 'She should have been represented by a lawyer',
                  feedback: 'Representation would not have created a record that did not exist.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'Contemporaneous, or Properly Marked',
      description: 'When to write, and how to write late without creating a problem.',
      badgeIcon: '🕐',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'Write it now. If you cannot, say that you did not.' },
        {
          t: 'para',
          html:
            '“Contemporaneous” means at the time, or as close to it as clinical priority allows. In ' +
            'practice: <b>before you leave the ward</b>, and certainly before the end of your shift. ' +
            'The evidential weight of an entry decays quickly with the gap between event and record.'
        },
        {
          t: 'para',
          html:
            'Sometimes you genuinely cannot write at the time — you were resuscitating someone, or ' +
            'managing three deteriorating patients. That is entirely acceptable. What is not acceptable ' +
            'is writing it later and presenting it as if it were written at the time.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'Writing at the time',
              body:
                'The default, and the only entry that carries full weight.\n\n' +
                'Every entry needs: date, time in 24-hour format, your full name printed, your role, and your signature or electronic identity. “Dr Smith” is not enough when there are three Dr Smiths.\n\n' +
                'If you are documenting on paper, write legibly enough that a stranger can read it under pressure. Illegibility was a finding in Inquest 3 and it is entirely avoidable.'
            },
            {
              title: 'Writing late — the correct method',
              body:
                'Head the entry clearly: <b>“Retrospective entry written [date] at [time], relating to events at [time].”</b>\n\n' +
                'Then say briefly why it is late: “Unable to document at the time due to concurrent cardiac arrest on the ward.”\n\n' +
                'A properly marked late entry is credible and normal. Coroners see them constantly and think nothing of them. What damages credibility is an entry that reads as contemporaneous but is later shown — by rota, by system timestamp, by another record — not to be.'
            },
            {
              title: 'Electronic records',
              body:
                'The system stamps the time you <i>saved</i>, not the time of the event. If you are writing at 23:40 about an assessment at 21:15, the entry must say so in its own text — the metadata will otherwise imply you assessed the patient at 23:40.\n\n' +
                'Never write under another person’s login, and never leave a session open for a colleague to use. In Inquest 2 the audit trail was used to establish who wrote what and when; a shared login would have made that impossible and would itself have become a finding.'
            },
            {
              title: 'Amending an entry',
              body:
                'Paper: single line through the error so it remains readable. Never obliterate, never use correction fluid, never write over. Initial, date and time the amendment, and add the correct information alongside.\n\n' +
                'Electronic: use the system’s amendment function, which preserves the original in the audit trail. Do not delete and re-enter.\n\n' +
                'An amendment that hides the original looks like concealment even when it is not, and that inference is very difficult to argue against afterwards.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'The same late entry, two ways',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'Damaging',
              accent: '#b3543f',
              rows: [
                'Written 23:40, presented with no timing note',
                '“Patient reviewed, chest clear, obs stable, plan continue.”',
                'System timestamp contradicts the implied timing',
                'Under questioning, the gap has to be explained live',
                'Credibility of the whole record is now in question'
              ]
            },
            {
              title: 'Defensible',
              accent: '#2b7a3f',
              rows: [
                'Written 23:40, headed as a retrospective entry',
                '“Retrospective entry, written 23:40, relating to review at 21:15.”',
                '“Unable to document sooner — concurrent arrest call in bay 4.”',
                'Timing is explained before anyone has to ask',
                'The entry reads as an honest, ordinary clinical record'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Late entry practice',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You assessed a patient at 14:00 but were pulled into an emergency and are only now writing it up at 19:30. What do you do?',
              answers: [
                {
                  text: 'Head it as a retrospective entry, state both times, and give the reason for the delay',
                  correct: true,
                  feedback:
                    'Correct. A marked late entry with a reason is entirely credible. The problem is never lateness — it is unacknowledged lateness.'
                },
                {
                  text: 'Write it normally — the assessment did happen at 14:00',
                  feedback:
                    'The entry then implies it was written at 14:00. When the audit trail shows otherwise, the whole record is called into question.'
                },
                {
                  text: 'Ask a colleague who was present to write it instead',
                  feedback: 'They cannot document an assessment they did not perform. That is a separate and more serious problem.'
                },
                {
                  text: 'Leave it — the observation chart already covers that period',
                  feedback:
                    'Observations record numbers, not your assessment. This is precisely the gap that was criticised in Inquest 1.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'Recording the Thinking',
      description: 'Why “plan: continue” is the entry that generated a Regulation 28 report.',
      badgeIcon: '🧠',
      blocks: [
        { t: 'heading', text: 'The decision is not the record. The reasoning is.' },
        {
          t: 'para',
          html:
            'Inquest 2 turned on a single entry: <i>“Reviewed. Plan: continue current management. For ' +
            'senior review a.m.”</i> That entry is not wrong. It is simply empty — it records an outcome ' +
            'and discards everything that produced it.'
        },
        {
          t: 'para',
          html:
            'The registrar had good reasons. The patient had responded to fluids, lactate had fallen, ' +
            'and there was a documented ceiling-of-care conversation from two days earlier. None of that ' +
            'was in the note, so at inquest the decision appeared arbitrary and could not be defended.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Element 1',
              heading: 'What you found',
              body:
                'The actual findings, not a conclusion. “Chest clear” is a conclusion. “Air entry equal, no added sounds, RR 18, sats 96% on air” is a finding.\n\n' +
                'Findings can be re-interpreted later by someone with more information. Conclusions cannot.'
            },
            {
              caption: 'Element 2',
              heading: 'What you thought it meant',
              body:
                'Your working diagnosis or clinical impression, in plain words. “Impression: likely fluid-responsive sepsis, currently improving.”\n\n' +
                'This is the single most valuable sentence in any clinical entry and the one most often absent.'
            },
            {
              caption: 'Element 3',
              heading: 'What you considered and excluded',
              body:
                '“Considered PE — no chest pain, no desaturation, low Wells score, not felt likely at this stage.”\n\n' +
                'This is what demonstrates a reasoning process rather than an assumption. It also protects you: an excluded diagnosis that later proves correct is a defensible clinical judgement; a diagnosis never mentioned looks like one never considered.'
            },
            {
              caption: 'Element 4',
              heading: 'What you decided, and the trigger to change',
              body:
                '“Plan: continue IV fluids, repeat lactate at 04:00, escalate to critical care if lactate rises above 4 or NEWS2 ≥7.”\n\n' +
                'A plan with a named trigger tells the next clinician exactly when to act. A plan without one leaves them guessing, and leaves the record unable to show what should have happened next.'
            },
            {
              caption: 'Element 5',
              heading: 'Who you discussed it with',
              body:
                '“Discussed with Dr Okafor, consultant on call, 02:10 — agrees with plan.”\n\n' +
                'Name, role, time, and their view. “Discussed with senior” names nobody and proves nothing.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'The Inquest 2 entry, rewritten',
          preset: 'beforeAfter',
          layout: 'stacked',
          columns: [
            {
              title: 'What was written',
              accent: '#b3543f',
              rows: [
                '“02:00. Reviewed. Plan: continue current management. For senior review a.m.”',
                'No findings',
                'No impression',
                'No alternatives considered',
                'No escalation trigger',
                'No record of the consultant discussion that did occur'
              ]
            },
            {
              title: 'What would have answered the coroner',
              accent: '#2b7a3f',
              rows: [
                '“02:00. Reviewed following NEWS2 6.”',
                '“BP 104/62 (was 88/50), HR 96 (was 118), RR 20, lactate 2.1 (was 3.8 at 22:00).”',
                '“Impression: sepsis, responding to fluid resuscitation.”',
                '“Considered critical care referral — improving trajectory, ceiling of care discussion 12/03 documented (ward-based care).”',
                '“Plan: continue abx, repeat lactate 04:00. Escalate if lactate >3, NEWS2 ≥7, or systolic <100.”',
                '“Discussed with Dr Okafor, consultant on call, 02:10 — agrees.”'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'What belongs in a decision entry',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You have decided not to escalate a patient overnight. Which of these should appear in the entry? Select all that apply.',
              feedback:
                'Findings, impression, alternatives excluded, a trigger to change, and who you spoke to. Those five make a decision defensible.',
              answers: [
                { text: 'The observations and findings that informed the decision', correct: true, score: 5 },
                { text: 'Your clinical impression in plain words', correct: true, score: 5 },
                { text: 'The escalation you considered and why you did not take it', correct: true, score: 5 },
                { text: 'A specific trigger that would change the plan', correct: true, score: 5 },
                { text: 'The name, role and time of anyone you discussed it with', correct: true, score: 5 },
                { text: 'Reassurance that the patient looked well overall', score: 0 },
                { text: 'A note that the ward was short-staffed that night', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Look back at the last decision entry you wrote. Could a clinician who has never met the patient tell what you found, what you thought it meant, and what would make you change your mind? Rewrite it here as you would now.',
          size: 'large'
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'Copy-Forward and the Error That Travels',
      description: 'How one wrong phrase reached day six and caused anaphylaxis.',
      badgeIcon: '📄',
      themeId: 'sunrise',
      blocks: [
        { t: 'heading', text: 'Copying forward is efficient right up until it is not' },
        {
          t: 'para',
          html:
            'Copy-forward exists because ward round entries repeat. It saves real time. It also means an ' +
            'error entered once is re-asserted every day by clinicians who never checked it, each ' +
            'repetition making it look better established than the last.'
        },
        {
          t: 'timeline',
          preset: 'horizontal',
          events: [
            {
              label: 'Day 1 — the error enters',
              date: 'Admission',
              body: 'Ward round entry states “NKDA” (no known drug allergies), copied from a previous admission summary. The current allergy field correctly records penicillin allergy.'
            },
            {
              label: 'Days 2–3 — it is repeated',
              date: 'Copy-forward',
              body: 'Two different clinicians copy the previous day’s entry forward. Neither opens the allergy field. The phrase now appears in three consecutive entries.'
            },
            {
              label: 'Days 4–5 — it becomes established',
              date: 'Copy-forward',
              body: 'By now “NKDA” has appeared five times in the notes. A clinician meeting the patient for the first time reasonably reads this as a checked and confirmed fact.'
            },
            {
              label: 'Day 6 — co-amoxiclav prescribed',
              date: 'Harm',
              body: 'Prescribed for a chest infection on the strength of the documented NKDA. Anaphylaxis within 20 minutes. Managed successfully, but the patient required critical care admission.'
            }
          ]
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered all four copy-forward disciplines.',
          panels: [
            {
              title: 'Never copy forward safety-critical fields',
              body:
                'Allergies, resuscitation status, capacity and consent decisions, ceiling of care, weight for drug calculation, and infection precautions.\n\n' +
                'These must be checked at source every time you assert them. If you have not opened the allergy record today, do not write anything about allergies today.\n\n' +
                'This single rule would have prevented Inquest 3 entirely.'
            },
            {
              title: 'If you copy it, you own it',
              body:
                'Pressing copy makes every sentence in that entry <i>your</i> clinical assertion, made today, under your name.\n\n' +
                'You cannot later say “I copied that from the previous entry” — that is not a defence, it is an admission that you asserted something you had not verified.\n\n' +
                'Read every line you carry forward. If you would not write it fresh, delete it.'
            },
            {
              title: 'Date-stamp anything you did not re-verify',
              body:
                'Where history genuinely does not need re-checking daily, mark its provenance: “Social history as documented 12/03 — not re-taken today.”\n\n' +
                'This preserves the useful context without asserting it as a current finding. It also tells the reader exactly how fresh the information is.'
            },
            {
              title: 'Correcting a copied error you find',
              body:
                'Do not simply stop copying it — that leaves the error standing in five previous entries with no correction.\n\n' +
                'Write a clear correcting entry: “Note: previous entries from 04/03 record NKDA. This is incorrect — patient has documented penicillin allergy (see allergy record, confirmed with patient today). Entries 04/03–09/03 should be read subject to this correction.”\n\n' +
                'Then complete an incident report. The error reaching day six was not one person’s failure — it was five opportunities that each passed.'
            }
          ]
        },
        {
          t: 'conversation',
          template: 'teams',
          gate: true,
          cast: [
            {
              key: 'cons',
              name: 'Dr Bramwell (Consultant)',
              role: 'doctor',
              gender: 'male',
              age: 'senior',
              tone: 'light'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'Post-take ward round',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'cons',
                  text:
                    'Just carry yesterday’s entry forward and update the plan line — we have fourteen patients to get through before theatre.',
                  expression: 'neutral',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“I will copy it, but I want to check the allergy and DNACPR fields first.”',
                  to: 'checked',
                  feedback: 'Correct. Copying is fine; copying safety-critical assertions unchecked is not.'
                },
                {
                  label: 'Copy the whole entry forward and update the plan',
                  to: 'copied',
                  feedback: 'This is exactly the Day 2 decision in Inquest 3, made for entirely reasonable time pressure.'
                },
                {
                  label: 'Refuse to copy anything and write every entry from scratch',
                  to: 'scratch',
                  feedback: 'Safe, but it will not survive a fourteen-patient round and is not what the policy asks.'
                }
              ]
            },
            {
              key: 'checked',
              name: 'You check the fields',
              background: 'hospital',
              dialogue: [
                {
                  who: 'cons',
                  text:
                    'Hold on — it says NKDA in the entry but there is a penicillin allergy in the record. How long has that been wrong?',
                  expression: 'concerned',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: 'Write a correcting entry naming the affected dates, then raise an incident report',
                  to: 'end-good',
                  feedback: 'Correct on both counts — correct the record and report the system failure.'
                },
                {
                  label: 'Just fix today’s entry and move on',
                  to: 'end-partial',
                  feedback: 'Better than nothing, but five incorrect entries remain standing and uncorrected.'
                }
              ]
            },
            {
              key: 'scratch',
              name: 'Writing everything fresh',
              background: 'hospital',
              dialogue: [
                {
                  who: 'cons',
                  text: 'We are now forty minutes behind and I have a list starting. This is not sustainable.',
                  expression: 'concerned',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                { label: 'Adopt the middle position — copy, but verify the safety-critical fields', to: 'checked' }
              ]
            },
            {
              key: 'copied',
              name: 'The entry is carried forward',
              background: 'hospital',
              dialogue: [
                {
                  who: 'cons',
                  text: 'Good, that is bed 12 done. Next.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-bad' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — caught on day two',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Caught at the second repetition',
              outcomeDescription:
                'Thirty seconds of checking stopped an error that in Inquest 3 reached day six and caused anaphylaxis. The correcting entry means anyone reading days 1–2 now sees the correction, and the incident report triggered a change to the copy-forward template so allergy fields no longer carry over.',
              dialogue: [
                {
                  who: 'cons',
                  text:
                    'Well spotted. Put it through as an incident — I want the template changed so this cannot travel again.',
                  expression: 'confident',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-partial',
              name: 'Outcome — partly corrected',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Today is right; the history is still wrong',
              outcomeDescription:
                'Today’s entry is accurate, but five earlier entries still assert NKDA with nothing to flag them. Anyone reviewing the admission — including a coroner — reads five confident assertions and one silent change of position. Correcting the record means naming the affected dates.',
              dialogue: [
                {
                  who: 'cons',
                  text: 'And the previous five days? Those are still in the notes saying the opposite.',
                  expression: 'concerned',
                  gesture: 'questioning'
                }
              ]
            },
            {
              key: 'end-bad',
              name: 'Outcome — the error reaches day six',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Six entries, one allergy, one anaphylaxis',
              outcomeDescription:
                'Nobody opened the allergy field. Each clinician reasonably trusted the entry above theirs, and every repetition made it more credible. This is Inquest 3, and the finding was not against any one person — it was against a process that let an unverified assertion accumulate authority.',
              dialogue: [
                {
                  who: 'cons',
                  text:
                    'She has had co-amoxiclav and she is allergic. Get the arrest team and stop the infusion now.',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 5 ---
    {
      title: 'Writing for a Reader You Will Never Meet',
      description: 'The habits that make a record defensible, and what to commit to.',
      badgeIcon: '✅',
      blocks: [
        { t: 'heading', text: 'Assume it will be read aloud in a courtroom' },
        {
          t: 'para',
          html:
            'This is not defensive medicine. An entry that satisfies a coroner is the same entry that ' +
            'lets the night registrar understand your plan at 03:00. Writing for the stranger is simply ' +
            'writing well.'
        },
        {
          t: 'sequence',
          poolTitle: 'Structure of a defensible entry',
          prompt: 'Put the elements of a clinical entry into a logical order.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Date, time, your printed name and role',
            'Why you are seeing the patient now',
            'Findings — observations, examination, results',
            'Impression — what you think is happening',
            'Alternatives considered and why excluded',
            'Plan, with a specific trigger to escalate',
            'Who you discussed it with, named, with the time'
          ]
        },
        {
          t: 'quiz',
          kind: 'selectAll',
          poolTitle: 'Never copy these forward',
          pass: 100,
          gate: true,
          questions: [
            {
              prompt: 'Select every field that must be verified at source rather than copied forward.',
              feedback:
                'Anything that could directly cause harm if wrong must be checked today, every day you assert it.',
              answers: [
                { text: 'Drug allergies', correct: true, score: 5 },
                { text: 'Resuscitation status', correct: true, score: 5 },
                { text: 'Ceiling of care', correct: true, score: 5 },
                { text: 'Weight used for drug calculations', correct: true, score: 5 },
                { text: 'Infection precautions', correct: true, score: 5 },
                { text: 'Capacity and consent decisions', correct: true, score: 5 },
                { text: 'Past surgical history from 20 years ago', score: 0 },
                { text: 'The patient’s occupation', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'These are small habits with disproportionate consequences. Take them to your next governance meeting.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will write before I leave the ward, not before I leave the building', required: false },
            { text: 'I will head every late entry as retrospective and give a reason', required: false },
            { text: 'I will record my impression, not only my plan', required: false },
            { text: 'I will name what I considered and excluded', required: false },
            { text: 'I will give every plan a specific escalation trigger', required: false },
            { text: 'I will name the person I discussed it with, and the time', required: false },
            { text: 'I will check allergies and resus status at source before asserting them', required: false },
            { text: 'I will write a dated correcting entry if I find a copied error', required: false }
          ]
        },
        {
          t: 'quote',
          text:
            'The best clinical entry I have read in evidence was four lines long. It said what he found, what he thought, what would change his mind, and who he told. Nobody had a question for him.',
          by: 'Trust Legal Services, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
