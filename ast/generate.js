const { print } = require('recast')

const generate = (ast) => {
    const target = print(ast)
    return target
}

module.exports = {
  generate
}
