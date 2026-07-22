// Meridian Health Systems — course 4 of 10.
// Driven by 18 months of bereavement complaints: families told of a death in
// corridors, by phone without warning, or in passing during a ward round.
import type { CourseTemplate } from '../types'

export const meridianBreakingBadNews: CourseTemplate = {
  id: 'meridian-health-breaking-bad-news',
  title: 'The Conversation You Cannot Rehearse',
  company: 'Meridian Health Systems',
  industry: 'Healthcare',
  gap:
    'Bereavement and serious-diagnosis complaints rose 41% over 18 months. The complaint text rarely ' +
    'concerns clinical care. It concerns where and how the news was delivered: in corridors, by ' +
    'telephone without warning, in front of other patients, or wrapped in euphemism the family did ' +
    'not understand until hours later.',
  audience: 'Medical staff, senior nurses, midwives and anyone who may deliver serious news to patients or families',
  summary:
    'Families do not complain that the news was bad. They complain about the doorway, the phone call ' +
    'with no warning, and the word “passed” when they needed the word “died”. This course fixes the ' +
    'deliverable parts.',
  objectives: [
    'Prepare the setting, the information and yourself before a serious conversation',
    'Use a warning shot so the news does not arrive without preparation',
    'Say “died” and “cancer” plainly, and tolerate the silence afterwards',
    'Respond to anger, denial and “why did nobody tell us” without becoming defensive'
  ],
  minutes: 27,
  themeId: 'sunrise',
  tags: ['communication', 'bereavement', 'patient experience', 'complaints'],
  gamification: {
    xpPerBlock: 10,
    xpPerGatedBlock: 30,
    xpLessonBonus: 60,
    xpPerLevel: 120,
    badges: [
      { label: 'Prepares Properly', icon: '🚪', kind: 'lesson', lesson: 2 },
      { label: 'Says the Word', icon: '💬', kind: 'lesson', lesson: 3 },
      { label: 'Holds the Silence', icon: '🤝', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    // ---------------------------------------------------------------- 1 ---
    {
      title: 'What Families Actually Complain About',
      description: 'Eighteen months of complaint text, categorised.',
      badgeIcon: '📮',
      blocks: [
        { t: 'heading', text: 'Almost none of it is about the clinical care' },
        {
          t: 'para',
          html:
            'We reviewed <b>96 complaints</b> relating to serious news or bereavement over 18 months. ' +
            'Only <b>11</b> raised a concern about the clinical management. The remaining 85 were about ' +
            'the conversation itself.'
        },
        {
          t: 'chart',
          title: 'Primary complaint theme (n=96)',
          chartType: 'bar',
          showValues: true,
          points: [
            { label: 'Told in a corridor or doorway', value: 24, accent: '#d9480f' },
            { label: 'Phoned with no warning', value: 19, accent: '#d9480f' },
            { label: 'Euphemism — did not understand', value: 17, accent: '#f7b733' },
            { label: 'Nobody sat down', value: 14, accent: '#f7b733' },
            { label: 'Told in front of others', value: 11, accent: '#f7b733' },
            { label: 'Clinical care concern', value: 11, accent: '#4a6fa5' }
          ]
        },
        {
          t: 'para',
          html:
            'Every one of the top five is a <b>choice we control completely</b>. None requires more ' +
            'staff, more time, or more training in clinical medicine. They require a room, a warning, ' +
            'and a plain word.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have read all four extracts. These are lightly anonymised from our own complaint file.',
          panels: [
            {
              title: '“He told us by the lift”',
              body:
                '<i>“We had been waiting three hours. A doctor came out, said he was very sorry but Dad had died, and then someone called him and he had to go. We were standing by the lift. People were walking past us with their coffees. My sister sat on the floor.”</i>\n\n' +
                'The clinical care in this case was exemplary and the family said so. The complaint was upheld on the location of the conversation alone.'
            },
            {
              title: '“She was driving”',
              body:
                '<i>“The phone rang and the nurse said, is that Mrs Okafor, I am afraid your husband passed away at four o’clock this morning. I was on the A46. I do not remember pulling over.”</i>\n\n' +
                'A phone call is sometimes unavoidable. Calling without establishing where someone is and whether they are alone is not.'
            },
            {
              title: '“What does unsurvivable mean?”',
              body:
                '<i>“He said the injuries were unsurvivable and we should prepare ourselves. We thought that meant it was serious. We went to get something to eat. He died while we were in the canteen and nobody had told us he was dying right then.”</i>\n\n' +
                'Euphemism is often kindness misdirected. “Unsurvivable” was accurate and was not understood.'
            },
            {
              title: '“Nobody sat down”',
              body:
                '<i>“The consultant stood at the end of the bed with his hands in his pockets and the curtain half open. The lady in the next bed heard everything. He was perfectly polite. It took ninety seconds and then he left.”</i>\n\n' +
                'Sitting down is consistently reported by families as the single strongest signal that they were not being rushed. It costs nothing.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'Where the harm is',
          gate: true,
          questions: [
            {
              prompt:
                'Across 96 complaints, only 11 concerned clinical management. What does that tell us about where to focus?',
              feedback:
                'The distress families report is overwhelmingly about the delivery of the news, which is entirely within our control.',
              answers: [
                {
                  text: 'The deliverable elements — setting, warning, plain language — cause most of the harm',
                  correct: true,
                  feedback: 'Yes, and all of them are fixable today without any additional resource.'
                },
                {
                  text: 'Families do not understand clinical care well enough to judge it',
                  feedback: 'Several complaints praised the clinical care explicitly. They were not confused about it.'
                },
                {
                  text: 'Complaints are an unreliable measure of quality',
                  feedback: 'They are a direct measure of experience, which is what these 85 complaints describe.'
                },
                {
                  text: 'Staff need more training in breaking bad news theory',
                  feedback:
                    'Most staff already know the theory. The gap is in the room chosen and the words used under pressure.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 2 ---
    {
      title: 'Before You Say Anything',
      description: 'The five minutes of preparation that prevent most complaints.',
      badgeIcon: '🚪',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'Preparation is most of the conversation' },
        {
          t: 'para',
          html:
            'You cannot rehearse the words — every family is different. You can control the room, the ' +
            'information, the interruptions and who is with you. Those four things account for most of ' +
            'what families later describe as being handled well or badly.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'The room',
              body:
                'A room with a door, chairs for everyone, and tissues. Not a corridor. Not a doorway. Not the end of a bed with the curtain half drawn.\n\n' +
                'If the relatives’ room is occupied, use an office, a treatment room, anywhere with a door that closes. Twenty-four of our 96 complaints would not exist if this had been done.\n\n' +
                'Sit down. Always. Even if you have ninety seconds, sit for the ninety seconds — families consistently report that standing signalled they were an interruption.'
            },
            {
              title: 'The information',
              body:
                'Know the facts before you walk in: the sequence of events, the time of death or the exact diagnosis, what was done, and what happens next.\n\n' +
                'Know what they have already been told. Contradicting a colleague’s account is one of the fastest ways to destroy trust, and it happens most often when nobody checked first.\n\n' +
                'Know the name. Say the patient’s name, not “your father” and never “the patient in bed 12”.'
            },
            {
              title: 'The interruptions',
              body:
                'Hand your bleep to a colleague. Silence your phone — not vibrate, silent.\n\n' +
                'Tell the nurse in charge you are unavailable for the next twenty minutes. In our complaints, being interrupted mid-conversation appeared in 9 cases and was described in every one as evidence that the family did not matter.\n\n' +
                'If you genuinely may be called to an emergency, say so at the start rather than leaving abruptly: “I have my emergency bleep with me — if it goes I will have to step out, and I will come straight back.”'
            },
            {
              title: 'Who comes with you',
              body:
                'Take a nurse who knows the family, and who will still be there after you leave. You will go to the next patient; they will stay. That continuity matters more to the family than your seniority.\n\n' +
                'Ask the family who they want present, and whether anyone is travelling. “Would you like to wait until your brother arrives?” is often the kindest question available — but do not delay if the patient is actively dying.\n\n' +
                'Consider an interpreter early. Family members must not interpret news of a death.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Preparing for the conversation',
          prompt: 'Put the preparation steps into a sensible order.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Confirm the facts and what the family has already been told',
            'Find a private room with enough chairs',
            'Ask a nurse who knows the family to come with you',
            'Hand over your bleep and silence your phone',
            'Ask who is present and whether anyone is travelling',
            'Sit down at the same level as the family',
            'Give a warning shot before the news itself'
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'The phone call',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You must telephone a relative to ask them to come in urgently because their mother is dying. What do you say first?',
              answers: [
                {
                  text: 'Confirm who you are speaking to, ask whether they are somewhere they can talk safely, then give a warning shot',
                  correct: true,
                  feedback:
                    'Correct. Establishing they are not driving and are not alone takes ten seconds and prevents the harm described in 19 of our complaints.'
                },
                {
                  text: 'Tell them immediately that their mother has deteriorated and is dying',
                  feedback:
                    'They may be driving, at work, or with young children. The information is right; the sequence causes avoidable harm.'
                },
                {
                  text: 'Ask them to come in without saying why, to avoid distressing them on the phone',
                  feedback:
                    'Families consistently report that arriving unprepared to find their relative dying or dead was worse than being warned.'
                },
                {
                  text: 'Leave a voicemail asking them to call the ward back',
                  feedback:
                    'This creates an agonising gap. If you reach voicemail, ask them to call urgently and keep trying other contacts.'
                }
              ]
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 3 ---
    {
      title: 'The Words, and the Silence After',
      description: 'Why “passed” causes harm, and why the pause is the skill.',
      badgeIcon: '💬',
      blocks: [
        { t: 'heading', text: 'Say the word that cannot be misunderstood' },
        {
          t: 'para',
          html:
            'Seventeen of our 96 complaints described families who did not realise what they had been ' +
            'told. In every case the clinician had been trying to soften it. Softening the word does not ' +
            'soften the news — it delays comprehension to a moment when nobody is with them.'
        },
        {
          t: 'comparison',
          title: 'What we say, and what families hear',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'Euphemism',
              accent: '#b3543f',
              rows: [
                '“We lost him.” — heard as: something went wrong, or he is missing',
                '“She has passed.” — heard as: passed what? a test? a crisis?',
                '“The injuries were unsurvivable.” — heard as: very serious',
                '“There is a shadow on the scan.” — heard as: probably nothing',
                '“We are moving to comfort care.” — heard as: he is more comfortable now'
              ]
            },
            {
              title: 'Plain',
              accent: '#2b7a3f',
              rows: [
                '“He died at ten past four this morning.”',
                '“She died a few minutes ago. I am so sorry.”',
                '“He is going to die from these injuries. It will be today.”',
                '“The scan shows cancer.”',
                '“He is dying. We cannot stop that now, and we will keep him comfortable.”'
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
              heading: 'The warning shot',
              body:
                '“I am afraid I have some very bad news.” Then <b>stop</b>. Wait two or three seconds.\n\n' +
                'This short pause lets the family brace. It is the single most reliably praised element in our positive feedback, and it takes three seconds. Without it, the news lands before they have begun to listen.'
            },
            {
              caption: 'Step 2',
              heading: 'The news, in one sentence',
              body:
                '“Your mother died at half past two this afternoon.” One sentence. Plain word. Time included.\n\n' +
                'Do not stack the explanation on top of it. Whatever you say in the next thirty seconds will not be remembered, so do not put anything important there.'
            },
            {
              caption: 'Step 3',
              heading: 'Then stop talking',
              body:
                'This is the hard part. The silence will feel unbearable to you and it is not unbearable to them — it is the space in which they take it in.\n\n' +
                'Clinicians fill silence with clinical detail because the silence is uncomfortable for <i>us</i>. Count to ten silently if you need to. Let them speak first.'
            },
            {
              caption: 'Step 4',
              heading: 'Follow their lead',
              body:
                'Some families want every detail immediately. Some want none. Ask: “What would help most right now — would you like me to explain what happened, or would you rather sit for a moment?”\n\n' +
                'Answer the question they ask, not the one you prepared for.'
            },
            {
              caption: 'Step 5',
              heading: 'Say what happens next',
              body:
                'Before you leave: what happens to their relative now, who will contact them, when, and how to reach someone.\n\n' +
                'Write the name and number down and hand it over. Nobody retains a name given verbally in that moment, and “I was told someone would ring and nobody did” appears in 12 of our complaints.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Language check',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'Which of these should be avoided when telling a family someone has died? Select all that apply.',
              feedback:
                'Every euphemism here has been misunderstood by a real family in our complaint file.',
              answers: [
                { text: '“We lost her.”', correct: true, score: 5 },
                { text: '“She has passed.”', correct: true, score: 5 },
                { text: '“She has gone to a better place.”', correct: true, score: 5 },
                { text: '“Her condition proved unsurvivable.”', correct: true, score: 5 },
                { text: '“She died at ten past four. I am so sorry.”', score: 0 },
                { text: '“She died a few minutes ago, while you were on your way.”', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think about the last time you delivered serious news. Did you fill the silence, or let it sit? What did you say in the thirty seconds after the news — and would the family have remembered any of it?',
          size: 'medium'
        }
      ]
    },
    // ---------------------------------------------------------------- 4 ---
    {
      title: 'When It Goes Somewhere Difficult',
      description: 'Anger, disbelief, and “why did nobody tell us sooner”.',
      badgeIcon: '🌊',
      themeId: 'plum',
      blocks: [
        { t: 'heading', text: 'Anger in this room is grief, not a complaint' },
        {
          t: 'para',
          html:
            'Anger arriving within seconds of the news is almost never about you and almost never about ' +
            'the care. It is the first available response to something unbearable. The instinct to ' +
            'defend the clinical decisions is understandable and it is exactly wrong.'
        },
        {
          t: 'scenario',
          gate: true,
          cast: [
            {
              key: 'son',
              name: 'Daniel Reeve (son)',
              role: 'customer',
              gender: 'male',
              age: 'adult',
              tone: 'light'
            },
            {
              key: 'nurse',
              name: 'Staff Nurse Achebe',
              role: 'nurse',
              gender: 'female',
              age: 'adult',
              tone: 'deep'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'The relatives’ room',
              type: 'start',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'You are telling me she died an hour ago? I was here at six. Nobody said she was even unwell. What were you all doing?',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ],
              choices: [
                {
                  label: '“You are right that you should have been called sooner. I am sorry.”',
                  to: 'acknowledged',
                  feedback:
                    'Acknowledging the specific thing he is angry about, without defending, is what lowers the temperature.'
                },
                {
                  label: '“She was reviewed regularly and everything appropriate was done.”',
                  to: 'defended',
                  feedback:
                    'Factually true and heard as a defence. He has not asked a clinical question — he has expressed grief.'
                },
                {
                  label: '“I understand this is very difficult for you.”',
                  to: 'generic',
                  feedback:
                    'Well intended, but generic empathy in this moment often reads as a script rather than a response.'
                }
              ]
            },
            {
              key: 'acknowledged',
              name: 'The anger drops',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'I just… I would have stayed. If anyone had said. I would have stayed.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: 'Say nothing. Let the silence sit.',
                  to: 'sat',
                  feedback: 'Correct. He is no longer angry — he is grieving, and there is nothing to say to that.'
                },
                {
                  label: 'Explain the clinical sequence now that he is calmer',
                  to: 'sat',
                  feedback: 'Not yet. He will ask when he is ready, and he will remember that answer.'
                }
              ]
            },
            {
              key: 'generic',
              name: 'It does not land',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'Do not do that. Do not give me the line. I want to know why nobody phoned me.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                {
                  label: '“That is a fair question and I do not know yet. I will find out and tell you.”',
                  to: 'acknowledged',
                  feedback:
                    'Honest, specific, and it commits to something. Not knowing is acceptable; pretending to know is not.'
                },
                { label: 'Repeat the empathy line', to: 'defended' }
              ]
            },
            {
              key: 'defended',
              name: 'It escalates',
              background: 'hospital',
              dialogue: [
                {
                  who: 'son',
                  text:
                    'I am not accusing anyone of anything. I am asking why I was not called. And you are reading me a statement.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ],
              choices: [
                {
                  label: 'Stop, apologise for the response, and answer the actual question',
                  to: 'acknowledged',
                  feedback: 'Recoverable. Naming your own misstep is disarming and honest.'
                },
                { label: 'Continue explaining the clinical management', to: 'end-poor' }
              ]
            },
            {
              key: 'sat',
              name: 'Sitting with it',
              background: 'hospital',
              dialogue: [
                {
                  who: 'nurse',
                  text:
                    'Take whatever time you need, Daniel. I am not going anywhere, and you can see her whenever you are ready.',
                  expression: 'concerned',
                  gesture: 'listening'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-good' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — held, not managed',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'No complaint, and a family who felt met',
              outcomeDescription:
                'The question about the missed call was genuine and was answered honestly two days later by the ward manager, with a duty-of-candour discussion. The family raised no complaint. What they later described as mattering most was that nobody argued with them in that room, and that the nurse stayed.',
              dialogue: [
                {
                  who: 'son',
                  text: 'Thank you for not trying to make it better. There is nothing that makes it better.',
                  expression: 'disappointed',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-poor',
              name: 'Outcome — a formal complaint',
              type: 'ending',
              background: 'hospital',
              outcomeTitle: 'Complaint upheld on communication',
              outcomeDescription:
                'The clinical care was found to be appropriate throughout. The complaint was upheld on communication: the family described being “given a defence when we wanted an apology”. The distance between those two things was about four sentences in a small room.',
              dialogue: [
                {
                  who: 'son',
                  text: 'I want this in writing. All of it. Who was in charge of her care?',
                  expression: 'angry',
                  gesture: 'pointing'
                }
              ]
            }
          ]
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered the four hardest responses.',
          panels: [
            {
              title: '“You are wrong — she was fine yesterday”',
              body:
                'Disbelief is a normal first response and it is not a factual dispute. Do not marshal evidence.\n\n' +
                '“I know. It does not seem possible.” Then wait. Correcting them at this point achieves nothing except making them defend a position they do not actually hold.'
            },
            {
              title: '“Could you have done something sooner?”',
              body:
                'Answer honestly and do not speculate. If you do not know, say so and commit to finding out with a named person and a timeframe.\n\n' +
                'If something did go wrong, our duty of candour requires us to say so — and the family almost always already suspects. Concealment converts grief into litigation more reliably than error does.'
            },
            {
              title: '“How long has she got?”',
              body:
                'Give a range and own the uncertainty: “I think days rather than weeks, but I have been wrong in both directions before.”\n\n' +
                'Refusing to answer is experienced as evasion. False precision is worse — families plan around the number you give, and rearrange their lives around it.'
            },
            {
              title: 'When they ask you not to tell the patient',
              body:
                'A common and well-meant request. You cannot promise it: a patient with capacity has a right to information about their own condition if they want it.\n\n' +
                '“I will not force information on her. But if she asks me directly, I will not lie to her. Can we talk about what worries you most about her knowing?” Almost always, the fear underneath is that the patient will give up — and that can be discussed.'
            }
          ]
        }
      ]
    },
    // ---------------------------------------------------------------- 5 ---
    {
      title: 'Afterwards',
      description: 'The follow-through the family remembers, and what it costs you.',
      badgeIcon: '🤝',
      blocks: [
        { t: 'heading', text: 'What happens after you leave the room' },
        {
          t: 'para',
          html:
            'Twelve of our 96 complaints were not about the conversation at all — they were about what ' +
            'was promised in it and never happened. A returned call, a name, a copy of results, an ' +
            'answer to a question.'
        },
        {
          t: 'checklist',
          title: 'Before you leave the conversation, make sure:',
          done: 'That is the follow-through. It is the part families measure us by afterwards.',
          mode: 'allRequired',
          items: [
            { text: 'They have a name and a direct number, written down and handed over' },
            { text: 'They know what physically happens to their relative next' },
            { text: 'They know who will contact them, and roughly when' },
            { text: 'Any question I could not answer is written down with an owner' },
            { text: 'The nurse staying with them knows what was said' },
            { text: 'I have documented the conversation, including who was present' }
          ]
        },
        {
          t: 'heading', text: 'And you', level: 'h3'
        },
        {
          t: 'para',
          html:
            'Delivering this news repeatedly has a cumulative cost, and pretending otherwise is how ' +
            'people leave the profession. Our staff survey found <b>64%</b> of doctors and senior nurses ' +
            'had delivered news of a death and then gone straight to the next patient with no pause at all.'
        },
        {
          t: 'comparison',
          title: 'What helps, and what does not',
          preset: 'optionAB',
          layout: 'card',
          columns: [
            {
              title: 'Does not help',
              accent: '#b3543f',
              rows: [
                'Going straight to the next patient',
                'Deciding you should be used to it by now',
                'Judging your own reaction against a colleague’s',
                'Waiting for a formal debrief that never gets scheduled',
                'Assuming distress means you are not suited to the work'
              ]
            },
            {
              title: 'Helps',
              accent: '#2b7a3f',
              rows: [
                'Two minutes outside the ward before the next patient',
                'Telling one colleague what just happened',
                'A hot debrief with whoever was in the room, same shift',
                'Naming it in your reflective practice, honestly',
                'Using the staff support line — it is confidential and it is used'
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
                'You have told a family their father died. They are quiet. You have ninety seconds before you are needed elsewhere. What is the best use of that time?',
              answers: [
                {
                  text: 'Sit in the silence with them, then give a name and number and confirm who will follow up',
                  correct: true,
                  feedback:
                    'Correct. The silence and the written contact details are the two things families report mattering most.'
                },
                {
                  text: 'Explain the clinical sequence so they understand what happened',
                  feedback:
                    'They will not retain it now. Offer it later, when they ask — that is when it will be heard.'
                },
                {
                  text: 'Reassure them that everything possible was done',
                  feedback:
                    'Often heard as pre-emptive defence, particularly if they have not questioned the care.'
                },
                {
                  text: 'Excuse yourself quickly so they can have privacy',
                  feedback:
                    'Leaving immediately is what produced the corridor complaints. Someone should stay, even if it is not you.'
                }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take one of these to your next team meeting. The room and the word are the two that move the numbers.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will never deliver this news in a corridor or doorway again', required: false },
            { text: 'I will sit down, every time, even when I have no time', required: false },
            { text: 'I will use a warning shot and then pause before the news', required: false },
            { text: 'I will say “died”, not “passed” or “lost”', required: false },
            { text: 'I will stop talking after the news and let them speak first', required: false },
            { text: 'I will check where someone is before giving bad news by phone', required: false },
            { text: 'I will write down a name and number and hand it over', required: false },
            { text: 'I will take two minutes for myself before the next patient', required: false }
          ]
        },
        {
          t: 'quote',
          text:
            'She sat down. That is what I remember about the worst day of my life. Everything else is a blur, but I remember that she sat down and she did not look at the door.',
          by: 'Family feedback, Meridian Health Systems bereavement survey',
          pull: true
        }
      ]
    }
  ]
}
