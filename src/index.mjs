import load from './loader'
import find from './finder'
import move from './mover'

async function main () {
  const rc = await load()
  const found = await Promise.all(rc.sources.map(find))

  for (let list of found) {
    await Promise.all(list.map(item => move(rc, item)))
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => console.error(err))