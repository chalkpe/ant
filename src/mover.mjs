import { join } from 'path'
import { moveFile } from 'move-file'

export default async function move ({ target }, res) {
  const p = Object.entries(res)
    .reduce((r, [k, v]) => r.replace(`[${k}]`, v), target.rule)

  const dst = join(target.path, p, res.filename)

  await moveFile(res.path, dst)
  console.log('moved', res.path, 'to', dst)
}