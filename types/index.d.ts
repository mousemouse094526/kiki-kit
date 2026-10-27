export type Folder = string

declare module 'claude-code' {
  interface PluginState {
    'kiki-kit': { cwd: Folder | null }
  }
}
