import fs from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import go from './go.mjs'

const isValidSource = (s) => s.name && s.path && s.rule
const isValidTarget = (t) => t.path && t.rule

export default async function load(dir = homedir()) {
  const tg = join(dir, 'ant')
  const rc = join(dir, '.antrc')

  const def = {
    sources: [],
    target: {
      path: tg,
      name: 'default',
      rule: '[YYYY]/[MM]-[DD]/[name]',
    },
  }

  const [str, err] = await go(fs.promises.readFile(rc, 'utf-8'))
  if (err || !str) return def

  const [obj, errr] = await go(() => JSON.parse(str))
  if (errr || !obj) return def

  const { sources, target } = obj
  if (!target || !isValidTarget(target)) return def
  if (!Array.isArray(sources) || !sources.every(isValidSource)) return def

  return { sources, target }
}
