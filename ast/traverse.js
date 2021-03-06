const { extname } = require('path/posix')
const { visit } = require('ast-types')

const traverse = (ast) => {
  let componentNames = []

  visit(ast, {
    visitObjectExpression(path) {
      const { properties } = path.node
      const compsProperty = properties.find((p) => p.type === 'ObjectProperty' && p.key.name === 'components')
      if (compsProperty?.value.properties?.length > 0) {
        componentNames = compsProperty.value.properties
          ?.map((p) => {
            let name
            if (p.value.type === 'Identifier') {
              name = p.value.name
            } else if (p.value.type === 'MemberExpression') {
              name = p.value.object.name
            }
            return name
          })
          .filter(p => p)
        // stop traverse once components property found
        return false
      }
      this.traverse(path)
    }
  })
  if (componentNames.length === 0) {
    return
  }
  /* traverse ast to add .vue extension by component name */
  visit(ast, {
    visitImportDeclaration(path) {
      const isVueCompImportDeclaration = path.node.specifiers?.find(spec => componentNames.includes(spec.local.name))
      if (isVueCompImportDeclaration && extname(path.node.source.value).toLowerCase() !== '.vue') {
        path.node.source.value += '.vue'
      }
      this.traverse(path)
    }
  })
  return ast
}

module.exports = {
  traverse
}
