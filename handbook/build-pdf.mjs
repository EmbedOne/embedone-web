// Renders handbook.html to public/EmbedOne-Handbook-<version>.pdf with headless Chrome.
//
// Uses the DevTools protocol directly (Node's built-in WebSocket and fetch) rather than
// Chrome's --print-to-pdf flag, because only the protocol can add page-number footers.
//
//   node handbook/build-pdf.mjs            (Chrome found automatically on Windows)
//   CHROME=/path/to/chrome node handbook/build-pdf.mjs
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const VERSION = '1.0.0'
const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, 'handbook.html')
const output = resolve(here, '..', 'public', `EmbedOne-Handbook-${VERSION}.pdf`)

const chrome = process.env.CHROME || [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(existsSync)
if (!chrome) throw new Error('Chrome or Edge not found; set CHROME')

const profile = mkdtempSync(join(tmpdir(), 'embedone-handbook-'))
const browser = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-first-run',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

try {
  // Chrome writes the port it chose into DevToolsActivePort.
  const portFile = join(profile, 'DevToolsActivePort')
  for (let i = 0; i < 100 && !existsSync(portFile); i++) await new Promise(r => setTimeout(r, 100))
  const port = readFileSync(portFile, 'utf8').split('\n')[0].trim()
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json()

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail })
  let id = 0
  const pending = new Map(), waiters = []
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    if (msg.id && pending.has(msg.id)) {
      const { ok, fail } = pending.get(msg.id); pending.delete(msg.id)
      msg.error ? fail(new Error(msg.error.message)) : ok(msg.result)
    } else if (msg.method) waiters.filter(w => w.method === msg.method).forEach(w => w.ok())
  }
  const send = (method, params = {}) => new Promise((ok, fail) => {
    pending.set(++id, { ok, fail }); ws.send(JSON.stringify({ id, method, params }))
  })
  const once = method => new Promise(ok => waiters.push({ method, ok }))

  await send('Page.enable')
  const loaded = once('Page.loadEventFired')
  await send('Page.navigate', { url: pathToFileURL(source).href })
  await loaded
  await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true })

  const footer = `<div style="width:100%;padding:0 17mm;font:8px 'Segoe UI',Arial,sans-serif;color:#5b6470;
    display:flex;justify-content:space-between"><span>EmbedOne IDE ${VERSION} Handbook</span>
    <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`
  const { data } = await send('Page.printToPDF', {
    printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>', footerTemplate: footer,
  })
  writeFileSync(output, Buffer.from(data, 'base64'))
  ws.close()
  console.log(`Wrote ${output}`)
} finally {
  browser.kill()
  await new Promise(r => setTimeout(r, 500))
  rmSync(profile, { recursive: true, force: true })
}
