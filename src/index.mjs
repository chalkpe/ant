import load from './loader.mjs'
import find from './finder.mjs'
import move from './mover.mjs'

async function main () {
  const rc = await load()
  const found = await Promise.all(rc.sources.map(find))

  for (let list of found) {
    for (let item of list) await move(rc, item)
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => console.error(err))
