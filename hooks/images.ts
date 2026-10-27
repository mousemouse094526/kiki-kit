import type { EngineInterface } from 'claude-code'

import type { Tile } from '../types'
import { drawsPictures, imageNumbers, pngSize } from './layout'
import { decodeThumb } from './png'
import type { Thumb } from './png'

export const IMAGE_FILE = /\.(png|jpe?g|gif|webp|heic|heif|tiff?|bmp)$/i

let tmpRoot: string | undefined
let found: { sessionId: string; dir: string } | undefined
let pictures: boolean | undefined
const sizes = new Map<string, Tile['size']>()
const unconvertible = new Set<string>()
const thumbs = new Map<string, Thumb | null>()

// Claude Code doesn't tell mods whether its Image draws a picture, so go by the environment it decides from.
export async function canDrawPictures($: EngineInterface): Promise<boolean> {
  if (pictures === undefined) {
    const env = {
      TERM: await $.env.get('TERM'),
      TERM_PROGRAM: await $.env.get('TERM_PROGRAM'),
      TMUX: await $.env.get('TMUX'),
      STY: await $.env.get('STY'),
      KITTY_WINDOW_ID: await $.env.get('KITTY_WINDOW_ID'),
      GHOSTTY_RESOURCES_DIR: await $.env.get('GHOSTTY_RESOURCES_DIR'),
      CLAUDE_CODE_FORCE_TERMINAL_IMAGES: await $.env.get('CLAUDE_CODE_FORCE_TERMINAL_IMAGES'),
      CLAUDE_CODE_SESSION_KIND: await $.env.get('CLAUDE_CODE_SESSION_KIND'),
      CLAUDE_IMAGE_VIEW_RENDERER: await $.env.get('CLAUDE_IMAGE_VIEW_RENDERER'),
    }
    pictures = drawsPictures(env)
  }
  return pictures
}

// Claude Code keeps its temp files in <CLAUDE_CODE_TMPDIR or /tmp>/claude-<uid>, <TEMP>\claude on Windows.
async function tempRoot($: EngineInterface): Promise<string | undefined> {
  if (tmpRoot !== undefined) return tmpRoot
  const fromEnv = await $.env.get('CLAUDE_CODE_TMPDIR')
  if ((await $.env.get('OS')) === 'Windows_NT') {
    const base = fromEnv ?? (await $.env.get('TEMP'))
    tmpRoot = base === undefined ? undefined : `${base.replace(/[\\/]+$/, '')}/claude`
  } else {
    const uid = (await $.process.run(['id', '-u'])).stdout.trim()
    tmpRoot = `${(fromEnv ?? '/tmp').replace(/\/+$/, '')}/claude-${uid}`
  }
  return tmpRoot
}

// Pastes are cached as <tmp>/<project>/<session>/images/<n>.<ext>; the project folder is found by session id.
async function pastedDir($: EngineInterface): Promise<string | undefined> {
  const sessionId = await $.session.id()
  if (found?.sessionId === sessionId) return found.dir
  const root = await tempRoot($)
  if (root === undefined) return undefined
  for (const entry of await $.fs.list(root).catch(() => [])) {
    const dir = `${root}/${entry.name}/${sessionId}/images`
    if (entry.kind === 'dir' && (await $.fs.exists(dir))) {
      found = { sessionId, dir }
      return dir
    }
  }
  return undefined
}

// The terminal only draws PNG, so anything else is converted once with sips (macOS) to `out`.
async function drawable($: EngineInterface, source: string, out: string): Promise<string | null> {
  if (/\.png$/i.test(source)) return source
  if (await $.fs.exists(out)) return out
  if (unconvertible.has(source)) return null
  const { exitCode } = await $.process
    .run(['sips', '-s', 'format', 'png', '-Z', '800', source, '--out', out])
    .catch(() => ({ exitCode: 1 }))
  if (exitCode === 0) return out
  unconvertible.add(source)
  return null
}

async function sizeOf($: EngineInterface, png: string): Promise<Tile['size']> {
  if (!sizes.has(png)) {
    const base64 = await $.fs.read(png, { as: 'bytes' }).then(bytes => bytes.base64, () => undefined)
    if (base64 === undefined) return null
    sizes.set(png, pngSize(base64))
  }
  return sizes.get(png) ?? null
}

async function tile($: EngineInterface, key: string, label: string, path: string, out: string): Promise<Tile> {
  const png = await drawable($, path, out)
  return { key, label, path, png, size: png === null ? null : await sizeOf($, png) }
}

/** The images a prompt draft references by `[Image #n]`, in order. */
export async function pastedTiles($: EngineInterface, draft: string): Promise<Tile[]> {
  const numbers = imageNumbers(draft)
  if (numbers.length === 0) return []
  const dir = await pastedDir($)
  const files = dir === undefined ? [] : await $.fs.list(dir).catch(() => [])
  const tiles: Tile[] = []
  for (const n of numbers) {
    const file = files.find(entry => entry.kind === 'file' && entry.name.startsWith(`${n}.`))
    if (dir === undefined || file === undefined) continue
    const out = `${dir.replace(/\/images$/, '')}/kiki-kit-${n}.png`
    tiles.push(await tile($, `paste-${n}`, `#${n}`, `${dir}/${file.name}`, out))
  }
  return tiles
}

/** A tile for an image file a tool read or wrote; `path` is absolute. */
export async function fileTile($: EngineInterface, label: string, path: string): Promise<Tile> {
  const root = (await tempRoot($)) ?? '/tmp'
  const name = path.replace(/[^A-Za-z0-9]+/g, '-').slice(-80)
  return tile($, `${label}-${path}`, label, path, `${root}/kiki-kit-${await $.session.id()}-${name}.png`)
}

/** A small decoded copy of `png`, for terminals that get colored half blocks instead of pictures. */
export async function thumbOf($: EngineInterface, png: string): Promise<Thumb | null> {
  if (!thumbs.has(png)) {
    const base64 = await $.fs.read(png, { as: 'bytes' }).then(bytes => bytes.base64, () => undefined)
    thumbs.set(png, base64 === undefined ? null : decodeThumb(Uint8Array.from(atob(base64), char => char.charCodeAt(0))))
  }
  return thumbs.get(png) ?? null
}
