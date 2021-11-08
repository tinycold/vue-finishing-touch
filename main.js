const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path/posix')
const { toDescriptor } = require('./template/compile')
const { toTemplate } = require('./template/compose')
const { toAST } = require('./ast/convert')
const { traverse } = require('./ast/traverse')
const { generate } = require('./ast/generate')

function completeDotVueExtension(filePath) {
  const originTemplate = readFileSync(filePath, { encoding: 'utf-8' })
  const descriptor = toDescriptor(originTemplate)
  const ast = toAST(descriptor.script.content)
  traverse(ast)
  const target = generate(ast)
  descriptor.script.content = target.code
  const destTemplate = toTemplate(descriptor)
  writeFileSync(resolve(__dirname, filePath), destTemplate, { encoding: 'utf-8' })
  console.log('done, starting next file...')
}

module.exports = {
  completeDotVueExtension
}
