import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'

const ROOT = '/Users/kiki/app'
const FLAGS = '/Users/kiki/.hermes/claude-flags.json'

// A session in ROOT with a board; `auto` is the Hermes switch, `block` a settings Stop hook's
// answer. Returns the commands the mod ran, in order, as typed.
function engine(on: On, { auto = true, board = true, block = undefined as string | undefined } = {}) {
  const ran: string[] = []
  on('env.get', (_, e) => ({ value: e.name === 'HOME' ? '/Users/kiki' : undefined }))
  on('fs.read', (_, e) => {
    if (e.path !== FLAGS) throw new Error('ENOENT')
    return { value: JSON.stringify({ notify: true, auto }) }
  })
  on('fs.exists', (_, e) => ({ value: board && e.path === `${ROOT}/docs/progress/board.md` }))
  on('command.list', () => ({
    value: [
      { name: 'clear', description: '', source: 'builtin' },
      { name: 'kiki-kit:warroom-build', description: '', source: 'plugin', plugin: 'kiki-kit' },
    ],
  }))
  on('command.run', (_, e) => {
    ran.push(`/${e.command}${e.args ? ` ${e.args}` : ''}`)
    return { text: '' }
  })
  on('classic.Stop', () => (block === undefined ? {} : { block }))
  return ran
}

const stop = (message: string) => ({ cwd: ROOT, stop_hook_active: false, last_assistant_message: message })

test('[auto:fresh] clears the session and runs the next ticket', async ($, on) => {
  const clock = mock.clock(on)
  const ran = engine(on)
  await $.classic.Stop(stop('Ticket 01 done.\n\n[auto:fresh] /warroom-build user-contact 02'))
  await clock.advance(10)

  expect(ran).toEqual(['/clear', '/kiki-kit:warroom-build user-contact 02'])
})

test('nothing runs while auto mode is off', async ($, on) => {
  const clock = mock.clock(on)
  const ran = engine(on, { auto: false })
  await $.classic.Stop(stop('[auto:fresh] /warroom-build user-contact 02'))
  await clock.advance(10)

  expect(ran).toEqual([])
})

test('nothing runs in a project without a board', async ($, on) => {
  const clock = mock.clock(on)
  const ran = engine(on, { board: false })
  await $.classic.Stop(stop('[auto:fresh] /warroom-build user-contact 02'))
  await clock.advance(10)

  expect(ran).toEqual([])
})

test('nothing runs when a settings hook keeps the turn going', async ($, on) => {
  const clock = mock.clock(on)
  const ran = engine(on, { block: 'carry on' })
  await $.classic.Stop(stop('[auto:fresh] /warroom-build user-contact 02'))
  await clock.advance(10)

  expect(ran).toEqual([])
})

test('a reply without the marker, or naming an unknown command, runs nothing', async ($, on) => {
  const clock = mock.clock(on)
  const ran = engine(on)
  await $.classic.Stop(stop('Next: /warroom-build user-contact 02'))
  await $.classic.Stop(stop('[auto:fresh] /nope 02'))
  await clock.advance(10)

  expect(ran).toEqual([])
})
