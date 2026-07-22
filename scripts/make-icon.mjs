// Generates the ClypCompiler app icon (.ico) with no image dependencies.
// Writes uncompressed 32-bit BGRA BMP frames at 16/32/48/64/128/256 px into a
// multi-resolution .ico, so Windows picks the right size everywhere.
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'build')
const publicDir = path.join(root, 'public')
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(publicDir, { recursive: true })

// All colors are BGR (the byte order used by both BMP/ICO and the PNG writer).
const TEAL_DARK = [0x44, 0x38, 0x01] // #013844
const TEAL = [0x61, 0x50, 0x01]      // #015061
const MINT = [0x8e, 0xc1, 0x00]      // #00c18e
const WHITE = [0xff, 0xff, 0xff]

function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ]
}

/**
 * Draws the mark: a rounded teal tile with a mint "play/compile" chevron and a
 * stacked-blocks glyph — blocks flowing into a course.
 */
function renderFrame(size) {
  const px = new Uint8Array(size * size * 4) // BGRA
  const S = size
  const r = S * 0.22 // corner radius
  const put = (x, y, rgb, a) => {
    const i = (y * S + x) * 4
    // simple source-over onto whatever is there
    const ia = a / 255
    px[i] = Math.round(rgb[0] * ia + px[i] * (1 - ia))
    px[i + 1] = Math.round(rgb[1] * ia + px[i + 1] * (1 - ia))
    px[i + 2] = Math.round(rgb[2] * ia + px[i + 2] * (1 - ia))
    px[i + 3] = Math.max(px[i + 3], Math.round(a))
  }
  // rounded-rect coverage with 3x3 supersampling for smooth edges
  const inTile = (x, y) => {
    const dx = Math.max(r - x, x - (S - 1 - r), 0)
    const dy = Math.max(r - y, y - (S - 1 - r), 0)
    return dx * dx + dy * dy <= r * r
  }
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let hits = 0
      for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 3; sx++) {
          if (inTile(x + (sx + 0.5) / 3 - 0.5, y + (sy + 0.5) / 3 - 0.5)) hits++
        }
      }
      if (!hits) continue
      const grad = lerp(TEAL, TEAL_DARK, y / S)
      put(x, y, grad, (hits / 9) * 255)
    }
  }
  // stacked blocks (left) — three bars of decreasing width
  const barX = Math.round(S * 0.2)
  const barW = Math.round(S * 0.3)
  const barH = Math.max(1, Math.round(S * 0.075))
  const gap = Math.max(1, Math.round(S * 0.055))
  const startY = Math.round(S * 0.3)
  for (let b = 0; b < 3; b++) {
    const w = Math.round(barW * (1 - b * 0.18))
    const y0 = startY + b * (barH + gap)
    for (let y = y0; y < y0 + barH && y < S; y++) {
      for (let x = barX; x < barX + w && x < S; x++) put(x, y, WHITE, 235)
    }
  }
  // mint chevron (right) — the "compile" arrow
  const cx = Math.round(S * 0.62)
  const cy = Math.round(S * 0.5)
  const arm = S * 0.16
  const thick = Math.max(1.1, S * 0.062)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      // distance to the two chevron segments
      const d = Math.min(
        distToSeg(x, y, cx - arm * 0.7, cy - arm, cx + arm * 0.5, cy),
        distToSeg(x, y, cx + arm * 0.5, cy, cx - arm * 0.7, cy + arm)
      )
      if (d <= thick / 2) {
        const a = Math.min(1, (thick / 2 - d) / 0.9) * 255
        put(x, y, MINT, a)
      }
    }
  }
  return px
}

function distToSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len2 = dx * dx + dy * dy || 1
  let t = ((px - x1) * dx + (py - y1) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  const qx = x1 + t * dx
  const qy = y1 + t * dy
  return Math.hypot(px - qx, py - qy)
}

/** Wraps BGRA pixels in a BITMAPINFOHEADER DIB (rows bottom-up, + AND mask). */
function dibForIco(px, size) {
  const header = Buffer.alloc(40)
  header.writeUInt32LE(40, 0)
  header.writeInt32LE(size, 4)
  header.writeInt32LE(size * 2, 8) // height doubled: XOR + AND masks
  header.writeUInt16LE(1, 12)
  header.writeUInt16LE(32, 14)
  header.writeUInt32LE(0, 16) // BI_RGB
  header.writeUInt32LE(size * size * 4, 20)

  const xor = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    const src = (size - 1 - y) * size * 4 // flip vertically
    px.subarray(src, src + size * 4).forEach((b, i) => {
      xor[y * size * 4 + i] = b
    })
  }
  // AND mask: one bit per pixel, rows padded to 4 bytes. Zeroed = opaque,
  // which is correct because the 32-bit alpha channel drives transparency.
  const maskRow = Math.ceil(size / 32) * 4
  const and = Buffer.alloc(maskRow * size)
  return Buffer.concat([header, xor, and])
}

const sizes = [16, 32, 48, 64, 128, 256]
const images = sizes.map((s) => dibForIco(renderFrame(s), s))

const dir = Buffer.alloc(6 + 16 * sizes.length)
dir.writeUInt16LE(0, 0)
dir.writeUInt16LE(1, 2) // type: icon
dir.writeUInt16LE(sizes.length, 4)
let offset = dir.length
sizes.forEach((s, i) => {
  const e = 6 + i * 16
  dir.writeUInt8(s === 256 ? 0 : s, e)
  dir.writeUInt8(s === 256 ? 0 : s, e + 1)
  dir.writeUInt8(0, e + 2)
  dir.writeUInt8(0, e + 3)
  dir.writeUInt16LE(1, e + 4)
  dir.writeUInt16LE(32, e + 6)
  dir.writeUInt32LE(images[i].length, e + 8)
  dir.writeUInt32LE(offset, e + 12)
  offset += images[i].length
})

const icoPath = path.join(outDir, 'clypcompiler.ico')
fs.writeFileSync(icoPath, Buffer.concat([dir, ...images]))
console.log(`Icon written: ${path.relative(root, icoPath)} (${sizes.join('/')} px)`)

// --- PNG icons for the web manifest (installable app) ----------------------
function crc32(buf) {
  let c
  const table = crc32.table || (crc32.table = (() => {
    const t = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[n] = c
    }
    return t
  })())
  c = -1
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

/** Encodes BGRA pixels (top-down) as an RGBA PNG. */
function encodePng(px, size) {
  const raw = Buffer.alloc(size * (size * 4 + 1))
  let o = 0
  for (let y = 0; y < size; y++) {
    raw[o++] = 0 // filter: none
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      raw[o++] = px[i + 2] // R  (source is BGRA)
      raw[o++] = px[i + 1] // G
      raw[o++] = px[i]     // B
      raw[o++] = px[i + 3] // A
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

for (const s of [192, 512]) {
  const p = path.join(publicDir, `icon-${s}.png`)
  fs.writeFileSync(p, encodePng(renderFrame(s), s))
  console.log(`Icon written: ${path.relative(root, p)}`)
}
fs.copyFileSync(icoPath, path.join(publicDir, 'favicon.ico'))
console.log('Icon written: public/favicon.ico')
