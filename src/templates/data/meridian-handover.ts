// Meridian Health Systems — course 8 of 10.
// Driven by four serious incidents in which information present on one shift
// was absent on the next.
import type { CourseTemplate } from '../types'

export const meridianHandover: CourseTemplate = {
  id: 'meridian-health-handover',
  title: 'Handover That Transfers Responsibility',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Four serious incidents in 20 months cite information lost at shift change. SBAR is taught at ' +
    'induction and used in 23% of observed handovers. Observation of 62 handovers found a median of ' +
    '11 seconds per patient, no structured format, and pending actions verbalised but not written ' +
    'down in 78% of cases.',
  audience: 'Registered nurses, nursing associates, healthcare assistants and medical staff handing over at shift change',
  summary:
    'A handover that lists facts is not a handover. This course covers what must actually transfer — ' +
    'responsibility, uncertainty and the thing you are worried about — and the structure that gets it ' +
    'there in ninety seconds.',
  objectives: [
    'Deliver a structured SBAR handover for an unstable patient in under 90 seconds',
    'Transfer pending actions with a named owner and a deadline',
    'Communicate uncertainty and clinical worry explicitly',
    'Run a bedside handover that includes the patient and protects confidentiality'
  ],
  minutes: 26,
  themeId: 'corporate',
  tags: ['handover', 'communication', 'patient safety', 'SBAR'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Transfers Worry', icon: '🔁', kind: 'lesson', lesson: 2 },
      { label: 'Ninety Seconds', icon: '⏱', kind: 'lesson', lesson: 3 },
      { label: 'Handover Champion', icon: '🤝', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    {
      title: 'Four Incidents, One Shift Change',
      description: 'What was known at 19:00 and unknown at 20:00.',
      badgeIcon: '🌗',
      blocks: [
        { t: 'heading', text: 'In every case the information existed' },
        {
          t: 'para',
          html:
            'None of these four incidents involved information nobody had. In all four, the outgoing ' +
            'shift knew the relevant fact. It did not survive the handover.'
        },
        {
          t: 'timeline',
          preset: 'vertical',
          events: [
            {
              label: 'Incident 1 — the pending scan',
              date: '2023',
              body: 'A CT head requested for a patient on anticoagulation after an unwitnessed fall. Verbally handed over as “CT pending”. No owner, no time. Nobody chased it. The scan was performed 19 hours later and showed a subdural haematoma.'
            },
            {
              label: 'Incident 2 — the worry that was not said',
              date: '2024',
              body: 'The outgoing nurse later stated she had “a bad feeling” about a post-operative patient whose observations were within range. She did not say so, judging it too vague to hand over. The patient was found in cardiac arrest four hours later from a concealed bleed.'
            },
            {
              label: 'Incident 3 — the allergy that dropped',
              date: '2024',
              body: 'A newly documented penicillin allergy from an admission clerking was not carried into the nursing handover sheet. The patient received co-amoxiclav on the night shift.'
            },
            {
              label: 'Incident 4 — the ceiling of care',
              date: '2025',
              body: 'A treatment escalation plan agreed with the family at 16:00 was not handed over. The night team commenced full escalation against the documented wishes, and the family were called at 03:00 to a decision they had already made.'
            }
          ]
        },
        {
          t: 'chart',
          title: 'What was lost at shift change (observed handovers, n=62)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Pending actions with no owner', value: 78, accent: '#c8372b' },
            { label: 'No structured format used', value: 77, accent: '#c8372b' },
            { label: 'Clinical worry not verbalised', value: 61, accent: '#b7791f' },
            { label: 'Ceiling of care not mentioned', value: 44, accent: '#b7791f' },
            { label: 'No opportunity to ask questions', value: 39, accent: '#4a6fa5' }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'What handover is for',
          gate: true,
          questions: [
            {
              prompt:
                'Incident 2 involved a nurse who had a concern but did not hand it over because it was not backed by abnormal observations. What does this tell us?',
              feedback:
                'Clinical worry is data. It is often the earliest signal available and it must be transferred explicitly.',
              answers: [
                {
                  text: 'Uncertainty and worry must be handed over, even without supporting numbers',
                  correct: true,
                  feedback: 'Yes — “I am not happy with bed 4 and I cannot tell you why” is a legitimate and valuable handover item.'
                },
                {
                  text: 'She should have escalated instead of handing over',
                  feedback: 'She may also have escalated, but that does not remove the duty to transfer the concern.'
                },
                {
                  text: 'Observations should have been taken more frequently',
                  feedback: 'They were within range throughout. Frequency was not the failure.'
                },
                {
                  text: 'Handover should be restricted to objective findings',
                  feedback: 'This is precisely the belief that caused the incident.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'What Must Actually Transfer',
      description: 'Facts are the easy part. Responsibility, uncertainty and worry are not.',
      badgeIcon: '🔁',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'Four things, and only one of them is facts' },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered all four. Items 2, 3 and 4 are the ones our incidents lost.',
          panels: [
            {
              title: '1. The clinical picture',
              body:
                'Who they are, why they are here, what has changed this shift, and what their current trajectory is.\n\n' +
                'Trajectory is the part usually omitted. “NEWS2 3” tells the incoming nurse very little. “NEWS2 3, was 6 this morning, improving steadily since antibiotics” tells them what to expect and when to worry.'
            },
            {
              title: '2. Responsibility — who owns what, by when',
              body:
                'Every pending action needs a <b>named owner</b> and a <b>time</b>. “CT pending” is not a handover item; “CT head requested at 14:20, I have chased twice, incoming nurse to chase radiology at 21:00 if not done” is.\n\n' +
                'Write it down. In 78% of observed handovers pending actions were spoken and not recorded — and a spoken action with no owner belongs to nobody.'
            },
            {
              title: '3. Uncertainty — what you do not know',
              body:
                'What is still unclear, what you are waiting on, and which diagnoses remain open.\n\n' +
                '“The plan assumes this is a chest infection. If she does not improve overnight, the alternative is PE and nobody has excluded it.” This tells the incoming clinician what would change the picture — and gives them permission to reconsider rather than inherit a conclusion.'
            },
            {
              title: '4. Worry — the thing you cannot evidence',
              body:
                'If you are uneasy about a patient, say so and say it plainly. It does not need justification.\n\n' +
                '“Bed 12 is the one I would look at first. Numbers are fine. I do not like how she looks.”\n\n' +
                'Experienced clinicians detect deterioration before it is measurable. Incident 2 happened because a nurse judged her own instinct too vague to be worth saying.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'The same patient, two handovers',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'Facts only',
              accent: '#c8372b',
              rows: [
                '“Bed 6, Mr Idris, 68, chest infection, day 2 IV antibiotics.”',
                '“Obs stable. CT pending.”',
                '“That is him done.”',
                'Eleven seconds',
                'Incoming nurse inherits a conclusion and no context'
              ]
            },
            {
              title: 'Responsibility transferred',
              accent: '#0e9d6d',
              rows: [
                '“Bed 6, Mr Idris, 68, community-acquired pneumonia, day 2 co-amoxiclav.”',
                '“NEWS2 4, down from 7 this morning — improving. On 2 litres, was on 4.”',
                '“CT head requested 14:20 after an unwitnessed fall, he is on apixaban. I have chased twice. Please chase radiology at 21:00 if it has not happened — it is written on the board.”',
                '“Ceiling of care discussed 12/03, ward-based, documented. Family aware.”',
                '“One thing — he is quieter than yesterday. Numbers do not show it. He is the one I would check first.”'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'What belongs in handover',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'Which of these must be handed over explicitly? Select all that apply.',
              feedback:
                'Pending actions with owners, ceilings of care, open uncertainty and clinical worry are the four our incidents lost.',
              answers: [
                { text: 'Pending investigations, with who will chase them and when', correct: true, score: 5 },
                { text: 'Ceiling of care or treatment escalation decisions', correct: true, score: 5 },
                { text: 'Diagnoses still open, and what would change the plan', correct: true, score: 5 },
                { text: 'A concern you cannot evidence with observations', correct: true, score: 5 },
                { text: 'Newly documented allergies', correct: true, score: 5 },
                { text: 'The patient’s full past medical history', score: 0 },
                { text: 'Which staff member is on a break', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Ninety Seconds That Work',
      description: 'SBAR at the bedside, with the patient present.',
      badgeIcon: '⏱',
      blocks: [
        { t: 'heading', text: 'Structure is what makes it fast, not what makes it slow' },
        {
          t: 'para',
          html:
            'Staff resist SBAR because it sounds like it adds time. Our observations found the opposite: ' +
            'structured handovers averaged <b>84 seconds</b> per unstable patient and unstructured ones ' +
            '<b>96 seconds</b> — because unstructured handovers double back, repeat, and generate ' +
            'clarifying questions.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'S',
              heading: 'Situation — 15 seconds',
              body:
                'Name, bed, age, why they are here, and their current status in one line.\n\n' +
                '“Bed 6, Mr Idris, 68, community-acquired pneumonia, day 2 of IV antibiotics, currently improving.”'
            },
            {
              caption: 'B',
              heading: 'Background — 20 seconds',
              body:
                'Only what shapes tonight. Relevant comorbidities, anticoagulation, allergies, ceiling of care, recent significant events.\n\n' +
                '“On apixaban. Unwitnessed fall yesterday. Penicillin allergy documented on admission. Ceiling of care ward-based, agreed 12/03.”'
            },
            {
              caption: 'A',
              heading: 'Assessment — 25 seconds',
              body:
                'Current numbers, direction of travel, and your clinical impression including any worry.\n\n' +
                '“NEWS2 4, down from 7. Oxygen reduced from 4 to 2 litres. Eating a little. He is quieter than yesterday and I cannot put a number on that, but he is the one I would check first.”'
            },
            {
              caption: 'R',
              heading: 'Recommendation — 25 seconds',
              body:
                'What needs doing, by whom, by when.\n\n' +
                '“Chase the CT head with radiology at 21:00 if it has not happened — it is on the board. Repeat obs two-hourly. Escalate if NEWS2 goes back above 5 or if he becomes confused.”'
            },
            {
              caption: 'Q',
              heading: 'And then stop and ask',
              body:
                '“Anything you want to check?”\n\n' +
                'Handover is a two-way transfer. In 39% of observed handovers the incoming staff had no opportunity to ask a question. Five seconds of silence is what converts a briefing into a transfer of responsibility.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Bedside handover sequence',
          prompt: 'Put the steps of a bedside handover into the correct order.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Check the patient is willing and able to have handover at the bedside',
            'Introduce the incoming staff member to the patient by name',
            'Give Situation and Background',
            'Give Assessment, including trajectory and any worry',
            'Give Recommendation with named owners and times',
            'Invite questions from the incoming staff member',
            'Invite the patient to correct or add anything',
            'Record pending actions in writing before moving to the next bed'
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Bedside handover',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You are handing over at the bedside. The patient is in a four-bedded bay and the next item concerns a new cancer diagnosis not yet discussed with them. What do you do?',
              answers: [
                {
                  text: 'Hold that item and hand it over away from the bedside',
                  correct: true,
                  feedback:
                    'Correct. Bedside handover improves accuracy and patient involvement, but it never overrides confidentiality or a patient’s right to receive news properly.'
                },
                {
                  text: 'Hand it over quietly at the bedside — the curtains are drawn',
                  feedback: 'Curtains are not soundproof, and the patient may hear a diagnosis nobody has yet discussed with them.'
                },
                {
                  text: 'Use abbreviations so the patient will not understand',
                  feedback: 'Patients frequently decode this, and it risks the incoming nurse misunderstanding too.'
                },
                {
                  text: 'Skip the item — it will be in the notes',
                  feedback: 'This is exactly how Incident 4 happened. Sensitive items are handed over, just not there.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'When Handover Goes Wrong',
      description: 'Interruption, a deteriorating patient, and the temptation to compress.',
      badgeIcon: '⚡',
      themeId: 'plum',
      blocks: [
        { t: 'heading', text: 'The shift that is already behind' },
        {
          t: 'scenario',
          gate: true,
          cast: [
            {
              key: 'in',
              name: 'Incoming Staff Nurse',
              role: 'nurse',
              gender: 'female',
              age: 'young',
              tone: 'medium'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'Twenty past eight',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'in',
                  text:
                    'We are twenty minutes late already and I have got eight patients. Just give me the ones I need to worry about and I will read the rest off the notes.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“Two minutes for the three unstable ones, then a line each for the rest.”',
                  to: 'triaged',
                  feedback:
                    'Correct compromise — it protects depth where it matters without pretending every patient needs equal time.'
                },
                {
                  label: 'Agree — hand over only the unstable patients',
                  to: 'skipped',
                  feedback: 'This is how the allergy in Incident 3 was lost: the patient was stable, so he was skipped.'
                },
                {
                  label: 'Insist on full SBAR for all eight regardless',
                  to: 'rigid',
                  feedback: 'Rigidity here means the last patients get a rushed handover from an exhausted colleague.'
                }
              ]
            },
            {
              key: 'rigid',
              name: 'Running further behind',
              background: 'hospital',
              dialogue: [
                {
                  who: 'in',
                  text:
                    'We are now forty minutes over and the night team is waiting for the drug round. Can we speed up?',
                  expression: 'concerned',
                  gesture: 'questioning'
                }
              ],
              choices: [{ label: 'Switch to depth-where-it-matters', to: 'triaged' }]
            },
            {
              key: 'skipped',
              name: 'The stable ones are skipped',
              background: 'hospital',
              dialogue: [
                {
                  who: 'in',
                  text: 'Great — I will pick the others up from the notes when I do my first round.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: 'Stop — at minimum hand over allergies, ceilings of care and pending actions for every patient',
                  to: 'triaged',
                  feedback: 'Right. There is a floor below which handover cannot go, however short it is.'
                },
                { label: 'Continue as agreed', to: 'end-poor' }
              ]
            },
            {
              key: 'triaged',
              name: 'Depth where it matters',
              background: 'hospital',
              dialogue: [
                {
                  who: 'in',
                  text:
                    'That works. Say again about bed 6 — you want radiology chased at nine if the CT has not happened?',
                  expression: 'confident',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: 'Confirm, and write it on the board with the time and her name against it',
                  to: 'end-good',
                  feedback: 'Written, owned, timed. That is the difference between an intention and a transfer.'
                },
                {
                  label: 'Confirm verbally and move on',
                  to: 'end-partial',
                  feedback: 'She has understood it now. Whether it survives the next four hours is another matter.'
                }
              ]
            },
            {
              key: 'end-good',
              name: 'Outcome — the action survived',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'The CT was chased at 21:04',
              outcomeDescription:
                'The written, owned, timed action survived a busy night shift and two further interruptions. The scan was performed at 22:10 and was normal — which is the point. The value of the handover was not that it found something; it was that it would have.',
              dialogue: [
                {
                  who: 'in',
                  text: 'Chased it at nine, scanned at ten past ten, reported normal. Logged it.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-partial',
              name: 'Outcome — remembered late',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Chased at 23:40',
              outcomeDescription:
                'She remembered during the second drug round. No harm resulted, but the action survived on memory alone through a shift with two emergencies. That is not a system — it is luck with a good nurse attached.',
              dialogue: [
                {
                  who: 'in',
                  text: 'I nearly forgot that entirely. It should have been written down.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — the allergy was lost',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Co-amoxiclav prescribed at 23:15',
              outcomeDescription:
                'The skipped patient had a penicillin allergy documented that morning and not yet on the handover sheet. This is Incident 3. The patient was stable, so he was skipped — and stability was exactly why nobody re-checked.',
              dialogue: [
                {
                  who: 'in',
                  text: 'He has come out in a rash and his lip is swelling. Was he allergic to something?',
                  expression: 'angry',
                  gesture: 'questioning'
                }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'The minimum floor — for every patient, however short the handover:',
          done: 'That is the floor. Below it, handover is not happening.',
          mode: 'allRequired',
          items: [
            { text: 'Allergies, especially newly documented ones' },
            { text: 'Ceiling of care or escalation decisions' },
            { text: 'Any pending action, with an owner and a time' },
            { text: 'Infection precautions' },
            { text: 'Anything I am worried about, even without numbers' }
          ]
        }
      ]
    },
    {
      title: 'Making It Routine',
      description: 'What changed on the wards that no longer lose things.',
      badgeIcon: '🤝',
      blocks: [
        { t: 'heading', text: 'Three changes, no extra time' },
        {
          t: 'comparison',
          title: 'Before and after on Ward 11',
          preset: 'beforeAfter',
          layout: 'card',
          columns: [
            {
              title: 'Before',
              accent: '#c8372b',
              rows: [
                'Handover at the desk, from memory and scraps of paper',
                'Pending actions spoken, not written',
                'Median 11 seconds per patient',
                'No question invited',
                'Two information-loss incidents in 12 months'
              ]
            },
            {
              title: 'After',
              accent: '#0e9d6d',
              rows: [
                'Bedside handover with a printed patient list',
                'Actions written on the board with an owner and a time',
                'Median 41 seconds per patient, 84 for the unstable',
                '“Anything you want to check?” asked every time',
                'No information-loss incidents in the following 14 months'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'selectAll',
          poolTitle: 'Final check',
          pass: 100,
          gate: true,
          questions: [
            {
              prompt: 'Select everything that makes a pending action likely to survive the next shift.',
              feedback:
                'Written, owned and timed. Any one of the three missing and the action depends on memory.',
              answers: [
                { text: 'It is written down somewhere the incoming staff will look', correct: true, score: 5 },
                { text: 'A named person owns it', correct: true, score: 5 },
                { text: 'It has a time by which it should happen', correct: true, score: 5 },
                { text: 'It has an escalation trigger if it does not happen', correct: true, score: 5 },
                { text: 'It was mentioned clearly during handover', score: 0 },
                { text: 'It is recorded in the medical notes from earlier in the day', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of the last handover you gave. Did you say anything about what you were unsure of, or worried about? If not, what would you have said about the patient you thought about on the way home?',
          size: 'medium'
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take one of these to your next shift. The written action is the highest-value change.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will write every pending action with an owner and a time', required: false },
            { text: 'I will say the thing I am worried about, even without numbers', required: false },
            { text: 'I will hand over trajectory, not just current numbers', required: false },
            { text: 'I will state ceiling of care for every patient who has one', required: false },
            { text: 'I will ask “anything you want to check?” and wait for the answer', required: false },
            { text: 'I will never skip a stable patient entirely', required: false },
            { text: 'I will hold sensitive items until we are away from the bedside', required: false }
          ]
        },
        {
          t: 'quote',
          text:
            'The nurse in incident two had the information. She had it as a feeling, decided a feeling was not worth handing over, and went home. We have told people ever since: hand over the feeling.',
          by: 'Deputy Director of Nursing, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
