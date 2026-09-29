import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { scopeClass, STYLES, TOKENS, tokenVar } from '../src/core/contract'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
const problems: string[] = []

for (const style of STYLES) {
  const file = join(root, style, 'tokens.css')
  if (!existsSync(file)) {
    problems.push(`${style}: missing ${file}`)
    continue
  }
  const css = readFileSync(file, 'utf8')
  if (!css.includes(`.${scopeClass(style)}`))
    problems.push(`${style}: no .${scopeClass(style)} scope`)
  for (const token of TOKENS) {
    if (!new RegExp(`${tokenVar(token)}\\s*:`).test(css))
      problems.push(`${style}: missing ${tokenVar(token)}`)
  }
}

if (problems.length) {
  console.error(problems.join('\n'))
  process.exitCode = 1
}
else {
  process.stdout.write(`${STYLES.length} styles define all ${TOKENS.length} tokens\n`)
}
