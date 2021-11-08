const { parseComponent } = require('vue-template-compiler')

const toDescriptor = (template) => {
  const descriptor = parseComponent(template)
  return descriptor
}

module.exports = {
  toDescriptor
}
