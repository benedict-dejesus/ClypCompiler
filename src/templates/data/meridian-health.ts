// Meridian Health Systems — regional hospital network (1,400 clinical staff,
// 3 acute sites, 11 outpatient clinics). Courses target measured gaps from
// audit findings, incident reviews and patient-experience data.
import type { CourseTemplate } from '../types'

export const meridianHandHygiene: CourseTemplate = {
  id: 'meridian-health-hand-hygiene',
  title: 'Hand Hygiene That Actually Holds',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Observed hand-hygiene compliance sits at 62% against a 90% target. Staff can recite the ' +
    'Five Moments but miss them under time pressure, particularly moment 1 (before patient contact) ' +
    'and moment 4 (after patient contact) during fast ward rounds.',
  audience: 'Ward nurses, healthcare assistants, allied health and medical staff on acute wards',
  summary:
    'Closes the gap between knowing the Five Moments and performing them when the ward is busy. ' +
    'Builds recognition speed, handles the real objections, and rehearses the awkward moment of ' +
    'challenging a colleague.',
  objectives: [
    'Identify all Five Moments for Hand Hygiene in live ward situations',
    'Choose correctly between alcohol gel and soap and water, including for C. difficile',
    'Complete the WHO rub technique covering all eight surfaces',
    'Speak up when a colleague misses a moment, using a non-confrontational script'
  ],
  minutes: 25,
  themeId: 'forest',
  tags: ['infection control', 'patient safety', 'compliance', 'clinical'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Five Moments', icon: '🖐', kind: 'lesson', lesson: 2 },
      { label: 'Speaks Up', icon: '🗣', kind: 'lesson', lesson: 4 },
      { label: 'Infection Champion', icon: '🛡', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'Why 62% Is Not a Pass Mark',
      description: 'What our own numbers say, and what they cost in real patient harm.',
      badgeIcon: '📊',
      blocks: [
        { t: 'heading', text: 'Our compliance gap, in our own numbers' },
        {
          t: 'para',
          html:
            'Between January and June, our infection-prevention team completed <b>2,840 direct ' +
            'observations</b> across the three acute sites. Hand hygiene was performed correctly in ' +
            '<b>62%</b> of observed opportunities. The Trust target is 90%.'
        },
        {
          t: 'para',
          html:
            'That 28-point gap is not evenly spread. It clusters in two places: <b>before touching a ' +
            'patient</b> and <b>after touching a patient</b> — precisely the moments that break the ' +
            'chain of transmission between one bed and the next.'
        },
        {
          t: 'chart',
          title: 'Compliance by moment (observed, Jan–Jun)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: '1. Before patient', value: 51, accent: '#b3543f' },
            { label: '2. Before aseptic', value: 84, accent: '#2b7a3f' },
            { label: '3. After fluid risk', value: 88, accent: '#2b7a3f' },
            { label: '4. After patient', value: 55, accent: '#b3543f' },
            { label: '5. After surroundings', value: 47, accent: '#b3543f' }
          ]
        },
        {
          t: 'para',
          html:
            'The pattern tells us something useful: compliance is high where the risk feels obvious ' +
            'and personal — after blood, before a sterile procedure. It collapses where the risk is ' +
            'invisible and the patient harmed is the <i>next</i> one, not the one in front of you.'
        },
        {
          t: 'comparison',
          title: 'What the gap costs',
          preset: 'currentFuture',
          layout: 'horizontal',
          columns: [
            {
              title: 'At 62% (today)',
              accent: '#b3543f',
              rows: [
                '38 healthcare-associated infections attributed to contact transmission last year',
                'Average 6.4 additional bed-days per HCAI',
                '£2,900 average additional cost per case',
                '2 serious incident investigations, both citing hand hygiene',
                'Ward closures during two norovirus outbreaks'
              ]
            },
            {
              title: 'At 90% (target)',
              accent: '#2b7a3f',
              rows: [
                'Modelled reduction of 21–24 HCAIs per year',
                'Roughly 140 bed-days released back to the system',
                'Approximately £68,000 avoided direct cost',
                'Fewer outbreak-driven bed closures in winter',
                'Materially lower risk of avoidable patient death'
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'I have never met a colleague who did not care about infection. I have met plenty who ' +
            'were three patients behind and reached for the curtain instead of the gel.',
          by: 'Ward Sister, Meridian Central — infection review panel',
          pull: true
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Orientation check',
          gate: true,
          questions: [
            {
              prompt:
                'Our compliance is weakest at moments 1, 4 and 5. What do those three moments have in common?',
              feedback:
                'They protect someone other than the person in front of you — which is exactly why they get skipped under pressure.',
              answers: [
                {
                  text: 'The risk is invisible and the person protected is the next patient',
                  correct: true,
                  feedback: 'Right. No blood, no visible dirt, no immediate consequence — so the brain deprioritises it.'
                },
                {
                  text: 'They require soap and water rather than gel',
                  feedback: 'Not so — most of these moments are gel-appropriate unless hands are soiled.'
                },
                {
                  text: 'They apply only to nursing staff',
                  feedback: 'They apply to everyone who touches a patient or their surroundings.'
                },
                {
                  text: 'They are optional under the Trust policy',
                  feedback: 'None of the Five Moments are optional.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'The Five Moments, On a Real Ward',
      description: 'Each moment anchored to something you physically do on a bay round.',
      badgeIcon: '🖐',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'Five moments, five physical triggers' },
        {
          t: 'para',
          html:
            'The Five Moments are easy to recite and easy to miss. The fix is to attach each one to a ' +
            '<b>physical trigger</b> — something your hands actually do — instead of a number you have ' +
            'to recall.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have worked through all five moments. These are the triggers to carry onto the ward.',
          panels: [
            {
              title: 'Moment 1 — Before touching a patient',
              body:
                '<b>Trigger: your hand reaches for the curtain or bed rail.</b> That is the line. Gel before you cross it, not after you have said hello.\n\n' +
                'This protects the patient from organisms you picked up in the corridor, at the desk, or from the previous bay. It is our weakest moment at 51%, and it is the one that most often carries MRSA from bed to bed.\n\n' +
                'Common miss: you gel at the bay entrance, then touch three bed rails on the way to the patient you actually want. The gel is now irrelevant.'
            },
            {
              title: 'Moment 2 — Before a clean or aseptic procedure',
              body:
                '<b>Trigger: you open a pack, or put on sterile gloves.</b> Cannulation, catheter care, wound dressing, injection preparation, mouth care.\n\n' +
                'We score 84% here because the risk is obvious and the procedure has a ritual attached. Note that gloves are not a substitute — you decontaminate <i>before</i> putting them on, because gloves have micro-perforations and hands get contaminated during donning.'
            },
            {
              title: 'Moment 3 — After body fluid exposure risk',
              body:
                '<b>Trigger: you remove gloves after any contact with fluid.</b> Blood, urine, stool, sputum, wound exudate, vomit — and this applies even if you saw nothing on your hands.\n\n' +
                'Our strongest moment at 88%. Important: this is the moment where <b>soap and water is mandatory</b> if hands are visibly soiled, and for any patient with suspected or confirmed <i>C. difficile</i>, alcohol gel does not kill spores.'
            },
            {
              title: 'Moment 4 — After touching a patient',
              body:
                '<b>Trigger: you step back from the bed.</b> Before you touch the notes, the computer on wheels, your pen, or the next patient.\n\n' +
                'At 55%, this is where transmission to the wider ward begins. The organisms are now on the keyboard, the drug chart, the door handle. Everything you touch between here and your next gel becomes a vehicle.'
            },
            {
              title: 'Moment 5 — After touching patient surroundings',
              body:
                '<b>Trigger: you touch anything inside the bed space without touching the patient.</b> Adjusting the pump, moving the table, straightening the sheet, silencing an alarm.\n\n' +
                'Our lowest at 47%, and the least intuitive. The evidence is unambiguous: the immediate patient environment is as heavily colonised as the patient. A bed rail carries the same organisms as the hand that gripped it.'
            }
          ]
        },
        {
          t: 'timeline',
          preset: 'vertical',
          events: [
            {
              label: 'You enter the bay',
              date: '08:12',
              body: 'Gel at the dispenser. This covers you until you touch something.'
            },
            {
              label: 'You steady yourself on bed 3’s rail to reach bed 4',
              date: '08:13',
              body: 'Moment 5 triggered. Your earlier gel is now void. Most people do not re-gel here — this is the single most common breach on a round.'
            },
            {
              label: 'You take bed 4’s pulse',
              date: '08:13',
              body: 'Moment 1 was required before this contact and was missed. Bed 3’s organisms are now on bed 4.'
            },
            {
              label: 'You type observations into the computer on wheels',
              date: '08:15',
              body: 'Moment 4 was required. The keyboard is now contaminated for every colleague who uses it today.'
            },
            {
              label: 'A colleague uses the same keyboard and goes to bed 1',
              date: '08:21',
              body: 'The chain is complete. Nobody did anything obviously wrong, and an organism crossed three patients in nine minutes.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'selectAll',
          poolTitle: 'Spot every moment',
          pass: 100,
          gate: true,
          questions: [
            {
              prompt:
                'You adjust an infusion pump, then reposition the patient’s pillow, then leave to answer a phone. Select every hand-hygiene moment that applies.',
              feedback:
                'Touching equipment in the bed space is moment 5; touching the patient is moment 1 before and moment 4 after. Three decontaminations in that sequence.',
              answers: [
                { text: 'Before touching the infusion pump (moment 5 applies on leaving the space)', correct: true, score: 5 },
                { text: 'Before touching the patient to reposition the pillow — moment 1', correct: true, score: 5 },
                { text: 'After touching the patient — moment 4', correct: true, score: 5 },
                { text: 'Before answering the phone outside the bay — moment 5', correct: true, score: 5 },
                { text: 'No hand hygiene is needed because gloves were worn throughout', score: 0 },
                { text: 'Only once, on leaving the bay', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'Gel or Sink? Getting the Choice Right',
      description: 'When alcohol works, when it fails outright, and how to rub properly.',
      badgeIcon: '🧼',
      blocks: [
        { t: 'heading', text: 'Alcohol gel is the default — with three hard exceptions' },
        {
          t: 'para',
          html:
            'Alcohol hand rub is faster, kinder to skin, and more effective than soap for most organisms. ' +
            'It is the default at every moment. But it fails completely in three situations, and knowing ' +
            'them is the difference between decontaminating and pretending to.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'Use gel',
              body:
                'Your hands are visibly clean and you are performing any of the Five Moments in routine care.\n\n' +
                'Gel is faster (20–30 seconds versus 40–60 at a sink), can be done at the bedside without breaking your workflow, and causes less skin damage than repeated washing. Damaged skin harbours more organisms, so this matters clinically, not just for comfort.\n\n' +
                'Use enough to keep hands wet for the full rub time. If your hands are dry in ten seconds, you did not use enough — that is roughly a full pump, not a squirt.'
            },
            {
              title: 'Use soap and water',
              body:
                '<b>1. Hands are visibly soiled or feel sticky.</b> Alcohol does not remove organic matter, and organic matter shields organisms from the alcohol.\n\n' +
                '<b>2. Suspected or confirmed <i>C. difficile</i>.</b> Alcohol does not kill spores. It moves them around. Physical removal under running water is the only effective action — this is non-negotiable and applies to gloved hands after glove removal too.\n\n' +
                '<b>3. Suspected or confirmed norovirus, or any outbreak of diarrhoea and vomiting.</b> Non-enveloped viruses resist alcohol.'
            },
            {
              title: 'The technique that actually works',
              body:
                'Compliance audits count the action; effectiveness depends on coverage. The most commonly missed surfaces are <b>thumbs</b>, <b>fingertips</b> and the <b>web spaces between fingers</b> — which are precisely the surfaces that touch patients most.\n\n' +
                'Fingertips carry the highest organism load of any part of the hand and are missed in roughly a third of observed rubs.\n\n' +
                'Wrists count if your sleeves are up, and sleeves must be up: bare below the elbow is policy, not preference.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'WHO rub technique',
          prompt: 'Put the eight steps of the WHO hand-rub technique into the correct order.',
          pass: 80,
          gate: true,
          items: [
            'Apply a full pump of product to a cupped palm',
            'Rub palm to palm',
            'Right palm over left dorsum with fingers interlaced, then reverse',
            'Palm to palm with fingers interlaced',
            'Backs of fingers to opposing palms with fingers interlocked',
            'Rotational rubbing of each thumb clasped in the opposite palm',
            'Rotational rubbing of fingertips in the opposite palm',
            'Continue until hands are completely dry'
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'The exception that matters most',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'A patient in side room 2 has confirmed <i>C. difficile</i>. You wore gloves for personal care and your hands look clean after removing them. What do you do?',
              answers: [
                {
                  text: 'Wash with soap and water at the sink',
                  correct: true,
                  feedback:
                    'Correct. Alcohol does not kill C. difficile spores — only physical removal under running water does. Clean-looking hands are irrelevant here.'
                },
                {
                  text: 'Use alcohol gel — hands are visibly clean',
                  feedback:
                    'No. This is the single most dangerous substitution in the policy. Gel redistributes spores rather than removing them.'
                },
                {
                  text: 'Use gel now and wash at the end of the round',
                  feedback: 'By the end of the round the spores have been transferred to everything you touched.'
                },
                {
                  text: 'No decontamination needed as gloves were worn',
                  feedback:
                    'Gloves have micro-perforations and hands are contaminated during removal. Decontamination after glove removal is always required.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'Saying Something When It Matters',
      description: 'A short, repeatable script for challenging a missed moment — up or down the hierarchy.',
      badgeIcon: '🗣',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'The hardest part is not the gel' },
        {
          t: 'para',
          html:
            'In our staff survey, <b>71%</b> said they had seen a colleague miss a hand-hygiene moment in ' +
            'the previous week. <b>19%</b> said they said something. The most common reason given for ' +
            'staying silent was seniority — the person who missed it was more senior than the observer.'
        },
        {
          t: 'para',
          html:
            'A challenge that works is short, specific, non-accusatory, and gives the other person an easy ' +
            'exit. It is a <i>prompt</i>, not a judgement. The phrasing below is Trust-endorsed and you are ' +
            'covered by policy when you use it, regardless of grade.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Step 1',
              heading: 'Offer, do not accuse',
              body:
                '“Gel?” while holding out the bottle. Four letters and a gesture. It reads as help rather than criticism, and it works in front of patients without undermining anyone.'
            },
            {
              caption: 'Step 2',
              heading: 'If it is missed again, name it plainly',
              body:
                '“Sorry — could you gel before you touch him?” Specific, present-tense, no history, no tone. You are describing the next action, not grading the last one.'
            },
            {
              caption: 'Step 3',
              heading: 'If you are challenged back, hold the line once',
              body:
                '“I know it is a pain, but he is on the outbreak list.” Give the reason, once. You are not required to win an argument at the bedside.'
            },
            {
              caption: 'Step 4',
              heading: 'If it still does not happen, escalate — do not argue',
              body:
                'Tell the nurse in charge before the end of the shift. Escalation is not a disciplinary act; it is a patient-safety report. Use Datix if the patient was on precautions.'
            },
            {
              caption: 'Step 5',
              heading: 'Receive a challenge well',
              body:
                '“Thanks — good catch.” Then gel. Two words protect the culture that keeps the next patient safe. How seniors respond to challenge determines whether juniors ever challenge again.'
            }
          ]
        },
        {
          t: 'conversation',
          template: 'corporateChat',
          gate: true,
          cast: [
            {
              key: 'reg',
              name: 'Dr Adeyemi (Registrar)',
              role: 'doctor',
              gender: 'male',
              age: 'adult',
              tone: 'deep'
            }
          ],
          scenes: [
            {
              key: 'open',
              name: 'On the ward round',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'Right, bed 6 — let me just have a quick feel of that abdomen.',
                  expression: 'neutral',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: 'Hold out the gel: “Gel?”',
                  to: 'good',
                  feedback: 'The lightest possible intervention, and the most likely to work.'
                },
                {
                  label: 'Say nothing — he is senior and the round is running late',
                  to: 'silent',
                  feedback: 'Understandable, and the most common choice. It is also how the 62% stays at 62%.'
                },
                {
                  label: '“You have not cleaned your hands.”',
                  to: 'blunt',
                  feedback: 'Accurate, but framed as an accusation it invites defensiveness rather than gel.'
                }
              ]
            },
            {
              key: 'good',
              name: 'The offer lands',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text: 'Ah — thanks. Head somewhere else entirely this morning.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'Continue the round', to: 'end-good' }]
            },
            {
              key: 'blunt',
              name: 'It gets defensive',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text: 'I was going to. There is no need to announce it in front of the patient.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                {
                  label: '“Fair enough — I just did not want to assume.” Then move on.',
                  to: 'end-good',
                  feedback: 'You de-escalated without withdrawing the point. The gel still happened.'
                },
                {
                  label: 'Argue the policy at the bedside',
                  to: 'end-poor',
                  feedback: 'Being right in front of a patient rarely changes behaviour and damages the relationship you need tomorrow.'
                }
              ]
            },
            {
              key: 'silent',
              name: 'Nothing is said',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text: 'Fine, nothing acute there. Bed 7 next.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [{ label: 'See what happened next', to: 'end-poor' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — challenge worked',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'You changed the next action',
              outcomeDescription:
                'A four-letter prompt got hands decontaminated without embarrassing anyone. This is the entire skill — you are not trying to win, you are trying to get gel onto hands before contact.',
              dialogue: [
                {
                  who: 'reg',
                  text: 'Good catch. Genuinely — say it again if I do it again.',
                  expression: 'encouraging',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — the moment passed',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'The moment passed',
              outcomeDescription:
                'Bed 6 was on contact precautions for MRSA. The same hands examined bed 7 four minutes later. Nobody was careless and nobody was unkind — the prompt simply never happened. That is what 62% looks like from the inside.',
              dialogue: [
                {
                  who: 'reg',
                  text: 'Bed 7 — morning. Let us take a look.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of the last time you saw a moment missed and said nothing. What specifically stopped you — seniority, time, doubt about whether you were right, or something else? What one sentence could you have used instead?',
          size: 'large'
        }
      ]
    },
    // ---------------------------------------------------------------- 5 ---
    {
      title: 'Making It Stick on Your Ward',
      description: 'Commit to the specific changes that move your own numbers.',
      badgeIcon: '✅',
      blocks: [
        { t: 'heading', text: 'From knowing to doing' },
        {
          t: 'para',
          html:
            'Everything in this course is already Trust policy and most of it you already knew. The gap ' +
            'is not knowledge — it is the twenty seconds between intention and the bed rail. These are the ' +
            'four changes that our highest-performing wards made to close it.'
        },
        {
          t: 'comparison',
          title: 'What the 90% wards do differently',
          preset: 'correctIncorrect',
          layout: 'card',
          columns: [
            {
              title: 'Wards at 60–70%',
              accent: '#b3543f',
              rows: [
                'Gel at the bay entrance and treat it as covering the whole bay',
                'Audit results discussed at monthly governance only',
                'Challenge is seen as the infection team’s job',
                'Dispensers empty for hours before anyone reports it',
                'Bare-below-elbow enforced only when an auditor is visible'
              ]
            },
            {
              title: 'Wards at 88–94%',
              accent: '#2b7a3f',
              rows: [
                'Gel at the bed space, every bed, every time',
                'Yesterday’s observation result written on the ward board each morning',
                'Any grade challenges any grade, and seniors thank them for it',
                'Whoever finds an empty dispenser refills or reports it immediately',
                'Bare-below-elbow is simply how people arrive on shift'
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change on your next shift:',
          done: 'That is a real plan. Take it to your next team brief and say it out loud — commitments made publicly are far more likely to hold.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will gel at the bed space, not the bay entrance', required: false },
            { text: 'I will re-gel after touching equipment, even if I did not touch the patient', required: false },
            { text: 'I will use “Gel?” at least once when I see a moment missed', required: false },
            { text: 'I will thank anyone who challenges me, out loud, in front of others', required: false },
            { text: 'I will check the dispensers in my bay at the start of every shift', required: false },
            { text: 'I will use soap and water for every C. difficile and D&V patient without exception', required: false },
            { text: 'I will raise our ward’s observation score at the next team brief', required: false }
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
              prompt: 'Which of these require soap and water rather than alcohol gel? Select all that apply.',
              feedback:
                'Alcohol fails against spores and non-enveloped viruses, and cannot remove organic soiling.',
              answers: [
                { text: 'Confirmed C. difficile', correct: true, score: 5 },
                { text: 'Visibly soiled hands', correct: true, score: 5 },
                { text: 'An outbreak of diarrhoea and vomiting', correct: true, score: 5 },
                { text: 'Routine observations on a patient with no precautions', score: 0 },
                { text: 'Before putting on sterile gloves for cannulation', score: 0 }
              ]
            },
            {
              prompt:
                'A colleague thanks you for challenging them about hand hygiene. Why does that response matter beyond the single moment?',
              feedback:
                'How challenge is received determines whether it happens again. Culture is built in these two-second exchanges.',
              answers: [
                {
                  text: 'It makes it likelier that person will speak up next time they see something',
                  correct: true,
                  score: 5
                },
                {
                  text: 'It signals to juniors watching that challenge is safe here',
                  correct: true,
                  score: 5
                },
                { text: 'It removes the need to record the incident on Datix', score: 0 },
                { text: 'It transfers responsibility for the breach to the person who challenged', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'The ward that went from 64% to 91% did not run a single extra training session. They wrote yesterday’s number on the whiteboard every morning and the sister thanked people for challenging her.',
          by: 'Head of Infection Prevention and Control, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
