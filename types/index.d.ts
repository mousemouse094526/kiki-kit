export type Folder = string

/** One image in the band: a paste, or a file Claude read or wrote. */
export type Tile = {
  key: string
  /** `#1` for a paste, `read` or `wrote` for a file a tool touched. */
  label: string
  /** Absolute path of the image as it is on disk, for another app to open. */
  path: string
  /** Absolute path of a PNG to draw (the file itself, or a converted copy); null when there is none. */
  png: string | null
  /** Pixel size of `png`; null when unknown, and the tile takes a default shape. */
  size: { width: number; height: number } | null
}

declare module 'claude-code' {
  interface PluginState {
    'kiki-kit': { root: Folder | null; cwd: Folder | null; pasted: Tile[]; touched: Tile[] }
  }
}
