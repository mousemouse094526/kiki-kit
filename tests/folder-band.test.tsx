import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import type { Engine } from 'claude-code/testing'

const BAND = {
  plugin: 'kiki-kit',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 30,
    bodyColumns: 80,
    scroll: { offset: 0, bodyRows: 29 },
    view: {},
  },
} as const

// A PNG's signature and IHDR, 4 x 2 pixels: enough for its size.
const PNG_HEAD = btoa(String.fromCharCode(
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52,
  0, 0, 0, 4, 0, 0, 0, 2,
))

const TMP = '/tmp/claude-501'
const PASTES = `${TMP}/-Users-kiki-a/S1/images`

const entry = (name: string, kind: 'dir' | 'file') => ({ name, kind, size: 0, mtimeMs: 0, isLink: false })

// The world beneath the mod: a home folder, a session, one pasted PNG, any PNG readable.
// Returns the status line under the prompt, as the mod last pinned it.
function engine(on: On, draft = '', branch = 'main') {
  const line = { text: undefined as string | undefined }
  on('env.get', (_, e) => ({ value: e.name === 'HOME' ? '/Users/kiki' : undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.id', () => ({ value: 'S1' }))
  on('session.cwd', () => ({ value: '/Users/kiki/a' }))
  on('process.run', (_, e) => {
    const isGit = e.argv[0] === 'git'
    const stdout = !isGit ? '501\n' : e.argv.includes('rev-parse') ? 'abc1234\n' : `${branch}\n`
    const exitCode = isGit && branch === 'none' ? 128 : 0
    return { value: { exitCode, stdout, stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  on('prompt.read', () => ({ value: { text: draft, cursor: draft.length } }))
  on('fs.exists', (_, e) => ({ value: e.path === PASTES }))
  on('fs.list', (_, e) => ({
    value: e.path === TMP ? [entry('-Users-kiki-a', 'dir')] : e.path === PASTES ? [entry('1.png', 'file')] : [],
  }))
  on('fs.read', () => ({ value: { base64: PNG_HEAD } }))
  on('tool.call', () => ({ result: {} }))
  on('prompt.submit', (_, e) => ({ text: e.text }))
  on('classic.CwdChanged', () => ({}))
  on('ui.status', (_, e) => {
    line.text = e.text
    return { value: undefined }
  })
  on('command.register', () => ({ value: { command: 'tree' } }))
  return line
}

// The engine draws nothing of its own above the prompt.
function nothingBeneath(on: On) {
  on('ui.render', ($, e) => {
    const { Box } = $.ui.resolve(e)
    return <Box />
  })
}

async function textOn($: Engine, surface: 'terminal' | 'desktop', text: RegExp) {
  const ui = await $.ui.mount({ ...BAND, surface })
  const found = await ui.find({ type: 'Text', text })
  await ui.unmount()
  return found?.text
}

test('the session folder shows under the prompt', async ($, on) => {
  const line = engine(on)
  await $.session.start({ cwd: '/Users/kiki/Works/kiki-kit', surface: 'terminal', isInteractive: true })

  expect(line.text).toBe('session ~/Works/kiki-kit · main')
})

test('a detached HEAD shows its short sha', async ($, on) => {
  const line = engine(on, '', '')
  await $.session.start({ cwd: '/Users/kiki/Works/kiki-kit', surface: 'terminal', isInteractive: true })

  expect(line.text).toBe('session ~/Works/kiki-kit · detached abc1234')
})

test('outside a git repo there is no branch', async ($, on) => {
  const line = engine(on, '', 'none')
  await $.session.start({ cwd: '/Users/kiki/Works/kiki-kit', surface: 'terminal', isInteractive: true })

  expect(line.text).toBe('session ~/Works/kiki-kit')
})

test('a folder change shows beside the session folder', async ($, on) => {
  const line = engine(on)
  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })
  await $.classic.CwdChanged({ old_cwd: '/Users/kiki/a', new_cwd: '/opt/b' })

  expect(line.text).toBe('session ~/a · now /opt/b · main')
})

test('a pasted image shows its absolute path', async ($, on) => {
  const clock = mock.clock(on)
  engine(on, 'look [Image #1]')
  nothingBeneath(on)
  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })
  await clock.advance(250)

  for (const surface of ['terminal', 'desktop'] as const) {
    expect(await textOn($, surface, /1\.png/)).toBe(`${PASTES}/1.png`)
  }

  // The terminal draws the picture above the path, labelled with its tag's number.
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Image' }))?.props.alt).toBe('#1')
  await ui.unmount()
})

test('an image Claude reads or writes shows its absolute path until the next prompt', async ($, on) => {
  engine(on)
  nothingBeneath(on)
  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })
  await $.tool.call({ tool: 'Read', file_path: '/Users/kiki/a/shot.png' })
  await $.tool.call({ tool: 'Write', file_path: 'out/logo.png', content: '' })
  await $.tool.call({ tool: 'Read', file_path: '/Users/kiki/a/notes.md' })

  expect(await textOn($, 'terminal', /shot/)).toBe('/Users/kiki/a/shot.png')
  expect(await textOn($, 'terminal', /logo/)).toBe('/Users/kiki/a/out/logo.png')
  expect(await textOn($, 'terminal', /notes/)).toBeUndefined()

  await $.prompt.submit({ text: 'next', wait: false, origin: { kind: 'composer' } })
  expect(await textOn($, 'terminal', /shot/)).toBeUndefined()
})

test('the band yields to a survey', async ($, on) => {
  engine(on)
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })
  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })

  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, hasSurvey: true }, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

test('the band keeps what is drawn beneath it', async ($, on) => {
  engine(on)
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>other plugin</Text>
  })
  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })
  await $.tool.call({ tool: 'Read', file_path: '/Users/kiki/a/shot.png' })

  expect(await textOn($, 'terminal', /other plugin/)).toBe('other plugin')
  expect(await textOn($, 'terminal', /shot/)).toBe('/Users/kiki/a/shot.png')
})
