// Northwind Financial Technologies — digital banking platform, 4.2m retail
// customers. Courses driven by fraud loss data, complaint themes and
// regulatory expectations on authorised push payment reimbursement.
import type { CourseTemplate } from '../types'

export const northwindAppFraud: CourseTemplate = {
  id: 'northwind-fintech-app-fraud',
  title: 'Stopping the Payment: APP Fraud on the Front Line',
  company: 'Northwind Financial Technologies',
  industry: 'Financial Services',
  gap:
    'Authorised push payment losses rose 34% year on year. Contact-centre analysis shows agents ' +
    'detect obvious impersonation but miss coached customers — those actively told by a fraudster ' +
    'what to say. Agents also disengage when a customer insists, because they read the payment as ' +
    'the customer’s own decision.',
  audience: 'Contact-centre agents, in-app chat agents and payment operations staff',
  summary:
    'Teaches the behavioural signals of a coached customer, the intervention script that actually ' +
    'breaks the spell, and the reimbursement rules that make this everyone’s problem.',
  objectives: [
    'Recognise the behavioural markers of a customer being coached in real time',
    'Run a structured intervention without accusing the customer of lying',
    'Apply the correct hold, refer and refuse decisions under Northwind policy',
    'Explain reimbursement obligations and why the bank carries the loss'
  ],
  minutes: 28,
  themeId: 'midnight',
  tags: ['fraud', 'customer protection', 'regulatory', 'contact centre'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 130,
    badges: [
      { label: 'Reads the Signals', icon: '🔍', kind: 'lesson', lesson: 2 },
      { label: 'Breaks the Spell', icon: '💬', kind: 'lesson', lesson: 3 },
      { label: 'Fraud Guardian', icon: '🛡', kind: 'course' },
      { label: 'Full Marks', icon: '🌟', kind: 'xp', xp: 400 }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    {
      title: 'The Customer Who Wants To Pay',
      description: 'Why APP fraud defeats normal fraud controls, and what it costs us.',
      badgeIcon: '💸',
      blocks: [
        { t: 'heading', text: 'Every control we have assumes the customer did not authorise it' },
        {
          t: 'para',
          html:
            'Card fraud, account takeover and unauthorised transactions all share one feature: the ' +
            'customer did not make the payment. Our entire control stack is built on detecting that.'
        },
        {
          t: 'para',
          html:
            'Authorised push payment fraud is different. The customer <b>makes the payment themselves</b>, ' +
            'through the correct app, on their own device, after passing every authentication check. They ' +
            'have been deceived about who they are paying or why. Nothing in the transaction data looks ' +
            'wrong, because nothing in the transaction is technically wrong.'
        },
        {
          t: 'chart',
          title: 'Northwind APP losses by fraud type (£000, last 12 months)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Impersonation — bank', value: 1840, accent: '#4f6df5' },
            { label: 'Impersonation — police', value: 920, accent: '#4f6df5' },
            { label: 'Investment', value: 1510, accent: '#8b9dff' },
            { label: 'Purchase', value: 430, accent: '#8b9dff' },
            { label: 'Romance', value: 610, accent: '#8b9dff' },
            { label: 'Invoice / CEO', value: 780, accent: '#8b9dff' }
          ]
        },
        {
          t: 'comparison',
          title: 'Why our controls do not fire',
          preset: 'optionAB',
          layout: 'horizontal',
          columns: [
            {
              title: 'Unauthorised fraud',
              accent: '#4f6df5',
              rows: [
                'Customer did not initiate the payment',
                'Device or location often unrecognised',
                'Authentication frequently fails or is bypassed',
                'Behavioural analytics flag the anomaly',
                'Customer reports it themselves, quickly'
              ]
            },
            {
              title: 'Authorised push payment fraud',
              accent: '#ef6f6c',
              rows: [
                'Customer initiates the payment deliberately',
                'Known device, usual location, normal hours',
                'Every authentication check passes correctly',
                'Analytics see a legitimate customer behaving legitimately',
                'Customer often defends the payment when questioned'
              ]
            }
          ]
        },
        {
          t: 'para',
          html:
            'This is why <b>you</b> are the control. In most APP cases the only thing standing between the ' +
            'customer and the loss is a person noticing that something about the conversation is wrong.'
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Why this is different',
          gate: true,
          questions: [
            {
              prompt: 'Why do automated fraud controls rarely stop an APP payment?',
              feedback:
                'The transaction is genuinely authorised by the genuine customer on their genuine device. There is no technical anomaly to detect.',
              answers: [
                {
                  text: 'The genuine customer authorises it on their usual device, so nothing looks anomalous',
                  correct: true,
                  feedback: 'Right — the deception is in the customer’s understanding, not in the data.'
                },
                {
                  text: 'The payments are always below the monitoring threshold',
                  feedback: 'APP losses are frequently large — our average impersonation loss is £8,400.'
                },
                {
                  text: 'Fraudsters use stolen credentials that we cannot detect',
                  feedback: 'That describes account takeover, which is a different fraud type.'
                },
                {
                  text: 'The payments are made outside business hours',
                  feedback: 'Timing is not the distinguishing factor.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Reading a Coached Customer',
      description: 'The behavioural markers that show someone is being told what to say.',
      badgeIcon: '🔍',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'You are not listening to the customer alone' },
        {
          t: 'para',
          html:
            'In a coached call, the fraudster is often still on the line — on a second phone, on speaker, ' +
            'or messaging the customer live. The customer is relaying answers. That relay produces ' +
            'signals you can hear.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered all six markers. Two or more together should always trigger an intervention.',
          panels: [
            {
              title: 'Unnatural pauses before simple answers',
              body:
                'Ask why the customer is making the payment. A genuine answer arrives immediately because it comes from their own life.\n\n' +
                'A coached customer pauses — they are reading, listening, or waiting to be told. Pauses before <i>simple</i> questions matter far more than pauses before complex ones.'
            },
            {
              title: 'Vocabulary that does not belong to them',
              body:
                'Watch for phrases that sound imported: "safe account", "the funds need to be secured", "this is a mule account investigation", "I am assisting an internal fraud case".\n\n' +
                'These are the fraudster’s words in the customer’s mouth. Northwind never uses the phrase "safe account", because no such thing exists.'
            },
            {
              title: 'Rehearsed answers to questions you did not ask',
              body:
                'A coached customer often volunteers a cover story unprompted: "It is just for some building work, my builder needed a deposit."\n\n' +
                'Genuine customers rarely explain payments they have not been asked about. Pre-emptive justification is a strong marker.'
            },
            {
              title: 'Urgency the customer cannot explain',
              body:
                'Ask what happens if the payment waits until tomorrow. A genuine reason is concrete: a completion date, a deposit deadline.\n\n' +
                'A coached customer reports urgency but cannot source it — "they said it has to be today" — and becomes agitated when the timeline is questioned.'
            },
            {
              title: 'Secrecy, especially about us',
              body:
                'If the customer has been told not to discuss the payment with branch staff, family or the bank, that is definitive. No legitimate organisation asks a customer to conceal a payment from their own bank.\n\n' +
                'Ask directly: "Has anyone asked you to keep this conversation private?" The answer, and the hesitation before it, both matter.'
            },
            {
              title: 'Distress that escalates when you slow down',
              body:
                'A genuine customer who is asked security questions may be mildly irritated. A coached customer is often <i>frightened</i> — because the fraudster has told them their money is at risk right now, and you are the obstacle.\n\n' +
                'Escalating fear in response to normal checks is a marker, not a reason to hurry.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'selectAll',
          poolTitle: 'Marker recognition',
          pass: 100,
          gate: true,
          questions: [
            {
              prompt:
                'A customer wants to send £9,200 to a new payee. Select every response that is a coaching marker.',
              feedback:
                'Imported vocabulary, unsourced urgency, instructed secrecy and unprompted cover stories are all markers. Nervousness alone and a large amount alone are not.',
              answers: [
                { text: '“It needs to go to my safe account before end of day.”', correct: true, score: 5 },
                { text: '“I was told not to mention this to the branch.”', correct: true, score: 5 },
                { text: '“It is just for building work — my builder needed a deposit.” (unprompted)', correct: true, score: 5 },
                { text: 'A four-second pause before answering who the payee is', correct: true, score: 5 },
                { text: 'The customer sounds slightly impatient about security questions', score: 0 },
                { text: 'The payment is larger than their usual transactions', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'The customer told me nine times that she wanted to make the payment. She was crying by the end. She was also being told, word by word, what to say to me.',
          by: 'Senior fraud agent, Northwind — case review',
          pull: true
        }
      ]
    },
    {
      title: 'The Intervention That Works',
      description: 'A script that breaks the fraudster’s hold without calling the customer a liar.',
      badgeIcon: '💬',
      blocks: [
        { t: 'heading', text: 'Never argue with the story. Change the frame.' },
        {
          t: 'para',
          html:
            'Telling a coached customer "this is a scam" almost always fails. The fraudster has already ' +
            'warned them that the bank would say exactly that. Direct contradiction confirms the ' +
            'fraudster’s prediction and pushes the customer away from you.'
        },
        {
          t: 'para',
          html:
            'What works is <b>separating the customer from the coaching</b> and giving them a way to check ' +
            'without losing face.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Step 1',
              heading: 'Get them alone',
              body:
                '“Before we go further — is anyone else with you or on another line right now?”\n\n' +
                'If yes, ask them to end that call before you continue. This single step removes the fraudster’s live control. If they refuse or say they cannot, treat that as near-conclusive.'
            },
            {
              caption: 'Step 2',
              heading: 'Ask open questions, not yes/no',
              body:
                '“Talk me through how this started.” Not “did someone contact you?”\n\n' +
                'Coached answers are prepared for closed questions. Open narrative forces the customer to construct, and inconsistencies surface naturally without you challenging anything.'
            },
            {
              caption: 'Step 3',
              heading: 'State the fact, not the accusation',
              body:
                '“I need to tell you something factual: Northwind will never ask you to move money to another account for safety. There is no such thing as a safe account.”\n\n' +
                'You are correcting a fact about us, not calling the customer foolish. That distinction is what keeps them listening.'
            },
            {
              caption: 'Step 4',
              heading: 'Offer the independent check',
              body:
                '“Hang up with me, wait five minutes, and call the number on the back of your card. If this is genuine, it will still be genuine in five minutes.”\n\n' +
                'The five-minute wait matters — fraudsters keep the line open. Legitimate urgency survives a five-minute delay; fraud does not.'
            },
            {
              caption: 'Step 5',
              heading: 'Hold the payment if doubt remains',
              body:
                'If markers are present and doubt remains after the conversation, place the payment on hold and refer to the fraud team. Explain plainly: “I am holding this for review. If everything checks out it will be released today.”\n\n' +
                'You do not need the customer’s agreement to protect them.'
            }
          ]
        },
        {
          t: 'conversation',
          template: 'supportTicket',
          gate: true,
          cast: [
            {
              key: 'cust',
              name: 'Margaret Hollis (customer)',
              role: 'customer',
              gender: 'female',
              age: 'senior',
              tone: 'light'
            }
          ],
          scenes: [
            {
              key: 'open',
              name: 'The call begins',
              type: 'start',
              background: 'callCenter',
              dialogue: [
                {
                  who: 'cust',
                  text:
                    'I need to make a transfer today please. Nine thousand two hundred, to an account I have been given. It is to secure my funds — it has to be done this afternoon.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“Before we go further — is anyone else with you or on another line?”',
                  to: 'alone',
                  feedback: 'The single highest-value question in the whole script.'
                },
                {
                  label: '“That sounds like a scam — I cannot let you do that.”',
                  to: 'confront',
                  feedback: 'Accurate, but it triggers exactly the reaction the fraudster prepared her for.'
                },
                {
                  label: 'Process it — she is the account holder and has authenticated',
                  to: 'process',
                  feedback: 'Authentication is not the control here. She is authorised and deceived.'
                }
              ]
            },
            {
              key: 'alone',
              name: 'Separating her from the coaching',
              background: 'callCenter',
              dialogue: [
                {
                  who: 'cust',
                  text:
                    'There is… I have the other gentleman on my mobile. He said to keep him on while we do this. He is from your fraud department.',
                  expression: 'confused',
                  gesture: 'questioning'
                }
              ],
              choices: [
                {
                  label: '“Please end that call now. Nobody from Northwind would ever ask you to stay on another line.”',
                  to: 'freed',
                  feedback: 'Correct and decisive. This is the moment the fraud usually collapses.'
                },
                {
                  label: 'Continue while he stays on the line',
                  to: 'process',
                  feedback: 'The fraudster retains live control and will coach her through your questions.'
                }
              ]
            },
            {
              key: 'freed',
              name: 'The line goes quiet',
              background: 'callCenter',
              dialogue: [
                {
                  who: 'cust',
                  text:
                    'He… hung up. As soon as I said you had asked me to. He said he would call me back and he has not.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: 'Explain the fact, block the payment, and raise a fraud case',
                  to: 'end-good'
                }
              ]
            },
            {
              key: 'confront',
              name: 'She defends the story',
              background: 'callCenter',
              dialogue: [
                {
                  who: 'cust',
                  text:
                    'He said you would say that. He said some of your staff are being investigated and that is exactly why this has to be done quietly. I would like to speak to someone else.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                {
                  label: 'Step back: “Understood. Can I just check — is he on another line now?”',
                  to: 'alone',
                  feedback: 'Good recovery. You dropped the argument and returned to the frame that works.'
                },
                {
                  label: 'Repeat that it is a scam, more firmly',
                  to: 'process',
                  feedback: 'Repetition of a rejected frame hardens the position rather than shifting it.'
                }
              ]
            },
            {
              key: 'process',
              name: 'The payment goes',
              background: 'callCenter',
              dialogue: [
                {
                  who: 'cust',
                  text: 'Thank you. He said the money will be back in my own account within the hour.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-bad' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — payment stopped',
              type: 'ending',
              background: 'callCenter',
              outcomeTitle: '£9,200 stopped, and a case opened',
              outcomeDescription:
                'Asking whether anyone else was on the line ended the fraud in under a minute. The payment was blocked, the payee reported to the receiving bank, and Margaret was referred to our vulnerable-customer team. You did not have to win an argument — you only had to remove the fraudster from the room.',
              dialogue: [
                {
                  who: 'cust',
                  text: 'I have been so silly. Thank you for not letting me do it.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-bad',
              name: 'Outcome — funds gone',
              type: 'ending',
              background: 'callCenter',
              outcomeTitle: '£9,200 gone in eleven minutes',
              outcomeDescription:
                'The funds were moved through two mule accounts and withdrawn before the receiving bank could act. Under reimbursement rules Northwind refunded Margaret in full — the loss sits with us, and so does the complaint, the regulatory reporting and the harm to a customer who trusted the caller.',
              dialogue: [
                {
                  who: 'cust',
                  text: 'It has not come back. He is not answering. What have I done?',
                  expression: 'disappointed',
                  gesture: 'questioning'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Hold, Refer or Refuse',
      description: 'The decision rules, and the authority you already have.',
      badgeIcon: '⚖️',
      blocks: [
        { t: 'heading', text: 'You do not need permission to protect a customer' },
        {
          t: 'para',
          html:
            'Agents consistently under-use the hold. In post-incident reviews the most common reason ' +
            'given is "the customer insisted". Insistence is not a reason to release a payment — in a ' +
            'coached fraud, insistence <i>is the symptom</i>.'
        },
        {
          t: 'comparison',
          title: 'Northwind decision rules',
          preset: 'processAB',
          layout: 'stacked',
          columns: [
            {
              title: 'Hold and refer to fraud team',
              accent: '#b7791f',
              rows: [
                'Two or more coaching markers present',
                'Customer reports a third party on another line',
                'Payment described as moving funds "for safety"',
                'New payee, high value, urgency the customer cannot source',
                'Customer has been told to keep the payment private'
              ]
            },
            {
              title: 'Refuse outright and raise a case',
              accent: '#c8372b',
              rows: [
                'Customer confirms someone is instructing them live and will not end that call',
                'Payee already flagged on our mule-account register',
                'Customer repeats the phrase "safe account" after correction',
                'Customer is vulnerable and cannot explain the payment purpose',
                'Any case where you believe releasing would cause foreseeable harm'
              ]
            },
            {
              title: 'Release, with a warning recorded',
              accent: '#0e9d6d',
              rows: [
                'No coaching markers and the purpose is concrete and verifiable',
                'Established payee with prior payment history',
                'Customer independently verified the payee through a known channel',
                'You have given the scam warning and documented the customer’s response'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Decision practice',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'A customer has two coaching markers, becomes distressed, and states clearly: “It is my money and I want it sent.” What do you do?',
              answers: [
                {
                  text: 'Hold the payment and refer to the fraud team, explaining what happens next',
                  correct: true,
                  feedback:
                    'Correct. Distress and insistence are consistent with coaching, not evidence against it. The hold is reversible; the payment is not.'
                },
                {
                  text: 'Release it — the customer is the account holder and has authorised it',
                  feedback:
                    'Authorisation is exactly what APP fraud produces. Ownership of the funds does not remove our duty of care.'
                },
                {
                  text: 'Release it but record that you gave a warning',
                  feedback:
                    'A warning does not discharge our obligation where markers are present, and will not stand up in a reimbursement review.'
                },
                {
                  text: 'Transfer the customer to another agent to decide',
                  feedback:
                    'Passing the decision on loses the context you have gathered and gives the fraudster time to re-coach.'
                }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Before releasing any high-value payment to a new payee:',
          done: 'That is the standard. If any box is unticked, hold and refer.',
          mode: 'allRequired',
          items: [
            { text: 'I asked whether anyone else is with them or on another line' },
            { text: 'I asked an open question about how the payment came about' },
            { text: 'I confirmed the customer can source the urgency concretely' },
            { text: 'I checked no one has asked them to keep it private' },
            { text: 'I gave the relevant scam warning for this payment type' },
            { text: 'I recorded the markers I observed and the customer’s answers' }
          ]
        }
      ]
    },
    {
      title: 'Reimbursement, and Why It Is Ours',
      description: 'What the rules require, and what that means for the person on the phone.',
      badgeIcon: '🛡',
      themeId: 'forest',
      blocks: [
        { t: 'heading', text: 'The loss lands with us either way' },
        {
          t: 'para',
          html:
            'Under mandatory reimbursement rules, victims of APP fraud are refunded in the large majority ' +
            'of cases. Northwind reimbursed <b>£4.9m</b> last year. That figure is not a customer problem ' +
            'transferred to the bank — it is our loss, and it is preventable at the point of the call.'
        },
        {
          t: 'chart',
          title: 'Where a stopped payment saves money (£ per average case)',
          chartType: 'donut',
          showValues: true,
          showLegend: true,
          points: [
            { label: 'Reimbursed to customer', value: 8400, accent: '#c8372b' },
            { label: 'Investigation cost', value: 640, accent: '#b7791f' },
            { label: 'Complaint handling', value: 310, accent: '#4f6df5' },
            { label: 'Regulatory reporting', value: 180, accent: '#8b9dff' }
          ]
        },
        {
          t: 'para',
          html:
            'An intervention that takes four minutes prevents roughly <b>£9,530</b> of direct cost, plus ' +
            'the harm to a customer who may never trust a phone call again.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'What reimbursement covers',
              body:
                'Most consumers, microenterprises and charities are covered for APP scam losses where they were deceived into paying a fraudster.\n\n' +
                'Reimbursement is generally split between the sending and receiving firms, which means our controls and the receiving bank’s controls are both assessed after the event.'
            },
            {
              title: 'Vulnerable customers',
              body:
                'Where a customer is vulnerable, the standard expected of us is higher and exceptions for customer carelessness do not apply in the same way.\n\n' +
                'Age alone does not make someone vulnerable, but distress, confusion, bereavement, health conditions and isolation all matter. If you identify vulnerability, record it and route to the specialist team — this changes both our duty and the customer’s experience.'
            },
            {
              title: 'What we must evidence',
              body:
                'When a claim is reviewed, the question asked is whether we did enough at the point of payment.\n\n' +
                'Your call notes are the evidence. Record the markers you observed, the questions you asked, the warning you gave and the customer’s exact response. "Customer confirmed payment was genuine" is not evidence. "Customer stated payee was her builder but could not name the company and paused 6 seconds" is.'
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
              prompt: 'Which of these should appear in your call notes after an intervention? Select all that apply.',
              feedback:
                'Notes must record observable facts — what was said, what you asked, what you warned. Conclusions without evidence do not support a reimbursement review.',
              answers: [
                { text: 'The specific coaching markers you observed', correct: true, score: 5 },
                { text: 'The exact wording of the scam warning you gave', correct: true, score: 5 },
                { text: 'The customer’s response to the warning, quoted', correct: true, score: 5 },
                { text: 'Whether you identified any vulnerability indicators', correct: true, score: 5 },
                { text: 'Your personal opinion of whether the customer was sensible', score: 0 },
                { text: '“Customer confirmed the payment was genuine.”', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think of a call where you had doubts but released the payment anyway. What specifically stopped you holding it — customer insistence, handling time, uncertainty about your authority? What would you do differently now?',
          size: 'large'
        },
        {
          t: 'quote',
          text:
            'We measured it. Agents who ask “is anyone else on the line?” on every new-payee call over five thousand pounds stop roughly one fraud a fortnight. It is one question.',
          by: 'Head of Fraud Operations, Northwind Financial Technologies',
          pull: true
        }
      ]
    }
  ]
}
