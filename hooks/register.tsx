import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Folder } from '../types'

// The session's working folder, shown in a band above the prompt.
const cwd = atom({ plugin: 'kiki-kit', key: 'cwd' } as const, null as Folder | null)

// /Users/kiki/Works/x -> ~/Works/x
async function shorten($: EngineInterface, path: string): Promise<string> {
  const home = await $.env.get('HOME')
  if (home && (path === home || path.startsWith(`${home}/`))) return `~${path.slice(home.length)}`
  return path
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await update($, cwd, () => result.cwd)
    return result
  })

  on('classic.CwdChanged', async ($, e, next) => {
    // A failed write must not block the folder change itself.
    await update($, cwd, () => e.new_cwd).catch(() => {})
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const path = await read($, cwd)
    if (e.props.hasSurvey || path === null) return next(e)

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box>
        <Text dimColor>folder </Text>
        <Text bold wrap="truncate-start">{await shorten($, path)}</Text>
      </Box>
    )
  })
}
