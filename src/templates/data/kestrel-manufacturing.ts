// Kestrel Precision Manufacturing — tier-one automotive components supplier.
// 620 shop-floor staff across two plants; courses driven by HSE improvement
// notices, near-miss data and internal audit findings.
import type { CourseTemplate } from '../types'

export const kestrelLockoutTagout: CourseTemplate = {
  id: 'kestrel-manufacturing-lockout-tagout',
  title: 'Lockout/Tagout: The Steps People Skip',
  company: 'Kestrel Precision Manufacturing',
  industry: 'Manufacturing',
  gap:
    'Three near-misses in twelve months involved machinery that was isolated but not verified as ' +
    'de-energised. Operators reliably apply locks but skip stored-energy dissipation and the try-out ' +
    'step, particularly on hydraulic presses and pneumatic feed lines during short interventions.',
  audience: 'Machine operators, setters, maintenance technicians and shift supervisors',
  summary:
    'Targets the two steps that get dropped when a job "will only take a minute": releasing stored ' +
    'energy and verifying zero energy. Built around our own near-miss reports.',
  objectives: [
    'Apply all six LOTO steps in sequence, including verification',
    'Identify stored energy sources that remain live after isolation',
    'Apply group lockout correctly when more than one person is working',
    'Refuse to work on equipment that has not been verified, regardless of production pressure'
  ],
  minutes: 30,
  themeId: 'sunrise',
  tags: ['machine safety', 'LOTO', 'compliance', 'shop floor'],
  gamification: {
    xpPerBlock: 12,
    xpPerGatedBlock: 35,
    xpLessonBonus: 70,
    xpPerLevel: 140,
    badges: [
      { label: 'Zero Energy', icon: '⚡', kind: 'lesson', lesson: 3 },
      { label: 'Stops the Line', icon: '🛑', kind: 'lesson', lesson: 4 },
      { label: 'LOTO Certified', icon: '🔒', kind: 'course' }
    ]
  },
  gatekeeping: { navigation: 'linear', lessonCompletion: 'gates', completionScreen: true },
  lessons: [
    {
      title: 'Three Near-Misses, One Pattern',
      description: 'What actually happened on our own shop floor, and the step every incident shared.',
      badgeIcon: '⚠️',
      blocks: [
        { t: 'heading', text: 'Nobody in these reports was reckless' },
        {
          t: 'para',
          html:
            'Every one of the three near-misses below was caused by an experienced person doing a short ' +
            'job on equipment they knew well. In all three, a lock was correctly applied. In all three, ' +
            '<b>the energy was still there</b>.'
        },
        {
          t: 'timeline',
          preset: 'alternating',
          events: [
            {
              label: 'Press 4 — hydraulic ram descent',
              date: 'March',
              body:
                'Setter isolated electrical supply and applied a personal lock to clear a jammed blank. The ram descended 40mm under gravity as the jam released. Isolation was correct; the hydraulic accumulator had not been bled and the ram had not been blocked.'
            },
            {
              label: 'Line 2 — pneumatic feed actuator',
              date: 'July',
              body:
                'Operator isolated air at the wall valve to clear a feed misalignment. Residual pressure downstream of the valve fired the actuator when the guard was opened. The line had not been vented and no try-out was performed.'
            },
            {
              label: 'Cell 7 — robot re-energised mid-task',
              date: 'November',
              body:
                'Technician applied a lock. A second technician arrived to help, found the machine already locked, and began work without applying their own lock. The first technician finished, removed their lock and restarted the cell.'
            }
          ]
        },
        {
          t: 'comparison',
          title: 'What was done versus what was required',
          preset: 'correctIncorrect',
          layout: 'horizontal',
          columns: [
            {
              title: 'What happened',
              accent: '#b3543f',
              rows: [
                'Energy source isolated at the correct point',
                'Personal padlock applied',
                'Job assessed as "two minutes"',
                'Stored energy left in the system',
                'No attempt to operate controls before starting',
                'Second worker relied on the first worker’s lock'
              ]
            },
            {
              title: 'What the procedure requires',
              accent: '#2b7a3f',
              rows: [
                'Energy source isolated at the correct point',
                'Personal padlock applied by every person working',
                'Duration is irrelevant — the procedure does not scale down',
                'All stored energy released, blocked or restrained',
                'Try-out: attempt normal start, confirm nothing moves',
                'Group lockout box with one lock per worker'
              ]
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'knowledgeCheck',
          poolTitle: 'What connects them',
          gate: true,
          questions: [
            {
              prompt: 'All three incidents shared one missing step. Which was it?',
              feedback:
                'Isolation stops new energy arriving. Verification proves what is already in the machine cannot hurt you.',
              answers: [
                {
                  text: 'Verification that the machine was actually at zero energy',
                  correct: true,
                  feedback: 'Exactly. All three isolated correctly and none confirmed the result.'
                },
                { text: 'Applying a padlock', feedback: 'A lock was applied in all three cases.' },
                { text: 'Identifying the correct isolation point', feedback: 'The isolation points were correct each time.' },
                { text: 'Wearing the right PPE', feedback: 'PPE was not a factor in any of the three.' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'The Six Steps, In Order',
      description: 'The full sequence, with the two steps our data says get dropped.',
      badgeIcon: '📋',
      themeId: 'corporate',
      blocks: [
        { t: 'heading', text: 'Six steps — and the order is not optional' },
        {
          t: 'para',
          html:
            'LOTO is a sequence, not a checklist you can reorder. Each step depends on the one before it. ' +
            'Steps <b>4</b> and <b>5</b> are the ones our near-misses skipped.'
        },
        {
          t: 'accordion',
          multi: true,
          gate: true,
          gateMessage: 'You have reviewed all six steps. Steps 4 and 5 are the ones to watch.',
          panels: [
            {
              title: 'Step 1 — Prepare and notify',
              body:
                'Identify every energy source feeding the equipment: electrical, hydraulic, pneumatic, mechanical, thermal, chemical, and gravity. Most machines have more than one, and gravity is the one people forget because there is no valve for it.\n\n' +
                'Tell the shift supervisor and anyone working downstream before you isolate. Unannounced isolation causes people to investigate a "fault" that is actually your job.'
            },
            {
              title: 'Step 2 — Shut down normally',
              body:
                'Use the normal stop sequence. Do not use an emergency stop as your shutdown method — E-stops may not remove all power, and using them routinely masks genuine emergencies.'
            },
            {
              title: 'Step 3 — Isolate every source',
              body:
                'Operate each isolating device to cut the supply. Main breaker for electrical, block valve for hydraulic and pneumatic, physical restraint for gravity and springs.\n\n' +
                'A single isolation is rarely enough. Press 4 has four separate sources; Cell 7 has three.'
            },
            {
              title: 'Step 4 — Release stored energy',
              body:
                '<b>This is the step that nearly crushed a setter on Press 4.</b>\n\n' +
                'Isolation stops energy arriving. It does nothing about energy already in the system: pressure in accumulators and downstream lines, springs under compression, raised rams and tooling held by gravity, capacitors, flywheels still spinning, and hot surfaces.\n\n' +
                'Bleed pressure to atmosphere. Vent downstream lines, not just at the valve. Block or lower raised components onto mechanical stops. Wait for rotation to stop completely — not "nearly stopped".'
            },
            {
              title: 'Step 5 — Lock and tag',
              body:
                'Every person working applies their own lock. Not one lock for the team — one lock <i>each</i>, on a hasp or a group lockout box.\n\n' +
                'Cell 7 happened because a second technician trusted a colleague’s lock. Your lock is the only thing guaranteeing that the machine cannot start while your hands are inside it, because only you hold its key.\n\n' +
                'The tag records who, when and why. The lock does the protecting; the tag does the communicating.'
            },
            {
              title: 'Step 6 — Verify zero energy',
              body:
                '<b>The step that would have prevented all three incidents.</b>\n\n' +
                'Attempt to start the machine using the normal controls. Confirm nothing moves. Return controls to off.\n\n' +
                'Test electrically with a meter — prove the meter works on a known live source first, test the circuit, then prove the meter again. Check gauges read zero. Physically confirm raised parts are supported.\n\n' +
                'Verification takes about thirty seconds. It is the only step that produces evidence rather than assumption.'
            }
          ]
        },
        {
          t: 'sequence',
          poolTitle: 'Correct LOTO order',
          prompt: 'Arrange the six lockout/tagout steps into the required sequence.',
          pass: 100,
          attempts: 3,
          gate: true,
          items: [
            'Prepare: identify all energy sources and notify affected staff',
            'Shut down using normal stop controls',
            'Isolate every energy source at its isolating device',
            'Release, block or restrain all stored energy',
            'Apply a personal lock and tag for every person working',
            'Verify zero energy by attempting start-up and testing'
          ]
        }
      ]
    },
    {
      title: 'Stored Energy: What Stays Live',
      description: 'The energy that remains after isolation, source by source.',
      badgeIcon: '⚡',
      blocks: [
        { t: 'heading', text: 'Isolated is not the same as safe' },
        {
          t: 'para',
          html:
            'Every source below stays dangerous after correct isolation. This is the knowledge our ' +
            'near-miss reports show is thinnest on the floor.'
        },
        {
          t: 'tabs',
          gate: true,
          panels: [
            {
              title: 'Hydraulic',
              body:
                'Accumulators store pressure specifically so it survives supply loss — that is their entire purpose. Closing the supply valve leaves them fully charged.\n\n' +
                '<b>Release:</b> open the accumulator dump valve and confirm the gauge reads zero. Lower or mechanically block any raised ram. On Press 4, gravity alone will drive the ram down when a jam clears.\n\n' +
                'A gauge reading zero at the pump does not mean zero at the cylinder.'
            },
            {
              title: 'Pneumatic',
              body:
                'Air downstream of the isolation valve stays at full pressure and expands fast enough to move an actuator through its whole stroke.\n\n' +
                '<b>Release:</b> vent downstream through the exhaust port and listen for the system to stop hissing. Confirm the downstream gauge reads zero. This is exactly what was missed on Line 2 in July.'
            },
            {
              title: 'Mechanical and gravity',
              body:
                'Springs under compression, counterweights, raised tooling, loaded conveyors and flywheels all hold energy no valve can remove.\n\n' +
                '<b>Release:</b> lower loads to their lowest position or insert rated mechanical blocks and safety props. Let flywheels come to a complete stop — a slowly turning flywheel still carries enough energy to take a hand.'
            },
            {
              title: 'Electrical and thermal',
              body:
                'Capacitors in drives and power supplies hold lethal charge after isolation, often for several minutes. VFDs are the common case on our lines.\n\n' +
                '<b>Release:</b> observe the manufacturer’s stated discharge time, then test to prove dead. Hot surfaces on moulding and welding equipment need time or active cooling before contact.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'multipleResponse',
          poolTitle: 'Stored energy check',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You have isolated electrical and hydraulic supply to Press 4 and applied your lock. Which hazards may still be present? Select all that apply.',
              feedback:
                'Isolation removes the supply. Accumulator charge, gravity on the raised ram and drive capacitors are all unaffected by it.',
              answers: [
                { text: 'Pressure retained in the hydraulic accumulator', correct: true, score: 5 },
                { text: 'The raised ram descending under gravity', correct: true, score: 5 },
                { text: 'Residual charge in the drive capacitors', correct: true, score: 5 },
                { text: 'Mains voltage at the motor terminals', score: 0 },
                { text: 'New hydraulic pressure from the pump', score: 0 }
              ]
            }
          ]
        },
        {
          t: 'checklist',
          title: 'Before you put your hands in the machine, confirm:',
          done: 'That is a verified zero-energy state. Now the job can start.',
          mode: 'allRequired',
          items: [
            { text: 'Every energy source on the equipment register is isolated' },
            { text: 'Accumulators dumped and gauges confirmed at zero' },
            { text: 'Downstream pneumatic lines vented to atmosphere' },
            { text: 'Raised components lowered or mechanically blocked' },
            { text: 'Rotating parts have come to a complete stop' },
            { text: 'My own personal lock and tag are fitted' },
            { text: 'I attempted normal start-up and nothing moved' },
            { text: 'I tested electrically and proved the meter before and after' }
          ]
        }
      ]
    },
    {
      title: 'When Production Pushes Back',
      description: 'Holding the procedure when the line is down and someone senior is waiting.',
      badgeIcon: '🛑',
      themeId: 'plum',
      blocks: [
        { t: 'heading', text: 'The pressure is real. The answer is still no.' },
        {
          t: 'para',
          html:
            'Every near-miss report we hold contains a version of the same sentence: <i>"it was only going ' +
            'to take a minute"</i>. The pressure is genuine — a stopped line costs roughly £4,100 an hour ' +
            'and everyone on shift feels it. Kestrel’s position is unambiguous: <b>no one may be ' +
            'disciplined for completing LOTO correctly</b>, and stopping work on unverified equipment is ' +
            'always a protected act.'
        },
        {
          t: 'scenario',
          gate: true,
          cast: [
            {
              key: 'sup',
              name: 'Shift Supervisor',
              role: 'manager',
              gender: 'male',
              age: 'adult',
              tone: 'light'
            }
          ],
          scenes: [
            {
              key: 'start',
              name: 'The line is down',
              type: 'start',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text:
                    'Line 2 has been down eleven minutes. It is one misaligned blank — reach in, pull it, we are running again. You do not need the full lockout for that.',
                  expression: 'concerned',
                  gesture: 'explaining'
                }
              ],
              choices: [
                {
                  label: '“I will do it properly — full LOTO, about four minutes.”',
                  to: 'hold',
                  feedback: 'The correct answer, and it names the actual cost so the supervisor can plan.'
                },
                {
                  label: 'Reach in without isolating — it is genuinely quick',
                  to: 'reach',
                  feedback: 'This is precisely the July near-miss.'
                },
                {
                  label: 'Isolate the air and reach in without venting or try-out',
                  to: 'partial',
                  feedback: 'A lock without verification is what all three of our incidents had in common.'
                }
              ]
            },
            {
              key: 'hold',
              name: 'You hold the procedure',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text: 'Four minutes. Fine — do it right. I will let planning know.',
                  expression: 'neutral',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'Complete the isolation and verification', to: 'end-good' }]
            },
            {
              key: 'partial',
              name: 'Locked but not verified',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text: 'Lock is on, good enough. Go ahead.',
                  expression: 'neutral',
                  gesture: 'neutral'
                }
              ],
              choices: [
                {
                  label: 'Stop and vent the downstream line, then try out the controls',
                  to: 'end-good',
                  feedback: 'You caught it. Thirty seconds of verification is the whole difference.'
                },
                { label: 'Proceed — the lock is on', to: 'end-bad' }
              ]
            },
            {
              key: 'reach',
              name: 'No isolation at all',
              background: 'factory',
              dialogue: [
                {
                  who: 'sup',
                  text: 'That is it — running again. Nice one.',
                  expression: 'happy',
                  gesture: 'approving'
                }
              ],
              choices: [{ label: 'See the outcome', to: 'end-bad' }]
            },
            {
              key: 'end-good',
              name: 'Outcome — verified',
              type: 'ending',
              background: 'factory',
              outcomeTitle: 'Four minutes, zero energy, job done',
              outcomeDescription:
                'The line lost four minutes — about £270. A crush injury to a hand costs roughly £96,000 in direct and indirect cost, and costs the person considerably more than that. You also set the standard for everyone who saw you do it.',
              dialogue: [
                {
                  who: 'sup',
                  text: 'Logged as a four-minute planned stop. That is how I would rather do it.',
                  expression: 'confident',
                  gesture: 'approving'
                }
              ]
            },
            {
              key: 'end-bad',
              name: 'Outcome — the actuator fired',
              type: 'ending',
              background: 'factory',
              outcomeTitle: 'The actuator fired',
              outcomeDescription:
                'Residual pressure downstream of the closed valve moved the feed actuator as the blank released. In July this produced a near-miss and a HSE improvement notice. The next one will not necessarily miss.',
              dialogue: [
                {
                  who: 'sup',
                  text: 'Everyone alright? Stop the line. Nobody touches it until maintenance get here.',
                  expression: 'angry',
                  gesture: 'rejecting'
                }
              ]
            }
          ]
        },
        {
          t: 'quote',
          text:
            'The line being down is a production problem. Somebody’s hand in a press is a different category of problem, and it is permanent.',
          by: 'Plant Manager, Kestrel Precision Manufacturing',
          pull: true
        }
      ]
    },
    {
      title: 'Group Lockout and Shift Handover',
      description: 'Multiple people, multiple locks, and the handover that must never be assumed.',
      badgeIcon: '🔒',
      blocks: [
        { t: 'heading', text: 'One lock each. Every time. No exceptions.' },
        {
          t: 'para',
          html:
            'Cell 7 in November happened because two competent technicians made one reasonable-sounding ' +
            'assumption: that an existing lock protected them both. It does not. A lock protects exactly ' +
            'one person — the person holding its key.'
        },
        {
          t: 'carousel',
          gate: true,
          slides: [
            {
              caption: 'Group lockout',
              heading: 'The lockout box',
              body:
                'The person isolating applies the isolation locks, then places their keys in a group lockout box. Every worker on the job then applies their own personal lock to the box.\n\n' +
                'The box cannot open until the last personal lock is removed, so the machine cannot be re-energised while anyone is still working.'
            },
            {
              caption: 'Arriving late',
              heading: 'If you join a job in progress',
              body:
                'You apply your own lock to the box before you touch anything — even if the machine is visibly locked, even if you watched a colleague isolate it, even if you are only helping for a moment.\n\n' +
                'No lock, no hands in the machine.'
            },
            {
              caption: 'Leaving early',
              heading: 'If you finish before the others',
              body:
                'Remove only your own lock, and tell the person leading the job that you have done so.\n\n' +
                'Never remove another person’s lock. Not to be helpful, not because they went home, not because the shift is ending.'
            },
            {
              caption: 'Shift handover',
              heading: 'Locks do not transfer',
              body:
                'The outgoing worker removes their lock. The incoming worker applies theirs. There is a moment where the box is held by the job lead so the machine cannot start between the two actions.\n\n' +
                'A lock left on by someone who has gone home is a lock nobody can legitimately remove — it stops production and requires a formal removal procedure with two authorised signatures.'
            },
            {
              caption: 'Lost keys',
              heading: 'When a lock must be cut',
              body:
                'Only the plant manager or engineering manager may authorise removing another person’s lock, and only after confirming in person that the individual is off site and the machine is clear.\n\n' +
                'It is documented every time. If this feels heavy, that is deliberate — the alternative is someone cutting a lock to save time while a colleague is inside a cell.'
            }
          ]
        },
        {
          t: 'quiz',
          kind: 'singleChoice',
          poolTitle: 'Group lockout decision',
          pass: 100,
          attempts: 3,
          gate: true,
          questions: [
            {
              prompt:
                'You arrive to help a colleague who has already isolated Cell 7 and applied their lock. The job needs two people. What do you do first?',
              answers: [
                {
                  text: 'Apply your own personal lock to the group lockout box',
                  correct: true,
                  feedback:
                    'Correct. Your colleague’s lock protects your colleague. Only your lock protects you.'
                },
                {
                  text: 'Start work — the machine is already locked and verified',
                  feedback:
                    'This is exactly the November incident. Your colleague can finish, remove their lock and restart the cell while you are still inside it.'
                },
                {
                  text: 'Ask your colleague to confirm verbally that they will not restart it',
                  feedback: 'A verbal assurance is not an isolation control and does not survive a shift change or a distraction.'
                },
                {
                  text: 'Apply a tag with your name but no lock',
                  feedback: 'A tag communicates. Only a lock prevents. You need both.'
                }
              ]
            }
          ]
        },
        {
          t: 'reflect',
          prompt:
            'Think about the last time you worked on isolated equipment alongside someone else. Did every person on that job have their own lock fitted? If not, what made it feel unnecessary at the time?',
          size: 'medium'
        },
        {
          t: 'checklist',
          title: 'Commit to your next intervention:',
          done: 'Take these to your next toolbox talk. Say them out loud to your shift.',
          mode: 'minimumRequired',
          min: 3,
          items: [
            { text: 'I will complete verification every time, regardless of job length', required: false },
            { text: 'I will vent downstream pneumatic lines, not just close the valve', required: false },
            { text: 'I will apply my own lock even when the machine is already locked', required: false },
            { text: 'I will say "four minutes" out loud rather than shortcut under pressure', required: false },
            { text: 'I will challenge anyone I see working on unverified equipment', required: false },
            { text: 'I will report near-misses even when nothing was damaged', required: false }
          ]
        }
      ]
    }
  ]
}
