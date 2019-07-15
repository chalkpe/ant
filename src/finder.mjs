import fs from 'fs'
import { homedir } from 'os'
import { normalize, join } from 'path'

const list = ['YYYY', 'YY', 'MM', 'DD', 'HH', 'mm', 'ss', 'SS', 'SSS']

function parseRules (rules) {
  return rules.map(rule => {
    const regex = list.reduce((str, k) =>
      str.replace(`[${k}]`, `(?<${k}>${'\\d'.repeat(k.length)})`), rule)

    return new RegExp(regex.replace('.', '\\.'))
  })
}

class Location {
  constructor ({ name, path, rule, rules }) {
    this.name = name.trim()
    this.rules = parseRules(rules || [rule])
    this.path = normalize(path.replace('[homedir]', homedir()))
  }

  async find () {
    const files = await fs.promises.readdir(this.path, 'utf8')
    const parsed = files.map(p => {
      for (const rule of this.rules) {
        const m = rule.exec(p)
        if (m) return {
          filename: p,
          name: this.name,
          path: join(this.path, p),

          ...m.groups,
          YY: m.groups.YY || m.groups.YYYY.slice(2),
          YYYY: m.groups.YYYY || '20' + m.groups.YY,
          SS: m.groups.SS || m.groups.SSS.slice(0, 2),
          SSS: m.groups.SSS || m.groups.SS + '0',
        }
      }
    })

    return parsed.filter(v => v)
  }
}

export default function find (source) {
  return new Location(source).find()
}