#!/usr/bin/env node

const { program } = require('commander')
const { completeDotVueExtension } = require('./main.js')
const { resolve } = require('path/posix')
const glob = require('glob')

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
  glob(`${dir}/**/*.vue`, (err, files) => {
    files = files.filter(filePath => !filePath.includes('node_modules'))
    const total = files.length
    let failed = 0
    if (err) {
      console.log(err)
    }
    files.forEach(filePath => {
      try {
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
