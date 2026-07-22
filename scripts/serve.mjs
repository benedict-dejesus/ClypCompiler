// ClypCompiler desktop server — a dependency-free static file server.
// Serving over http://127.0.0.1 (instead of opening the HTML from disk) gives
// the app a real origin, so IndexedDB autosave, the recent-projects list and
// downloads all behave exactly as they do online.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('\nClypCompiler has not been built yet.\nRun:  npm install  &&  npm run build\n')
  process.exit(1)
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.clyp': 'application/json; charset=utf-8'
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  let filePath = path.join(dist, urlPath === '/' ? 'index.html' : urlPath)
  // Never serve outside dist/.
  if (!filePath.startsWith(dist)) {
    res.writeHead(403).end('Forbidden')
    return
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(dist, 'index.html')
  }
  const type = TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' })
  fs.createReadStream(filePath).pipe(res)
})

/** Picks the first free port so a second launch never collides. */
function listen(port, attemptsLeft = 12) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) listen(port + 1, attemptsLeft - 1)
    else {
      console.error('Could not start the server:', err.message)
      process.exit(1)
    }
  })
  server.listen(port, '127.0.0.1', () => {
    const url = `http://127.0.0.1:${port}/`
    console.log('\n  ClypCompiler is running at ' + url)
    console.log('  Keep this window open while you work. Close it to quit.')
    open(url)
  })
}

/**
 * Chromium's --app flag opens a standalone window with no tab strip, address
 * bar or bookmarks — ClypCompiler then looks like a desktop application rather
 * than a web page. The default browser profile is deliberately kept (no
 * --user-data-dir), so saved projects are the same whether you open the app
 * window or browse to the address manually.
 */
function chromiumCandidates() {
  const { ProgramFiles, LOCALAPPDATA } = process.env
  const pf86 = process.env['ProgramFiles(x86)']
  if (process.platform === 'win32') {
    return [
      `${LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      `${ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
      `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
      `${ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${pf86}\\Microsoft\\Edge\\Application\\msedge.exe`,
      `${LOCALAPPDATA}\\Chromium\\Application\\chrome.exe`
    ].filter(Boolean)
  }
  if (process.platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium'
    ]
  }
  return ['/usr/bin/google-chrome', '/usr/bin/microsoft-edge', '/usr/bin/chromium', '/usr/bin/chromium-browser']
}

function open(url) {
  // Allow opting out: CLYP_APP_MODE=0 falls back to a normal browser tab.
  if (process.env.CLYP_APP_MODE !== '0') {
    for (const exe of chromiumCandidates()) {
      if (!fs.existsSync(exe)) continue
      try {
        spawn(exe, [`--app=${url}`, '--window-size=1440,900'], {
          detached: true,
          stdio: 'ignore'
        }).unref()
        console.log('  Opened in app mode.\n')
        return
      } catch {
        /* try the next candidate */
      }
    }
  }
  const cmd =
    process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]]
    : ['xdg-open', [url]]
  try {
    spawn(cmd[0], cmd[1], { detached: true, stdio: 'ignore' }).unref()
  } catch {
    console.log('  Open the address above in your browser.')
  }
}

listen(Number(process.env.CLYP_PORT) || 4780)
