import { atom, read, update } from 'claude-code'
import type { EngineInterface, FsEntry, On, RenderElement } from 'claude-code'

import type { Folder } from '../types'

const PANE = 'kiki-tree'
const COMMAND = 'tree'
// Never listed: version control and installed packages.
const SKIP = new Set(['.git', 'node_modules'])
// Entries one folder shows before a `… N more` row.
const MAX_ENTRIES = 200
// Tools whose call may add, move or remove files.
const CHANGES_FILES = new Set(['Write', 'Edit', 'NotebookEdit', 'Bash'])

// The folder the session started in; register.tsx writes it.
const sessionRoot = atom({ plugin: 'kiki-kit', key: 'root' } as const, null as Folder | null)
// Folders the person expanded, by absolute path.
const expanded = atom({ plugin: 'kiki-kit', key: 'treeOpen' } as const, [] as Folder[])
// Bumped when files may have changed; the pane reads it, so a bump redraws it from fresh listings.
const version = atom({ plugin: 'kiki-kit', key: 'treeVersion' } as const, 0)

const listings = new Map<Folder, FsEntry[]>()
let listedAt = -1

// A folder's entries, folders first, each group by name; listed once per version.
async function entriesOf($: EngineInterface, dir: Folder, at: number): Promise<FsEntry[]> {
  if (at !== listedAt) {
    listings.clear()
    listedAt = at
  }
  let entries = listings.get(dir)
  if (entries === undefined) {
    entries = (await $.fs.list(dir).catch(() => []))
      .filter(entry => !SKIP.has(entry.name))
      .sort((a, b) =>
        (a.kind === 'dir') === (b.kind === 'dir') ? a.name.localeCompare(b.name) : a.kind === 'dir' ? -1 : 1,
      )
    listings.set(dir, entries)
  }
  return entries
}

async function refresh($: EngineInterface) {
  await update($, version, at => at + 1)
}

/** Adds `/tree`; called once the session has started. */
export async function registerTreeCommand($: EngineInterface) {
  await $.command.register({ name: COMMAND, description: 'Show the folders of the session folder in a pane' })
}

/** `/tree`: a pane listing the session folder, its folders expanding and collapsing on a press. */
export function tree(on: On) {
  on('command.run', { command: COMMAND }, async $ => {
    await refresh($)
    await $.ui.open({ id: PANE, title: 'Folders' })
    return { text: 'Folder tree opened.' }
  })

  on('tool.call', async ($, e, next) => {
    const result = await next(e)
    if (CHANGES_FILES.has(e.tool)) await refresh($).catch(() => {})
    return result
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const root = await read($, sessionRoot)
    if (root === null) return <Text dimColor>No session folder yet.</Text>

    const at = await read($, version)
    const open = new Set(await read($, expanded))
    const toggle = (path: Folder) =>
      update($, expanded, list => (list.includes(path) ? list.filter(p => p !== path) : [...list, path]))

    const rows: RenderElement[] = []
    const walk = async (dir: Folder, depth: number) => {
      const entries = await entriesOf($, dir, at)
      const indent = '  '.repeat(depth)
      for (const entry of entries.slice(0, MAX_ENTRIES)) {
        const path = `${dir}/${entry.name}`
        // A linked folder isn't expanded, so a link back up can't loop.
        if (entry.kind === 'dir' && !entry.isLink) {
          const isOpen = open.has(path)
          rows.push(
            <Button key={path} plain onPress={() => toggle(path)}>
              {indent}{isOpen ? '▾' : '▸'} {entry.name}/
            </Button>,
          )
          if (isOpen) await walk(path, depth + 1)
        } else {
          rows.push(<Text dimColor wrap="truncate">{indent}  {entry.name}</Text>)
        }
      }
      if (entries.length > MAX_ENTRIES) rows.push(<Text dimColor>{indent}  … {entries.length - MAX_ENTRIES} more</Text>)
    }
    await walk(root, 0)

    return (
      <Box flexDirection="column">
        <Box>
          <Text bold wrap="truncate-start">{root} </Text>
          <Button key="refresh" label="Refresh" onPress={() => refresh($)} />
        </Box>
        {rows.length === 0 ? <Text dimColor>Empty folder.</Text> : rows}
      </Box>
    )
  })
}
