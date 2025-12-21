import find from './finder.mjs'
import load from './loader.mjs'
import move from './mover.mjs'

async function main() {
  const rc = await load()
  const found = await Promise.all(rc.sources.map(find))

  for (const list of found) {
    for (const item of list) await move(rc, item)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err))
