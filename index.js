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
  resolveDir(dir)
}

function resolveDir(dir) {
  console.log(dir)
  glob(`${dir}/**/*.vue`, (err, files) => {
    if (err) {
      console.log(err)
    }
    console.log(`scanning ${files}`)
    files.forEach(filePath => completeDotVueExtension(filePath))
  })
}
