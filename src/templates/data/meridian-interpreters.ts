// Meridian Health Systems — course 10 of 10.
// Driven by the interpreting audit: family members used as interpreters in 33%
// of non-English consultations, including for consent and safeguarding.
import type { CourseTemplate } from '../types'

export const meridianInterpreters: CourseTemplate = {
  id: 'meridian-health-interpreters',
  title: 'Working With Interpreters, Not Around Them',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'An audit of 218 consultations requiring language support found a family member or friend ' +
    'interpreting in 33% of cases, including 14 consent discussions and 3 safeguarding conversations. ' +
    'Staff cite booking delay as the main reason. Mean time to connect telephone interpreting is ' +
    '4 minutes; staff estimate it at 25.',
  audience: 'All clinical staff, reception staff and anyone taking consent or histories from patients requiring language support',
  summary:
    'Using a family member to interpret feels faster and kinder. It is neither. This course covers ' +
    'why, how to work with a professional interpreter properly, and the situations where using ' +
    'family is never acceptable.',
  objectives: [
    'Explain why family and children must not be used as interpreters',
    'Access telephone, video and face-to-face interpreting within the actual service standards',
    'Run a three-way consultation that keeps the patient at the centre',
    'Recognise the situations where professional interpreting is mandatory without exception'
  ],
  minutes: 25,
  themeId: 'midnight',
  tags: ['communication', 'health inequality', 'consent', 'safeguarding'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Books It Properly', icon: '☎️', kind: 'lesson', lesson: 3 },
      { label: 'Patient at the Centre', icon: '🗣', kind: 'lesson', lesson: 4 },
      { label: 'Language Champion', icon: '🌍', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    {
      title: 'One in Three',
      description: 'What the audit found, and what it cost.',
      badgeIcon: '📊',
      blocks: [
        { t: 'heading', text: 'The shortcut we take a third of the time' },
        {
          t: 'para',
          html:
            'Our audit reviewed <b>218 consultations</b> where the patient required language support. ' +
            'A professional interpreter was used in 61%. In <b>33%</b> a family member or friend ' +
            'interpreted, and in 6% the consultation proceeded with no interpretation at all.'
        },
        {
          t: 'chart',
          title: 'Who interpreted (%, n=218)',
          chartType: 'donut',
          showValues: true,
          showLegend: true,
          points: [
            { label: 'Professional interpreter', value: 61, accent: '#4f6df5' },
            { label: 'Adult family member', value: 26, accent: '#c8372b' },
            { label: 'Child under 18', value: 7, accent: '#7b2d8b' },
            { label: 'No interpretation', value: 6, accent: '#b7791f' }
          ]
        },
        {
          t: 'para',
          html:
            'Seven per cent used a child. That included a 12-year-old asked to interpret her mother’s ' +
            'gynaecology appointment, and a 15-year-old who interpreted a discussion about his father’s ' +
            'prognosis. Both are breaches of Trust policy and both were recorded as routine.'
        },
        {
          t: 'timeline',
          preset: 'vertical',
          events: [
            {
              label: 'The consent that was not informed',
              date: 'Case 1',
              body: 'A patient consented to a laparoscopic procedure through her adult son. She later stated she had understood she was having a scan. The son confirmed he had simplified the explanation because he did not want to frighten her. The procedure was appropriate; the consent was not valid.'
            },
            {
              label: 'The safeguarding disclosure that was not made',
              date: 'Case 2',
              body: 'A woman attended with abdominal injuries, interpreted by her husband. She disclosed the cause at a later appointment with a professional interpreter present. The husband was the alleged perpetrator.'
            },
            {
              label: 'The symptom that was edited out',
              date: 'Case 3',
              body: 'A patient reported rectal bleeding. The interpreting daughter did not relay it, later explaining it was embarrassing for her mother. Diagnosis of colorectal cancer was delayed by seven months.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'What went wrong',
          gate: true,
          questions: [
            {
              prompt: 'What do all three cases have in common?',
              feedback:
                'In each, the family interpreter altered the message with good intentions. That is the predictable failure mode, not an unusual one.',
              answers: [
                {
                  text: 'The interpreter filtered the message to protect someone, and the clinician could not tell',
                  correct: true,
                  feedback:
                    'Exactly. Family members edit — to spare feelings, to avoid embarrassment, or to conceal. You cannot detect it.'
                },
                {
                  text: 'The family members did not speak English well enough',
                  feedback: 'Fluency was not the issue in any of the three. Filtering was.'
                },
                {
                  text: 'The clinicians did not ask enough questions',
                  feedback: 'More questions through the same filter produce more filtered answers.'
                },
                {
                  text: 'Professional interpreters were unavailable',
                  feedback: 'Telephone interpreting was available within minutes in all three cases.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Why Family Cannot Do This',
      description: 'Four reasons, none of which are about language ability.',
      badgeIcon: '🚫',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'This is not a judgement about their English' },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered all four. None of them depend on how well the relative speaks English.',
          panels: [
            {
              title: '1. They edit, and you cannot tell',
              body:
                'Relatives soften prognoses, omit embarrassing symptoms, skip questions they consider intrusive, and answer on the patient’s behalf.\n\n' +
                'They do this out of love, not obstruction. But you have no way of knowing it is happening — the words come back fluent and confident, and the missing symptom is simply absent.\n\n' +
                'This caused a seven-month cancer delay in Case 3.'
            },
            {
              title: '2. They have their own stake in the answer',
              body:
                'A relative may want a particular outcome: discharge home, continued treatment, no treatment, or no disclosure of something.\n\n' +
                'In safeguarding, domestic abuse, modern slavery and coercive control cases, the person interpreting may be the person causing harm. Case 2 is precisely that.\n\n' +
                'A patient cannot disclose abuse through the person abusing them.'
            },
            {
              title: '3. It harms the interpreter, especially children',
              body:
                'Asking a child to relay a cancer diagnosis, a miscarriage or a death places an adult burden on them, and it changes the family relationship permanently.\n\n' +
                'Trust policy is absolute: <b>under-18s must never interpret for clinical purposes</b>, including at reception, including for “simple” questions, including when they offer.\n\n' +
                'The only permitted use of a child is to establish which language is needed so an interpreter can be booked.'
            },
            {
              title: '4. Accuracy and accountability are absent',
              body:
                'Professional interpreters are trained in medical terminology, bound by a code of confidentiality, and accountable for accuracy. A relative is none of these.\n\n' +
                'There is no record of what was actually said, no professional standard, and nobody who can be asked afterwards what was interpreted. In a consent dispute or an inquest, “the son interpreted” is not a defensible position.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'When it must be a professional, without exception',
          preset: 'correctIncorrect',
          layout: 'stacked',
          columns: [
            {
              title: 'Professional interpreter mandatory',
              accent: '#c8372b',
              rows: [
                'Any consent discussion',
                'Any safeguarding conversation or disclosure',
                'Breaking bad news, diagnosis or prognosis',
                'Mental health and capacity assessments',
                'Anything involving domestic abuse, sexual health or termination',
                'Discharge planning where the patient must self-manage',
                'Any situation where the patient asks for one'
              ]
            },
            {
              title: 'A relative may assist only with',
              accent: '#0e9d6d',
              rows: [
                'Establishing which language is required',
                'Practical wayfinding — “the toilet is down the corridor”',
                'Comfort and reassurance while an interpreter is arranged',
                'Their own account as a witness, clearly recorded as such'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'When family cannot interpret',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'In which of these must a professional interpreter be used? Select all that apply.',
              feedback:
                'Consent, safeguarding, bad news, capacity and self-management all require professional interpreting without exception.',
              answers: [
                { text: 'Taking consent for an endoscopy', correct: true, score: 5 },
                { text: 'A conversation about suspected domestic abuse', correct: true, score: 5 },
                { text: 'Explaining a new cancer diagnosis', correct: true, score: 5 },
                { text: 'A mental capacity assessment', correct: true, score: 5 },
                { text: 'Teaching a patient to inject their own insulin before discharge', correct: true, score: 5 },
                { text: 'Asking a relative which language the patient speaks', score: 0 },
                { text: 'Directing a visitor to the café', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'It Takes Four Minutes',
      description: 'The gap between what staff think booking costs and what it actually costs.',
      badgeIcon: '☎️',
      blocks: [
        { t: 'heading', text: 'Staff estimate 25 minutes. The mean is four.' },
        {
          t: 'para',
          html:
            'When asked why they used a family member, <b>68%</b> of staff cited time. When asked how ' +
            'long telephone interpreting takes to connect, the mean estimate was <b>25 minutes</b>. The ' +
            'measured mean is <b>4 minutes 10 seconds</b>, and 87% of calls connect inside 6 minutes.'
        },
        {
          t: 'chart',
          title: 'Time to connect, by interpreting method',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Telephone (actual)', value: 4, accent: '#0e9d6d' },
            { label: 'Video (actual)', value: 7, accent: '#0e9d6d' },
            { label: 'Staff estimate for phone', value: 25, accent: '#c8372b' },
            { label: 'Face-to-face (pre-booked)', value: 0, accent: '#4f6df5' }
          ]
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'Telephone — the default',
              body:
                'Available 24 hours, over 200 languages, no booking required. Dial the interpreting line from any ward phone, give the Trust account code, state the language, and wait.\n\n' +
                'Use the speakerphone or a dual handset. Mean connection is four minutes — less time than it usually takes to find a relative and explain what you need.\n\n' +
                'This covers the overwhelming majority of unplanned need, including out of hours.'
            },
            {
              title: 'Video — for anything visual or sensitive',
              body:
                'Available on the ward tablets. Use it where facial expression matters, where the conversation is sensitive, and always for British Sign Language.\n\n' +
                'Mean connection seven minutes. Position the screen so the patient can see the interpreter and you can see the patient.'
            },
            {
              title: 'Face-to-face — book ahead',
              body:
                'Book at least 48 hours ahead through the interpreting portal for planned appointments, complex discussions, mental health assessments and anything likely to run long or be distressing.\n\n' +
                'Record the language and any dialect on the patient record so it is booked automatically next time. Dialect matters: booking “Arabic” for a Sudanese Arabic speaker frequently produces poor comprehension.'
            },
            {
              title: 'If it genuinely cannot wait',
              body:
                'In a true emergency where seconds count, proceed and arrange interpreting as soon as the immediate danger has passed. Then <b>revisit the conversation</b> with a professional interpreter and document both.\n\n' +
                'An emergency justifies proceeding without an interpreter. It does not retrospectively validate consent obtained through a relative, and it does not remove the duty to go back.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Getting an interpreter',
          prompt: 'Put the steps for arranging unplanned telephone interpreting into order.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Identify the language and any dialect, using the language identification card if needed',
            'Explain to the patient that you are getting a professional interpreter',
            'Dial the interpreting line and give the Trust account code',
            'State the language and wait for connection',
            'Note the interpreter’s ID number for the record',
            'Brief the interpreter in one sentence on what the conversation is about',
            'Record in the notes that a professional interpreter was used, with their ID'
          ]
        }
      ]
    },
    {
      title: 'The Three-Way Consultation',
      description: 'Keeping the patient at the centre when there are three of you.',
      badgeIcon: '🗣',
      themeId: 'forest',
      blocks: [
        { t: 'heading', text: 'Speak to the patient, not to the interpreter' },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Rule 1',
              heading: 'Address the patient directly',
              body:
                'Say “Do you have any pain?” — not “Ask her if she has any pain.”\n\n' +
                'Look at the patient while you speak and while they answer, not at the interpreter. This is the most commonly broken rule and the one patients most often mention afterwards.'
            },
            {
              caption: 'Rule 2',
              heading: 'Short segments, plain language',
              body:
                'Two or three sentences, then pause for interpretation. Long passages get compressed and detail is lost.\n\n' +
                'Avoid idiom, metaphor and abbreviation. “Waterworks”, “under the weather”, “nil by mouth” and “obs” frequently do not survive interpretation.'
            },
            {
              caption: 'Rule 3',
              heading: 'Brief the interpreter first',
              body:
                'One sentence before you start: “This is a consent discussion for surgery tomorrow and I need to cover risks.”\n\n' +
                'Ask for everything to be interpreted, including anything the patient says that seems tangential. What sounds tangential to an interpreter is sometimes the disclosure.'
            },
            {
              caption: 'Rule 4',
              heading: 'Check understanding through teach-back',
              body:
                '“So I know I have explained it clearly — can you tell me in your own words what will happen tomorrow?”\n\n' +
                'Never “do you understand?”. Through an interpreter, that reliably returns yes regardless of comprehension.'
            },
            {
              caption: 'Rule 5',
              heading: 'Notice the length mismatch',
              body:
                'If you speak for twenty seconds and the interpretation lasts three, or the patient speaks at length and you get four words back, say so: “That seemed much shorter — could you interpret everything she said?”\n\n' +
                'This is your only real quality check, and it applies to professional interpreters too.'
            }
          ]
        },
        {
          t: 'scenario',
          gate: true,
          cast: [
            {
              key: 'son',
              name: 'Patient’s son',
              role: 'customer',
              gender: 'male',
              age: 'adult',
              tone: 'medium'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'Pre-operative clinic',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'There is no need to wait for anyone — I always translate for my mother. I know her history better than she does. Let us just get on with it.',
                  expression: 'confident',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“I appreciate that, and for consent I have to use a professional interpreter. It takes about four minutes.”',
                  to: 'accepted',
                  feedback: 'Frames it as a rule about you, not a doubt about him, and names the small real cost.'
                },
                {
                  label: 'Agree — he is fluent and it saves twenty minutes',
                  to: 'proceeded',
                  feedback: 'This is Case 1. The consent obtained will not be valid.'
                },
                {
                  label: '“We are not allowed to use family members.”',
                  to: 'blunt',
                  feedback: 'True but bare. Without a reason it reads as bureaucracy and invites argument.'
                }
              ]
            },
            {
              key: 'blunt',
              name: 'He pushes back',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'Not allowed? I have done this for six years. Are you saying I would lie about my own mother?',
                  expression: 'angry',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: '“Not at all — it is so she can ask me things she might not want to ask in front of you.”',
                  to: 'accepted',
                  feedback:
                    'The best available framing. It is true, it is not an accusation, and it usually lands immediately.'
                },
                { label: 'Repeat the policy', to: 'proceeded' }
              ]
            },
            {
              key: 'accepted',
              name: 'The interpreter joins',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'Alright. I will wait outside then, shall I? She might prefer that.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: 'Ask the patient, through the interpreter, whether she would like him to stay',
                  to: 'end-good',
                  feedback: 'Correct — that is her decision to make, not his and not yours.'
                }
              ]
            },
            {
              key: 'proceeded',
              name: 'The son interprets',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text: 'She says that is all fine and she is happy to go ahead.',
                  expression: 'confident',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-bad' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — valid consent',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Four minutes, and two questions she had not asked',
              outcomeDescription:
                'With the interpreter present the patient asked two questions she had never raised in six years of appointments — one about incontinence, one about whether she could refuse. Her son had not been withholding anything; she had simply never asked him to ask. The consent is valid and documented with the interpreter ID.',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'She asked things she has never asked me. I did not know she was worried about that.',
                  expression: 'concerned',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-bad',
              name: 'Outcome — consent not valid',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'She thought she was having a scan',
              outcomeDescription:
                'This is Case 1. The son simplified the explanation to avoid frightening her and did not relay the risks. The surgery was clinically appropriate and the consent was invalid. The complaint was upheld, and the four minutes saved cost a formal investigation and a patient’s trust.',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'I did not want to scare her with all the complications. I told her it was a small procedure.',
                  expression: 'disappointed',
                  gesture: 'explaining'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Making It the Default',
      description: 'Small changes that move a service from 61% to routine.',
      badgeIcon: '🌍',
      blocks: [
        { t: 'heading', text: 'What the clinics doing this well changed' },
        {
          t: 'comparison',
          title: 'Two outpatient services',
          preset: 'beforeAfter',
          layout: 'card',
          columns: [
            {
              title: 'At 55% professional use',
              accent: '#c8372b',
              rows: [
                'Language need discovered when the patient arrives',
                'Interpreting line number kept in a folder at the desk',
                'Staff believe booking takes 20–30 minutes',
                'Relative offers to help and it is accepted',
                'No record of who interpreted'
              ]
            },
            {
              title: 'At 96% professional use',
              accent: '#0e9d6d',
              rows: [
                'Language and dialect flagged on the record at referral',
                'Interpreting number printed on every phone and every clinic room wall',
                'Actual connection time (4 minutes) shown on the poster',
                'Standard phrase used with families, so nobody improvises',
                'Interpreter ID recorded in the notes every time'
              ]
            }
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
                'A patient arrives in ED with abdominal pain, accompanied by her husband who offers to interpret. She appears withdrawn. What do you do?',
              answers: [
                {
                  text: 'Arrange telephone interpreting and see her alone for part of the consultation',
                  correct: true,
                  feedback:
                    'Correct. Withdrawal plus unexplained injury plus an accompanying interpreter is exactly the Case 2 pattern. Seeing her alone is routine practice, not an accusation.'
                },
                {
                  text: 'Accept the husband’s help — she is in pain and it is faster',
                  feedback:
                    'If there is anything to disclose, she cannot disclose it through him. This is how Case 2 happened.'
                },
                {
                  text: 'Proceed in English and use gestures',
                  feedback: 'No interpretation at all was recorded in 6% of our audit and is never acceptable.'
                },
                {
                  text: 'Ask the husband to interpret now and book a professional for follow-up',
                  feedback:
                    'The disclosure opportunity is now, and a follow-up appointment may be attended by the same person.'
                }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take one to your next team meeting. Flagging language at referral is the highest-value change.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will never ask a child to interpret, even for something simple', required: false },
            { text: 'I will use a professional interpreter for every consent discussion', required: false },
            { text: 'I will see a patient alone for part of any consultation where abuse is possible', required: false },
            { text: 'I will address the patient directly, not the interpreter', required: false },
            { text: 'I will use teach-back rather than “do you understand?”', required: false },
            { text: 'I will record language and dialect on the patient record', required: false },
            { text: 'I will note the interpreter ID in the clinical entry', required: false },
            { text: 'I will say “it takes about four minutes” when families offer to help', required: false }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of a consultation where you used a family member because it was quicker. What might the patient not have said in front of them?',
          size: 'medium'
        },
        {
          t: 'quote',
          text:
            'She had attended this clinic for six years and never once asked a question. The first time we booked an interpreter she asked four. Her son had not silenced her. We had.',
          by: 'Clinical Lead, Outpatients, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
