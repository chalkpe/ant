import fs from 'fs'
import { homedir } from 'os'
import { normalize, join } from 'path'
import go from './go.mjs'

const list = ['YYYY', 'YY', 'MM', 'DD', 'HH', 'mm', 'ss', 'SS', 'SSS']

function parseRules(rules) {
  return rules.map((rule) => {
    const regex = list.reduce((str, k) => str.replace(`[${k}]`, `(?<${k}>${'\\d'.repeat(k.length)})`), rule)
    return new RegExp(regex.replace('.', '\\.'))
  })
}

async function getFileCreatedAt(path) {
  const [stats, err] = await go(fs.promises.stat(path))
  if (err) return {}

  return {
    YYYY: String(stats.ctime.getFullYear()),
    YY: String(stats.ctime.getFullYear()).slice(2),
    MM: String(stats.ctime.getMonth() + 1).padStart(2, '0'),
    DD: String(stats.ctime.getDate()).padStart(2, '0'),
    HH: String(stats.ctime.getHours()).padStart(2, '0'),
    mm: String(stats.ctime.getMinutes()).padStart(2, '0'),
    ss: String(stats.ctime.getSeconds()).padStart(2, '0'),
    SS: String(stats.ctime.getMilliseconds()).padStart(3, '0').slice(0, 2),
    SSS: String(stats.ctime.getMilliseconds()).padStart(3, '0'),
  }
}

class Location {
  constructor({ name, path, rule, rules }) {
    this.name = name.trim()
    this.rules = parseRules(rules || [rule])
    this.path = normalize(path.replace('[homedir]', homedir()))
  }

  async find() {
    const [files, err] = await go(fs.promises.readdir(this.path, 'utf8'))
    if (err) return []

    const parsed = await Promise.all(
      files.map(async (p) => {
        for (const rule of this.rules) {
          const m = rule.exec(p)
          if (!m) continue

          const path = join(this.path, p)
          const groups = { ...(await getFileCreatedAt(path)), ...m.groups }

          return {
            filename: p,
            name: this.name,
            path,

            ...groups,
            YY: groups.YY || groups.YYYY.slice(2),
            YYYY: groups.YYYY || '20' + groups.YY,
            SS: groups.SS || (groups.SSS && groups.SSS.slice(0, 2)) || '00',
            SSS: groups.SSS || (groups.SS && groups.SS + '0') || '000',
          }
        }
      })
    )

    return parsed.filter((v) => v)
  }
}

export default function find(source) {
  return new Location(source).find()
}
