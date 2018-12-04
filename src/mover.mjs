import mv from 'mv'
import { join } from 'path'

export default async function move (rc, res) {
  const p = Object.entries(res).reduce((str, [k, v]) =>
    str.replace(`[${k}]`, v), rc.target.rule)

  const dstDir = join(rc.target.path, p)
  const dst = join(dstDir, res.filename)

  await mv(res.path, dst)
  console.log('moved', res.path, 'to', dst)
}