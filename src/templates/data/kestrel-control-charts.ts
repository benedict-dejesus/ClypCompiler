// Kestrel Precision Manufacturing — course 2 of 10.
// Driven by process capability data: operators adjusting on single readings,
// inducing the variation they then chase.
import type { CourseTemplate } from '../types'

export const kestrelControlCharts: CourseTemplate = {
  id: 'kestrel-manufacturing-control-charts',
  title: 'Leave It Alone: Reading a Control Chart Before You React',
  company: 'Kestrel Precision Manufacturing',
  industry: 'Manufacturing',
  gap:
    'Process capability on the bore-grinding cells fell from Cpk 1.42 to 1.08 over nine months with ' +
    'no machine or tooling change. Data-logger analysis shows operators making an offset adjustment ' +
    'after 61% of single out-of-tolerance readings. Each adjustment adds variation, which triggers ' +
    'the next adjustment.',
  audience: 'Machine operators, setters, cell leaders and quality technicians',
  summary:
    'Adjusting a stable process on one bad reading makes it worse — measurably, every time. This ' +
    'course covers the difference between noise and signal, the four chart rules that identify a real ' +
    'change, and the discipline of doing nothing.',
  objectives: [
    'Distinguish common-cause variation from special-cause variation',
    'Apply the four control-chart rules used at Kestrel to identify a genuine signal',
    'Explain why adjusting on a single reading increases variation',
    'Decide correctly between leaving a process alone, investigating, and stopping it'
  ],
  minutes: 28,
  themeId: 'corporate',
  tags: ['quality', 'SPC', 'process control', 'shop floor'],
  gamification: {
    xpPerBlock: 12,
    xpPerGatedBlock: 35,
    xpLessonBonus: 70,
    xpPerLevel: 140,
    badges: [
      { label: 'Knows the Noise', icon: '📉', kind: 'lesson', lesson: 2 },
      { label: 'Reads the Rules', icon: '📏', kind: 'lesson', lesson: 3 },
      { label: 'Process Guardian', icon: '🎯', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    {
      title: 'The Variation We Are Creating',
      description: 'Nine months, no equipment change, and capability fell by a quarter.',
      badgeIcon: '📉',
      blocks: [
        { t: 'heading', text: 'The machine did not get worse. We did.' },
        {
          t: 'para',
          html:
            'Between January and September, Cpk on cells 2, 4 and 7 fell from <b>1.42</b> to <b>1.08</b>. ' +
            'No machine was changed. No tooling supplier was changed. No material specification was ' +
            'changed. Ambient conditions were stable.'
        },
        {
          t: 'para',
          html:
            'What did change was the data-logger record of manual offset adjustments: from a mean of ' +
            '<b>3 per shift</b> to <b>14 per shift</b> over the same period, following a quality briefing ' +
            'that asked operators to “react faster to out-of-tolerance readings”.'
        },
        {
          t: 'chart',
          title: 'Cpk against manual offset adjustments per shift',
          chartType: 'line',
          showValues: true,
          points: [
            { label: 'Jan — 3 adj', value: 142, accent: '#2b7a3f' },
            { label: 'Mar — 6 adj', value: 131, accent: '#2b7a3f' },
            { label: 'May — 9 adj', value: 124, accent: '#b7791f' },
            { label: 'Jul — 12 adj', value: 115, accent: '#b3543f' },
            { label: 'Sep — 14 adj', value: 108, accent: '#b3543f' }
          ]
        },
        {
          t: 'para',
          html:
            'The briefing was well intentioned and it made the product worse. Reacting faster to a stable ' +
            'process is not improvement — it is <b>tampering</b>, and its effect on variation is ' +
            'predictable and mathematical.'
        },
        {
          t: 'comparison',
          title: 'What tampering costs',
          preset: 'beforeAfter',
          layout: 'horizontal',
          columns: [
            {
              title: 'January — Cpk 1.42',
              accent: '#2b7a3f',
              rows: [
                'Roughly 13 parts per million outside tolerance',
                'Scrap value £2,100 per month on these cells',
                'No customer concerns raised',
                '3 adjustments per shift, mostly at setup',
                'Operators trusted the process between checks'
              ]
            },
            {
              title: 'September — Cpk 1.08',
              accent: '#b3543f',
              rows: [
                'Roughly 1,300 parts per million outside tolerance',
                'Scrap value £9,400 per month on the same cells',
                'Two customer concerns and one containment action',
                '14 adjustments per shift, mostly mid-run',
                'Operators chasing a target that keeps moving'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'What happened here',
          gate: true,
          questions: [
            {
              prompt:
                'Capability fell by a quarter with no equipment change. What is the most likely explanation?',
              feedback:
                'Adjusting a stable process on individual readings adds variation. This is tampering, and it is the best-supported explanation given the adjustment data.',
              answers: [
                {
                  text: 'Increased manual adjustment added variation to an already-stable process',
                  correct: true,
                  feedback: 'Correct — the adjustment count and the capability loss track each other precisely.'
                },
                {
                  text: 'Tool wear accumulated over the nine months',
                  feedback: 'Tool wear produces a drift that adjustment corrects. It does not produce widening spread.'
                },
                {
                  text: 'Operators became less skilled',
                  feedback: 'The same operators produced Cpk 1.42 in January. They followed a new instruction.'
                },
                {
                  text: 'Measurement equipment drifted out of calibration',
                  feedback: 'Gauge R&R was repeated in June and was within limits.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Noise and Signal',
      description: 'Why every stable process varies, and what it means when it stops.',
      badgeIcon: '🔊',
      themeId: 'clyp',
      blocks: [
        { t: 'heading', text: 'Variation is not the same as a problem' },
        {
          t: 'para',
          html:
            'Every process varies. Two consecutive parts are never identical — that is physics, not ' +
            'failure. The question a control chart answers is not “did it vary?” but <b>“did it vary more ' +
            'than it normally does?”</b>'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have covered both causes and both mistakes. The two mistakes are what cost us 0.34 of Cpk.',
          panels: [
            {
              title: 'Common cause — the process being itself',
              body:
                'The ordinary, ever-present variation of a stable process: tiny fluctuations in material hardness, coolant temperature, spindle load, ambient conditions, measurement itself.\n\n' +
                'It is <b>random</b>, it is <b>predictable in range</b>, and it belongs to the system. No single point of common-cause variation has a findable cause — asking “why was that part 4 microns high?” has no useful answer when the process is stable.\n\n' +
                'Reducing common-cause variation requires changing the system: better fixturing, tighter coolant control, a different tool grade. It cannot be done from the operator panel.'
            },
            {
              title: 'Special cause — something genuinely changed',
              body:
                'Variation from an identifiable, assignable event outside the normal system: a chipped insert, a loose fixture, a new material batch, a wrong offset entered, a coolant concentration drop.\n\n' +
                'It is <b>not random</b>, it has a findable cause, and it does not belong to the process. This is the variation you should act on — and acting means <i>investigating and removing the cause</i>, not nudging an offset.'
            },
            {
              title: 'Mistake 1 — treating noise as a signal (tampering)',
              body:
                'Adjusting the process in response to common-cause variation. This is what we did between January and September.\n\n' +
                'The mechanism is simple: a part reads high purely by chance, you offset down, the next part was going to be low anyway, so now it is very low. You offset up. Each correction adds its own error on top of the natural variation.\n\n' +
                '<b>The measured result of adjusting a stable process on every reading is that variation roughly doubles.</b> The operator is working hard and making it worse.'
            },
            {
              title: 'Mistake 2 — treating a signal as noise',
              body:
                'Ignoring a genuine special cause because “it is within tolerance”.\n\n' +
                'A run of seven consecutive points above the mean is a signal even if every one is in spec. It means something has shifted, and it will usually keep shifting until it is out of spec — by which point you have made a lot of parts on a drifting process.\n\n' +
                'In-tolerance is not the same as in-control. A process can be entirely within specification and completely out of control.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'In control versus in tolerance',
          preset: 'optionAB',
          layout: 'horizontal',
          columns: [
            {
              title: 'In control',
              accent: '#4a6fa5',
              rows: [
                'The process is behaving predictably',
                'Only common-cause variation is present',
                'You can forecast tomorrow’s output from today’s',
                'Determined by the process itself, from its own data',
                'Tells you whether to act'
              ]
            },
            {
              title: 'In tolerance',
              accent: '#b7791f',
              rows: [
                'The parts happen to meet the drawing',
                'Says nothing about stability or predictability',
                'A process can be in tolerance today and scrap tomorrow',
                'Determined by the customer, from the drawing',
                'Tells you whether to ship'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Noise or signal',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'A stable process has run all shift inside the control limits, varying randomly either side of the mean. The last part measured 6 microns above nominal, still well within tolerance. What should you do?',
              answers: [
                {
                  text: 'Nothing — record it and carry on',
                  correct: true,
                  feedback:
                    'Correct. A single point inside the control limits on a stable process is common-cause variation. Adjusting is tampering.'
                },
                {
                  text: 'Apply a small offset downward to bring it back to nominal',
                  feedback:
                    'This is exactly the behaviour that cost 0.34 of Cpk. The next part was likely to move back toward the mean on its own.'
                },
                {
                  text: 'Stop the machine and call the setter',
                  feedback: 'Stopping a stable process for ordinary variation wastes capacity and finds nothing.'
                },
                {
                  text: 'Re-measure the part three times and average it',
                  feedback: 'Reasonable if you suspect the gauge, but it does not change the fact that the reading was in control.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'The Four Rules',
      description: 'What actually counts as a signal on a Kestrel chart.',
      badgeIcon: '📏',
      blocks: [
        { t: 'heading', text: 'If none of these four are true, leave it alone' },
        {
          t: 'para',
          html:
            'Kestrel uses four detection rules. They exist so that “does this need action?” is a matter ' +
            'of reading the chart rather than a matter of opinion or how the shift is going.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Rule 1',
              heading: 'One point outside the control limits',
              body:
                'Any single point beyond the upper or lower control limit.\n\n' +
                'This is the strongest and most obvious signal — something has changed enough to be visible in a single measurement. <b>Stop and investigate.</b>\n\n' +
                'Note: control limits are not tolerance limits. They are calculated from the process, usually at ±3 sigma. Never draw tolerance limits on a control chart — it invites exactly the confusion between control and conformance.'
            },
            {
              caption: 'Rule 2',
              heading: 'Seven consecutive points on the same side of the mean',
              body:
                'The process has shifted, even if every point is in spec and inside the control limits.\n\n' +
                'Seven in a row on one side has roughly a 1-in-128 chance of happening randomly. It is far more likely something moved: a new material batch, a re-set fixture, a temperature change.\n\n' +
                '<b>Investigate without stopping</b> unless it is also approaching a limit.'
            },
            {
              caption: 'Rule 3',
              heading: 'Seven consecutive points trending up or down',
              body:
                'A steady climb or fall, regardless of where the points sit relative to the mean.\n\n' +
                'This is the classic signature of progressive tool wear, gradual coolant dilution, or a thermal effect building through a shift. It is the one rule where you can usually predict the failure before it happens.\n\n' +
                '<b>Investigate and plan the intervention</b> — a tool change at a chosen moment beats a scrap event at an unchosen one.'
            },
            {
              caption: 'Rule 4',
              heading: 'Two of three consecutive points in the outer third',
              body:
                'Two out of three points beyond 2 sigma on the same side.\n\n' +
                'An early warning that the process is drifting toward a limit before it crosses one. It catches changes that rule 1 would only find later.\n\n' +
                '<b>Investigate.</b> This rule gives you the most time to act.'
            },
            {
              caption: 'And otherwise',
              heading: 'No rule triggered means no action',
              body:
                'If none of the four rules is met, the process is in control and the correct action is <b>to record the reading and carry on</b>.\n\n' +
                'This is not passivity. Deciding not to adjust a stable process is an active, skilled decision, and it is the single highest-value thing an operator can do for capability.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'What to do with a reading',
          prompt: 'Put the steps for handling a measurement into the correct order.',
          pass: 80,
          attempts: 3,
          gate: true,
          items: [
            'Take the measurement using the correct gauge and technique',
            'Plot the point on the chart before interpreting it',
            'Check whether any of the four rules is triggered',
            'If no rule is triggered, record it and continue running',
            'If a rule is triggered, identify which one and what it implies',
            'Investigate the assignable cause rather than adjusting the offset',
            'Record the cause found and the action taken on the chart'
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Which of these are signals',
          pass: 80,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt: 'Which of these patterns require action under the Kestrel rules? Select all that apply.',
              feedback:
                'Rules 1–4 are the only triggers. Individual in-limit points and alternating patterns are not signals.',
              answers: [
                { text: 'One point beyond the upper control limit', correct: true, score: 5 },
                { text: 'Nine consecutive points below the mean, all in tolerance', correct: true, score: 5 },
                { text: 'Eight points climbing steadily, all inside the control limits', correct: true, score: 5 },
                { text: 'Two of the last three points beyond 2 sigma on the same side', correct: true, score: 5 },
                { text: 'A single point 5 microns above nominal, well inside the limits', score: 0 },
                { text: 'Points alternating above and below the mean', score: 0 }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'The Shift Where Nothing Is Wrong',
      description: 'Holding the discipline when a supervisor wants to see you doing something.',
      badgeIcon: '🛠',
      themeId: 'sunrise',
      blocks: [
        { t: 'heading', text: 'Doing nothing does not look like working' },
        {
          t: 'scenario',
          gate: true,
          cast: [
            {
              key: 'sup',
              name: 'Cell Leader',
              role: 'manager',
              gender: 'female',
              age: 'adult',
              tone: 'medium'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'Cell 4, mid-shift',
              type: 'start',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text:
                    'That last one came in at plus six. I have seen three high readings this hour. Put a couple of microns of offset on it before we start making scrap.',
                  expression: 'concerned',
                  gesture: 'pointing'
                }
              ],
              choices: [
                {
                  label: '“All three are inside the limits and no rule has triggered. Adjusting would add variation.”',
                  to: 'explained',
                  feedback: 'Correct, and it gives the reason rather than just refusing.'
                },
                {
                  label: 'Apply the offset — she is the cell leader',
                  to: 'adjusted',
                  feedback: 'This is the September behaviour, and it is how we got to Cpk 1.08.'
                },
                {
                  label: '“The chart says leave it.”',
                  to: 'blunt',
                  feedback: 'True but bare. Without the reasoning it sounds like hiding behind a procedure.'
                }
              ]
            },
            {
              key: 'blunt',
              name: 'She pushes',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text:
                    'The chart is not going to explain it to the customer if we ship a bad batch. Just nudge it.',
                  expression: 'angry',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: 'Show her the run and explain why adjusting increases spread',
                  to: 'explained',
                  feedback: 'Good recovery — showing the actual pattern is far more persuasive than citing a rule.'
                },
                { label: 'Apply the offset to end the discussion', to: 'adjusted' }
              ]
            },
            {
              key: 'explained',
              name: 'Looking at the chart together',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text:
                    'So all three highs are still inside the limits, and they are not seven in a row on the same side. Alright — but if it goes over, I want to know straight away.',
                  expression: 'neutral',
                  gesture: 'listening'
                }
              ],
              choices: [
                {
                  label: 'Agree, and keep plotting every part',
                  to: 'end-good',
                  feedback: 'The right outcome — the process is left alone and genuinely monitored.'
                }
              ]
            },
            {
              key: 'adjusted',
              name: 'The offset goes on',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text: 'Good. That should settle it down.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'See what the chart does next', to: 'end-bad' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — the process stayed stable',
              type: 'ending',
              background: 'factory',
              outcomeTitle: 'No adjustment, no drift',
              outcomeDescription:
                'The run finished inside the control limits with no further intervention. The three high readings were ordinary variation and the next four points came back toward the mean without help. Cell 4 recovered to Cpk 1.31 within six weeks of the no-tamper rule being reinstated.',
              dialogue: [
                {
                  who: 'sup',
                  text:
                    'It came back on its own. I have been asking people to chase those for months.',
                  expression: 'confident',
                  gesture: 'neutral'
                }
              ]
            },
            {
              key: 'end-bad',
              name: 'Outcome — the chase begins',
              type: 'ending',
              background: 'factory',
              outcomeTitle: 'Six adjustments in ninety minutes',
              outcomeDescription:
                'The offset pushed the next parts low, which triggered a correction up, which pushed the following parts high. Six adjustments in ninety minutes and a spread nearly twice the morning’s. Two parts eventually went out of tolerance — the first of the shift, and both after the adjusting started.',
              dialogue: [
                {
                  who: 'sup',
                  text:
                    'It is all over the place now. What has changed on this machine?',
                  expression: 'confused',
                  gesture: 'questioning'
                }
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'The hardest thing we ask an operator to do is stand at a machine that is running well and not touch it. It looks like idleness and it is the most valuable thing on the shift.',
          by: 'Quality Manager, Kestrel Precision Manufacturing',
          pull: true
        }
      ]
    },
    {
      title: 'Making It Stick',
      description: 'What the cells that recovered actually changed.',
      badgeIcon: '🎯',
      blocks: [
        { t: 'heading', text: 'Cell 2 got back to 1.38 in seven weeks' },
        {
          t: 'timeline',
          preset: 'horizontal',
          events: [
            {
              label: 'No-tamper rule reinstated',
              date: 'Week 1',
              body: 'No offset adjustment permitted mid-run unless one of the four rules has triggered. Adjustment at setup and after tool change only.'
            },
            {
              label: 'Rules printed at the machine',
              date: 'Week 1',
              body: 'The four rules on a card at every panel. Removes the “is this worth acting on?” debate from opinion.'
            },
            {
              label: 'Adjustments logged with a reason',
              date: 'Week 2',
              body: 'Every mid-run adjustment requires the triggering rule to be recorded. Adjustments per shift fell from 14 to 4 in a fortnight.'
            },
            {
              label: 'Cpk posted daily on the cell board',
              date: 'Week 3',
              body: 'Visible, immediate feedback. Operators could see the effect of not adjusting within days rather than at the monthly review.'
            },
            {
              label: 'Cpk 1.38',
              date: 'Week 7',
              body: 'Same machines, same tooling, same people. Scrap on the cell fell from £9,400 to £2,600 per month.'
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Commit to what you will change:',
          done: 'Take these to your next cell meeting. The first one is worth more than the rest combined.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will not adjust on a single in-limit reading', required: false },
            { text: 'I will plot the point before I decide anything about it', required: false },
            { text: 'I will check the four rules before touching an offset', required: false },
            { text: 'I will record the triggering rule whenever I do adjust', required: false },
            { text: 'I will investigate the cause rather than nudge the offset', required: false },
            { text: 'I will act on a seven-point trend before it goes out of tolerance', required: false },
            { text: 'I will explain the reasoning if asked to adjust without a signal', required: false }
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
                'Your last eight measurements have climbed steadily from nominal toward the upper control limit, all still in tolerance. What is the correct action?',
              answers: [
                {
                  text: 'Investigate — this is a rule 3 trend, most likely tool wear, and plan the intervention',
                  correct: true,
                  feedback:
                    'Correct. A steady trend is a genuine signal. Acting now lets you change the tool at a moment of your choosing rather than after scrap.'
                },
                {
                  text: 'Nothing — every point is inside tolerance and inside the limits',
                  feedback:
                    'This is mistake 2: treating a signal as noise. Eight climbing points is not random.'
                },
                {
                  text: 'Apply an offset to bring the readings back to nominal',
                  feedback:
                    'This masks the cause. The tool keeps wearing and you will be offsetting again in twenty minutes.'
                },
                {
                  text: 'Wait until a point goes outside the control limit, then act',
                  feedback:
                    'You would be making parts on a known-drifting process for no reason. Rule 3 exists to prevent exactly that wait.'
                }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think about the last time you adjusted a running process. Which of the four rules had triggered? If none had, what would have happened if you had left it alone?',
          size: 'medium'
        }
      ]
    }
  ]
}
