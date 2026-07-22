# ClypCompiler Course Template Library — Design Catalog

Ten fictional companies across ten industries, each with ten authentic knowledge or
skill gaps drawn from the kinds of findings real organisations act on: audit results,
incident reviews, complaint themes, attrition data, regulator feedback.

Every course is **5 lessons**. Status is one of:

- **BUILT** — fully authored, validated through the Clyp compiler, in the app gallery
- **DESIGNED** — gap, audience and lesson arc defined; content authoring pending

Authoring format is in `types.ts`; the expander is `buildCourse.ts`; add finished
courses to `registry.ts`.

---

## 1. Meridian Health Systems — Healthcare
*Regional hospital network. 1,400 clinical staff, 3 acute sites, 11 outpatient clinics.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | **Hand Hygiene That Actually Holds** | Observed compliance 62% vs 90% target; staff know the Five Moments but miss 1, 4 and 5 under time pressure | **BUILT** |
| 2 | **The 47-Minute Gap: Escalating a Deteriorating Patient** | NEWS2 scores recorded but escalation delayed a median 47 minutes; juniors hesitate to call consultants overnight | **BUILT** |
| 3 | **Notes That Survive a Coroner** | Retrospective notes, missing rationale, copy-forward errors flagged in 3 inquests | **BUILT** |
| 4 | **The Conversation You Cannot Rehearse** | Complaint theme: families report being told of a death in corridors, in passing, or by phone without warning | **BUILT** |
| 5 | **Do Not Interrupt: Protecting the Medication Round** | 61% of dispensing errors occur when a nurse is interrupted mid-round; no protected-round protocol in use | **BUILT** |
| 6 | **Consent That Would Stand Up** | Audit found consent forms signed without documented discussion of alternatives in 28% of elective cases | **BUILT** |
| 7 | **The First Hour: Recognising Sepsis Before It Declares** | Sepsis Six completed within 60 minutes in only 54% of cases; recognition, not treatment, is the delay | **BUILT** |
| 8 | **Handover That Transfers Responsibility** | SBAR taught but not used; 4 serious incidents cite information lost at shift change | **BUILT** |
| 9 | **Before It Becomes Physical: De-escalation on the Ward** | Physical assaults on staff up 22%; de-escalation training completion at 41% | **BUILT** |
| 10 | **Working With Interpreters, Not Around Them** | Family members used as interpreters in 33% of non-English consultations, including for consent | **BUILT** |

## 2. Kestrel Precision Manufacturing — Manufacturing
*Tier-one automotive components supplier. 620 shop-floor staff across two plants.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | **Lockout/Tagout: The Steps People Skip** | Three near-misses in 12 months: machines isolated but stored energy not released and zero-energy not verified | **BUILT** |
| 2 | Reading a Control Chart Before You React | Operators adjust processes on single out-of-spec readings, inducing variation they then chase | DESIGNED |
| 3 | The Near-Miss You Did Not Report | Near-miss reporting fell 40% while incidents held steady — under-reporting, not improvement | DESIGNED |
| 4 | Changeover Under 12 Minutes (SMED) | Changeovers average 34 minutes against a 12-minute benchmark; internal/external separation not understood | DESIGNED |
| 5 | First-Article Inspection Done Properly | 2 customer rejections traced to FAI sign-off without measuring every characteristic on the drawing | DESIGNED |
| 6 | GD&T for People Who Read Drawings | Setters misread positional tolerance and datum references, scrapping parts that were within spec | DESIGNED |
| 7 | Root Cause, Not First Cause | 8D reports close at the first plausible cause; repeat failures on the same line within 90 days | DESIGNED |
| 8 | Talking to an Auditor | IATF surveillance findings included staff unable to describe their own process controls | DESIGNED |
| 9 | Manual Handling on a Real Line | Musculoskeletal absence is the largest single cause of lost days; training is generic, not task-specific | DESIGNED |
| 10 | Shift Handover on the Shop Floor | Verbal-only handover; quality issues discovered on the following shift with no context | DESIGNED |

## 3. Northwind Financial Technologies — Financial Services
*Digital banking platform. 4.2m retail customers, 900 contact-centre staff.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | **Stopping the Payment: APP Fraud on the Front Line** | APP losses up 34%; agents miss coached customers and disengage when customers insist | **BUILT** |
| 2 | Recognising Vulnerability on a Call | Vulnerability flagged in 3% of calls against an expected 12–15%; agents look for disability, not circumstance | DESIGNED |
| 3 | Complaints: The First Response Decides Everything | 46% of complaints escalate after the first reply; templated empathy reads as dismissal | DESIGNED |
| 4 | Consumer Duty in Practice, Not Policy | Staff can define the Duty but cannot say what it changes in their own decisions | DESIGNED |
| 5 | Explaining a Decline Without Losing the Customer | Declines delivered as policy statements; NPS drops 38 points after a declined application | DESIGNED |
| 6 | Money Laundering Red Flags in Retail Banking | SARs raised on transaction thresholds only; behavioural indicators consistently missed | DESIGNED |
| 7 | Handling a Bereavement Call | Bereavement calls score lowest on customer satisfaction; agents rush to process | DESIGNED |
| 8 | Data You Are Allowed to Share | Three near-miss data breaches from over-disclosure to third parties claiming authority | DESIGNED |
| 9 | Writing a Decision a Customer Can Understand | Final response letters average reading age 17; ombudsman referrals cite comprehension | DESIGNED |
| 10 | When to Break Script | Agents follow scripts through obvious edge cases; QA penalises deviation, so nobody deviates | DESIGNED |

## 4. Alderway Retail Group — Retail
*Grocery and general merchandise. 340 stores, 28,000 staff, high seasonal churn.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | Age-Restricted Sales: The Challenge You Must Make | Test purchase failure rate 18%; Challenge 25 applied inconsistently at self-checkout | DESIGNED |
| 2 | Shrinkage You Can Actually Control | Colleagues treat shrink as theft-only; process loss (waste, markdown, admin) is 61% of it | DESIGNED |
| 3 | The Two-Minute Customer Recovery | Service recovery attempts stop at apology; no colleague authority to resolve below £20 | DESIGNED |
| 4 | Allergen Questions You Cannot Guess At | Mystery shop found colleagues guessing allergen content rather than checking the matrix | DESIGNED |
| 5 | Date Code Discipline | Out-of-date stock found on shelf in 24% of audits; rotation understood but not prioritised | DESIGNED |
| 6 | Handling Aggression at the Checkout | Verbal abuse incidents up 31%; colleagues either freeze or escalate | DESIGNED |
| 7 | Your First Week Running a Department | New department managers promoted on product knowledge, not planning or delegation | DESIGNED |
| 8 | Availability Is a Process, Not a Panic | Gap-scanning done at fixed times regardless of demand; on-shelf availability 91% vs 97% target | DESIGNED |
| 9 | Safer Manual Handling in a Stockroom | Cage and roll-cage injuries account for 44% of store accidents | DESIGNED |
| 10 | Coaching a Colleague Who Is Struggling | Managers escalate to performance process without a documented coaching attempt | DESIGNED |

## 5. Helix Software Solutions — Technology
*B2B SaaS platform. 480 engineers, product and support staff.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | Writing an Incident Postmortem That Changes Something | Postmortems list causes but produce no owned actions; 3 repeat SEV-1s in a quarter | DESIGNED |
| 2 | Code Review That Finds Defects, Not Style | Reviews approve in under 4 minutes on average; defect escape rate unchanged by review | DESIGNED |
| 3 | Secure Handling of Customer Data in Development | Production data copied into staging in 5 recorded instances | DESIGNED |
| 4 | On-Call Without Burning Out | On-call attrition at 2.3x baseline; alert noise 68% non-actionable | DESIGNED |
| 5 | Estimating Work You Have Never Done | Sprint commitment reliability 54%; estimates anchored to optimism, not decomposition | DESIGNED |
| 6 | Explaining Technical Risk to Non-Engineers | Architecture decisions overruled because risk was communicated as detail, not consequence | DESIGNED |
| 7 | Accessibility Is a Requirement, Not a Ticket | VPAT gaps found at enterprise procurement; WCAG treated as post-release remediation | DESIGNED |
| 8 | Prompt and Model Risk in Product Features | LLM features shipped without evaluation harness or prompt-injection consideration | DESIGNED |
| 9 | Debugging Someone Else's Code | Mean time to resolve triples when the original author is unavailable | DESIGNED |
| 10 | Saying No to a Customer Commitment | Sales commitments accepted by engineering without scoping; roadmap slippage 40% | DESIGNED |

## 6. Brightpath Educational Technologies — Education
*K-12 learning platform and teacher services. 260 staff, 4,000 partner schools.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | Safeguarding Disclosures in a Digital Product | Support staff receive disclosures through in-product chat with no route or script | DESIGNED |
| 2 | Designing for Cognitive Load | Content teams add features per screen; completion drops 31% on dense units | DESIGNED |
| 3 | Formative Assessment That Informs Teaching | Quizzes report scores only; teachers cannot see misconception patterns | DESIGNED |
| 4 | Accessibility for Learners With Dyslexia | Product uses justified text, low contrast and no reading support | DESIGNED |
| 5 | Talking to Teachers About Their Data | Data conversations read as surveillance; adoption stalls after first review | DESIGNED |
| 6 | Age-Appropriate Design in Practice | Children's code compliance treated as legal sign-off, not design input | DESIGNED |
| 7 | Building a Rubric Teachers Trust | Auto-marking disputed; rubric criteria not observable or exemplified | DESIGNED |
| 8 | Onboarding a School in Week One | 38% of schools never complete setup; onboarding assumes a technical lead exists | DESIGNED |
| 9 | Writing Feedback a 12-Year-Old Can Use | Feedback is evaluative not instructional; learners cannot say what to do next | DESIGNED |
| 10 | Handling a Parent Complaint About Content | Content complaints escalate to leadership immediately; no first-line framework | DESIGNED |

## 7. Solventis Energy & Utilities — Energy
*Regional electricity and gas distribution. 2,100 field and control-room staff.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | Permit to Work: Reading It Like Your Life Depends On It | Permits signed without reading limitations; 2 incidents involved work outside permit scope | DESIGNED |
| 2 | Working at Height on Distribution Poles | Fall arrest inspected annually but not pre-use; 3 defective harnesses found in spot checks | DESIGNED |
| 3 | Excavation Near Buried Services | 11 service strikes last year; CAT scanning done once at start, not progressively | DESIGNED |
| 4 | Switching Operations Under Pressure | Control-room errors cluster during restoration; verification steps compressed | DESIGNED |
| 5 | Talking to a Customer With No Power | Customers report being given restoration times that were never realistic | DESIGNED |
| 6 | Recognising Gas Escape Reports Correctly | Uncontrolled escapes classified as controlled in 9% of call triage | DESIGNED |
| 7 | Lone Working After Dark | Check-in protocol compliance 58%; staff consider it bureaucratic | DESIGNED |
| 8 | Environmental Spill Response | Oil-filled equipment spills contained late; kits present but unfamiliar | DESIGNED |
| 9 | Vulnerable Customers on the Priority Register | Register data 3 years stale; field staff do not know how to add customers | DESIGNED |
| 10 | Why We Investigate Near-Misses at All | Field crews see investigations as blame-finding; participation is minimal | DESIGNED |

## 8. Vantage Logistics & Freight — Transport & Logistics
*Road freight and warehousing. 1,800 drivers and warehouse staff.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | Load Security That Passes a Roadside Check | 14 prohibitions issued in 12 months for insecure loads; lashing calculations not understood | DESIGNED |
| 2 | Drivers' Hours Without Guessing | Infringements dominated by daily rest and break-timing errors, not deliberate overrun | DESIGNED |
| 3 | The Walkaround Check That Finds Things | Defect reports show 82% "nil defect" while workshop finds faults on arrival | DESIGNED |
| 4 | Reversing and Blind Spots in the Yard | 6 yard collisions; banksman used inconsistently | DESIGNED |
| 5 | Fatigue Is Not Willpower | Drivers self-assess fatigue as manageable; incident times cluster 02:00–05:00 | DESIGNED |
| 6 | Handling a Delivery Refusal | Refusals escalate to depot calls; drivers lack authority framework | DESIGNED |
| 7 | Dangerous Goods in Mixed Loads | ADR segregation errors found in 3 audits | DESIGNED |
| 8 | Warehouse Racking Damage You Must Report | Damaged uprights left unreported; one collapse near-miss | DESIGNED |
| 9 | Telematics Without Feeling Watched | Driver trust in telematics low; coaching data used punitively | DESIGNED |
| 10 | Customer Service From the Cab | Drivers are the only face-to-face contact; no service expectations set | DESIGNED |

## 9. Cornerstone Property & Construction — Construction
*Commercial build and fit-out contractor. 950 site staff and subcontractors.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | The Dynamic Risk Assessment You Do Anyway | RAMS signed at induction then never revisited as conditions change | DESIGNED |
| 2 | Stopping Work: Who Actually Can | Subcontractors believe only the principal contractor can stop work | DESIGNED |
| 3 | Silica Dust and the Damage You Cannot See | On-tool extraction available but bypassed; face-fit testing at 44% | DESIGNED |
| 4 | Temporary Works Are Permanent Risks | Props and formwork modified on site without designer approval | DESIGNED |
| 5 | Coordinating Trades Without a Shouting Match | Programme conflicts resolved by whoever is loudest; rework cost 6% of contract value | DESIGNED |
| 6 | Managing Subcontractor Competence | Cards checked at gate but competence never verified against the task | DESIGNED |
| 7 | Fire Safety During Fit-Out | Hot works permits issued without post-work watch; 2 smouldering incidents | DESIGNED |
| 8 | Mental Health on Site, Plainly | Construction suicide rate 3x national average; site culture blocks disclosure | DESIGNED |
| 9 | Recording Variations As They Happen | Variations agreed verbally; £340k disputed at final account | DESIGNED |
| 10 | Handover With a Complete O&M Pack | Practical completion delayed on 7 projects by incomplete documentation | DESIGNED |

## 10. Latitude Hospitality Group — Hospitality
*Hotels and restaurants. 62 sites, 5,400 staff, 70% under 25.*

| # | Course | Gap | Status |
|---|--------|-----|--------|
| 1 | Allergens: The Conversation, Not the Chart | Two near-miss anaphylaxis events; staff relayed allergen info from memory | DESIGNED |
| 2 | Recovering a Ruined Stay | Complaint resolution costs average £180 because recovery starts too late | DESIGNED |
| 3 | Spotting Exploitation in a Hotel | Staff unaware of trafficking indicators despite sector guidance | DESIGNED |
| 4 | Serving Alcohol Responsibly | Refusal of service inconsistent; test purchases failed in 3 sites | DESIGNED |
| 5 | Kitchen Temperature Discipline | Fridge logs completed retrospectively in blocks; EHO noted pattern | DESIGNED |
| 6 | Upselling Without Being Pushy | Attachment rate 0.4 vs 1.1 benchmark; staff fear seeming pushy | DESIGNED |
| 7 | Turning Around a Bad Review Publicly | Review responses defensive or templated; response rate 22% | DESIGNED |
| 8 | Running a Shift for the First Time | Supervisors promoted without a shift-planning framework | DESIGNED |
| 9 | Accessibility for Guests, Beyond the Ramp | Accessible rooms sold to non-disabled guests; hidden disability unrecognised | DESIGNED |
| 10 | Cash and Till Integrity | Voids and refunds unmonitored; £41k unexplained variance | DESIGNED |

---

---

## Progress

**Built: 12 / 100.** Order of work: complete one company before moving to the next.

✅ **Meridian Health Systems — COMPLETE (10/10).** First full company in the library.

Current company: **Kestrel Precision Manufacturing** — 1 of 10 built (course 1).
Next up: course 2 (Reading a Control Chart Before You React), then 3–10.

Northwind course 1 was built earlier as a cross-industry proof; that company resumes
after Kestrel.

Kestrel course 1 and Northwind course 1 were built earlier as cross-industry proofs; those
companies resume once Meridian is complete.

## Authoring notes

**Variety is deliberate.** Courses vary theme (`clyp`, `midnight`, `sunrise`, `forest`,
`corporate`, `plum`), per-lesson theme overrides, block mix, gate placement, XP weighting
and badge design, so the library does not look like one course repeated.

**Blocks used per course** should span at least 12 distinct types, always including one
`scenario` or `conversation` and at least two gated assessments. Built courses so far use
15–17 distinct block types each.

**Art:** templates set `artStyle: 'illustrated'` so they render on Clyp's built-in SVG
assets with no image library attached, per the brief.

**Content standard:** every course carries concrete figures, named consequences and
realistic dialogue. No placeholder text, no "lorem", no generic advice that would apply to
any employer.
