import fs from 'fs'
import { homedir } from 'os'
import { normalize, join } from 'path'

const list = ['YYYY', 'YY', 'MM', 'DD', 'HH', 'mm', 'ss', 'SS', 'SSS']

function parseRule (rule) {
  const regex = list.reduce((str, k) =>
    str.replace(`[${k}]`, `(?<${k}>${'\\d'.repeat(k.length)})`), rule)

  return new RegExp(regex.replace('.', '\\.'))
}

class Location {
  constructor ({ name, rule, path }) {
    this.name = name.trim()
    this.rule = parseRule(rule)
    this.path = normalize(path.replace('[homedir]', homedir()))
  }

  async find () {
    const files = await fs.promises.readdir(this.path, 'utf8')
    const parsed = files.map(p => {
      const m = this.rule.exec(p)
      if (!m) return null

      const g = m.groups
      return {
        filename: p,
        path: join(this.path, p),
        name: this.name,

        ...g,
        YY: g.YY || g.YYYY.slice(2),
        YYYY: g.YYYY || '20'.concat(g.YY)
      }
    })

    return parsed.filter(v => v)
  }
}

export default function find (source) {
  return new Location(source).find()
}