import { expect, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import type { Engine } from 'claude-code/testing'

const PANE = {
  plugin: 'kiki-kit',
  component: 'Pane',
  requestId: 'kiki-tree',
  props: {
    title: 'Folders',
    isFocused: true,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const ROOT = '/Users/kiki/app'

const entry = (name: string, kind: 'dir' | 'file') => ({ name, kind, size: 0, mtimeMs: 0, isLink: false })

// A session in ROOT over a small project; `disk` is what each folder lists, and a test may change it.
function engine(on: On) {
  const disk: Record<string, ReturnType<typeof entry>[]> = {
    [ROOT]: [entry('README.md', 'file'), entry('src', 'dir'), entry('.git', 'dir'), entry('node_modules', 'dir'), entry('docs', 'dir')],
    [`${ROOT}/src`]: [entry('main.ts', 'file'), entry('lib', 'dir')],
    [`${ROOT}/docs`]: [],
  }
  const opened: string[] = []
  on('env.get', (_, e) => ({ value: e.name === 'HOME' ? '/Users/kiki' : undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('session.id', () => ({ value: 'S1' }))
  on('process.run', () => ({ value: { exitCode: 0, stdout: '501\n', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }))
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  on('fs.exists', () => ({ value: false }))
  on('fs.list', (_, e) => ({ value: disk[e.path] ?? [] }))
  on('ui.status', () => ({ value: undefined }))
  on('command.register', () => ({ value: { command: 'tree' } }))
  on('ui.open', (_, e) => {
    opened.push(e.id)
    return { value: { isPlaced: true } }
  })
  on('tool.call', () => ({ result: {} }))
  return { disk, opened }
}

async function start($: Engine) {
  await $.session.start({ cwd: ROOT, surface: 'terminal', isInteractive: true })
}

test('/tree opens the pane', async ($, on) => {
  const { opened } = engine(on)
  await start($)

  const ran = await $.command.run({ command: 'tree', args: '', origin: { kind: 'composer' }, presentation: { isFullscreen: true, columns: 120 } })
  expect(ran.text).toBe('Folder tree opened.')
  expect(opened).toEqual(['kiki-tree'])
})

test('the pane lists folders first and skips .git and node_modules, on every surface', async ($, on) => {
  engine(on)
  await start($)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    const buttons = (await ui.findAll({ type: 'Button' })).map(b => b.key)
    expect(buttons).toEqual(['refresh', `${ROOT}/docs`, `${ROOT}/src`])
    expect((await ui.find({ type: 'Text', text: /README/ }))?.text).toBe('  README.md')
    expect(await ui.find({ text: /node_modules|\.git/ })).toBeUndefined()
    await ui.unmount()
  }
})

test('a folder expands and collapses on a press', async ($, on) => {
  engine(on)
  await start($)
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  await ui.press({ key: `${ROOT}/src` })
  expect((await ui.find({ type: 'Text', text: /main/ }))?.text).toBe('    main.ts')
  expect(await ui.find({ key: `${ROOT}/src/lib` })).toBeDefined()

  await ui.press({ key: `${ROOT}/src` })
  expect(await ui.find({ type: 'Text', text: /main/ })).toBeUndefined()
  await ui.unmount()
})

test('the pane refreshes after a tool changes files', async ($, on) => {
  const { disk } = engine(on)
  await start($)
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ text: /new\.md/ })).toBeUndefined()

  disk[ROOT] = [...disk[ROOT]!, entry('new.md', 'file')]
  await $.tool.call({ tool: 'Write', file_path: `${ROOT}/new.md`, content: '' })

  expect((await ui.find({ type: 'Text', text: /new\.md/ }))?.text).toBe('  new.md')
  await ui.unmount()
})
