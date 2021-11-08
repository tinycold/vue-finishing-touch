const { parse } = require('recast')
const babel7 = require('recast/parsers/babel')

const toAST = (script) => {
  const ast = parse(script, {
    parser: babel7
  })
  return ast
}

module.exports = {
  toAST
}
