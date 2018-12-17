import { join } from 'path'
import mv from 'move-file'

export default async function move ({ target }, res) {
  const p = Object.entries(res)
    .reduce((r, [k, v]) => r.replace(`[${k}]`, v), target.rule)

  const dst = join(target.path, p, res.filename)

  await mv(res.path, dst)
  console.log('moved', res.path, 'to', dst)
}