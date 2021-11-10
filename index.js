#!/usr/bin/env node

const { program } = require('commander')
const { completeDotVueExtension } = require('./complete.js')
const { resolve } = require('path/posix')
const glob = require('glob')
const { getDeps, fromNodeModules } = require('path/deps.js')

program.version(require('./package.json').version)

program
  .option('-d, --dir <dir>', 'directory to resolve', '.')
program.parse(process.argv)

let { dir } = program.opts()

console.log(`scanning ${dir}`)

if (dir) {
  dir = resolve(process.cwd(), dir)
  completeRecusively(dir)
}

function completeRecusively(dir) {
  const deps = getDeps()
  glob(`${dir}/**/*.vue`, (err, files) => {
    if (err) {
      console.log(`ERROR: failed to read directory ${dir}`, err)
      process.exit(-1)
    }
    files = files.filter(filePath => !filePath.includes('node_modules'))
    const total = files.length
    let failed = 0
    files.forEach(filePath => {
      try {
        if (fromNodeModules(filePath, deps)) {
          console.log(`INFO: file from node_modules ${filePath}`)
          return
        }
        completeDotVueExtension(filePath)
      } catch (err) {
        failed++
        console.log(`${filePath} convert error`)
        console.log(err)
      }
    })

    console.log(`convert complete: ${failed} / ${total}`)
  })
}
