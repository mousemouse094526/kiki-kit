import type { EngineInterface, On } from 'claude-code'

// Board auto mode (hermes-setup's `/claude_auto`): a reply that ends with
// `[auto:fresh] /warroom-build {slug} {NN}` goes on in a fresh session in this same window.
const FRESH = /^[ \t]*\[auto:fresh\][ \t]*\/([\w:.-]+)(?:[ \t]+(.*?))?[ \t]*$/m
const BOARD = 'docs/progress/board.md'

// The owner's switch lives in Hermes; auto mode only runs where the project has a board.
async function isAutoOn($: EngineInterface, folder: string): Promise<boolean> {
  const hermes = (await $.env.get('HERMES_HOME')) ?? `${await $.env.get('HOME')}/.hermes`
  const flags = JSON.parse(await $.fs.read(`${hermes}/claude-flags.json`).catch(() => '{}'))
  return flags?.auto === true && (await $.fs.exists(`${folder}/${BOARD}`))
}

// A plugin's command runs by its plain name too: `warroom-build` is `kiki-kit:warroom-build`.
async function commandNamed($: EngineInterface, name: string): Promise<string | undefined> {
  const names = (await $.command.list()).map(c => c.name)
  return names.find(n => n === name) ?? names.find(n => n.endsWith(`:${name}`))
}

export function fresh(on: On) {
  on('classic.Stop', async ($, e, next) => {
    const result = await next(e)
    // A settings hook that keeps the turn going (or stops the session) wins.
    if (result.block !== undefined || result.preventContinuation) return result
    const found = FRESH.exec(e.last_assistant_message ?? '')
    if (found === null || !(await isAutoOn($, e.cwd))) return result
    const command = await commandNamed($, found[1]!)
    if (command === undefined) return result
    // A command run inside a hook the turn waits on is refused, so both wait for the turn to end.
    $.clock.after(0, () => {
      $.command.run({ command: 'clear' })
        .then(() => $.command.run({ command, args: found[2] ?? '' }))
        .catch(() => {})
    })
    return result
  }).catch(($, e, next) => next(e))
}
