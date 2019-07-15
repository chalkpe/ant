import fs from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import go from './go.mjs'

const valid = s => s => s.name && s.path && s.rule

export default async function load (dir = homedir()) {
  const tg = join(dir, 'ant') 
  const rc = join(dir, '.antrc')

  const def = {
    sources: [],
    target: {
      path: tg,
      name: 'default',
      rule: '[YYYY]/[MM]-[DD]/[name]',
    }
  }

  const [str, err] = await go(fs.promises.readFile(rc, 'utf8'))
  if (err || !str) return def

  const [obj, errr] = await go(_ => JSON.parse(str))
  if (errr || !obj) return def

  const {sources, target} = obj
  if (!target || !valid(target)) return def
  if (!Array.isArray(sources) || !sources.every(valid)) return def

  return { sources, target }
}
