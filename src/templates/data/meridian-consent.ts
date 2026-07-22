// Meridian Health Systems — course 6 of 10.
// Driven by the elective consent audit: 28% of consent forms signed with no
// documented discussion of alternatives, and 41% with no record of what
// mattered to that particular patient.
import type { CourseTemplate } from '../types'

export const meridianConsent: CourseTemplate = {
  id: 'meridian-health-consent',
  title: 'Consent That Would Stand Up',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'A review of 340 elective consent forms found no documented discussion of alternatives in 28% of ' +
    'cases, and no record of what mattered to that individual patient in 41%. Two claims in 18 months ' +
    'turned on consent rather than on surgical technique. Staff describe consent as “getting the form ' +
    'signed” rather than as a conversation.',
  audience: 'Medical staff taking consent, senior nurses, and anyone delegated to consent for procedures',
  summary:
    'Since Montgomery, consent is measured by what this patient needed to know — not by what we ' +
    'usually tell people. This course covers material risk, alternatives including doing nothing, ' +
    'capacity, and documentation that survives challenge.',
  objectives: [
    'Apply the Montgomery test for material risk to an individual patient',
    'Discuss alternatives, including the option of no treatment, and record them',
    'Assess capacity correctly, including for an unwise decision',
    'Document a consent discussion so it demonstrates the conversation, not just the signature'
  ],
  minutes: 30,
  themeId: 'midnight',
  tags: ['consent', 'medico-legal', 'shared decision making', 'clinical governance'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Knows Montgomery', icon: '⚖️', kind: 'lesson', lesson: 2 },
      { label: 'Assumes Capacity', icon: '🧭', kind: 'lesson', lesson: 4 },
      { label: 'Consent Champion', icon: '✍️', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'What the Audit Found',
      description: 'Three hundred and forty forms, and the conversations that were missing.',
      badgeIcon: '📋',
      blocks: [
        { t: 'heading', text: 'The form was signed. The conversation was not recorded.' },
        {
          t: 'para',
          html:
            'Our clinical governance team reviewed <b>340 elective consent forms</b> across surgery, ' +
            'orthopaedics, gynaecology and endoscopy. Every one carried a valid signature. That is not ' +
            'what consent means.'
        },
        {
          t: 'chart',
          title: 'Elements absent from the documented consent discussion (%, n=340)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'What mattered to this patient', value: 41, accent: '#c8372b' },
            { label: 'Alternatives discussed', value: 28, accent: '#c8372b' },
            { label: 'Option of no treatment', value: 26, accent: '#b7791f' },
            { label: 'Named risks beyond the generic list', value: 22, accent: '#b7791f' },
            { label: 'Patient’s own questions recorded', value: 19, accent: '#4f6df5' },
            { label: 'Time between discussion and procedure', value: 14, accent: '#4f6df5' }
          ]
        },
        {
          t: 'para',
          html:
            'Two claims in the last 18 months turned on consent. In neither case was the surgery ' +
            'performed badly. In both, the patient said they would have chosen differently had they ' +
            'understood a particular risk — and the record could not show that risk had been discussed.'
        },
        {
          t: 'timeline',
          preset: 'vertical',
          events: [
            {
              label: 'Claim 1 — the risk that mattered to her',
              date: '2023',
              body:
                'A patient with a career as a professional cellist consented to elective shoulder surgery. The consent form listed “nerve injury” among generic risks. She developed a permanent ulnar neuropathy affecting fine motor control. Her case was that a 1-in-200 risk to hand function was material to her specifically, and that nobody had asked what she did. Settled.'
            },
            {
              label: 'Claim 2 — the option nobody offered',
              date: '2024',
              body:
                'A patient consented to a hysterectomy for heavy menstrual bleeding. The notes recorded a discussion of surgical risk but no mention of medical management or an intrauterine system. Her case was that she was never told a less invasive option existed. Settled, with a finding that the consent process was inadequate.'
            },
            {
              label: 'Audit commissioned',
              date: '2024',
              body:
                'Board-commissioned review of 340 consecutive elective consent forms across four specialties. Findings above. Consent training became mandatory for all staff taking consent.'
            }
          ]
        },
        {
          t: 'quote',
          text:
            'The surgery was faultless. The claim succeeded because we could not show we had asked her what she needed her hand to do.',
          by: 'Trust Legal Services, Meridian Health Systems',
          pull: true
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Where consent fails',
          gate: true,
          questions: [
            {
              prompt: 'In both claims, what was the actual failure?',
              feedback:
                'Neither case involved poor technique. Both involved information the patient needed and did not receive.',
              answers: [
                {
                  text: 'The patient was not given information that was material to their own circumstances',
                  correct: true,
                  feedback:
                    'Yes — one needed a risk framed against her occupation, the other needed to know a less invasive option existed.'
                },
                {
                  text: 'The consent form was not signed correctly',
                  feedback: 'Both forms were validly signed. The signature was never the issue.'
                },
                {
                  text: 'The surgery was performed below the expected standard',
                  feedback: 'Neither claim alleged that, and in claim 1 the surgery was described as faultless.'
                },
                {
                  text: 'Consent was taken too close to the procedure',
                  feedback:
                    'Timing was a finding in 14% of the audit but was not the basis of either claim.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'Material Risk Is Their Risk',
      description: 'The Montgomery test, and why the generic risk list is not enough.',
      badgeIcon: '⚖️',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'The test changed. Our practice largely did not.' },
        {
          t: 'para',
          html:
            'The old test asked what a reasonable body of doctors would disclose. Since <b>Montgomery ' +
            'v Lanarkshire (2015)</b> the test is what a <i>reasonable patient in this patient’s ' +
            'position</i> would attach significance to — or what this particular patient would, if you ' +
            'are or should be aware of it.'
        },
        {
          t: 'para',
          html:
            'That second limb is the one we keep failing. It means a risk that is immaterial to most ' +
            'people can be decisive for the person in front of you, and you only find out by asking.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have worked through all four elements of the Montgomery standard.',
          panels: [
            {
              title: 'Material means material to them',
              body:
                'A 1% risk of altered fine sensation in the fingertips is trivial to most people. To a cellist, a surgeon, a pianist, a jeweller or a sign-language interpreter, it may be the deciding factor.\n\n' +
                'You cannot know which risks are material without knowing something about the person. This is why the question “what do you do, and what do you need to be able to do afterwards?” is not small talk — it is the mechanism by which materiality is established.'
            },
            {
              title: 'Percentages are not the whole answer',
              body:
                'Materiality is not just about frequency. A rare but catastrophic and irreversible outcome may be material where a common but temporary one is not.\n\n' +
                'Express risk in natural frequencies, not percentages alone: “about 1 in 200 people” is understood far better than “0.5%”. Use consistent denominators when comparing options — 1 in 100 versus 1 in 1,000, not 1% versus 0.1%.'
            },
            {
              title: 'The therapeutic exception is very narrow',
              body:
                'You may withhold information only where disclosure would be <i>seriously detrimental to the patient’s health</i> — not where it might cause distress, and not where you believe they would make what you consider the wrong choice.\n\n' +
                'It is exceptional, it must be documented with reasons, and it should be discussed with a colleague. In practice it is almost never applicable to elective work. “I did not want to frighten her” is not the exception.'
            },
            {
              title: 'Delegation is allowed; ignorance is not',
              body:
                'You may take consent for a procedure you do not perform, provided you are trained in it, understand the risks and alternatives, and could answer the patient’s questions.\n\n' +
                'If a patient asks you something you cannot answer, that is the signal to stop and find someone who can — not to reassure them. In our audit, 6% of forms were completed by staff who told us afterwards they could not have described the alternatives.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'Same procedure, two consent conversations',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'Generic',
              accent: '#c8372b',
              rows: [
                '“The risks are bleeding, infection, nerve damage and anaesthetic risk.”',
                'Read from the standard list on the form',
                'No question about the patient’s life or work',
                'Alternatives not mentioned',
                '“Any questions?” asked while holding out the pen',
                'Signed at the pre-op bedside on the morning of surgery'
              ]
            },
            {
              title: 'Montgomery-compliant',
              accent: '#0e9d6d',
              rows: [
                '“About 1 in 200 people get lasting numbness in the fingertips.”',
                '“You mentioned you play professionally — how much would that matter to you?”',
                'Occupation, hobbies and dependants explored and recorded',
                'Physiotherapy, injection, and doing nothing all discussed with their outcomes',
                'Questions invited, answered, and written down',
                'Discussed at clinic two weeks earlier, confirmed on the day'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Applying the test',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'A patient is listed for knee arthroscopy. A 1-in-500 risk of persistent numbness over the scar is rarely mentioned by your colleagues. The patient is a carpet fitter who kneels all day. What does Montgomery require?',
              answers: [
                {
                  text: 'Discuss it — the risk is material to this patient because of what he does',
                  correct: true,
                  feedback:
                    'Correct. Materiality is judged from the patient’s position, and kneeling all day makes scar-area sensation significant.'
                },
                {
                  text: 'Omit it — a 1-in-500 risk is below the usual disclosure threshold',
                  feedback:
                    'There is no numerical threshold. Frequency is one factor; significance to this patient is the test.'
                },
                {
                  text: 'Omit it unless he asks — you must not volunteer rare risks',
                  feedback:
                    'The duty is to volunteer material risks. Waiting to be asked reverses the obligation.'
                },
                {
                  text: 'Mention it only if your consultant normally does',
                  feedback:
                    'That is the pre-2015 test. What a body of doctors would do is no longer the standard.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'The Conversation Itself',
      description: 'Benefits, risks, alternatives — and the option of doing nothing.',
      badgeIcon: '💬',
      blocks: [
        { t: 'heading', text: 'Doing nothing is always an option, and must always be offered' },
        {
          t: 'para',
          html:
            'In 26% of audited cases, no alternative to the proposed procedure was recorded — including ' +
            'the alternative of no treatment. A patient who does not know they can decline has not ' +
            'consented; they have complied.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'B',
              heading: 'Benefits — what they can realistically expect',
              body:
                'Be specific and honest about magnitude. “Most people get significant pain relief” is vague. “About 7 in 10 people have much less pain a year later; 2 in 10 notice little difference” is usable.\n\n' +
                'Say what the procedure will <i>not</i> fix. Unmet expectation is a large driver of complaints even where the outcome was technically successful.'
            },
            {
              caption: 'R',
              heading: 'Risks — general, specific, and personal',
              body:
                'General risks of any procedure, the specific risks of this one, and the risks particular to <i>this</i> patient given their comorbidities, medication, occupation and circumstances.\n\n' +
                'Include what happens if a risk materialises: “If the nerve is affected, it usually recovers within six months, but in about 1 in 400 it is permanent.”'
            },
            {
              caption: 'A',
              heading: 'Alternatives — including the ones we do not provide',
              body:
                'Every reasonable alternative, with its own benefits and risks. That includes options provided elsewhere, options that are less effective but less invasive, and watchful waiting.\n\n' +
                'Claim 2 succeeded because a medical alternative existed, was reasonable, and was never mentioned.'
            },
            {
              caption: 'N',
              heading: 'Nothing — what happens if we do not treat',
              body:
                'The natural history of the condition if untreated. Sometimes that is deterioration; sometimes it is stability or spontaneous improvement.\n\n' +
                'Patients frequently choose no treatment once they understand the natural history, and that is a legitimate outcome of a good consent conversation, not a failure of it.'
            },
            {
              caption: 'Check',
              heading: 'Confirm understanding, do not test it',
              body:
                '“Just so I know I have explained it properly — how would you describe this to your family?”\n\n' +
                'This frames any gap as your explanation failing rather than the patient failing, and it is far more likely to surface a genuine misunderstanding than “does that all make sense?”, which almost always gets a yes.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Structuring the discussion',
          prompt: 'Put the elements of a consent conversation into a sensible order.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Establish what the patient already understands and what matters to them',
            'Explain the diagnosis and the proposed procedure in plain language',
            'Describe the realistic benefits and their likelihood',
            'Describe the risks, including any specific to this patient',
            'Set out the alternatives, including no treatment',
            'Invite and answer questions',
            'Check understanding by asking them to describe it back',
            'Document the discussion and allow time before the procedure'
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'What must be covered',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'Which of these must a consent discussion include? Select all that apply.',
              feedback:
                'Benefits, risks, alternatives and the no-treatment option are all mandatory, along with the risks specific to this patient.',
              answers: [
                { text: 'Realistic benefits with an indication of likelihood', correct: true, score: 5 },
                { text: 'Risks that are material to this particular patient', correct: true, score: 5 },
                { text: 'Reasonable alternatives, including those we do not offer here', correct: true, score: 5 },
                { text: 'What happens if nothing is done', correct: true, score: 5 },
                { text: 'The patient’s own questions and the answers given', correct: true, score: 5 },
                { text: 'Reassurance that the surgeon has done many of these', score: 0 },
                { text: 'The waiting time if they decline today', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'Capacity, and the Unwise Decision',
      description: 'Assuming capacity, assessing it properly, and respecting a choice you disagree with.',
      badgeIcon: '🧭',
      themeId: 'forest',
      blocks: [
        { t: 'heading', text: 'Capacity is assumed until you can show otherwise' },
        {
          t: 'para',
          html:
            'The Mental Capacity Act starts from a presumption of capacity. It is decision-specific and ' +
            'time-specific — a patient may lack capacity for one decision and retain it for another, or ' +
            'lack it this morning and regain it this afternoon.'
        },
        {
          t: 'para',
          html:
            'Critically: <b>an unwise decision is not evidence of incapacity</b>. The most common error we ' +
            'see is a capacity assessment triggered solely because the patient declined the recommended ' +
            'treatment.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'The two-stage test',
              body:
                '<b>Stage 1:</b> Is there an impairment of, or disturbance in the functioning of, the mind or brain? Dementia, delirium, intoxication, brain injury, severe mental illness, unconsciousness.\n\n' +
                '<b>Stage 2:</b> Does that impairment mean they cannot make <i>this</i> decision, at <i>this</i> time?\n\n' +
                'Both stages must be satisfied. If there is no impairment, the assessment stops — you cannot find incapacity simply because a decision seems irrational.'
            },
            {
              title: 'The four functional elements',
              body:
                'A person lacks capacity for a decision if they cannot do any one of these:\n\n' +
                '<b>Understand</b> the information relevant to the decision.\n' +
                '<b>Retain</b> it long enough to make the decision — briefly is sufficient.\n' +
                '<b>Use or weigh</b> it as part of the process of deciding.\n' +
                '<b>Communicate</b> the decision by any means.\n\n' +
                'Record which element fails and the evidence for it. “Patient confused” is not a capacity assessment.'
            },
            {
              title: 'Everything practicable to help',
              body:
                'You must take all practicable steps to support capacity before concluding it is absent: treat the delirium, wait for sobriety, use an interpreter, use simple language, use pictures, choose the time of day when they are clearest, involve someone who knows how they communicate.\n\n' +
                'A capacity assessment done at 03:00 on a patient with nocturnal delirium, without revisiting it in daylight, will not withstand scrutiny.'
            },
            {
              title: 'Unwise decisions',
              body:
                'A patient with capacity may refuse treatment for reasons that seem to you irrational, or for no reason at all. That refusal is binding even where the consequence is death.\n\n' +
                'Your role is to ensure the decision is <i>informed</i> — that they understand what they are declining and its consequences — not to ensure it is the decision you would make.\n\n' +
                'Document that you assessed capacity, that it was present, and that the decision was theirs.'
            }
          ]
        },
        {
          t: 'scenario',
          gate: true,
          cast: [
            {
              key: 'pt',
              name: 'Mrs Ellery (patient, 79)',
              role: 'customer',
              gender: 'female',
              age: 'senior',
              tone: 'light'
            },
            {
              key: 'reg',
              name: 'Surgical Registrar',
              role: 'doctor',
              gender: 'male',
              age: 'young',
              tone: 'medium'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'Pre-operative assessment',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'pt',
                  text:
                    'I have thought about it and I do not want the operation. I know what you have said about the risk. I am seventy-nine and I would rather have the time I have without a long recovery.',
                  expression: 'confident',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: 'Check she understands the consequences, then respect the decision and document it',
                  to: 'respected',
                  feedback: 'Correct. She has given reasons, weighed them, and reached a conclusion. That is capacity.'
                },
                {
                  label: 'Request a capacity assessment — the decision is clinically irrational',
                  to: 'capacity',
                  feedback: 'This is the most common error in our audit. Disagreement is not an impairment.'
                },
                {
                  label: 'Ask her son to talk her round',
                  to: 'family',
                  feedback:
                    'Recruiting family to overturn a capacitous decision undermines her autonomy, whatever the intention.'
                }
              ]
            },
            {
              key: 'capacity',
              name: 'The registrar escalates',
              background: 'hospital',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'She is declining a procedure that would very likely extend her life. Should we not be questioning whether she really grasps that?',
                  expression: 'concerned',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: '“She has given clear reasons and weighed them. There is no impairment to assess.”',
                  to: 'respected',
                  feedback: 'Right. Stage 1 of the test is not met, so the assessment does not proceed.'
                },
                {
                  label: 'Proceed with a formal capacity assessment anyway',
                  to: 'end-poor',
                  feedback:
                    'Assessing capacity with no identified impairment, triggered only by disagreement, is itself a failure.'
                }
              ]
            },
            {
              key: 'family',
              name: 'The son is asked to intervene',
              background: 'hospital',
              dialogue: [
                {
                  who: 'pt',
                  text:
                    'You have telephoned my son about my decision? I did not ask you to do that. It is not his choice to make.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                {
                  label: 'Apologise, acknowledge the error, and return to her decision',
                  to: 'respected',
                  feedback: 'Recoverable, and the apology matters — her autonomy was bypassed.'
                },
                { label: 'Continue involving the family', to: 'end-poor' }
              ]
            },
            {
              key: 'respected',
              name: 'The decision is recorded',
              background: 'hospital',
              dialogue: [
                {
                  who: 'pt',
                  text:
                    'Thank you for listening. And if I change my mind in six months, is the door still open?',
                  expression: 'happy',
                  gesture: 'questioning'
                }
              ],
              choices: [{ label: 'Confirm she can return at any time, and document', to: 'end-good' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — autonomy respected',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'A capacitous refusal, properly recorded',
              outcomeDescription:
                'The entry recorded that capacity was assessed and present, what she was told, the reasons she gave, and that the option remains open. That record protects her, and it protects the clinicians. Nine months later she chose to proceed — on her own timing, with the same information.',
              dialogue: [
                {
                  who: 'reg',
                  text:
                    'I did want to argue with her. But she had thought about it more carefully than I had.',
                  expression: 'confident',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — a complaint upheld',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Complaint upheld on autonomy',
              outcomeDescription:
                'Mrs Ellery complained that her refusal triggered a capacity assessment and a call to her son. The complaint was upheld. The investigation found no impairment had been identified before the assessment was requested — the trigger was the content of her decision, which is precisely what the Act forbids.',
              dialogue: [
                {
                  who: 'pt',
                  text:
                    'I was not confused. I disagreed with you. Those are not the same thing.',
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
      title: 'Writing It Down So It Stands',
      description: 'Documentation that demonstrates a conversation happened.',
      badgeIcon: '✍️',
      blocks: [
        { t: 'heading', text: 'The signature proves a form was signed. Nothing more.' },
        {
          t: 'para',
          html:
            'In both our claims the form was signed and the signature was never in dispute. What could ' +
            'not be shown was the conversation. Documentation is what converts a signature into evidence ' +
            'of consent.'
        },
        {
          t: 'comparison',
          title: 'Two consent entries for the same operation',
          preset: 'beforeAfter',
          layout: 'stacked',
          columns: [
            {
              title: 'What the audit usually found',
              accent: '#c8372b',
              rows: [
                '“Risks and benefits discussed. Patient consented. Form signed.”',
                'No indication of which risks',
                'No alternatives named',
                'Nothing about this patient',
                'No record of questions asked',
                'Cannot be defended if challenged'
              ]
            },
            {
              title: 'What would stand up',
              accent: '#0e9d6d',
              rows: [
                '“Discussed diagnosis and proposed L4/5 decompression.”',
                '“Risks covered: infection ~1 in 50, dural tear ~1 in 20, no improvement ~3 in 10, new nerve symptoms ~1 in 200.”',
                '“Alternatives: continued physiotherapy, injection, no treatment — natural history explained.”',
                '“Patient is a self-employed plasterer; explored effect of 8-week recovery on income. Main concern was time off work, not the surgical risk.”',
                '“He asked about driving and about returning to lifting — answered both.”',
                '“Understanding checked — described the operation back accurately. Consent form signed. Two weeks before planned date.”'
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Before the patient signs, confirm you have recorded:',
          done: 'That entry demonstrates a conversation. It is what the claim in 2023 needed and did not have.',
          mode: 'allRequired',
          items: [
            { text: 'The specific risks discussed, with natural frequencies' },
            { text: 'The alternatives offered, including no treatment' },
            { text: 'Something about this patient that shaped what was material' },
            { text: 'The questions they asked and the answers given' },
            { text: 'That understanding was checked, and how' },
            { text: 'Capacity assumed or assessed, with the outcome' },
            { text: 'Who took consent, their grade, the date and time' }
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
              prompt: 'Select every statement that is true about consent at Meridian.',
              feedback:
                'Consent is a process, capacity is presumed, unwise decisions are permitted, and alternatives including no treatment must be offered.',
              answers: [
                { text: 'Consent is a process over time, not a signature at a moment', correct: true, score: 5 },
                { text: 'Capacity is presumed unless there is an impairment and a functional failure', correct: true, score: 5 },
                { text: 'A capacitous patient may refuse treatment for reasons that seem irrational', correct: true, score: 5 },
                { text: 'Alternatives must include options we do not provide ourselves', correct: true, score: 5 },
                { text: 'Consent may be withdrawn at any point, including in the anaesthetic room', correct: true, score: 5 },
                { text: 'A signed form is sufficient evidence that consent was valid', score: 0 },
                { text: 'Declining recommended treatment justifies a capacity assessment', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of the last consent discussion you had. What did you know about that person’s life that shaped which risks you emphasised? If the answer is nothing, what one question could you have asked?',
          size: 'large'
        },
        {
          t: 'quote',
          text:
            'The question that would have prevented a settled claim was: “what do you need your hands to do?” It takes four seconds and nobody asked it.',
          by: 'Associate Medical Director for Governance, Meridian Health Systems',
          pull: true
        }
      ]
    }
  ]
}
