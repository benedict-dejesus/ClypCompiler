// Meridian Health Systems — course 9 of 10.
// Driven by a 22% rise in physical assaults on staff and de-escalation
// training completion of 41%.
import type { CourseTemplate } from '../types'

export const meridianAggression: CourseTemplate = {
  id: 'meridian-health-aggression',
  title: 'Before It Becomes Physical: De-escalation on the Ward',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Physical assaults on staff rose 22% in 12 months and verbal abuse incidents rose 34%. ' +
    'De-escalation training completion stands at 41%. Incident review shows a recognisable ' +
    'escalation period averaging 9 minutes before 71% of physical incidents, during which no ' +
    'de-escalation attempt was recorded.',
  audience: 'All ward-based clinical staff, healthcare assistants, reception and portering staff',
  summary:
    'Most assaults are preceded by nine minutes of visible escalation. This course covers reading ' +
    'those minutes, the interventions that actually lower arousal, and what to do when they do not work.',
  objectives: [
    'Recognise the behavioural phases that precede physical aggression',
    'Apply de-escalation techniques that lower arousal rather than raise it',
    'Disengage safely and summon help when de-escalation fails',
    'Report incidents accurately and access support afterwards'
  ],
  minutes: 27,
  themeId: 'plum',
  tags: ['violence prevention', 'staff safety', 'de-escalation', 'clinical'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Reads the Signs', icon: '👀', kind: 'lesson', lesson: 2 },
      { label: 'Lowers the Heat', icon: '🕊', kind: 'lesson', lesson: 3 },
      { label: 'Safety Champion', icon: '🛡', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    {
      title: 'Nine Minutes of Warning',
      description: 'What our incident reports show about what happens first.',
      badgeIcon: '📈',
      blocks: [
        { t: 'heading', text: 'Aggression is almost never sudden' },
        {
          t: 'para',
          html:
            'We reviewed <b>214 incidents</b> of verbal or physical aggression. In <b>71%</b> of the ' +
            'physical incidents, staff statements describe a recognisable escalation period averaging ' +
            '<b>nine minutes</b>. In only 18% of those was any de-escalation attempt recorded.'
        },
        {
          t: 'chart',
          title: 'Recorded trigger for the incident (%, n=214)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Waiting with no information', value: 27, accent: '#7b2d8b' },
            { label: 'Being told “no”', value: 21, accent: '#7b2d8b' },
            { label: 'Pain not addressed', value: 16, accent: '#c86dd7' },
            { label: 'Delirium or confusion', value: 15, accent: '#c86dd7' },
            { label: 'Alcohol or substance', value: 12, accent: '#c86dd7' },
            { label: 'No identifiable trigger', value: 9, accent: '#4a6fa5' }
          ]
        },
        {
          t: 'para',
          html:
            'Two findings matter here. First, the largest single trigger — <b>waiting without ' +
            'information</b> — is entirely within our control. Second, only 9% had no identifiable ' +
            'trigger, which means the overwhelming majority were, in principle, foreseeable.'
        },
        {
          t: 'comparison',
          title: 'What aggression costs us',
          preset: 'currentFuture',
          layout: 'horizontal',
          columns: [
            {
              title: 'Last 12 months',
              accent: '#c8372b',
              rows: [
                '214 recorded incidents, 38 involving physical contact',
                '11 staff injuries requiring treatment',
                '186 lost working days',
                '4 staff resignations citing safety as a factor',
                'Estimated £214,000 in cover, treatment and turnover'
              ]
            },
            {
              title: 'What is reachable',
              accent: '#0e9d6d',
              rows: [
                'Wards with >80% training completion report 44% fewer physical incidents',
                'Proactive waiting-time updates reduce the largest trigger category',
                'Early recognition converts most incidents into conversations',
                'Reporting rates rise, which improves the data we act on',
                'Staff retention improves where people feel supported afterwards'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'What the data shows',
          gate: true,
          questions: [
            {
              prompt: 'What is the single most useful implication of the nine-minute escalation period?',
              feedback:
                'A visible escalation period means there is a window in which intervention is possible — and we are currently using it in fewer than one in five cases.',
              answers: [
                {
                  text: 'There is a window for intervention that we currently mostly miss',
                  correct: true,
                  feedback: 'Yes. De-escalation was attempted in only 18% of the incidents that had a clear build-up.'
                },
                {
                  text: 'Staff should withdraw as soon as a patient raises their voice',
                  feedback: 'Premature withdrawal removes the chance to de-escalate and often escalates further.'
                },
                {
                  text: 'Most aggression is unpredictable and cannot be prevented',
                  feedback: 'Only 9% had no identifiable trigger. The rest were foreseeable.'
                },
                {
                  text: 'Security should attend all agitated patients',
                  feedback: 'A security presence can raise arousal. It is a response to failed de-escalation, not a substitute for it.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Reading the Build-Up',
      description: 'The four phases, and what each one looks like.',
      badgeIcon: '👀',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'Intervene early and it is a conversation' },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered all four phases. Almost every intervention works in phases 1 and 2.',
          panels: [
            {
              title: 'Phase 1 — Anxiety',
              body:
                'Restlessness, pacing, repeated questions, tapping, difficulty settling, checking the clock or the door repeatedly.\n\n' +
                '<b>What works here:</b> acknowledgement and information. “You have been waiting a while and nobody has told you anything. Let me find out and come back with a time.”\n\n' +
                'Almost every incident is preventable at this phase, and it is the phase we walk past most often because nothing has happened yet.'
            },
            {
              title: 'Phase 2 — Verbal escalation',
              body:
                'Raised voice, sarcasm, swearing, complaints about staff, personal remarks, refusal to engage with explanations.\n\n' +
                '<b>What works here:</b> lowering your own volume and slowing your speech, naming the emotion, offering a concrete next step. Do not defend the organisation and do not explain policy — neither reduces arousal.\n\n' +
                'This is the last phase in which rational discussion works.'
            },
            {
              title: 'Phase 3 — Threat',
              body:
                'Standing over, invading personal space, pointing, clenched fists, direct threats, blocking exits, throwing or striking objects.\n\n' +
                '<b>What works here:</b> increase distance, keep your exit clear, summon help, stop trying to reason. Reasoning at this phase is heard as challenge.\n\n' +
                'Give one clear behavioural instruction: “I need you to step back and sit down so I can help you.” Repeat it calmly. Do not add.'
            },
            {
              title: 'Phase 4 — Physical',
              body:
                'Contact has occurred or is imminent.\n\n' +
                '<b>What works here:</b> disengage, alarm, protect others, get behind a barrier. Nothing else.\n\n' +
                'You are not expected to restrain. Restraint is a last resort by trained staff where there is immediate risk of serious harm. Your job at this phase is distance and help.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Escalation phases',
          prompt: 'Put the phases of escalation into the order they typically occur.',
          pass: 100,
          attempts: 3,
          gate: true,
          items: [
            'Anxiety — restlessness, repeated questions, pacing',
            'Verbal escalation — raised voice, swearing, personal remarks',
            'Threat — space invasion, pointing, direct threats',
            'Physical — contact or imminent contact'
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Spotting phase 1',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'Which of these are phase 1 signals worth responding to now? Select all that apply.',
              feedback:
                'Phase 1 is where intervention is cheapest and most effective — and where we most often do nothing because nothing has happened yet.',
              answers: [
                { text: 'A relative repeatedly walking to the nurses’ station and back', correct: true, score: 5 },
                { text: 'A patient asking the same question about their discharge four times', correct: true, score: 5 },
                { text: 'Someone standing in the corridor watching the clock', correct: true, score: 5 },
                { text: 'A patient who cannot settle and keeps sitting up and lying down', correct: true, score: 5 },
                { text: 'A relative sitting quietly reading', score: 0 },
                { text: 'A patient asleep after analgesia', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'What Actually Lowers Arousal',
      description: 'The techniques that work, and the instincts that make it worse.',
      badgeIcon: '🕊',
      blocks: [
        { t: 'heading', text: 'Almost every instinct is wrong' },
        {
          t: 'para',
          html:
            'Under threat we get louder, faster, closer and more logical. Every one of those raises ' +
            'arousal in the other person. Effective de-escalation is mostly a matter of doing the ' +
            'opposite of what feels natural.'
        },
        {
          t: 'comparison',
          title: 'Instinct versus technique',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'Raises arousal',
              accent: '#c8372b',
              rows: [
                'Matching their volume to be heard',
                'Standing square-on with arms folded',
                'Explaining the policy and why the wait is unavoidable',
                '“Calm down” — heard as dismissal, every time',
                'Multiple staff talking at once',
                'Standing over a seated person',
                'Saying “I understand” when you plainly do not'
              ]
            },
            {
              title: 'Lowers arousal',
              accent: '#0e9d6d',
              rows: [
                'Dropping your volume below theirs so they quieten to hear you',
                'Standing at a slight angle, hands visible and open',
                'Acknowledging the feeling before any explanation',
                '“You have every reason to be angry about this.”',
                'One person speaks; everyone else steps back',
                'Sitting down, or inviting them to sit',
                '“Tell me what has happened” — and then not interrupting'
              ]
            }
          ]
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Step 1',
              heading: 'Manage yourself first',
              body:
                'Slow your breathing before you speak. Your arousal is contagious and it is visible in your voice before you notice it.\n\n' +
                'Keep 2–3 metres of distance and a clear route to the door — for both of you. A person who feels cornered escalates.'
            },
            {
              caption: 'Step 2',
              heading: 'Name the emotion, not the behaviour',
              body:
                '“You are furious, and I would be too if I had been sitting here four hours with nobody telling me anything.”\n\n' +
                'Naming the emotion accurately does more to reduce arousal than any explanation. Naming the behaviour — “you are shouting” — is heard as criticism and escalates.'
            },
            {
              caption: 'Step 3',
              heading: 'Give something concrete',
              body:
                'Arousal falls when uncertainty falls. Offer the smallest real thing you can deliver: a time, a name, a drink, a chair, a private room.\n\n' +
                '“I cannot make the doctor come faster. I can find out exactly where you are in the queue and tell you in five minutes.” Then do it in five minutes.'
            },
            {
              caption: 'Step 4',
              heading: 'Offer a choice',
              body:
                'Aggression is often a response to powerlessness. Restoring a small choice restores agency.\n\n' +
                '“Would you rather wait here or in the quiet room?” Two acceptable options, both of which you can honour.'
            },
            {
              caption: 'Step 5',
              heading: 'Set a boundary once, calmly',
              body:
                'If behaviour must stop, say it once, plainly, with the consequence: “I want to help you and I cannot while you are shouting at me. If it continues I will have to step away and call security.”\n\n' +
                'Say it once. Repeating it becomes an argument, and an argument is a contest to be won.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Choosing the response',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'A relative has been waiting three hours and is now shouting at the desk that nobody cares. What is your first move?',
              answers: [
                {
                  text: 'Lower your voice, acknowledge the anger as reasonable, and offer a concrete next step',
                  correct: true,
                  feedback:
                    'Correct. Acknowledgement before explanation, volume down, and something specific you can actually deliver.'
                },
                {
                  text: 'Explain that the department is short-staffed and everyone is doing their best',
                  feedback:
                    'A justification. It is true and it does not reduce arousal — it tells him his anger is unreasonable.'
                },
                {
                  text: 'Ask him to calm down so you can help him',
                  feedback: '“Calm down” is the single most reliably escalating phrase in our incident reports.'
                },
                {
                  text: 'Call security immediately as a precaution',
                  feedback:
                    'This is phase 2, not phase 3. A security presence here frequently escalates rather than settles.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'When It Does Not Work',
      description: 'Disengaging safely, and why leaving is not failing.',
      badgeIcon: '🚪',
      themeId: 'midnight',
      blocks: [
        { t: 'heading', text: 'You are not required to stay and absorb it' },
        {
          t: 'conversation',
          template: 'corporateChat',
          gate: true,
          cast: [
            {
              key: 'rel',
              name: 'Patient’s brother',
              role: 'customer',
              gender: 'male',
              age: 'adult',
              tone: 'medium'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'At the nurses’ station',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'rel',
                  text:
                    'Four hours. Four hours and not one of you has come near her. What exactly are you all doing back there?',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ],
              choices: [
                {
                  label: '“Four hours with no update is not acceptable. Let me find out where she is and come back in five minutes.”',
                  to: 'settling',
                  feedback: 'Acknowledgement plus a concrete, deliverable commitment. This works in the large majority of phase-2 situations.'
                },
                {
                  label: '“We are extremely busy and there are sicker patients than your sister.”',
                  to: 'worse',
                  feedback: 'True, and it tells him his sister does not matter. This is a reliable escalator.'
                },
                {
                  label: '“I need you to lower your voice.”',
                  to: 'worse',
                  feedback: 'A boundary before any acknowledgement lands as pure control and usually escalates.'
                }
              ]
            },
            {
              key: 'settling',
              name: 'It begins to settle',
              background: 'hospital',
              dialogue: [
                {
                  who: 'rel',
                  text:
                    'Five minutes. Fine. Nobody has told us anything since we arrived and she is frightened.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: 'Get the information and return within five minutes as promised',
                  to: 'end-good',
                  feedback: 'The return is the whole intervention. A broken promise here is worse than never offering.'
                },
                {
                  label: 'Get caught up in another task and return in twenty',
                  to: 'worse',
                  feedback: 'The unkept commitment confirms his belief that nobody cares, and the next escalation is faster.'
                }
              ]
            },
            {
              key: 'worse',
              name: 'It escalates',
              background: 'hospital',
              dialogue: [
                {
                  who: 'rel',
                  text:
                    'Do not walk away from me. I am talking to you. Look at me when I am talking to you.',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ],
              choices: [
                {
                  label: 'Increase distance, keep your exit clear, and give one calm instruction',
                  to: 'disengage',
                  feedback: 'Correct. This is phase 3 — reasoning is over, distance and help are the priority.'
                },
                {
                  label: 'Stand your ground and continue explaining',
                  to: 'end-bad',
                  feedback: 'Continuing to reason at phase 3 is heard as challenge.'
                }
              ]
            },
            {
              key: 'disengage',
              name: 'Disengaging',
              background: 'hospital',
              dialogue: [
                {
                  who: 'rel',
                  text: 'Where do you think you are going?',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                {
                  label: 'Move behind the desk, press the alarm, and state clearly that help is coming',
                  to: 'end-safe',
                  feedback: 'Barrier, alarm, clarity. That is the correct sequence at phase 3–4.'
                }
              ]
            },
            {
              key: 'end-good',
              name: 'Outcome — settled in five minutes',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'A conversation, not an incident',
              outcomeDescription:
                'You returned in four minutes with a name and a realistic time. He apologised. The whole intervention cost about six minutes and prevented an incident that averages 4.9 lost working days when it goes the other way. Waiting without information is our largest trigger and our cheapest fix.',
              dialogue: [
                {
                  who: 'rel',
                  text: 'Sorry for shouting. I just needed somebody to tell me something.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-safe',
              name: 'Outcome — disengaged safely',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Nobody was hurt',
              outcomeDescription:
                'You disengaged before contact, summoned help, and the situation was managed by the response team. Leaving was the correct clinical decision, not a failure of nerve. It was reported on Datix, and the ward reviewed why a four-hour wait had gone unacknowledged.',
              dialogue: [
                {
                  who: 'rel',
                  text: 'Fine. Fine. Get somebody who will actually talk to me.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ]
            },
            {
              key: 'end-bad',
              name: 'Outcome — physical contact',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Contact was made',
              outcomeDescription:
                'Continuing to reason at phase 3 kept you within reach and read as challenge. You were pushed against the desk. This accounts for a meaningful share of our 38 physical incidents — not because staff did anything wrong, but because the instinct to keep explaining is very strong and very hard to override.',
              dialogue: [
                {
                  who: 'rel',
                  text: 'I said do not walk away from me.',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'At phase 3, in order:',
          done: 'That is the sequence. Distance first, help second, everything else after.',
          mode: 'allRequired',
          items: [
            { text: 'Increase distance and put furniture between you if possible' },
            { text: 'Check your exit route is clear and stay between the person and the door only if it is safe' },
            { text: 'Stop reasoning — give one short behavioural instruction' },
            { text: 'Press the alarm or call for help' },
            { text: 'Move other patients and visitors away if you can do so safely' },
            { text: 'Do not attempt restraint unless trained and there is immediate serious risk' }
          ]
        }
      ]
    },
    {
      title: 'Afterwards',
      description: 'Reporting honestly, and being supported properly.',
      badgeIcon: '🛡',
      blocks: [
        { t: 'heading', text: 'Under-reporting is why the data is wrong' },
        {
          t: 'para',
          html:
            'Our staff survey found <b>58%</b> of staff who had experienced verbal abuse in the previous ' +
            'month did not report it. The commonest reasons: “it is part of the job” (44%), “nothing will ' +
            'change” (31%), and “the patient was confused so it did not count” (28%).'
        },
        {
          t: 'para',
          html:
            'A patient with delirium cannot be held responsible for their behaviour — <b>and the incident ' +
            'still gets reported</b>. Reporting is not a judgement about blame. It is how staffing, ' +
            'environment and case-mix risks become visible.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'What to report',
              body:
                'All of it. Physical contact, threats, racist or sexist abuse, sexual harassment, verbal aggression, and near-misses where you disengaged before contact.\n\n' +
                'Report it even where the person lacked capacity, even where you were not injured, and even where you handled it well. Especially then — a successful de-escalation is exactly the data we need.'
            },
            {
              title: 'How to write it',
              body:
                'Facts and behaviour, not conclusions. “Shouted, pointed within 30cm of my face, refused three requests to step back” rather than “was aggressive”.\n\n' +
                'Record what you did, what worked and what did not, and note the trigger if you identified one. Trigger data is what lets us fix the waiting-time problem behind 27% of incidents.'
            },
            {
              title: 'Support afterwards',
              body:
                'You are entitled to step off the floor. Tell the nurse in charge, and take the time — our policy specifically permits it and no one needs to justify it.\n\n' +
                'A hot debrief with whoever was present, on the same shift, is the single most protective intervention against lasting distress. The staff support line is confidential and is not reported to your manager.\n\n' +
                'Persistent sleep disturbance, avoidance of particular patients or areas, or dread before shifts are all reasons to seek occupational health. They are common and they are treatable.'
            },
            {
              title: 'What the Trust will do',
              body:
                'Meridian will support prosecution where there has been an assault and the person had capacity. You are not required to decide that alone or immediately.\n\n' +
                'Yellow and red card warning letters are issued for abusive behaviour by visitors. Repeat offenders can be restricted or excluded.\n\n' +
                'Where the trigger was systemic — waiting times, environment, staffing — that goes to the ward improvement plan, and you are entitled to know what happened as a result.'
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
              prompt: 'Select every incident that should be reported.',
              feedback:
                'All of them. Capacity, injury and your own competence in handling it are all irrelevant to whether it is reported.',
              answers: [
                { text: 'A patient with dementia scratched your arm during personal care', correct: true, score: 5 },
                { text: 'A visitor swore at you and called you incompetent', correct: true, score: 5 },
                { text: 'A patient made a racist remark to a colleague', correct: true, score: 5 },
                { text: 'Someone raised a fist and you disengaged before contact', correct: true, score: 5 },
                { text: 'You de-escalated a threatening situation successfully', correct: true, score: 5 },
                { text: 'A patient thanked you sarcastically', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take one to your next team meeting. The waiting-time update is the highest-value change available to most wards.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will respond at phase 1 rather than waiting for something to happen', required: false },
            { text: 'I will lower my volume rather than raise it', required: false },
            { text: 'I will acknowledge the feeling before explaining anything', required: false },
            { text: 'I will never say “calm down”', required: false },
            { text: 'I will give proactive waiting-time updates without being asked', required: false },
            { text: 'I will disengage at phase 3 rather than keep reasoning', required: false },
            { text: 'I will report every incident, including ones I handled well', required: false },
            { text: 'I will take the offered time off the floor rather than carrying on', required: false }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of the last time someone was aggressive towards you at work. Did you report it? If not, which of the three common reasons was yours — and would you make the same choice now?',
          size: 'medium'
        },
        {
          t: 'quote',
          text:
            'Twenty-seven per cent of our incidents start with somebody waiting and nobody telling them anything. That is not a violence problem. That is a communication problem that becomes a violence problem.',
          by: 'Head of Health, Safety and Security, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
