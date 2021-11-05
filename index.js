const { readdir } = require('fs')
const { program } = require('commander')
const { completeDotVueExtension } = require('./main.js')
const { resolve } = require('path/posix')
const glob = require('glob')

// program.version(require('./package.json').version)

// program
//   .option('-d, --dir <dir>', 'directory to resolve')
//   .option('-f, --file <file>', 'single file to resolve')
// program.parse(process.argv)

// const { dir, file } = program.opts()

// if (dir) {

//   process.exit(0)
// }

// if (file) {
//   process.exit(0)
// }


function resolveDir(dir) {
  glob(dir + '/**/*.vue', (err, files) => {
    if (err) {
      console.log(err)
    }
    files.forEach(filePath => completeDotVueExtension(filePath))
  })
}

resolveDir(resolve(process.cwd(), 'admin'))
