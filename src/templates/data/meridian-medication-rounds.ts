// Meridian Health Systems — course 3 of 10.
// Driven by medication incident analysis: 61% of dispensing and administration
// errors occurred when the administering nurse was interrupted mid-round.
import type { CourseTemplate } from '../types'

export const meridianMedicationRounds: CourseTemplate = {
  id: 'meridian-health-medication-rounds',
  title: 'Do Not Interrupt: Protecting the Medication Round',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Analysis of 412 medication incidents found 61% occurred while the administering nurse was ' +
    'interrupted. Nurses are interrupted a mean of 9.4 times per round. No protected-round protocol ' +
    'is in use, and staff report that refusing an interruption feels rude or unsafe.',
  audience: 'Registered nurses, nursing associates and ward managers on adult inpatient wards',
  summary:
    'Interruption is the single largest controllable cause of medication error at Meridian. This ' +
    'course covers the evidence, the protected-round protocol, and — the hard part — how to decline ' +
    'an interruption without damaging a working relationship.',
  objectives: [
    'Explain how interruption produces specific, predictable classes of medication error',
    'Apply the Meridian protected-round protocol including the visual signal',
    'Decline a non-urgent interruption using a short, repeatable phrase',
    'Distinguish the four interruption types that must always be accepted'
  ],
  minutes: 26,
  themeId: 'plum',
  tags: ['medication safety', 'patient safety', 'human factors', 'clinical'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Knows the Evidence', icon: '🔬', kind: 'lesson', lesson: 1 },
      { label: 'Holds the Round', icon: '🚫', kind: 'lesson', lesson: 4 },
      { label: 'Medication Guardian', icon: '💊', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'Nine Interruptions Per Round',
      description: 'What our own incident data shows about where medication errors come from.',
      badgeIcon: '🔬',
      blocks: [
        { t: 'heading', text: 'The error is not carelessness. It is arithmetic.' },
        {
          t: 'para',
          html:
            'Our medication safety team reviewed <b>412 incidents</b> reported over 18 months. In ' +
            '<b>61%</b> the administering nurse recorded being interrupted between checking the ' +
            'prescription and completing administration.'
        },
        {
          t: 'para',
          html:
            'Separately, timed observation of 84 drug rounds found nurses were interrupted a mean of ' +
            '<b>9.4 times per round</b>. The published evidence is consistent and unforgiving: each ' +
            'interruption raises the risk of a procedural failure by roughly 12% and the risk of a ' +
            'clinical error by about 13%.'
        },
        {
          t: 'chart',
          title: 'Source of interruptions during observed drug rounds (%)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Other nursing staff', value: 34, accent: '#7b2d8b' },
            { label: 'Medical staff', value: 19, accent: '#7b2d8b' },
            { label: 'Patients and relatives', value: 17, accent: '#c86dd7' },
            { label: 'Telephone / bleep', value: 14, accent: '#c86dd7' },
            { label: 'Ward clerk / admin', value: 9, accent: '#c86dd7' },
            { label: 'Alarms not related to round', value: 7, accent: '#c86dd7' }
          ]
        },
        {
          t: 'para',
          html:
            'Note where the largest share comes from: <b>us</b>. Just over half of all interruptions come ' +
            'from other clinical staff, and almost none of those are emergencies. This is a problem we ' +
            'create for each other and can therefore fix ourselves.'
        },
        {
          t: 'comparison',
          title: 'What interruption actually does to the task',
          preset: 'currentFuture',
          layout: 'horizontal',
          columns: [
            {
              title: 'What people assume',
              accent: '#8a5a3a',
              rows: [
                'You pause, deal with it, and pick up where you left off',
                'A brief interruption costs a few seconds',
                'Experienced nurses are less affected',
                'Errors come from not knowing the drug',
                'Concentration is a matter of personal discipline'
              ]
            },
            {
              title: 'What the evidence shows',
              accent: '#2b7a3f',
              rows: [
                'You resume at the wrong step, or skip one entirely',
                'Recovering the task takes far longer than the interruption',
                'Experience does not protect against prospective memory failure',
                'Most errors involve familiar drugs administered wrongly',
                'Working memory has a hard capacity limit; discipline cannot raise it'
              ]
            }
          ]
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have reviewed all four failure modes. Each one maps to a real incident from our own reports.',
          panels: [
            {
              title: 'Omission — the step that never happened',
              body:
                'The commonest consequence. You are interrupted between drawing up and administering, and when you resume you believe you have already given the dose.\n\n' +
                '<b>Our incident 2024-0118:</b> a patient received no anticoagulant for two consecutive rounds. The nurse was interrupted by a colleague asking about a discharge letter, signed the chart on returning, and did not administer. The signature is what makes this invisible — the chart said it was given.'
            },
            {
              title: 'Duplication — the dose given twice',
              body:
                'The mirror image. You are interrupted after administering but before signing, return, cannot recall whether you signed, and give it again.\n\n' +
                '<b>Our incident 2024-0263:</b> a patient received a double dose of modified-release morphine after the nurse was called to a falls alarm mid-round. Required naloxone and an unplanned critical care review.'
            },
            {
              title: 'Wrong patient — the identity check that got skipped',
              body:
                'Identity checking is a prospective memory task: you intend to do it, then act before you do. Interruption is the classic trigger.\n\n' +
                '<b>Our incident 2024-0341:</b> insulin given to the patient in the next bed after the nurse was stopped to answer a phone call between the trolley and the bedside. Both patients were on insulin; the doses differed by 14 units.'
            },
            {
              title: 'Wrong rate or wrong route',
              body:
                'Calculation and setup errors cluster around interruption because both require holding intermediate values in working memory.\n\n' +
                '<b>Our incident 2024-0087:</b> an infusion programmed at ten times the intended rate after the nurse was interrupted twice while setting the pump. Detected by the patient’s daughter, not by staff.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Why interruption matters',
          gate: true,
          questions: [
            {
              prompt:
                'Why does an interruption of a few seconds produce an error out of proportion to its length?',
              feedback:
                'The cost is not the pause. It is losing your place in a sequence held in working memory, then resuming at the wrong point.',
              answers: [
                {
                  text: 'It displaces the step you were on from working memory, so you resume at the wrong point',
                  correct: true,
                  feedback: 'Exactly — and the resumption error is silent, because you believe you completed the step.'
                },
                {
                  text: 'It makes nurses hurry to catch up, causing carelessness',
                  feedback: 'Hurrying contributes, but the dominant mechanism is prospective memory failure, not haste.'
                },
                {
                  text: 'It usually means the drug chart is put down and mixed up',
                  feedback: 'Physical mix-ups occur but account for a small minority of interruption-related errors.'
                },
                {
                  text: 'It causes nurses to forget the pharmacology of the drug',
                  feedback: 'Knowledge is rarely the issue — most errors involve drugs the nurse knows very well.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'The Protected Round',
      description: 'The Meridian protocol: what it is, what it is not, and who it binds.',
      badgeIcon: '🦺',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'A visible signal, and a ward-wide agreement' },
        {
          t: 'para',
          html:
            'A protected round means the administering nurse wears the red tabard, and everyone on the ' +
            'ward — including medical staff, allied health, ward clerks and visitors — treats that as ' +
            '"do not interrupt unless it is one of the four exceptions".'
        },
        {
          t: 'para',
          html:
            'The tabard is not there to protect the nurse. It is there so that <b>the person considering ' +
            'the interruption</b> makes a decision before speaking. Most interruptions are not decisions ' +
            'at all — they are reflexes, and a visual signal converts a reflex into a choice.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'Before the round',
              body:
                'Put the tabard on <i>before</i> you open the trolley, not after the first interruption.\n\n' +
                'Hand your bleep to the nurse in charge or a named colleague. This is the step most often skipped and it removes 14% of interruptions on its own.\n\n' +
                'Tell the nurse in charge you are starting. Check the trolley has what you need for the whole bay — returning for a missing item is itself an interruption you inflict on yourself.'
            },
            {
              title: 'During the round',
              body:
                'Complete one patient fully — check, administer, sign — before moving. Do not batch-check several patients and administer afterwards; batching is where duplication and wrong-patient errors originate.\n\n' +
                'If you are interrupted despite the tabard, do not resume from memory. Go back to the prescription chart and re-check the current drug from the beginning. Losing 20 seconds is the correct price.'
            },
            {
              title: 'The four exceptions',
              body:
                'You must always be interrupted for:\n\n' +
                '<b>1.</b> A deteriorating or arresting patient.\n' +
                '<b>2.</b> A drug error that has just occurred and needs immediate action.\n' +
                '<b>3.</b> A time-critical medication for another patient — Parkinson’s medication, insulin with a meal, thrombolysis window.\n' +
                '<b>4.</b> A safeguarding or immediate physical safety concern.\n\n' +
                'Everything else waits. Discharge letters, TTOs, bed managers, phone calls, relatives with questions, and the ward round all wait.'
            },
            {
              title: 'What it is not',
              body:
                'It is not a request for silence on the ward, and it does not mean the nurse cannot be spoken to at all.\n\n' +
                'It is not a licence to ignore a patient in genuine distress in front of you.\n\n' +
                'It is not one nurse’s personal preference — it is a ward agreement, which is why it fails when only some staff honour it. A tabard that half the ward ignores is worse than no tabard, because it teaches the wearer that the protocol does not work.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Protected round setup',
          prompt: 'Put the protected-round preparation steps into the correct order.',
          pass: 100,
          attempts: 3,
          gate: true,
          items: [
            'Tell the nurse in charge you are starting the round',
            'Hand your bleep and ward phone to a named colleague',
            'Check the trolley is stocked for the whole bay',
            'Put on the red tabard',
            'Open the trolley and begin with the first patient',
            'Complete check, administer and sign for one patient before moving on'
          ]
        },
        {
          t: 'quiz',
          kind: 'selectAll',
          poolTitle: 'The four exceptions',
          pass: 100,
          gate: true,
          questions: [
            {
              prompt: 'Select every situation that justifies interrupting a protected round.',
              feedback:
                'Only immediate clinical danger and time-critical medication override the round. Administrative urgency never does.',
              answers: [
                { text: 'A patient in the next bay has become unresponsive', correct: true, score: 5 },
                { text: 'A colleague has just given a drug to the wrong patient', correct: true, score: 5 },
                { text: 'A Parkinson’s patient’s levodopa is due now and will be missed', correct: true, score: 5 },
                { text: 'A visitor is behaving in a way that threatens a patient’s safety', correct: true, score: 5 },
                { text: 'The bed manager needs a discharge decision urgently', score: 0 },
                { text: 'A consultant wants to discuss a patient on the ward round', score: 0 },
                { text: 'Pharmacy is on the phone about a supply query', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'Checking That Survives Distraction',
      description: 'Building the round so that an interruption cannot hide inside it.',
      badgeIcon: '🔎',
      blocks: [
        { t: 'heading', text: 'Design the task so errors cannot stay invisible' },
        {
          t: 'para',
          html:
            'You will still be interrupted sometimes. The second line of defence is a checking routine ' +
            'built so that a lost place is <i>obvious</i> rather than silent.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Rule 1',
              heading: 'One patient, start to finish',
              body:
                'Never hold two patients’ medications in your hands or on the tray at once. Never sign for one patient while standing at another’s bed.\n\n' +
                'This single rule eliminates the entire wrong-patient error class, because there is never a second patient’s drug available to give.'
            },
            {
              caption: 'Rule 2',
              heading: 'Sign immediately after administering, never before',
              body:
                'Signing before administering is what makes omission invisible — the chart records a dose that never reached the patient, and no subsequent check can detect it.\n\n' +
                'If you are interrupted between administering and signing, return to the patient and confirm before you sign. Ask them, look at the pot, check the sharps bin.'
            },
            {
              caption: 'Rule 3',
              heading: 'Say the five rights out loud',
              body:
                'Right patient, right drug, right dose, right route, right time. Spoken aloud, even quietly.\n\n' +
                'Verbalising converts a silent internal check into an external action you can remember performing. It is also the single most effective way to notice that you have <i>not</i> done it — the silence is conspicuous.'
            },
            {
              caption: 'Rule 4',
              heading: 'Re-check from the chart after any interruption',
              body:
                'Do not resume from memory. Return to the prescription chart, find the current drug, and restart the check for that drug.\n\n' +
                'The instinct to “just carry on” is exactly the instinct that produced 61% of our incidents.'
            },
            {
              caption: 'Rule 5',
              heading: 'Two-person check for the high-risk list',
              body:
                'Insulin, anticoagulants, opioids, chemotherapy, potassium, and any infusion requiring a calculated rate.\n\n' +
                'A second checker is only a control if they check independently. “Is this 14 units?” invites agreement. “What dose do you make it?” requires an answer.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Recovering from an interruption',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You have drawn up an insulin dose and are walking to the bedside when a colleague stops you about a discharge. You deal with it in 30 seconds. What do you do next?',
              answers: [
                {
                  text: 'Return to the chart and re-check the prescription and dose from the beginning',
                  correct: true,
                  feedback:
                    'Correct. Insulin is on the high-risk list and you cannot rely on memory for the dose after any interruption.'
                },
                {
                  text: 'Continue to the bedside — you remember the dose clearly',
                  feedback:
                    'Confidence in the recalled dose is exactly what incident 2024-0341 involved. Recall after interruption is unreliable and feels reliable.'
                },
                {
                  text: 'Administer it and re-check the chart afterwards',
                  feedback: 'A check after administration is not a check. The dose is already in the patient.'
                },
                {
                  text: 'Ask the colleague to confirm the dose you remember',
                  feedback: 'They have no independent knowledge of the prescription. This is confirmation, not checking.'
                }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Before you administer to each patient, confirm:',
          done: 'That is the full check. Doing it aloud makes it real.',
          mode: 'allRequired',
          items: [
            { text: 'Right patient — identity confirmed against the wristband, not the bed' },
            { text: 'Right drug — read from the chart, not from memory of the round' },
            { text: 'Right dose — calculated fresh if the drug is on the high-risk list' },
            { text: 'Right route — confirmed on the prescription' },
            { text: 'Right time — including whether a previous dose was actually given' },
            { text: 'Allergies checked for this patient on this occasion' },
            { text: 'I will sign only after the drug has been taken' }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'Saying No Without Being Rude',
      description: 'The phrase that declines an interruption and keeps the relationship intact.',
      badgeIcon: '🚫',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'The tabard only works if you are willing to use it' },
        {
          t: 'para',
          html:
            'In our pilot on Ward 6, tabards were worn on 88% of rounds but interruptions fell by only 19%. ' +
            'When we asked why, the answer was consistent: nurses wore the tabard and then answered anyway, ' +
            'because declining felt rude — particularly to doctors and to patients’ relatives.'
        },
        {
          t: 'para',
          html:
            'A refusal that works has three parts: <b>acknowledge</b>, <b>defer with a time</b>, and ' +
            '<b>return to the task</b>. It takes about four seconds and does not require you to explain ' +
            'the evidence base.'
        },
        {
          t: 'comparison',
          title: 'Two ways to decline',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'What does not work',
              accent: '#b3543f',
              rows: [
                '“Sorry, I am not supposed to talk during meds.” — apologetic, cites a rule, invites negotiation',
                '“Can you ask someone else?” — passes the problem without a time',
                'Silence and a pointed look at the tabard — reads as rude and often gets ignored',
                '“Two minutes” and then answering fully anyway',
                'Explaining the interruption evidence at the bedside'
              ]
            },
            {
              title: 'What works',
              accent: '#2b7a3f',
              rows: [
                '“I am on meds — I will find you in ten minutes.” — states the fact and commits to a time',
                '“Is it one of the four? If not, ten minutes.” — with colleagues who know the protocol',
                '“I will be with you as soon as I have finished this round.” — for relatives',
                'Actually finding them in ten minutes, so the deferral is trusted next time',
                'Saying it the same way every time, so it stops being a negotiation'
              ]
            }
          ]
        },
        {
          t: 'conversation',
          template: 'corporateChat',
          gate: true,
          cast: [
            {
              key: 'doc',
              name: 'Dr Whitfield (Consultant)',
              role: 'doctor',
              gender: 'female',
              age: 'senior',
              tone: 'light'
            },
            {
              key: 'rel',
              name: 'Mr Okonjo (patient’s son)',
              role: 'customer',
              gender: 'male',
              age: 'adult',
              tone: 'deep'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'Mid-round, bay 2',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'doc',
                  text:
                    'Quick one — can you tell me whether bed 9 had her potassium result back? I want to write up the discharge before I go to clinic.',
                  expression: 'neutral',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: '“I am on meds — I will find you in ten minutes.”',
                  to: 'deferred',
                  feedback: 'Fact plus a committed time. No apology, no rule-citing, no negotiation offered.'
                },
                {
                  label: 'Answer it — it will take five seconds and she is a consultant',
                  to: 'answered',
                  feedback: 'This is the 19% problem. The tabard is worn and then overridden.'
                },
                {
                  label: '“Sorry, I am really not meant to be interrupted during medications.”',
                  to: 'apologetic',
                  feedback: 'Apologising and citing a rule invites the other person to weigh their need against the rule.'
                }
              ]
            },
            {
              key: 'deferred',
              name: 'She accepts immediately',
              background: 'hospital',
              dialogue: [
                {
                  who: 'doc',
                  text: 'Of course — sorry, did not clock the tabard. Come and find me in the office.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'A relative approaches next', to: 'relative' }]
            },
            {
              key: 'apologetic',
              name: 'It becomes a negotiation',
              background: 'hospital',
              dialogue: [
                {
                  who: 'doc',
                  text:
                    'It really is just a yes or no. I am late for clinic and it holds up her discharge.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“Ten minutes and I will have it for you.” Hold the line.',
                  to: 'relative',
                  feedback: 'Good recovery. Repeating the time without apologising ends the negotiation.'
                },
                { label: 'Give in and answer', to: 'answered' }
              ]
            },
            {
              key: 'relative',
              name: 'A relative at bed 7',
              background: 'hospital',
              dialogue: [
                {
                  who: 'rel',
                  text:
                    'Excuse me — nobody has told us anything today. Can you tell me what the plan is for my mother?',
                  expression: 'concerned',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: '“I will be with you as soon as I finish this round — about fifteen minutes.”',
                  to: 'end-good',
                  feedback:
                    'Warm, specific and deferrable. Relatives almost always accept a time; what they cannot accept is being ignored.'
                },
                {
                  label: 'Stop the round and have the conversation now',
                  to: 'end-poor',
                  feedback:
                    'Compassionate, and it is how incident 2024-0263 happened. The conversation is important and it is not one of the four exceptions.'
                }
              ]
            },
            {
              key: 'answered',
              name: 'The round is broken',
              background: 'hospital',
              dialogue: [
                {
                  who: 'doc',
                  text: 'Brilliant, thanks. That is the discharge sorted.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'Return to the trolley', to: 'end-poor' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — round held',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Two interruptions declined, both relationships intact',
              outcomeDescription:
                'Neither person was offended, because both were given a specific time and you kept it. The consultant got her result at eleven minutes; the son got fifteen minutes of proper attention rather than a distracted thirty seconds. The round finished without a break.',
              dialogue: [
                {
                  who: 'rel',
                  text: 'Thank you for coming back. That is the first proper explanation we have had.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — the thread was lost',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Bed 7 received her lunchtime dose twice',
              outcomeDescription:
                'The round was broken twice. On returning, the modified-release dose was administered again because the chart had not yet been signed. This is incident 2024-0263, almost exactly. Nobody was careless — the task was simply resumed from memory after a reasonable human moment.',
              dialogue: [
                {
                  who: 'doc',
                  text: 'She has had two doses? Right — get naloxone drawn up and I will bleep critical care.',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Who on your ward would you find hardest to decline mid-round, and why? Write the exact sentence you would use with that person. Practising the words is what makes them available under pressure.',
          size: 'large'
        }
      ]
    },
    // ---------------------------------------------------------------- 5 ---
    {
      title: 'Making It a Ward Habit',
      description: 'Why this fails when only some people do it, and what to commit to.',
      badgeIcon: '💊',
      blocks: [
        { t: 'heading', text: 'This one genuinely does not work alone' },
        {
          t: 'para',
          html:
            'Most of what we ask of individual clinicians works even if only you do it. This does not. ' +
            'A protected round depends on the people <i>around</i> the nurse honouring it — which means ' +
            'the most important behaviour in this course is what you do when <b>someone else</b> is ' +
            'wearing the tabard.'
        },
        {
          t: 'timeline',
          preset: 'horizontal',
          events: [
            {
              label: 'Ward 6 — pilot start',
              date: 'Month 0',
              body: 'Baseline 9.4 interruptions per round, 11 medication incidents in the preceding six months.'
            },
            {
              label: 'Tabards introduced',
              date: 'Month 1',
              body: 'Worn on 88% of rounds. Interruptions fell only to 7.6 — nurses wore them and answered anyway.'
            },
            {
              label: 'Script practised at handover',
              date: 'Month 2',
              body: '“I am on meds — I will find you in ten minutes.” Rehearsed aloud in team briefs for two weeks. Interruptions fell to 4.1.'
            },
            {
              label: 'Medical staff briefed at their own meeting',
              date: 'Month 3',
              body: 'Consultants and registrars asked to hold non-urgent queries. Interruptions from medical staff dropped from 19% to 6% of the total.'
            },
            {
              label: 'Six-month review',
              date: 'Month 6',
              body: '2.3 interruptions per round. Two medication incidents in six months, neither involving interruption. No additional staffing was used.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Final check',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'Ward 6 halved interruptions only after month 2. What made the difference? Select all that apply.',
              feedback:
                'The tabard alone changed almost nothing. Rehearsing the refusal and briefing the interrupters is what moved the numbers.',
              answers: [
                { text: 'Staff rehearsed the exact refusal phrase out loud', correct: true, score: 5 },
                { text: 'Medical staff were briefed in their own forum', correct: true, score: 5 },
                { text: 'The deferral came with a specific time that was then kept', correct: true, score: 5 },
                { text: 'Extra staff were added to the round', score: 0 },
                { text: 'Tabards were made more visible', score: 0 }
              ]
            },
            {
              prompt: 'You need to ask a colleague something and she is wearing the tabard. What do you do?',
              feedback:
                'Check it against the four exceptions. If it is not one of them, it waits — and you say so, so she does not have to decline you.',
              answers: [
                {
                  text: 'Check whether it is one of the four exceptions before speaking',
                  correct: true,
                  score: 5
                },
                {
                  text: 'Wait and catch her at the end of the round',
                  correct: true,
                  score: 5
                },
                {
                  text: 'Say “not urgent — find me after your round” and walk away',
                  correct: true,
                  score: 5
                },
                { text: 'Ask quickly since it will only take a moment', score: 0 },
                { text: 'Ask if it is important to you and your task is time-pressured', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take these to your next team brief. The behaviours that protect other people’s rounds matter more than the ones that protect your own.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will put the tabard on before I open the trolley, every round', required: false },
            { text: 'I will hand over my bleep before starting', required: false },
            { text: 'I will use the same refusal phrase every time, without apologising', required: false },
            { text: 'I will give a specific time when I defer, and I will keep it', required: false },
            { text: 'I will complete one patient fully before moving to the next', required: false },
            { text: 'I will re-check from the chart after any interruption', required: false },
            { text: 'I will not interrupt a colleague in a tabard unless it is one of the four', required: false },
            { text: 'I will say “not urgent — find me after” so they do not have to decline me', required: false }
          ]
        },
        {
          t: 'quote',
          text:
            'We spent years telling nurses to concentrate harder. It turned out the fix was telling everyone else to wait ten minutes.',
          by: 'Lead Pharmacist, Medication Safety, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
