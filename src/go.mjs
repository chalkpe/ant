export default function go(v) {
  if (v instanceof Function) {
    return go(
      new Promise((resolve, reject) => {
        try {
          resolve(v())
        } catch (err) {
          reject(err)
        }
      })
    )
  }

  return Promise.resolve(v)
    .then((res) => [res, undefined])
    .catch((err) => [undefined, err || new Error('¯\\_(ツ)_/¯')])
}
