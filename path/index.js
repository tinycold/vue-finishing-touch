const { resolve } = require('path/posix')
const { accessSync } = require('fs')
const isEmpty = require('lodash/isEmpty')

const CONFIG_PATH = resolve(process.cwd(), 'jsconfig.json')

const pathMapping = {}
let basePath = resolve(process.cwd())
try {
  accessSync(CONFIG_PATH)
  const config = require(CONFIG_PATH).compilerOptions
  basePath = resolve(basePath, config.baseUrl)
  Object.keys(config.paths).forEach(prefix => {
    // TODO: fit multiple paths
    pathMapping[prefix.replace('*', '')] = config.paths[prefix][0].replace('*', '')
  })
  console.log(pathMapping)
} catch(err) {
  console.log(err)
}

const getRealPath = path => {
  // path: @/components/foo
  Object.keys(pathMapping).forEach(prefix => {
    if (path.indexOf(prefix) > -1) {
      return path.replace(prefix, resolve(basePath, pathMapping[prefix]))
    }
  })
  return path
}

module.exports = {
  getRealPath
}
