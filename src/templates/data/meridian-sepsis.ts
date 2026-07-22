// Meridian Health Systems — course 7 of 10.
// Driven by the sepsis audit: Sepsis Six completed within 60 minutes in only
// 54% of cases. The delay sits in recognition, not in treatment.
import type { CourseTemplate } from '../types'

export const meridianSepsis: CourseTemplate = {
  id: 'meridian-health-sepsis',
  title: 'The First Hour: Recognising Sepsis Before It Declares',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Sepsis Six was completed within 60 minutes in 54% of eligible cases against a 90% standard. ' +
    'Time-to-antibiotic analysis shows the delay sits almost entirely before the sepsis screening ' +
    'tool is started — a median 38 minutes from first abnormal physiology to first suspicion. ' +
    'Atypical presentations in the elderly, post-operative and immunosuppressed are missed most often.',
  audience: 'Registered nurses, nursing associates, foundation doctors, ED and acute medicine staff',
  summary:
    'We treat sepsis well once we call it. We call it late. This course targets recognition — ' +
    'especially in the patients who never look septic — and the six actions that follow.',
  objectives: [
    'Recognise sepsis in atypical presentations, including the afebrile and normotensive patient',
    'Start the sepsis screening tool on suspicion rather than on confirmation',
    'Deliver all six elements of the Sepsis Six within the first hour',
    'Escalate when antibiotics are delayed by prescribing or access problems'
  ],
  minutes: 29,
  themeId: 'forest',
  tags: ['sepsis', 'deterioration', 'patient safety', 'clinical', 'time-critical'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Thinks Sepsis', icon: '🧠', kind: 'lesson', lesson: 2 },
      { label: 'Six in Sixty', icon: '⏱', kind: 'lesson', lesson: 3 },
      { label: 'Sepsis Champion', icon: '🚨', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'Where the Hour Goes',
      description: 'Our own time-to-antibiotic data, broken down.',
      badgeIcon: '⏱',
      blocks: [
        { t: 'heading', text: 'The treatment is fast. The suspicion is slow.' },
        {
          t: 'para',
          html:
            'Our audit reviewed <b>287 cases</b> of confirmed sepsis. Once the screening tool was ' +
            'started, median time to antibiotics was <b>22 minutes</b> — genuinely good. The problem is ' +
            'what happens before that.'
        },
        {
          t: 'chart',
          title: 'Median minutes at each stage, from first abnormal observation',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Abnormal obs → suspicion', value: 38, accent: '#b3543f' },
            { label: 'Suspicion → screening tool', value: 9, accent: '#b7791f' },
            { label: 'Tool → doctor review', value: 12, accent: '#2b7a3f' },
            { label: 'Review → antibiotics', value: 22, accent: '#2b7a3f' }
          ]
        },
        {
          t: 'para',
          html:
            'Thirty-eight minutes elapse between physiology that should trigger suspicion and anyone ' +
            'thinking the word "sepsis". That single interval is more than half our total delay, and it ' +
            'costs lives: mortality rises by roughly <b>7–8% for every hour</b> antibiotics are delayed ' +
            'in septic shock.'
        },
        {
          t: 'comparison',
          title: 'What 54% versus 90% means in a year',
          preset: 'currentFuture',
          layout: 'horizontal',
          columns: [
            {
              title: 'At 54% (today)',
              accent: '#b3543f',
              rows: [
                '132 patients per year receiving antibiotics beyond the first hour',
                'Modelled 9–11 avoidable deaths annually',
                'Median critical care stay 4.2 days for late-treated sepsis',
                'Two coroner’s inquests citing recognition delay',
                'Estimated £610,000 additional critical care cost'
              ]
            },
            {
              title: 'At 90% (standard)',
              accent: '#2b7a3f',
              rows: [
                '29 patients per year beyond the hour, mostly genuinely atypical',
                'Modelled 7–9 deaths avoided annually',
                'Median critical care stay 2.1 days',
                'Recognition delay no longer the dominant inquest theme',
                'Approximately £430,000 released'
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'We audited ourselves expecting to find a problem with antibiotic access or prescribing. We found a problem with the moment somebody first thinks the word.',
          by: 'Sepsis Lead, Meridian Health Systems',
          pull: true
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Where to intervene',
          gate: true,
          questions: [
            {
              prompt: 'Given the data above, where would an improvement effort have the greatest effect?',
              feedback:
                'The 38-minute recognition interval is larger than the other three stages combined.',
              answers: [
                {
                  text: 'Shortening the time from abnormal observations to first suspecting sepsis',
                  correct: true,
                  feedback: 'Yes — it is over half the total delay and it costs nothing but a lower threshold for suspicion.'
                },
                {
                  text: 'Speeding up antibiotic administration once prescribed',
                  feedback: 'Already good at 22 minutes and the smallest available gain.'
                },
                {
                  text: 'Reducing time from screening tool to doctor review',
                  feedback: '12 minutes is reasonable and offers limited improvement.'
                },
                {
                  text: 'Increasing the number of blood cultures taken',
                  feedback: 'Important for stewardship, but it does not address the recognition delay.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'The Patients Who Do Not Look Septic',
      description: 'Atypical presentations, and why the classic picture is the minority.',
      badgeIcon: '🧠',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'Fever and tachycardia are not the entry requirement' },
        {
          t: 'para',
          html:
            'The classic picture — hot, flushed, tachycardic, obviously unwell — is the presentation we ' +
            'never miss. In our 287 cases, <b>44%</b> did not have that picture at the point recognition ' +
            'was possible, and those cases account for almost all of the delay.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered all five atypical groups. These account for most of our missed hours.',
          panels: [
            {
              title: 'The older patient — confusion is the fever',
              body:
                'In patients over 75, <b>new confusion is frequently the first and sometimes only sign</b>. Many mount no fever at all; some are hypothermic, which is a worse prognostic sign than pyrexia.\n\n' +
                'A temperature of 36.2 in an 82-year-old with new delirium and a respiratory rate of 22 is a sepsis screen, not a urinary tract infection to be treated orally in the morning.\n\n' +
                '“Off legs”, “not herself”, “more muddled than usual” and a fall are all common presenting complaints for sepsis in this group.'
            },
            {
              title: 'The post-operative patient — attributing it to surgery',
              body:
                'Tachycardia is expected after surgery. Pain, opiates and inflammation all confound the picture, so abnormal physiology gets attributed to the operation.\n\n' +
                'The discriminator is <b>trajectory</b>. Post-operative tachycardia should settle. A pulse that is climbing on day 2 or 3, a rising respiratory rate, or a patient who was improving and has stopped, is sepsis until proven otherwise.\n\n' +
                'Anastomotic leak and collection commonly present as unexplained tachycardia 48–96 hours post-op, before any fever appears.'
            },
            {
              title: 'The immunosuppressed patient — no inflammatory response',
              body:
                'Chemotherapy, long-term steroids, biologics, transplant immunosuppression and asplenia all blunt or abolish the febrile response.\n\n' +
                'Neutropenic sepsis is a medical emergency in which the patient may look well and be profoundly septic. Any patient within six weeks of chemotherapy with a temperature ≥38.0, <i>or who feels unwell with any temperature</i>, requires antibiotics within one hour — before the neutrophil count is known.\n\n' +
                'Do not wait for the blood results. That wait is the error.'
            },
            {
              title: 'The pregnant or recently pregnant patient',
              body:
                'Physiological changes of pregnancy mask deterioration: tachycardia and a raised respiratory rate are normal, and blood pressure is lower at baseline, so hypotension appears late and then falls fast.\n\n' +
                'Sepsis remains a leading direct cause of maternal death. Any woman who is pregnant or within six weeks of the end of pregnancy with suspected infection needs urgent senior review — use the maternity-specific screening tool, not the adult one.'
            },
            {
              title: 'The patient on beta-blockers or with a pacemaker',
              body:
                'Rate control removes tachycardia from the picture entirely. A patient on bisoprolol may be profoundly septic with a pulse of 78.\n\n' +
                'In these patients weight respiratory rate, mental state, capillary refill, urine output and lactate more heavily. A normal pulse in a rate-controlled patient carries no reassurance at all.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Atypical recognition',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'Which of these should prompt a sepsis screen despite the absence of fever? Select all that apply.',
              feedback:
                'Absence of fever excludes nothing. Hypothermia, blunted responses and physiological masking are all higher-risk, not lower.',
              answers: [
                { text: 'An 84-year-old with new confusion, temp 35.8, RR 24', correct: true, score: 5 },
                { text: 'A day-3 post-operative patient with pulse climbing from 82 to 116', correct: true, score: 5 },
                { text: 'A patient 10 days post-chemotherapy who “just feels wrong”, temp 37.4', correct: true, score: 5 },
                { text: 'A woman 3 weeks postpartum with RR 22 and abdominal pain', correct: true, score: 5 },
                { text: 'A patient on bisoprolol with RR 26, mottled knees, pulse 80', correct: true, score: 5 },
                { text: 'A well patient with temp 37.9 after a routine vaccination, otherwise normal', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of a patient whose deterioration was attributed to something else — post-op pain, a UTI, “just confused”. Looking back, what was the earliest observation that should have prompted a sepsis screen?',
          size: 'medium'
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'The Sepsis Six, In Sixty Minutes',
      description: 'The six actions, who does what, and where they stall.',
      badgeIcon: '🚨',
      blocks: [
        { t: 'heading', text: 'Three in, three out' },
        {
          t: 'para',
          html:
            'The Sepsis Six is deliberately simple: three things you give, three things you take. Every ' +
            'element is deliverable by a registered nurse under our standing patient group direction ' +
            'except antibiotic prescribing.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Give 1',
              heading: 'Oxygen',
              body:
                'Titrate to a saturation target of 94–98%, or 88–92% if the patient has known hypercapnic respiratory failure.\n\n' +
                'Do not withhold oxygen from a hypoxic septic patient because of a COPD label — treat the hypoxia and monitor for CO₂ retention.'
            },
            {
              caption: 'Give 2',
              heading: 'Intravenous fluids',
              body:
                'A balanced crystalloid bolus, typically 500ml over 15 minutes, reassessed after each bolus.\n\n' +
                'Reassess rather than running fluid continuously: look at blood pressure, heart rate, urine output, mental state and lactate. Escalate if the patient remains hypotensive after 30ml/kg — that defines septic shock and requires critical care input.'
            },
            {
              caption: 'Give 3',
              heading: 'Antibiotics',
              body:
                'Broad-spectrum antibiotics per the Trust empirical guideline, within one hour of recognition.\n\n' +
                'This is where our delay concentrates after recognition. If a prescription is not available within 20 minutes, escalate — do not wait politely. Under our PGD, the nurse in charge may administer the first dose of the guideline antibiotic where the prescriber is delayed and the patient is deteriorating.'
            },
            {
              caption: 'Take 1',
              heading: 'Blood cultures',
              body:
                'Before antibiotics <b>if and only if</b> this does not delay them. Two sets, from separate sites, with proper skin preparation.\n\n' +
                'The rule that matters: <i>cultures must never delay antibiotics</i>. A patient who receives antibiotics at 25 minutes with one set of cultures has been treated better than one who receives them at 70 minutes with perfect cultures.'
            },
            {
              caption: 'Take 2',
              heading: 'Lactate',
              body:
                'Venous or arterial gas. Lactate above 2 mmol/L indicates tissue hypoperfusion; above 4 mmol/L is associated with markedly increased mortality and mandates critical care referral.\n\n' +
                'Repeat at 2 hours. A falling lactate is the most useful early indicator that resuscitation is working; a rising one is a reason to escalate regardless of how the patient looks.'
            },
            {
              caption: 'Take 3',
              heading: 'Urine output',
              body:
                'Hourly measurement. Catheterise if accurate measurement is needed and the patient is unwell enough to warrant it.\n\n' +
                'Less than 0.5ml/kg/hour is a marker of organ hypoperfusion. In practice this is the element most often omitted from documentation even when it was measured.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'First hour sequence',
          prompt:
            'A patient screens positive for sepsis. Put the actions in the order that gets antibiotics fastest.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Start the sepsis screening tool and record the time of recognition',
            'Escalate to the responsible clinician and state the word “sepsis”',
            'Start high-flow oxygen and site IV access',
            'Take blood cultures and a lactate if this causes no delay',
            'Give the first dose of guideline antibiotics',
            'Start the fluid bolus and reassess after it',
            'Commence hourly urine output measurement and repeat lactate at 2 hours'
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Cultures versus antibiotics',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'Your patient screens positive at 14:00. Antibiotics are prescribed. At 14:18 you have failed twice to obtain blood cultures and the phlebotomist is 20 minutes away. What do you do?',
              answers: [
                {
                  text: 'Give the antibiotics now and take cultures as soon as you can afterwards',
                  correct: true,
                  feedback:
                    'Correct. Cultures must never delay antibiotics. Document that cultures were attempted and taken post-dose.'
                },
                {
                  text: 'Wait for the phlebotomist so cultures are taken before antibiotics',
                  feedback:
                    'This pushes antibiotics past 40 minutes for a marginal microbiological gain. Mortality rises with every hour of delay.'
                },
                {
                  text: 'Give half the dose now and the rest after cultures',
                  feedback: 'Sub-therapeutic dosing compromises treatment and does not preserve culture yield.'
                },
                {
                  text: 'Ask the doctor to change to oral antibiotics to avoid the access problem',
                  feedback:
                    'Oral absorption is unreliable in sepsis with hypoperfusion. IV access is the priority, not a route change.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'Saying the Word',
      description: 'What happens when the screen is positive and the review is not.',
      badgeIcon: '🗣',
      themeId: 'sunrise',
      blocks: [
        { t: 'heading', text: '“Query sepsis” changes what happens next' },
        {
          t: 'para',
          html:
            'In our case reviews, the single most powerful intervention was linguistic. Calls that ' +
            'included the word <b>“sepsis”</b> received a median review in 9 minutes. Calls describing ' +
            'the same physiology without the word received review in 34 minutes.'
        },
        {
          t: 'conversation',
          template: 'corporateChat',
          gate: true,
          cast: [
            {
              key: 'fy',
              name: 'Foundation Doctor',
              role: 'doctor',
              gender: 'female',
              age: 'young',
              tone: 'light'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'The call',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'fy',
                  text:
                    'I have three jobs on the ward round list and a discharge to write. Can it wait half an hour? He was seen this morning.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“He has screened positive for sepsis. I need antibiotics prescribed now.”',
                  to: 'named',
                  feedback: 'Naming it and stating the specific ask is what compresses the timeline.'
                },
                {
                  label: '“His obs have gone off a bit — NEWS2 is 6.”',
                  to: 'vague',
                  feedback: 'True, and it sounds like one of many ward jobs rather than a time-critical emergency.'
                },
                {
                  label: 'Accept the delay and continue observations',
                  to: 'accepted',
                  feedback: 'This is the 38-minute interval, forming in real time.'
                }
              ]
            },
            {
              key: 'named',
              name: 'The word lands',
              background: 'hospital',
              dialogue: [
                {
                  who: 'fy',
                  text:
                    'Sepsis — right, I am coming now. Start the oxygen and get access in, I will prescribe as soon as I am there.',
                  expression: 'confident',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'Begin the Sepsis Six while waiting', to: 'end-good' }]
            },
            {
              key: 'vague',
              name: 'It sounds routine',
              background: 'hospital',
              dialogue: [
                {
                  who: 'fy',
                  text: 'Okay — repeat them in half an hour and bleep me if they are worse.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: '“Sorry — to be clear, this is a positive sepsis screen. I need you now.”',
                  to: 'named',
                  feedback: 'Excellent correction. Restating in the right language changes the response immediately.'
                },
                { label: 'Accept and repeat the observations', to: 'accepted' }
              ]
            },
            {
              key: 'accepted',
              name: 'The wait begins',
              background: 'hospital',
              dialogue: [
                {
                  who: 'fy',
                  text: 'Thanks — bleep me if anything changes.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-poor' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — antibiotics at 41 minutes',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Antibiotics at 41 minutes',
              outcomeDescription:
                'Oxygen and access were in place before the doctor arrived, so the only remaining step was prescribing. Lactate fell from 3.4 to 1.9 by two hours. The patient stayed on the ward. The word “sepsis” did most of the work.',
              dialogue: [
                {
                  who: 'fy',
                  text:
                    'Glad you said the word. I had it filed as a routine review from the way the first bleep sounded.',
                  expression: 'encouraging',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — antibiotics at 96 minutes',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Antibiotics at 96 minutes',
              outcomeDescription:
                'Review happened at 74 minutes, by which point the systolic was 82 and lactate 4.6. The patient required vasopressors and three days of critical care. Nobody refused anything and nobody was negligent — the request simply did not sound like an emergency, because it was not described as one.',
              dialogue: [
                {
                  who: 'fy',
                  text:
                    'His lactate is 4.6 — why did nobody tell me this was a sepsis screen? I would have come straight away.',
                  expression: 'angry',
                  gesture: 'questioning'
                }
              ]
            }
          ]
        },
        {
          t: 'comparison',
          title: 'When antibiotics stall — escalate, do not wait',
          preset: 'processAB',
          layout: 'stacked',
          columns: [
            {
              title: 'At 20 minutes with no prescription',
              accent: '#b7791f',
              rows: [
                'Bleep the prescriber again and state the elapsed time',
                'Tell the nurse in charge',
                'Have the guideline antibiotic and diluent ready at the bedside'
              ]
            },
            {
              title: 'At 30 minutes with no prescription',
              accent: '#c8372b',
              rows: [
                'Escalate to the medical registrar directly',
                'Consider first-dose administration under the sepsis PGD',
                'Contact critical care outreach if the patient is deteriorating'
              ]
            },
            {
              title: 'At 45 minutes with no prescription',
              accent: '#7b2d8b',
              rows: [
                'Escalate to the consultant on call — this is now a patient-safety incident',
                'Record the escalation and times contemporaneously',
                'Complete a Datix regardless of outcome'
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 5 ---
    {
      title: 'Making the Hour, Every Time',
      description: 'What the wards hitting 90% actually changed.',
      badgeIcon: '✅',
      blocks: [
        { t: 'heading', text: 'Two wards are already at 90%' },
        {
          t: 'para',
          html:
            'Ward 3 and the surgical assessment unit both exceed the 90% standard. Neither has extra ' +
            'staff. What they changed is small, specific and copyable.'
        },
        {
          t: 'timeline',
          preset: 'horizontal',
          events: [
            {
              label: 'Sepsis trolley',
              date: 'Change 1',
              body: 'A single grab-trolley holding cultures, gas syringes, cannulae, fluids and the guideline card. Removes 6–8 minutes of hunting for equipment.'
            },
            {
              label: 'Screen on suspicion, not confirmation',
              date: 'Change 2',
              body: 'Any NEWS2 ≥5 with possible infection triggers the screening tool immediately. Screening early and finding it negative is explicitly encouraged and never criticised.'
            },
            {
              label: 'Say the word on every call',
              date: 'Change 3',
              body: 'The phrase “this is a positive sepsis screen” is mandatory in the escalation. Reduced median review time from 31 to 10 minutes.'
            },
            {
              label: 'Clock on the whiteboard',
              date: 'Change 4',
              body: 'Time of recognition written on the bay whiteboard so everyone can see the hour running. Antibiotics within 60 minutes rose from 58% to 91%.'
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take these to your next safety huddle. The whiteboard clock alone moved one ward by 33 points.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will screen on suspicion, not wait for confirmation', required: false },
            { text: 'I will treat new confusion in an older patient as possible sepsis', required: false },
            { text: 'I will not be reassured by a normal temperature', required: false },
            { text: 'I will say the word “sepsis” explicitly in every escalation call', required: false },
            { text: 'I will give antibiotics rather than delay them for cultures', required: false },
            { text: 'I will escalate at 30 minutes if no prescription has appeared', required: false },
            { text: 'I will write the recognition time where the team can see it', required: false },
            { text: 'I will screen post-operative patients whose pulse is climbing on day 2–3', required: false }
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
                'An 81-year-old is “not herself”, temp 35.9, RR 23, pulse 88 (on bisoprolol), BP 112/68, new confusion. What is the correct action?',
              answers: [
                {
                  text: 'Start the sepsis screening tool now and escalate saying “possible sepsis”',
                  correct: true,
                  feedback:
                    'Correct. Hypothermia, new confusion, raised respiratory rate and rate-controlled pulse are a classic atypical presentation — the most commonly missed pattern in our audit.'
                },
                {
                  text: 'Send a urine sample and start oral antibiotics for a likely UTI',
                  feedback:
                    'This is the single most common mis-step in our case reviews. New confusion plus abnormal physiology is sepsis until excluded.'
                },
                {
                  text: 'Repeat observations in four hours — she is normotensive and not febrile',
                  feedback:
                    'Normotension and absence of fever provide no reassurance here; both are expected in this group.'
                },
                {
                  text: 'Request a routine medical review in the morning',
                  feedback: 'This creates precisely the recognition delay the audit identified.'
                }
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'We did not get faster at treating sepsis. We got faster at saying it out loud. Everything else was already in place.',
          by: 'Ward Manager, Ward 3, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
