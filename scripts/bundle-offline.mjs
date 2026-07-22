// Inlines the offline build into a single self-contained HTML file.
// Result: ClypCompiler.html — double-click to run the full builder offline.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'dist-offline')
const target = path.join(root, 'ClypCompiler.html')

const js = fs.readFileSync(path.join(outDir, 'app.js'), 'utf8')
const cssPath = path.join(outDir, 'app.css')
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : ''

// `</script>` anywhere inside the bundle would close the tag early.
const safeJs = js.replace(/<\/script>/gi, '<\\/script>')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ClypCompiler</title>
<meta name="description" content="Compile clypped blocks into SCORM and HTML5 e-learning courses.">
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${safeJs}</script>
</body>
</html>
`

fs.writeFileSync(target, html)
const kb = Math.round(Buffer.byteLength(html) / 1024)
console.log(`ClypCompiler.html written (${kb} KB) — open it directly, no server required.`)
