const { readFileSync, writeFileSync } = require('fs')
const { resolve, extname } = require('path/posix')
const { parseComponent } = require('vue-template-compiler')
const { parse, print } = require('recast')
const { visit } = require('ast-types')
const esprimaHarmony = require('esprima-harmony')
const toSFCTemplate = require('vue-sfc-descriptor-to-string')
const babelParser = require('@babel/parser')

function completeDotVueExtension(filePath) {
  // read file
  let componentNames = []
  const originTemplate = readFileSync(filePath, { encoding: 'utf-8' })

  // compile => descriptor
  const descriptor = parseComponent(originTemplate)
  if (!descriptor.script) {
    console.error(`file: ${filePath} don't have script`)
    return
  }
  // convert descriptor.script to ast
  const ast = parse(descriptor.script.content, {
    parser: {
      parse(source) {
        return babelParser.parse(source, {
          sourceType: 'module'
        })
      }
    }
  })
  // traverse ast to find component
  visit(ast, {
    visitObjectExpression(path) {
      const { properties } = path.node
      const compsProperty = properties.find((p) => p.key.name === 'components')
      if (compsProperty) {
        componentNames = compsProperty.value.properties.map((p) => p.key.name)
      }
      this.traverse(path)
    }
  })
  if (componentNames.length === 0) {
    return
  }
  // traverse ast to add .vue extension by component name
  visit(ast, {
    visitImportDeclaration(path) {
      // const componentSource = path.node.source.value + '.vue'
      const isVueCompImportDeclaration = path.node.specifiers?.find(spec => componentNames.includes(spec.local.name))
      try {
        // accessSync(resolve(BASE_PATH, componentSource))
        if (isVueCompImportDeclaration && extname(path.node.source.value).toLowerCase() !== '.vue') {
          path.node.source.value += '.vue'
        }
      } catch (err) {
        console.log(`Error: file ${componentSource} cannot access`, err)
      }
      this.traverse(path)
    }
  })
  // generate code
  const target = print(ast)
  // compose descriptor
  descriptor.script.content = target.code
  const destTemplate = toSFCTemplate(descriptor)
  // write file
  writeFileSync(resolve(__dirname, filePath), destTemplate, { encoding: 'utf-8' })
  console.log('done, starting next file...')
}

module.exports = {
  completeDotVueExtension
}
