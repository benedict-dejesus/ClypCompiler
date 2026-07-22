// Meridian Health Systems — course 2 of 10.
// Driven by the 2024 deterioration audit: NEWS2 recorded reliably, escalation
// delayed a median 47 minutes, with the delay concentrated overnight.
import type { CourseTemplate } from '../types'

export const meridianDeterioratingPatient: CourseTemplate = {
  id: 'meridian-health-deteriorating-patient',
  title: 'The 47-Minute Gap: Escalating a Deteriorating Patient',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'NEWS2 is scored correctly in 94% of observation sets, but the median time from a score of 5 or ' +
    'above to a competent clinical review is 47 minutes against a 30-minute standard. The delay is ' +
    'concentrated between 22:00 and 06:00 and is driven by hesitation to call, not by failure to measure.',
  audience: 'Registered nurses, healthcare assistants, nursing associates and foundation doctors on adult inpatient wards',
  summary:
    'The observations are being done. The call is not being made. This course targets the decision ' +
    'point between a score and a phone call — including what to do when the person you call is dismissive.',
  objectives: [
    'Calculate a NEWS2 score correctly, including the oxygen and consciousness parameters most often missed',
    'Apply the Meridian escalation thresholds without seeking permission to escalate',
    'Deliver a structured SBAR handover in under 60 seconds',
    'Persist through a dismissive response using the graded assertiveness ladder'
  ],
  minutes: 30,
  themeId: 'clyp',
  tags: ['patient safety', 'deterioration', 'NEWS2', 'clinical', 'escalation'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Scores It Right', icon: '📈', kind: 'lesson', lesson: 2 },
      { label: 'Makes the Call', icon: '📞', kind: 'lesson', lesson: 4 },
      { label: 'Deterioration Champion', icon: '🚑', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'Forty-Seven Minutes',
      description: 'Where the delay actually sits, and what happens inside it.',
      badgeIcon: '⏱',
      blocks: [
        { t: 'heading', text: 'We are measuring well and acting slowly' },
        {
          t: 'para',
          html:
            'The 2024 deterioration audit reviewed <b>1,206 episodes</b> where a patient scored NEWS2 5 or ' +
            'above. Observations were taken on time in 91% of cases and scored correctly in 94%. ' +
            'By every measurement standard, we are doing well.'
        },
        {
          t: 'para',
          html:
            'The median time from that score being recorded to a competent clinician laying hands on the ' +
            'patient was <b>47 minutes</b>. Our standard is 30. Overnight, the median was <b>68 minutes</b>.'
        },
        {
          t: 'chart',
          title: 'Median minutes from NEWS2 ≥5 to clinical review, by time of day',
          chartType: 'line',
          showValues: true,
          points: [
            { label: '08:00–12:00', value: 31, accent: '#2b7a3f' },
            { label: '12:00–16:00', value: 34, accent: '#2b7a3f' },
            { label: '16:00–20:00', value: 42, accent: '#b7791f' },
            { label: '20:00–00:00', value: 58, accent: '#b3543f' },
            { label: '00:00–04:00', value: 71, accent: '#b3543f' },
            { label: '04:00–08:00', value: 64, accent: '#b3543f' }
          ]
        },
        {
          t: 'para',
          html:
            'Deterioration does not keep office hours. The physiology is identical at 03:00 — what changes ' +
            'is how willing we are to wake somebody up.'
        },
        {
          t: 'timeline',
          preset: 'vertical',
          events: [
            {
              label: 'Observations recorded — NEWS2 6',
              date: '02:14',
              body: 'Respiratory rate 24, sats 93% on air, BP 98 systolic, pulse 112, temperature 38.4, alert. Scored correctly and documented on the chart.'
            },
            {
              label: 'Nurse decides to repeat in half an hour',
              date: '02:16',
              body: '“He looks alright in himself. I will see if it settles before I wake the reg — she has been called three times already tonight.” This is the decision point. Everything after it is consequence.'
            },
            {
              label: 'Repeat observations — NEWS2 7',
              date: '02:49',
              body: 'Respiratory rate now 26, sats 91% on air. Still alert. The trend is now unmistakable but 35 minutes have gone.'
            },
            {
              label: 'Registrar called',
              date: '02:53',
              body: 'Answered promptly, attended within nine minutes. No reluctance, no criticism — the call that was feared did not go the way it was imagined.'
            },
            {
              label: 'Sepsis Six commenced',
              date: '03:11',
              body: 'Fifty-seven minutes after the first score of 6. Antibiotics given at 03:24 — 70 minutes after the first trigger.'
            },
            {
              label: 'Escalated to critical care',
              date: '05:40',
              body: 'Required vasopressor support and a four-day ICU stay. The clinical review concluded the ICU admission was probably avoidable had antibiotics been given inside the first hour.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Where the harm happened',
          gate: true,
          questions: [
            {
              prompt:
                'In that timeline, which single action would have made the largest difference to the outcome?',
              feedback:
                'The observations, the scoring and the eventual treatment were all correct. Only the 35-minute pause was avoidable.',
              answers: [
                {
                  text: 'Calling at 02:16 rather than repeating observations first',
                  correct: true,
                  feedback:
                    'Yes. Everything downstream was competent — the entire loss was in the decision to wait and see.'
                },
                {
                  text: 'Taking the observations more frequently before 02:14',
                  feedback: 'Observations were on schedule and the first triggering score was captured correctly.'
                },
                {
                  text: 'Scoring the NEWS2 more accurately',
                  feedback: 'The score of 6 was calculated correctly at 02:14.'
                },
                {
                  text: 'Escalating to critical care sooner at 05:40',
                  feedback: 'By 05:40 the deterioration was established. The opportunity was three hours earlier.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'Scoring It Right, Including the Bits We Miss',
      description: 'The two NEWS2 parameters our audit found scored wrongly most often.',
      badgeIcon: '📈',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'Seven parameters, two persistent errors' },
        {
          t: 'para',
          html:
            'NEWS2 aggregates seven physiological parameters. Our audit found scoring errors in 6% of sets, ' +
            'and almost all of them sat in two places: <b>supplemental oxygen</b> and <b>level of ' +
            'consciousness</b>. Both errors push the score <i>down</i>, which means the patients affected ' +
            'are the ones least likely to be escalated.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have worked through all seven parameters and both common errors.',
          panels: [
            {
              title: 'Respiratory rate — the most predictive, the least carefully counted',
              body:
                'Respiratory rate is the single strongest predictor of deterioration in the NEWS2 set, and it is the parameter most often estimated rather than counted.\n\n' +
                'Count for a full 60 seconds. Counting for 15 and multiplying by four turns a rate of 21 into 20 or 24 — the difference between scoring 0 and scoring 2.\n\n' +
                'Scoring: ≤8 scores 3; 9–11 scores 1; 12–20 scores 0; 21–24 scores 2; ≥25 scores 3.'
            },
            {
              title: 'Oxygen saturation — and which scale to use',
              body:
                'NEWS2 has two saturation scales. <b>Scale 1</b> is the default for everyone. <b>Scale 2</b> is used only for patients with confirmed hypercapnic respiratory failure who have a prescribed target range of 88–92%, and it must be prescribed by a clinician — you do not choose it yourself.\n\n' +
                'Using Scale 2 on a patient who should be on Scale 1 systematically under-scores them. If there is no documented prescription for Scale 2, use Scale 1.'
            },
            {
              title: 'Supplemental oxygen — our most common error',
              body:
                '<b>Any</b> supplemental oxygen scores 2. Not “high flow oxygen”. Not “more than 2 litres”. Any.\n\n' +
                'Our audit found nasal cannulae at 1–2 litres routinely recorded as “air” because it felt trivial. A patient on 1 litre with saturations of 96% is not the same as a patient on air with saturations of 96%, and NEWS2 exists precisely to capture that difference.\n\n' +
                'This single error removed 2 points from scores in 4% of all observation sets audited.'
            },
            {
              title: 'Systolic blood pressure',
              body:
                'Scoring: ≤90 scores 3; 91–100 scores 2; 101–110 scores 1; 111–219 scores 0; ≥220 scores 3.\n\n' +
                'Note the asymmetry — NEWS2 is far more sensitive to low pressure than high, because hypotension is the more immediate threat. A systolic of 95 alone is worth 2 points.'
            },
            {
              title: 'Pulse',
              body:
                'Scoring: ≤40 scores 3; 41–50 scores 1; 51–90 scores 0; 91–110 scores 1; 111–130 scores 2; ≥131 scores 3.\n\n' +
                'A rising pulse in a patient who was previously 70 is meaningful even while it remains inside a scoring band. The score is a floor, not a ceiling — trend matters and is not captured by the number.'
            },
            {
              title: 'Consciousness — the second common error',
              body:
                'NEWS2 uses <b>ACVPU</b>, not AVPU. The added <b>C</b> is <i>new confusion</i>, and it scores 3 on its own.\n\n' +
                'Our audit found new confusion recorded in the nursing notes as “a bit muddled tonight” while the observation chart recorded “Alert”. That is a 3-point error, and in an older patient new confusion is frequently the <i>first</i> sign of sepsis — often preceding any change in temperature or blood pressure.\n\n' +
                'If the patient is not as orientated as they were on the previous set, they are C. Not A.'
            },
            {
              title: 'Temperature',
              body:
                'Scoring: ≤35.0 scores 3; 35.1–36.0 scores 1; 36.1–38.0 scores 0; 38.1–39.0 scores 1; ≥39.1 scores 2.\n\n' +
                'A low temperature scores higher than a moderate fever. Hypothermia in an unwell adult is an ominous sign and is regularly under-weighted by clinicians who are watching for pyrexia.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Score this patient',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'Respiratory rate 22. Saturations 95% on 2 litres via nasal cannulae (Scale 1). Systolic BP 104. Pulse 96. Temperature 36.4. The patient is orientated but the night staff note she is “not quite herself” and did not know where she was on waking. What is the NEWS2 score?',
              answers: [
                {
                  text: '9',
                  correct: true,
                  feedback:
                    'Correct. RR 22 = 2, sats 95% Scale 1 = 0, any oxygen = 2, systolic 104 = 1, pulse 96 = 1, temp 36.4 = 0, new confusion = 3. Total 9 — an emergency response.'
                },
                {
                  text: '4',
                  feedback:
                    'This misses both common errors: the 2 points for supplemental oxygen and the 3 points for new confusion.'
                },
                {
                  text: '6',
                  feedback: 'Close, but new confusion scores 3 under ACVPU and must not be recorded as Alert.'
                },
                {
                  text: '7',
                  feedback:
                    'This drops the 2 points for supplemental oxygen. Any oxygen scores 2, however low the flow rate.'
                }
              ]
            }
          ]
        },
        {
          t: 'comparison',
          title: 'What our two common errors cost',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'Recorded as',
              accent: '#b3543f',
              rows: [
                '“Air” — because it was only 1–2 litres',
                '“Alert” — because she was awake and talking',
                'Total score 4',
                'Action: repeat in 4 hours, routine',
                'No clinician review triggered'
              ]
            },
            {
              title: 'Actually',
              accent: '#2b7a3f',
              rows: [
                'Supplemental oxygen — scores 2 at any flow rate',
                'New confusion — scores 3 under ACVPU',
                'Total score 9',
                'Action: immediate emergency response',
                'Continuous monitoring and urgent senior review'
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'Thresholds, and Who You Do Not Need To Ask',
      description: 'What each score requires, and the permission you already have.',
      badgeIcon: '🚦',
      blocks: [
        { t: 'heading', text: 'The threshold is the instruction' },
        {
          t: 'para',
          html:
            'A NEWS2 threshold is not a suggestion to consider escalation. It is the escalation. You do ' +
            'not need to ask the nurse in charge for permission, and you do not need to justify the call ' +
            'before you make it.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'Score 0–4',
              body:
                '<b>Minimum 12-hourly observations.</b> Registered nurse assesses whether more frequent monitoring is needed.\n\n' +
                'A score of 4 is not benign, particularly if it is a rise from 0. Trend is not captured by the threshold — a patient moving 0 → 2 → 4 across three sets warrants a conversation even though no single threshold has been crossed.'
            },
            {
              title: 'Score 3 in any single parameter',
              body:
                '<b>Minimum hourly observations, and inform the registered nurse.</b>\n\n' +
                'This catches the patient whose total looks reassuring but who has one profoundly abnormal value — a respiratory rate of 26 with everything else normal totals only 3, but that respiratory rate alone is a red flag.\n\n' +
                'Single-parameter red scores are missed more often than aggregate scores because the total does not look alarming.'
            },
            {
              title: 'Score 5–6',
              body:
                '<b>Urgent review by a clinician competent in acute illness, within 30 minutes.</b> Minimum hourly observations. Consider escalation to critical care outreach.\n\n' +
                'This is the band where our 47-minute median sits. This is the band this course exists for.'
            },
            {
              title: 'Score 7 or above',
              body:
                '<b>Emergency response. Immediate registrar or consultant review and critical care outreach.</b> Continuous monitoring. Consider transfer to a higher level of care.\n\n' +
                'This is a 2222-equivalent situation in terms of urgency. Do not batch it with other jobs, do not wait for the next set, do not walk to find someone — call.'
            }
          ]
        },
        {
          t: 'para',
          html:
            'Meridian policy is explicit on three points, and all three exist because staff have told us ' +
            'they were unsure: <b>any</b> staff member may escalate directly; <b>no one</b> requires ' +
            'permission from the nurse in charge to make a call; and <b>concern alone</b> is a valid ' +
            'reason to escalate even when the score is below threshold.'
        },
        {
          t: 'quote',
          text:
            'If you are worried enough to be wondering whether to call, you have already met the threshold for calling. That feeling is a clinical observation and it is allowed in the SBAR.',
          by: 'Director of Nursing, Meridian Health Systems',
          pull: true
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Escalation rules',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'Which of these require escalation under Meridian policy? Select all that apply.',
              feedback:
                'Single red parameters, aggregate thresholds and clinical concern below threshold all trigger action.',
              answers: [
                { text: 'NEWS2 total of 5 on a medical ward at 03:00', correct: true, score: 5 },
                { text: 'Respiratory rate 26 with all other parameters normal (total 3)', correct: true, score: 5 },
                { text: 'NEWS2 total of 3 but you are worried and cannot say why', correct: true, score: 5 },
                { text: 'New confusion in a previously orientated patient', correct: true, score: 5 },
                { text: 'NEWS2 total of 2, stable across three sets, patient comfortable', score: 0 }
              ]
            },
            {
              prompt: 'Who may escalate a deteriorating patient directly at Meridian?',
              feedback: 'Anyone. Requiring permission is what builds the delay this course exists to remove.',
              answers: [
                { text: 'Any registered nurse', correct: true, score: 5 },
                { text: 'Any healthcare assistant or nursing associate', correct: true, score: 5 },
                { text: 'Any student on placement, via their supervisor or directly if urgent', correct: true, score: 5 },
                { text: 'Only the nurse in charge of the shift', score: 0 },
                { text: 'Only staff who have completed advanced life support training', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'Making the Call at Three in the Morning',
      description: 'SBAR in sixty seconds, and what to do when you are brushed off.',
      badgeIcon: '📞',
      themeId: 'midnight',
      blocks: [
        { t: 'heading', text: 'The call you are dreading takes fifty seconds' },
        {
          t: 'para',
          html:
            'In our staff survey, the three most common reasons given for delaying an overnight call were: ' +
            '“they were already busy” (48%), “I was not sure it was serious enough” (41%), and “I did not ' +
            'want to be told off for calling” (29%).'
        },
        {
          t: 'para',
          html:
            'A structured SBAR removes the second and third reasons entirely. You are not asking for a ' +
            'judgement on whether you should have called — you are transferring clinical information and ' +
            'making a specific request.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'S',
              heading: 'Situation — 10 seconds',
              body:
                '“This is Priya, staff nurse on Ward 9. I am calling about Mr Doyle in bay 3, bed 12. His NEWS2 is 7 and has risen from 3 four hours ago.”\n\n' +
                'Name, ward, patient, location, score, direction of travel. The direction is the part people leave out and it is the part that conveys urgency.'
            },
            {
              caption: 'B',
              heading: 'Background — 15 seconds',
              body:
                '“He is 74, admitted two days ago with a community-acquired pneumonia, day two of IV co-amoxiclav. Background of COPD and type 2 diabetes.”\n\n' +
                'Only what is relevant to tonight. Not the full admission history — the receiver needs orientation, not a discharge summary.'
            },
            {
              caption: 'A',
              heading: 'Assessment — 20 seconds',
              body:
                '“Respiratory rate 26, saturations 90% on 2 litres, was 95% on air this morning. Systolic 96, pulse 118, temperature 38.6, and he is newly confused — he did not know where he was when I woke him.”\n\n' +
                'Numbers and changes. If you have a view, say it plainly: “I think he is septic.” You are permitted to have a clinical impression.'
            },
            {
              caption: 'R',
              heading: 'Recommendation — 10 seconds',
              body:
                '“I need you to review him now, please. I have started the sepsis screening tool and I can have bloods and cultures ready when you arrive.”\n\n' +
                'Ask for exactly what you want and give a timeframe. “Could you come and have a look at some point?” invites a delay. “I need you to review him now” does not.'
            },
            {
              caption: 'The whole thing',
              heading: 'Fifty-five seconds, start to finish',
              body:
                'Write the numbers down before you dial. The most common reason SBARs run long is the caller hunting for observations mid-sentence.\n\n' +
                'If it helps, say the words “I am calling with an SBAR” at the start. It tells the receiver to stop what they are doing and listen for structure.'
            }
          ]
        },
        {
          t: 'heading', text: 'When the response is not what you needed', level: 'h3'
        },
        {
          t: 'para',
          html:
            'Graded assertiveness gives you a ladder to climb without becoming confrontational. Each rung ' +
            'is more direct than the last. You are entitled to reach the top rung.'
        },
        {
          t: 'conversation',
          template: 'sms',
          gate: true,
          cast: [
            {
              key: 'reg',
              name: 'Medical Registrar (on call)',
              role: 'doctor',
              gender: 'female',
              age: 'adult',
              tone: 'medium'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'The first response',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'I am in resus with a GI bleed. Give him a litre of fluid and some paracetamol and I will get there when I can.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“I need you to know I am not happy with that plan — his NEWS2 is 7 and rising.”',
                  to: 'assert',
                  feedback:
                    'This is the concern-to-challenge step. Naming your discomfort explicitly is the rung most people skip.'
                },
                {
                  label: '“No problem, I will do that and call back if he gets worse.”',
                  to: 'accept',
                  feedback: 'This ends the escalation. The registrar has not understood the severity because it was not restated.'
                },
                {
                  label: 'Say nothing more and call the critical care outreach team instead',
                  to: 'outreach',
                  feedback:
                    'Legitimate and safe, though telling the registrar first keeps everyone aligned.'
                }
              ]
            },
            {
              key: 'assert',
              name: 'You state the concern',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'Understood. I still cannot leave this patient for at least twenty minutes.',
                  expression: 'concerned',
                  gesture: 'listening'
                }
              ],
              choices: [
                {
                  label: '“Then I am calling critical care outreach now and informing the consultant on call.”',
                  to: 'outreach',
                  feedback:
                    'Correct. The registrar is not refusing — she is genuinely committed elsewhere. Escalating around her is the right move, not a criticism of her.'
                },
                {
                  label: 'Wait the twenty minutes',
                  to: 'accept',
                  feedback: 'Twenty minutes on a rising score of 7 is exactly the gap this course exists to close.'
                }
              ]
            },
            {
              key: 'outreach',
              name: 'Outreach attends',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'Good — do that. Ring the consultant too, and tell outreach I will come as soon as I am free.',
                  expression: 'confident',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-good' }]
            },
            {
              key: 'accept',
              name: 'The plan is accepted',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text: 'Thanks — bleep me if anything changes.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-poor' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — reviewed in eleven minutes',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Reviewed in eleven minutes',
              outcomeDescription:
                'Outreach attended, sepsis was confirmed and antibiotics were given 34 minutes after the triggering score. Mr Doyle stayed on the ward. Escalating past a busy colleague is not going over their head — it is doing exactly what the policy asks, and the registrar was grateful for it.',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'Glad you pushed. I could not have got there in time and I would rather you rang outreach than waited for me.',
                  expression: 'encouraging',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — the gap opened',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Fifty-two minutes to review',
              outcomeDescription:
                'The registrar arrived at 03:06. By then the systolic was 84 and Mr Doyle required vasopressor support and a five-day critical care stay. Nobody behaved unreasonably. The plan simply went unchallenged, and the clock kept running.',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'I wish you had rung outreach. I did not realise how quickly he was moving — I only had the first set of numbers.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of a time you hesitated before escalating overnight. What were you actually worried about — being wrong, being a nuisance, or being criticised? Knowing what you know now about the 47-minute gap, what would you say instead?',
          size: 'large'
        }
      ]
    },
    // ---------------------------------------------------------------- 5 ---
    {
      title: 'Closing Your Own Gap',
      description: 'The specific habits that move a ward from 47 minutes to under 30.',
      badgeIcon: '✅',
      blocks: [
        { t: 'heading', text: 'Two wards already did this' },
        {
          t: 'para',
          html:
            'Wards 4 and 11 reduced their median escalation time to <b>26 minutes</b> and <b>29 minutes</b> ' +
            'respectively in six months, without additional staffing. What they changed is below, and none ' +
            'of it required permission from anyone.'
        },
        {
          t: 'comparison',
          title: 'What the fast wards do',
          preset: 'beforeAfter',
          layout: 'card',
          columns: [
            {
              title: 'Wards at 55–70 minutes',
              accent: '#b3543f',
              rows: [
                'Repeat the observations before calling, to “be sure”',
                'Ask the nurse in charge whether it warrants a call',
                'Wait for the ward round rather than interrupt the night',
                'Hunt for the numbers while already on the phone',
                'Record “Alert” for a patient who is subtly muddled',
                'Treat a busy registrar as a closed door'
              ]
            },
            {
              title: 'Wards at 26–29 minutes',
              accent: '#2b7a3f',
              rows: [
                'Call on the first triggering score, then repeat observations while waiting',
                'Escalate directly and tell the nurse in charge afterwards',
                'Treat 03:00 and 15:00 as identical clinically',
                'Write the numbers on paper before dialling',
                'Use ACVPU properly — new confusion scores 3',
                'Climb the assertiveness ladder, then go to outreach'
              ]
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'The escalation sequence',
          prompt: 'Put the actions in the correct order for a patient who has just scored NEWS2 7.',
          pass: 100,
          attempts: 3,
          gate: true,
          items: [
            'Recognise the triggering score and stay with the patient',
            'Write down the observations you will need to report',
            'Call the competent clinician and deliver an SBAR',
            'State a specific recommendation and a timeframe',
            'Begin the interventions you can start independently',
            'Escalate further if there is no review within the standard',
            'Document the score, the call, the response and the time'
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change on your next shift:',
          done: 'Take these to your next safety huddle and say them out loud. Wards that state commitments publicly move their numbers; wards that do not, do not.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will call on the first triggering score rather than repeating observations first', required: false },
            { text: 'I will count respiratory rate for a full 60 seconds', required: false },
            { text: 'I will score any supplemental oxygen as 2, at any flow rate', required: false },
            { text: 'I will use ACVPU and record new confusion as C, not A', required: false },
            { text: 'I will escalate without asking the nurse in charge for permission', required: false },
            { text: 'I will write my numbers down before I dial', required: false },
            { text: 'I will say “I am not happy with that plan” when I am not', required: false },
            { text: 'I will call outreach directly if review does not happen within the standard', required: false }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Final check',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'It is 02:30. Your patient scores NEWS2 6, up from 2 at 22:00. The registrar has been called to theatre. What do you do?',
              answers: [
                {
                  text: 'Call critical care outreach directly and inform the nurse in charge',
                  correct: true,
                  feedback:
                    'Correct. The registrar being unavailable does not pause the 30-minute standard. Outreach exists exactly for this.'
                },
                {
                  text: 'Repeat the observations in 30 minutes to confirm the trend',
                  feedback: 'The trend is already confirmed — 2 to 6 over four hours. This is the 47-minute gap forming.'
                },
                {
                  text: 'Wait for the registrar to return from theatre',
                  feedback: 'An unavailable clinician is a reason to escalate elsewhere, not a reason to wait.'
                },
                {
                  text: 'Ask the nurse in charge whether it is worth calling anyone',
                  feedback:
                    'You do not need permission to escalate, and seeking it adds delay at the point where delay causes harm.'
                }
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'Nobody has ever been disciplined at this Trust for escalating a patient who turned out to be fine. Several people have been through a serious incident investigation for the other thing.',
          by: 'Medical Director, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
