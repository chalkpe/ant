import { join } from 'path'
import move from 'move-file'

export default async function move ({ target }, res) {
  const dst = join(target.path, p, res.filename)
  const p = Object.entries(res)
    .reduce((r, [k, v]) => r.replace(`[${k}]`, v), target.rule)

  await move(res.path, dst)
  console.log('moved', res.path, 'to', dst)
}