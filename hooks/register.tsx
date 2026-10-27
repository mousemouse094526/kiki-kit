import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Folder, Tile } from '../types'
import { canDrawPictures, fileTile, IMAGE_FILE, pastedTiles, thumbOf } from './images'
import { blockCells, fitRow } from './layout'
import { registerTreeCommand, tree } from './tree'

// Pasting an image raises no prompt edit, so the draft is polled.
const POLL_MS = 200
// A branch switched outside the session (another terminal) shows within this.
const BRANCH_MS = 2000
// Files a turn read or wrote that the band keeps, newest last.
const MAX_TOUCHED = 4

// The folder the session started in, and the one it works in now; shown under the prompt.
const root = atom({ plugin: 'kiki-kit', key: 'root' } as const, null as Folder | null)
const cwd = atom({ plugin: 'kiki-kit', key: 'cwd' } as const, null as Folder | null)
// Images pasted into the draft, and image files the last turn read or wrote.
const pasted = atom({ plugin: 'kiki-kit', key: 'pasted' } as const, [] as Tile[])
const touched = atom({ plugin: 'kiki-kit', key: 'touched' } as const, [] as Tile[])

let pastedKey = ''
let statusText: string | undefined
let isChecking = false

// /Users/kiki/Works/x -> ~/Works/x
async function shorten($: EngineInterface, path: string): Promise<string> {
  const home = await $.env.get('HOME')
  if (home && (path === home || path.startsWith(`${home}/`))) return `~${path.slice(home.length)}`
  return path
}

// The folder's git branch; a detached HEAD gives its short sha, outside a repo nothing.
async function branchOf($: EngineInterface, folder: string): Promise<string | undefined> {
  const branch = await $.process.run(['git', '-C', folder, 'branch', '--show-current'])
  if (branch.exitCode !== 0) return undefined
  if (branch.stdout.trim() !== '') return branch.stdout.trim()
  const sha = await $.process.run(['git', '-C', folder, 'rev-parse', '--short', 'HEAD'])
  return sha.exitCode === 0 && sha.stdout.trim() !== '' ? `detached ${sha.stdout.trim()}` : undefined
}

// `session ~/a · main`, or `session ~/a · now ~/a/b · main` once the session has moved.
async function showFolder($: EngineInterface) {
  const start = await read($, root)
  const now = await read($, cwd)
  if (start === null) return setStatus($, undefined)
  const here = now ?? start
  const parts = [`session ${await shorten($, start)}`]
  if (here !== start) parts.push(`now ${await shorten($, here)}`)
  const branch = await branchOf($, here).catch(() => undefined)
  if (branch !== undefined) parts.push(branch)
  await setStatus($, parts.join(' · '))
}

// Pins the line only when it changed, so the poll costs no redraw.
async function setStatus($: EngineInterface, text: string | undefined) {
  if (text === statusText) return
  statusText = text
  await $.ui.status(text)
}

async function checkDraft($: EngineInterface) {
  if (isChecking) return
  isChecking = true
  try {
    const tiles = await pastedTiles($, (await $.prompt.read()).text)
    const key = JSON.stringify(tiles)
    if (key === pastedKey) return
    pastedKey = key
    await update($, pasted, () => tiles)
  } finally {
    isChecking = false
  }
}

async function remember($: EngineInterface, label: string, path: string | undefined) {
  if (path === undefined || !IMAGE_FILE.test(path)) return
  const absolute = path.startsWith('/') ? path : `${await $.session.cwd()}/${path}`
  const tile = await fileTile($, label, absolute)
  await update($, touched, list => [...list.filter(t => t.path !== absolute), tile].slice(-MAX_TOUCHED))
}

export const register: Register = on => {
  tree(on)

  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await update($, root, () => result.cwd)
    await update($, cwd, () => result.cwd)
    $.clock.every(POLL_MS, () => checkDraft($))
    $.clock.every(BRANCH_MS, () => showFolder($).catch(() => {}))
    // Each part on its own: one that fails leaves the others running.
    await showFolder($).catch(() => {})
    await registerTreeCommand($).catch(() => {})
    return result
  })

  // The band only watches: when one of its hooks fails, `.catch` lets the event go on as if it weren't here.
  on('classic.CwdChanged', async ($, e, next) => {
    // A failed write must not block the folder change itself.
    await update($, cwd, () => e.new_cwd)
      .then(() => showFolder($))
      .catch(() => {})
    return next(e)
  }).catch(($, e, next) => next(e))

  // A new prompt starts a new turn: the last turn's files leave the band.
  on('prompt.submit', async ($, e, next) => {
    await update($, touched, () => []).catch(() => {})
    return next(e)
  }).catch(($, e, next) => next(e))

  on('tool.call', { tool: 'Read' }, async ($, e, next) => {
    const result = await next(e)
    if (!result.isError) await remember($, 'read', e.file_path).catch(() => {})
    return result
  }).catch(($, e, next) => next(e))

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    const result = await next(e)
    if (!result.isError) await remember($, 'wrote', e.file_path).catch(() => {})
    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const tiles = [...(await read($, pasted)), ...(await read($, touched))]
    if (e.props.hasSurvey || tiles.length === 0) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    // Rows left for pictures: one path line per image comes first.
    const pictureRows = e.props.maxRows - tiles.length
    const drawn = tiles.filter(t => t.png !== null)
    const cells = e.surface === 'terminal' ? fitRow(drawn.map(t => t.size), pictureRows, e.props.bodyColumns) : []

    // Whatever other plugins and the engine draw here stays, below the band.
    const below = await next(e)

    let row = null
    if (e.surface === 'terminal' && cells.length > 0) {
      const { Image, Raster } = $.ui.resolve(e)
      const pictures = await canDrawPictures($)
      const items = []
      for (const [i, t] of drawn.slice(0, cells.length).entries()) {
        const { columns, rows } = cells[i] ?? { columns: 4, rows: 1 }
        const thumb = pictures ? null : await thumbOf($, t.png!)
        items.push(
          <Box key={`tile-${t.key}`} flexDirection="column" alignItems="center" borderStyle="round" borderDimColor>
            {thumb ? (
              <Raster key={`blocks-${t.key}`} columns={columns} rows={rows} cells={blockCells(thumb, columns, rows)} />
            ) : (
              <Image key={`image-${t.key}`} source={{ file: t.png!, format: 'png' }} columns={columns} rows={rows} alt={t.label} />
            )}
            <Text dimColor>{t.label}</Text>
          </Box>,
        )
      }
      const hidden = drawn.length - cells.length
      row = (
        <Box flexDirection="row" columnGap={1}>
          {items}
          {hidden > 0 && <Text dimColor>+{hidden}</Text>}
        </Box>
      )
    }

    return (
      <Box flexDirection="column">
        {row}
        {tiles.map(t => (
          <Box key={`path-${t.key}`}>
            <Text dimColor>{t.label} </Text>
            <Text>{t.path}</Text>
          </Box>
        ))}
        {below}
      </Box>
    )
  })
}
