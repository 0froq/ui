/**
 * The token contract. Every style defines every one of these as `--ui-<name>` on its scope
 * class (`.ui-paper`, `.ui-flat`, `.ui-term`), and components only ever read these variables.
 * `pnpm check:tokens` fails when a style leaves one out.
 */
export const TOKENS = [
  'bg',
  'fg',
  'muted',
  'faint',
  'line',
  'accent',
  'font-display',
  'font-text',
  'font-meta',
  'ease',
  'dur',
  'radius',
] as const

export type TokenName = (typeof TOKENS)[number]

export const STYLES = ['paper', 'flat', 'term'] as const

export type StyleName = (typeof STYLES)[number]

export function tokenVar(name: TokenName): string {
  return `--ui-${name}`
}

export function scopeClass(style: StyleName): string {
  return `ui-${style}`
}
