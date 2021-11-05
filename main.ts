import { accessSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path/posix'
import { parseComponent } from 'vue-template-compiler'
import { parse, print } from 'recast'
import { visit } from 'ast-types'
const toSFCTemplate = require('vue-sfc-descriptor-to-string')

// read file
let componentNames: string[] = []
const filePath = 'test/mock/BaseTemplate.vue'
const originTemplate = readFileSync(resolve(__dirname, filePath), { encoding: 'utf-8' })

// compile => descriptor
const descriptor = parseComponent(originTemplate)
if (!descriptor.script) {
  console.error('Error: No script found.')
  process.exit(-1)
}
// convert descriptor.script to ast
const ast = parse(descriptor.script.content)
// traverse ast to find component
visit(ast, {
  visitObjectExpression(path) {
    const { properties } =path.node
    const compsProperty: any = properties.find((p: any) => p.key.name === 'components')
    if (compsProperty) {
      componentNames = compsProperty.value.properties.map((p: any) => p.key.name)
    }
    this.traverse(path)
  },
  visitObjectProperty(path) {
    /* BUG: ast-types lib cannot traverse object property */
    this.traverse(path)
  }
})
if (componentNames.length === 0) {
  process.exit(-1)
}
// traverse ast to add .vue extension by component name
visit(ast, {
  visitImportDeclaration(path) {
    const componentSource = path.node.source.value + '.vue'
    const isVueCompImportDeclaration = path.node.specifiers?.filter(spec => componentNames.includes(spec.local!.name))
    try {
      accessSync(componentSource)
      if (isVueCompImportDeclaration) {
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
