const { resolve } = require('path/posix')

const getDeps = () => {
  try {
    const pkg = require(resolve(process.cwd(), 'package.json'))
    const { dependencies, devDependencies } = pkg
    return Array.prototype.concat([], Object.keys(dependencies), Object.keys(devDependencies))
  } catch (err) {
    console.log(`ERROR: you must excute VFT in project root directory.`)
    process.exit(-1)
  }
}

const fromNodeModules = (filePath, modules) => {
  return !!modules.find(moduleName => {
    new RegExp(`^${moduleName}/*`).test(filePath)
  })
}

module.exports = {
  getDeps,
  fromNodeModules
}
