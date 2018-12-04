import glob from 'fast-glob'
import inquirer from 'inquirer'

import load from './config'

async function main () {
  console.log(await load())
}

main()
  .then(() => process.exit(0))
  .catch(err => console.error(err))