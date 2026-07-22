// Clyp — built-in SVG asset library (108_SVG_ASSET_LIBRARY).
// All scenario art is inline SVG bundled with the application; compiled output
// embeds the markup directly — never an external file reference
// (74_RISE_COMPATIBILITY_STANDARD: embedded SVG, no external assets).
//
// Characters are composed from a specification — role × gender × age × skin
// tone — so the figure on screen matches the author's intent. Roles carry the
// outfit; gender and age drive build, hairstyle and hair color; skin tone is
// explicit. Gradient/filter IDs are namespaced per spec so many inline SVGs
// can share one host document without collisions.

// ---------------------------------------------------------------------------
// ClypCompiler extension — Art Resolver hook.
// When a resolver is installed (built-in "Rendered" art style), character and
// background requests can return a raster image URL instead of inline SVG.
// A null return falls through to the original SVG path, so the reference
// behavior is untouched when no resolver is active.
// ---------------------------------------------------------------------------
export interface ArtResolver {
  character?: (
    spec: CharacterSpec,
    expression: string,
    gesture: string,
    variant: 'figure' | 'avatar'
  ) => string | null
  background?: (backgroundId: string | undefined) => string | null
}
let artResolver: ArtResolver | null = null
export function setArtResolver(resolver: ArtResolver | null): void {
  artResolver = resolver
}

export const EXPRESSIONS = ['neutral', 'happy', 'concerned', 'confused', 'angry', 'disappointed', 'confident', 'encouraging'] as const
export const GESTURES = ['neutral', 'pointing', 'explaining', 'listening', 'questioning', 'greeting', 'approving', 'rejecting'] as const

// ---------------------------------------------------------------------------
// Character specification
// ---------------------------------------------------------------------------
export interface CharacterSpec {
  role: string
  gender: 'female' | 'male'
  age: 'young' | 'adult' | 'senior'
  tone: 'light' | 'medium' | 'deep'
}

export const GENDERS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' }
] as const

export const AGES = [
  { id: 'young', label: 'Young adult' },
  { id: 'adult', label: 'Adult' },
  { id: 'senior', label: 'Senior' }
] as const

export const SKIN_TONES = [
  { id: 'light', label: 'Light', base: '#f3cba4', shade: '#deac80', blush: '#e89a76', lip: '#9c5344' },
  { id: 'medium', label: 'Medium', base: '#d9a06b', shade: '#bd8149', blush: '#c07d50', lip: '#8a4736' },
  { id: 'deep', label: 'Deep', base: '#9a6a45', shade: '#7d5233', blush: '#8a5a3a', lip: '#5f3327' }
] as const

export interface RoleDef {
  id: string
  label: string
  outfit: string // primary garment color
  outfitShade: string
  under: string // shirt / inner layer
  accent: string // tie / lanyard / trim
}

export const ROLES: RoleDef[] = [
  { id: 'manager', label: 'Manager', outfit: '#2e3d52', outfitShade: '#233042', under: '#eef2f6', accent: '#b3543f' },
  { id: 'colleague', label: 'Colleague', outfit: '#0f6a75', outfitShade: '#0b515a', under: '#e7f2f2', accent: '#00c18e' },
  { id: 'customer', label: 'Customer', outfit: '#5c6672', outfitShade: '#49525c', under: '#c9803a', accent: '#c9803a' },
  { id: 'client', label: 'Client', outfit: '#707885', outfitShade: '#5b6370', under: '#3a3f4a', accent: '#3a3f4a' },
  { id: 'specialist', label: 'Specialist', outfit: '#31465a', outfitShade: '#263848', under: '#dfe7ec', accent: '#31465a' },
  { id: 'trainee', label: 'Trainee', outfit: '#4b6f8a', outfitShade: '#3b5970', under: '#e8eef2', accent: '#e0a33e' },
  { id: 'doctor', label: 'Doctor', outfit: '#f4f6f8', outfitShade: '#dde3e8', under: '#2e8f81', accent: '#37424d' },
  { id: 'nurse', label: 'Nurse', outfit: '#4d9e8f', outfitShade: '#3d8171', under: '#e9f4f2', accent: '#37424d' }
]

export const DEFAULT_SPEC: CharacterSpec = { role: 'colleague', gender: 'male', age: 'adult', tone: 'light' }

/** Older .clyp files stored a single `baseCharacter` id — map to a full spec. */
export const LEGACY_BASE_MAP: Record<string, CharacterSpec> = {
  colleague: { role: 'colleague', gender: 'male', age: 'adult', tone: 'light' },
  customer: { role: 'customer', gender: 'female', age: 'adult', tone: 'medium' },
  manager: { role: 'manager', gender: 'male', age: 'senior', tone: 'light' },
  specialist: { role: 'specialist', gender: 'female', age: 'adult', tone: 'deep' },
  trainee: { role: 'trainee', gender: 'female', age: 'young', tone: 'light' },
  client: { role: 'client', gender: 'male', age: 'adult', tone: 'medium' }
}

export function specFromSettings(settings: {
  characterRole?: string
  characterGender?: 'female' | 'male'
  characterAge?: 'young' | 'adult' | 'senior'
  characterSkinTone?: 'light' | 'medium' | 'deep'
  baseCharacter?: string
}): CharacterSpec {
  const legacy = settings.baseCharacter ? LEGACY_BASE_MAP[settings.baseCharacter] : undefined
  return {
    role: settings.characterRole ?? legacy?.role ?? DEFAULT_SPEC.role,
    gender: settings.characterGender ?? legacy?.gender ?? DEFAULT_SPEC.gender,
    age: settings.characterAge ?? legacy?.age ?? DEFAULT_SPEC.age,
    tone: settings.characterSkinTone ?? legacy?.tone ?? DEFAULT_SPEC.tone
  }
}

export function specKey(spec: CharacterSpec): string {
  return `${spec.role}~${spec.gender}~${spec.age}~${spec.tone}`
}

function hairColors(age: CharacterSpec['age']): { h: string; s: string } {
  if (age === 'senior') return { h: '#b6bac0', s: '#d6d9dd' }
  if (age === 'young') return { h: '#6b4a2f', s: '#8a6440' }
  return { h: '#3a2e23', s: '#584635' }
}

// ---------------------------------------------------------------------------
// Face engine — expression-driven eyes, brows, mouth; gender/age accents.
// Head center ~(100, 92).
// ---------------------------------------------------------------------------
type Tone = (typeof SKIN_TONES)[number]

function eyesFor(expression: string, tone: Tone, gender: CharacterSpec['gender']): string {
  const iris = '#2b3a44'
  const lash = gender === 'female'
    ? `<path d="M76.5 92.5 Q83 88.5 91 91" stroke="#2b241d" stroke-width="1.6" fill="none" opacity="0.55"/>
       <path d="M109 91 Q117 88.5 123.5 92.5" stroke="#2b241d" stroke-width="1.6" fill="none" opacity="0.55"/>`
    : ''
  const openEye = (cx: number): string =>
    `<ellipse cx="${cx}" cy="99" rx="6.4" ry="7" fill="#ffffff"/>
     <circle cx="${cx}" cy="100" r="3.9" fill="${iris}"/>
     <circle cx="${cx}" cy="100" r="1.7" fill="#10181d"/>
     <circle cx="${cx + 1.4}" cy="98.2" r="1.2" fill="#ffffff"/>
     <path d="M${cx - 6.4} 95.4 Q${cx} 92.4 ${cx + 6.4} 95.4" stroke="${tone.shade}" stroke-width="1.6" fill="none" opacity="0.85"/>`
  const squintEye = (cx: number): string =>
    `<path d="M${cx - 6} 100 Q${cx} 93.2 ${cx + 6} 100" stroke="${iris}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
  const halfLidEye = (cx: number): string =>
    `<ellipse cx="${cx}" cy="99.6" rx="6.1" ry="6.2" fill="#ffffff"/>
     <circle cx="${cx}" cy="100.6" r="3.7" fill="${iris}"/>
     <circle cx="${cx + 1.3}" cy="99.2" r="1" fill="#ffffff"/>
     <path d="M${cx - 6.5} 96 Q${cx} 93 ${cx + 6.5} 96 L${cx + 6.5} 98.4 Q${cx} 95.6 ${cx - 6.5} 98.4 Z" fill="${tone.shade}"/>`
  const narrowEye = (cx: number): string =>
    `<ellipse cx="${cx}" cy="100" rx="5.7" ry="4.4" fill="#ffffff"/>
     <circle cx="${cx}" cy="100.5" r="3.3" fill="${iris}"/>
     <circle cx="${cx + 1.2}" cy="99.4" r="0.9" fill="#ffffff"/>`
  const droopEye = (cx: number): string =>
    `<ellipse cx="${cx}" cy="100" rx="5.9" ry="5.4" fill="#ffffff"/>
     <circle cx="${cx}" cy="101" r="3.5" fill="${iris}"/>
     <path d="M${cx - 6} 96.4 Q${cx} 94.2 ${cx + 6} 96.4 L${cx + 6} 99 Q${cx} 96.6 ${cx - 6} 99 Z" fill="${tone.shade}"/>`
  let eyes: string
  switch (expression) {
    case 'happy': eyes = squintEye(84) + squintEye(116); break
    case 'confident': eyes = halfLidEye(84) + halfLidEye(116); break
    case 'angry': eyes = narrowEye(84) + narrowEye(116); break
    case 'disappointed': eyes = droopEye(84) + droopEye(116); break
    case 'confused': eyes = openEye(84) + narrowEye(116); break
    default: eyes = openEye(84) + openEye(116)
  }
  return eyes + (expression === 'happy' ? '' : lash)
}

function browsFor(expression: string, hair: string): string {
  const brow = (d: string): string => `<path d="${d}" stroke="${hair}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
  switch (expression) {
    case 'angry': return brow('M76 84.5 L93 90.5') + brow('M124 84.5 L107 90.5')
    case 'concerned': return brow('M76 91 Q84 85.5 93 87.5') + brow('M124 91 Q116 85.5 107 87.5')
    case 'disappointed': return brow('M77 90 Q85 88 92 90') + brow('M123 90 Q115 88 108 90')
    case 'confused': return brow('M76 88 Q84 87 92 89') + brow('M106 83.5 Q115 79.5 124 84.5')
    case 'happy':
    case 'encouraging': return brow('M76 86.5 Q84 81.5 92 85.5') + brow('M108 85.5 Q116 81.5 124 86.5')
    case 'confident': return brow('M76 87.5 Q84 83.5 92 86.5') + brow('M108 85.5 Q117 82.5 124 88.5')
    default: return brow('M76 87.5 Q84 84.5 92 86.5') + brow('M108 86.5 Q116 84.5 124 87.5')
  }
}

function mouthFor(expression: string, tone: Tone): string {
  const lip = tone.lip
  switch (expression) {
    case 'happy':
      return `<path d="M85 114.5 Q100 130 115 114.5 Q100 121.5 85 114.5 Z" fill="${lip}"/>
              <path d="M88 115.5 Q100 121 112 115.5 Q100 119.5 88 115.5 Z" fill="#ffffff"/>`
    case 'encouraging':
      return `<path d="M84 113.5 Q100 133 116 113.5 Q100 123.5 84 113.5 Z" fill="${lip}"/>
              <path d="M87.5 115 Q100 122 112.5 115 Q100 120.5 87.5 115 Z" fill="#ffffff"/>
              <path d="M90 123.5 Q100 128.5 110 123.5 Q100 130 90 123.5 Z" fill="#c96a55"/>`
    case 'confident':
      return `<path d="M87 117.5 Q98 125.5 113 115.5" stroke="${lip}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
    case 'concerned':
      return `<path d="M88 122.5 Q100 115.5 112 122.5" stroke="${lip}" stroke-width="3.6" fill="none" stroke-linecap="round"/>`
    case 'angry':
      return `<path d="M87 124.5 Q100 115.5 113 124.5" stroke="${lip}" stroke-width="3.8" fill="none" stroke-linecap="round"/>`
    case 'disappointed':
      return `<path d="M89 123.5 Q100 118.5 111 123.5" stroke="${lip}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
    case 'confused':
      return `<path d="M88 120.5 Q95 116.5 102 120.5 Q108 124 112 118.5" stroke="${lip}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`
    default:
      return `<path d="M89 119.5 Q100 123.5 111 119.5" stroke="${lip}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
              <path d="M92 122.8 Q100 125.4 108 122.8" stroke="${lip}" stroke-width="1.4" fill="none" opacity="0.4" stroke-linecap="round"/>`
  }
}

function faceAccents(expression: string, spec: CharacterSpec, tone: Tone): string {
  let out = ''
  if (expression === 'happy' || expression === 'encouraging') {
    out += `<ellipse cx="78" cy="110" rx="6" ry="3.6" fill="${tone.blush}" opacity="0.4"/>
            <ellipse cx="122" cy="110" rx="6" ry="3.6" fill="${tone.blush}" opacity="0.4"/>`
  }
  if (spec.age === 'young') {
    out += `<g fill="${tone.shade}" opacity="0.5">
      <circle cx="78" cy="108" r="0.9"/><circle cx="83" cy="110.5" r="0.9"/><circle cx="88" cy="108.5" r="0.9"/>
      <circle cx="112" cy="108.5" r="0.9"/><circle cx="117" cy="110.5" r="0.9"/><circle cx="122" cy="108" r="0.9"/>
    </g>`
  }
  if (spec.age === 'senior') {
    out += `<g stroke="${tone.shade}" stroke-width="1.4" fill="none" opacity="0.55" stroke-linecap="round">
      <path d="M74 116 q3 2.5 6 1.5"/><path d="M126 116 q-3 2.5 -6 1.5"/>
      <path d="M77 93.5 q3.5 -1.5 7 -0.5"/><path d="M123 93.5 q-3.5 -1.5 -7 -0.5"/>
    </g>`
  }
  if (spec.role === 'specialist') {
    out += `<g stroke="#31465a" stroke-width="2.4" fill="none">
      <rect x="75" y="92.5" width="18.5" height="14" rx="6.5" fill="#ffffff" fill-opacity="0.14"/>
      <rect x="106.5" y="92.5" width="18.5" height="14" rx="6.5" fill="#ffffff" fill-opacity="0.14"/>
      <path d="M93.5 98.5 Q100 96 106.5 98.5"/>
      <path d="M75 97 L64 95"/><path d="M125 97 L136 95"/>
    </g>`
  }
  return out
}

// ---------------------------------------------------------------------------
// Hair — six style sets keyed by gender × age (back layer + front layer).
// ---------------------------------------------------------------------------
function hairFor(spec: CharacterSpec): { back: string; front: string } {
  const { h, s } = hairColors(spec.age)
  if (spec.gender === 'female') {
    if (spec.age === 'young') {
      return {
        back: `<path d="M58 92 Q54 40 100 38 Q146 40 142 92 L148 150 Q144 164 130 158 Q136 118 132 94 Q130 64 100 58 Q70 64 68 94 Q64 118 70 158 Q56 164 52 150 Z" fill="${h}"/>
               <path d="M68 94 Q70 64 100 58 Q80 64 76 86 Q72 92 68 94 Z" fill="${s}"/>`,
        front: `<path d="M60 90 Q58 44 100 42 Q142 44 140 90 L134 90 Q136 66 118 58 Q124 70 116 74 Q104 56 82 60 Q66 66 66 90 Z" fill="${h}"/>
                <path d="M74 62 Q88 52 104 54 Q90 58 82 64 Q77 66 74 62 Z" fill="${s}"/>`
      }
    }
    if (spec.age === 'adult') {
      return {
        back: `<circle cx="100" cy="46" r="14" fill="${h}"/><circle cx="95" cy="42" r="4.6" fill="${s}"/>
               <path d="M62 92 Q60 48 100 46 Q140 48 138 92 L138 108 Q132 116 128 106 Q130 68 100 60 Q70 68 72 106 Q68 116 62 108 Z" fill="${h}"/>`,
        front: `<path d="M63 90 Q62 50 100 48 Q138 50 137 90 L131 90 Q133 64 104 58 L96 58 Q67 64 69 90 Z" fill="${h}"/>
                <path d="M76 60 Q88 52 100 53 Q86 56 80 63 Q77 63 76 60 Z" fill="${s}"/>`
      }
    }
    return {
      back: `<path d="M60 92 Q58 46 100 44 Q142 46 140 92 L142 122 Q136 132 128 124 Q132 70 100 60 Q68 70 72 124 Q64 132 58 122 Z" fill="${h}"/>`,
      front: `<path d="M62 90 Q60 48 100 46 Q140 48 138 90 L132 90 Q134 64 106 57 L94 57 Q66 64 68 90 Z" fill="${h}"/>
              <path d="M75 60 Q87 51 100 52 Q86 55 79 62 Q76 62 75 60 Z" fill="${s}"/>`
    }
  }
  // male
  if (spec.age === 'young') {
    return {
      back: '',
      front: `<path d="M61 90 Q56 42 100 40 Q144 42 139 90 L132 90 Q136 82 130 76 Q136 68 127 63 Q129 54 117 55 Q113 46 100 48 Q87 46 83 55 Q71 54 73 63 Q64 68 70 76 Q64 82 68 90 Z" fill="${h}"/>
              <circle cx="78" cy="55" r="7" fill="${h}"/><circle cx="92" cy="47" r="8" fill="${h}"/><circle cx="110" cy="46" r="8" fill="${h}"/><circle cx="123" cy="54" r="7" fill="${h}"/>
              <circle cx="89" cy="49" r="3" fill="${s}"/><circle cx="113" cy="48" r="3" fill="${s}"/>`
    }
  }
  if (spec.age === 'adult') {
    return {
      back: '',
      front: `<path d="M61 88 Q59 44 100 42 Q141 44 139 88 L133 88 Q135 58 112 54 L86 61 Q68 66 67 88 Z" fill="${h}"/>
              <path d="M112 54 Q97 55 86 61 Q97 51 110 51 Q112 52 112 54 Z" fill="${s}"/>`
    }
  }
  return {
    back: '',
    front: `<path d="M64 88 Q66 56 88 50 Q80 60 84 64 Q94 52 116 53 Q134 58 136 88 L130 88 Q130 66 112 60 L90 64 Q72 70 70 88 Z" fill="${h}" opacity="0.9"/>
            <path d="M88 50 Q96 46 104 47 Q96 50 92 54 Z" fill="${s}" opacity="0.7"/>`
  }
}

// ---------------------------------------------------------------------------
// Outfits — role-specific garments layered over a shared torso silhouette.
// ---------------------------------------------------------------------------
function outfitFor(spec: CharacterSpec, uid: string, tone: Tone): { torso: string; sleeve: string } {
  const role = ROLES.find((r) => r.id === spec.role) ?? ROLES[1]
  const f = spec.gender === 'female'
  const torsoPath = f
    ? 'M58 216 Q56 170 78 157 Q89 151 100 151 Q111 151 122 157 Q144 170 142 216 Z'
    : 'M54 216 Q52 168 76 155 Q88 149 100 149 Q112 149 124 155 Q148 168 146 216 Z'
  const base = `<path d="${torsoPath}" fill="url(#${uid}-outfit)"/>
    <path d="${torsoPath}" fill="#0b2530" opacity="0.06" transform="translate(3 0)"/>`
  const neckV = `<path d="M88 151 L100 168 L112 151 Q106 148 100 148 Q94 148 88 151 Z" fill="${tone.base}"/>
    <path d="M88 151 L100 168 L112 151 Q106 148 100 148 Q94 148 88 151 Z" fill="${tone.shade}" opacity="0.35"/>`
  const steth = `<path d="M88 154 Q84 176 96 188" stroke="${role.accent}" stroke-width="3.4" fill="none"/>
    <path d="M112 154 Q116 172 106 182" stroke="${role.accent}" stroke-width="3.4" fill="none"/>
    <circle cx="98" cy="192" r="7" fill="${role.accent}"/><circle cx="98" cy="192" r="3.4" fill="#e9f0f2"/>`

  let details = ''
  switch (role.id) {
    case 'manager':
      details = f
        ? `<path d="M84 152 L100 176 L116 152 L112 150 L100 166 L88 150 Z" fill="${role.under}"/>
           <path d="M84 152 L100 176 L72 216 L60 216 Q58 172 84 152 Z" fill="url(#${uid}-outfit)"/>
           <path d="M116 152 L100 176 L128 216 L140 216 Q142 172 116 152 Z" fill="url(#${uid}-outfit)"/>
           <path d="M84 152 L100 176 L94 184 L76 158 Z" fill="${role.outfitShade}"/>
           <path d="M116 152 L100 176 L106 184 L124 158 Z" fill="${role.outfitShade}"/>
           <circle cx="100" cy="181" r="2.6" fill="${role.accent}"/><circle cx="106" cy="178" r="2.2" fill="${role.accent}" opacity="0.85"/><circle cx="94" cy="178" r="2.2" fill="${role.accent}" opacity="0.85"/>`
        : `<path d="M88 152 L100 170 L112 152 L106 149 L100 160 L94 149 Z" fill="${role.under}"/>
           <path d="M97 160 L103 160 L106 186 L100 196 L94 186 Z" fill="${role.accent}"/>
           <path d="M86 151 L100 172 L82 216 L66 216 Q64 168 86 151 Z" fill="${role.outfitShade}"/>
           <path d="M114 151 L100 172 L118 216 L134 216 Q136 168 114 151 Z" fill="${role.outfitShade}"/>
           <circle cx="122" cy="198" r="1.8" fill="#c8d2da"/>`
      break
    case 'colleague':
      details = `${neckV}
        <path d="M88 151 L96 160 L90 166 L82 154 Z" fill="${role.under}"/>
        <path d="M112 151 L104 160 L110 166 L118 154 Z" fill="${role.under}"/>
        <line x1="100" y1="168" x2="100" y2="214" stroke="${role.outfitShade}" stroke-width="2.4"/>
        <circle cx="100" cy="178" r="1.8" fill="${role.under}"/><circle cx="100" cy="192" r="1.8" fill="${role.under}"/><circle cx="100" cy="206" r="1.8" fill="${role.under}"/>
        <path d="M64 190 L80 190 L80 204 L64 204 Z" fill="${role.outfitShade}" opacity="0.5"/>`
      break
    case 'customer':
      details = `<path d="M84 153 Q100 162 116 153 L116 216 L84 216 Z" fill="${role.under}"/>
        <path d="M92 158 Q100 163 108 158" stroke="#a5682e" stroke-width="2" fill="none"/>
        <path d="M84 152 L92 160 L84 216 L62 216 Q60 170 84 152 Z" fill="url(#${uid}-outfit)"/>
        <path d="M116 152 L108 160 L116 216 L138 216 Q140 170 116 152 Z" fill="url(#${uid}-outfit)"/>
        <path d="M88 156 L92 160 L86 210 L80 210 Z" fill="${role.outfitShade}"/>
        <path d="M112 156 L108 160 L114 210 L120 210 Z" fill="${role.outfitShade}"/>`
      break
    case 'client':
      details = `<path d="M86 150 Q100 144 114 150 L112 166 Q100 172 88 166 Z" fill="${role.under}"/>
        <path d="M88 148 Q100 143 112 148 L112 153 Q100 148 88 153 Z" fill="#2c313a"/>
        <path d="M84 152 L94 164 L84 216 L62 216 Q60 170 84 152 Z" fill="url(#${uid}-outfit)"/>
        <path d="M116 152 L106 164 L116 216 L138 216 Q140 170 116 152 Z" fill="url(#${uid}-outfit)"/>
        <path d="M88 156 L94 164 L88 208 L82 208 Z" fill="${role.outfitShade}"/>
        <path d="M112 156 L106 164 L112 208 L118 208 Z" fill="${role.outfitShade}"/>`
      break
    case 'specialist':
      details = `${neckV}
        <path d="M84 152 L96 162 L92 216 L64 216 Q62 170 84 152 Z" fill="url(#${uid}-outfit)"/>
        <path d="M116 152 L104 162 L108 216 L136 216 Q138 170 116 152 Z" fill="url(#${uid}-outfit)"/>
        <rect x="66" y="184" width="20" height="16" rx="3" fill="${role.outfitShade}"/>
        <rect x="114" y="184" width="20" height="16" rx="3" fill="${role.outfitShade}"/>
        <path d="M96 162 L104 162 L106 216 L94 216 Z" fill="${role.under}"/>
        <line x1="100" y1="166" x2="100" y2="212" stroke="#c4ced6" stroke-width="1.6"/>`
      break
    case 'trainee':
      details = `<path d="M84 154 Q100 168 116 154 Q112 148 100 148 Q88 148 84 154 Z" fill="${role.outfitShade}"/>
        <path d="M90 155 Q100 165 110 155" stroke="${role.under}" stroke-width="2.4" fill="none"/>
        <line x1="93" y1="160" x2="92" y2="176" stroke="${role.under}" stroke-width="2.2"/>
        <line x1="107" y1="160" x2="108" y2="176" stroke="${role.under}" stroke-width="2.2"/>
        <path d="M90 154 L100 162 L110 154" stroke="${role.accent}" stroke-width="3" fill="none"/>
        <rect x="94" y="176" width="13" height="17" rx="2.5" fill="#f2f5f7"/>
        <rect x="94" y="176" width="13" height="5" fill="${role.accent}"/>
        <rect x="97" y="184" width="7" height="2" fill="#b9c6cf"/><rect x="97" y="188" width="7" height="2" fill="#b9c6cf"/>
        <rect x="68" y="196" width="24" height="18" rx="4" fill="${role.outfitShade}" opacity="0.65"/>
        <rect x="108" y="196" width="24" height="18" rx="4" fill="${role.outfitShade}" opacity="0.65"/>`
      break
    case 'doctor':
      details = `<path d="M86 152 Q100 160 114 152 L114 216 L86 216 Z" fill="${role.under}"/>
        ${steth}
        <path d="M84 151 L94 162 L86 216 L58 216 Q58 168 84 151 Z" fill="url(#${uid}-outfit)"/>
        <path d="M116 151 L106 162 L114 216 L142 216 Q142 168 116 151 Z" fill="url(#${uid}-outfit)"/>
        <path d="M87 155 L94 162 L88 212 L81 212 Z" fill="${role.outfitShade}"/>
        <path d="M113 155 L106 162 L112 212 L119 212 Z" fill="${role.outfitShade}"/>
        <rect x="62" y="186" width="18" height="15" rx="2" fill="${role.outfitShade}" opacity="0.6"/>
        <rect x="120" y="186" width="18" height="15" rx="2" fill="${role.outfitShade}" opacity="0.6"/>
        <rect x="122" y="172" width="12" height="3" fill="#2e8f81"/>`
      break
    case 'nurse':
      details = `${neckV}
        <path d="M86 153 L100 170 L114 153" stroke="${role.outfitShade}" stroke-width="3" fill="none"/>
        ${steth}
        <rect x="66" y="192" width="22" height="17" rx="3" fill="${role.outfitShade}" opacity="0.55"/>
        <rect x="112" y="192" width="22" height="17" rx="3" fill="${role.outfitShade}" opacity="0.55"/>
        <path d="M120 178 h8 M124 174 v8" stroke="#f2f7f6" stroke-width="2.6"/>`
      break
  }
  const sheen = `<path d="M64 216 Q62 176 80 160 Q70 182 72 216 Z" fill="#ffffff" opacity="0.10"/>`
  return { torso: base + details + sheen, sleeve: role.id === 'specialist' ? role.under : role.outfit }
}

// ---------------------------------------------------------------------------
// Gestures — two-segment limbs (round-cap strokes) with proper hands.
// Shoulders ≈ (66,162) and (134,162).
// ---------------------------------------------------------------------------
function armsFor(gesture: string, sleeve: string, tone: Tone): string {
  const dark = '#0b2530'
  const limb = (d: string): string =>
    `<path d="${d}" stroke="${dark}" stroke-width="17.5" fill="none" stroke-linecap="round" opacity="0.14" transform="translate(1.5 2)"/>
     <path d="${d}" stroke="${sleeve}" stroke-width="16" fill="none" stroke-linecap="round"/>`
  const hand = (cx: number, cy: number, thumbAngle = -30): string =>
    `<circle cx="${cx}" cy="${cy}" r="8.8" fill="${tone.base}"/>
     <ellipse cx="${cx - 6}" cy="${cy - 4}" rx="3.4" ry="5" fill="${tone.base}" transform="rotate(${thumbAngle} ${cx - 6} ${cy - 4})"/>
     <circle cx="${cx}" cy="${cy}" r="8.8" fill="${tone.shade}" opacity="0.16"/>`
  const cuff = (cx: number, cy: number, rot: number): string =>
    `<rect x="${cx - 7}" y="${cy - 4}" width="14" height="8" rx="3" fill="#0b2530" opacity="0.12" transform="rotate(${rot} ${cx} ${cy})"/>`
  const downLeft = limb('M66 162 Q52 178 50 200') + cuff(50, 197, 10) + hand(49, 207, -140)
  const downRight = limb('M134 162 Q148 178 150 200') + cuff(150, 197, -10) + hand(151, 207, 140)
  switch (gesture) {
    case 'pointing':
      return (
        downLeft +
        limb('M134 160 Q158 146 176 128') + cuff(172, 132, -45) +
        `<circle cx="181" cy="123" r="8" fill="${tone.base}"/>
         <rect x="184" y="106" width="6.4" height="17" rx="3.2" fill="${tone.base}" transform="rotate(26 187 114)"/>
         <ellipse cx="175" cy="119" rx="3.2" ry="4.6" fill="${tone.base}" transform="rotate(-50 175 119)"/>`
      )
    case 'explaining':
      return (
        limb('M66 162 Q42 164 28 152') + cuff(34, 155, 35) + hand(23, 147, 60) +
        limb('M134 162 Q158 164 172 152') + cuff(166, 155, -35) + hand(177, 147, -60)
      )
    case 'listening':
      return (
        downLeft +
        limb('M134 162 Q156 164 152 134') + cuff(153, 141, -80) + hand(150, 127, -10) +
        `<path d="M144 120 Q151 113 158 120" stroke="${tone.shade}" stroke-width="2" fill="none" opacity="0.45"/>`
      )
    case 'questioning':
      return (
        downLeft +
        limb('M134 160 Q160 152 170 134') + cuff(165, 139, -55) + hand(174, 127, -60) +
        `<path d="M166 120 Q173 114 181 120" stroke="${tone.shade}" stroke-width="2" fill="none" opacity="0.4"/>`
      )
    case 'greeting':
      return (
        downLeft +
        limb('M134 158 Q160 140 168 110') + cuff(164, 118, -70) +
        `<circle cx="171" cy="100" r="9.4" fill="${tone.base}"/>
         <g stroke="${tone.base}" stroke-width="4.6" stroke-linecap="round" fill="none">
           <path d="M164 92 L162 84"/><path d="M169.5 90.5 L169 82"/><path d="M175 91 L177 83"/><path d="M180 94 L184 88"/>
         </g>
         <ellipse cx="163" cy="102" rx="3.4" ry="5" fill="${tone.base}" transform="rotate(30 163 102)"/>`
      )
    case 'approving':
      return (
        downLeft +
        limb('M134 160 Q158 148 164 128') + cuff(161, 134, -60) +
        `<rect x="154" y="104" width="10.5" height="17" rx="5" fill="${tone.base}"/>
         <rect x="158" y="114" width="17" height="14.5" rx="5" fill="${tone.base}"/>
         <path d="M162 118 h9 M162 123 h9" stroke="${tone.shade}" stroke-width="1.3" opacity="0.5"/>`
      )
    case 'rejecting':
      return (
        limb('M66 162 Q36 166 20 176') + cuff(28, 172, 25) + hand(15, 180, 90) +
        limb('M134 162 Q164 166 180 176') + cuff(172, 172, -25) + hand(185, 180, -90)
      )
    default:
      return downLeft + downRight
  }
}

/** Renders a character bust as inline SVG for the given spec/expression/gesture. */
export function characterSvg(
  spec: CharacterSpec,
  expression: string,
  gesture: string,
  variant: 'figure' | 'avatar' = 'figure'
): string {
  const resolved = artResolver?.character?.(spec, expression, gesture, variant)
  if (resolved) {
    return `<img class="clyp-art clyp-art-character" src="${resolved}" alt="" aria-hidden="true" draggable="false"/>`
  }
  const tone = SKIN_TONES.find((t) => t.id === spec.tone) ?? SKIN_TONES[0]
  const { h: hairC } = hairColors(spec.age)
  const uid = `cg-${specKey(spec).replace(/~/g, '-')}`
  const role = ROLES.find((r) => r.id === spec.role) ?? ROLES[1]
  const hair = hairFor(spec)
  const outfit = outfitFor(spec, uid, tone)
  const headPath =
    spec.gender === 'female'
      ? 'M63 92 Q63 50 100 48 Q137 50 137 92 Q137 116 123 127 Q112 135 100 135 Q88 135 77 127 Q63 116 63 92 Z'
      : 'M61 92 Q61 48 100 46 Q139 48 139 92 Q139 118 126 129 Q113 137 100 137 Q87 137 74 129 Q61 118 61 92 Z'
  return `<svg viewBox="0 0 200 216" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${uid}-outfit" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${role.outfit}"/>
      <stop offset="1" stop-color="${role.outfitShade}"/>
    </linearGradient>
    <radialGradient id="${uid}-skin" cx="0.42" cy="0.34" r="0.9">
      <stop offset="0" stop-color="${tone.base}"/>
      <stop offset="1" stop-color="${tone.shade}"/>
    </radialGradient>
  </defs>
  <ellipse cx="100" cy="210" rx="66" ry="6.5" fill="#002c39" opacity="0.10"/>
  ${hair.back}
  ${armsFor(gesture, outfit.sleeve, tone)}
  ${outfit.torso}
  <path d="M89 124 h22 v26 q0 8 -11 8 q-11 0 -11 -8 Z" fill="${tone.shade}"/>
  <path d="M89 132 q11 7 22 0 l0 6 q-11 6 -22 0 Z" fill="#0b2530" opacity="0.14"/>
  <path d="${headPath}" fill="url(#${uid}-skin)"/>
  <ellipse cx="61" cy="98" rx="5.6" ry="7.6" fill="${tone.base}"/>
  <ellipse cx="139" cy="98" rx="5.6" ry="7.6" fill="${tone.base}"/>
  <ellipse cx="61.5" cy="98" rx="2.4" ry="3.8" fill="${tone.shade}" opacity="0.55"/>
  <ellipse cx="138.5" cy="98" rx="2.4" ry="3.8" fill="${tone.shade}" opacity="0.55"/>
  ${hair.front}
  ${browsFor(expression, hairC)}
  ${eyesFor(expression, tone, spec.gender)}
  <path d="M97 103 Q100 108.5 103.5 103.5" stroke="${tone.shade}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M96 106.5 q4 2.4 8 0" stroke="${tone.shade}" stroke-width="1.1" fill="none" opacity="0.35"/>
  ${mouthFor(expression, tone)}
  ${faceAccents(expression, spec, tone)}
</svg>`
}

// ---------------------------------------------------------------------------
// Backgrounds — layered flat-illustration scenes, 800×450, with a shared
// lighting pass (top light wash, window shaft, floor sheen, soft vignette).
// ---------------------------------------------------------------------------
export interface BackgroundDef {
  id: string
  label: string
  svg: string
}

function bgShell(id: string, defs: string, layers: string): string {
  const lightDefs = `
    <radialGradient id="bg-${id}-vig" cx="0.5" cy="0.42" r="0.78">
      <stop offset="0.6" stop-color="#0b2e3a" stop-opacity="0"/>
      <stop offset="1" stop-color="#0b2e3a" stop-opacity="0.16"/>
    </radialGradient>
    <linearGradient id="bg-${id}-toplight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="0.35" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>`
  const lighting = `
  <path d="M250 0 L550 0 L648 330 L152 330 Z" fill="#ffffff" opacity="0.05"/>
  <rect width="800" height="450" fill="url(#bg-${id}-toplight)"/>
  <ellipse cx="400" cy="342" rx="310" ry="13" fill="#ffffff" opacity="0.16"/>
  <rect width="800" height="450" fill="url(#bg-${id}-vig)"/>`
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" focusable="false">
  <defs>${defs}${lightDefs}</defs>
  ${layers}
  ${lighting}
</svg>`
}

function vGrad(id: string, from: string, to: string): string {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`
}

function softShadow(cx: number, cy: number, rx: number): string {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${Math.max(6, rx * 0.09)}" fill="#002c39" opacity="0.10"/>`
}

/** Window with frame, sill and a soft sky reflection. */
function windowPane(x: number, y: number, w: number, h: number, skyId: string): string {
  const midX = x + w / 2
  return `<g>
    <rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="8" fill="#c8d9dd"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#${skyId})"/>
    <path d="M${x + w * 0.12} ${y + h} L${x + w * 0.42} ${y} L${x + w * 0.56} ${y} L${x + w * 0.26} ${y + h} Z" fill="#ffffff" opacity="0.28"/>
    <rect x="${midX - 3}" y="${y}" width="6" height="${h}" fill="#c8d9dd"/>
    <rect x="${x}" y="${y + h / 2 - 3}" width="${w}" height="6" fill="#c8d9dd"/>
    <rect x="${x - 14}" y="${y + h + 8}" width="${w + 28}" height="10" rx="5" fill="#b6c9ce"/>
  </g>`
}

/** Potted plant with layered leaves. */
function plant(x: number, y: number, s = 1): string {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    ${softShadow(0, 4, 34)}
    <path d="M-4 -18 Q-26 -44 -16 -74 Q-2 -52 -2 -22 Z" fill="#2e7d5b"/>
    <path d="M4 -18 Q28 -40 20 -72 Q4 -52 2 -22 Z" fill="#3c9a6e"/>
    <path d="M0 -16 Q-2 -58 0 -86 Q10 -60 4 -18 Z" fill="#4fb381"/>
    <path d="M-8 -20 Q-38 -30 -44 -54 Q-18 -46 -6 -24 Z" fill="#3c9a6e"/>
    <path d="M8 -20 Q40 -28 44 -52 Q20 -44 6 -24 Z" fill="#2e7d5b"/>
    <path d="M-16 0 L16 0 L12 26 Q0 30 -12 26 Z" fill="#a06a43"/>
    <path d="M-16 0 L16 0 L14.6 9 L-14.6 9 Z" fill="#8a5836"/>
  </g>`
}

/** Desk with tapered legs and a soft contact shadow. */
function desk(x: number, y: number, w: number, top = '#9a7350', side = '#7f5c3e'): string {
  return `<g>
    ${softShadow(x + w / 2, y + 66, w * 0.55)}
    <rect x="${x}" y="${y}" width="${w}" height="12" rx="5" fill="${top}"/>
    <rect x="${x}" y="${y + 10}" width="${w}" height="5" rx="2.5" fill="${side}"/>
    <path d="M${x + 14} ${y + 15} L${x + 24} ${y + 15} L${x + 20} ${y + 64} L${x + 12} ${y + 64} Z" fill="${side}"/>
    <path d="M${x + w - 24} ${y + 15} L${x + w - 14} ${y + 15} L${x + w - 12} ${y + 64} L${x + w - 20} ${y + 64} Z" fill="${side}"/>
  </g>`
}

/** Monitor with glowing screen and stand. */
function monitor(x: number, y: number, w: number, h: number, screenId: string): string {
  return `<g>
    <rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="6" fill="#22343d"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#${screenId})"/>
    <rect x="${x + 6}" y="${y + 7}" width="${w * 0.5}" height="5" rx="2.5" fill="#ffffff" opacity="0.55"/>
    <rect x="${x + 6}" y="${y + 17}" width="${w * 0.72}" height="4" rx="2" fill="#ffffff" opacity="0.35"/>
    <rect x="${x + 6}" y="${y + 26}" width="${w * 0.6}" height="4" rx="2" fill="#ffffff" opacity="0.35"/>
    <rect x="${x + w / 2 - 5}" y="${y + h + 4}" width="10" height="12" fill="#22343d"/>
    <rect x="${x + w / 2 - 18}" y="${y + h + 15}" width="36" height="5" rx="2.5" fill="#22343d"/>
  </g>`
}

/** Framed wall art. */
function wallArt(x: number, y: number, w: number, h: number, fill: string): string {
  return `<g>
    <rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="4" fill="#c8d9dd"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>
    <path d="M${x} ${y + h} Q${x + w * 0.3} ${y + h * 0.35} ${x + w * 0.55} ${y + h * 0.7} Q${x + w * 0.78} ${y + h * 0.95} ${x + w} ${y + h * 0.45} L${x + w} ${y + h} Z" fill="#ffffff" opacity="0.35"/>
    <circle cx="${x + w * 0.72}" cy="${y + h * 0.3}" r="${h * 0.14}" fill="#ffffff" opacity="0.6"/>
  </g>`
}

/** Pendant lamp hanging from the top edge. */
function pendantLamp(x: number, drop: number): string {
  return `<g>
    <line x1="${x}" y1="0" x2="${x}" y2="${drop}" stroke="#3d5259" stroke-width="3"/>
    <path d="M${x - 26} ${drop + 26} Q${x} ${drop - 10} ${x + 26} ${drop + 26} Z" fill="#155e6e"/>
    <path d="M${x - 26} ${drop + 26} Q${x} ${drop + 34} ${x + 26} ${drop + 26} Z" fill="#0c4552"/>
    <ellipse cx="${x}" cy="${drop + 27}" rx="12" ry="4" fill="#ffe9a8"/>
    <path d="M${x - 20} ${drop + 30} L${x - 34} ${drop + 78} L${x + 34} ${drop + 78} L${x + 20} ${drop + 30} Z" fill="#ffe9a8" opacity="0.12"/>
  </g>`
}

function floorAndWall(wallId: string, floorId: string, skirting = '#d6c4c4'): string {
  return `<rect width="800" height="330" fill="url(#${wallId})"/>
    <rect y="322" width="800" height="8" fill="${skirting}"/>
    <rect y="330" width="800" height="120" fill="url(#${floorId})"/>
    <path d="M0 330 L800 330 L800 340 L0 340 Z" fill="#002c39" opacity="0.05"/>`
}

function makeOffice(): string {
  const defs =
    vGrad('bg-office-wall', '#eaf3f4', '#d3e4e6') +
    vGrad('bg-office-floor', '#cbb9a9', '#b5a08e') +
    vGrad('bg-office-sky', '#bfe4ef', '#e8f6f9') +
    vGrad('bg-office-screen', '#7fd6c0', '#4aa3a0')
  return bgShell(
    'office',
    defs,
    `${floorAndWall('bg-office-wall', 'bg-office-floor')}
    ${windowPane(70, 70, 180, 150, 'bg-office-sky')}
    ${windowPane(550, 70, 180, 150, 'bg-office-sky')}
    <path d="M96 190 L128 148 L150 172 L176 132 L200 190 Z" fill="#7fa8b5" opacity="0.55"/>
    <path d="M580 190 L606 150 L628 176 L652 140 L678 190 Z" fill="#7fa8b5" opacity="0.55"/>
    ${pendantLamp(400, 54)}
    ${wallArt(330, 96, 60, 76, '#7fc8bb')}
    ${wallArt(412, 96, 60, 76, '#f0b08c')}
    ${desk(290, 268, 230)}
    ${monitor(346, 210, 92, 52, 'bg-office-screen')}
    <rect x="452" y="252" width="34" height="8" rx="4" fill="#e5eef0"/>
    <rect x="306" y="250" width="26" height="14" rx="3" fill="#e0655a"/>
    <rect x="306" y="244" width="26" height="8" rx="3" fill="#ef7d72"/>
    ${plant(140, 330, 1.15)}
    ${plant(672, 330, 0.95)}
    <rect x="0" y="410" width="800" height="40" fill="#002c39" opacity="0.05"/>`
  )
}

function makeMeetingRoom(): string {
  const defs =
    vGrad('bg-meet-wall', '#e9f1f2', '#d2e2e4') +
    vGrad('bg-meet-floor', '#c4cfd4', '#a9b8be') +
    vGrad('bg-meet-board', '#ffffff', '#eef4f5') +
    vGrad('bg-meet-chart', '#00c18e', '#00997a')
  return bgShell(
    'meetingRoom',
    defs,
    `${floorAndWall('bg-meet-wall', 'bg-meet-floor', '#c3d2d6')}
    <g>
      <rect x="188" y="62" width="424" height="176" rx="10" fill="#0b3b47"/>
      <rect x="200" y="74" width="400" height="152" rx="6" fill="url(#bg-meet-board)"/>
      <path d="M232 196 L306 150 L368 176 L448 118 L520 150 L566 108" stroke="url(#bg-meet-chart)" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="306" cy="150" r="7" fill="#015061"/><circle cx="448" cy="118" r="7" fill="#015061"/><circle cx="566" cy="108" r="7" fill="#015061"/>
      <rect x="232" y="92" width="120" height="10" rx="5" fill="#9fb7bd"/>
      <rect x="232" y="110" width="76" height="7" rx="3.5" fill="#c3d2d6"/>
    </g>
    ${pendantLamp(140, 40)}${pendantLamp(660, 40)}
    <g>
      ${softShadow(400, 372, 260)}
      <path d="M150 322 L650 322 L610 366 L190 366 Z" fill="#9a7350"/>
      <path d="M190 366 L610 366 L604 376 L196 376 Z" fill="#7f5c3e"/>
      <rect x="240" y="376" width="16" height="34" fill="#7f5c3e"/>
      <rect x="544" y="376" width="16" height="34" fill="#7f5c3e"/>
      <ellipse cx="400" cy="340" rx="34" ry="9" fill="#3c9a6e"/>
      <rect x="392" y="330" width="16" height="12" rx="4" fill="#a06a43"/>
    </g>
    ${plant(60, 330, 1.05)}
    ${plant(742, 330, 1.05)}`
  )
}

function makeReception(): string {
  const defs =
    vGrad('bg-rec-wall', '#f2ebe6', '#e2d5cb') +
    vGrad('bg-rec-floor', '#d8cfc6', '#c0b4a8') +
    vGrad('bg-rec-desk', '#0e5a6b', '#0a4553') +
    vGrad('bg-rec-sky', '#cde9ef', '#eef8fa')
  return bgShell(
    'receptionArea',
    defs,
    `${floorAndWall('bg-rec-wall', 'bg-rec-floor', '#cfc2b6')}
    <g>
      <rect x="300" y="76" width="200" height="44" rx="22" fill="#0e5a6b"/>
      <text x="400" y="106" text-anchor="middle" font-family="Georgia, serif" font-size="24" letter-spacing="6" fill="#ffffff">WELCOME</text>
    </g>
    ${windowPane(80, 84, 130, 120, 'bg-rec-sky')}
    ${windowPane(590, 84, 130, 120, 'bg-rec-sky')}
    ${wallArt(246, 150, 48, 60, '#e8a87c')}
    ${wallArt(506, 150, 48, 60, '#7fc8bb')}
    <g>
      ${softShadow(400, 352, 220)}
      <path d="M230 240 Q230 228 242 228 L558 228 Q570 228 570 240 L570 344 L230 344 Z" fill="url(#bg-rec-desk)"/>
      <rect x="230" y="228" width="340" height="14" rx="7" fill="#00c18e"/>
      <rect x="258" y="266" width="60" height="44" rx="6" fill="#ffffff" opacity="0.08"/>
      <rect x="370" y="266" width="60" height="44" rx="6" fill="#ffffff" opacity="0.08"/>
      <rect x="482" y="266" width="60" height="44" rx="6" fill="#ffffff" opacity="0.08"/>
      <ellipse cx="298" cy="222" rx="26" ry="8" fill="#3c9a6e"/>
      <rect x="292" y="214" width="12" height="10" rx="3" fill="#a06a43"/>
      <rect x="474" y="206" width="30" height="20" rx="4" fill="#22343d"/>
      <rect x="477" y="209" width="24" height="14" rx="2" fill="#7fd6c0"/>
    </g>
    ${plant(126, 330, 1.2)}
    ${plant(676, 330, 1.2)}`
  )
}

function makeCallCenter(): string {
  const defs =
    vGrad('bg-call-wall', '#e6eef4', '#d0dde6') +
    vGrad('bg-call-floor', '#b9c4cc', '#a0adb6') +
    vGrad('bg-call-screen', '#79c8e8', '#4a90b8') +
    vGrad('bg-call-screen2', '#7fd6c0', '#4aa3a0')
  return bgShell(
    'callCenter',
    defs,
    `${floorAndWall('bg-call-wall', 'bg-call-floor', '#c0ccd4')}
    <rect x="0" y="60" width="800" height="8" fill="#b7c6d0"/>
    <g>
      ${softShadow(180, 350, 130)}
      <rect x="80" y="252" width="210" height="16" rx="6" fill="#e3e9ee"/>
      <rect x="86" y="268" width="198" height="72" rx="4" fill="#cfd9e0"/>
      <rect x="96" y="278" width="80" height="52" rx="4" fill="#b7c6d0"/>
      ${monitor(112, 196, 84, 48, 'bg-call-screen')}
      <rect x="212" y="236" width="40" height="8" rx="4" fill="#8fa2ad"/>
    </g>
    <g>
      ${softShadow(620, 350, 130)}
      <rect x="510" y="252" width="210" height="16" rx="6" fill="#e3e9ee"/>
      <rect x="516" y="268" width="198" height="72" rx="4" fill="#cfd9e0"/>
      <rect x="624" y="278" width="80" height="52" rx="4" fill="#b7c6d0"/>
      ${monitor(542, 196, 84, 48, 'bg-call-screen2')}
      <rect x="648" y="236" width="40" height="8" rx="4" fill="#8fa2ad"/>
    </g>
    <g>
      <rect x="330" y="96" width="140" height="88" rx="8" fill="#22343d"/>
      <rect x="338" y="104" width="124" height="72" rx="4" fill="url(#bg-call-screen)"/>
      <path d="M348 160 L376 136 L400 150 L428 122 L452 140" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.8" stroke-linecap="round"/>
      <rect x="348" y="114" width="52" height="7" rx="3.5" fill="#ffffff" opacity="0.6"/>
    </g>
    <g>
      <circle cx="400" cy="262" r="24" fill="#0e5a6b"/>
      <path d="M388 258 Q388 246 400 246 Q412 246 412 258" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="382" y="256" width="8" height="14" rx="4" fill="#ffffff"/>
      <rect x="410" y="256" width="8" height="14" rx="4" fill="#ffffff"/>
      <path d="M414 270 Q412 280 402 281" stroke="#ffffff" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    </g>
    ${pendantLamp(260, 34)}${pendantLamp(540, 34)}`
  )
}

function makeFactory(): string {
  const defs =
    vGrad('bg-fac-wall', '#dfe6ea', '#c6d1d8') +
    vGrad('bg-fac-floor', '#9aa6ad', '#818e96') +
    vGrad('bg-fac-metal', '#b7c3ca', '#93a2ab')
  return bgShell(
    'factory',
    defs,
    `${floorAndWall('bg-fac-wall', 'bg-fac-floor', '#aab7bf')}
    <path d="M0 96 L110 46 L220 96 L330 46 L440 96 L550 46 L660 96 L770 46 L800 60 L800 104 L0 104 Z" fill="#b0bec7"/>
    <path d="M0 104 L800 104 L800 112 L0 112 Z" fill="#93a2ab"/>
    <rect x="72" y="140" width="70" height="56" rx="4" fill="#d9e4e9" opacity="0.85"/>
    <rect x="660" y="140" width="70" height="56" rx="4" fill="#d9e4e9" opacity="0.85"/>
    <g>
      ${softShadow(250, 352, 150)}
      <rect x="130" y="300" width="240 " height="44" rx="6" fill="url(#bg-fac-metal)"/>
      <rect x="130" y="292" width="240" height="12" rx="6" fill="#7d8d96"/>
      <circle cx="166" cy="322" r="12" fill="#67767f"/><circle cx="250" cy="322" r="12" fill="#67767f"/><circle cx="334" cy="322" r="12" fill="#67767f"/>
      <rect x="150" y="252" width="56" height="40" rx="4" fill="#e0a33e"/>
      <rect x="150" y="244" width="56" height="12" rx="4" fill="#c78a28"/>
      <rect x="238" y="258" width="48" height="34" rx="4" fill="#0e7a8a"/>
      <rect x="302" y="252" width="52" height="40" rx="4" fill="#e0655a"/>
    </g>
    <g>
      ${softShadow(600, 356, 120)}
      <path d="M520 344 L536 220 L664 220 L680 344 Z" fill="#8a99a3"/>
      <rect x="536" y="200" width="128" height="26" rx="6" fill="#67767f"/>
      <circle cx="600" cy="282" r="34" fill="#4d5c66"/>
      <circle cx="600" cy="282" r="20" fill="#67767f"/>
      <circle cx="600" cy="282" r="7" fill="#e0a33e"/>
    </g>
    <rect x="0" y="392" width="800" height="14" fill="#e0a33e" opacity="0.85"/>
    <path d="M0 392 L28 406 L56 392 L84 406 L112 392 L140 406 L168 392 L196 406 L224 392 L252 406 L280 392 L308 406 L336 392 L364 406 L392 392 L420 406 L448 392 L476 406 L504 392 L532 406 L560 392 L588 406 L616 392 L644 406 L672 392 L700 406 L728 392 L756 406 L784 392 L800 400 L800 392 Z" fill="#22343d" opacity="0.35"/>`
  )
}

function makeWarehouse(): string {
  const defs =
    vGrad('bg-wh-wall', '#e8e2d8', '#d4cabb') +
    vGrad('bg-wh-floor', '#a89e90', '#8f8478') +
    vGrad('bg-wh-box', '#d9b98a', '#c2a26f')
  const box = (x: number, y: number, w: number, h: number): string =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#bg-wh-box)"/>
     <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="#a8854f" stroke-width="3"/>
     <rect x="${x + w * 0.18}" y="${y + h * 0.28}" width="${w * 0.28}" height="${h * 0.2}" fill="#ffffff" opacity="0.5"/>`
  const rack = (x: number): string =>
    `<g>
      ${softShadow(x + 110, 356, 130)}
      <rect x="${x}" y="130" width="12" height="220" fill="#8a6d4e"/>
      <rect x="${x + 208}" y="130" width="12" height="220" fill="#8a6d4e"/>
      <rect x="${x - 6}" y="196" width="232" height="10" rx="4" fill="#7a5f43"/>
      <rect x="${x - 6}" y="272" width="232" height="10" rx="4" fill="#7a5f43"/>
      <rect x="${x - 6}" y="344" width="232" height="10" rx="4" fill="#7a5f43"/>
      ${box(x + 18, 152, 52, 44)}${box(x + 84, 146, 62, 50)}${box(x + 158, 158, 44, 38)}
      ${box(x + 26, 226, 58, 46)}${box(x + 128, 232, 66, 40)}
      ${box(x + 40, 300, 50, 44)}${box(x + 118, 296, 56, 48)}
    </g>`
  return bgShell(
    'warehouse',
    defs,
    `${floorAndWall('bg-wh-wall', 'bg-wh-floor', '#c4b8a6')}
    <path d="M0 70 L800 70 L800 78 L0 78 Z" fill="#c9bda9"/>
    ${rack(90)}
    ${rack(480)}
    <g>
      ${softShadow(400, 388, 60)}
      ${box(360, 330, 80, 54)}
      <rect x="352" y="384" width="96" height="10" rx="3" fill="#c78a28"/>
      <circle cx="368" cy="398" r="7" fill="#4d5c66"/><circle cx="432" cy="398" r="7" fill="#4d5c66"/>
    </g>
    <rect x="0" y="416" width="800" height="10" fill="#e0a33e" opacity="0.7"/>`
  )
}

function makeHospital(): string {
  const defs =
    vGrad('bg-hosp-wall', '#f0f6f8', '#dce9ee') +
    vGrad('bg-hosp-floor', '#cfdbe0', '#b6c6cd') +
    vGrad('bg-hosp-screen', '#8fd8c8', '#57ab9d')
  return bgShell(
    'hospital',
    defs,
    `${floorAndWall('bg-hosp-wall', 'bg-hosp-floor', '#c7d6dc')}
    <rect x="0" y="252" width="800" height="10" fill="#57ab9d" opacity="0.5"/>
    <g>
      <rect x="96" y="80" width="150" height="242" rx="8" fill="#dfe9ed"/>
      <rect x="104" y="88" width="134" height="226" rx="5" fill="#eef4f6"/>
      <rect x="150" y="216" width="42" height="98" rx="4" fill="#9db8c2"/>
      <circle cx="182" cy="266" r="5" fill="#5a7681"/>
      <rect x="118" y="108" width="106" height="66" rx="4" fill="#cde5ec"/>
      <path d="M124 168 L152 140 L176 156 L202 128 L218 140" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.8"/>
    </g>
    <g>
      <circle cx="400" cy="130" r="46" fill="#e05252"/>
      <circle cx="400" cy="130" r="46" fill="#ffffff" opacity="0.08"/>
      <rect x="390" y="102" width="20" height="56" rx="5" fill="#ffffff"/>
      <rect x="372" y="120" width="56" height="20" rx="5" fill="#ffffff"/>
    </g>
    <g>
      ${softShadow(620, 356, 140)}
      <rect x="520" y="232" width="200" height="112" rx="10" fill="#ffffff"/>
      <rect x="520" y="232" width="200" height="112" rx="10" fill="#0e5a6b" opacity="0.06"/>
      <rect x="538" y="250" width="90" height="10" rx="5" fill="#9db8c2"/>
      <rect x="538" y="270" width="140" height="8" rx="4" fill="#c7d6dc"/>
      <rect x="538" y="286" width="120" height="8" rx="4" fill="#c7d6dc"/>
      <rect x="538" y="308" width="60" height="18" rx="9" fill="#00c18e"/>
      ${monitor(640, 186, 64, 38, 'bg-hosp-screen')}
    </g>
    ${plant(60, 330, 1.0)}
    <g>
      <rect x="286" y="196" width="10" height="126" fill="#9db8c2"/>
      <rect x="266" y="188" width="50" height="14" rx="7" fill="#8fa8b2"/>
      <path d="M291 196 Q306 214 300 240" stroke="#8fa8b2" stroke-width="4" fill="none"/>
      <rect x="292" y="238" width="18" height="26" rx="5" fill="#cde5ec"/>
    </g>`
  )
}

function makeClassroom(): string {
  const defs =
    vGrad('bg-class-wall', '#f2ecdd', '#e3d9c2') +
    vGrad('bg-class-floor', '#c8ab82', '#b09367') +
    vGrad('bg-class-board', '#2f6b52', '#265743')
  return bgShell(
    'classroom',
    defs,
    `${floorAndWall('bg-class-wall', 'bg-class-floor', '#d3c3a4')}
    <g>
      <rect x="176" y="66" width="448" height="180" rx="10" fill="#8a6d4e"/>
      <rect x="188" y="78" width="424" height="156" rx="5" fill="url(#bg-class-board)"/>
      <text x="280" y="150" font-family="Georgia, serif" font-size="34" fill="#e8f2ec" opacity="0.95">2 + 2 = 4</text>
      <path d="M420 176 Q450 130 484 168 Q510 196 540 150" stroke="#e8f2ec" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
      <rect x="204" y="216" width="52" height="8" rx="4" fill="#e8f2ec" opacity="0.5"/>
      <rect x="188" y="236" width="424" height="10" rx="5" fill="#7a5f43"/>
      <rect x="330" y="230" width="34" height="7" rx="3.5" fill="#f5f0e4"/>
    </g>
    <circle cx="110" cy="120" r="34" fill="#e8f2ec"/>
    <path d="M110 100 L110 120 L124 128" stroke="#0e5a6b" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="110" cy="120" r="34" fill="none" stroke="#c8b088" stroke-width="6"/>
    ${wallArt(672, 100, 56, 70, '#7fc8bb')}
    <g>
      ${softShadow(240, 372, 110)}
      ${desk(160, 316, 170, '#a97e52', '#8a6640')}
      <rect x="196" y="298" width="44" height="20" rx="3" fill="#e0655a"/>
      <rect x="200" y="292" width="36" height="9" rx="3" fill="#ef7d72"/>
      <rect x="248" y="304" width="52" height="12" rx="3" fill="#eef4f6"/>
    </g>
    <g>
      ${softShadow(560, 372, 110)}
      ${desk(480, 316, 170, '#a97e52', '#8a6640')}
      <ellipse cx="530" cy="308" rx="20" ry="8" fill="#3c9a6e"/>
      <rect x="524" y="300" width="12" height="10" rx="3" fill="#a06a43"/>
      <rect x="566" y="304" width="56" height="12" rx="3" fill="#cde5ec"/>
    </g>`
  )
}

function makeRetail(): string {
  const defs =
    vGrad('bg-ret-wall', '#f6f1ea', '#e9e0d3') +
    vGrad('bg-ret-floor', '#d3c9ba', '#bcafa0') +
    vGrad('bg-ret-counter', '#0e5a6b', '#0a4553')
  const item = (x: number, y: number, c: string): string =>
    `<rect x="${x}" y="${y}" width="30" height="38" rx="4" fill="${c}"/>
     <rect x="${x + 5}" y="${y + 6}" width="20" height="8" rx="2" fill="#ffffff" opacity="0.45"/>`
  return bgShell(
    'retailStore',
    defs,
    `${floorAndWall('bg-ret-wall', 'bg-ret-floor', '#d8cbb8')}
    <g>
      ${softShadow(190, 348, 130)}
      <rect x="80" y="120" width="220" height="220" rx="8" fill="#e5dccb"/>
      <rect x="92" y="132" width="196" height="196" rx="4" fill="#efe8d9"/>
      <rect x="92" y="188" width="196" height="8" rx="4" fill="#c9b998"/>
      <rect x="92" y="252" width="196" height="8" rx="4" fill="#c9b998"/>
      ${item(104, 148, '#e0655a')}${item(144, 148, '#0e7a8a')}${item(184, 148, '#3c9a6e')}${item(224, 148, '#e0a33e')}
      ${item(112, 212, '#7f5aa8')}${item(160, 212, '#c2703e')}${item(208, 212, '#0f6a6e')}
      ${item(124, 276, '#e0655a')}${item(172, 276, '#e0a33e')}${item(220, 276, '#0e7a8a')}
    </g>
    <g>
      <rect x="332" y="66" width="180" height="40" rx="20" fill="#0e5a6b"/>
      <text x="422" y="93" text-anchor="middle" font-family="Georgia, serif" font-size="21" letter-spacing="4" fill="#ffffff">STORE</text>
    </g>
    <g>
      ${softShadow(580, 366, 170)}
      <path d="M460 260 Q460 248 472 248 L688 248 Q700 248 700 260 L700 356 L460 356 Z" fill="url(#bg-ret-counter)"/>
      <rect x="460" y="248" width="240" height="12" rx="6" fill="#00c18e"/>
      <rect x="484" y="282" width="56" height="40" rx="6" fill="#ffffff" opacity="0.08"/>
      <rect x="592" y="282" width="56" height="40" rx="6" fill="#ffffff" opacity="0.08"/>
      <rect x="560" y="212" width="44" height="30" rx="5" fill="#22343d"/>
      <rect x="564" y="216" width="36" height="22" rx="3" fill="#7fd6c0"/>
      <rect x="576" y="242" width="12" height="8" fill="#22343d"/>
    </g>
    ${plant(736, 330, 1.05)}
    <path d="M330 130 Q360 110 390 130 L390 196 L330 196 Z" fill="#e0a33e" opacity="0.85"/>
    <path d="M410 130 Q440 110 470 130 L470 196 L410 196 Z" fill="#e0655a" opacity="0.85"/>
    <rect x="330" y="196" width="140" height="8" rx="4" fill="#c9b998"/>`
  )
}

function makeRemoteWork(): string {
  const defs =
    vGrad('bg-rem-wall', '#f4ede2', '#e6dac7') +
    vGrad('bg-rem-floor', '#cdb694', '#b69c76') +
    vGrad('bg-rem-sky', '#cbe7ee', '#f0f9fa') +
    vGrad('bg-rem-screen', '#8fd0e8', '#5aa0c8')
  return bgShell(
    'remoteWork',
    defs,
    `${floorAndWall('bg-rem-wall', 'bg-rem-floor', '#d9c8a9')}
    <g>
      ${windowPane(110, 70, 210, 160, 'bg-rem-sky')}
      <circle cx="286" cy="106" r="18" fill="#ffe9a8"/>
      <path d="M126 230 Q170 158 214 204 Q248 156 288 210 L320 186 L320 230 Z" fill="#9dc08f"/>
      <path d="M126 230 Q160 190 194 218 L126 230 Z" fill="#84ab74"/>
    </g>
    <g>
      <rect x="560" y="76" width="160" height="120" rx="6" fill="#d9c8a9"/>
      <rect x="568" y="84" width="144" height="24" rx="3" fill="#c2a87f"/>
      <rect x="568" y="116" width="144" height="24" rx="3" fill="#c2a87f"/>
      <rect x="568" y="148" width="144" height="24" rx="3" fill="#c2a87f"/>
      <rect x="580" y="70" width="14" height="14" rx="2" fill="#e0655a"/>
      <rect x="600" y="66" width="14" height="18" rx="2" fill="#0e7a8a"/>
      <rect x="620" y="72" width="14" height="12" rx="2" fill="#3c9a6e"/>
      <rect x="586" y="102" width="18" height="14" rx="2" fill="#7f5aa8"/>
      <rect x="640" y="100" width="30" height="16" rx="8" fill="#e0a33e"/>
    </g>
    <g>
      ${softShadow(520, 372, 200)}
      ${desk(390, 300, 280, '#a97e52', '#8a6640')}
      ${monitor(452, 236, 104, 60, 'bg-rem-screen')}
      <rect x="580" y="284" width="48" height="10" rx="5" fill="#eef4f6"/>
      <ellipse cx="420" cy="292" rx="22" ry="8" fill="#3c9a6e"/>
      <rect x="414" y="284" width="12" height="10" rx="3" fill="#a06a43"/>
      <rect x="588" y="266" width="26" height="18" rx="9" fill="#f5f0e4"/>
      <path d="M594 266 Q601 258 608 266" stroke="#c2a87f" stroke-width="3" fill="none"/>
    </g>
    ${plant(90, 388, 1.3)}
    <path d="M0 418 L800 418 L800 450 L0 450 Z" fill="#8a6640" opacity="0.15"/>`
  )
}

function makeNeutral(): string {
  const defs =
    vGrad('bg-neu-wall', '#eef2f4', '#dbe3e7') +
    vGrad('bg-neu-floor', '#cdd6da', '#b6c2c8')
  return bgShell(
    'neutral',
    defs,
    `${floorAndWall('bg-neu-wall', 'bg-neu-floor', '#c9d4d9')}
    <circle cx="640" cy="110" r="64" fill="#ffffff" opacity="0.45"/>
    <circle cx="700" cy="160" r="36" fill="#ffffff" opacity="0.3"/>
    <circle cx="150" cy="90" r="40" fill="#ffffff" opacity="0.35"/>
    <path d="M0 300 Q200 260 400 300 T800 300 L800 330 L0 330 Z" fill="#ffffff" opacity="0.25"/>
    ${plant(96, 330, 1.1)}
    ${plant(704, 330, 0.9)}
    ${pendantLamp(400, 46)}`
  )
}

export const BACKGROUND_LIBRARY: BackgroundDef[] = [
  { id: 'office', label: 'Office', svg: makeOffice() },
  { id: 'meetingRoom', label: 'Meeting Room', svg: makeMeetingRoom() },
  { id: 'receptionArea', label: 'Reception Area', svg: makeReception() },
  { id: 'callCenter', label: 'Call Center', svg: makeCallCenter() },
  { id: 'factory', label: 'Factory', svg: makeFactory() },
  { id: 'warehouse', label: 'Warehouse', svg: makeWarehouse() },
  { id: 'hospital', label: 'Hospital', svg: makeHospital() },
  { id: 'classroom', label: 'Classroom', svg: makeClassroom() },
  { id: 'retailStore', label: 'Retail Store', svg: makeRetail() },
  { id: 'remoteWork', label: 'Remote Work', svg: makeRemoteWork() },
  { id: 'neutral', label: 'Neutral', svg: makeNeutral() }
]

export function backgroundSvg(backgroundId: string | undefined): string {
  const resolved = artResolver?.background?.(backgroundId)
  if (resolved) {
    return `<img class="clyp-art clyp-art-bg" src="${resolved}" alt="" aria-hidden="true" draggable="false"/>`
  }
  return (BACKGROUND_LIBRARY.find((b) => b.id === backgroundId) ?? BACKGROUND_LIBRARY.find((b) => b.id === 'neutral'))!.svg
}
