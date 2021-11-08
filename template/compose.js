const toSFCTemplate = require('vue-sfc-descriptor-to-string')

const toTemplate = (descriptor) => {
  return toSFCTemplate(descriptor)
}

module.exports = {
  toTemplate
}
