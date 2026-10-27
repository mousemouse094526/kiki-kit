import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'kiki-kit',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 60,
    scroll: { offset: 0, bodyRows: 9 },
    view: {},
  },
} as const

test('the band shows the working folder, on every surface', async ($, on) => {
  on('env.get', () => ({ value: '/Users/kiki' }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/Users/kiki/Works/kiki-kit', surface: 'terminal', isInteractive: true })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...BAND, surface })
    const path = await ui.find({ type: 'Text', text: /Works/ })
    expect(path?.text).toBe('~/Works/kiki-kit')
    await ui.unmount()
  }
})

test('the band follows a folder change', async ($, on) => {
  on('env.get', () => ({ value: '/Users/kiki' }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  on('classic.CwdChanged', () => ({}))

  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })
  await $.classic.CwdChanged({ old_cwd: '/Users/kiki/a', new_cwd: '/opt/b' })

  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /\/opt/ }))?.text).toBe('/opt/b')
  await ui.unmount()
})

test('the band yields to a survey', async ($, on) => {
  on('env.get', () => ({ value: '/Users/kiki' }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)
    return <Text>engine</Text>
  })

  await $.session.start({ cwd: '/Users/kiki/a', surface: 'terminal', isInteractive: true })

  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, hasSurvey: true }, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})
