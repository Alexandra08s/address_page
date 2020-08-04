const fs = require('fs-extra')

async function prepare() {
  await fs
    .copy('./dist/', '../../../public/__address/')
    .catch(err => {
      console.error(err)
    })
}

prepare()
