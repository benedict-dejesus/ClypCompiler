// ClypCompiler — photoreal art direction.
// Turns each character spec / scene the course needs into a production-ready
// image prompt. Two rules drive the design:
//
//  1. IDENTITY LOCK. A branching scenario shows the same character across many
//     expressions. Text-to-image models invent a new face on every run, so each
//     spec is hashed into a fixed set of facial traits that are repeated
//     verbatim in every prompt for that character. Same spec in, same person
//     out — in any tool, with or without seed support.
//
//  2. SCENES ARE PLATES. Characters are composited on top of backgrounds, so
//     scene prompts explicitly exclude people and keep the middle of the frame
//     clear.
import type { CharacterSpec } from '../clyp/assets'
import { specKey } from '../clyp/assets'
import { characterFileBase, sceneFileBase, roleLabel, sceneLabel } from './artKeys'

// ---------------------------------------------------------------------------
// Deterministic identity
// ---------------------------------------------------------------------------
function hash(input: string): number {
  let h = 5381
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0
  return h
}
function pick<T>(list: T[], seed: number, salt: number): T {
  return list[(seed + salt * 2654435761) % list.length]
}

const HAIR_FEMALE = [
  'shoulder-length dark hair worn loose',
  'hair pulled back in a neat low bun',
  'short textured crop with a side part',
  'long hair tied in a practical ponytail',
  'natural curls cut to chin length',
  'straight bob just above the shoulders'
]
const HAIR_MALE = [
  'short neatly trimmed hair',
  'closely cropped hair with a clean fade',
  'slightly tousled medium-length hair',
  'short hair with a defined side part',
  'shaved head',
  'short natural curls'
]
const FACE = [
  'an oval face and warm, attentive eyes',
  'a square jaw and steady, level gaze',
  'high cheekbones and bright, alert eyes',
  'a round, open face with soft features',
  'a lean face with expressive dark eyes',
  'a broad face with kind, deep-set eyes'
]
const DETAIL = [
  'light freckles across the nose',
  'thin silver-rimmed glasses',
  'a small mole on the left cheek',
  'neatly groomed eyebrows',
  'a faint smile line at the corners of the mouth',
  'no distinguishing marks'
]
const BUILD = ['a slim build', 'an average build', 'a broad-shouldered build']

const AGE_TEXT: Record<string, string> = {
  young: 'mid-20s',
  adult: 'late 30s',
  senior: 'late 50s'
}
const TONE_TEXT: Record<string, string> = {
  light: 'light skin',
  medium: 'medium/olive skin',
  deep: 'deep brown skin'
}
const GENDER_TEXT: Record<string, string> = { female: 'woman', male: 'man' }

const ROLE_WARDROBE: Record<string, string> = {
  manager: 'a tailored navy blazer over a crisp white shirt',
  colleague: 'a smart-casual teal knit sweater over a collared shirt',
  customer: 'an everyday casual jacket over a plain t-shirt',
  client: 'a well-cut charcoal business suit with a dark tie',
  specialist: 'a pressed light-blue business shirt with a company lanyard',
  trainee: 'a light blue oxford shirt with a visible ID badge',
  doctor: 'a white medical coat over teal scrubs, stethoscope around the neck',
  nurse: 'teal medical scrubs with an ID badge clipped at the chest'
}

const EXPRESSION_TEXT: Record<string, string> = {
  neutral: 'a calm, composed neutral expression, looking directly at the camera',
  happy: 'a genuine warm smile that reaches the eyes',
  concerned: 'a concerned expression, brows drawn slightly together, lips lightly pressed',
  confused: 'a puzzled expression, one eyebrow raised, head tilted a little to one side',
  angry: 'a visibly frustrated expression, jaw set, direct and intense gaze',
  disappointed: 'a disappointed expression, gaze lowered slightly, faint downturn of the mouth',
  confident: 'a confident, assured expression with a slight closed-mouth smile and level chin',
  encouraging: 'a warm, encouraging expression, open and supportive, eyebrows slightly raised'
}

const GESTURE_TEXT: Record<string, string> = {
  neutral: 'standing relaxed, hands resting naturally at their sides',
  pointing: 'gesturing with an index finger toward the viewer, mid-explanation',
  explaining: 'both hands open in front of them mid-gesture, palms angled upward, mid-sentence',
  listening: 'attentive and still, hands loosely clasped, head slightly tilted in active listening',
  questioning: 'one palm turned upward in a questioning gesture, shoulders slightly raised',
  greeting: 'one hand raised in a friendly open-palmed wave',
  approving: 'giving a subtle thumbs-up, posture open and affirming',
  rejecting: 'one palm raised outward in a polite but firm stop gesture'
}

/** The fixed physical description for a spec — identical across all its images. */
export function identityDescription(spec: CharacterSpec): string {
  const seed = hash(specKey(spec))
  const hair = spec.gender === 'female' ? pick(HAIR_FEMALE, seed, 1) : pick(HAIR_MALE, seed, 1)
  const face = pick(FACE, seed, 2)
  const detail = pick(DETAIL, seed, 3)
  const build = pick(BUILD, seed, 4)
  const who = GENDER_TEXT[spec.gender] ?? 'person'
  const age = AGE_TEXT[spec.age] ?? 'late 30s'
  return `a ${who}, ${age}, with ${TONE_TEXT[spec.tone] ?? 'medium skin'}, ${hair}, ${face}, ${detail}, and ${build}`
}

const CHARACTER_QUALITY =
  'Shot on an 85mm portrait lens at f/2.0, soft diffused key light from a large softbox at 45 degrees ' +
  'with gentle fill, crisp focus on the eyes, natural skin texture and pores retained, subtle catchlights, ' +
  'photorealistic corporate portrait photography, high dynamic range, colour-graded neutral and clean.'

const CHARACTER_FRAMING =
  'Waist-up framing, subject centred with headroom, standing against a seamless light neutral grey studio ' +
  'backdrop that is evenly lit and free of props, shadows or gradients.'

const NEGATIVES =
  'Do not include: text, watermarks, logos, captions, borders, other people, extra limbs, distorted hands, ' +
  'harsh direct flash, heavy vignetting, cartoon or illustration styling, plastic over-smoothed skin.'

export interface PromptSpec {
  /** Filename the image must be saved as (without extension). */
  fileName: string
  label: string
  prompt: string
  /** Suggested output aspect ratio. */
  aspect: string
}

export function characterPrompt(spec: CharacterSpec, expression: string, gesture: string): PromptSpec {
  const identity = identityDescription(spec)
  const wardrobe = ROLE_WARDROBE[spec.role] ?? 'professional business attire'
  const expr = EXPRESSION_TEXT[expression] ?? EXPRESSION_TEXT.neutral
  const gest = GESTURE_TEXT[gesture] ?? GESTURE_TEXT.neutral

  const prompt = [
    `Professional corporate portrait photograph of ${identity}.`,
    `They are wearing ${wardrobe}, appropriate for a ${roleLabel(spec.role).toLowerCase()} in a modern workplace.`,
    `Expression: ${expr}.`,
    `Pose: ${gest}.`,
    CHARACTER_FRAMING,
    CHARACTER_QUALITY,
    NEGATIVES
  ].join(' ')

  return {
    fileName: characterFileBase(spec, expression, gesture),
    label: `${roleLabel(spec.role)} — ${expression} / ${gesture}`,
    prompt,
    aspect: '3:4'
  }
}

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------
const SCENE_SUBJECT: Record<string, string> = {
  office: 'a bright modern open-plan office with desks, monitors, warm wood accents and large windows',
  meetingRoom: 'a contemporary glass-walled meeting room with a long table, ergonomic chairs and a wall display',
  receptionArea: 'a polished corporate reception area with a branded desk, seating and soft architectural lighting',
  callCenter: 'a modern customer-support floor with low-partition desks, dual monitors and headsets on stands',
  factory: 'a clean modern manufacturing floor with machinery, safety markings on the ground and overhead lighting',
  warehouse: 'a spacious distribution warehouse with tall racking, palletised stock and wide clear aisles',
  hospital: 'a calm modern hospital corridor with a nurses station, clean surfaces and soft daylight',
  classroom: 'a bright modern training room with tiered seating, a whiteboard and a projector screen',
  retailStore: 'an upscale retail floor with tidy merchandise displays, a counter and warm accent lighting',
  remoteWork: 'a tidy sunlit home office with a desk, laptop, shelving and houseplants',
  neutral: 'a minimal softly lit interior with a plain warm grey wall and subtle natural light falloff'
}

const SCENE_QUALITY =
  'Shot on a 24mm wide-angle lens at f/5.6, natural daylight balanced with soft ambient interior light, ' +
  'clean architectural photography, sharp throughout, realistic materials and reflections, ' +
  'colour-graded warm and inviting, high dynamic range.'

const SCENE_FRAMING =
  'Completely empty of people. Eye-level camera height. Composition keeps the central third of the frame ' +
  'open and uncluttered so a subject can be placed there later. Slight depth of field falloff toward the back.'

export function scenePrompt(backgroundId: string): PromptSpec {
  const subject = SCENE_SUBJECT[backgroundId] ?? SCENE_SUBJECT.neutral
  const prompt = [
    `Wide environmental photograph of ${subject}.`,
    SCENE_FRAMING,
    SCENE_QUALITY,
    NEGATIVES
  ].join(' ')
  return {
    fileName: sceneFileBase(backgroundId),
    label: `Scene — ${sceneLabel(backgroundId)}`,
    prompt,
    aspect: '16:9'
  }
}

/** A single copy-paste brief covering everything the course still needs. */
export function buildBrief(prompts: PromptSpec[], courseTitle: string): string {
  const lines: string[] = [
    `ClypCompiler — image brief for "${courseTitle}"`,
    '='.repeat(64),
    '',
    'HOW TO USE',
    '  1. Generate each image below in your image tool of choice.',
    '  2. Save it using the exact "Save as" filename (any of .jpg/.jpeg/.png/.webp).',
    '  3. Drag the whole folder into ClypCompiler → Assets library → Scenario photography.',
    '',
    'CONSISTENCY',
    '  Each character description below is fixed on purpose: reuse it verbatim so the',
    '  same person appears in every expression. If your tool supports seeds or a',
    '  character reference (Midjourney --cref, gpt-image-1 reference images), generate',
    '  the neutral image first and reference it for that character\'s other expressions.',
    '',
    'FILENAME FALLBACK',
    '  Filenames may be shortened to cover more variants. For example',
    '  char__manager__female__adult__light__happy covers every gesture for that',
    '  expression, and char__manager__female__adult__light covers that character',
    '  in every situation. Generate the specific ones only where it matters.',
    '',
    '='.repeat(64),
    ''
  ]
  prompts.forEach((p, i) => {
    lines.push(
      `[${i + 1}/${prompts.length}] ${p.label}`,
      `Save as: ${p.fileName}.jpg`,
      `Aspect ratio: ${p.aspect}`,
      '',
      p.prompt,
      '',
      '-'.repeat(64),
      ''
    )
  })
  return lines.join('\n')
}
